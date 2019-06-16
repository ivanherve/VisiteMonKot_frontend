import React, { Component } from 'react';
import { Modal, ListGroup, Card, Form, Row, Col, Button } from 'react-bootstrap';
import $ from 'jquery';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import { DateRangePicker, SingleDatePicker } from 'react-dates';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { apiUrl } from '../../router';
import swal from 'sweetalert';

export default class DatesVisit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dates: [],
            oneDate: null,
            manyDates: null,
            odTypeDate: 0,
            mdTypeDate: 0,
            ndTypeDate: 0,
            startdate: null,
            enddate: null,
            starttime: null,
            endtime: null,
        }
    }

    componentDidUpdate(p, s) {
        console.log(this.props.dates);
        if (this.props.dates !== p.dates) {
            this.setState({ dates: this.props.dates })
        }
    }

    newDateVisit = (id, sdate, edate, stime, etime) => {
        let data = new FormData();
        data.append('accomodation_id', id);
        data.append('start_date', sdate);
        data.append('end_date', edate);
        data.append('start_time', stime);
        data.append('end_time', etime);
        fetch(`${apiUrl}adddatevisit`, {
            method: 'post',
            headers: {
                api_token: JSON.parse(sessionStorage.getItem('userData')).token.api_token
            },
            body: data
        }).then(response => response.json())
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
    }

    updateDatesVisit = (strd, endd, strt, endt, id) => {
        let data = new FormData();
        data.append('start_date', strd);
        data.append('end_date', endd);
        data.append('start_time', strt);
        data.append('end_time', endt);
        data.append('id_visit', id);
        fetch(`${apiUrl}updatedatevisit`, {
            method: 'post',
            headers: {
                api_token: JSON.parse(sessionStorage.getItem('userData')).token.api_token
            },
            body: data
        }).then(response => response.json())
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
    }

    displayNew = (length) => {
        $("#new").slideToggle();
        //this.setState({ ndTypeDate: 0 });
        for (let index = 0; index < length; index++) {
            $(`#dd${index}`).hide(500);
        }
    }

    details = (id, length, end_date = null) => {

        $('#new').hide(500);
        $(`#dd${id}`).slideToggle();

        if (end_date) {
            // Many Dates
            this.setState({ mdTypeDate: 1 })
        } else {
            // One Date
            this.setState({ odTypeDate: 0 })
        }

        for (let index = 0; index < length; index++) {
            if (index !== id) {
                $(`#dd${index}`).hide(500);
            }
        }

    }

    render() {
        let dv = this.state.dates;
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.hide}
                centered
                size='lg'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Les dates de visites</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button
                        style={{ width: '100%' }}
                        variant='outline-success'
                        onClick={() => this.displayNew(dv.length)}
                    >
                        <FontAwesomeIcon icon={["fas", "plus"]} /> Ajouter une/des date(s) de visite
                    </Button>
                    <br />
                    <br />
                    <div id="new" style={{ display: 'none', color: '#000' }}>
                        <NewDates
                            start_date={this.state.startdate}
                            end_date={this.state.enddate}
                            start_time={this.state.starttime}
                            end_time={this.state.endtime}
                            setZero={() => this.setState({ ndTypeDate: 0 })}
                            setOne={() => this.setState({ ndTypeDate: 1 })}
                            setTwo={() => this.setState({ ndTypeDate: 2 })}
                            setStartDate={(e) => this.setState({ startdate: e.target.value })}
                            setEndDate={(e) => this.setState({ enddate: e.target.value })}
                            setStartTime={(e) => this.setState({ starttime: e.target.value })}
                            setEndTime={(e) => this.setState({ endtime: e.target.value })}
                            thestate={this.state.ndTypeDate}
                            variant='light'
                            addDates={() => {/*
                                console.log(
                                    {
                                        start_date: $("#nStartDate").val(),
                                        end_date: $("#nEndDate").val() ? $("#nEndDate").val() : this.state.ndTypeDate === 2 ? 'noe' : $("#nStartDate").val(),
                                        start_time: $("#nStartTime").val(),
                                        end_time: $("#nEndTime").val(),
                                    }
                                )*/
                                this.newDateVisit(
                                    this.props.dates[0].accomodation_id,
                                    this.state.startdate,
                                    $("#nEndDate").val() ? $("#nEndDate").val() : this.state.ndTypeDate === 2 ? 'noe' : $("#nStartDate").val(),
                                    this.state.starttime,
                                    $("#nEndTime").val()
                                )
                            }
                            }
                        />
                    </div>
                    <hr />
                    <br />
                    <ListGroup>
                        {
                            dv.map(d =>
                                !d.end_date || d.start_date === d.end_date
                                    ?
                                    <div key={dv.indexOf(d)}>
                                        <ListGroup.Item
                                            onClick={() => this.details(dv.indexOf(d), dv.length)}
                                            action
                                            variant={!d.end_date ? 'warning' : 'info'}
                                        >
                                            Le <strong>{moment(d.start_date).format('LL')}</strong>
                                            <br />
                                            De {d.start_time.slice(0, 5)} à {d.end_time.slice(0, 5)}
                                        </ListGroup.Item>
                                        <div id={`dd${dv.indexOf(d)}`} style={{ display: 'none', color: '#000' }}>
                                            <OneDate
                                                start_date={d.start_date}
                                                start_time={d.start_time}
                                                end_time={d.end_time}
                                                setZero={() => this.setState({ odTypeDate: 0 })}
                                                setOne={() => this.setState({ odTypeDate: 1 })}
                                                thestate={this.state.odTypeDate}
                                                variant='light'
                                                id={dv.indexOf(d)}
                                                click={() => this.updateDatesVisit(
                                                    $(`#oostd${dv.indexOf(d)}`).val() ? $(`#oostd${dv.indexOf(d)}`).val() : $(`#omstd${dv.indexOf(d)}`).val(),
                                                    $(`#omed${dv.indexOf(d)}`).val() ? $(`#omed${dv.indexOf(d)}`).val() : $(`#oostd${dv.indexOf(d)}`).val(),
                                                    $(`#omstt${dv.indexOf(d)}`).val() ? $(`#omstt${dv.indexOf(d)}`).val() : $(`#oostt${dv.indexOf(d)}`).val(),
                                                    $(`#omet${dv.indexOf(d)}`).val() ? $(`#omet${dv.indexOf(d)}`).val() : $(`#ooet${dv.indexOf(d)}`).val(),
                                                    d.iddate_visit
                                                )}
                                                click2={() => this.updateDatesVisit(
                                                    $(`#oostd${dv.indexOf(d)}`).val() ? $(`#oostd${dv.indexOf(d)}`).val() : $(`#omstd${dv.indexOf(d)}`).val(),
                                                    null,
                                                    $(`#omstt${dv.indexOf(d)}`).val() ? $(`#omstt${dv.indexOf(d)}`).val() : $(`#oostt${dv.indexOf(d)}`).val(),
                                                    $(`#omet${dv.indexOf(d)}`).val() ? $(`#omet${dv.indexOf(d)}`).val() : $(`#ooet${dv.indexOf(d)}`).val(),
                                                    d.iddate_visit
                                                )}
                                            />
                                        </div>
                                    </div>
                                    :
                                    <div key={dv.indexOf(d)}>
                                        <ListGroup.Item
                                            onClick={() => this.details(dv.indexOf(d), dv.length, d.end_date)}
                                            action
                                            variant='success'
                                        >
                                            Entre le <strong>{moment(d.start_date).format('LL')}</strong> et le <strong>{moment(d.end_date).format('LL')}</strong>
                                            <br />
                                            De {d.start_time.slice(0, 5)} à {d.end_time.slice(0, 5)}
                                        </ListGroup.Item>
                                        <div id={`dd${dv.indexOf(d)}`} style={{ display: 'none', color: '#000' }}>
                                            <ManyDates
                                                start_date={d.start_date}
                                                end_date={d.end_date}
                                                start_time={d.start_time}
                                                end_time={d.end_time}
                                                setZero={() => this.setState({ mdTypeDate: 0 })}
                                                setOne={() => this.setState({ mdTypeDate: 1 })}
                                                thestate={this.state.mdTypeDate}
                                                variant='light'
                                                id={dv.indexOf(d)}
                                                click={() => this.updateDatesVisit(
                                                    $(`#mostd${dv.indexOf(d)}`).val() ? $(`#mostd${dv.indexOf(d)}`).val() : $(`#mmstd${dv.indexOf(d)}`).val(),
                                                    $(`#mmed${dv.indexOf(d)}`).val() ? $(`#mmed${dv.indexOf(d)}`).val() : $(`#mostd${dv.indexOf(d)}`).val(),
                                                    $(`#mmstt${dv.indexOf(d)}`).val() ? $(`#mmstt${dv.indexOf(d)}`).val() : $(`#mostt${dv.indexOf(d)}`).val(),
                                                    $(`#mmet${dv.indexOf(d)}`).val() ? $(`#mmet${dv.indexOf(d)}`).val() : $(`#moet${dv.indexOf(d)}`).val(),
                                                    d.iddate_visit
                                                )}
                                            />
                                        </div>
                                    </div>

                            )
                        }
                    </ListGroup>
                </Modal.Body>
            </Modal>
        )
    }
}

