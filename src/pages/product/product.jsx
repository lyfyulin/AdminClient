import React, { Component } from 'react'
import{
    Card,
    Select,
    Input, 
    Button,
    Icon,
    Table
} from 'antd'

import { reqGoods, reqSearchGoods } from '../../api'
import {PAGE_SIZE} from '../../utils/ConstantUtils'
import LinkButton from '../../components/link-button'


export default class Product extends Component {

    state = {
        loading: false,
        products: [],
        total: 0,       // 商品总数量
        searchType: 'goodsName',
        searchName: '',
    }

    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name'
            },
            {
                title: '商品描述',
                dataIndex: 'descs'
            },
            {
                title: '价格描述',
                dataIndex: 'price',
                render: price => '￥' + price
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 200,
                render: (status) => {
                    let btnText = '下架'
                    let text = '在售'
                    if(status === 2){
                        btnText = '上架'
                        text = '已下架'
                    }
                    return (<span>
                        <button>{btnText}</button>
                        <span>{text}</span>
                    </span>)
                }
            },
            {
                title: '操作',
                width: 200,
                render: product => (
                    <span>
                        <LinkButton>详情</LinkButton>
                        <LinkButton>修改</LinkButton>
                    </span>
                )
            },
        ]
    }

    getGoods = async ( pageNum ) => {
        const { searchName, searchType } = this.state
        let result
        if( !searchName ){
            result = await reqGoods( pageNum, PAGE_SIZE )
        }else{
            result = await reqSearchGoods({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
        }
        if( result.code === 1 ){
            const { total, list } = result.data
            this.setState({
                products: list,
                total
            })
        }
    }

    setSearchType = (value) => {
        this.setState({
            searchType: value
        })
    }

    setSearchName = (e) => {
        this.setState({
            searchName: e.target.value
        })
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getGoods( 1 )
    }

    render() {
        const { loading, products, total, searchType, searchName } = this.state
        const title = (<span>
            <Select style = {{ width: 200 }} value = {searchType} onChange = { this.setSearchType }  >
                <Select.Option value = "goodsName">按名称搜索</Select.Option>
                <Select.Option value = "goodsDescs">按描述搜索</Select.Option>
            </Select>
            <Input 
                style = {{width: 200, margin: '0px 10px'}} 
                placeholder = "输入关键字" 
                onChange = { this.setSearchName }
            />
            <Button type="primary" onClick = { () => { this.getGoods( 1 ) } } >搜索</Button>
        </span>)
        const extra = (<Button type = "primary" >
            <Icon type = "plus"/>添加商品
        </Button>)
        return (
            <Card title={title} extra = {extra}>
                <Table
                    bordered = { true }
                    rowKey = "id"
                    columns = { this.columns }
                    dataSource = { products }
                    loading = { loading }
                    pagination = {{ total, defaultPageSize: PAGE_SIZE, showQuickJumper: true, onChange: this.getGoods }}
                >
                </Table>
            </Card>
        )
    }
}
