import React, { Component } from 'react';
//import '../../App.css';
import backgroundImg from '../../logo/Accommodation-background.jpg';
import { Container, Card, Row, Col, Form, FormGroup, Button, CardGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Login extends Component {
  render() {
    return (
      <div style={styles.content}>
        <Container>
          <Row style={{ justifyContent: 'center' }}>
            <Col md={8}>
              <CardGroup>
                <Card>
                  <Card.Header className="text-center">
                    <Card.Title><h1>Connexion</h1></Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      <p className="text-muted">Connectez-vous à votre compte</p>
                      <FormGroup>
                        <Form.Label>Adresse e-mail</Form.Label>
                        <Form.Control type="email" placeholder="adresse@email.be" />
                        <Form.Text className="text-muted">
                          Cette adresse e-mail ne sera en aucun cas partagé à qui que ce soit.
                      </Form.Text>
                      </FormGroup>
                      <Form.Group controlId="formBasicPassword">
                        <Form.Label>Mot de passe</Form.Label>
                        <Form.Control type="password" placeholder="Mot de passe" />
                      </Form.Group>
                      <Row>
                        <Col xs={6}>
                          <Button variant="primary"><Link style={{color: '#fff'}} to="/accomodations">Se Connecter</Link></Button>
                        </Col>
                        <Col xs={6} className="text-right">
                          <Button variant="outline-primary">Mot de passe oublié ?</Button>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
                <Card bg="success" style={{ width: '44%', color: 'white' }}>
                  <Card.Body className="text-center">
                    <div>
                      <h2>Inscription</h2>
                      <p>Cherchez, Annoncez et organisez des visites de la plus simple des façons</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Inscrivez-vous maintenant!</Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const styles = {
  content: {
    backgroundImage: 'url(' + backgroundImg + ')',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '0',
    alignItems: 'center',
    display: 'flex',
    height: '100vh',
    margin: '0',
  }
}

export default Login;