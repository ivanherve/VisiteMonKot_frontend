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
                <Route path='/annonces' component={MyAdvertisments} />
                <Route path='/visites' component={VisitsList} />
                <Route path='/resetpwd' component={ResetPwd} />
                <Route path='/contact' component={Contact} />
                <Route path='/profile' component={Profile} />
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
