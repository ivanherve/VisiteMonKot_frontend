import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { Button, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css';
import logo from '../logo/vmk_v5_1.svg';
import { apiUrl } from '../router';
import swal from 'sweetalert';

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
            method: 'get',
            headers: {
                'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token,
            }
        })
            .then(response => response.json())
            .then(res => {
                //if (res.status === 'success') {
                sessionStorage.setItem('userData', '');
                sessionStorage.clear();
                //this.setState({redirect: true});
                swal(res.response);
                //return (<Redirect to='/login' />)
                this.props.onClick();
                console.log(res.response);
                //}
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
                                <Nav.Item>
                                    <Link className="nav-link" to="/advertisments">Mes annonces</Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Link className="nav-link" to="/visits">Mes visites</Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Link className="nav-link" to="/likes">Mes favoris</Link>
                                </Nav.Item>
                                {
                                    user.profil_id === 3
                                        ?
                                        <Nav.Item>
                                            <Link className="nav-link" to="/admin">Gestion</Link>
                                        </Nav.Item>
                                        :
                                        null
                                }
                                {/**/
                                    user.profil_id === 5
                                        ?
                                        <Nav.Item>
                                            <Link className="nav-link" to="/test">Test</Link>
                                        </Nav.Item>
                                        :
                                        null
                                }
                            </Nav>
                            <Nav>
                                <Nav.Link>
                                    <Link className="nav-link" to="/profile"><FontAwesomeIcon icon={["fas", "user"]} /> {user.Firstname} {user.Surname}</Link>
                                </Nav.Link>
                                <NavDropdown title="Paramètres" className="nav-link"
                                //<FontAwesomeIcon icon={["fas", "cog"]} style={styles.links} />+
                                // {Paramètres}
                                >
                                    <NavDropdown.Item><Link to={'/profile/reset/' + user.user_id}>Modifier mon mot de passe</Link></NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item><Link to="/contact">Contacter l'équipe VisiteMonKot</Link></NavDropdown.Item>
                                </NavDropdown>
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
                            <Nav.Item>
                                <Nav.Link disabled to="/advertisments">Mes annonces</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link disabled to="/visits">Mes visites</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link disabled className="nav-link" to="/likes">Mes favoris</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Nav>
                            <Nav.Link disabled>
                                <Link className="nav-link" to="/profile"><FontAwesomeIcon icon={["fas", "user"]} /> Profil</Link>
                            </Nav.Link>
                            <Nav.Link disabled>
                                <Link className="nav-link" to="/profile">
                                    Paramètres
                                </Link>
                            </Nav.Link>
                            <Nav.Link href="/login" eventKey={2}>
                                <Button style={styles.links}>
                                    Connexion / Inscription
                                </Button>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div >
        );
    }
}

const styles = {
    links: {
        color: '#fff'
    }
}

export default Header;