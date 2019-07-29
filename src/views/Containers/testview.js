import React, { Component } from 'react';
import { Container, Form, Row, Button, Image, Modal, Col, Carousel } from 'react-bootstrap';
import { apiUrl } from '../../router';
import deepai from 'deepai';
import logo from "../../logo/vmk_v3_1.png";
import logoname from "../../logo/vmk_nom.png";

import FileBase64 from 'react-file-base64';

deepai.setApiKey('e1f1ce45-ca41-4f8b-877b-a7e25ccaf6f0');

export default class Test extends Component {

    state = {
        files: [],
        imagesgot: [],
        oneImg: null,
        show: false,
        index: 0,
        direction: null,
        loading: null,
    }

    send = (files) => {
        let b64 = [];
        files.map(file => {
            b64.push(file.base64)
        });
        this.setState({ oneImg: files[0].base64 })
        let data = new FormData();
        data.append('image', JSON.stringify(b64));
        data.append('aid', 2)
        fetch(`${apiUrl}uploadimages`, {
            method: 'post',
            headers: {
                'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token,
            },
            body: data
        }).then(response => response.json())
            .then(res => {
                if (res.status === 'error') console.log(res.response);
                else console.log(res);
            })
    }

    getImg = () => {
        fetch(`${apiUrl}getimage`, {
            method: 'get',
            headers: {
                'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token,
            }
        }).then(res => res.json())
            .then(res => {
                if (res.status === 'error') console.log(res.response[0]);
                else {
                    this.setState({ imagesgot: res.response })
                    console.log(res)
                };
            })
    }

    infoImg = (files) => {
        this.setState({ files, oneImg: files[0].base64 });
        console.log(files);
        files.map(img => {
            /*
            var resp;
            resp = deepai.callStandardApi("nsfw-detector", {
                image: img.base64,
            });

            console.log(resp);
            */
            /*
             unirest.post("https://vrate.p.rapidapi.com/mediarating")
                 .header("X-RapidAPI-Host", "vrate.p.rapidapi.com")
                 .header("X-RapidAPI-Key", "97c8c94d26msh9cba6e15ebacb35p1843cdjsn1624831f5f32")
                 .header("Content-Type", "application/json")
                 .send({ payload: img.base64 })
                 .end((result) => {
                     console.log(result.status, result.headers, result.body);
                 });
                 */
            console.log("contrôle de nudité à revoir")
        });
    }

    sendMail = () => {
        fetch(`${apiUrl}confvisit`, {
            method: 'get',
            headers: {
                'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token,
            }
        }).then(response => response.json())
            .then(res => {
                if (res.status === 'success') {
                    alert(res.response);
                    console.log(res.response)
                } else {
                    alert('error');
                    console.log('error')
                }
            })
    }

    componentDidMount() {
        this.getImg();
    }

    render() {
        setTimeout(() => { this.setState({ loading: 1 }) }, 2000)
        if (!this.state.loading) return (
            <div>Loading...</div>
        )
        return (
            <Container>
                <h1>Test ZONE</h1>
                <br />
                <h3>Upload Images</h3>
                <hr />
                <Form.Group>
                    <Form.Label>Images</Form.Label>
                    <br />
                    <FileBase64
                        multiple={true}
                        onDone={(files) => this.infoImg(files)}
                    />
                </Form.Group>
                <br />
                <Button onClick={() => this.send(this.state.files)}>SEND</Button>
                <br />
                <h3>Display Images</h3>
                <hr />
                <Row>
                    {
                        this.state.files.length > 0
                            ?
                            this.state.files.map(file =>
                                <div key={this.state.files.indexOf(file)} style={styles.thumbsContainer}>
                                    <div style={styles.thumb}>
                                        <div style={styles.thumbInner}>
                                            <Image onClick={() => this.setState({ oneImg: file.base64, show: true, index: this.state.files.indexOf(file) })} style={styles.img} src={file.base64} />
                                        </div>
                                    </div>
                                </div>
                            )
                            :
                            null
                    }
                </Row>
                <br />
                <h3>Display Images From DB</h3>
                <hr />
                <Row>
                    {/**/
                        this.state.imagesgot.length > 0
                            ?
                            this.state.imagesgot.map(img =>
                                <div key={this.state.imagesgot.indexOf(img)} style={styles.thumbsContainer}>
                                    <div style={styles.thumb}>
                                        <div style={styles.thumbInner}>
                                            <Image style={styles.img} src={img.picture} />
                                        </div>
                                    </div>
                                </div>
                            )
                            :
                            null
                    }

                </Row>
                {/*<Image src={this.state.oneImg ? this.state.oneImg : defaultImg} />*/}
                <br />
                <h3>Send an e-mail</h3>
                <hr />
                <Button onClick={() => this.sendMail()}>E-MAIL</Button>
                <br />
                <Image src={logo} fluid />
                <hr />
                <Image src={logoname} />
                <Modal show={this.state.show} onHide={() => this.setState({ show: false })} centered size='lg'>
                    <Modal.Header closeButton>
                        <Modal.Title>Titre Logement</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <Carousel
                                    activeIndex={this.state.index}
                                    direction={this.state.direction}
                                    onSelect={(selectedIndex, e) => {
                                        this.setState({
                                            index: selectedIndex,
                                            direction: e.direction,
                                        });
                                    }}
                                >
                                    {
                                        this.state.files.map(img =>
                                            <Carousel.Item key={this.state.files.indexOf(img)}>
                                                <Image fluid src={img.base64} />
                                            </Carousel.Item>
                                        )
                                    }

                                </Carousel>
                            </Col>
                            <Col>
                                <div>
                                    <h3>Description</h3>
                                    <hr />
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </Container>
        )

    }
}

