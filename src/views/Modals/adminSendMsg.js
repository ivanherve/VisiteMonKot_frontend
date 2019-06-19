import React, {Component} from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

export default class AdminSendMsg extends Component {
    render(){
        return(
            <Modal show={this.props.show} onHide={this.props.hide} centered size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Envoyer un message</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control as='textarea' rows='5' style={styles.textfield} placeholder={`Cher ${this.props.name}, ...`} />
                </Modal.Body>
                <Modal.Footer>
                    <Button>ENVOYER</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

const styles = {
    textfield: {
        minHeight: '300px'
    }
}