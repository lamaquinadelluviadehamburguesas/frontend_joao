import React from 'react';
<<<<<<< HEAD
import { Table, Button } from 'react-bootstrap';
=======
import { Table } from 'react-bootstrap';
>>>>>>> ae8534a7bc98972a658763b397ff814dd9b0e404
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../ordenamiento/Paginacion';

const TablaCategorias = ({ 
  categorias,
  cargando,
  error,
  totalElementos,
  elementosPorPagina,
  paginaActual,
<<<<<<< HEAD
  establecerPaginaActual,
  abrirModalEliminacion,
  abrirModalEdicion
=======
  establecerPaginaActual
>>>>>>> ae8534a7bc98972a658763b397ff814dd9b0e404
}) => {
  return (
    <>
      {cargando ? (
        <div>Cargando categorías...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : categorias.length === 0 ? (
        <div>No hay categorías para mostrar.</div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID Categoría</th>
                <th>Nombre</th>
                <th>Descripción</th>
<<<<<<< HEAD
                <th>Acciones</th>
=======
>>>>>>> ae8534a7bc98972a658763b397ff814dd9b0e404
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id_categoria}>
                  <td>{categoria.id_categoria}</td>
                  <td>{categoria.nombre_categoria}</td>
                  <td>{categoria.descripcion_categoria}</td>
<<<<<<< HEAD
                  <td>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="me-2"
                      onClick={() => abrirModalEdicion(categoria)}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => abrirModalEliminacion(categoria)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
=======
>>>>>>> ae8534a7bc98972a658763b397ff814dd9b0e404
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginacion
            elementosPorPagina={elementosPorPagina}
            totalElementos={totalElementos}
            paginaActual={paginaActual}
            establecerPaginaActual={establecerPaginaActual}
          />
        </>
      )}
    </>
  );
};

export default TablaCategorias;