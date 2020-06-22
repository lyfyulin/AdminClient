import React, { Component } from 'react'
import LinkButton from '../../components/link-button'
import { Icon } from 'antd'

export default class LineSignalAdd extends Component {
    render() {
        return (
            <div className="lyf-card">
                <div className="lyf-card-title">
                    <LinkButton onClick={ () => this.props.history.goBack() }>
                        <Icon type="arrow-left"></Icon>
                    </LinkButton>
                    &nbsp;&nbsp;
                    <span>干线信号管理</span>
                </div>
                <div className="lyf-card-content">
                </div>
            </div>
        )
    }
}
