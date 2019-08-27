import React, { Component } from 'react';
import { Modal, Form, Row, Button, Col, Card, ListGroup } from 'react-bootstrap';
import moment from 'moment';
import $ from 'jquery';
import { apiUrl } from '../../router';
import swal from 'sweetalert';

export default class VisitorChangeDate extends Component {

    constructor() {
        super();
        this.state = {
            dates: [],
            targetDates: [],
            chosenDate: '',
            chosenTime: '',
        }
    }

    componentDidUpdate(p, s) {
        if (this.props.dates !== p.dates) {
            console.log(this.props.dates);
            this.setState({
                dates: this.props.dates,
                targetDates: this.props.dates[0]
            })
        }
    }

    updateVisit = (aid) => {
        let data = new FormData();
        if (this.state.chosenDate === '') {
            swal({
                text: 'Avez-vous choisi une date ?'
            })
        }
        if (this.state.chosenTime === '') {
            swal({
                text: 'Avez-vous choisi une heure ?'
            })
        }
        data.append('aid', aid);
        data.append('date', `${this.state.chosenDate} ${this.state.chosenTime}:00`);
        fetch(`${apiUrl}updatemyvisit`, {
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
                        text: res.response[0],
                        icon: 'warning',
                        dangerMode: true
                    })
                } else {
                    swal({
                        text: res.response,
                        icon: 'success',
                        button: {
                            closeModal: false,
                        }
                    })
                        .then(() => {
                            this.props.hide();
                            window.location.reload();
                        });
                }
            })
            .catch(err => {
                swal("Oups!", "Une erreur est survenue", "error");
                console.log(err)
            })
    }

    displayCard = (id, length) => {
        this.setState({ targetDates: this.props.dates[id] })
        for (let index = 0; index < length; index++) {
            if (index === id) {
                $(`#${index}`).slideToggle(250);
            } else {
                $(`#${index}`).hide(250);
            }
        }

    }

    render() {
        let date = moment(this.props.date).format('YYYY-MM-DD');
        let time = moment(this.props.date).format('HH:mm');
        let limitdate = this.state.targetDates;
        let dates = this.state.dates.sort(
            (a, b) => (a.start_date > b.start_date) ? 1 : ((b.start_date > a.start_date) ? -1 : 0)
        );
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.hide}
                centered
                size='lg'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Changer de date de visite</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Disponibilité</h5>
                    <ListGroup>
                        {
                            dates.map(d =>
                                <div key={dates.indexOf(d)}>
                                    <ListGroup.Item
                                        action
                                        variant={d.end_date ? d.end_date !== d.start_date ? 'success' : 'info' : 'info'}
                                        onClick={() => this.displayCard(dates.indexOf(d), dates.length)}
                                        disabled={d.end_date ? d.end_date < moment().format('YYYY-MM-DD') : false}
                                    >
                                        {
                                            d.end_date
                                                ?
                                                d.end_date !== d.start_date
                                                    ?
                                                    <div>
                                                        Entre le <strong>{moment(d.start_date).format('LL')}</strong> et le <strong>{moment(d.end_date).format('LL')}</strong>
                                                        <br />
                                                        <i>De <strong>{d.start_time.slice(0, 5)}</strong> à <strong>{d.end_time.slice(0, 5)}</strong></i>
                                                    </div>
                                                    :
                                                    <div>
                                                        Le <strong>{moment(d.start_date).format('LL')}</strong>
                                                        <br />
                                                        <i>De <strong>{d.start_time.slice(0, 5)}</strong> à <strong>{d.end_time.slice(0, 5)}</strong></i>
                                                    </div>
                                                :
                                                <div>
                                                    Le <strong>{moment(d.start_date).format('LL')}</strong>
                                                    <br />
                                                    <i>De <strong>{d.start_time.slice(0, 5)}</strong> à <strong>{d.end_time.slice(0, 5)}</strong></i>
                                                </div>
                                        }
                                    </ListGroup.Item>
                                    <PickADate
                                        id={dates.indexOf(d)}
                                        date={date}
                                        limitdate={limitdate}
                                        time={time}
                                        click={() => this.updateVisit(d.accomodation_id)}
                                        chooseDate={(e) => this.setState({ chosenDate: e.target.value })}
                                        chooseTime={(e) => this.setState({ chosenTime: e.target.value })}
                                    />
                                </div>
                            )
                        }
                    </ListGroup>
                </Modal.Body>
            </Modal>
        )
    }
}

const PickADate = ({ id, date, limitdate, time, click, chooseDate, chooseTime }) => {
    return (
        <Card id={id} style={{ display: 'none' }}>
            <Card.Body>
                <Form.Group as={Row}>
                    <Col xs='8'>
                        <Form.Label>Date</Form.Label>
                        <Form.Control type='date' defaultValue={date} min={limitdate.start_date > moment().format('YYYY-MM-DD') ? limitdate.start_date : moment().format('YYYY-MM-DD')} max={limitdate.end_date} onChange={chooseDate} />
                    </Col>
                    <Col xs='4'>
                        <Form.Label>Heure</Form.Label>
                        <Form.Control type='time' defaultValue={time} min={limitdate.start_time} max={limitdate.end_time} onChange={chooseTime} />
                    </Col>
                </Form.Group>
                <Button variant='outline-secondary' onClick={click}>Modifier</Button>
            </Card.Body>
        </Card>
    )
}