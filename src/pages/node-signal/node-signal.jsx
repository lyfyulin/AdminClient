import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import SignalInfo from './signal-info'
import SignalSchema from './signal-schema'
import AddSchema from './add'
import NodeSignalInfo from './node-signal-info'

export default class NodeSignal extends Component {
    render() {
        return (
            <Switch>
                <Route path="/node-signal" exact component={ NodeSignalInfo }/>
                <Route path="/node-signal/schema/:id" component = { SignalSchema }/>
                <Route path="/node-signal/add" component = { AddSchema }/>
                <Redirect to="/node-signal"/>
            </Switch>
        )
    }
}
