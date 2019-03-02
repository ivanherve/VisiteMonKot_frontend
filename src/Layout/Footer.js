import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import '../App.css';

class Footer extends Component {
    render() {
        return (
            <div>
                <Navbar collapseOnSelect expand="lg" bg="success" variant="dark" fixed='bottom'>
                    <div>visitemonkot.be</div>
                </Navbar>
            </div>
        );
    }
}

export default Footer;