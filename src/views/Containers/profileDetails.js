import React, { Component } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import moment from 'moment';
import 'moment/locale/fr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import swal from 'sweetalert';
import { apiUrl, API_URL_TEL } from '../../router';

export default class ProfileDetails extends Component {

    constructor() {
        super();
        this.state = {
            toEdit: true,
            email: '',
            Firstname: '',
            Surname: '',
            call_code: null,
            mobile: '',
            countries: []
        }
    }

    componentDidMount() {
        this.getCallCodes();
    }

    getCallCodes = () => {
        let countries = [];
        fetch(`${API_URL_TEL}`)
            .then(res => res.json())
            .then(data => {
                data.map(d => {
                    if (d.callingCodes[0] !== '32') {
                        countries.push({
                            name: d.translations.fr ? d.translations.fr : d.name,
                            code: d.callingCodes[0]
                        })
                    } else {
                        countries.unshift({
                            name: d.translations.fr ? d.translations.fr : d.name,
                            code: d.callingCodes[0]
                        })
                    }
                })
                this.setState({ countries });
                this.setState({ call_code: countries[5].code })
            })
            .catch(err => {
                swal("Oups!", "Une erreur est survenue", "error");
                console.log(err)
            })
    }



    editInformations = () => {
        console.log(this.state.mobile)
        if (this.state.email === "") {
            this.setState({ email: this.props.user.email })
        }
        if (this.state.Firstname === "") {
            this.setState({ Firstname: this.props.user.Firstname })
        }
        if (this.state.Surname === "") {
            this.setState({ Surname: this.props.user.Surname })
        }
        if (this.state.call_code === "") {
            this.setState({ call_code: this.props.user.call_code })
        }
        if (this.state.mobile === "") {
            this.setState({ mobile: this.props.user.mobile })
        }
        swal({
            text: 'Etes-vous sûr de modifier ces informations ?',
            button: {
                closeModal: false
            }
        }).then(() => {
            let data = new FormData();
            data.append('firstname', this.state.Firstname);
            data.append('surname', this.state.Surname);
            data.append('email', this.state.email);
            data.append('call_code', this.state.call_code);
            data.append('mobile', this.state.mobile);
            fetch(`${apiUrl}resetinfo`, {
                method: 'post',
                headers: {
                    'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token
                },
                body: data
            }).then(response => response.json())
                .then(res => {
                    if (res.status === 'error') {
                        swal({
                            text: res.response[0],
                            dangerMode: true,
                            icon: 'warning'
                        })
                    } else {
                        swal({
                            title: 'Parfait',
                            text: res.response,
                            icon: 'success'
                        }).then(() => {
                            this.setState({ toEdit: true });
                            window.location.reload();
                            console.log({ 'email': this.state.email, "firstname": this.state.Firstname, "surname": this.state.Surname, "default-Value": this.props.user });
                        })
                    }
                })
                .catch(err => {
                    swal("Oups!", "Une erreur est survenue", "error");
                    console.log(err)
                })

        })
        .catch(err => {
            swal("Oups!", "Une erreur est survenue", "error");
            console.log(err)
        })
    }

    handleMobile = e => {
        let array = e.target.value.split(' ');
        //console.log(array[1])
        this.setState({ call_code: array[1] })
    }

    render() {
        let user = this.props.user;
        return (
            <div>
                <Row>
                    <Col xs='8'>
                        <h2>Informations</h2>
                    </Col>
                    <Col xs='4'>
                        {
                            this.state.toEdit
                                ?
                                <Button
                                    style={{ width: '100%' }}
                                    variant='outline-secondary'
                                    onClick={() => this.setState({ toEdit: false })}
                                >
                                    Modifier <FontAwesomeIcon icon={["fas", "edit"]} />
                                </Button>
                                :
                                <Row>
                                    <Col xs='9'>
                                        <Button
                                            style={{ width: '100%' }}
                                            variant='outline-success'
                                            onClick={() => this.editInformations()}
                                        >
                                            Confirmer <FontAwesomeIcon icon={["fas", "check"]} />
                                        </Button>
                                    </Col>
                                    <Col xs='3'>
                                        <Button
                                            style={{ width: '100%' }}
                                            variant='outline-secondary'
                                            onClick={() => this.setState({ toEdit: true })}
                                        >
                                            <FontAwesomeIcon icon={["fas", "times"]} />
                                        </Button>
                                    </Col>
                                </Row>
                        }
                    </Col>
                </Row>
                <hr />
                <Form>
                    <Form.Group as={Row} controlId="formPlaintextEmail">
                        <Form.Label column sm="3">
                            Adresse e-mail
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control plaintext={this.state.toEdit} defaultValue={user.email} onChange={(e) => this.setState({ email: e.target.value })} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextEmail">
                        <Form.Label column sm="3">
                            Prénom
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control plaintext={this.state.toEdit} defaultValue={user.Firstname} onChange={(e) => this.setState({ Firstname: e.target.value })} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextEmail">
                        <Form.Label column sm="3">
                            Nom
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control plaintext={this.state.toEdit} defaultValue={user.Surname} onChange={(e) => this.setState({ Surname: e.target.value })} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextEmail">
                        <Form.Label column sm="3">
                            N° téléphone
                        </Form.Label>
                        <Col sm="9">
                            {
                                this.state.toEdit
                                    ?
                                    <Form.Control plaintext defaultValue={`+${user.call_code} ${user.mobile}`} onChange={(e) => this.setState({ mobile: e.target.value })} />
                                    :
                                    <Row>
                                        <Col xs='4'>
                                            <Form.Control as='select' onChange={e => this.handleMobile(e)}>
                                                {
                                                    this.state.countries.map(c =>
                                                        <option key={this.state.countries.indexOf(c)}>+ {c.code} - {c.name}</option>
                                                    )
                                                }
                                            </Form.Control>
                                        </Col>
                                        <Col xs='8'>
                                            <Form.Control defaultValue={user.mobile} onChange={(e) => this.setState({ mobile: e.target.value })} />
                                        </Col>
                                    </Row>
                            }

                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextEmail">
                        <Form.Label column sm="3">
                            Date d'inscription
                    </Form.Label>
                        <Col sm="9">
                            <Form.Control plaintext readOnly defaultValue={moment(user.create_time).format('LLLL')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextEmail">
                        <Form.Label column sm="3">
                            Statut
                        </Form.Label>
                        <Col sm="9">
                            {
                                user.profil_id === 1
                                    ?
                                    <Form.Control plaintext readOnly defaultValue="Inactif" style={{ color: '#fcba03' }} />
                                    :
                                    user.profil_id === 2
                                        ?
                                        <Form.Control plaintext readOnly defaultValue="Actif" style={{ color: 'green' }} />
                                        :
                                        user.profil_id === 3
                                            ?
                                            <Form.Control plaintext readOnly defaultValue="Administrateur" style={{ color: 'bleu' }} />
                                            :
                                            user.profil_id === 5
                                                ?
                                                <Form.Control plaintext readOnly defaultValue="Tester" style={{ color: '#c4009a' }} />
                                                :
                                                <Form.Control plaintext readOnly defaultValue="Bannis" style={{ color: 'red' }} />
                            }
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        )
    }
}