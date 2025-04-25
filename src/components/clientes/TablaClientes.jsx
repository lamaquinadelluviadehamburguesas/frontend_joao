import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../ordenamiento/Paginacion';

const TablaClientes = ({ 
  clientes, 
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
        <div>Cargando clientes...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : clientes.length === 0 ? (
        <div>No hay clientes para mostrar.</div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>id_cliente</th>
                <th>primer_nombre</th>
                <th>segundo_nombre</th>
                <th>primer_apellido</th>
                <th>segundo_apellido</th>
                <th>celular</th>
                <th>direccion</th>
                <th>cedula</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id_cliente}>
                  <td>{cliente.id_cliente}</td>
                  <td>{cliente.primer_nombre}</td>
                  <td>{cliente.segundo_nombre}</td>
                  <td>{cliente.primer_apellido}</td>
                  <td>{cliente.segundo_apellido}</td>
                  <td>{cliente.celular}</td>
                  <td>{cliente.direccion}</td>
                  <td>{cliente.cedula}</td>
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

export default TablaClientes;