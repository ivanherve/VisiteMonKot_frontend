import React, { Component } from 'react';
import { Modal, Form, Row, Col, Button, Image, Card, Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';
import moment from 'moment';
import { apiUrl, API_URL_CP, API_URL_RUE } from '../../router';
import swal from 'sweetalert';
import CitiesList from '../Containers/CitiesList';
import Axios from 'axios';
import StreetList from '../Containers/StreetList';
import $ from 'jquery';
import FileBase64 from 'react-file-base64';
import deepai from 'deepai';
import trashImg from '../../logo/delete-sign.png';

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
            addVisible: null,
            nbRoom: null,
            beginTime: null,
            endTime: null,
            surface: null,
            pictures: [],
            msg: 'Veuillez importer des images de moins d\'1Mo',
            delete: false,
            focusImg: null,
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
            cityName: this.props.adv.cityName,
            streetName: this.props.adv.address.split(',')[1],
            addNumb: this.props.adv.address.split(',')[0].split('/')[0],
            boxNumb: this.props.adv.address.split(',')[0].split('/')[1],
            addVisible: this.props.adv.addressVisible,
            nbRoom: this.props.adv.nbRoom,
            beginTime: this.props.adv.BeginingTime,
            endTime: this.props.adv.EndTime,
            surface: this.props.adv.Surface,
            pictures: this.props.adv.pictures ? this.props.adv.pictures : [],
        });
        //this.setState({ streetName: this.props.adv.address.split(',')[1] });
        console.log(this.props.adv)
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.adv !== prevProps.adv) {
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
                addVisible: this.props.adv.addressVisible,
                nbRoom: this.props.adv.nbRoom,
                beginTime: this.props.adv.BeginingTime,
                endTime: this.props.adv.EndTime,
                surface: this.props.adv.Surface,
                pictures: this.props.adv.pictures ? this.props.adv.pictures : [],
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
            .catch(err => {
                swal("Oups!", "Une erreur est survenue", "error");
                console.log(err)
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
            .catch(err => {
                swal("Oups!", "Une erreur est survenue", "error");
                console.log(err)
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

    handlePictures = pictures => {
        if (pictures !== this.state.pictures) {
            this.setState({ msg: 'Chargement' });
        } else {
            this.setState({ msg: null })
        }
        pictures.map(pic => {
            console.log(this.state.pictures);
            deepai.callStandardApi("nsfw-detector", {
                image: pic.base64,
            }).then(res => {
                console.log(this.state.pictures);
                if (res.output.detections.length < 1) {
                    if (this.state.pictures.length < 1) {
                        this.setState({
                            pictures: [{
                                picture: pic.base64,
                            }]
                        });
                    }
                    else this.setState({
                        pictures: [...this.state.pictures, {
                            picture: pic.base64,
                        }]
                    });
                } else {
                    swal({
                        icon: 'warning',
                        text: pic.name + ' est une image inapproprié! Elle ne sera pas importé'
                    })
                }
            }).catch(err => {
                swal({
                    icon: 'warning',
                    text: pic.name + ' est trop volumineux! Veillez à importer des photos de moins 1Mo!'
                });
                console.log('Photo voluminieux ou ' + err)
            });
        })
    }

    updateAccomodation = () => {
        let imgb64 = [];
        this.state.pictures.map(pic => {
            imgb64.push(pic.picture)
        });
        let data = new FormData();
        data.append('accId', this.props.adv.accomodation_id);
        data.append('title', this.state.title);
        data.append('nbRoom', this.state.nbRoom);
        data.append('surface', this.state.surface);
        data.append('rent', this.state.priceRent);
        data.append('charge', this.state.priceCharges);
        data.append('beginTime', this.state.beginTime);
        data.append('endTime', this.state.endTime);
        data.append('hasWifi', this.state.hasWifi);
        data.append('hasFurniture', this.state.hasFurnitures);
        data.append('hasParking', this.state.hasCarPark);
        data.append('description', this.state.description);
        data.append('cityName', this.state.cityName);
        data.append('address', this.state.boxNumb ? `${this.state.addNumb}/${this.state.boxNumb},${this.state.streetName}` : `${this.state.addNumb},${this.state.streetName}`);
        data.append('addressVisible', this.state.addVisible);
        data.append('image', JSON.stringify(imgb64));
        fetch(apiUrl + 'updateaccomodation', {
            method: 'post',
            headers: {
                'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token
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
            .catch(err => {
                swal("Oups!", "Une erreur est survenue", "error");
                console.log(err)
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
                                Nombre de chambre
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control type='number' placeholder={adv.nbRoom} onChange={e => this.setState({ nbRoom: e.target.value })} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="2">
                                Surface
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control type='number' placeholder={adv.surface} onChange={e => this.setState({ surface: e.target.value })} />
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
                                Dates de location
                            </Form.Label>
                            <Col sm="5">
                                <Form.Control type="date" defaultValue={adv.beginTime} min={moment().format('YYYY-MM-Do')} onChange={e => this.setState({ beginTime: e.target.value })} />
                            </Col>
                            <Col sm="5">
                                <Form.Control type="date" defaultValue={adv.endTime} min={this.state.beginTime} onChange={e => this.setState({ endTime: e.target.value })} />
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

                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="2">

                            </Form.Label>
                            <Col sm="10">
                                <Form.Check
                                    custom
                                    inline
                                    checked={this.state.addVisible}
                                    type="checkbox"
                                    id="custom-checkbox5"
                                    label="Adresse visible"
                                    onChange={e => {/**/
                                        if (!this.state.addVisible) {
                                            this.setState({ addVisible: 1 });
                                        } else {
                                            this.setState({ addVisible: 0 });
                                        }
                                        console.log(this.state.addVisible)
                                    }}
                                />
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

                        <Form.Group as={Row}>
                            <Form.Label column sm="2">
                                Photos
                            </Form.Label>
                            <Col sm="10">
                                <Card>
                                    <Card.Body>
                                        <FileBase64
                                            className='form-control-file'
                                            multiple={true}
                                            onDone={pictures => this.handlePictures(pictures)}
                                        />
                                        <Row>
                                            {
                                                this.state.pictures.length > 0
                                                    ?
                                                    this.state.pictures.map(img =>
                                                        <OverlayTrigger key={this.state.pictures.indexOf(img)} overlay={<Tooltip>Supprimer</Tooltip>}>
                                                            <div style={styles.thumbsContainer}>
                                                                <div style={styles.thumb}>
                                                                    <div style={styles.thumbInner}>
                                                                        <div
                                                                            style={this.state.focusImg === this.state.pictures.indexOf(img) ? styles.imgHovered : styles.img}
                                                                            onMouseOver={() => this.setState({ focusImg: this.state.pictures.indexOf(img) })}
                                                                            onMouseOut={() => this.setState({ focusImg: null })}
                                                                        >
                                                                            <Image
                                                                                src={img.picture}
                                                                                onClick={() => {
                                                                                    var pics = [...this.state.pictures];
                                                                                    var idx = pics.indexOf(img);
                                                                                    if (idx !== -1) {
                                                                                        pics.splice(idx, 1);
                                                                                        this.setState({ pictures: pics })
                                                                                    } else {
                                                                                        console.log(pics)
                                                                                    }
                                                                                }}
                                                                                onMouseOver={() => this.setState({ focusImg: this.state.pictures.indexOf(img) })}
                                                                                onMouseOut={() => this.setState({ focusImg: null })}
                                                                                style={this.state.focusImg === this.state.pictures.indexOf(img) ? styles.imgHovered : styles.img}
                                                                            />
                                                                        </div>
                                                                        <div style={{ color: '#ddd', display: 'flex', justifyContent: 'center' }}>
                                                                            {this.state.msg}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </OverlayTrigger>
                                                    )
                                                    :
                                                    <div style={{ color: '#ddd', display: 'flex', justifyContent: 'center' }}>
                                                        {this.state.msg}
                                                    </div>
                                            }
                                        </Row>
                                    </Card.Body>
                                </Card>
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
                        if ($("#alert").text() === '') {
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

const styles = {
    thumbsContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16
    },
    thumb: {
        display: 'inline-flex',
        borderRadius: 2,
        border: '1px solid #eaeaea',
        marginBottom: 8,
        marginRight: 8,
        width: 100,
        height: 100,
        padding: 4,
        boxSizing: 'border-box'
    },
    thumbInner: {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden'
    },
    img: {
        display: 'block',
        width: 'auto',
        height: '100%',
    },
    imgHovered: {
        display: 'block',
        width: 'auto',
        height: '100%',
        cursor: 'pointer',
        opacity: '0.5',
        backgroundImage: 'url(' + trashImg + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        marginBottom: 8,
        marginRight: 8,
        width: 100,
        height: 100,
    }

}