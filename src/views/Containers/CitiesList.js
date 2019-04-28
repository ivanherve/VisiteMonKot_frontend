import React from 'react'
import { ListGroup } from 'react-bootstrap';

const CitiesList = (props) => {
  const options = props.results.map(r => (
    <ListGroup.Item action key={props.results.indexOf(r)} style={{backgroundRepeat: 'no-repeat'}} onClick={props.choose}>
      {r.nom}
    </ListGroup.Item>
  ))
  return <ListGroup>{props.results.length > 0 ? options : null }</ListGroup>
}

export default CitiesList