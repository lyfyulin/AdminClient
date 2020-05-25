import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import IntersectionInfo from './intersection-info'
import IntersectionGeometry from './intersection-geometry'
import IntersectionFlow from './intersection-flow'
import 'leaflet/dist/leaflet.css'

export default class Intersection extends Component {

    render() {
        return (
            <Switch>
                <Route path = "/intersection" exact component = { IntersectionInfo }/>
                <Route path = "/intersection/geometry/:id" component = { IntersectionGeometry }/>
                <Route path = "/intersection/flow/:id" component = { IntersectionFlow }/>
                <Redirect to = "/intersection" />
            </Switch>
        )
    }
}

