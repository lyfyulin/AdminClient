import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import NodeGeometry from './node-geometry'
import NodeInfo from './node-info'
import NodeFlow from './node-flow'

import 'leaflet/dist/leaflet.css'

export default class Node extends Component {

    render() {
        return (
            <Switch>
                <Route path = "/node" exact component = { NodeInfo }/>
                <Route path = "/node/geometry/:id" component = { NodeGeometry }/>
                <Route path = "/node/flow/:id" component = { NodeFlow }/>
                {/* <Redirect to = "/node" /> */}
            </Switch>
        )
    }
}

