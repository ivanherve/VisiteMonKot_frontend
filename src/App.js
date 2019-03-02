import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Layout from './Layout/Layout';
//import './App.css';
import Login from './views/Pages/Login';
import Page404 from './views/Pages/Page404';
import Page500 from './views/Pages/Page500';

import AccomodationsList from './views/Containers/accomodationsList';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/login" name="Login Page" component={Login} />
          <Route path="/404" name="Page 404" component={Page404} />
          <Route exact path="/500" name="Page 500" component={Page500} />
          <Route exact path="/" name="Home" component={Layout} />
          <Route path='/accomodations' component={AccomodationsList} />
        </div>
      </Router>
    );
  }
}

export default App;
