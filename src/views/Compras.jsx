import React, { useState, useEffect } from 'react';
import TablaCompras from '../components/compras/TablaCompras';
import ModalRegistroCompra from '../components/compras/ModalRegistroCompra';
import CuadroBusquedas from '../components/busuqedas/CuadroBusquedas';
import { Container, Button, Alert } from 'react-bootstrap';

const Compras = () => {
  // Estados para manejar los datos, carga, errores y la visibilidad del modal
  const [listaCompras, setListaCompras] = useState([]);  // Almacena todos los datos de la API
  const [comprasFiltradas, setComprasFiltradas] = useState([]); // Almacena las compras filtradas
  const [cargando, setCargando] = useState(true);        // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null);    // Maneja errores de la petición
  const [mostrarModal, setMostrarModal] = useState(false); // Controla la visibilidad del modal
  const [textoBusqueda, setTextoBusqueda] = useState(""); // Almacena el texto de búsqueda
  const [nuevaCompra, setNuevaCompra] = useState({
    fecha_compra: '',
    empleado: '',
    producto: '',
    cantidad: 1,
    precio_unitario: 0,
  }); // Estado para manejar los datos de la nueva compra

  // Lógica de obtención de datos con useEffect
  useEffect(() => {
    const obtenerCompras = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/compras');
        if (!respuesta.ok) {
          throw new Error('Error al cargar las compras');
        }
        const datos = await respuesta.json();
        setListaCompras(datos);      // Actualiza el estado con todos los datos
        setComprasFiltradas(datos);  // Inicializa las compras filtradas con todos los datos
        setCargando(false);          // Indica que la carga terminó
      } catch (error) {
        setErrorCarga(error.message); // Guarda el mensaje de error
        setCargando(false);          // Termina la carga aunque haya error
      }
    };
    obtenerCompras();              // Ejecuta la función al montar el componente
  }, []);

  // Función de búsqueda
  const handleBuscar = (texto) => {
    setTextoBusqueda(texto);
    if (texto.trim() === "") {
      setComprasFiltradas(listaCompras);
    } else {
      const filtrados = listaCompras.filter(compra => 
        (compra.fecha_compra && compra.fecha_compra.includes(texto)) ||
        (compra.empleado && compra.empleado.toLowerCase().includes(texto.toLowerCase())) ||
        (compra.producto && compra.producto.toLowerCase().includes(texto.toLowerCase()))
      );
      setComprasFiltradas(filtrados);
    }
  };

  // Maneja el cambio de los inputs en el formulario de nueva compra
  const manejarCambioInput = (event) => {
    const { name, value } = event.target;
    setNuevaCompra((prevCompra) => ({
      ...prevCompra,
      [name]: value,
    }));
  };

  // Maneja el registro de la compra
  const registrarCompra = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarcompra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaCompra),
      });

      if (!respuesta.ok) {
        throw new Error('Error al registrar la compra');
      }

      // Refrescar la lista completa desde la API
      const respuestaActualizada = await fetch('http://localhost:3000/api/compras');
      const datosActualizados = await respuestaActualizada.json();
      setListaCompras(datosActualizados);
      setComprasFiltradas(datosActualizados);
      setMostrarModal(false);
      setNuevaCompra({
        fecha_compra: '',
        empleado: '',
        producto: '',
        cantidad: 1,
        precio_unitario: 0,
      });
      setErrorCarga(null);
      handleBuscar(textoBusqueda); // Mantener el filtro después de registrar
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <h4>Compras con Detalles</h4>

        <div className="d-flex justify-content-between mb-3">
          {/* Botón para abrir el modal de registro de compra */}
          <Button 
            variant="primary" 
            onClick={() => setMostrarModal(true)}
          >
            Registrar Nueva Compra
          </Button>
          <CuadroBusquedas 
            textoBusqueda={textoBusqueda}
            setTextoBusqueda={setTextoBusqueda}
            handleBuscar={handleBuscar}
            placeholder="Buscar por fecha, empleado o producto"
          />
        </div>

        {errorCarga && <Alert variant="danger" className="mt-3">{errorCarga}</Alert>}

        {/* Tabla de compras */}
        <TablaCompras
          compras={comprasFiltradas} // Usamos las compras filtradas
          cargando={cargando}
          error={errorCarga}
        />

        {/* Modal para registrar una nueva compra */}
        <ModalRegistroCompra
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevaCompra={nuevaCompra}
          manejarCambioInput={manejarCambioInput}
          registrarCompra={registrarCompra}
          errorCarga={errorCarga}
        />
      </Container>
    </>
  );
};

export default Compras;