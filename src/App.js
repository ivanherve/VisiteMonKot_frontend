import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog, faSignOutAlt, faUser, faWifi, faBed, faCar, faEdit, faCheck, faPlus, faTimes, faExclamationTriangle, faEnvelope, faSearch, faHeart, faHeartBroken, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// Layouts
import Layout from './Layout/Layout';
import Login from './views/Pages/Login';
import Page404 from './views/Pages/Page404';
import Page500 from './views/Pages/Page500';

library.add(
  faSignOutAlt,
  faCog,
  faUser,
  faWifi,
  faBed,
  faCar,
  faEdit,
  faCheck,
  faPlus,
  faTimes,
  faEnvelope,
  faSearch, 
  faThumbsUp, 
  faThumbsDown,
  faExclamationTriangle
);

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/login" name="Login Page" component={Login} />
          <Route path="/404" name="Page 404" component={Page404} />
          <Route path="/500" name="Page 500" component={Page500} />
          <Route path="/" name="Home" component={Layout} />
        </Switch>
      </Router>
    );
  }
}

export default App;
