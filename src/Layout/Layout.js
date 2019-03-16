import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import '../App.css';
import AccomodationsList from '../views/Containers/accomodationsList';
import MyAdvertisments from '../views/Containers/myAdvertisments';
import VisitsList from '../views/Containers/visitsList';
import Footer from './Footer';
import Headers from './Header';


class Layout extends Component {
  constructor(props){
    super(props);
    this.state = {
      redirect: false,
    }
  }

  componentWillMount(){
    if(sessionStorage.getItem('userData')){
      console.log('call user feed')
    } else {
      this.setState({redirect: true})
    }
  }

  render() {
    if(this.state.redirect){
      return (<Redirect to='/login' /> )
    }
    return (
      <div>
        <Headers onClick={() => this.setState({redirect: true})} />
        <div style={{ marginTop: '70px' }}>
          <Switch>
            <Route path='/annonces' component={MyAdvertisments} />
            <Route path='/accomodations' component={AccomodationsList} />
            <Route path='/visites' component={VisitsList} />
            <Redirect from="/" to="/accomodations" />
          </Switch>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Layout;
