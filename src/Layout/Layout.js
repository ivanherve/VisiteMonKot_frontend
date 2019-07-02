import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import '../App.css';
import AccomodationsList from '../views/Containers/accomodationsList';
import MyAdvertisments from '../views/Containers/myAdvertisments';
import VisitsList from '../views/Containers/visitsList';
import Footer from './Footer';
import Headers from './Header';
import ResetPwd from '../views/Containers/resetpwd';
import Contact from '../views/Containers/contact';
import Profile from '../views/Containers/profile';
import { Button } from 'react-bootstrap';
import { apiUrl } from '../router';
import Management from '../views/Containers/management';
import Test from '../views/Containers/testview';


class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    }
  }

  componentWillMount() {
    if (sessionStorage.getItem('userData')) {
      console.log('call user feed')
    } else {
      this.setState({ redirect: true })
    }
  }

  render() {
    return (
      <div>
        <Headers onClick={() => this.setState({ redirect: true })} />
        <div style={{ marginTop: '70px', marginBottom: '50px' }}>
          {
            sessionStorage.getItem('userData')
              ? // If signed In
              <Switch>
                <Route path='/accomodations' component={AccomodationsList} />
                <Route path='/advertisments' component={MyAdvertisments} />
                <Route path='/visits' component={VisitsList} />
                <Route path='/resetpwd' component={ResetPwd} />
                <Route path='/contact' component={Contact} />
                <Route path='/profile' component={Profile} />
                {
                  JSON.parse(sessionStorage.getItem('userData')).user.profil_id === 3
                    ?
                    <Route path='/admin' component={Management} />
                    :
                    null
                }
                {
                  JSON.parse(sessionStorage.getItem('userData')).user.profil_id === 5
                    ?
                    <Route path='/test' component={Test} />
                    :
                    null
                }
                <Redirect from="/" to="/accomodations" />
              </Switch>
              : // If signed Out
              <Switch>
                <Route path='/accomodations' component={AccomodationsList} />
                <Redirect from="/" to="/accomodations" />
              </Switch>
          }
        </div>
        <Footer />
      </div>
    );
  }
}

export default Layout;
