import React, { useState, useEffect } from 'react';
import TablaCategorias from '../components/categorias/TablaCategorias';
import ModalRegistroCategoria from '../components/categorias/ModalRegistroCategoria';
import CuadroBusquedas from '../components/busuqedas/CuadroBusquedas';
import { Container, Button, Row, Col } from "react-bootstrap";
import ModalEliminacionCategoria from '../components/categorias/ModalEliminacionCategoria';
import ModalActualizacionCategoria from '../components/categorias/ModalActualizacionCategoria';

const Categorias = () => {
  const [listaCategorias, setListaCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: '',
    descripcion_categoria: ''
  });
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 3;
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [categoriaEditada, setCategoriaEditada] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerCategorias = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/categorias');
      if (!respuesta.ok) {
        throw new Error('Error al cargar las categorías');
      }
      const datos = await respuesta.json();
      setListaCategorias(datos);
      setCategoriasFiltradas(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarCategoria = async () => {
    if (!nuevaCategoria.nombre_categoria || !nuevaCategoria.descripcion_categoria) {
      setErrorCarga("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarcategoria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaCategoria),
      });

      if (!respuesta.ok) {
        throw new Error('Error al agregar la categoría');
      }

      await obtenerCategorias();
      setNuevaCategoria({ nombre_categoria: '', descripcion_categoria: '' });
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    establecerPaginaActual(1);
    
    const filtradas = listaCategorias.filter(
      (categoria) =>
        categoria.nombre_categoria.toLowerCase().includes(texto) ||
        categoria.descripcion_categoria.toLowerCase().includes(texto)
    );
    setCategoriasFiltradas(filtradas);
  };

  const categoriasPaginadas = categoriasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const eliminarCategoria = async () => {
    if (!categoriaAEliminar) return;
  
    try {
      const respuesta = await fetch(`/api/eliminarcategoria/${categoriaAEliminar.id_categoria}`, {
        method: 'DELETE',
      });
  
      if (!respuesta.ok) {
        throw new Error('Error al eliminar la categoría');
      }
  
      await obtenerCategorias(); // Refresca la lista
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1); // Regresa a la primera página
      setCategoriaAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };
   
  const abrirModalEliminacion = (categoria) => {
    setCategoriaAEliminar(categoria);
    setMostrarModalEliminacion(true);
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setCategoriaEditada(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const actualizarCategoria = async () => {
    if (!categoriaEditada?.nombre_categoria || !categoriaEditada?.descripcion_categoria) {
      setErrorCarga("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarcategoria/${categoriaEditada.id_categoria}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_categoria: categoriaEditada.nombre_categoria,
          descripcion_categoria: categoriaEditada.descripcion_categoria,
        }),
      });

      if (!respuesta.ok) {
        throw new Error('Error al actualizar la categoría');
      }

      await obtenerCategorias();
      setMostrarModalEdicion(false);
      setCategoriaEditada(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEdicion = (categoria) => {
    setCategoriaEditada(categoria);
    setMostrarModalEdicion(true);
  };

  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Categorías</h4>

        <Row>
          <Col lg={2} md={4} sm={4} xs={5}>
            <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
              Nueva Categoría
            </Button>
          </Col>
          <Col lg={5} md={8} sm={8} xs={7}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>
        </Row>

        <br/><br/>

        <TablaCategorias 
          categorias={categoriasPaginadas} 
          cargando={cargando} 
          error={errorCarga} 
          totalElementos={categoriasFiltradas.length} // Ajustado
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          abrirModalEliminacion={abrirModalEliminacion}
          abrirModalEdicion={abrirModalEdicion}
        />
        <ModalRegistroCategoria
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevaCategoria={nuevaCategoria}
          manejarCambioInput={manejarCambioInput}
          agregarCategoria={agregarCategoria}
          errorCarga={errorCarga}
        />
        
        <ModalEliminacionCategoria
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarCategoria={eliminarCategoria}
        />

        <ModalActualizacionCategoria
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          categoriaEditada={categoriaEditada}
          manejarCambioInputEdicion={manejarCambioInputEdicion}
          actualizarCategoria={actualizarCategoria}
          errorCarga={errorCarga}
        />

      </Container>
    </>
  );
};

export default Categorias;