import React, { Component } from 'react';
import { Button, Card, CardGroup, Col, Container, Form, FormGroup, Row } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
//import '../../App.css';
import backgroundImg from '../../logo/Accommodation-background.jpg';
import { apiUrl } from '../../router';
import SignUp from './SignUp';
import swal from 'sweetalert';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      redirect: false,
    }
    this.signIn = this.signIn.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
  }

  handleEmail(e) {
    this.setState({ email: e.target.value });
  }

  handlePassword(p) {
    this.setState({ password: p.target.value })
  }

  signIn = () => {
    fetch(apiUrl + 'signin', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(response => response.json())
      .then(res => {
        if (res.status === 'success') {
          sessionStorage.setItem('userData', JSON.stringify(res.response));
          this.setState({ redirect: true });
        }
        else {
          swal({
            icon: 'warning',
            text: res.response[0]
          });
          console.log(res.response)
        }
      })
      .catch(err => {
          swal("Oups!", "Une erreur est survenue", "error");
          console.log(err)
      })
  }

  pwdLost = () => {
    let data = new FormData();
    data.append('email', this.state.email);
    swal({
      title: 'Mot de passe perdu',
      text: 'En poursuivant, vous recevrez un mail avec un nouveau mot de passe généré aléatoirement que vous devrez changer lors de votre première utilisation. \n\n Êtes-vous sûr de vouloir poursuivre ?',
      icon: 'warning',
      dangerMode: true,
      buttons: ["Annuler", "Poursuivre"]
    })
      .then(ok => {
        if (ok) {
          fetch(`${apiUrl}pwdlost`, {
            method: 'post',
            body: data
          })
            .then(response => response.json())
            .then(res => {
              if (res.status === 'error') {
                swal({
                  text: res.response[0],
                  icon: 'warning'
                })
              } else {
                swal({
                  text: res.response,
                  icon: 'success'
                })
              }
            })
            .catch(err => {
                swal("Oups!", "Une erreur est survenue", "error");
                console.log(err)
            })
        }
      })
  }

  render() {
    if (this.state.redirect) {
      return (<Redirect to="/" />)
    }
    if (sessionStorage.getItem('userData')) {
      return (<Redirect to="/" />)
    }
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
                        <Form.Control type="email" name="email" placeholder="adresse@email.be" onChange={this.handleEmail} />
                        <Form.Text className="text-muted">
                          Cette adresse e-mail ne sera en aucun cas partagé à qui que ce soit.
                        </Form.Text>
                      </FormGroup>
                      <Form.Group controlId="formBasicPassword">
                        <Form.Label>Mot de passe</Form.Label>
                        <Form.Control type="password" name="password" placeholder="Mot de passe" onChange={this.handlePassword} />
                      </Form.Group>
                      <Row>
                        <Col xs={6}>
                          <Button variant="primary" onClick={this.signIn}>
                            Se connecter
                          </Button>
                        </Col>
                        <Col xs={6} className="text-right" onClick={() => this.pwdLost()}>
                          <Button variant="outline-primary">Mot de passe oublié ?</Button>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
                <Card bg="success" style={{ color: 'white' }}>
                  <Card.Header className="text-center">
                    <Card.Title><h1>Inscription</h1></Card.Title>
                  </Card.Header>
                  <SignUp redirection={() => this.setState({ redirect: true })} />
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
    backgroundColor: '#c6f7d6',
    //backgroundImage: 'url(' + backgroundImg + ')',
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