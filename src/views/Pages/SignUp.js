import React, { Component } from 'react';
import { Button, Card, Form, Row, Col } from 'react-bootstrap';
import { apiUrl, API_URL_TEL } from '../../router';
import swal from 'sweetalert';
import Recaptcha from "react-recaptcha";

export default class SignUp extends Component {
    constructor() {
        super();
        this.recaptchaLoaded = this.recaptchaLoaded.bind(this);
        this.verifyCallback = this.verifyCallback.bind(this);

        this.state = {
            email: '',
            firstname: '',
            surname: '',
            password: '',
            pswToConfirm: '',
            callingCode: null,
            countries: [],
            mobile: null,
            isHuman: false,
        }
    }

    signIn = (email, password) => {
        let data = new FormData();
        data.append('email', email);
        data.append('password', password);
        fetch(apiUrl + 'signin', {
            method: 'POST',
            body: data
        })
            .then(response => response.json())
            .then(res => {
                if (res.status === 'success') {
                    sessionStorage.setItem('userData', JSON.stringify(res.response));
                    this.props.redirection();
                }
                else {
                    swal(res.response);
                    console.log(res.response)
                }
            })
            .catch(err => {
                swal("Oups!", "Une erreur est survenue", "error");
                console.log(err)
            })
    }

    signUp = () => {
        if (this.state.isHuman) {
            if (this.state.password !== this.state.pswToConfirm) {
                swal('Les mots de passes ne correspondent pas entre eux')
            } else {
                let data = new FormData();
                data.append('email', this.state.email);
                data.append('firstname', this.state.firstname);
                data.append('surname', this.state.surname);
                data.append('password', this.state.password);
                data.append('callCode', this.state.callingCode)
                data.append('mobile', this.state.mobile)
                fetch(apiUrl + 'signup', {
                    method: 'POST',
                    body: data
                })
                    .then(response => response.json())
                    .then(res => {
                        if (res.status === "success") {
                            this.signIn(res.response.email, this.state.password)
                            console.log(res.response)
                        }
                        else {
                            swal({ text: res.response[0] });
                            console.log(res.response)
                        }
                    })
                    .catch(err => {
                        swal("Oups!", "Une erreur est survenue", "error");
                        console.log(err)
                    })
            }
        } else {
            swal({
                icon: 'warning',
                text: 'Veuillez, s\'il vous plait, confirmer que vous n\'êtes pas un robot'
            })
        }
    }

    getCallingCodes = () => {
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
                this.setState({ callingCode: countries[5].code })
            })
            .catch(err => {
                swal("Oups!", "Une erreur est survenue", "error");
                console.log(err)
            })
    }

    handleCode = data => {

        let c = data.split(" ");
        let callingCode = c[1];/*
        this.setState({ callingCode })
        console.log(callingCode)
        */
        this.state.countries.map(el => {
            if (el.code === callingCode) {
                console.log(this.state.countries.indexOf(el))
            }
        })
    }

    recaptchaLoaded() {
        console.log('captcha loaded')
    }

    verifyCallback(response) {
        if (response) this.setState({ isHuman: true })
        console.log(response)
    }

    componentDidMount() {
        this.getCallingCodes();
    }

    render() {
        return (
            <Card.Body className="text-center">
                <p>Chercher, annoncer et organiser des visites de la plus simple des façons</p>
                <Form>
                    <Form.Control placeholder="Prénom*" name="firstname" type="text" required onChange={e => this.setState({ firstname: e.target.value })} />
                    <br />
                    <Form.Control placeholder="Nom*" name="surname" type="text" required onChange={e => this.setState({ surname: e.target.value })} />
                    <br />
                    <Form.Control placeholder="adresse@email.com*" name="email" type="text" required onChange={e => this.setState({ email: e.target.value })} />
                    <br />
                    <Row>
                        <Col xs='5'>
                            <Form.Control as='select' onChange={e => this.handleCode(e.target.value)}>
                                {
                                    this.state.countries.map(d =>
                                        <option key={this.state.countries.indexOf(d)}>+ {d.code} - {d.name}</option>
                                    )
                                }
                            </Form.Control>
                        </Col>
                        <Col xs='7'>
                            <Form.Control type='number' placeholder='Téléphone *' maxLength='9' onChange={e => this.setState({ mobile: e.target.value })} />
                        </Col>
                    </Row>
                    <br />
                    <Form.Control placeholder="Mot de passe*" name="password" type="password" minLength="8" required onChange={e => this.setState({ password: e.target.value })} />
                    <br />
                    <Form.Control placeholder="Confirmer votre mot de passe*" name="passwordtoconfirm" minLength="8" type="password" required onChange={e => this.setState({ pswToConfirm: e.target.value })} />
                    <br />
                    {
                        /*
                            <Form.Check type='checkbox' custom label={<div>J'ai lu et accepté les conditions générales d'utilisation</div>} />
                            <br />
                        */
                    }
                    <Recaptcha
                        sitekey="6Ld5C7EUAAAAAEtth02r4DRaEjwNhFOvO31V96Tr"
                        render="explicit"
                        onloadCallback={this.recaptchaLoaded}
                        verifyCallback={this.verifyCallback}
                    />
                    <br />
                    <Button color="primary" name="Register" onClick={() => {
                        if (this.state.password !== this.state.pswToConfirm) swal('Les mots de passes ne sont pas identiques');
                        else this.signUp();
                    }}>
                        Inscrivez-vous maintenant!
                    </Button>

                </Form>
            </Card.Body>
        )
    }
}