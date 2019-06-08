import React, { Component } from 'react';
import { Modal, ListGroup } from 'react-bootstrap';
import moment from 'moment';

export default class VisitorsList extends Component {
    render() {
        return (
            <Modal show={this.props.showModal} onHide={this.props.onHide} centered>
                <Modal.Header>Liste des visiteurs</Modal.Header>
                <ListGroup>
                    {
                        this.props.visitors.length > 0
                            ?
                            this.props.visitors.map(v =>
                                <ListGroup.Item action>
                                    <h5>{v.names}</h5>
                                    Le {moment(v.visitDate).format('dddd Do MMMM YYYY')}
                                </ListGroup.Item>
                            )
                            :
                            <ListGroup.Item style={{display: 'flex', justifyContent: 'center'}}>
                                Il n'y a pas encore de visiteurs
                            </ListGroup.Item>
                    }
                </ListGroup>
            </Modal>
        )
    }
}