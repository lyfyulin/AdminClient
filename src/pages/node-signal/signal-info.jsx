import React, { Component } from 'react'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { Tabs, Table, Button, Form, DatePicker, TimePicker, Select, message } from 'antd'

import LyfItem from '../../components/item/item'
import { getDateString, getTimeString } from '../../utils/dateUtils'
import { reqNodeFlowByNodeId, reqNodes, reqNodeSchemaExecSearch } from '../../api'
import { DIRECTION_LIST } from '../../utils/ConstantUtils'
import { PHASE_SCHEMA } from '../../utils/ConstantUtils'
import SignalSchema from './signal-schema'
import { cal_control_time } from '../../utils/traffic/node-signal-cal'

const { TabPane } = Tabs
const { Option } = Select

class SignalInfo extends Component {

    state = {
        activeTab: '1',
        node_schema: [],
        nodes: [],
        value: undefined,
        flow: [],
        inter_type: 0,
    }


    initColumns = () => {
        this.phase_columns = [{
            title: '相序',
            dataIndex: "phase_index",
            align: 'center',
            render: phase_index => '相位' + phase_index,
        },{
            title: '相位',
            dataIndex: "phase_schema",
            align: 'center',
            render: phase_schema => PHASE_SCHEMA[phase_schema],
        },{
            title: '时长',
            dataIndex: "phase_time",
            align: 'center',
            render: phase_time => phase_time + 's',
        }]
        this.flow_columns = [{
            title: '方向',
            dataIndex: "direction",
            align: 'center',
            render: direction => DIRECTION_LIST[direction - 1]
        },{
            title: '直行',
            dataIndex: "t_flow",
            align: 'center',
        },{
            title: '左转',
            dataIndex: "left_flow",
            align: 'center',
        },{
            title: '右转',
            align: 'center',
            dataIndex: "right_flow",
        }]
    }

    // 加载点位
    loadNodes = async () => {
        const result = await reqNodes()
        if(result.code === 1){
            this.setState({ nodes: result.data })
        }else{
            message.error(result.message)
        }
    }
    
    // 表单点位过滤
    handleFilter = (inputValue, option) => {
        if(!/[a-zA-Z]/.test(inputValue)){
            return option.props.children.indexOf(inputValue) === -1?false:true
        }
    }

    // 点位选择
    handleChange = value => {
        this.setState({ value })
    }

    // 加载流量
    loadNodeFlow = async (start_date, end_date, start_time, end_time, node_id) => {

        const result = await reqNodeFlowByNodeId(start_date, end_date, start_time, end_time, node_id)
        
        if(result.code === 1){
            this.setState({ flow: result.data })
        } else {
            message.error(result.message)
        }

    }

    // 加载方案
    loadNodeSchema = async (start_date, end_date, start_time, end_time, node_id) => {

        const result = await reqNodeSchemaExecSearch(start_date, end_date, start_time, end_time, node_id)
        if(result.code === 1){
            this.setState({ node_schema: result.data.phases })
        } else {
            message.error(result.message)
        }
        
    }

    addSignalSchema = () => {
        this.props.history.push("/node-signal/add")
    }

    browseSignalSchema = () => {
        this.props.history.push("/node-signal/browse")
    }

    handleSubmit = ( event ) => {
        event.preventDefault()
        this.props.form.validateFields( (error, values) => {
            if( !error ){
                
                let start_date = getDateString(values["start_date"])
                let end_date = getDateString(values["end_date"])
                let start_time = getTimeString(values["start_time"])
                let end_time = getTimeString(values["end_time"])

                const { node_id } = values
                this.loadNodeSchema(start_date, end_date, start_time, end_time, node_id)
                this.loadNodeFlow(start_date, end_date, start_time, end_time, node_id)
                
            }
        } )
    }


    componentWillMount() {
        // let schema = cal_control_time()
        this.initColumns()
        this.loadNodes()
    }
    
    componentWillUnmount() {
        this.setState = (state, callback) => {
          return
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form

        const formLayout = {
            labelCol : { span: 11 } ,
            wrapperCol : { span: 11 },
        }
        const { activeTab, flow, nodes, node_schema, inter_type } = this.state

        const options = nodes.map(node => <Option key={node.node_id} value={node.node_id}>{node.node_name}</Option>)

        return (
            <div className="full">
                <div className="lyf-row-5" style={{ display: "flex" }}>
                    <div className="lyf-col-5 lyf-center">
                        <Form
                            { ...formLayout }
                            onSubmit = { this.handleSubmit }
                            style = {{ width: '100%', height: '100%', margin: 0, padding: 20 }}
                            className="lyf-center"
                        >
                        
                            <LyfItem label="交叉口名称">
                            {
                                getFieldDecorator("node_id", {
                                    initialValue: "",
                                })(
                                    <Select showSearch filterOption={this.handleFilter} style={{ width: '100%' }} placeholder="" onChange={this.handleChange}>
                                        {options}
                                    </Select>
                                )
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
                                    initialValue: moment("2020-01-01 07:00:00"),
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
                                    initialValue: moment("2020-01-01 08:00:00"),
                                })(
                                    <TimePicker 
                                        size="small"
                                        style={{ width:'100%' }} 
                                        placeholder="请选择时间" 
                                        size="small"
                                        format = "HH:mm:ss"
                                    />
                                )
                            }
                            </LyfItem>
                            <div style={{ textAlign: 'center' }}>
                                <Button onClick={this.browseSignalSchema}>查看</Button>
                                <Button onClick={this.addSignalSchema}>添加</Button>
                                <Button htmlType="submit">查询</Button>
                            </div>
                        </Form>
                    </div>
                    <div className="lyf-col-5 lyf-center">
                        <SignalSchema data = { node_schema } inter_type={ inter_type } />
                    </div>
                </div>
                <div className="lyf-row-5" style={{ display: "flex" }}>
                    <div className="lyf-col-5 lyf-center">
                        <Table
                            bordered = { true }
                            rowKey = "direction"
                            columns = { this.flow_columns }
                            dataSource = { flow }
                            pagination = { false }
                            align="center"
                            style={{ width: '80%', height:'90%', backgroundColor: 'white' }}
                        />
                    </div>
                    <div className="lyf-col-5 lyf-center">
                        <Tabs
                            activeKey = { activeTab }
                            onChange = { activeTab => this.setState({ activeTab }) }
                            style = {{ width: '100%', height: '100%', margin: 0, padding: 0 }}
                        >
                            <TabPane tab="相位图" key="1" id="flow" style={{ width: '100%', height: '100%', margin: 0, padding: 0,overflow:'scroll-y' }}>
                                <Table
                                    bordered = { true }
                                    // showHeader={false}
                                    rowKey = "phase_index"
                                    columns = { this.phase_columns }
                                    dataSource = { node_schema }
                                    pagination = { false }
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </TabPane>
                            <TabPane tab="相位表" key="2" style={{ width: '100%', height: '100%', margin: 0, padding: 0, backgroundColor: '#fcc' }}>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        )
    }
}

export default Form.create()( SignalInfo )

