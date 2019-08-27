import React, { Component } from 'react';
import { Modal, Button, Form, Row, Col, Card, ListGroup, OverlayTrigger, Tooltip, Image } from 'react-bootstrap';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import { DateRangePicker, SingleDatePicker } from 'react-dates';
import { apiUrl, API_URL_CP, API_URL_RUE } from '../../router';
import moment from 'moment';
import CitiesList from '../Containers/CitiesList';
import StreetList from '../Containers/StreetList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import swal from 'sweetalert';
import deepai from 'deepai';
import FileBase64 from 'react-file-base64';
import trashImg from '../../logo/delete-sign.png';

deepai.setApiKey('e1f1ce45-ca41-4f8b-877b-a7e25ccaf6f0');

export default class AddAnnounce extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oneDate: null,
            firstDate: null,
            lastDate: null,
            focusedInputVisit: null,
            beginingTime: null,
            endTime: null,
            focusedInputLive: null,
            cities: [],
            streets: [],
            types: [],
            title: '',
            number: '',
            box: '',
            nbRoom: '',
            priceRent: '',
            priceCharges: '',
            description: '',
            hasWifi: 0,
            hasCarPark: 0,
            hasFurnitures: 0,
            cityName: '',
            streetName: '',
            type: '',
            surface: '',
            pictures: [],
            addressVisible: 0,
            typeDate: 0,
            datesVisits: [],
            datesVisitsToSend: [],
            startTimeVisits: null,
            endTimeVisits: null,
            msg: 'Veuillez importer des photos de moins d\'1Mo',
            focusImg: null,
        };
    }

    getTypes = () => {
        fetch(apiUrl + 'types')
            .then(response => response.json())
            .then(res => {
                if (res.status === 'error') {
                    swal(res.response[0]);
                    console.log(res.response)
                } else {
                    console.log(res.response);
                    this.setState({ types: res.response });
                    this.setState({ type: res.response[0].type })
                }
            })
    }

    // Callback~
    getFiles(pictures) {
        this.setState({ pictures });
        console.log(pictures)
    }

    getCities = () => {
        fetch(`${API_URL_CP}/${this.state.query}`, {
            method: 'get'
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    cities: data.localites ? data.localites : [{ id: 0, nom: 'personne' }]
                });
                console.log(data.localites)
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
        //console.log(this.search.value)
    }

    getStreets = () => {
        fetch(`${API_URL_RUE}/${this.state.cityName}/${this.state.querySt}`, {
            method: 'get'
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    streets: data.rues ? data.rues : [{ id: 0, nom: 'personne' }]
                });
                console.log(data.rues)
            })
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
    /*
        sendImages = (files) => {
            files.map(file => {
                //b64.push(file.base64)
                let data = new FormData();
                data.append('image', file.base64);
                data.append('aid', 1)
                fetch(`${apiUrl}uploadimages`, {
                    method: 'post',
                    headers: {
                        'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token,
                    },
                    body: data
                }).then(response => response.json())
                    .then(res => {
                        if (res.status === 'error') console.log(res.response);
                        else console.log(res);
                    })
            })
        }
    */

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
                    if (this.state.pictures.length < 1) this.setState({ pictures: [pic] });
                    else this.setState({ pictures: [...this.state.pictures, pic] });
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

    addOneAnnounce = () => {
        let imgb64 = [];
        this.state.pictures.map(pic => {
            imgb64.push(pic.base64)
        });
        if (this.state.typeDate === 2) {
            this.setState({
                datesVisits: [
                    {
                        firstDate: this.state.startDate,
                        lastDate: this.state.startDate,
                        startTimeVisits: this.state.startTimeVisits,
                        endTimeVisits: this.state.endTimeVisits, variant: 'info'
                    }
                ],
                datesVisitsToSend: [
                    {
                        firstDate: moment(this.state.startDate).format('YYYY-MM-DD'),
                        lastDate: moment(this.state.startDate).format('YYYY-MM-DD'),
                        startTimeVisits: this.state.startTimeVisits,
                        endTimeVisits: this.state.endTimeVisits, variant: 'info'
                    }
                ],
            });
        }
        if (this.state.datesVisitsToSend.length > 0) {
            let data = new FormData();
            data.append('title', this.state.title);
            data.append('address', this.state.box === '' ? this.state.number + ', ' + this.state.streetName : this.state.number + '/' + this.state.box + ', ' + this.state.streetName);
            data.append('nbRoom', this.state.nbRoom);
            data.append('priceRent', this.state.priceRent);
            data.append('priceCharges', this.state.priceCharges);
            data.append('BeginingTime', moment(this.state.beginingTime).format().slice(0, 10));
            data.append('EndTime', moment(this.state.endTime).format().slice(0, 10));
            data.append('Description', this.state.description);
            data.append('HasWifi', this.state.hasWifi);
            data.append('HasCarPark', this.state.hasCarPark);
            data.append('HasFurnitures', this.state.hasFurnitures);
            data.append('cityName', this.state.cityName);
            data.append('Type', this.state.type);
            data.append('Surface', this.state.surface);
            data.append('datesVisit', JSON.stringify(this.state.datesVisitsToSend));
            data.append('addressVisible', this.state.addressVisible);
            data.append('typeDate', this.state.typeDate.toString());
            //data.append('endVisit', moment(this.state.endDate).format().slice(0, 10));
            data.append('image', JSON.stringify(imgb64));
            fetch(apiUrl + 'addadvertisments', {
                method: 'post',
                headers: {
                    //'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token
                },
                body: data
            })
                .then(response => response.json())
                .then(res => {
                    if (res.status === 'success') {
                        swal({
                            title: 'Parfait!',
                            text: `Annonce ajoutée`,
                            icon: 'success',
                            button: {
                                closeModal: false,
                            }
                        })
                            .then(() => {
                                this.props.handleClose();
                                window.location.reload();
                            });
                    } else {
                        swal(res.response[0]);
                        console.log(res.response, [this.state.typeDate, this.state.datesVisitsToSend])
                    }
                }, err => { swal(err); console.log(this.state.pictures) }
                )
        }

    }

    componentDidMount() {
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
                        <Form.Control placeholder="Nom du logement *" name="Title" type="text" required onChange={e => this.setState({ title: e.target.value })} />
                        <br />
                        <Form.Control placeholder="Nombre de chambre*" min="1" name="nbRoom" type="number" required onChange={e => this.setState({ nbRoom: e.target.value })} />
                        <br />
                        <Form.Control placeholder="Loyer €*" name="priceRent" min="0" type="number" required onChange={e => this.setState({ priceRent: e.target.value })} />
                        <br />
                        <Form.Control placeholder="Charges €*" name="priceCharges" min="0" type="number" required onChange={e => this.setState({ priceCharges: e.target.value })} />
                        <br />
                        <Form.Label>Période de sous-location *</Form.Label>
                        <br />
                        <DateRangePicker
                            startDateId="beginingTime"
                            endDateId="endTime"
                            startDate={this.state.beginingTime}
                            endDate={this.state.endTime}
                            onDatesChange={({ startDate, endDate }) => { this.setState({ beginingTime: startDate, endTime: endDate }) }}
                            focusedInput={this.state.focusedInputLive}
                            onFocusChange={(focusedInputLive) => { this.setState({ focusedInputLive }) }}
                        />
                        <br />
                        <br />
                        <Form.Label>Ajoutez une/des date(s) de visite *</Form.Label>
                        <br />
                        <Card>
                            <Card.Body>
                                <Form.Check checked={this.state.typeDate === 0} custom inline type='radio' label='Une seule date' id='chk1' name='chk1' onChange={() => this.setState({ typeDate: 0 })} />
                                <Form.Check custom inline type='radio' label='Plusieurs dates' id='chk2' name='chk1' onChange={() => this.setState({ typeDate: 1 })} />
                                <Form.Check custom inline type='radio' label="A partir de cette date jusqu'à location" id='chk3' name='chk1' onChange={() => this.setState({ typeDate: 2 })} />
                                <br />
                                <br />
                                <Row>
                                    <Col xs='6'>
                                        <Form.Label>Le : </Form.Label>
                                        <div>
                                            {
                                                this.state.typeDate === 0
                                                    ?
                                                    <SingleDatePicker
                                                        id="addOneDate" // PropTypes.string.isRequired,
                                                        date={this.state.oneDate} // momentPropTypes.momentObj or null
                                                        onDateChange={visitDate => this.setState({ oneDate: visitDate })} // PropTypes.func.isRequired
                                                        focused={this.state.focusedInputVisit} // PropTypes.bool
                                                        onFocusChange={({ focused }) => this.setState({ focusedInputVisit: focused })} // PropTypes.func.isRequired
                                                    />
                                                    :
                                                    this.state.typeDate === 1
                                                        ?
                                                        <DateRangePicker
                                                            startDateId="addFirstDate"
                                                            endDateId="addLastDate"
                                                            startDate={this.state.firstDate}
                                                            endDate={this.state.lastDate}
                                                            onDatesChange={({ startDate, endDate }) => { this.setState({ firstDate: startDate, lastDate: endDate }) }}
                                                            focusedInput={this.state.focusedInputVisit}
                                                            onFocusChange={(focusedInputVisit) => { this.setState({ focusedInputVisit }) }}
                                                        />
                                                        :
                                                        <SingleDatePicker
                                                            id="addOneDateAtAll" // PropTypes.string.isRequired,
                                                            date={this.state.startDate} // momentPropTypes.momentObj or null
                                                            onDateChange={visitDate => this.setState({ startDate: visitDate })} // PropTypes.func.isRequired
                                                            focused={this.state.focusedInputVisit} // PropTypes.bool
                                                            onFocusChange={({ focused }) => this.setState({ focusedInputVisit: focused })} // PropTypes.func.isRequired
                                                        />
                                            }
                                        </div>
                                        {/*<Form.Control type='date' />*/}
                                    </Col>
                                    <Col xs={this.state.typeDate === 0 || this.state.typeDate === 1 ? '2' : '3'}>
                                        <Form.Label>De :</Form.Label>
                                        <Form.Control type='time' onChange={e => this.setState({ startTimeVisits: e.target.value })} />
                                    </Col>
                                    <Col xs={this.state.typeDate === 0 || this.state.typeDate === 1 ? '2' : '3'}>
                                        <Form.Label>A :</Form.Label>
                                        <Form.Control type='time' onChange={e => this.setState({ endTimeVisits: e.target.value })} />
                                    </Col>
                                    {
                                        this.state.typeDate === 0
                                            ?
                                            <Col xs='2'>
                                                <Form.Label style={{ color: 'white' }}>Ajouter :</Form.Label>
                                                <div>
                                                    <OverlayTrigger overlay={<Tooltip>Ajouter une date</Tooltip>}>
                                                        <Button onClick={() => {
                                                            if (!this.state.oneDate || !this.state.startTimeVisits || !this.state.endTimeVisits) swal('Insérez une date et des heures svp!')
                                                            else this.setState({
                                                                datesVisits: [
                                                                    {
                                                                        firstDate: this.state.oneDate,
                                                                        lastDate: this.state.oneDate,
                                                                        startTimeVisits: this.state.startTimeVisits,
                                                                        endTimeVisits: this.state.endTimeVisits, variant: 'info'
                                                                    },
                                                                    ...this.state.datesVisits
                                                                ],
                                                                datesVisitsToSend: [
                                                                    {
                                                                        firstDate: moment(this.state.oneDate).format('YYYY-MM-DD'),
                                                                        lastDate: moment(this.state.oneDate).format('YYYY-MM-DD'),
                                                                        startTimeVisits: this.state.startTimeVisits,
                                                                        endTimeVisits: this.state.endTimeVisits, variant: 'info'
                                                                    },
                                                                    ...this.state.datesVisitsToSend
                                                                ],
                                                            })
                                                        }}>
                                                            <FontAwesomeIcon icon={["fas", "plus"]} />
                                                        </Button>
                                                    </OverlayTrigger>
                                                </div>
                                            </Col>
                                            :
                                            this.state.typeDate === 1
                                                ?
                                                <Col xs='2'>
                                                    <Form.Label style={{ color: 'white' }}>Ajouter :</Form.Label>
                                                    <div>
                                                        <OverlayTrigger overlay={<Tooltip>Ajouter des dates</Tooltip>}>
                                                            <Button onClick={() => {
                                                                if (!this.state.firstDate || !this.state.lastDate || !this.state.startTimeVisits || !this.state.endTimeVisits) swal('Insérez les dates et les heures')
                                                                else {
                                                                    this.setState({
                                                                        datesVisits: [
                                                                            {
                                                                                firstDate: this.state.firstDate,
                                                                                lastDate: this.state.lastDate,
                                                                                startTimeVisits: this.state.startTimeVisits,
                                                                                endTimeVisits: this.state.endTimeVisits,
                                                                                variant: 'success'
                                                                            },
                                                                            ...this.state.datesVisits
                                                                        ],
                                                                        datesVisitsToSend: [
                                                                            {
                                                                                firstDate: moment(this.state.firstDate).format('YYYY-MM-DD'),
                                                                                lastDate: moment(this.state.lastDate).format('YYYY-MM-DD'),
                                                                                startTimeVisits: this.state.startTimeVisits,
                                                                                endTimeVisits: this.state.endTimeVisits,
                                                                                variant: 'info'
                                                                            },
                                                                            ...this.state.datesVisitsToSend
                                                                        ],
                                                                    })
                                                                }
                                                            }}>
                                                                <FontAwesomeIcon icon={["fas", "plus"]} />
                                                            </Button>
                                                        </OverlayTrigger>
                                                    </div>
                                                </Col>
                                                :
                                                null
                                    }
                                </Row>
                            </Card.Body>
                            {
                                (this.state.typeDate === 0 || this.state.typeDate === 1) && this.state.datesVisits.length > 0
                                    ?
                                    <div>
                                        <ListGroup variant='flush'>
                                            {
                                                this.state.datesVisits.map(el =>
                                                    <ListGroup.Item variant={el.variant} key={this.state.datesVisits.indexOf(el)}>
                                                        <Row>
                                                            <Col xs='2'>
                                                                <OverlayTrigger overlay={<Tooltip>Retirer</Tooltip>}>
                                                                    <Button variant='outline-danger' onClick={() => {
                                                                        let array = [...this.state.datesVisits];
                                                                        let index = array.indexOf(el)
                                                                        array.splice(index, 1);
                                                                        this.setState({ datesVisits: array })
                                                                    }}>
                                                                        <FontAwesomeIcon icon={["fas", "times"]} />
                                                                    </Button>
                                                                </OverlayTrigger>
                                                            </Col>
                                                            <Col>
                                                                {
                                                                    el.firstDate === el.lastDate
                                                                        ?
                                                                        <div>Le {moment(el.firstDate).format('Do MMMM YYYY')} de {el.startTimeVisits} à {el.endTimeVisits}</div>
                                                                        :
                                                                        <div>Du {moment(el.firstDate).format('Do MMMM YYYY')} au {moment(el.lastDate).format('Do MMMM YYYY')}, tous les jours entre {el.startTimeVisits} et {el.endTimeVisits}</div>
                                                                }
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                )
                                            }
                                        </ListGroup>
                                    </div>
                                    :
                                    null
                            }
                        </Card>
                        <br />
                        <br />
                        <div>
                            <Form.Check
                                custom
                                inline
                                checked={this.state.hasWifi === 0 ? false : true}
                                type="checkbox"
                                id="custom-checkbox1"
                                label="WiFi ?"
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
                                label="Meublé ?"
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
                                label="Parking ?"
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
                        <Form.Control placeholder='Surface (m2) *' min="10" name="Surface" type="number" required onChange={e => this.setState({ surface: e.target.value })} />
                        <br />
                        <Row>
                            <Col>
                                <Form.Control type='number' min='1000' placeholder="Code Postal *" required onChange={this.handleInputChangeCity} />
                                <CitiesList
                                    results={this.state.cities}
                                    choose={e => this.setState({ cityName: e.target.innerText, cities: [] })}
                                />
                            </Col>
                            <Col>
                                <Form.Control readOnly defaultValue={this.state.cityName} />
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col xs={8}>
                                <Form.Control type='text' id='st' disabled={this.state.cityName.length < 1} placeholder="Rue *" onChange={this.handleInputChangeSt} />
                                <StreetList
                                    results={this.state.streets}
                                    choose={e => { this.setState({ streetName: e.target.innerText, streets: [] }); document.getElementById('st').value = e.target.innerText }}
                                />
                            </Col>
                            <Col>
                                <Form.Control type='number' placeholder='numéro' min='0' onChange={e => this.setState({ number: e.target.value })} disabled={this.state.cityName.length < 1} />
                            </Col>
                            <Col>
                                <Form.Control type='number' placeholder='boîte' min='0' onChange={e => this.setState({ box: e.target.value })} disabled={this.state.cityName.length < 1} />
                            </Col>
                        </Row>
                        <br />
                        <Form.Check
                            custom
                            inline
                            type='checkbox'
                            id="custom-checkbox4"
                            label="Rendre l'adresse visible"
                            onChange={() => {
                                if (this.state.addressVisible === 0) {
                                    this.setState({ addressVisible: 1 });
                                } else {
                                    this.setState({ addressVisible: 0 });
                                }
                            }
                            }
                        />
                        <br />
                        <br />
                        <Form.Label>De quel type de logement s'agit-il ? *</Form.Label>
                        <Form.Control as="select" name="Type" required onChange={e => { console.log(e.target.value); this.setState({ type: e.target.value }) }}>
                            {
                                this.state.types.map(type =>
                                    <option key={this.state.types.indexOf(type)}>{type.type}</option>
                                )
                            }
                        </Form.Control>
                        <br />
                        <Form.Label>Ajoutez quelques Photos *</Form.Label>
                        <br />
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
                                                                    onMouseOver={() => this.setState({ focusImg: this.state.pictures.indexOf(img) })}
                                                                    onMouseOut={() => this.setState({ focusImg: null })}
                                                                    style={this.state.focusImg === this.state.pictures.indexOf(img) ? styles.imgHovered : styles.img}
                                                                >
                                                                    <Image
                                                                        src={img.base64}
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
                        <br />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={() => {
                            this.addOneAnnounce();
                            //console.log(this.state.datesVisitsToSend)
                        }}
                    >
                        Publier une annonce
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
        height: '100%'
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
        width: 90,
        height: 90,
    }
}