import React, { Component } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, Route } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../App.css';
import logo from '../logo/vmk_v5_1.svg';

class Header extends Component {
    render() {
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
                            <NavDropdown title={<FontAwesomeIcon icon={["fas","cog"]} style={styles.links}/>}>
                                <NavDropdown.Item>Modifier mes informations</NavDropdown.Item>
                                <NavDropdown.Item>Modifier mon mot de passe</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item>Separated link</NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link style={styles.links}><FontAwesomeIcon icon={["fas","user"]} style={styles.links} /></Nav.Link>
                            <Nav.Link eventKey={2}>
                                <Link to="/login" style={styles.links}><FontAwesomeIcon icon={["fas","sign-out-alt"]} /></Link> 
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