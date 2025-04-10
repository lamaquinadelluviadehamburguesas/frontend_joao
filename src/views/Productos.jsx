// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';
import TablaProductos from '../components/producto/TablaProductos';
import ModalRegistroProducto from '../components/producto/ModalRegistroProducto';
import CuadroBusquedas from '../components/busuqedas/CuadroBusquedas';
import { Container, Button, Alert } from "react-bootstrap";

// Declaración del componente Productos
const Productos = () => {
  // Estados para manejar los datos, carga y errores
  const [listaProductos, setListaProductos] = useState([]); // Almacena todos los datos de la API
  const [productosFiltrados, setProductosFiltrados] = useState([]); // Almacena los productos filtrados
  const [cargando, setCargando] = useState(true);       // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null);   // Maneja errores de la petición
  const [listaCategorias, setListaCategorias] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState(""); // Almacena el texto de búsqueda
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: '',
    descripcion_producto: '',
    id_categoria: '',
    precio_unitario: '',
    stock: '',
    imagen: ''
  });

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los productos');
      }
      const datos = await respuesta.json();
      setListaProductos(datos);      // Actualiza el estado con todos los datos
      setProductosFiltrados(datos);  // Inicializa los productos filtrados con todos los datos
      setCargando(false);           // Indica que la carga terminó
    } catch (error) {
      setErrorCarga(error.message); // Guarda el mensaje de error
      setCargando(false);          // Termina la carga aunque haya error
    }
  };

  // Lógica de obtención de datos con useEffect
  useEffect(() => {
    obtenerProductos();
    obtenerCategorias();           // Ejecuta las funciones al montar el componente
  }, []);

  // Obtener categorías para el dropdown
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

  // Función de búsqueda
  const handleBuscar = (texto) => {
    setTextoBusqueda(texto);
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

      await obtenerProductos(); // Refresca la lista completa
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
      handleBuscar(textoBusqueda); // Mantiene el filtro después de agregar
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Renderizado de la vista
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

        {/* Pasa los estados como props al componente TablaProductos */}
        <TablaProductos
          Productos={productosFiltrados} // Usamos los productos filtrados
          cargando={cargando}
          error={errorCarga}
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

// Exportación del componente
export default Productos;