import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import LinkInfo from './link-info'
import LinkParam from './link-param'
import LinkDetail from './link-detail'

export default class Link extends Component {
    render() {
        return (
            <Switch>
                <Route path="/link" exact component = { LinkInfo }/>
                <Route path="/link/detail" component = { LinkDetail }/>
                <Route path="/link/param" component = { LinkParam }/>
                <Redirect to="/link"/>
            </Switch>
        )
    }
}
