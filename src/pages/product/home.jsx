import React, { Component } from 'react'
import{
    Card,
    Select,
    Input, 
    Button,
    Icon,
    Table,
    message
} from 'antd'

import { reqGoods, reqSearchGoods, reqUpdateStatus } from '../../api'
import {PAGE_SIZE} from '../../utils/ConstantUtils'
import LinkButton from '../../components/link-button'
import memoryUtils from '../../utils/memoryUtils'
import { throttle } from 'lodash'

export default class ProductHome extends Component {

    state = {
        loading: false,
        products: [],
        total: 0,       // 商品总数量
        searchType: 'goodsName',
        searchName: '',
    }

    updateStatus = throttle( async ( goodsId, status ) => { // 节流处理

        const newStatus = status === 1 ? 2 : 1
        const result = await reqUpdateStatus( goodsId, newStatus )
        if(result.code === 1){
            message.success("更新货物状态成功！")
            // 获取修改这个货物的当前页显示
            this.getGoods( this.pageNum )
        }
    }, 2000)

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
                // dataIndex: 'status',
                width: 200,
                render: ({id, status}) => {
                    let btnText = '下架'
                    let text = '在售'
                    if(status === 2){
                        btnText = '上架'
                        text = '已下架'
                    }
                    return (<span>
                        <button onClick = { () => { this.updateStatus( id, status ) } }>{btnText}</button>
                        <span>{text}</span>
                    </span>)
                }
            },
            {
                title: '操作',
                width: 200,
                render: product => (
                    <span>
                        <LinkButton 
                            onClick = { () => {
                                memoryUtils.product = product
                                this.props.history.push("/product/detail", product)
                            } } 
                        >
                            详情
                        </LinkButton>
                        <LinkButton
                            onClick = { () => {
                                memoryUtils.product = product
                                this.props.history.replace( "/product/addupdate" )
                            }}
                        >修改</LinkButton>
                    </span>
                )
            },
        ]
    }

    getGoods = async ( pageNum ) => {
        // 保存当前页码
        this.pageNum = pageNum
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
        const { loading, products, total, searchType } = this.state
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
            <Button type="primary" onClick = { () => { 
                this.getGoods( 1 ) }
             } >搜索</Button>
        </span>)
        const extra = (<Button type = "primary" onClick = { () => {
            memoryUtils.product = {}
            this.props.history.push( "/product/addupdate" )
        } }>
            <Icon type = "plus"/>添加货物
        </Button>)
        return (
            <Card title={title} extra = {extra}>
                <Table
                    bordered = { true }
                    rowKey = "id"
                    columns = { this.columns }
                    dataSource = { products }
                    loading = { loading }
                    pagination = {{ current:  this.pageNum, total, defaultPageSize: PAGE_SIZE, showQuickJumper: true, onChange: this.getGoods }}
                >
                </Table>
            </Card>
        )
    }
}