const OneDate = ({ start_date, start_time, end_time, setZero, setOne, thestate, variant, id, click, click2 }) => {
    return (
        <Card bg={variant}>
            <Card.Body>
                <Card.Title><h5>Modifier</h5></Card.Title>
                <Form.Check checked={thestate === 0} custom inline type='radio' label='Une seule date' id={`chk${id}1`} name={`chk${id}`} onChange={setZero} />
                <Form.Check custom inline type='radio' label='Plusieurs dates' id={`chk${id}2`} name={`chk${id}`} onChange={setOne} />
                <br />
                <br />
                {
                    thestate === 0 || thestate === 2
                        ?
                        <div>
                            <Form.Group as={Row}>
                                <Col xs='8'>
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control id={`oostd${id}`} type='date' defaultValue={start_date} min={moment().format('YYYY-MM-DD')} />
                                </Col>
                                <Col xs='2'>
                                    <Form.Label>Heure Début</Form.Label>
                                    <Form.Control id={`oostt${id}`} type='time' defaultValue={start_time} />
                                </Col>
                                <Col xs='2'>
                                    <Form.Label>Heure Fin</Form.Label>
                                    <Form.Control id={`ooet${id}`} type='time' defaultValue={end_time} />
                                </Col>
                            </Form.Group>
                            {
                                variant === 'warning'
                                    ?
                                    <Form.Group as={Row}>
                                        <Col xs='12'>
                                            <Button variant='outline-secondary' onClick={click}>Modifier</Button>
                                        </Col>
                                    </Form.Group>
                                    :
                                    <Form.Group as={Row}>
                                        <Col xs='6'>
                                            <Button style={{ width: '100%' }} variant='outline-secondary' onClick={click}>
                                                Commence et termine à cette date
                                            </Button>
                                        </Col>
                                        <Col xs='6'>
                                            <Button style={{ width: '100%' }} variant='outline-secondary' onClick={click2}>
                                                A partir de cette date jusqu'à location
                                            </Button>
                                        </Col>
                                    </Form.Group>
                            }

                        </div>
                        :
                        <div>
                            <Form.Group as={Row}>
                                <Col xs='4'>
                                    <Form.Label>Date Début</Form.Label>
                                    <Form.Control id={`omstd${id}`} type='date' defaultValue={start_date} min={moment().format('YYYY-MM-DD')} />
                                </Col>
                                <Col xs='4'>
                                    <Form.Label>Date Fin</Form.Label>
                                    <Form.Control id={`omed${id}`} type='date' min={moment().format('YYYY-MM-DD') > start_date ? moment().format('YYYY-MM-DD') : start_date} />
                                </Col>
                                <Col xs='2'>
                                    <Form.Label>Heure Début</Form.Label>
                                    <Form.Control id={`omstt${id}`} type='time' defaultValue={start_time} />
                                </Col>
                                <Col xs='2'>
                                    <Form.Label>Heure Fin</Form.Label>
                                    <Form.Control id={`omet${id}`} type='time' defaultValue={end_time} min={start_time} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Col xs='12'>
                                    <Form.Label></Form.Label>
                                    <Button variant='outline-secondary' onClick={click}>Modifier</Button>
                                </Col>
                            </Form.Group>
                        </div>
                }
            </Card.Body>
        </Card>
    )
}

