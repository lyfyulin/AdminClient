import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import SettingsInfo from './settings-info'
import SettingsLink from './settings-link'
export default class Settings extends Component {
    render() {
        return (
            <Switch>
                <Route path="/settings" exact component={ SettingsInfo }/> 
                <Route path="/settings/link" component={ SettingsLink }/> 
            </Switch>
        )
    }
}
