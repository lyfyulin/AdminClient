import React, { Component } from 'react'
import {
    Card,
    List,
    Icon,
} from 'antd'
import LinkButton from '../../components/link-button'
import { reqAccidentById } from '../../api'
import { getNowTimeString } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'

const { Item } = List

export default class AccidentsDetail extends Component {


    state = {
        accident: memoryUtils.accident
    }

    async componentDidMount() {
        const { accident } = this.state
        let accident_id
        if(accident.accident_id){
            accident_id = accident.accident_id
        }else{
            accident_id = this.props.match.params.id
        }
        const result = reqAccidentById(accident_id)
        if(result.code === 1){
            this.setState({ accident: result.data })
        }

    }

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
        const accident = this.state.accident
        console.log(accident);
        
        return (
            accident?(
            <Card title = { title }>
                <List>
                    <Item>
                        <span className = "detail-item-left">事故时间：</span>
                        <span className = "detail-item-right">{ accident.accident_time || getNowTimeString() }</span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">事故经纬度：</span>
                        <span className = "detail-item-right">{ accident.accident_lng_lat }</span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">事故路段：</span>
                        <span className = "detail-item-right">{ accident.accident_location }</span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">人员伤亡：</span>
                        <span className = "detail-item-right">{ accident.accident_specific_location }</span>
                    </Item>
                </List>
            </Card>):(<></>)
        )
    }
}
