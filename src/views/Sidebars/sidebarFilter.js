import React, { Component } from 'react';
import { Card, Form, Col, Row } from 'react-bootstrap';

export default class SideBarFilter extends Component {
    render() {
        return (
            <nav className="sidebar-wrapper">
                <div className="sidebar-content" style={{ maxWidth: '210px', overflow: 'auto', display: window.innerWidth <= 1500 ? 'none' : null}}>
                    <Card>
                        <article className="card-group-item">
                            <Card.Header>
                                <Card.Title>
                                    <h6>Ma recherche</h6>
                                </Card.Title>
                            </Card.Header>
                            <div className="filter-content">
                                <Card.Body>
                                    <Form>
                                        <Form.Check
                                            custom
                                            type="radio"
                                            label={<div style={{ fontSize: '0.7rem' }}>du plus récent au moins</div>}
                                            name="filter"
                                            id="f1"
                                            onChange={this.props.sortfromnewest}
                                        />
                                        <Form.Check
                                            custom
                                            type="radio"
                                            label={<div style={{ fontSize: '0.7rem' }}>du plus ancien au moins</div>}
                                            name="filter"
                                            id="f2"
                                            onChange={this.props.sortfromoldest}
                                        />
                                        <Form.Check
                                            custom
                                            type="radio"
                                            label={<div style={{ fontSize: '0.7rem' }}>prix par ordre croissant</div>}
                                            name="filter"
                                            id="f3"
                                            onChange={this.props.sortfromcheapest}
                                        />
                                        <Form.Check
                                            custom
                                            type="radio"
                                            label={<div style={{ fontSize: '0.7rem' }}>prix par ordre décroissant</div>}
                                            name="filter"
                                            id="f4"
                                            onChange={this.props.sortfrommostexpensive}
                                        />
                                    </Form>
                                </Card.Body>
                            </div>
                        </article>
                        <hr />
                        <article className="card-group-item">
                            <div className="filter-content">
                                <Card.Body>
                                    <Form>
                                        <Form.Control placeholder="Ville" type="text" onChange={this.props.filterCity} />
                                    </Form>
                                    <br />
                                    <Row>
                                        <Col>
                                            <Form>
                                                <Form.Control type="number" min={0} placeholder="€ min" onChange={this.props.filterMin} />
                                            </Form>
                                        </Col>
                                        <Col>
                                            <Form>
                                                <Form.Control type="number" min={this.props.min} placeholder="€ max" onChange={this.props.filterMax} />
                                            </Form>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </div>
                        </article>
                        <article className="card-group-item">
                            <hr />
                            <div className="filter-content">
                                <Card.Body>
                                    <h6>Type</h6>
                                    <Form>
                                        <Form.Check
                                            custom
                                            //checked
                                            type="radio"
                                            label='Tout'
                                            name="formHorizontalRadios"
                                            id='Tout'
                                            onChange={this.props.changetype}
                                        />
                                        {/**/
                                            this.props.types.map(type =>
                                                <Form.Check
                                                    key={this.props.types.indexOf(type)}
                                                    custom
                                                    type="radio"
                                                    label={type.type}
                                                    name="formHorizontalRadios"
                                                    id={type.type}
                                                    onChange={this.props.changetype}
                                                />
                                            )
                                        }
                                    </Form>
                                </Card.Body>
                            </div>
                        </article>
                        <article className="card-group-item">
                            <hr />
                            <div className="filter-content">
                                <Card.Body>
                                    <h6>Équipements</h6>
                                    <Form>
                                        <Form.Check
                                            custom
                                            //checked
                                            type="checkbox"
                                            label='WiFi'
                                            name="formHorizontalRadios"
                                            id='WiFi'
                                            onChange={this.props.filterWifi}
                                        />
                                        <Form.Check
                                            custom
                                            //checked
                                            type="checkbox"
                                            label='Meublé'
                                            name="formHorizontalRadios"
                                            id='Meublé'
                                            onChange={this.props.filterFurnitures}
                                        />
                                    </Form>
                                </Card.Body>
                            </div>
                        </article>
                        <article className="card-group-item">
                            <div className="filter-content">
                                <Card.Body>
                                    <h6>Autres</h6>
                                    <Form>
                                        <Form.Check
                                            custom
                                            type="checkbox"
                                            label={<div>n'ont jamais été visité</div>}
                                            name="filter"
                                            id="f5"
                                            onChange={this.props.filterNotVisited}
                                        />
                                        <Form.Check
                                            custom
                                            disabled={!sessionStorage.getItem('userData')}
                                            type="checkbox"
                                            label={<div>je n'ai pas publié</div>}
                                            name="filter"
                                            id="f6"
                                            onChange={this.props.filterNotPublished}
                                        />
                                    </Form>
                                </Card.Body>
                            </div>
                        </article>

                    </Card>
                </div>
            </nav>
        )
    }
}