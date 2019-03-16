import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { Button, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import '../App.css';
import logo from '../logo/vmk_v5_1.svg';
import { apiUrl } from '../router';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            user: [],
        }
    }
    signOut = () => {
        fetch(apiUrl + 'signout', {
            method: 'post',
            headers: {
                api_token: JSON.parse(sessionStorage.getItem('userData')).token.api_token,
            }
        })
            .then(response => response.json())
            .then(res => {
                if (res.status === 'success') {
                    sessionStorage.setItem('userData', '');
                    sessionStorage.clear();
                    //this.setState({redirect: true});
                    alert(res.response);
                    //return (<Redirect to='/login' />)
                    this.props.onClick();
                }
                else console.log(res.response);
            })
    }

    componentWillMount() {
        if (sessionStorage.getItem('userData')) {
            this.setState({ user: JSON.parse(sessionStorage.getItem('userData')).user });
            console.log(JSON.parse(sessionStorage.getItem('userData')).user);
            console.log(this.state.user)

        } else {
            this.setState({ redirect: true })
        }
    }

    render() {
        /*
        if (this.state.redirect) {
            return (<Redirect to="/login" />)
        }
        */
        if (sessionStorage.getItem('userData')) {
            let user = JSON.parse(sessionStorage.getItem('userData')).user;
            return (
                <div>
                    <Navbar collapseOnSelect expand="lg" bg="success" variant="dark" fixed='top'>
                        <Navbar.Brand href="/accomodations">
                            <img src={logo} style={styles.links} alt="logo" />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="mr-auto">
                                <Nav.Item><Nav.Link><Link style={styles.links} to="/annonces">Mes annonces</Link></Nav.Link></Nav.Item>
                                <Nav.Item><Nav.Link><Link style={styles.links} to="/visites">Mes visites</Link></Nav.Link></Nav.Item>
                            </Nav>
                            <Nav>
                                <NavDropdown title={<FontAwesomeIcon icon={["fas", "cog"]} style={styles.links} />}>
                                    <NavDropdown.Item>Modifier mes informations</NavDropdown.Item>
                                    <NavDropdown.Item>Modifier mon mot de passe</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item>Separated link</NavDropdown.Item>
                                </NavDropdown>
                                <Nav.Link style={styles.links}>
                                    <FontAwesomeIcon icon={["fas", "user"]} style={styles.links} />
                                </Nav.Link>
                                <Nav.Link eventKey={2}>
                                    <Button style={styles.links} onClick={() => this.signOut()}><FontAwesomeIcon icon={["fas", "sign-out-alt"]} /> Déconnexion</Button>
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>

                </div>
            );
        }
        return (
            <div>
                <Navbar collapseOnSelect expand="lg" bg="success" variant="dark" fixed='top'>
                    <Navbar.Brand href="/accomodations">
                        <img src={logo} style={styles.links} alt="logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">

                        </Nav>
                        <Nav>
                            <Nav.Link href="/login" eventKey={2}>
                                <Button style={styles.links}>
                                    Connexion
                                </Button>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}

const styles = {
    links: {
        color: '#fff'
    }
}

export default Header;