const ManyDates = ({ start_date, end_date, start_time, end_time, setZero, setOne, setTwo, thestate, variant, id, click }) => {
    return (
        <Card bg={variant}>
            <Card.Body>
                <Card.Title><h5>Modifier</h5></Card.Title>
                <Form.Check custom inline type='radio' label='Une seule date' id={`chk${id}1`} name={`chk${id}`} onChange={setZero} />
                <Form.Check checked={thestate === 1} custom inline type='radio' label='Plusieurs dates' id={`chk${id}2`} name={`chk${id}`} onChange={setOne} />
                <br />
                <br />
                {
                    thestate === 0
                        ?
                        <div>
                            <Form.Group as={Row}>
                                <Col xs='8'>
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control id={`mostd${id}`} type='date' defaultValue={start_date} min={moment().format('YYYY-MM-DD')} />
                                </Col>
                                <Col xs='2'>
                                    <Form.Label>Heure Début</Form.Label>
                                    <Form.Control id={`mostt${id}`} type='time' defaultValue={start_time} />
                                </Col>
                                <Col xs='2'>
                                    <Form.Label>Heure Fin</Form.Label>
                                    <Form.Control id={`moet${id}`} type='time' defaultValue={end_time} min={start_time} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Col xs='12'>
                                    <Form.Label></Form.Label>
                                    <Button variant='outline-secondary' onClick={click}>Modifier</Button>
                                </Col>
                            </Form.Group>
                        </div>
                        :
                        <div>
                            <Form.Group as={Row}>
                                <Col xs='4'>
                                    <Form.Label>Date Début</Form.Label>
                                    <Form.Control id={`mmstd${id}`} type='date' defaultValue={start_date} min={moment().format('YYYY-MM-DD')} />
                                </Col>
                                <Col xs='4'>
                                    <Form.Label>Date Fin</Form.Label>
                                    <Form.Control id={`mmed${id}`} type='date' defaultValue={end_date} min={moment().format('YYYY-MM-DD') > start_date ? moment().format('YYYY-MM-DD') : start_date} />
                                </Col>
                                <Col xs='2'>
                                    <Form.Label>Heure Début</Form.Label>
                                    <Form.Control id={`mmstt${id}`} type='time' defaultValue={start_time} />
                                </Col>
                                <Col xs='2'>
                                    <Form.Label>Heure Fin</Form.Label>
                                    <Form.Control id={`mmet${id}`} type='time' defaultValue={end_time} min={start_time} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Col xs='12'>
                                    <Form.Label></Form.Label>
                                    <Button variant='outline-secondary' onClick={click}>Modifier</Button>
                                </Col>
                            </Form.Group>
                        </div>
                }
            </Card.Body>
        </Card>
    )
}

