import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import { apiUrl } from '../../router';
import swal from 'sweetalert';

export default class ResetPwd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            newPassword: '',
            confPassword: '',
        }
        this.handleOldPwd = this.handleOldPwd.bind(this);
        this.handleNewPwd = this.handleNewPwd.bind(this);
        this.handleConfPwd = this.handleConfPwd.bind(this);
    }

    resetMyPwd = () => {
        let data = new FormData();
        data.append('password', this.state.password);
        data.append('newPassword', this.state.newPassword);
        data.append('confPassword', this.state.confPassword);
        fetch(apiUrl + 'resetpwd', {
            method: 'POST',
            headers: {
                'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token
            },
            body: data
        })
            .then(response => response.json())
            .then(res => {
                if (res.status === 'error') {
                    swal(res.response);
                    console.log(res.response)
                } else {
                    swal({
                        text: res.response,
                        icon: 'success',
                        button: {
                            closeModal: false,
                        }
                    })
                        .then(() => {
                            window.location.href = '/'
                        });
                }
            })
            .catch(err => {
                swal("Oups!", "Une erreur est survenue", "error");
                console.log(err)
            })
    }

    handleOldPwd(o) {
        this.setState({ password: o.target.value })
    }

    handleNewPwd(n) {
        this.setState({ newPassword: n.target.value })
    }

    handleConfPwd(c) {
        this.setState({ confPassword: c.target.value })
    }

    render() {
        return (
            <div style={{ width: '75%'}}>
                <h2>Modifier Votre Mot de Passe</h2>
                <Form>
                    <Form.Control
                        type="password"
                        name="old password"
                        minLength={8}
                        placeholder="Tapez votre ancien mot de passe"
                        onChange={this.handleOldPwd}
                    />
                    <br />
                    <Form.Control
                        type="password"
                        name="new password"
                        minLength={8}
                        placeholder="Tapez votre nouveau mot de passe"
                        onChange={this.handleNewPwd}
                    />
                    <br />
                    <Form.Control
                        type="password"
                        name="confirm new password"
                        minLength={8}
                        placeholder="Retapez votre nouveau mot de passe"
                        onChange={this.handleConfPwd}
                    />
                    <br />
                </Form>
                <Button type="submit" variant="success" onClick={() => this.resetMyPwd()}>
                    Changer de mot de passe
                        </Button>
            </div>
        )
    }
}