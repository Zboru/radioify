import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Nav from './components/Nav'

import Home from './views/Home'
import About from './views/About'
import NotFound from './views/NotFound'
import Layout from "./layout/Layout";

const App = () => {
  return (
    <Router>
    <Layout>
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route path="/about">
                <About />
            </Route>
            <Route>
                <NotFound />
            </Route>
        </Switch>
    </Layout>
    </Router>
  );
};

export default App;
