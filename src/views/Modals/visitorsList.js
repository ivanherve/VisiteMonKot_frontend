import React, { Component } from 'react';
import { Modal, ListGroup, Row, Col, Button, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { apiUrl } from '../../router';
import swal from 'sweetalert';

export default class VisitorsList extends Component {

    approveVisit = (visiter_id, aid) => {
        let data = new FormData();
        data.append('visiter_id', visiter_id);
        data.append('aid', aid);
        fetch(`${apiUrl}confvisit`, {
            method: 'post',
            headers: {
                'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token
            },
            body: data
        })
            .then(response => response.json())
            .then(res => {
                if (res.status === 'error') {
                    swal({
                        icon: 'warning',
                        text: res.response[0]
                    });
                    console.log(res.response)
                } else {
                    swal({
                        icon: 'success',
                        text: res.response
                    }).then(() => {
                        this.props.onHide();
                        window.location.reload();
                    })
                }
            })
            .catch(err => {
                swal("Oups!", "Une erreur est survenue", "error");
                console.log(err)
            })
    }

    refuseVisit = (visiter_id, aid) => {
        let data = new FormData();
        data.append('visiter_id', visiter_id);
        data.append('aid', aid);
        swal({
            title: 'Êtes-vous sûr ?',
            text: "Cette action est irréversible",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
            .then((willRejected) => {
                if (willRejected) {
                    fetch(`${apiUrl}refusevisit`, {
                        method: 'post',
                        headers: {
                            'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token
                        },
                        body: data
                    })
                        .then(response => response.json())
                        .then(res => {
                            if (res.status === 'error') {
                                swal({
                                    icon: 'warning',
                                    text: res.response[0]
                                });
                                console.log(res.response)
                            } else {
                                swal({
                                    icon: 'success',
                                    text: res.response,
                                }).then(() => {
                                    this.props.onHide();
                                    window.location.reload();
                                })
                            }
                        })
                        .catch(err => {
                            swal("Oups!", "Une erreur est survenue", "error");
                            console.log(err)
                        })
                }
            })
            .catch(err => {
                swal("Oups!", "Une erreur est survenue", "error");
                console.log(err)
            })

    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.visitors !== prevProps.visitors){

        }
    }
    

    render() {
        return (
            <Modal show={this.props.showModal} onHide={this.props.onHide} centered>
                <Modal.Header>
                    <Modal.Title>Liste des visiteurs</Modal.Title>
                </Modal.Header>
                <ListGroup variant='flush'>
                    {
                        this.props.visitors.length > 0
                            ?
                            this.props.visitors.map(v =>
                                <ListGroup.Item key={this.props.visitors.indexOf(v)}>
                                    <Row>
                                        <Col xs='8'>
                                            <h5>{v.names}</h5>
                                            <div>Le {moment(v.visitDate).format('dddd Do MMMM YYYY à H:mm')}</div>
                                            {
                                                v.approved
                                                    ?
                                                    <Badge variant='success'>Accepté</Badge>
                                                    :
                                                    <Badge variant='warning'>A confimer</Badge>
                                            }
                                        </Col>
                                        <Col xs='2'>
                                            {
                                                v.approved
                                                    ?
                                                    null
                                                    :
                                                    <OverlayTrigger
                                                        placement='top'
                                                        overlay={
                                                            <Tooltip>
                                                                Accepter
                                                            </Tooltip>
                                                        }
                                                    >

                                                        <Button
                                                            style={styles.button}
                                                            variant='outline-success'
                                                            onClick={() => this.approveVisit(v.user_user_id, v.Accomodation_accomodation_id)}
                                                        >
                                                            <FontAwesomeIcon icon={["fas", "check"]} />
                                                        </Button>
                                                    </OverlayTrigger>
                                            }
                                        </Col>
                                        <Col xs='2'>
                                            <OverlayTrigger
                                                placement='top'
                                                overlay={
                                                    <Tooltip>
                                                        Refuser
                                                    </Tooltip>
                                                }
                                            >
                                                <Button
                                                    style={styles.button}
                                                    variant='outline-danger'
                                                    onClick={() => this.refuseVisit(v.user_user_id, v.Accomodation_accomodation_id)}
                                                >
                                                    <FontAwesomeIcon icon={["fas", "times"]} />
                                                </Button>
                                            </OverlayTrigger>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )
                            :
                            <ListGroup.Item style={{ display: 'flex', justifyContent: 'center' }}>
                                Il n'y a pas encore de visiteurs
                            </ListGroup.Item>
                    }
                </ListGroup>
            </Modal>
        )
    }
}

const styles = {
    button: {
        width: '100%'
    }
}