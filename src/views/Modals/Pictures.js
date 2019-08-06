import React, { Component } from 'react';
import { Modal, Row, Col, Carousel, Image } from 'react-bootstrap';

export default class Pictures extends Component {

    componentDidUpdate(prevProps, prevState) {
        //console.log(this.props.img)
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.hide} centered size='lg'>
                <Modal.Header>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <Carousel>
                                {
                                    this.props.img
                                        ?
                                        this.props.img.map(img =>
                                            <Carousel.Item key={this.props.img.indexOf(img)}>
                                                <Image src={img.picture} fluid />
                                            </Carousel.Item>
                                        )
                                        :
                                        null
                                }
                            </Carousel>
                        </Col>
                        <Col>
                            <div>
                                <h3>Description</h3>
                                <hr />
                                {this.props.description}
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        )
    }
}