const NewDates = ({ start_date, end_date, start_time, end_time, setZero, setOne, setTwo, thestate, variant, addDates, setStartDate, setEndDate, setStartTime, setEndTime }) => {
    return (
        <Card bg={variant}>
            <Card.Body>
                <Card.Title><h5>Ajouter</h5></Card.Title>
                <p id='alert' style={{ fontSize: '0.7rem', color: 'red' }}>{thestate === 2 ? 'Choisir cette option supprimera vos autres dates de visites!' : ''}</p>
                <Form.Check checked={thestate === 0} custom inline type='radio' label='Une seule date' id='chkN1' name={`chkN`} onChange={setZero} />
                <Form.Check checked={thestate === 1} custom inline type='radio' label='Plusieurs dates' id='chkN2' name={`chkN`} onChange={setOne} />
                <Form.Check checked={thestate === 2} custom inline type='radio' label="A partir de cette date jusqu'à location" id='chkN3' name={`chkN`} onChange={setTwo} />
                <br />
                <br />
                {
                    thestate === 0 || thestate === 2
                        ?
                        <div>
                            <Form.Group as={Row}>
                                <Col xs='8'>
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control id='nStartDate' type='date' min={moment().format('YYYY-MM-DD')} onChange={setStartDate} />
                                </Col>
                                <Col xs='2'>
                                    <Form.Label>Heure Début</Form.Label>
                                    <Form.Control id='nStartTime' type='time' onChange={setStartTime} />
                                </Col>
                                <Col xs='2'>
                                    <Form.Label>Heure Fin</Form.Label>
                                    <Form.Control id='nEndTime' type='time' min={start_time} onChange={setEndTime} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Col xs='12'>
                                    <Form.Label></Form.Label>
                                    <Button variant='success' onClick={addDates}>AJOUTER</Button>
                                </Col>
                            </Form.Group>
                        </div>
                        :
                        <div>
                            <Form.Group as={Row}>
                                <Col xs='4'>
                                    <Form.Label>Date Début</Form.Label>
                                    <Form.Control id='nStartDate' type='date' min={moment().format('YYYY-MM-DD')} onChange={setStartDate} />
                                </Col>
                                <Col xs='4'>
                                    <Form.Label>Date Fin</Form.Label>
                                    <Form.Control id='nEndDate' type='date' min={start_date} onChange={setEndDate} />
                                </Col>
                                <Col xs='2'>
                                    <Form.Label>Heure Début</Form.Label>
                                    <Form.Control id='nStartTime' type='time' onChange={setStartTime} />
                                </Col>
                                <Col xs='2'>
                                    <Form.Label>Heure Fin</Form.Label>
                                    <Form.Control id='nEndTime' type='time' min={start_time} onChange={setEndTime} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Col xs='12'>
                                    <Form.Label></Form.Label>
                                    <Button variant='success' onClick={addDates}>AJOUTER</Button>
                                </Col>
                            </Form.Group>
                        </div>
                }
            </Card.Body>
        </Card>
    )
}