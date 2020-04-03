import React, { Component } from 'react'
import ReactCharts from 'echarts-for-react'
import {
    Card
} from 'antd'

import './charts.less'

export default class Bar extends Component {

    state = {
        xAxis: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"],
        sales: [5, 20, 36, 10, 10, 20], // 销量的数组
        stores: [6, 10, 25, 20, 15, 10], // 库存的数组
    }

    getOption = (xAxis, sales, stores) => {
        return {
            title: {
                text: 'goods'
            },
            tooltip: {},
            xAxis: {
                data: xAxis
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: sales
            }, {
                name: '库存',
                type: 'bar',
                data: stores
            }]
        }
    }

    componentDidMount() {
        setInterval(() => {
            console.log('update');
            const {xAxis, sales, stores }  = this.state
            sales[Math.floor(Math.random() * 5)] = Math.random() * 100
            stores[Math.floor(Math.random() * 5)] = Math.random() * 100
            console.log(sales);
            this.setState({
                xAxis: xAxis,
                sales: sales,
                stores: stores,
            })
        }, 1000)
    }

    render() {
        const {xAxis, sales, stores}  = this.state
        const title = (<span>柱状图1</span>)
        return (
            <Card title = {title}>
                <ReactCharts option = {this.getOption(xAxis, sales, stores)} />
            </Card>
        )
    }
}
