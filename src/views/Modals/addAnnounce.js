import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import { DateRangePicker } from 'react-dates';
import { apiUrl } from '../../router';
import Axios from 'axios';

export default class AddAnnounce extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: null,
            endDate: null,
            focusedInput: null,
            cities: [],
            types: [],
            title: '',
            nbRoom: '',
            priceRent: '',
            priceCharges: '',
            beginingTime: '',
            endTime: '',
            description: '',
            hasWifi: 0,
            hasCarPark: 0,
            hasFurnitures: 0,
            cityName: '',
            type: '',
            surface: '',
            pictures: null,
        };
    }

    getTypes = () => {
        fetch(apiUrl + 'types')
            .then(response => response.json())
            .then(res => {
                if (res.status === 'error') {
                    alert(res.response[0]);
                    console.log(res.response)
                } else {
                    console.log(res.response);
                    this.setState({ types: res.response });
                    this.setState({ type: res.response[0].type })
                }
            })
    }

    getCities = () => {
        fetch(apiUrl + 'cities', {
            method: 'get',/*
            headers: {
                api_token: JSON.parse(sessionStorage.getItem('userData')).token.api_token
            }*/
        })
            .then(response => response.json())
            .then(res => {
                if (res.status === 'error') {
                    alert(res.response[0]);
                    console.log(res.response[1])
                } else {
                    console.log(res.response);
                    this.setState({ cities: res.response });
                    this.setState({ cityName: res.response[0].cityName })
                }
            })
    }

    addOneAnnounce = () => {
        let data = new FormData();
        data.append('title', this.state.title);
        data.append('nbRoom', this.state.nbRoom);
        data.append('priceRent', this.state.priceRent);
        data.append('priceCharges', this.state.priceCharges);
        data.append('BeginingTime', this.state.beginingTime);
        data.append('EndTime', this.state.endTime);
        data.append('Description', this.state.description);
        data.append('HasWifi', this.state.hasWifi);
        data.append('HasCarPark', this.state.hasCarPark);
        data.append('HasFurnitures', this.state.hasFurnitures);
        data.append('cityName', this.state.cityName);
        data.append('Type', this.state.type);
        data.append('Surface', this.state.surface);
        data.append('image', this.state.pictures);
        Axios({
            url: apiUrl + 'addadvertisments',
            method: 'post',
            headers: {
                api_token: JSON.parse(sessionStorage.getItem('userData')).token.api_token
            },
            data: data
        })
            //.then(response => response.json())
            .then(res => {
                if (res.status === 'error') {
                    alert(res.response[0]);
                    console.log(res.response)
                } else {
                    alert('Annonce ajouté')
                }
            }, err => {alert(err); console.log(this.state.pictures)})
    }

    componentDidMount() {
        this.getCities();
        this.getTypes();
    }

    render() {
        return (
            <Modal
                show={this.props.showModal}
                onHide={this.props.handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton bg="success">
                    <Modal.Title>Annoncer un logement</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflowY: 'auto' }}>
                    <Form>
                        <Form.Label>Nom du logement *</Form.Label>
                        <Form.Control placeholder="ex: Appartement 2 chambres" name="Title" type="text" required onChange={e => this.setState({ title: e.target.value })} />
                        <br />
                        <Form.Control placeholder="Nombre de chambre*" min="1" name="nbRoom" type="number" required onChange={e => this.setState({ nbRoom: e.target.value })} />
                        <br />
                        <Form.Control placeholder="Loyer €*" name="priceRent" min="0" type="number" required onChange={e => this.setState({ priceRent: e.target.value })} />
                        <br />
                        <Form.Control placeholder="Charges €*" name="priceCharges" min="0" type="number" required onChange={e => this.setState({ priceCharges: e.target.value })} />
                        <br />
                        <Form.Label>Date de début *</Form.Label>
                        <Form.Control name="BeginingTime" type="date" required onChange={e => this.setState({ beginingTime: e.target.value })} />
                        <br />
                        <Form.Label>Date de fin *</Form.Label>
                        <Form.Control name="EndTime" type="date" required onChange={e => this.setState({ endTime: e.target.value })} />
                        <br />
                        <div>
                            <Form.Check
                                custom
                                inline
                                checked={this.state.hasWifi === 0 ? false : true}
                                type="checkbox"
                                id="custom-checkbox1"
                                label="Y'a t-il du WiFi ?"
                                onChange={e => {
                                    if (this.state.hasWifi === 0) {
                                        this.setState({ hasWifi: 1 });
                                    } else {
                                        this.setState({ hasWifi: 0 });
                                    }
                                }}
                            />
                            <Form.Check
                                custom
                                inline
                                checked={this.state.hasFurnitures === 0 ? false : true}
                                type="checkbox"
                                id="custom-checkbox2"
                                label="Est-il meublé ?"
                                onChange={e => {
                                    if (this.state.hasFurnitures === 0) {
                                        this.setState({ hasFurnitures: 1 });
                                    } else {
                                        this.setState({ hasFurnitures: 0 });
                                    }
                                }}
                            />
                            <Form.Check
                                custom
                                inline
                                checked={this.state.hasCarPark === 0 ? false : true}
                                type="checkbox"
                                id="custom-checkbox3"
                                label="Y'a t-il un parking ?"
                                onChange={e => {
                                    if (this.state.hasCarPark === 0) {
                                        this.setState({ hasCarPark: 1 });
                                    } else {
                                        this.setState({ hasCarPark: 0 });
                                    }
                                }}
                            />
                        </div>
                        <br />
                        <Form.Control placeholder="Description *" name="Description" type="text" as="textarea" required onChange={e => this.setState({ description: e.target.value })} />
                        <br />
                        <Form.Label>Dans quelle ville ? *</Form.Label>
                        <Form.Control as="select" name="City" required onChange={e => console.log(e)}>
                            {
                                this.state.cities.map(city =>
                                    <option key={this.state.cities.indexOf(city)}>{city.cityName}</option>
                                )
                            }
                        </Form.Control>
                        <br />
                        <Form.Label>Dans quelle quartier ? *</Form.Label>
                        <Form.Control as="select" name="Neighborhood" onChange={e => console.log(e)}>
                            {
                                fakeNeighborhoods.map(nbh =>
                                    <option key={fakeNeighborhoods.indexOf(nbh)}>{nbh}</option>
                                )
                            }
                        </Form.Control>
                        <br />
                        <Form.Label>De quel type de logement s'agit-il ? *</Form.Label>
                        <Form.Control as="select" name="Type" required onChange={e => console.log(e.target.value)}>
                            {
                                this.state.types.map(type =>
                                    <option key={this.state.types.indexOf(type)}>{type.type}</option>
                                )
                            }
                        </Form.Control>
                        <br />
                        <Form.Label>Ajoutez quelques Photos *</Form.Label>
                        <input className="form-control" type="file" name="Pictures" onChange={e => this.setState({ pictures: e.target.files[0] })} required multiple />
                        <br />
                        <Form.Label>Date de visite *</Form.Label>
                        <br />
                        <DateRangePicker
                            startDateId="startDate"
                            endDateId="endDate"
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onDatesChange={({ startDate, endDate }) => { this.setState({ startDate, endDate }) }}
                            focusedInput={this.state.focusedInput}
                            onFocusChange={(focusedInput) => { this.setState({ focusedInput }) }}
                        />
                        <br />
                        <Form.Label>Surface *</Form.Label>
                        <br />
                        <Form.Control placeholder="Nombre de m2*" min="10" name="Surface" type="number" required onChange={e => this.setState({ surface: e.target.value })} />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={() => this.addOneAnnounce()}
                    >
                        Publier une annonce
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

const fakeNeighborhoods = [
    'nbh1',
    'nbh2',
    'nbh3',
    'nbh4',
    'nbh5',
    'nbh6',
    'nbh7',
]