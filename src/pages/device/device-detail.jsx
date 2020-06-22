import React, { Component } from 'react'
import { Form, Input, Button, Select, Tabs, TreeSelect, Radio, Modal, Icon, message, Table } from 'antd'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import LyfItem from '../../components/item/item'
import LinkButton from '../../components/link-button'
import { TMS, MAP_CENTER, DEVICE_CAP_DIR } from '../../utils/baoshan'
import memoryUtils from '../../utils/memoryUtils'
import { getNowDateTimeString } from '../../utils/dateUtils'
import { reqInsertAccident, reqDeviceById, reqNodes } from '../../api'
import { connect } from 'react-redux'

const Item = Form.Item
const Option = Select.Option

class DeviceDetail extends Component {

    state = {
        device: memoryUtils.device||{},
        map_visible: false,
        nodes: [],
    }
    // 初始化地图
    initMap = () => {
        const { setFieldsValue }  = this.props.form
        if(!this.map){
            this.map = L.map('map', {
                center: MAP_CENTER,
                zoom: 14,
                zoomControl: false,
                attributionControl: false,
            })
            L.tileLayer(TMS, { maxZoom: 16 }).addTo(this.map)
            let dev_lat_lng = [this.state.device.dev_lat, this.state.device.dev_lng]
            this.dev = L.circle(dev_lat_lng, {radius:20, fillOpacity: 1}).addTo(this.map)
            this.map.setView(dev_lat_lng)
            this.map.setZoom(15)

            this.map.on("click", (e) => {
                this.dev.setLatLng([e.latlng.lat.toFixed(8), e.latlng.lng.toFixed(8)])
                setFieldsValue({ dev_lng: e.latlng.lng.toFixed(8), dev_lat: e.latlng.lat.toFixed(8) })
            })
            this.map._onResize()
        }
    }

    // 加载点位
    loadNodes = async () => {
        const result = await reqNodes()
        if(result.code === 1){
            let nodes = result.data
            this.setState({ nodes })
        }
    }
        
    // 根据ID获取设备详情
    loadDeviceById = async (dev_id) => {
        const result = await reqDeviceById(dev_id)
        if(result.code === 1){
            const device = result.data
            this.setState({ device })
            
        }else{
            message.error(result.message)
        }
    }

    // 显示地图
    showLocation = ( value ) => {
        this.setState({
            map_visible: true
        })
        !this.map||this.map === null ?this.initMap():this.map._onResize()
    }

    componentWillMount() {
        this.loadNodes()
    }
    

    componentDidMount() {
        let { device } = this.state
        if( !device.dev_id ){
            const dev_id = this.props.match.params.id
            this.loadDeviceById(dev_id)
        }else{
            this.loadDeviceById(device.dev_id)
        }
    }
    
    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return
        }
    }
    
    render() {

        const { map_visible, device, nodes } = this.state

        const { getFieldDecorator } = this.props.form

        // 表单行样式
        const form_layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 8 },
        }

        return (
            <div className="lyf-card">
                <div className="lyf-card-title">
                    <LinkButton onClick={ () => this.props.history.goBack() }>
                        <Icon type="arrow-left"></Icon>
                    </LinkButton>
                    &nbsp;&nbsp;
                    <span>设备管理</span>
                </div>
                <div className="lyf-card-content">
                    <Form
                        { ...form_layout }
                        onSubmit = { this.handleSubmit }
                        className="full"
                    >
                        <Item label="设备名称">
                            {
                                getFieldDecorator("dev_name", {
                                    initialValue: device.dev_name || '',
                                })(
                                    <Input />
                                )
                            }
                        </Item>
                        <Item label="设备坐标">
                            {
                                getFieldDecorator("dev_lat_lng", {
                                    initialValue: (device.dev_lng + ',' + device.dev_lat)||"",
                                    rules: [
                                        { required: false, message: "必须选择经纬度！" }
                                    ]
                                })(
                                    <Input.Search size="small" onSearch = { this.showLocation } enterButton="定位" placeholder="请选择经纬度!" />
                                )
                            }
                            <Modal
                                title = { "选择经纬度" }
                                okText = { "确定" }
                                cancelText = { "取消" }
                                centered = { true }
                                forceRender = { true }
                                visible = { map_visible }
                                onOk = { () => this.setState({ map_visible: false }) }
                                onCancel = { () => this.setState({ map_visible: false }) }
                            >
                                <div style={{ width: '100%', height: 300 }} id="map"></div>
                            </Modal>
                        </Item>
                        <Item label="拍摄角度">
                            {
                                getFieldDecorator("cap_angle", {
                                    initialValue: (''+device.cap_angle)||'',
                                })(
                                    <Input/>
                                )
                            }
                        </Item>
                        <Item label="设备点位">
                            {
                                getFieldDecorator("node_id", {
                                    initialValue: device.node_id || '',
                                })(
                                    
                                    nodes.length>0?<Select>
                                        {
                                            nodes.map( e => <Option key={ e.node_id } value={ e.node_id }>{ e.node_name }</Option> )
                                        }
                                    </Select>:<></>
                                )
                            }
                        </Item>
                        <Item label="拍摄方向">
                            {
                                getFieldDecorator("cap_dir", {
                                    initialValue: device.cap_dir || '',
                                })(
                                    <Select>
                                        {
                                            DEVICE_CAP_DIR.map( (e, i) => <Option key={i} value={i+1}>{e}</Option> )
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                        <Item label="拍摄车道数">
                            {
                                getFieldDecorator("cap_num", {
                                    initialValue: device.cap_num || '',
                                })(
                                    <Input/>
                                )
                            }
                        </Item>
                        <Item label="设备位置">
                            {
                                getFieldDecorator("dev_location", {
                                    initialValue: device.dev_location || '',
                                })(
                                    <Input/>
                                )
                            }
                        </Item>
                        <Item label="IP地址">
                            {
                                getFieldDecorator("ip_address", {
                                    initialValue: device.ip_address || '',
                                })(
                                    <Input/>
                                )
                            }
                        </Item>
                        <Item label="设备类型">
                            {
                                getFieldDecorator("dev_type", {
                                    initialValue: device.dev_type || '',
                                })(
                                    <Input/>
                                )
                            }
                        </Item>
                        <Item label="创建日期">
                            {
                                getFieldDecorator("create_time", {
                                    initialValue: device.create_time || '',
                                })(
                                    <Input/>
                                )
                            }
                        </Item>
                        <Item label="设备描述">
                            {
                                getFieldDecorator("description", {
                                    initialValue: device.description || '',
                                })(
                                    <Input/>
                                )
                            }
                        </Item>
                    </Form>
                </div>
            </div>
        )
    }
}
    
export default Form.create()(DeviceDetail)