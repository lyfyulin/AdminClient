import React, { Component } from 'react'
import LyfItem from '../../components/item/item'
import { DatePicker, Button, TimePicker, Form, Input, Table } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
import L from 'leaflet'
import LinkButton from '../../components/link-button'
import { MAP_CENTER, TMS } from '../../utils/baoshan'


class AccidentsInfo extends Component {

    state = {
        accidents: [
            { id: 1, index: 1, time: '2019-08-13' },
            { id: 2, index: 3, time: '2019-08-14' },
            { id: 3, index: 4, time: '2019-08-16' },
            { id: 4, index: 5, time: '2019-08-17' },
        ],
        loading: false,
    }

    initMap = () => {
        this.map = L.map('map', {
            center: MAP_CENTER,
            zoom: 14
        })
        L.tileLayer(TMS, {}).addTo(this.map)
        this.map._onResize()
    }

    initColumns = () => {
        this.columns = [{
            title: '序号',
            dataIndex: 'index',
            key: 'index',
        },{
            title: '时间',
            dataIndex: 'time',
            key: 'time',
        },{
            title: '查看详情',
            render: accident => (
                <LinkButton onClick = {() => {
                    this.props.history.push( "/accidents/detail", accident )
                }}>查看详情</LinkButton>
            )
        }]
    }

    loadAccidents = () => {
        this.setState({ loading: true })
        this.setState({ loading: false })
    }

    handleSubmit = ( e ) => {
        e.preventDefault();
        this.props.form.validateFields( (err, values) => {
            if( !err ){
                console.log( values );
            }
        } )
    }

    componentWillMount() {
        this.initColumns()
        this.loadAccidents()
    }
    

    componentDidMount() {
        this.initMap()
        // let heat2 = heatlayer([[25.13, 99.175, 1]]).addTo(this.map);
        // this.map.on("mousemove",  _.throttle( e => heat2.addLatLng([e.latlng.lat, e.latlng.lng]), 100 ))
    }

    render() {

        const { accidents, loading } = this.state

        const { getFieldDecorator } = this.props.form

        return (
            <div className="lyf-card">
                <Form
                    onSubmit = { this.handleSubmit }
                    style = {{ width: '100%', height: '20%' }}
                >

                    <div style={{ display: 'flex', flexWrap: 'wrap', height: "50%", paddingTop: '1%' }}>
                        <div style={{ width: '30%' }}>
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
                        <div style={{ width: '30%' }}>
                        <LyfItem label="时间范围">
                            {
                                getFieldDecorator("start_time", {
                                    initialValue: moment('2020-01-01 00:00:00'),
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
                                    initialValue: moment(),
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
                        <div style={{ width: '15%' }}>
                            <LyfItem label="年龄">
                            {
                                getFieldDecorator("filter_options", {
                                    initialValue: "",
                                })(
                                    <Input size="small"/>
                                )
                            }
                            </LyfItem>
                        </div>
                        <div style={{ width: '15%' }}>
                            <LyfItem label="性别">
                            {
                                getFieldDecorator("filter_options", {
                                    initialValue: "",
                                })(
                                    <Input size="small"/>
                                )
                            }
                            </LyfItem>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', height: "50%" }}>
                        <div style={{ width: '30%' }}>
                            <LyfItem label="事故类型">
                                {
                                    getFieldDecorator("filter_options", {
                                        initialValue: "",
                                    })(
                                        <Input size="small"/>
                                    )
                                }
                            </LyfItem>
                            </div>
                        <div style={{ width: '30%' }}>
                            <LyfItem label="事故主体">
                                {
                                    getFieldDecorator("filter_options", {
                                        initialValue: "",
                                    })(
                                        <Input size="small"/>
                                    )
                                }
                            </LyfItem>
                        </div>
                        <div style={{ width: '20%' }}>
                            <LyfItem label="事故地点">
                                {
                                    getFieldDecorator("filter_options", {
                                        initialValue: "",
                                    })(
                                        <Input size="small"/>
                                    )
                                }
                            </LyfItem>
                        </div>
                        <div style = {{ width: '5%', textAlign: 'center', alignItems: 'center' }}>
                            <Button htmlType="submit" size="small" style={{ marginTop: 10 }}> 查询 </Button>
                        </div>
                        <div style = {{ width: '10%', textAlign: 'center', alignItems: 'center' }}>
                            <Button htmlType="submit" size="small" style={{ marginTop: 10 }}
                                onClick = { () => this.props.history.push("/accidents/add") }
                            > 添加事故 </Button>
                        </div>
                    </div>
                
                </Form>
                <div style={{ height: "80%", display: 'flex' }}>
                    <div style={{ width: "60%", height: '100%', minWidth: 400, minHeight: 400 }} id="map">

                    </div>
                    <div style={{ width: "40%", height: '100%' }}>
                        <Table
                            bordered = { true }
                            rowKey = "id"
                            columns = { this.columns }
                            dataSource = { accidents }
                            loading = { loading }
                        >
                        </Table>
                    </div>
                                
                </div>
                
            </div>
        )
    }
}

export default Form.create()(AccidentsInfo)