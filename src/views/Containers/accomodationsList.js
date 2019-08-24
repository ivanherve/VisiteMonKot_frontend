import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { Button, Col, Container, FormControl, Image, ListGroup, OverlayTrigger, Row, Tooltip, Badge, Popover, Card } from 'react-bootstrap';
import StickyBox from "react-sticky-box";
import '../../App.css';
import bedroom from '../../Pictures/bedroom-ex_2.jpg';
import building from '../../Pictures/building_2.jpg';
import garage from '../../Pictures/garage-example_2.jpg';
import house from '../../Pictures/house-example_2.jpg';
import backgroundImg from '../../Pictures/Shrug-Emoji.jpg';
import { apiUrl } from '../../router';
import VisitAccomodation from '../Modals/visitAccomodation';
import SideBarFilter from '../Sidebars/sidebarFilter';
import swal from 'sweetalert';
import InfiniteScroll from 'react-infinite-scroller';
import Pictures from '../Modals/Pictures';
import LoadingComponent from './LoadingComponent';
import moment from 'moment';


export default class AccomodationsList extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      accomodations: [],
      query: '',
      queryCity: '',
      priceMin: 0,
      priceMax: 0,
      max: 0,
      types: [],
      oneType: '',
      isSortedFromNewest: false,
      isSortedFromOldest: false,
      isSortedFromCheapest: false,
      isSortedFromMostExpensive: false,
      toFilterNotVisited: false,
      toFilterNotPublished: false,
      toFilterWifi: false,
      toFilterFurnitures: false,
      showToVisit: false,
      targetAcc: {},
      datesVisit: [],
      hasMoreAccomo: true,
      showPictures: false,
      firstPic: '../../logo/vmk_v5.ico',
      loading: null,
    }
  }

  fetchTypes = () => {
    fetch(apiUrl + 'types')
      .then(response => response.json())
      .then(res => {
        if (res.status === 'error') {
          swal(res.response[0]);
          console.log(res.response)
        } else {
          //console.log(res.response);
          this.setState({ types: res.response })
        }
      })
  }

  fetchAccomodations = (qty = 10) => {
    let arr = [];
    fetch(apiUrl + 'accomodations/' + qty)
      .then(response => response.json())
      .then(res => {
        if (res.status === 'error') {
          swal(res.response[0]);
          console.log(res.response[1]);
        } else {
          if (res.response.length === qty) {
            this.setState({ accomodations: res.response, hasMoreAccomo: true });
            //console.log([res.response.length, qty])
          } else this.setState({ hasMoreAccomo: false });
          res.response.map(el =>
            arr.push(el.priceCharges + el.priceRent)
          );
          this.setState({ priceMax: Math.max(...arr) });
          //console.log(Math.max(...arr));
          this.setState({ max: Math.max(...arr) });

        }
      })
  }

  fetchVisitDate = (id) => {
    fetch(`${apiUrl}getvisitdates/${id}`, {
      method: 'get',
      headers: {
        'Authorization': JSON.parse(sessionStorage.getItem('userData')).token.api_token
      }
    })
      .then(response => response.json())
      .then(res => {
        console.log(Object.values(res.response));
        if (res.status === 'error') {
          swal(res.response)
        } else {
          this.setState({ datesVisit: Object.values(res.response) });
        }
      })
  }

  componentDidMount() {
    this.fetchAccomodations();
    this.fetchTypes();
    this._isMounted = true;
  }

  componentDidUpdate(nextProps, nextState) {
    //console.log([this.state.priceMax,nextState.max]);
    if (this.state !== nextState) {
      if ((this.state.priceMax === 0 || this.state.priceMax === "") && this.state.priceMax !== this.state.max) {
        this.setState({ priceMax: this.state.max });
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    var items = [];
    let filteredAccomodation = this.state.accomodations.filter(
      acc => {
        return acc.Title.toLowerCase().indexOf(this.state.query) !== -1;
      }
    );
    let filteredFromMinPrice = filteredAccomodation.filter(
      acc => {
        let price = acc.priceRent + acc.priceCharges;
        return price >= this.state.priceMin;
      }
    );
    let filteredFromMaxPrice = filteredFromMinPrice.filter(
      acc => {
        let price = acc.priceRent + acc.priceCharges;
        return price <= this.state.priceMax;
      }
    );
    let filteredByType = filteredFromMaxPrice.filter(
      acc => {
        if (this.state.oneType.length < 1) {
          return acc;
        } else {
          return acc.type === this.state.oneType;
        }
      }
    );
    let filteredNotVisited = filteredByType.filter(
      acc => {
        return this.state.toFilterNotVisited ? acc.nbVisit < 1 : acc;
      }
    );
    let filteredNotPublished = filteredNotVisited.filter(
      acc => {
        return this.state.toFilterNotPublished ?
          acc.Owner_user_id !== JSON.parse(sessionStorage.getItem('userData')).user.user_id
          : acc;
      }
    );
    let filteredWifi = filteredNotPublished.filter(
      acc => {
        return this.state.toFilterWifi ?
          acc.HasWifi === 1
          :
          acc;
      }
    );
    let filteredFurnitures = filteredWifi.filter(
      acc => {
        return this.state.toFilterFurnitures ?
          acc.HasFurnitures === 1
          :
          acc;
      }
    );
    let filteredCity = filteredFurnitures.filter(
      acc => {
        return acc.cityName.toLowerCase().indexOf(this.state.queryCity) !== -1;
      }
    )
    filteredCity.map(el => {
      items.push(el);
    });
    let SortedFromNewest = this.state.isSortedFromNewest ? items.sort(
      (a, b) => (a.PublicationDate < b.PublicationDate) ? 1 : ((b.PublicationDate < a.PublicationDate) ? -1 : 0)
    ) : this.state.isSortedFromOldest ? items.sort(
      (a, b) => (a.PublicationDate > b.PublicationDate) ? 1 : ((b.PublicationDate > a.PublicationDate) ? -1 : 0)
    ) : this.state.isSortedFromCheapest ? items.sort(
      (a, b) => ((a.priceRent + a.priceCharges) > (b.priceRent + b.priceCharges)) ? 1 : (((b.priceRent + b.priceCharges) > (a.priceRent + a.priceCharges)) ? -1 : 0)
    ) : this.state.isSortedFromMostExpensive ? items.sort(
      (a, b) => ((a.priceRent + a.priceCharges) < (b.priceRent + b.priceCharges)) ? 1 : (((b.priceRent + b.priceCharges) < (a.priceRent + a.priceCharges)) ? -1 : 0)
    ) : items;
    setTimeout(() => this.setState({ loading: 1 }), 5000);
    //if (!this.state.loading) return <div style={{ display: 'flex', justifyContent: 'center' }}></div>
    return (
      <Row>
        <div style={{ marginTop: '10px', marginLeft: '10px' }}>
          <StickyBox offsetTop={10} offsetBottom={70}>
            <SideBarFilter
              filterMin={e => this.setState({ priceMin: e.target.value })}
              filterMax={e => this.setState({ priceMax: e.target.value })}
              types={this.state.types}
              changetype={(e) => e.target.id !== 'Tout' ? this.setState({ oneType: e.target.id }) : this.setState({ oneType: '' })}
              sortfromnewest={() => this.setState({ isSortedFromNewest: true, isSortedFromOldest: false, isSortedFromCheapest: false, isSortedFromMostExpensive: false })}
              sortfromoldest={() => this.setState({ isSortedFromOldest: true, isSortedFromNewest: false, isSortedFromCheapest: false, isSortedFromMostExpensive: false })}
              sortfromcheapest={() => this.setState({ isSortedFromOldest: false, isSortedFromNewest: false, isSortedFromCheapest: true, isSortedFromMostExpensive: false })}
              sortfrommostexpensive={() => this.setState({ isSortedFromOldest: false, isSortedFromNewest: false, isSortedFromCheapest: false, isSortedFromMostExpensive: true })}
              filterNotVisited={e => this.setState({ toFilterNotVisited: document.getElementById(e.target.id).checked })}
              filterNotPublished={e => this.setState({ toFilterNotPublished: document.getElementById(e.target.id).checked })}
              filterWifi={e => this.setState({ toFilterWifi: document.getElementById(e.target.id).checked })}
              filterFurnitures={e => this.setState({ toFilterFurnitures: document.getElementById(e.target.id).checked })}
              min={this.state.priceMin === 0 ? this.state.max : this.state.priceMin}
              filterCity={e => this.setState({ queryCity: e.target.value })}
            />
          </StickyBox>
        </div>
        {
          !this.state.loading
            ?
            <LoadingComponent />
            :
            <Container>
              <h1>Logements</h1>
              <FormControl
                type="text"
                placeholder="Rechercher un nom de logement"
                style={{ width: '100%', marginBottom: '10px' }}
                className="mr-sm-4"
                onChange={e => this.setState({ query: e.target.value })}
              />
              <ListGroup variant='flush'>
                {
                  SortedFromNewest.length > 0
                    ?
                    <InfiniteScroll
                      pageStart={10}
                      loadMore={this.fetchAccomodations.bind(this)}
                      hasMore={this.state.hasMoreAccomo}
                      loader={<div className="loader">Chargement ...</div>}
                    >
                      {
                        SortedFromNewest.map(accomo =>
                          <div key={SortedFromNewest.indexOf(accomo)}>
                            <AccItem
                              accomo={accomo}
                              variant={accomo.isStillFree === 0 ? "danger" : accomo.nbInterested < 1 ? "success" : "warning"}
                              showToVisit={() => { this.setState({ showToVisit: true, targetAcc: accomo }); this.fetchVisitDate(accomo.accomodation_id); console.log(accomo) }}
                              disabled={accomo.isStillFree === 0}
                              cardStyle={styles.zoom}
                              showPictures={(e) => this.setState({ showPictures: true, firstPic: e.target.src, targetAcc: accomo })}
                            />
                          </div>
                        )
                      }
                    </InfiniteScroll>
                    :
                    <div style={styles.image}>
                      <div style={styles.emptyList}>
                        Aucun logement ne correspond à votre recherche
                      </div>
                    </div>
                }
              </ListGroup>

              <VisitAccomodation
                show={this.state.showToVisit}
                hide={() => this.setState({ showToVisit: false })}
                accomo={this.state.targetAcc}
                datesVisit={this.state.datesVisit}
              />
              <Pictures
                show={this.state.showPictures}
                hide={() => this.setState({ showPictures: false })}
                title={this.state.targetAcc.Title}
                img={this.state.targetAcc.pictures ? this.state.targetAcc.pictures : [this.state.firstPic]}
                description={this.state.targetAcc.Description}
              />
            </Container>
        }
      </Row>
    );
  }
}

class AccItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
    }
  }

  componentDidMount() {
    console.log(this.props.accomo)
  }

  render() {
    let accomo = this.props.accomo;
    let key = this.props.key;
    let variant = this.props.variant;
    let showToVisit = this.props.showToVisit;
    let cardStyle = this.props.cardStyle;
    let isHovered = this.state.isHovered;
    let showPictures = this.props.showPictures;

    let img;
    let pic = accomo.pictures;
    switch (accomo.type) {
      case 'Maison': img = house;
        break;
      case 'Appartement': img = building;
        break;
      case 'Kot': img = house;
        break;
      case 'Communautaire': img = house;
        break;
      case 'Duplex': img = house;
        break;
      case 'Studio': img = bedroom;
        break;
      case 'Garage': img = garage;
        break;
      default: img = house;
    }

    if (!pic) {
      pic = img;
    }

    return (
      <ListGroup.Item key={key} variant={variant} >
        <Row>
          <Col xs={3}>
            <Card
              onClick={pic === accomo.pictures ? (e) => showPictures(e) : null}
              onMouseOver={pic === accomo.pictures ? () => this.setState({ isHovered: true }) : null}
              onMouseOut={pic === accomo.pictures ? () => this.setState({ isHovered: false }) : null}
              style={pic === accomo.pictures ? isHovered ? cardStyle : null : null}
            >
              <Card.Img variant="top" src={pic === accomo.pictures ? pic[0].picture : pic} />
              <Card.Footer>
                <div style={{ display: 'flex', justifyContent: 'center', fontSize: '1.5rem' }}>{accomo.type}</div>
              </Card.Footer>
            </Card>
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Badge pill variant={variant} style={{ width: variant === 'success' || variant === 'danger' ? '50%' : '90%' }}>
                {
                  variant === 'warning' ?
                  <div>
                    <h5>Disponible</h5>
                    <div>Susceptible d'être loué</div>
                  </div>
                  :
                  <h5>{variant === 'danger' ? 'Loué' : 'Disponible'}</h5>
                }
                
              </Badge>
            </div>
          </Col>
          <Col md={{ offset: 1 }}>
            <Row>
              <Col xs={10}>
                <h3>{accomo.Title}</h3>
                <h1><p style={{ fontWeight: 'bolder', fontSize: '3rem' }}>{accomo.priceRent + accomo.priceCharges} € </p></h1>
                <div>
                  {
                    accomo.addressVisible === 1
                      ?
                      <p><u>Adresse</u> : {accomo.address} {accomo.cityName}</p>
                      :
                      null
                  }
                  <p>
                    <u>Dates de location</u> : <strong>{moment(accomo.BeginingTime).format('LL')}</strong> jusqu'au <strong>{moment(accomo.EndTime).format('LL')}</strong>
                  </p>
                </div>
                <p style={{ fontStyle: 'italic', fontSize: '1.5rem' }}>
                  <strong>{accomo.priceRent} €</strong> de loyer + <strong>{accomo.priceCharges} €</strong> de charges
                </p>
              </Col>
              {
                sessionStorage.getItem('userData')
                  ?
                  JSON.parse(sessionStorage.getItem('userData')).user.profil_id === 1
                    ?
                    <Col>
                      <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Activez votre compte</Tooltip>}>
                        <span className="d-inline-block">
                          <Button variant={variant} disabled style={{ pointerEvents: 'none' }}>Visiter ?</Button>
                        </span>
                      </OverlayTrigger>
                    </Col>
                    :
                    <Col xs={2}>
                      <Button variant={variant} onClick={showToVisit} disabled={variant === 'danger' || accomo.Owner_user_id === JSON.parse(sessionStorage.getItem('userData')).user.user_id}>
                        Visiter
                      </Button>
                    </Col>
                  :
                  <Col>
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Connectez-vous d'abord</Tooltip>}>
                      <span className="d-inline-block">
                        <Button variant={variant} disabled style={{ pointerEvents: 'none' }}>Visiter</Button>
                      </span>
                    </OverlayTrigger>
                  </Col>
              }
            </Row>

            <Row>
              <Col xs={2}>{accomo.nbVisit ? accomo.nbVisit : 0} visites</Col>
              <Col xs='2'>{accomo.nbInterested ? accomo.nbInterested : 0} Intéressé</Col>
              <Col xs={3}><FontAwesomeIcon icon={["fas", "bed"]} /> {accomo.nbRoom > 1 ? `${accomo.nbRoom} chambres` : `${accomo.nbRoom} chambre`} </Col>
              {
                accomo.HasWifi === 1
                  ?
                  <Col xs={2}><FontAwesomeIcon icon={["fas", "wifi"]} /> WiFi</Col>
                  :
                  null
              }
              {
                accomo.HasCarPark === 1
                  ?
                  <Col xs={2}><FontAwesomeIcon icon={["fas", "car"]} /> Parking</Col>
                  :
                  null
              }
              {
                accomo.HasFurnitures === 1
                  ?
                  <div>
                    <Badge variant='outline-dark'>Meublé</Badge>
                    {/*
                    <Col xs={2}>
                      <OverlayTrigger overlay={
                        <Popover title='Meubles'>
                          <ListGroup variant='flush'>
                            <ListGroup.Item><Badge>2</Badge> Lit</ListGroup.Item>
                            <ListGroup.Item><Badge>3</Badge> Armoire</ListGroup.Item>
                            <ListGroup.Item><Badge>1</Badge> Table</ListGroup.Item>
                          </ListGroup>
                        </Popover>
                      }>
                        <Badge variant='outline-dark'>Meublé</Badge>
                      </OverlayTrigger>
                    </Col>
                  */}
                  </div>
                  :
                  null
              }
              <Col xs={2}>{accomo.Surface} m<sup>2</sup></Col>
            </Row>
            <h5 style={{ marginTop: '10px', fontStyle: 'italic' }}>Annonce de : {accomo.Firstname} {accomo.Surname}</h5>
            <p style={{ fontSize: '0.8rem', marginTop: '10px', fontStyle: 'italic' }}>{accomo.Description}</p>
          </Col>
        </Row>
      </ListGroup.Item>
    )
  }
}

const styles = {
  emptyList: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#00f',
    backgroundColor: 'rgba(255, 255, 255,0.8)'
  },
  image: {
    backgroundImage: 'url(' + backgroundImg + ')',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
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
  },
  zoom: {
    transform: 'scale(1.1)',
    transition: 'transform .2s', /* Animation */
    cursor: 'pointer',
    zIndex: '100'
  }
}