const styles = {
    thumbsContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 16
    },
    thumb: {
        display: 'inline-flex',
        borderRadius: 2,
        border: '1px solid #eaeaea',
        marginBottom: 8,
        marginRight: 8,
        width: 100,
        height: 100,
        padding: 4,
        boxSizing: 'border-box'
    },
    thumbInner: {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden'
    },
    img: {
        display: 'block',
        width: 'auto',
        height: '100%'
    }
}

const defaultImg = 'data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMTI3Ljk4IDIwMTYuODciIGZpbGw9IiM0MWUwZmQiPgogIDxwYXRoICBkPSJNODg4IDExMTkuMTdjMTYtMzIuNjIgMzIuODQtNjUuMzcgNTAuMTctOTcuMzVsLjE1LS4yNyAxOC4zOS0zNS42OCAyNy4xNi00NSAuMTctLjI5YzEwLjE0LTE3LjI2IDIwLjY2LTM0LjY4IDMxLjI3LTUxLjc4bDE4LjY5LTMwLjg3YzI0Ljg4LTQxLjE5IDQ0Ljg4LTcxLjIzIDc2LjQzLTExNC43NiAxNy0yMy40MyAzMy4xMi00NCA1OC42Ni03NS45MmwuMDYtLjA2IDEuMjYtMS41OS40OS0uNjNjMTAuMzctMTMuMjIgMjAuODQtMjYuMjUgMzEuMTEtMzguNzNsLjM0LS40Mi4yLS4yNWMyMy44My0yOS41MSA0OC4xMi01OS4xMyA3Mi4xOS04OGw5LjU3LTExLjQ4VjM1Ni41NEgxMjY3Yy05LjIzLTguNjgtMTguNjYtMTcuMy0yOC4wOC0yNS42OS03Ni4zMi02Ny43Mi0xNTIuNDMtMTIwLjg1LTIyNi4yNy0xNTcuNzktNzUuNzEtMzcuOTItMTQ1LjYzLTU3LjE0LTIwNy44LTU3LjE0LTQ0LjM5IDAtODQuMDYgOS45NC0xMTcuOTEgMjkuNTMtMzIuNTUgMTguODQtNTkuOSA0Ni45MS04MS4zMSA4My40NC0yMC4wNiAzNC4yMy0zNC44NCA3NS44OS00My45NSAxMjMuODEtMTcuNTQgOTIuMzctMTMuNzQgMjA4IDExIDMzNC4zNCAzLjEyIDE1LjkgNi41NiAzMiAxMC4yNSA0OC0xOS43NCA2LTM4LjkxIDEyLjE4LTU3LjEzIDE4LjUzLTExOS4yNiA0MS41OC0yMTkgOTUuOTEtMjg4LjQyIDE1Ny4xNC0zNiAzMS43MS02My44NCA2NS4yMy04Mi44OSA5OS42Mi0yMC4yNCAzNi41Ny0zMC41MSA3NC4wOC0zMC41MSAxMTEuNDkgMCA3NSA0MS41NSAxNTEgMTIwLjE1IDIxOS45NCA3NCA2NC45MyAxNzguNjUgMTIxLjYyIDMwMi41NSAxNjQgMTEuNTEgMy45MSAyMy4yMiA3LjcxIDM1IDExLjM0LTQuMTIgMTcuOTMtNy45MyAzNi0xMS4zNiA1NC0yMy41NiAxMjQuMDgtMjYuMzEgMjM3LjYyLTggMzI4LjM1IDkuNTEgNDcgMjQuNjEgODcuODkgNDQuODkgMTIxLjU3IDIxLjU2IDM1LjggNDguOTMgNjMuNDQgODEuMzQgODIuMTMgMzQuMTUgMTkuNjkgNzQuMzQgMjkuNjcgMTE5LjQ1IDI5LjY3IDYxLjQyIDAgMTMwLjA5LTE4LjIxIDIwNC4xMS01NC4xMyA3Mi41Ni0zNS4yMSAxNDYuNjMtODUuNjQgMjIwLjEzLTE0OS44OSAxMS4zMy05LjkgMjMtMjAuNDkgMzQuNjYtMzEuNTNoMTcuNDF2LTE3NC4zOWwtNi4zNC03LjgtMy0zLjY3LTc5LjgyLTk4LjU1LTQ0LjM1LTU0Ljc1Yy0yMi4zOS0yNy42NC01OC4yNS03OC43OS0xMDEtMTQ0LTM0LTUxLjg0LTU4Ljc2LTkzLjQ3LTcwLjUtMTEzLjYzbC0xLjI4LTIuMjFjLTIwLjQ5LTM1LjMzLTM1LjcxLTYzLjc5LTQ3LjkzLTg2LjY0LTE1LjMtMjguNjMtMzAuMzktNTcuODctNDQuOTEtODdsMi42Ni01LjE3em0tODAuODYtMTcyLjg5Yy0xMy41My0zNC43LTI1LjkyLTY5LjEzLTM3LTEwMi44MSAzNC41Ny03LjEzIDcwLjUxLTEzLjUzIDEwNy4zMi0xOS4xMS0xMi4yOCAyMC4xMS0yNC4zNCA0MC40MS0zNiA2MC42NHMtMjMuMTIgNDAuNjktMzQuMzIgNjEuMjh6bS0zOC4yNSA0NjIuMWMxMS40NS0zNC44NiAyNC4zMS03MC41NiAzOC4zOS0xMDYuNTkgMTEuMjkgMjAuNyAyMi44NyA0MS4zIDM0LjU4IDYxLjUzIDEyLjI3IDIxLjE5IDI1IDQyLjQ4IDM3Ljk1IDYzLjU4LTM4LjQ2LTUuMzItNzUuNjItMTEuNTMtMTEwLjkyLTE4LjUxek03MDcuMTggMzk3LjE2YzktNjEuNzQgMjkuMTQtMTA1Ljg3IDU1LjM3LTEyMS4wNiAxMC44OS02LjMxIDI1LjM0LTkuNSA0Mi45My05LjUgMzguNDcgMCA4OC4yNCAxNS4xIDE0My45MSA0My42NyA2MC4zNCAzMSAxMjUuNzcgNzcuMTEgMTg5LjIyIDEzMy40NXE1LjkgNS4yNCAxMi4wNyAxMC44OWMtNTUuODEgNjEuNzEtMTEwLjgxIDEzMC4yOC0xNjMuNjggMjA0LjEtOTAuMDggOC44LTE3Ni42OCAyMS45NC0yNTcuNzYgMzkuMTEtMi45My0xMi44NC01LjY4LTI1Ljc1LTguMi0zOC41bC0uMjQtMS4zMmMtMTkuMzMtOTguNzYtMjQuMDQtMTg5LTEzLjYyLTI2MC44NHptMTEuMzEgNzI3Yy0zOC4xIDg0LTcwLjQ4IDE2Ny4xNi05Ni4zNyAyNDcuNDYtOS0yLjgtMTcuODktNS43Mi0yNi42NS04LjctMTAzLTM1LjIxLTE4OC43OS04MC42Ni0yNDguMDgtMTMxLjQzLTQ1LjM3LTM4Ljg1LTcyLjQ1LTc5LjgzLTcyLjQ1LTEwOS42MyAwLTMwLjU5IDI3LjA5LTcwIDc0LjM0LTEwOC4yIDU1LTQ0LjQ3IDEzMy4yNy04NS4xMSAyMjYuMTktMTE3LjUgMTUuNzktNS40OCAzMS44Ny0xMC43MyA0OC0xNS42NCAyNS41MyA3OS4xMyA1Ny40OCAxNjAuOTkgOTUuMDEgMjQzLjYzem0uMTIgNDc0LjkyYzIuODYtMTUgNi0zMC4wOSA5LjQzLTQ1LjA5IDgwIDE2LjM3IDE2Ny41OSAyOC43MSAyNjAuNzUgMzYuNzEgNTMuMzggNzQuMzQgMTA4Ljg0IDE0My4zNyAxNjUuMDUgMjA1LjQ0LTYuOTQgNi4zOS0xMy45NCAxMi42OC0yMC45IDE4Ljc5LTgxLjM3IDcxLjEzLTE2My4wOSAxMjIuNTUtMjM2LjI4IDE0OC43MWwtMS41Mi41NGMtMzIuOCAxMS41OC02Mi4wOSAxNy40NS04NyAxNy40NS0xOC4zOCAwLTMzLjIyLTMuMTgtNDQuMTEtOS40Ni0yNi41MS0xNS4yOS00Ny4xNC01OC40Ni01Ni42LTExOC40NS0xMS4wNi02OS45MS03LjE5LTE1Ny45NyAxMS4xNy0yNTQuNjV6IgogICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyMy45OCAtMTE1LjkyKSIgaWQ9Il9Hcm91cF8iIGRhdGEtbmFtZT0iJmx0O0dyb3VwJmd0OyIgLz4KICA8cGF0aCBkPSJNMjE5NS4wNyAxMjA1LjFxLTU2LjI2LTEwMy40NS0xNjUuNTQtMTM0LjIzYTIuODUgMi44NSAwIDAgMS0xLjc5LTIuODUgMyAzIDAgMCAxIDEuMzctMi42OGM1NC4yNC0zMC4xNiA5NS45My03My4xMSAxMjUuMTUtMTI3LjlxNDQuMTUtODIuODkgNDQuMTYtMTk5LjQ5YzAtMTI4LjI1LTMyLjQ1LTIyMy42NS05Ny4wNi0yODcuMTFzLTE1MC42Mi05NS0yNTcuNy05NWgtNTc4LjM1Yy0xLjI1IDAtMi4yNyAxLjMxLTIuMjcgMi45M1YxODk0LjNjMCAxLjYyIDEgMi45MyAyLjI3IDIuOTNoNTQ2LjU3cTExNS40MiAwIDE5OS4xMS0zMy42OWM1NS45MS0yMi40MiAxMDEuNC01Mi42OCAxMzcuMjEtOTAuNjhzNjEuOTItODMuMzMgNzguNjYtMTM2YzE2Ljc0LTUyLjIzIDI1LjEtMTA4LjggMjUuMS0xNjkuMjQuMDQtMTA1LjM3LTE5LjA4LTE5Mi41Ny01Ni44OS0yNjIuNTJ6bS03MjIuMzItNjI4YzAtMS42MiAxLTIuOTMgMi4yNy0yLjkzaDMzOS40NmM1Ni45NSAwIDEwMC41MSAxNiAxMzAuNjUgNDcuNTVzNDUuMiA4Ni40IDQ1LjIgMTY0LjE4YzAgNjkuMTgtMTYuNzQgMTIxLjkyLTUwLjI1IDE1OS4wOHMtNzUuMzcgNTUuMzItMTI1LjYzIDU1LjMySDE0NzVjLTEuMjUgMC0yLjI3LTEuMzEtMi4yNy0yLjkzem01MTguMTYgMTAzNS44Yy0zNC44NiA0Mi43Ni04NC40MSA2NC0xNDguMDcgNjRIMTQ3NWMtMS4yNSAwLTIuMjctMS4zMS0yLjI3LTIuOTN2LTQ3Ni40YzAtMS42MiAxLTIuOTMgMi4yNy0yLjkzaDM2Ny44MmM2My42NiAwIDExMi41NyAxOS44OSAxNDguMDcgNjEuMzVzNTIuOTMgOTkuODIgNTIuOTMgMTc2LjNjLjAyIDc3Ljc3LTE3Ljc2IDEzOC4yNy01Mi45MSAxODAuNjF6IgogICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyMy45OCAtMTE1LjkyKSIgLz48L3N2Zz4K';