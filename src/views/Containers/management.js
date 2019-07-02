import React, { Component } from 'react';
import { Container, Col, ListGroup, Card, Row, Form, DropdownButton, Dropdown, Button, FormControl } from 'react-bootstrap';
import { apiUrl } from '../../router';
import swal from 'sweetalert';
import moment from 'moment';
import StickyBox from "react-sticky-box";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RemoveAccess from '../Modals/removeaccess';
import SignOutAUser from '../Modals/signoutAUser';
import AdminSendMsg from '../Modals/adminSendMsg';
import AdminEditInfo from '../Modals/adminEditInfo';
import AuthoriseAccess from '../Modals/authorizeaccess';

export default class Management extends Component {

    constructor() {
        super();
        this.state = {
            allUsers: [],
            targetUser: {},
            profiles: []
        }
    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers = () => {
        fetch(`${apiUrl}users`, {
            method: 'get',
            headers: {
                api_token: JSON.parse(sessionStorage.getItem('userData')).token.api_token
            }
        }).then(response => response.json())
            .then(res => {
                if (res.status === 'error') {
                    swal({
                        text: res.response[0],
                        icon: 'warning'
                    })
                } else {
                    console.log(res.response[0]);
                    this.setState({ allUsers: res.response, targetUser: res.response[0] });
                    this.getProfiles();
                }
            })
    }

    getProfiles = () => {
        fetch(`${apiUrl}profiles`, {
            method: 'get',
            headers: {
                api_token: JSON.parse(sessionStorage.getItem('userData')).token.api_token
            }
        }).then(response => response.json())
            .then(res => {
                if (res.status === 'error') {
                    swal({
                        text: res.response[0],
                        icon: 'warning'
                    })
                } else {
                    //console.log(res.response[0]);
                    this.setState({ profiles: res.response });
                }
            })
    }

    render() {
        return (
            <Container>
                <h1>Gestion</h1>
                <Row>
                    <Col xs='1'>
                        <DropdownButton style={{ width: '100%' }} title='Gérer' variant='outline-success'>
                            <Dropdown.Item>
                                Utilisateurs
                            </Dropdown.Item>
                            <Dropdown.Item>
                                Messages
                            </Dropdown.Item>
                        </DropdownButton>
                    </Col>
                </Row>
                <br />
                <Utilisateurs
                    allUsers={this.state.allUsers}
                    user={this.state.targetUser}
                    profiles={this.state.profiles}
                />
                <br />

            </Container>
        )
    }
}

export class Utilisateurs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            targetUser: null,
            query: '',
            showRemove: false,
            showSignOut: false,
            showMsg: false,
            showEdit: false,
            showAuthorize: false,
        }
    }

    componentDidMount() {
        console.log(this.props.user)
    }

    setStyle = (profile) => {
        let style;
        switch (profile) {
            case 1: style = {
                fontStyle: 'italic',
                color: 'orange'
            };
                break;
            case 2: style = styles.online;
                break;
            case 3: style = {
                fontStyle: 'italic',
                color: 'blue',
                fontWeight: 'bold'
            };
                break;
            case 4: style = styles.notonline;
                break;
            default: style = {
                fontStyle: 'italic'
            }
        }
        return style;
    }

    setStyleForList = (profile) => {
        let style;
        switch (profile) {
            case 1: style = {
                fontSize: '0.7rem',
                fontStyle: 'italic',
                color: 'orange'
            };
                break;
            case 2: style = {
                fontSize: '0.7rem',
                fontStyle: 'italic',
                color: 'green'
            };
                break;
            case 3: style = {
                fontSize: '0.7rem',
                fontStyle: 'italic',
                color: 'blue'
            };
                break;
            case 4: style = {
                fontSize: '0.7rem',
                fontStyle: 'italic',
                color: 'red'
            };
                break;
            default: style = {
                fontSize: '0.7rem',
                fontStyle: 'italic'
            }
        }
        return style;
    }

    render() {
        let user = this.state.targetUser ? this.state.targetUser : this.props.user;
        let users = this.props.allUsers.sort((a, b) => (a.names > b.names) ? 1 : (b.names > a.names) ? -1 : 0);
        let filteredUsers = this.state.query.length > 0 ? users.filter(
            u => {
                return u.names.toLowerCase().indexOf(this.state.query) !== -1;
            }
        ) : users;
        return (
            <Card>
                <Card.Header>
                    <Row>
                        <Col>
                            <Card.Title>Utilisateurs</Card.Title>
                        </Col>
                        <Col>
                            <Form as={Row}>
                                <Col xs='10'>
                                    <FormControl
                                        type="text"
                                        placeholder='Rechercher ...'
                                        className="mr-sm-2"
                                        onChange={e => this.setState({ query: e.target.value.toLowerCase() })}
                                    />
                                </Col>
                                <Col xs='2'>
                                    <Button style={{ width: '100%' }} variant="outline-success">
                                        <FontAwesomeIcon icon={['fas', 'search']} />
                                    </Button>
                                </Col>
                            </Form>
                        </Col>
                    </Row>
                </Card.Header>
                <Row>
                    <Col xs='3'>
                        <ListGroup variant='flush'>
                            {
                                filteredUsers.map(u =>
                                    <ListGroup.Item
                                        key={u.user_id}
                                        action
                                        variant={u.nbTokenActifs > 0 ? 'success' : 'light'}
                                        onClick={() => this.setState({ targetUser: u })}
                                    >
                                        <div>{u.names}</div>
                                        <div style={this.setStyleForList(u.profil_id)}>{u.profilName}</div>
                                    </ListGroup.Item>
                                )
                            }
                        </ListGroup>
                    </Col>
                    <Col xs='9'>
                        <StickyBox offsetTop={20} offsetBottom={20}>
                            <Card.Body>
                                <h1>{user.names}</h1>
                                <Row>
                                    <Col>
                                        <Button
                                            style={{ width: '100%' }}
                                            disabled={user.profil_id === 3 || user.nbTokenActifs === null}
                                            onClick={() => this.setState({ showSignOut: true })}
                                            variant={user.profil_id === 3 ? 'light' : 'outline-warning'}>
                                            Déconnecter <FontAwesomeIcon icon={["fas", "sign-out-alt"]} />
                                        </Button>
                                    </Col>
                                    <Col>
                                        {
                                            user.profil_id === 4
                                                ?
                                                <Button
                                                    style={{ width: '100%' }}
                                                    disabled={user.profil_id === 3}
                                                    onClick={() => this.setState({ showAuthorize: true })}
                                                    variant={user.profil_id === 3 ? 'light' : 'outline-success'}>
                                                    Autoriser l'accès <FontAwesomeIcon icon={["fas", "check"]} />
                                                </Button>
                                                :
                                                <Button
                                                    style={{ width: '100%' }}
                                                    disabled={user.profil_id === 3}
                                                    onClick={() => this.setState({ showRemove: true })}
                                                    variant={user.profil_id === 3 ? 'light' : 'outline-danger'}>
                                                    Retirer ses accès <FontAwesomeIcon icon={["fas", "times"]} />
                                                </Button>
                                        }
                                    </Col>
                                    <Col>
                                        <Button
                                            style={{ width: '100%' }}
                                            variant='outline-secondary'
                                            onClick={() => this.setState({ showEdit: true })}>
                                            Modifier <FontAwesomeIcon icon={["fas", "edit"]} />
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button
                                            style={{ width: '100%' }}
                                            disabled={user.profil_id === 3}
                                            onClick={() => this.setState({ showMsg: true })}
                                            variant={user.profil_id === 3 ? 'light' : 'outline-primary'}>
                                            Contacter <FontAwesomeIcon icon={["fas", "envelope"]} />
                                        </Button>
                                    </Col>
                                </Row>
                                <hr />
                                <Form.Group as={Row}>
                                    <Form.Label sm='3' column style={styles.label}>Adresse e-mail</Form.Label>
                                    <Col sm='9'>
                                        <Form.Control plaintext readOnly value={user.email} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label sm='3' column style={styles.label}>Profile</Form.Label>
                                    <Col sm='9'>
                                        <Form.Control style={this.setStyle(user.profil_id)} plaintext readOnly value={user.profilName} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label sm='3' column style={styles.label}>Nombre de connection</Form.Label>
                                    <Col sm='9'>
                                        <Form.Control plaintext readOnly value={user.nbToken ? user.nbToken : 0} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label sm='3' column style={styles.label}>Etat</Form.Label>
                                    <Col sm='9'>
                                        <Form.Control style={user.nbTokenActifs > 0 ? styles.online : styles.notonline} plaintext readOnly value={user.nbTokenActifs > 0 || !user.nbTokenActifs ? `En ligne ${user.nbTokenActifs}` : 'Hors ligne'} />
                                    </Col>
                                </Form.Group>
                                <hr />
                                <Form.Group as={Row}>
                                    <Form.Label sm='3' column style={styles.label}>Date d'inscription</Form.Label>
                                    <Col sm='9'>
                                        <Form.Control plaintext readOnly value={moment(user.create_time).format('LL')} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label sm='3' column style={styles.label}>Nombre de visites</Form.Label>
                                    <Col sm='9'>
                                        <Form.Control plaintext readOnly value={user.nbVisites} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label sm='3' column style={styles.label}>Nombre d'anonnces</Form.Label>
                                    <Col sm='9'>
                                        <Form.Control plaintext readOnly value={user.nbAnnonces} />
                                    </Col>
                                </Form.Group>
                            </Card.Body>
                        </StickyBox>
                    </Col>
                </Row>
                <RemoveAccess
                    show={this.state.showRemove}
                    hide={() => this.setState({ showRemove: false })}
                    name={user.names}
                    uid={user.user_id}
                />
                <SignOutAUser
                    show={this.state.showSignOut}
                    hide={() => this.setState({ showSignOut: false })}
                    name={user.names}
                    uid={user.user_id}
                />
                <AdminSendMsg
                    show={this.state.showMsg}
                    hide={() => this.setState({ showMsg: false })}
                    name={user.names}
                />
                <AdminEditInfo
                    show={this.state.showEdit}
                    hide={() => this.setState({ showEdit: false })}
                    user={user}
                    profiles={this.props.profiles}
                />
                <AuthoriseAccess
                    show={this.state.showAuthorize}
                    hide={() => this.setState({ showAuthorize: false })}
                    name={user.names}
                    uid={user.user_id}
                />
            </Card>
        )
    }
}

const styles = {
    label: {
        fontWeight: 'bold'
    },
    online: {
        fontStyle: 'italic',
        color: 'green'
    },
    notonline: {
        fontStyle: 'italic',
        color: 'red'
    }
}