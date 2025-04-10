// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';
import TablaVentas from '../components/ventas/TablaVentas';
import CuadroBusquedas from '../components/busuqedas/CuadroBusquedas';
import { Container, Button, Alert } from "react-bootstrap";
// Si tienes un ModalRegistroVenta, descomenta la siguiente línea:
// import ModalRegistroVenta from '../components/ventas/ModalRegistroVenta';

// Declaración del componente Ventas
const Ventas = () => {
  // Estados para manejar los datos, carga y errores
  const [listaVentas, setListaVentas] = useState([]);     // Almacena todos los datos de la API
  const [ventasFiltradas, setVentasFiltradas] = useState([]); // Almacena las ventas filtradas
  const [cargando, setCargando] = useState(true);         // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null);     // Maneja errores de la petición
  const [textoBusqueda, setTextoBusqueda] = useState(""); // Almacena el texto de búsqueda
  const [mostrarModal, setMostrarModal] = useState(false); // Controla la visibilidad del modal

  // Lógica de obtención de datos con useEffect
  useEffect(() => {
    const obtenerVentas = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/ventas');
        if (!respuesta.ok) {
          throw new Error('Error al cargar las ventas');
        }
        const datos = await respuesta.json();
        setListaVentas(datos);      // Actualiza el estado con todos los datos
        setVentasFiltradas(datos);  // Inicializa las ventas filtradas con todos los datos
        setCargando(false);         // Indica que la carga terminó
      } catch (error) {
        setErrorCarga(error.message); // Guarda el mensaje de error
        setCargando(false);         // Termina la carga aunque haya error
      }
    };
    obtenerVentas();              // Ejecuta la función al montar el componente
  }, []);                         // Array vacío para que solo se ejecute una vez

  // Función de búsqueda
  const handleBuscar = (texto) => {
    setTextoBusqueda(texto);
    if (texto.trim() === "") {
      setVentasFiltradas(listaVentas);
    } else {
      const filtrados = listaVentas.filter(venta => 
        (venta.id_venta && venta.id_venta.toString().includes(texto)) ||
        (venta.cliente && venta.cliente.toLowerCase().includes(texto.toLowerCase())) ||
        (venta.fecha && venta.fecha.includes(texto))
      );
      setVentasFiltradas(filtrados);
    }
  };

  // Función para agregar una nueva venta (ejemplo básico)
  const agregarVenta = async (nuevaVenta) => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaVenta),
      });

      if (!respuesta.ok) throw new Error('Error al agregar la venta');

      // Refrescar la lista después de agregar
      const datosActualizados = await fetch('http://localhost:3000/api/ventas').then(res => res.json());
      setListaVentas(datosActualizados);
      setVentasFiltradas(datosActualizados);
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Ventas con Detalles</h4>

        <div className="d-flex justify-content-between mb-3">
          <Button 
            variant="primary" 
            onClick={() => setMostrarModal(true)}
          >
            Nueva Venta
          </Button>
          <CuadroBusquedas 
            textoBusqueda={textoBusqueda}
            setTextoBusqueda={setTextoBusqueda}
            handleBuscar={handleBuscar}
            placeholder="Buscar por ID, cliente o fecha"
          />
        </div>

        {errorCarga && <Alert variant="danger" className="mt-3">{errorCarga}</Alert>}

        {/* Pasa los estados como props al componente TablaVentas */}
        <TablaVentas
          ventas={ventasFiltradas}
          cargando={cargando}
          error={errorCarga}
        />

        {/* Si tienes un ModalRegistroVenta, descomenta y ajusta las props necesarias */}
        {/* 
        <ModalRegistroVenta
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          agregarVenta={agregarVenta}
          errorCarga={errorCarga}
        />
        */}
      </Container>
    </>
  );
};

// Exportación del componente
export default Ventas;