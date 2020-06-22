import React, { Component } from 'react'
import { Table, message, Icon, Popconfirm } from 'antd'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../node/node-info.less'
import LinkButton from '../../components/link-button'
import { TMS, MAP_CENTER, DEVICE_CONFIG } from '../../utils/baoshan'
import { reqDevices, reqDeleteDevice } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import { bd09togcj02 } from '../../utils/lnglatUtils'
import _ from 'lodash'

export default class DeviceInfo extends Component {

    state = {
        devices: [],
        tableBodyHeight: 480,
    }

    // 初始化表格列
    initColumns = () => {
        return [{
            title: '设备编号',
            width: 250,
            dataIndex: 'dev_id'
        },{
            title: '设备名称',
            width: 500,
            render: device => (<LinkButton onClick ={ () => { 
                    this.deviceBlink(device)
                } }> { device.dev_name } </LinkButton>
            )
        },{
            title: '设备信息',
            width: 300,
            render: device => (<LinkButton onClick = { () => {
                    memoryUtils.device = device
                    this.props.history.push({ pathname: "/device/detail/" + device.dev_id })
                } }>详情</LinkButton>
            )
        },{
            title: '操作',
            width: 300,
            render: device => <Popconfirm 
                title="是否删除?" 
                onConfirm={async() => {
                    console.log(device.dev_id)
                    const result = await reqDeleteDevice(device.dev_id)
                    result.code === 1? message.success("删除点位成功！"):message.error(result.message)
                    this.loadDevices()
                } }
            >
                <a href="#">删除</a>
            </Popconfirm>
        }]
    }

    deviceBlink = (device) => {
        this.map.fitBounds(this.device[device.key].getBounds())
        this.device[device.key].setStyle({ color: DEVICE_CONFIG.blink })
        setTimeout( () => {
            this.device[device.key].setStyle({ color: DEVICE_CONFIG.color })
        }, 1000 )
    }

    // 加载点位列表
    loadDevices = async () => {
        const result = await reqDevices()
        if(result.code === 1){
            const devices = result.data.map( (e, index) => ({ key: index, ...e }) )
            this.setDevice(devices)
            this.setState({ devices })
        }else{
            message.error(result.message)
        }
    }

    // 将设备添加到地图
    setDevice = (devices) => {
        this.device = []
        devices.forEach( e => {
            let lat = bd09togcj02(e.dev_lng, e.dev_lat)[1]
            let lng = bd09togcj02(e.dev_lng, e.dev_lat)[0]
            this.device.push( L.circle([lat, lng], { ...DEVICE_CONFIG }).bindPopup(e.dev_name) )
        })
        this.map.removeLayer(this.devices_circle)
        this.devices_circle = L.layerGroup(this.device)
        this.devices_circle.addTo(this.map)
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
            this.devices_circle = L.layerGroup()
            // L.Control({position:'topright'}).addTo(this.map)
        }
    }

    componentWillMount() {
        this.columns = this.initColumns()
        this.loadDevices()
    }

    onWindowResize = _.throttle(() => {
        this.setState({ tableBodyHeight: window.innerHeight * 0.9 - 166  })
    }, 800)
    
    componentDidMount() {
        this.initMap()
        this.setState({ tableBodyHeight: window.innerHeight * 0.9 - 166 })
        window.addEventListener('resize', this.onWindowResize)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize)
        this.setState = (state, callback) => {
            return
        }
    }
    
    render() {
        const { devices, tableBodyHeight } = this.state
        return (
            <div className = "lvqi-row1-col2">
                <div className = "lvqi-col-2">
                    <div className="lvqi-card-title">
                        设备地图
                    </div>
                    <div className="lvqi-card-content" id="map">
                    </div>
                </div>
                <div className = "lvqi-col-2">
                    <div className="lvqi-card-title">
                        设备列表
                        <Icon type="plus" style={{ float:'right' }} onClick={ () => {
                            memoryUtils.device = {}
                            this.props.history.push({ pathname: "/device/add" })
                        } }></Icon>
                    </div>
                    <div className="lvqi-card-content" id="table">
                        <Table 
                            bordered = { true }
                            rowKey = "dev_id"
                            columns = { this.columns }
                            dataSource = { devices }
                            pagination = { false }
                            scroll={{ y: tableBodyHeight }}
                        >
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}
