import React, { Component } from 'react'
import { Card, Button, Table, message, Form, Icon, DatePicker, Input, TimePicker } from 'antd'
import LinkButton from '../../components/link-button'
import LyfItem from '../../components/item/item'
import moment from 'moment'
import 'moment/locale/zh-cn'
import L from 'leaflet'
import {AntPath, antPath} from 'leaflet-ant-path'
import '../../utils/leaflet/leaflet.motion'
import { MAP_CENTER, TMS } from '../../utils/baoshan'
import { reqPathByPlate } from '../../api'
import { getDateString } from '../../utils/dateUtils'
import { bd09togcj02 } from '../../utils/lnglatUtils'
import { ang } from '../../utils/ArrayCal'

class Trajectory extends Component {

    state = {
        paths: []
    }

    // 初始化地图
    initMap = () => {
        this.map = L.map('map', {
            center: MAP_CENTER,
            zoom: 13,
            zoomControl: false,
            attributionControl: false,
        })
        L.tileLayer(TMS, { maxZoom:16 }).addTo(this.map)
        this.map._onResize()
    }

    initColumns = () => {
        this.columns = [{
            title: '序号',
            align: 'center',
            dataIndex: "rn",
        },{
            title: '点位',
            align: 'center',
            dataIndex: "node_name",
        },{
            title: '停留时间',
            align: 'center',
            dataIndex: "tt",
            render: tt => tt?(parseFloat(tt).toFixed(2) + '分钟'):"",
        },{
            title: '定位',
            align: 'center',
            render: data => {
                
            },
        }]
    }

    handleSubmit = ( e ) => {
        e.preventDefault();
        this.props.form.validateFields( async (err, values) => {
            if( !err ){
                const result = await reqPathByPlate(getDateString(values["start_date"]), getDateString(values["end_date"]), values["car_num"])
                if(result.code === 1){
                    const data = result.data
                    this.setState({ paths: data })

                    let motions = []

                    for(let i = 0; i < data.length - 1; i++){
                        let lng1 = bd09togcj02(data[i].olng, data[i].olat)[0]
                        let lat1 = bd09togcj02(data[i].olng, data[i].olat)[1]
                        let lng2 = bd09togcj02(data[i].dlng, data[i].dlat)[0]
                        let lat2 = bd09togcj02(data[i].dlng, data[i].dlat)[1]
                        let line_path = [{lat: lat1, lng: lng1}, {lat: lat2, lng: lng2}];
                        let path_angle = Math.atan((lat1 - lat2) / (lng2 - lng1)) * 180 / 3.1415
                        motions.push(
                            L.motion.polyline(line_path, {color: "#ff0"}, {easing: L.Motion.Ease.easeInOutQuad}, {
                                removeOnEnd: true,
                                icon: L.divIcon({
                                    html: `<img src='car4.png' style='width: 20px;transform:rotate(${path_angle}deg)' />`,
                                    iconSize: L.point(2, 2),
                                    iconAnchor: L.point(12.5, 10)
                                })
                            }).motionSpeed(10000)
                        )
                    }
                    if(this.seqGroup !== null){
                        this.seqGroup.remove();
                    }
                    this.seqGroup = L.motion.seq(motions).addTo(this.map)
                    this.seqGroup.motionStart()

                }else{
                    message.error(result.message)
                }

            }
        } )
    }

    componentDidMount() {
        this.seqGroup = null
        this.initColumns()
        this.initMap()
    }
    
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    render() {
        
        const { getFieldDecorator }  = this.props.form

        const { paths } = this.state

        const formLayout = {
            labelCol : { span: 6 } ,
            wrapperCol : { span: 12 },
        }

        return (
            <div className="full">
                <div className="lyf-row-1">
                    <Form
                        { ...formLayout } 
                        onSubmit = { this.handleSubmit }
                        className="lyf-center"
                        style = {{ width: '100%', height: '100%', margin: 0, padding: 0 }}
                    >
                        <div className="lyf-col-2">
                        <LyfItem label="车牌号">
                            {
                                getFieldDecorator("car_num", {
                                    initialValue: "",
                                })(<Input size="small"/>)
                            }
                        </LyfItem>
                        </div>
                        <div className="lyf-col-3">
                        <LyfItem label="日期范围">
                            {
                                getFieldDecorator("start_date", {
                                    initialValue: moment(),
                                })(
                                    <DatePicker 
                                        style={{ width:'100%' }} 
                                        placeholder="请选择日期" 
                                        size="small"
                                        format = "YYYY-MM-DD"
                                    />
                                )
                            }
                            &nbsp;-&nbsp;
                            {
                                getFieldDecorator("end_date", {
                                    initialValue: moment(),
                                })(
                                    <DatePicker 
                                        style={{ width:'100%' }} 
                                        placeholder="请选择日期" 
                                        size="small"
                                        format = "YYYY-MM-DD"
                                    />
                                )
                            }
                        </LyfItem>
                        </div>
                        <div className="lyf-col-3">
                        <LyfItem label="时间范围">
                            {
                                getFieldDecorator("start_time", {
                                    initialValue: moment("2020-01-01 00:00:00"),
                                })(
                                    <TimePicker 
                                        style={{ width:'100%' }} 
                                        placeholder="请选择时间" 
                                        size="small"
                                        format = "HH:mm:ss"
                                    />
                                )
                            }
                            &nbsp;-&nbsp;
                            {
                                getFieldDecorator("end_time", {
                                    initialValue: moment("2020-01-01 23:59:59"),
                                })(
                                    <TimePicker 
                                        style={{ width:'100%' }} 
                                        placeholder="请选择时间" 
                                        size="small"
                                        format = "HH:mm:ss"
                                    />
                                )
                            }
                        </LyfItem>
                        </div>
                        <div className="lyf-col-1">
                            <Button size="small" htmlType="submit">查询</Button>
                        </div>
                    </Form>
                </div>
                <div className="lyf-row-9" style={{ display: "flex", flexWrap: "nowrap" }}>
                    <div className="lyf-col-5" id="map">
                    </div>
                    <div className="lyf-col-5">
                        <div className="lyf-row-1 lyf-center lyf-font-4">
                            常驻点:{paths.length<1?"":paths.filter(e => e.time_point.substr(11, 10) >= '04:00:00' )[0].node_name}
                        </div>
                        <div className="lyf-row-9" style={{ overflow: 'scroll' }}>
                            <Table
                                bordered = { true }
                                rowKey = "rn"
                                columns = { this.columns }
                                dataSource = { paths }
                                pagination = { false }
                                onRow = {
                                    record => {
                                        return {
                                            onClick: event => console.log(event.target)
                                        }
                                    }
                                }
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Form.create()(Trajectory)

