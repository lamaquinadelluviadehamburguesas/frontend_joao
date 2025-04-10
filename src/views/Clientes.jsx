import React, { useState, useEffect } from 'react';
import TablaClientes from '../components/clientes/TablaClientes';
import ModalRegistroCliente from '../components/clientes/ModalRegistroCliente';
import CuadroBusquedas from '../components/busuqedas/CuadroBusquedas';
import { Container, Button, Alert } from "react-bootstrap";

const Clientes = () => {
  const [listaClientes, setListaClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const estadoInicialCliente = { id_cliente: null, primer_nombre: '', celular: '', cedula: '' };
  const [nuevoCliente, setNuevoCliente] = useState(estadoInicialCliente);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const obtenerClientes = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/clientes');
      if (!respuesta.ok) throw new Error('Error al cargar los clientes');
      const datos = await respuesta.json();
      setListaClientes(datos);
      setClientesFiltrados(datos);
    } catch (error) {
      setErrorCarga(error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  const handleBuscar = (texto) => {
    setTextoBusqueda(texto); // Aseguramos que el estado se actualice
    if (texto.trim() === "") {
      setClientesFiltrados(listaClientes);
    } else {
      const filtrados = listaClientes.filter(cliente =>
        cliente.primer_nombre.toLowerCase().includes(texto.toLowerCase()) ||
        cliente.celular.includes(texto) ||
        cliente.cedula.includes(texto)
      );
      setClientesFiltrados(filtrados);
    }
  };

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoCliente(prev => ({ ...prev, [name]: value }));
  };

  const agregarCliente = async () => {
    if (!nuevoCliente.primer_nombre || !nuevoCliente.celular || !nuevoCliente.cedula) {
      setErrorCarga("Todos los campos obligatorios deben completarse.");
      return;
    }
    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarcliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoCliente),
      });
      if (!respuesta.ok) throw new Error('Error al agregar el cliente');
      await obtenerClientes();
      setNuevoCliente(estadoInicialCliente);
      setMostrarModal(false);
      setErrorCarga(null);
      handleBuscar(textoBusqueda);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const eliminarCliente = async () => {
    if (!nuevoCliente.id_cliente) {
      setErrorCarga("Debe ingresar el ID del cliente para eliminar.");
      return;
    }
    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarcliente/${nuevoCliente.id_cliente}`, {
        method: 'DELETE',
      });
      if (!respuesta.ok) throw new Error('Error al eliminar el cliente');
      await obtenerClientes();
      setNuevoCliente(estadoInicialCliente);
      setMostrarModal(false);
      setErrorCarga(null);
      handleBuscar(textoBusqueda);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  return (
    <Container className="mt-5">
      <h4>Clientes</h4>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => setMostrarModal(true)}>
          Nuevo Cliente
        </Button>
        <CuadroBusquedas
          textoBusqueda={textoBusqueda}
          setTextoBusqueda={setTextoBusqueda}
          handleBuscar={handleBuscar}
          placeholder="Buscar por nombre, celular o cédula"
        />
      </div>

      {errorCarga && <Alert variant="danger" className="mt-3">{errorCarga}</Alert>}

      <TablaClientes clientes={clientesFiltrados} cargando={cargando} error={errorCarga} />

      <ModalRegistroCliente
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoCliente={nuevoCliente}
        manejarCambioInput={manejarCambioInput}
        agregarCliente={agregarCliente}
        eliminarCliente={eliminarCliente}
        errorCarga={errorCarga}
      />
    </Container>
  );
};

export default Clientes;