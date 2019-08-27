import React, { Component } from 'react';
import { Modal, Form, Button, Col, Row, ListGroup, OverlayTrigger, Popover } from 'react-bootstrap';
import moment from 'moment';
import { apiUrl } from '../../router';
import swal from '@sweetalert/with-react';
import $ from 'jquery';

export default class VisitAccomodation extends Component {
    constructor() {
        super();
        this.state = {
            dateVisit: '',
            timeVisit: '',
            datesVisit: [],
        }
    }

    componentDidUpdate(nextProps, nextState) {
        if (this.props.datesVisit !== nextProps.datesVisit) {
            this.setState({ datesVisit: this.props.datesVisit, dateVisit: this.props.datesVisit[0].start_date });
            console.log(this.props.datesVisit, this.state.datesVisit);
        }
    }

    visitAccomodation = (aid, date, time) => {
        let data = new FormData();
        data.append('aid', aid);
        data.append('date', date);
        data.append('time', time);
        fetch(apiUrl + 'visitaccomodation', {
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
                    });
                    console.log(res.response)
                } else {
                    swal({
                        text: `Votre demande de visite a bien été envoyée pour le \n ${moment(res.response).format('dddd Do MMMM YYYY à H:mm')}`,
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

    render() {
        let accomo = this.props.accomo;
        let datesVisit = this.state.datesVisit.sort((a, b) =>
            (a.start_date > b.start_date) ? 1 : ((b.start_date > a.start_date) ? -1 : 0)
        );
        let today = moment(Date()).format('YYYY-MM-Do');
        return (
            <Modal enforceFocus={false} show={this.props.show} onHide={this.props.hide} size='lg' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Visiter {accomo.Title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <strong>Choisir une date de visite</strong>
                    {
                        datesVisit.length > 0
                            ?
                            datesVisit.length === 1 && !datesVisit[0].end_date ?
                                <Form>
                                    <Form.Label>
                                        <i>A partir du: {moment(datesVisit[0].start_date).format('LL')} entre {datesVisit[0].start_time.slice(0, 5)} et {datesVisit[0].end_time.slice(0, 5)}</i> 
                                    </Form.Label>
                                    <Row>
                                        <Col xs='9'>
                                            <Form.Control name="dateVisit" type="date" min={datesVisit[0].start_date < today ? today : datesVisit[0].start_date} required onChange={e => this.setState({ dateVisit: e.target.value })} />
                                        </Col>
                                        <Col xs='3'>
                                            <Form.Control type='time' min={datesVisit[0].start_time} max={datesVisit[0].end_time} onChange={e => this.setState({ timeVisit: e.target.value })} />
                                        </Col>
                                    </Row>
                                </Form>
                                :
                                <ListGroup>
                                    {
                                        datesVisit.map(d =>
                                            d.start_date === d.end_date
                                                ?
                                                <OverlayTrigger key={datesVisit.indexOf(d)} trigger="click" placement="right" overlay={<Popover title='A quelle heure ?'><ChooseADate min={d.start_time.slice(0, 5)} max={d.end_time.slice(0, 5)} click={() => this.visitAccomodation(d.iddate_visit, d.start_date, $('#time1').val())} /></Popover>}>
                                                    <ListGroup.Item action disabled={d.start_date < moment().format().slice(0, 10)} variant='info' onClick={() => console.log(d.iddate_visit)}>
                                                        Le <strong>{moment(d.start_date).format('LL')}</strong> de <u><i>{d.start_time.slice(0, 5)}</i></u> à <u><i>{d.end_time.slice(0, 5)}</i></u>
                                                    </ListGroup.Item>
                                                </OverlayTrigger>
                                                :
                                                <OverlayTrigger key={datesVisit.indexOf(d)} trigger="click" placement="right" overlay={<Popover title='Quelle date et à quelle heure ?'><ChooseDates minDate={d.start_date} maxDate={d.end_date} minTime={d.start_time} maxTime={d.end_time} click={() => this.visitAccomodation(d.iddate_visit, $('#date').val(), $('#time2').val())} /></Popover>}>
                                                    <ListGroup.Item action disabled={d.end_date < moment().format().slice(0, 10)} variant='success' onClick={() => console.log(d.iddate_visit)}>
                                                        Entre le <strong>{moment(d.start_date).format('LL')}</strong> et le <strong>{moment(d.end_date).format('LL')}</strong> de <u><i>{d.start_time.slice(0, 5)}</i></u> à <u><i>{d.end_time.slice(0, 5)}</i></u>
                                                    </ListGroup.Item>
                                                </OverlayTrigger>
                                        )
                                    }
                                </ListGroup>
                            :
                            <div>Chargement ... </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    {
                        datesVisit.length === 1
                            ?
                            !datesVisit[0].end_date
                                ?
                                <Button variant='outline-success' onClick={() => this.visitAccomodation(datesVisit[0].iddate_visit, this.state.dateVisit, this.state.timeVisit)}>Visiter</Button>
                                :
                                null
                            :
                            null
                    }

                </Modal.Footer>
            </Modal>
        )
    }
}

const ChooseADate = ({ min, max, click }) => {
    return (
        <Form>
            <Form.Label>
                <p style={{ fontSize: '0.7rem' }}>entre <strong>{min}</strong> et <strong>{max}</strong></p>
            </Form.Label>
            <br />
            <Form.Control id='time1' type='time' min={min} max={max} />
            <br />
            <Button variant='success' onClick={click}>VISITER</Button>
        </Form>
    )
}

const ChooseDates = ({ minDate, maxDate, minTime, maxTime, click }) => {
    return (
        <Form>
            <Form.Label>
                <p style={{ fontSize: '0.7rem' }}>entre <strong>{minTime.slice(0, 5)}</strong> et <strong>{maxTime.slice(0, 5)}</strong></p>
            </Form.Label>
            <br />
            <Form.Control id='date' type='date' min={minDate} max={maxDate} />
            <br />
            <Form.Control id='time2' type='time' min={minTime} max={maxTime} />
            <br />
            <Button variant='success' onClick={click}>VISITER</Button>
        </Form>
    )
}