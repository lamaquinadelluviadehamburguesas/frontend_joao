import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../ordenamiento/Paginacion';

const TablaProductos = ({ 
  productos, 
  cargando, 
  error, 
  totalElementos, 
  elementosPorPagina, 
  paginaActual, 
  establecerPaginaActual 
}) => {
  if (cargando) {
    return <div>Cargando productos...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (productos.length === 0) {
    return <div>No se encontraron productos.</div>;
  }

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>id_producto</th>
            <th>nombre_producto</th>
            <th>descripcion</th>
            <th>categoria</th>
            <th>precio_unitario</th>
            <th>stock</th>
            <th>imagen</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id_producto}>
              <td>{producto.id_producto}</td>
              <td>{producto.nombre_producto}</td>
              <td>{producto.descripcion_producto}</td>
              <td>{producto.id_categoria}</td>
              <td>{producto.precio_unitario}</td>
              <td>{producto.stock}</td>
              <td>{producto.imagen}</td>
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
  );
};

export default TablaProductos;