import React, { Component } from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import moment from 'moment';
import { apiUrl, API_URL_CP, API_URL_RUE } from '../../router';
import swal from 'sweetalert';
import CitiesList from '../Containers/CitiesList';
import Axios from 'axios';
import StreetList from '../Containers/StreetList';
import $ from 'jquery';

export default class EditAccomodation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            hasWifi: 0,
            hasCarPark: 0,
            hasFurnitures: 0,
            description: '',
            priceCharges: 0,
            priceRent: 0,
            cityName: '',
            query: '',
            cities: [],
            streetName: '',
            streets: [],
            addNumb: null,
            boxNumb: null,
        }
    }

    componentDidMount() {
        this.setState({
            title: this.props.adv.Title,
            hasWifi: this.props.adv.hasWifi,
            hasFurnitures: this.props.adv.hasFurnitures,
            hasCarPark: this.props.adv.hasCarPark,
            description: this.props.adv.description,
            priceCharges: this.props.adv.priceCharges,
            priceRent: this.props.adv.priceRent,
            cityName: this.props.adv.cityName
        });
        //this.setState({ streetName: this.props.adv.address.split(',')[1] });
        console.log(this.props.adv)
    }

    componentDidUpdate(nextProps) {
        if (this.props.adv.accomodation_id !== nextProps.adv.accomodation_id) {
            this.setState({
                title: this.props.adv.Title,
                hasWifi: this.props.adv.hasWifi,
                hasFurnitures: this.props.adv.hasFurnitures,
                hasCarPark: this.props.adv.hasCarPark,
                description: this.props.adv.description,
                priceCharges: this.props.adv.priceCharges,
                priceRent: this.props.adv.priceRent,
                cityName: this.props.adv.cityName,
                streetName: this.props.adv.address.split(',')[1],
                addNumb: this.props.adv.address.split(',')[0].split('/')[0],
                boxNumb: this.props.adv.address.split(',')[0].split('/')[1],
            });
            console.log([this.state, this.props.adv])
        }
    }

    getCities = () => {
        Axios.get(`${API_URL_CP}/${this.state.query}`)
            .then(data => {
                this.setState({
                    cities: data.data.localites ? data.data.localites : [{ id: 0, nom: 'personne' }]
                });
                console.log(data.data.localites)
            })
    }

    getStreets = () => {
        Axios.get(`${API_URL_RUE}/${this.state.cityName}/${this.state.querySt}`)
            .then(data => {
                this.setState({
                    streets: data.data.rues ? data.data.rues : [{ id: 0, nom: 'personne' }]
                });
                console.log(data.data.rues)
            })
    }

    handleInputChangeCity = (e) => {
        this.setState({
            query: e.target.value
        }, () => {
            if (this.state.query && this.state.query.length > 1) {
                if (this.state.query.length % 2 === 0) {
                    this.getCities()
                }
            } else if (!this.state.query) {
            }
        });
    }

    handleInputChangeSt = (e) => {
        this.setState({
            querySt: e.target.value
        }, () => {
            if (this.state.querySt && this.state.querySt.length > 1) {
                if (this.state.querySt.length % 2 === 0) {
                    this.getStreets()
                }
            } else if (!this.state.querySt) {

            }
        });
        console.log(e.target.value)
    }

    updateAccomodation = () => {
        let data = new FormData();
        data.append('accId', this.props.adv.accomodation_id);
        data.append('title', this.state.title);
        data.append('rent', this.state.priceRent);
        data.append('charge', this.state.priceCharges);
        data.append('hasWifi', this.state.hasWifi);
        data.append('hasFurniture', this.state.hasFurnitures);
        data.append('hasParking', this.state.hasCarPark);
        data.append('description', this.state.description);
        data.append('cityName', this.state.cityName);
        data.append('address', this.state.boxNumb ? `${this.state.addNumb}/${this.state.boxNumb},${this.state.streetName}` : `${this.state.addNumb},${this.state.streetName}`);
        fetch(apiUrl + 'updateaccomodation', {
            method: 'post',
            headers: {
                api_token: JSON.parse(sessionStorage.getItem('userData')).token.api_token
            },
            body: data
        })
            .then(response => response.json())
            .then(res => {
                if (res.status === 'error') {
                    swal(res.response[0]);
                    console.log(res.response)
                } else {
                    swal({
                        text: 'Logement mis à jour',
                        icon: 'success',
                        button: {
                            closeModal: false,
                        }
                    }).then(() => {
                        this.props.handleClose();
                        window.location.reload();
                    });
                }
            })
    }

    render() {
        let adv = this.state;
        return (
            <Modal
                show={this.props.showModal}
                onHide={this.props.handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>{adv.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label column sm="2">
                                Titre
                            </Form.Label>
                            <Col sm="10">
                                <div id="alert" style={{ color: 'red', fontSize: '0.7rem' }}></div>
                                <Form.Control type="text" placeholder={adv.title} onChange={e => {
                                    if (e.target.value.indexOf('"') === -1) {
                                        this.setState({ title: e.target.value });
                                        $("#alert").text('');
                                    }
                                    else $("#alert").text('Veuillez ne pas insérer de guillemet svp');
                                }} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="2">
                                Prix du Loyer
                                </Form.Label>
                            <Col sm="10">
                                <Form.Control type="number" min={0} placeholder={adv.priceRent + " €"} onChange={e => this.setState({ priceRent: e.target.value })} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="2">
                                Prix des Charges
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control type="number" min={0} placeholder={adv.priceCharges + " €"} onChange={e => this.setState({ priceCharges: e.target.value })} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="2">
                                Details
                            </Form.Label>
                            <Col sm="10">
                                <Form.Check
                                    custom
                                    inline
                                    checked={this.state.hasWifi === 1}
                                    type="checkbox"
                                    id="custom-checkbox1"
                                    label="Y'a t-il du WiFi ?"
                                    onChange={() => {/**/
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
                                    checked={this.state.hasFurnitures === 1}
                                    type="checkbox"
                                    id="custom-checkbox2"
                                    label="Est-il meublé ?"
                                    onChange={e => {/**/
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
                                    checked={this.state.hasCarPark === 1}
                                    type="checkbox"
                                    id="custom-checkbox3"
                                    label="Y'a t-il un parking ?"
                                    onChange={e => {/**/
                                        if (this.state.hasCarPark === 0) {
                                            this.setState({ hasCarPark: 1 });
                                        } else {
                                            this.setState({ hasCarPark: 0 });
                                        }
                                    }}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="2">
                                Code Postal
                            </Form.Label>
                            <Col sm="5">
                                <Form.Control type="number" min="1000" max="9999" maxLength="4" onChange={this.handleInputChangeCity} />
                                <CitiesList
                                    results={this.state.cities}
                                    choose={e => this.setState({ cityName: e.target.innerText, cities: [] })}
                                />
                            </Col>
                            <Col sm="5">
                                <Form.Control type="text" placeholder={adv.cityName} disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="2">
                                Rue
                            </Form.Label>
                            <Col xs={6}>
                                <Form.Control type='text' id='st' placeholder={adv.streetName} onChange={this.handleInputChangeSt} />
                                <StreetList
                                    results={this.state.streets}
                                    choose={e => { this.setState({ streetName: e.target.innerText, streets: [] }); document.getElementById('st').value = e.target.innerText }}
                                />
                            </Col>
                            <Col>
                                <Form.Control type='number' placeholder={adv.addNumb} min='0' onChange={e => this.setState({ addNumb: e.target.value })} disabled={this.state.cityName === ''} />
                            </Col>
                            <Col>
                                <Form.Control type='number' placeholder={adv.boxNumb ? adv.boxNumb : 'boîte'} min='0' onChange={e => this.setState({ boxNumb: e.target.value })} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="2">
                                Description
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control placeholder={this.state.description} name="Description" type="text" as="textarea" required onChange={e => this.setState({ description: e.target.value })} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="2">
                                Mis à jour le
                                </Form.Label>
                            <Col sm="10">
                                <Form.Control plaintext defaultValue={moment().format('LLLL')} />
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => {
                        if($("#alert").text() === '') {
                            this.updateAccomodation();
                        }
                        else swal({
                            text: 'Il y a des guillemets dans le titre, veuillez les retirer svp',
                            icon: 'warning'
                        })                        
                    }}
                    >
                        Modifier
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}