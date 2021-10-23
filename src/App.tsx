import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import Home from './views/Home'
import Create from './views/Create'
import NotFound from './views/NotFound'
import Layout from "./layout/Layout";

const App = () => {

    function publicUrl() {
        return `${import.meta.env.VITE_PUBLIC_URL}`;
    }

    return (
        <Router basename={publicUrl()}>
            <Layout>
                <Switch>
                    <Route exact path="/">
                        <Home/>
                    </Route>
                    <Route exact path="/app">
                        <Create/>
                    </Route>
                    <Route>
                        <NotFound/>
                    </Route>
                </Switch>
            </Layout>
        </Router>
    );
};

export default App;
