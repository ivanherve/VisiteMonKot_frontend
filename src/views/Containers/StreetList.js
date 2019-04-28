import React from 'react'
import { ListGroup } from 'react-bootstrap';

const StreetList = (props) => {
  const options = props.results.map(r => (
    <ListGroup.Item action key={props.results.indexOf(r)} style={{backgroundRepeat: 'no-repeat'}} onClick={props.choose}>
      {r.nom}
    </ListGroup.Item>
  ))
  return <ListGroup>{options}</ListGroup>
}

export default StreetList