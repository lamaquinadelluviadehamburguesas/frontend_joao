import React, { useState, useEffect } from 'react';
import TablaProductos from '../components/producto/TablaProductos';
import ModalRegistroProducto from '../components/producto/ModalRegistroProducto';
import CuadroBusquedas from '../components/busuqedas/CuadroBusquedas';
import { Container, Button, Alert } from "react-bootstrap";

const Productos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [listaCategorias, setListaCategorias] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: '',
    descripcion_producto: '',
    id_categoria: '',
    precio_unitario: '',
    stock: '',
    imagen: ''
  });
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 3;

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los productos');
      }
      const datos = await respuesta.json();
      setListaProductos(datos);
      setProductosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  const obtenerCategorias = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/categorias');
      if (!respuesta.ok) throw new Error('Error al cargar las categorías');
      const datos = await respuesta.json();
      setListaCategorias(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerCategorias();
  }, []);

  const handleBuscar = (texto) => {
    setTextoBusqueda(texto);
    establecerPaginaActual(1);
    
    if (texto.trim() === "") {
      setProductosFiltrados(listaProductos);
    } else {
      const filtrados = listaProductos.filter(producto => 
        (producto.nombre_producto && producto.nombre_producto.toLowerCase().includes(texto.toLowerCase())) ||
        (producto.descripcion_producto && producto.descripcion_producto.toLowerCase().includes(texto.toLowerCase())) ||
        (producto.id_categoria && producto.id_categoria.toString().includes(texto))
      );
      setProductosFiltrados(filtrados);
    }
  };

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarProducto = async () => {
    if (!nuevoProducto.nombre_producto || !nuevoProducto.id_categoria || 
        !nuevoProducto.precio_unitario || !nuevoProducto.stock) {
      setErrorCarga("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarproductos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoProducto),
      });

      if (!respuesta.ok) throw new Error('Error al agregar el producto');

      await obtenerProductos();
      setNuevoProducto({
        nombre_producto: '',
        descripcion_producto: '',
        id_categoria: '',
        precio_unitario: '',
        stock: '',
        imagen: ''
      });
      setMostrarModal(false);
      setErrorCarga(null);
      handleBuscar(textoBusqueda);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <>
      <Container className="mt-5">
        <h4>Productos</h4>

        <div className="d-flex justify-content-between mb-3">
          <Button 
            variant="primary" 
            onClick={() => setMostrarModal(true)}
          >
            Nuevo Producto
          </Button>
          <CuadroBusquedas 
            textoBusqueda={textoBusqueda}
            setTextoBusqueda={setTextoBusqueda}
            handleBuscar={handleBuscar}
            placeholder="Buscar por nombre, descripción o categoría"
          />
        </div>

        {errorCarga && <Alert variant="danger" className="mt-3">{errorCarga}</Alert>}

        <TablaProductos
          productos={productosPaginados}
          cargando={cargando}
          error={errorCarga}
          totalElementos={productosFiltrados.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
        />

        <ModalRegistroProducto
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoProducto={nuevoProducto}
          manejarCambioInput={manejarCambioInput}
          agregarProducto={agregarProducto}
          errorCarga={errorCarga}
          categorias={listaCategorias}
        />
      </Container>
    </>
  );
};

export default Productos;