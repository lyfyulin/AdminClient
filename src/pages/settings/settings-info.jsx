import React, { Component } from 'react'
import { Button } from 'antd'

export default class SettingsInfo extends Component {
    render() {
        return (
            <div className="lyf-row1">
                <Button onClick={ () => this.props.history.push("/settings/link") }>设置路段</Button>
            </div>
        )
    }
}
