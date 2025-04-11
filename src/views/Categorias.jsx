import React, { useState, useEffect } from 'react';
import TablaCategorias from '../components/categorias/TablaCategorias';
import ModalRegistroCategoria from '../components/categorias/ModalRegistroCategoria';
import CuadroBusquedas from '../components/busuqedas/CuadroBusquedas';
import { Container, Button, Row, Col } from "react-bootstrap";

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
        />
        <ModalRegistroCategoria
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevaCategoria={nuevaCategoria}
          manejarCambioInput={manejarCambioInput}
          agregarCategoria={agregarCategoria}
          errorCarga={errorCarga}
        />
      </Container>
    </>
  );
};

export default Categorias;