import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../ordenamiento/Paginacion';

const TablaCategorias = ({ 
  categorias,
  cargando,
  error,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual
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
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id_categoria}>
                  <td>{categoria.id_categoria}</td>
                  <td>{categoria.nombre_categoria}</td>
                  <td>{categoria.descripcion_categoria}</td>
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