import React, { Component } from 'react'
import {
    Card,
    List,
    Icon,
} from 'antd'
import LinkButton from '../../components/link-button'

const { Item } = List

export default class AccidentsDetail extends Component {
    render() {
        const title = (
            <span>
                <LinkButton onClick={ () => this.props.history.goBack() }>
                    <Icon type="arrow-left"></Icon>
                </LinkButton>
                &nbsp;&nbsp;
                <span>事故详情</span>
            </span>
        )
        const accident = this.props.location.state
        
        return (
            <Card title = { title }>
                <List>
                    <Item>
                        <span className = "detail-item-left">事故时间：</span>
                        <span className = "detail-item-right">{ accident.time }</span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">事故地点：</span>
                        <span className = "detail-item-right">{ accident.time }</span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">事故路段：</span>
                        <span className = "detail-item-right">{ accident.index }</span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">人员伤亡：</span>
                        <span className = "detail-item-right">{ accident.index }</span>
                    </Item>
                </List>
            </Card>
        )
    }
}
