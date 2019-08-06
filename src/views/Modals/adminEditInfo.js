import React, { Component } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { apiUrl } from '../../router';
import swal from 'sweetalert';

export default class AdminEditInfo extends Component {

    constructor() {
        super();
        this.state = {
            email: null,
            names: null,
            profilName: null
        }
    }

    componentDidMount() {
        this.setState({
            email: this.props.user.email,
            names: this.props.user.names,
            profilName: this.props.user.profilName
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props !== prevProps) {
            this.setState({
                email: this.props.user.email,
                names: this.props.user.names,
                profilName: this.props.user.profilName
            })
        }
    }

    editUser = () => {
        if (this.state.email === "") this.setState({ email: this.props.user.email });
        if (this.state.names === "") this.setState({ names: this.props.user.names });
        if (this.state.profilName === "") this.setState({ profilName: this.props.user.profilName });
        //console.log(this.props.user);
        /**/
        let data = new FormData();
        data.append('uid', this.props.user.user_id);
        data.append('email', this.state.email);
        data.append('names', this.state.names);
        data.append('profile', this.state.profilName);
        fetch(`${apiUrl}edituser`, {
            method: 'post',
            headers: {
                'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token
            },
            body: data
        }).then(res => res.json())
            .then(res => {
                if (res.status === 'success') {
                    /**/
                    swal({
                        icon: 'success',
                        text: 'ca marche'
                    }).then(() => window.location.reload());                    
                    console.log(res.response)
                } else {
                    swal({
                        icon: 'warning',
                        text: res.response[0]
                    });
                    console.log({ state: this.state, props: this.props.user })
                }
            })

    }

    render() {
        let user = this.props.user;
        let profiles = this.props.profiles;
        return (
            <Modal show={this.props.show} onHide={this.props.hide} centered size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group as={Row}>
                        <Form.Label column sm="2">E-mail</Form.Label>
                        <Col sm='10'>
                            <Form.Control type='text' placeholder={user.email} onChange={e => this.setState({ email: e.target.value })} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="2">Nom</Form.Label>
                        <Col sm='10'>
                            <Form.Control type='text' placeholder={user.names} onChange={e => this.setState({ names: e.target.value })} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="2">Profile</Form.Label>
                        <Col sm='10'>
                            <Form.Control as='select' defaultValue={user.profilName} onChange={e => this.setState({ profilName: e.target.value })}>
                                {
                                    profiles.map(p =>
                                        <option key={profiles.indexOf(p)}>
                                            {p.profilName}
                                        </option>
                                    )
                                }
                            </Form.Control>

                        </Col>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.editUser()}>MODIFIER</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}