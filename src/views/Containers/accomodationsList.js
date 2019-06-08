import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { Button, Col, Container, FormControl, Image, ListGroup, OverlayTrigger, Row, Tooltip, Badge, Popover } from 'react-bootstrap';
import StickyBox from "react-sticky-box";
import '../../App.css';
import bedroom from '../../Pictures/bedroom-ex.jpg';
import building from '../../Pictures/building.png';
import garage from '../../Pictures/garage-example.jpg';
import house from '../../Pictures/house-example.jpg';
import backgroundImg from '../../Pictures/Shrug-Emoji.jpg';
import { apiUrl } from '../../router';
import VisitAccomodation from '../Modals/visitAccomodation';
import SideBarFilter from '../Sidebars/sidebarFilter';
import swal from 'sweetalert';
import InfiniteScroll from 'react-infinite-scroller';


export default class AccomodationsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accomodations: [],
      query: '',
      priceMin: 0,
      priceMax: 0,
      max: 0,
      types: [],
      oneType: '',
      isSortedFromNewest: false,
      isSortedFromOldest: false,
      isSortedFromCheapest: false,
      toFilterNotVisited: false,
      toFilterNotPublished: false,
      toFilterWifi: false,
      toFilterFurnitures: false,
      showToVisit: false,
      targetAcc: {},
      datesVisit: [],
      hasMoreAccomo: true,
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
          console.log(res.response);
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
            console.log([res.response.length , qty])
          } else this.setState({ hasMoreAccomo: false });
          res.response.map(el =>
            arr.push(el.priceCharges + el.priceRent)
          );
          this.setState({ priceMax: Math.max(...arr) });
          console.log(Math.max(...arr));
          this.setState({ max: Math.max(...arr) });
          this.fetchTypes();
        }
      })
  }

  fetchVisitDate = (id) => {
    fetch(`${apiUrl}getvisitdates/${id}`, {
      method: 'get',
      headers: {
        api_token: JSON.parse(sessionStorage.getItem('userData')).token.api_token
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
  }

  componentDidUpdate(nextProps, nextState) {
    //console.log([this.state.priceMax,nextState.max]);
    if ((this.state.priceMax === 0 || this.state.priceMax === "") && this.state.priceMax !== this.state.max) {
      this.setState({ priceMax: this.state.max });
    }
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
    filteredFurnitures.map(el => {
      items.push(el);
    });
    let SortedFromNewest = this.state.isSortedFromNewest ? items.sort(
      (a, b) => (a.PublicationDate < b.PublicationDate) ? 1 : ((b.PublicationDate < a.PublicationDate) ? -1 : 0)
    ) : this.state.isSortedFromOldest ? items.sort(
      (a, b) => (a.PublicationDate > b.PublicationDate) ? 1 : ((b.PublicationDate > a.PublicationDate) ? -1 : 0)
    ) : this.state.isSortedFromCheapest ? items.sort(
      (a, b) => ((a.priceRent + a.priceCharges) > (b.priceRent + b.priceCharges)) ? 1 : (((b.priceRent + b.priceCharges) > (a.priceRent + a.priceCharges)) ? -1 : 0)
    ) : items;
    return (
      <Row>
        <div style={{ marginTop: '10px', marginLeft: '10px' }}>
          <StickyBox offsetTop={10} offsetBottom={70}>
            <SideBarFilter
              filterMin={e => this.setState({ priceMin: e.target.value })}
              filterMax={e => this.setState({ priceMax: e.target.value })}
              types={this.state.types}
              changetype={(e) => e.target.id !== 'Tout' ? this.setState({ oneType: e.target.id }) : this.setState({ oneType: '' })}
              sortfromnewest={() => this.setState({ isSortedFromNewest: true, isSortedFromOldest: false })}
              sortfromoldest={() => this.setState({ isSortedFromOldest: true, isSortedFromNewest: false })}
              sortfromcheapest={() => this.setState({ isSortedFromOldest: false, isSortedFromNewest: false, isSortedFromCheapest: true })}
              filterNotVisited={e => this.setState({ toFilterNotVisited: document.getElementById(e.target.id).checked })}
              filterNotPublished={e => this.setState({ toFilterNotPublished: document.getElementById(e.target.id).checked })}
              filterWifi={e => this.setState({ toFilterWifi: document.getElementById(e.target.id).checked })}
              filterFurnitures={e => this.setState({ toFilterFurnitures: document.getElementById(e.target.id).checked })}
              min={this.state.priceMin === 0 ? this.state.max : this.state.priceMin}
            />
          </StickyBox>
        </div>
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
                  loader={<div className="loader">Loading ...</div>}
                >
                  {
                    SortedFromNewest.map(accomo =>
                      <div key={SortedFromNewest.indexOf(accomo)}>
                        <AccomodationItem
                          accomo={accomo}
                          variant={accomo.isStillFree === 0 ? "danger" : accomo.nbVisit < 1 ? "success" : "warning"}
                          showToVisit={() => { this.setState({ showToVisit: true, targetAcc: accomo }); this.fetchVisitDate(accomo.accomodation_id); console.log(accomo) }}
                          disabled={accomo.isStillFree === 0}
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
        </Container>
      </Row>
    );
  }
}

const AccomodationItem = ({ accomo, key, variant, showToVisit }) => {
  let img;
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
  return (
    <ListGroup.Item key={key} variant={variant} >
      <Row>
        <Col xs={3}>
          <Image src={img} rounded />
          <div style={{ display: 'flex', justifyContent: 'center', fontSize: '1.5rem' }}>{accomo.type}</div>
        </Col>
        <Col md={{ offset: 1 }}>
          <Row>
            <Col xs={10}>
              <h3>{accomo.Title}</h3>
              <h1><p style={{ fontWeight: 'bolder', fontSize: '3rem' }}>{accomo.priceRent + accomo.priceCharges} € </p></h1>
              <p>{accomo.addressVisible === 1 ? 'Adresse: ' + accomo.address + ', ' + accomo.cityName : null}</p>
              <p style={{ fontStyle: 'italic', fontSize: '1.5rem' }}>
                <strong>{accomo.priceRent} €</strong> de loyer + <strong>{accomo.priceCharges} €</strong> de charges
              </p>
            </Col>
            {
              sessionStorage.getItem('userData')
                ?
                <Col xs={2}>
                  <Button variant={variant} onClick={showToVisit} disabled={variant === 'danger' || accomo.Owner_user_id === JSON.parse(sessionStorage.getItem('userData')).user.user_id}>
                    Visiter ?
                  </Button>
                </Col>
                :
                <Col>
                  <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Connectez-vous d'abord</Tooltip>}>
                    <span className="d-inline-block">
                      <Button variant={variant} disabled style={{ pointerEvents: 'none' }}>Visiter ?</Button>
                    </span>
                  </OverlayTrigger>
                </Col>
            }

          </Row>

          <Row>
            <Col xs={2}>{accomo.nbVisit} visites</Col>
            <Col xs={3}><FontAwesomeIcon icon={["fas", "bed"]} /> {accomo.nbRoom} chambres</Col>
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
                <Col xs={2}>
                  <OverlayTrigger overlay={
                    <Popover title='Meubles'>
                      <ListGroup>
                        <ListGroup.Item>Lit</ListGroup.Item>
                        <ListGroup.Item>Armoire</ListGroup.Item>
                        <ListGroup.Item>Table</ListGroup.Item>
                      </ListGroup>
                    </Popover>
                  }>
                    <Badge variant='outline-dark'>Meublé</Badge>
                  </OverlayTrigger>
                </Col>
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
  }
}