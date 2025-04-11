import React, { useState, useEffect } from 'react';
import TablaCompras from '../components/compras/TablaCompras';
import ModalRegistroCompra from '../components/compras/ModalRegistroCompra';
import CuadroBusquedas from '../components/busuqedas/CuadroBusquedas';
import { Container, Button, Alert } from 'react-bootstrap';

const Compras = () => {
  const [listaCompras, setListaCompras] = useState([]);
  const [comprasFiltradas, setComprasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [nuevaCompra, setNuevaCompra] = useState({
    fecha_compra: '',
    empleado: '',
    producto: '',
    cantidad: 1,
    precio_unitario: 0,
  });
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 3;

  useEffect(() => {
    const obtenerCompras = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/compras');
        if (!respuesta.ok) {
          throw new Error('Error al cargar las compras');
        }
        const datos = await respuesta.json();
        setListaCompras(datos);
        setComprasFiltradas(datos);
        setCargando(false);
      } catch (error) {
        setErrorCarga(error.message);
        setCargando(false);
      }
    };
    obtenerCompras();
  }, []);

  const handleBuscar = (texto) => {
    setTextoBusqueda(texto);
    establecerPaginaActual(1);
    
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

  const manejarCambioInput = (event) => {
    const { name, value } = event.target;
    setNuevaCompra((prevCompra) => ({
      ...prevCompra,
      [name]: value,
    }));
  };

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
      handleBuscar(textoBusqueda);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const comprasPaginadas = comprasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <>
      <Container className="mt-5">
        <h4>Compras con Detalles</h4>

        <div className="d-flex justify-content-between mb-3">
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

        <TablaCompras
          compras={comprasPaginadas}
          cargando={cargando}
          error={errorCarga}
          totalElementos={comprasFiltradas.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
        />

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