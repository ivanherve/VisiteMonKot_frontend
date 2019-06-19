import React, {Component} from 'react';
import { Modal, Button } from 'react-bootstrap';

export default class SignOutAUser extends Component {
    render(){
        return(
            <Modal show={this.props.show} onHide={this.props.hide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Déconnecter {this.props.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Etes-vous sûr de vouloir déconnecter <strong>{this.props.name}</strong> ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-warning'>DECONNECTER</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}