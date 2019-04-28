import React, { Component } from 'react';
import { Card, Form, Col, Row } from 'react-bootstrap';

export default class SideBarFilter extends Component {
    render() {
        return (
            <nav className="sidebar-wrapper">
                <div className="sidebar-content" style={{ maxWidth: '200px', overflow: 'auto' }}>
                    <Card>
                        <article class="card-group-item">
                            <Card.Header>
                                <Card.Title>
                                    <h6>Filtrer</h6>
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
                                            label={<div style={{ fontSize: '0.7rem' }}>du moins cher au plus cher</div>}
                                            name="filter"
                                            id="f3"
                                            onChange={this.props.sortfromcheapest}
                                        />
                                        <Form.Check
                                            custom
                                            type="checkbox"
                                            label={<div style={{ fontSize: '0.7rem' }}>ceux qui n'ont jamais été visité</div>}
                                            name="filter"
                                            id="f4"
                                            onChange={this.props.filterNotVisited}
                                        />
                                        <Form.Check
                                            custom
                                            disabled={!sessionStorage.getItem('userData')}
                                            type="checkbox"
                                            label={<div style={{ fontSize: '0.7rem' }}>ceux que je n'ai pas publié</div>}
                                            name="filter"
                                            id="f5"
                                            onChange={this.props.filterNotPublished}
                                        />
                                    </Form>
                                </Card.Body>
                            </div>
                        </article>
                        <article class="card-group-item">
                            <Card.Header>
                                <Card.Title>
                                    <h6>Prix</h6>
                                </Card.Title>
                            </Card.Header>
                            <div className="filter-content">
                                <Card.Body>
                                    <Form as={Row}>
                                        <Form.Group>
                                            <Col>
                                                <Form.Label>Min</Form.Label>
                                                <Form.Control type="number" min={0} placeholder="0 €" onChange={this.props.filterMin} />
                                            </Col>
                                            <Col>
                                                <Form.Label>Max</Form.Label>
                                                <Form.Control type="number" min={this.props.min} placeholder="200 €" onChange={this.props.filterMax} />
                                            </Col>
                                        </Form.Group>
                                    </Form>
                                </Card.Body>
                            </div>
                        </article>
                        <article class="card-group-item">
                            <Card.Header>
                                <Card.Title>
                                    <h6>Type</h6>
                                </Card.Title>
                            </Card.Header>
                            <div className="filter-content">
                                <Card.Body>
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
                        <article class="card-group-item">
                            <Card.Header>
                                <Card.Title>
                                    <h6>Caractéristique</h6>
                                </Card.Title>
                            </Card.Header>
                            <div className="filter-content">
                                <Card.Body>
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
                    </Card>
                </div>
            </nav>
        )
    }
}