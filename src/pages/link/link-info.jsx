import React, { Component } from 'react'
import { Table } from 'antd'
import L from 'leaflet'
import './link-info.less'
import LinkButton from '../../components/link-button'
import { TMS, MAP_CENTER } from '../../utils/baoshan'

export default class LinkInfo extends Component {

    state = {
        loading: false,
        links: [],
    }

    initColumns = () => {
        return [{
            title: '路段名称',
            dataIndex: 'name'
        },{
            title: '路段详情',
            render: intersection => (<span>
                <LinkButton onClick = { () => {
                    this.props.history.push("/link/detail")
                } }>查看路段</LinkButton>
            </span>)
        },{
            title: '交通参数',
            render: intersection => (<span>
                <LinkButton onClick = { () => {
                    this.props.history.push("/link/param")
                } }>查看参数</LinkButton>
            </span>)
        },]
    }

    initLinks = () => {
        const links = [{
            id: 1,
            name: "正阳路-保岫路路段",
        },{
            id: 2,
            name: "正阳路-龙泉路路段",
        },{
            id: 3,
            name: "正阳路-玉泉路路段",
        },{
            id: 4,
            name: "正阳路-升阳路路段",
        },{
            id: 5,
            name: "正阳路-人民路路段",
        },{
            id: 6,
            name: "太保路-龙泉路路段",
        },{
            id: 7,
            name: "太保路-玉泉路路段",
        },{
            id: 8,
            name: "太保路-升阳路路段",
        },{
            id: 9,
            name: "太保路-人民路路段",
        },{
            id: 10,
            name: "太保路-人民路路段",
        }]
        this.setState({ 
            links,
        })
    }

    componentWillMount() {
        this.columns = this.initColumns()
        this.initLinks()
    }

    componentDidMount() {

        if(!this.map){
            this.map = L.map('map', {
                center: MAP_CENTER,
                zoom: 14
            })
            L.tileLayer(TMS, {}).addTo(this.map)
            this.map._onResize()
        }

    }

    render() {
        const { loading, links } = this.state
        return (
            <div className = "lvqi-row1-col2">
                <div className = "lvqi-col-2">
                    <div className="lvqi-card-title">
                        路段地图
                    </div>
                    <div className="lvqi-card-content" id="map">
                    </div>
                </div>
                <div className = "lvqi-col-2">
                    <div className="lvqi-card-title">
                        路段列表
                    </div>
                    <div className="lvqi-card-content" id="table">
                        <Table 
                            bordered = { true }
                            rowKey = "id"
                            columns = { this.columns }
                            dataSource = { links }
                            loading = { loading }
                            pagination = { false }
                            scroll={{ y: 480 }}
                        >

                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}
