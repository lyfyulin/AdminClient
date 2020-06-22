import React, { Component } from 'react'
import { Table, message, Icon } from 'antd'
import L from 'leaflet'
import LinkButton from '../../components/link-button'
import { reqNodes } from '../../api'
import { TMS, MAP_CENTER } from '../../utils/baoshan'
import memoryUtils from '../../utils/memoryUtils'

import './node-info.less'
import 'leaflet/dist/leaflet.css'

export default class NodeInfo extends Component {

    state = {
        loading: false,
        nodes: [],
    }

    // 初始化表格列
    initColumns = () => {
        return [{
            title: '交叉口名称',
            dataIndex: 'node_name'
        },{
            title: '几何布局',
            render: node => (
                <LinkButton onClick = { () => {
                    memoryUtils.node = node
                    this.props.history.push({ pathname: "/node/geometry/" + node.node_id })
                } }>查看布局</LinkButton>
            )
        },{
            title: '流量信息',
            render: node => (
                <LinkButton onClick = { async () => {
                    memoryUtils.node = node
                    this.props.history.push({ pathname: "/node/flow/" + node.node_id })
                } }>查看流量</LinkButton>
            )
        }]
    }

    // 加载点位列表
    loadNodes = async () => {
        const result = await reqNodes()
        if(result.code === 1){
            this.setNode(result.data)
            this.setState({ 
                nodes: result.data,
            })
        }else{
            message.error(result.message)
        }

    }

    // 将点位添加到地图
    setNode = (nodes) => {
        this.node = []
        nodes.forEach( e => {
            let lat = parseFloat(e.node_lng_lat.split(',')[1])
            let lng = parseFloat(e.node_lng_lat.split(',')[0])
            this.node.push( L.circle([lat, lng], {color: 'red', fillOpacity: 1, radius: 30}).bindPopup(e.node_name) )
        })
        L.layerGroup(this.node).addTo(this.map)
    }

    // 初始化地图
    initMap = () => {
        if(!this.map){
            this.map = L.map('map', {
                center: MAP_CENTER,
                zoom: 14,
                zoomControl: false,
                attributionControl: false,
            })
            L.tileLayer(TMS, {}).addTo(this.map)
            this.map._onResize()
        }
    }

    componentWillMount() {
        this.columns = this.initColumns()
        this.loadNodes()
    }
    
    componentDidMount() {
        this.initMap()
    }

    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return
        }
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
                        路口列表
                        <Icon type="plus" style={{ float:'right' }} onClick={ () => {
                            memoryUtils.node = {}
                            this.props.history.push({ pathname: "/node/add" })
                        } }></Icon>
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
