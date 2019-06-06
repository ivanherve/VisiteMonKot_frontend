import React, { Component } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { apiUrl } from '../../router';
import swal from 'sweetalert';

export default class SignUp extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            firstname: '',
            surname: '',
            password: '',
            pswToConfirm: '',
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
    }

    signUp = () => {
        if (this.state.password !== this.state.pswToConfirm) {
            swal('Les mots de passes ne correspondent pas entre eux')
        } else {
            let data = new FormData();
            data.append('email', this.state.email);
            data.append('firstname', this.state.firstname);
            data.append('surname', this.state.surname);
            data.append('password', this.state.password);
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
                        swal(res.response);
                        console.log(res.response)
                    }
                })
        }

    }

    render() {
        return (
            <Card.Body className="text-center">
                <p>Cherchez, Annoncez et organisez des visites de la plus simple des façons</p>
                <Form>
                    <Form.Control placeholder="Prénom*" name="firstname" type="text" required onChange={e => this.setState({ firstname: e.target.value })} />
                    <br />
                    <Form.Control placeholder="Nom*" name="surname" type="text" required onChange={e => this.setState({ surname: e.target.value })} />
                    <br />
                    <Form.Control placeholder="adresse@email.com*" name="email" type="text" required onChange={e => this.setState({ email: e.target.value })} />
                    <br />
                    <Form.Control placeholder="Mot de passe*" name="password" type="password" minLength="8" required onChange={e => this.setState({ password: e.target.value })} />
                    <br />
                    <Form.Control placeholder="Confirmer votre mot de passe*" name="passwordtoconfirm" minLength="8" type="password" required onChange={e => this.setState({pswToConfirm: e.target.value})} />
                    <br />
                    <Button color="primary" name="Register" onClick={() => {
                        if(this.state.password !== this.state.pswToConfirm) swal('Les mots de passes ne sont pas identiques');
                        else this.signUp();
                    }}>
                        Inscrivez-vous maintenant!
                    </Button>

                </Form>
            </Card.Body>
        )
    }
}