import React, { Component } from 'react'
import { Table } from 'antd'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './intersection-info.less'
import LinkButton from '../../components/link-button'
import { TMS, MAP_CENTER } from '../../utils/baoshan'
import { reqNodes } from '../../api'
import memoryUtils from '../../utils/memoryUtils'

export default class IntersectionInfo extends Component {

    state = {
        loading: false,
        nodes: [],
    }

    initColumns = () => {
        return [{
            title: '交叉口名称',
            dataIndex: 'node_name'
        },{
            title: '几何布局',
            render: node => (
                <LinkButton onClick = { () => {
                    memoryUtils.node = node
                    this.props.history.push({ pathname: "/intersection/geometry/" + node.node_id })
                } }>查看布局</LinkButton>
            )
        },{
            title: '流量信息',
            render: node => (
                <LinkButton onClick = { async () => { 
                    memoryUtils.node = node
                    this.props.history.push({ pathname: "/intersection/flow/" + node.node_id })
                } }>查看流量</LinkButton>
            )
        },]
    }

    initNodes = async () => {
        const result = await reqNodes()
        const nodes = result.data
        this.setState({ 
            nodes,
        })
    }

    initMap = () => {
        if(!this.map){
            this.map = L.map('map', {
                center: MAP_CENTER,
                zoom: 14
            })
            L.tileLayer(TMS, {}).addTo(this.map)
            this.map._onResize()
        }
    }

    componentWillMount() {
        this.columns = this.initColumns()
        this.initNodes()

    }
    
    componentDidMount() {
        this.initMap()
    }

    render() {
        const { loading, nodes } = this.state
        return (
            <div className = "lvqi-row1-col2">
                <div className = "lvqi-col-2">
                    <div className="lvqi-card-title">
                        交叉口地图
                    </div>
                    <div className="lvqi-card-content" id="map">
                    </div>
                </div>
                <div className = "lvqi-col-2">
                    <div className="lvqi-card-title">
                        交叉口列表
                    </div>
                    <div className="lvqi-card-content" id="table">
                        <Table 
                            bordered = { true }
                            rowKey = "node_id"
                            columns = { this.columns }
                            dataSource = { nodes }
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
