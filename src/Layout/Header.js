import React, { Component } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import '../App.css';
import logo from '../logo/vmk_v5_1.svg';

class Header extends Component {
    render() {
        return (
            <div>
                <Navbar collapseOnSelect expand="lg" bg="success" variant="dark" fixed='top'>
                    <Navbar.Brand href="/accomodations">
                        <img src={logo} style={{ color: "#fff" }} alt="logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Item><Nav.Link href="#annonces">Mes annonces</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link href="#pricing">Mes visites</Nav.Link></Nav.Item>
                        </Nav>
                        <Nav>
                            <NavDropdown title="Paramètres" id="collasible-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Modifier mes informations</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Modifier mon mot de passe</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href="#deets">Profile</Nav.Link>
                            <Nav.Link eventKey={2} href="#memes">
                                Deconnection
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}

export default Header;