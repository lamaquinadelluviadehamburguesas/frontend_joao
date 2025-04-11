import React, { useState, useEffect } from 'react';
import TablaVentas from '../components/ventas/TablaVentas';
import CuadroBusquedas from '../components/busuqedas/CuadroBusquedas';
import { Container, Button, Alert } from "react-bootstrap";
// Si tienes un ModalRegistroVenta, descomenta la siguiente línea:
// import ModalRegistroVenta from '../components/ventas/ModalRegistroVenta';

const Ventas = () => {
  const [listaVentas, setListaVentas] = useState([]);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 3;

  useEffect(() => {
    const obtenerVentas = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/ventas');
        if (!respuesta.ok) {
          throw new Error('Error al cargar las ventas');
        }
        const datos = await respuesta.json();
        setListaVentas(datos);
        setVentasFiltradas(datos);
        setCargando(false);
      } catch (error) {
        setErrorCarga(error.message);
        setCargando(false);
      }
    };
    obtenerVentas();
  }, []);

  const handleBuscar = (texto) => {
    setTextoBusqueda(texto);
    establecerPaginaActual(1);
    
    if (texto.trim() === "") {
      setVentasFiltradas(listaVentas);
    } else {
      const filtrados = listaVentas.filter(venta => 
        (venta.id_venta && venta.id_venta.toString().includes(texto)) ||
        (venta.nombre_cliente && venta.nombre_cliente.toLowerCase().includes(texto.toLowerCase())) ||
        (venta.fecha_venta && venta.fecha_venta.includes(texto))
      );
      setVentasFiltradas(filtrados);
    }
  };

  const agregarVenta = async (nuevaVenta) => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaVenta),
      });

      if (!respuesta.ok) throw new Error('Error al agregar la venta');

      const datosActualizados = await fetch('http://localhost:3000/api/ventas').then(res => res.json());
      setListaVentas(datosActualizados);
      setVentasFiltradas(datosActualizados);
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const ventasPaginadas = ventasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

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

        <TablaVentas
          ventas={ventasPaginadas}
          cargando={cargando}
          error={errorCarga}
          totalElementos={ventasFiltradas.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
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

export default Ventas;