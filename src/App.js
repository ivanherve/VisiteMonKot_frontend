import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSignOutAlt, faCog, faUser } from '@fortawesome/free-solid-svg-icons';

// Layouts
import Layout from './Layout/Layout';
import Login from './views/Pages/Login';
import Page404 from './views/Pages/Page404';
import Page500 from './views/Pages/Page500';

// Containers
import AccomodationsList from './views/Containers/accomodationsList';
import myAdvertisments from './views/Containers/myAdvertisments';

library.add(
  faSignOutAlt,
  faCog,
  faUser,
);

const routes = [
  {
    path : "/login",
    component: Login
  },
  {
    path : "/404",
    component: Page404
  },
  {
    path : "/500",
    component: Page500
  },
  {
    path : "/home",
    component: Layout,
    routes: [
      {
        path: "/home/accomodation",
        component: AccomodationsList
      },
      {
        path: "/home/annonces",
        component: myAdvertisments
      }
    ]
  },
]

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/login" name="Login Page" component={Login} />
          <Route path="/404" name="Page 404" component={Page404} />
          <Route path="/500" name="Page 500" component={Page500} />
          <Route path="/" name="Home" component={Layout} />
        </div>
      </Router>
    );
  }
}

export default App;
