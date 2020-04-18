import React, { Component } from 'react'
import { Icon, Button, Form, Input, DatePicker, TimePicker, Tabs, Table } from 'antd'
import LinkButton from '../../components/link-button'
import LyfItem from '../../components/item/item'
import NodeFlow from '../../utils/node-flow'
import moment from 'moment'
import 'moment/locale/zh-cn'

const { TabPane } = Tabs

class IntersectionFlow extends Component {

    state = {
        activeDirection: '1',
        flow: [],
    }

    onChange = (value, dateString) => {
        console.log('Selected Time: ', value)
        console.log('Formatted Selected Time: ', dateString)
    }


    handleSubmit = ( event ) => {
        event.preventDefault();
        this.props.form.validateFields( (error, values) => {
            if( !error ){
                console.log( values );
            }
        } )
        this.flow_chart.setOption( [100,2,3,4,5,6,6,7,8,9,9,9] )
    }

    componentDidMount() {
        this.flow_chart = new NodeFlow("#flow")
        this.flow_chart.draw()
    }

    render() {
        const { activeDirection } = this.state
        const { getFieldDecorator } = this.props.form
        const formLayout = {
            labelCol : { span: 11 } ,
            wrapperCol : { span: 11 },
        }
        return (
            <div className="lyf-card">
                <div className="lyf-card-title">
                    <LinkButton onClick={ () => this.props.history.goBack() }>
                        <Icon type="arrow-left"></Icon>
                    </LinkButton>
                    &nbsp;&nbsp;
                    <span>交叉口</span>
                </div>
                <div className="lyf-card-content">
                    <div className="lyf-col2">
                        <div className="lyf-row2">
                            <Form
                                { ...formLayout } 
                                onSubmit = { this.handleSubmit }
                                style = {{ width: '100%', height: '100%', margin: 0, padding: 20 }}
                            >
                                <LyfItem label="交叉口名称">
                                    {
                                        getFieldDecorator("intersection_name", {
                                            initialValue: '交叉口1',
                                        })(<Input size="small"/>)
                                    }
                                </LyfItem>
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
                                <LyfItem label="结束时间">
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
                                <div style={{ textAlign: 'center' }}>
                                    <Button htmlType="submit">查询</Button>
                                </div>
                            </Form>
                        </div>
                        <div className="lyf-row2">
                        </div>
                    </div>
                    <div className="lyf-col2">
                        <div className="lyf-row1">
                            <Tabs
                                activeKey = { activeDirection }
                                onChange = { activeDirection => this.setState({ activeDirection }) }
                                style = {{ width: '100%', height: '100%', margin: 0, padding: 0 }}
                            >
                                <TabPane tab="流量图" key="1" id="flow" style={{ width: '100%', height: 500, margin: 0, padding: 0 }}>
                                </TabPane>
                                <TabPane tab="流量表" key="2" style={{ width: '100%', height: 500, margin: 0, padding: 0, backgroundColor: '#fcc' }}>
                                    Content of Tab Pane 2
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Form.create()( IntersectionFlow )