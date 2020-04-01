import React, { Component } from 'react'

import {
    Card,
    Icon,
    List,
} from 'antd'
import {Redirect} from 'react-router-dom'

import LinkButton from '../../components/link-button'
import { reqCategory } from '../../api'
import { BASE_IMG } from '../../utils/ConstantUtils'
import memoryUtils from '../../utils/memoryUtils'
const { Item } = List

export default class ProductDetail extends Component {

    state = {
        categoryName: '',
    }


    getCategory = async (categoryId) => {
        const result = await reqCategory( categoryId )
        if(result.code === 1){
            this.setState({
                categoryName: result.data.name
            })
        }
    }

    componentDidMount() {
        const product = memoryUtils.product
        if( product.id ){
            this.getCategory( product.id )
        }
    }

    render() {
        // const product = this.props.location.state
        const { categoryName } = this.state
        const product = memoryUtils.product
        if(!product.id || !product){
            return <Redirect to="/product"/>
        }
        
        const title = (
            <span>
                <LinkButton onClick={ () => this.props.history.goBack() }>
                    <Icon type="arrow-left"></Icon>
                </LinkButton>
                &nbsp;&nbsp;
                <span>货物详情</span>
            </span>
        )
        return (
            <Card title = {title} className = "detail">
                <List>
                    <Item>
                        <span className = "detail-item-left">商品名称：</span>
                        <span className = "detail-item-right">{product.name}</span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">商品描述：</span>
                        <span className = "detail-item-right">{product.descs}</span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">商品价格：</span>
                        <span className = "detail-item-right">{ product.price + " 元" }</span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">所属分类：</span>
                        <span className = "detail-item-right">{ categoryName }</span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">商品图片：</span>
                        <span className = "detail-item-right">
                            <img className = "detail-img" src = { BASE_IMG + product.image } alt = { product.image }  />
                        </span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">商品详情：</span>
                        <span className = "detail-item-right" dangerouslySetInnerHTML={ { __html: product.detail } } >
                        </span>
                    </Item>
                </List>
            </Card>
        )
    }
}