import React, { Component } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { apiUrl } from '../../router';

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
        fetch(apiUrl + 'signin', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            .then(response => response.json())
            .then(res => {
                if (res.status == 'success') {
                    sessionStorage.setItem('userData', JSON.stringify(res.response));
                    this.props.redirection();
                }
                else {
                    alert(res.response);
                    console.log(res.response)
                }
            })
    }

    signUp = () => {
        if (this.state.password !== this.state.pswToConfirm) {
            alert('Les mots de passes ne correspondent pas entre eux')
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
                    }
                    else {
                        alert(res.response);
                        console.log(res.response)
                    }
                })
        }

    }

    handleField(e) {
        this.setState({[e.target.name]:e.target.value});
        console.log(e.target.name,e.target.value)
    }

    handlePassword(p) {
        this.setState({ password: p.target.value })
    }

    render() {
        return (
            <Card.Body className="text-center">
                <p>Cherchez, Annoncez et organisez des visites de la plus simple des façons</p>
                <Form>
                    <input className="form-control" placeholder="Prénom*" name="firstname" type="text" required onChange={this.handleField} />
                    <br />
                    <input className="form-control" placeholder="Nom*" name="surname" type="text" required onChange={this.handleField} />
                    <br />
                    <input className="form-control" placeholder="adresse@email.com*" name="email" type="text" required onChange={this.handleField} />
                    <br />
                    <input className="form-control" placeholder="Mot de passe*" name="password" type="password" minLength="8" required onChange={this.handleField} />
                    <br />
                    <input className="form-control" placeholder="Confirmer votre mot de passe*" name="passwordtoconfirm" minLength="8" type="password" required onChange={this.handleField} />
                    <br />
                    <input className="button mt-3" type="submit" color="primary" value="Inscrivez-vous maintenant!" name="Register" onSubmit={() => this.signUp()} />
                        
                </Form>
            </Card.Body>
        )
    }
}