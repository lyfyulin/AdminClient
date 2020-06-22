import React, { Component } from 'react'

import moment from 'moment'
import 'moment/locale/zh-cn'
import { Table, message, Select, Button, Form, DatePicker, TimePicker, Radio, Checkbox } from 'antd'

import { reqNodeSchemas, reqNodes, reqNodeSchemaById, reqDeleteNodeSchema, reqNodeSchemaExecSearch } from '../../api'
import { DIRECTION_LIST } from '../../utils/ConstantUtils'
import { PHASE_SCHEMA } from '../../utils/ConstantUtils'
import SignalSchema from './signal-schema'
import { vector } from '../../utils/ArrayCal'
import memoryUtils from '../../utils/memoryUtils'
import LinkButton from '../../components/link-button'
import { getDateString, getTimeString } from '../../utils/dateUtils'

const Option = Select.Option
const Item = Form.Item
class NodeSignalInfo extends Component {

    state = {
        nodes: [],
        schema_list: [],
        node_id: undefined,
        schema_phases: [],
    }

    initColumns = () => {
        this.schema_columns = [{
            title: '方案编号',
            dataIndex: "node_schema_id",
            align: 'center',
            render: node_schema_id => <Button onClick={ () => this.loadNodeSchemaById(node_schema_id) }>{node_schema_id}</Button>
        },{
            title: '执行日期',
            align: 'center',
            render: schema => schema.start_date + ' 至 ' + schema.end_date,
        },{
            title: '执行时间',
            align: 'center',
            render: schema => schema.start_time.substr(11, 5) + '至' + schema.end_time.substr(11, 5)
        },{
            title: '是否执行',
            dataIndex: "execution",
            align: 'center',
            render: execution => execution===1?"正在执行":"未执行"
        },{
            title: '周期',
            dataIndex: "schema_cycle",
            align: 'center',
        },{
            title: '描述',
            dataIndex: "description",
            align: 'center',
        },{
            title: '操作',
            align: 'center',
            render: node_schema => <LinkButton
                onClick = { () => {
                    this.loadNodeSchemaById(node_schema.node_schema_id)
                    this.props.history.push("/node-signal/update")
                } }
            >修改</LinkButton>
        },{
            title: '删除',
            align: 'center',
            render: node_schema => <LinkButton
                onClick = { async () => {
                    const result = await reqDeleteNodeSchema(node_schema.node_schema_id)
                    if(result.code === 1){
                        this.props.history.push("/node-signal/browse")
                    }else{
                        message.error(result.message)
                    }
                } }
            >删除</LinkButton>
        }]
        this.phase_columns = [{
            title: '方案编号',
            dataIndex: "node_schema_id",
            align: 'center',
        },{
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
    }

    // 加载点位
    loadNodes = async () => {
        const result = await reqNodes()
        if(result.code === 1){
            const nodes = result.data
            if(!memoryUtils.node.node_id){
                memoryUtils.node = nodes[0]
            }
            this.setState({ nodes })
            this.loadNodeSchemas(memoryUtils.node.node_id)

        }else{
            message.error(result.message)
        }
    }

    handleChange = (node_id) => {
        this.setState({ node_id })
        memoryUtils.node = this.state.nodes.filter( node => node.node_id === node_id*1 )[0]
    }

    // 加载全部方案
    loadNodeSchemas = async (node_id) => {
        const result = await reqNodeSchemas(node_id)
        if(result.code === 1){
            this.setState({ schema_list: result.data })
        } else {
            message.error(result.message)
        }
    }

    loadNodeSchemaById = async (node_schema_id) => {

        const result = await reqNodeSchemaById(node_schema_id)
        if(result.code === 1){
            let node_schema = result.data
            let schema_phases = vector.property_unique(node_schema.phases, 'phase_index')
            node_schema.phases = schema_phases
            memoryUtils.node_schema = node_schema
            this.setState({ schema_phases })
        } else {
            message.error(result.message)
        }
        
    }

    // 表单点位过滤
    handleFilter = (inputValue, option) => {
        if(!/[a-zA-Z]/.test(inputValue)){
            return option.props.children.indexOf(inputValue) === -1?false:true
        }
    }

    handleSubmit = (event) => {
        event.preventDefault()
        this.props.form.validateFields( async (error, values) => {
            if( !error ){
                let start_date = getDateString(values["start_time"])
                let end_date = getDateString(values["end_time"])
                let start_time = getTimeString(values["start_time"])
                let end_time = getTimeString(values["end_time"])
                const result = await reqNodeSchemaExecSearch(start_date, end_date, start_time, end_time)
            }
        } )
    }

    componentWillMount() {
        this.loadNodes()
        this.initColumns()
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    render() {

        const { getFieldDecorator } = this.props.form

        const { nodes, schema_list, schema_phases } = this.state

        const formLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        }
    
        const options = nodes.map(node => <Option key={node.node_id} value={node.node_id}>{node.node_name}</Option>)

        return (
            <div className="full">
                <Form
                    style={{ height: 60, width:'100%' }}
                    { ...formLayout }
                    onSubmit = { this.handleSubmit }
                >
                    <div className="full lyf-center" style={{ height: 60, borderBottom: '1px solid #1DA57A', borderTop: '1px solid #1DA57A' }}>
                        <div className="lyf-col-2 lyf-center">
                            <Item label="路口名称">
                                {
                                    getFieldDecorator("node_id", {
                                        initialValue: nodes.length>0?nodes[0].node_id:"",
                                    })(
                                        <Select 
                                            showSearch 
                                            filterOption={this.handleFilter} 
                                            style={{ width: '100%' }} 
                                            placeholder="" 
                                            onChange={this.handleChange}
                                            size="small"
                                        >
                                            {options}
                                        </Select>
                                    )
                                }
                            </Item>
                        </div>
                        <div className="lyf-col-2 lyf-center">
                            <Item label="起始时间" name="start_time">
                                {
                                    getFieldDecorator("start_time", {
                                        initialValue: moment("2020-01-01 07:00:00"),
                                    })(
                                        <TimePicker 
                                            style={{ width:'100%' }} 
                                            placeholder="请选择时间" 
                                            size="small"
                                            format = "YYYY-MM-DD HH:mm:ss"
                                        />
                                    )
                                }
                            </Item>
                        </div>
                        <div className="lyf-col-2 lyf-center">
                            <Item label="结束时间" name="end_time">
                                {
                                    getFieldDecorator("end_time", {
                                        initialValue: moment("2020-01-01 08:00:00"),
                                    })(
                                        <TimePicker 
                                            size="small"
                                            style={{ width:'100%' }} 
                                            placeholder="请选择时间" 
                                            size="small"
                                            format = "YYYY-MM-DD HH:mm:ss"
                                        />
                                    )
                                }
                            </Item>
                        </div>
                        <div className="lyf-col-1 lyf-center" style={{ textAlign:"center" }}>
                            {
                                getFieldDecorator("execution", {
                                    initialValue: false,
                                })(
                                    <Checkbox style={{ width: '100%' }}>执行</Checkbox>
                                )
                            }
                        </div>
                        <div className="lyf-col-1 lyf-center" style={{ textAlign:"center" }}>
                            <Button htmlType="submit" size="small">查询</Button>
                        </div>
                        <div className="lyf-col-1 lyf-center" style={{ textAlign:"center" }}>
                            <Button size="small" onClick={ () => { this.loadNodeSchemas(this.state.node_id) } }>全部方案</Button>
                        </div>
                        <div className="lyf-col-1 lyf-center" style={{ textAlign:"center" }}>
                            <Button size="small" onClick={ () => { this.props.history.push("/node-signal/add") } }>添加方案</Button>
                        </div>
                    </div>
                </Form>
                <div style={{ width: '100%', height: "calc(100% - 80px)", display: 'flex', flexWrap: 'nowrap' }}>
                    <div className="lyf-col-5">
                        <Table
                            bordered = { true }
                            rowKey = "node_schema_id"
                            columns = { this.schema_columns }
                            dataSource = { schema_list }
                            pagination = { false }
                            align="center"
                        />
                    </div>
                    <div className="lyf-col-5">
                        <div className="lyf-row-5 lyf-center">
                            <SignalSchema data = { schema_phases }/>
                        </div>
                        <div className="lyf-row-5 lyf-center">
                            <Table
                                bordered = { true }
                                rowKey = "phase_index"
                                columns = { this.phase_columns }
                                dataSource = { schema_phases }
                                pagination = { false }
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Form.create()(NodeSignalInfo)