import React, { Component } from 'react'
import LinkButton from '../../components/link-button'
import { Icon, Form, Input, InputNumber, Button, TimePicker, DatePicker, message } from 'antd'
import {LineSignalCal, LineDepict} from '../../utils/traffic/line-signal-cal'
import { ArrayMax } from '../../utils/ArrayCal'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { reqLineById, reqLineControlData } from '../../api'
import { getTodayDateString, getNextNDayDateString, getLastNDayDateString } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'

export default class LineSignalAdd extends Component {

    state = {
        line: memoryUtils.line||{},
        line_cycle: 0,
        line_speed: 0,
        line_node_offset: [],
        line_band_width: [0, 0, 0],
        line_node_name: [],
    }

    
    test_data = () => {

        // 测试数据
        let line_link_length = [0, 350, 400, 160, 540, 280, 280, 270]
        let line_node_cycle = [80, 80, 80, 80, 80, 80, 80, 80]
        let line_node_phase_offset = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
        let line_node_green_ratio = [[0.55, 0.6, 0.65, 0.65, 0.6, 0.65, 0.7, 0.5], [0.55, 0.6, 0.65, 0.65, 0.6, 0.65, 0.7, 0.5]]
        let line_node_phase_schema = ["0,5", "0,5", "0,5", "0,5", "0,5", "0,5", "0,5", "0,5"]
        let line_node_phase_time = ["44,36", "48,32", "52,28", "52,28", "48,32", "52,28", "56,24", "40,40"]
        let line_node_name = ["路口1", "路口2", "路口3", "路口4", "路口5", "路口6", "路口7", "路口8"]
        // 干线周期
        let line_cycle = 80
        // 点位间速度 km/h
        let line_speed = 45

        this.line_link_length = line_link_length
        this.line_node_cycle = line_node_cycle
        this.line_node_phase_offset = line_node_phase_offset
        this.line_node_green_ratio = line_node_green_ratio
        this.line_node_phase_schema = line_node_phase_schema
        this.line_node_phase_time = line_node_phase_time
        this.line_node_name = line_node_name

        this.setState({ line_node_name, line_cycle, line_speed })
        return [line_cycle, line_speed]

    }

    load_data = async () => {

        let line = this.state.line
        let line_id = 10

        const result = await reqLineById(line_id)
        const result2 = await reqLineControlData("2020-07-08", "2020-07-09", "07:00:00", "08:00:00", line_id)
        
        if(result.code === 1 && result2.code === 1){

            let line_node_name = result.data.nodes.map( e => e.node_name )

            let line_node_green_ratio = result2.data.line_node_green_ratio.filter( (e,i) => i < line_node_name.length ).map( e => e.green_ratio )
            line_node_green_ratio = [line_node_green_ratio, line_node_green_ratio]
            let line_node_cycle = result2.data.line_node_schema.map( e => e.schema_cycle )
            
            let line_node_phase_schema = result2.data.line_node_schema.map( e => e.phase_schema )
            let line_node_phase_time = result2.data.line_node_schema.map( e => e.phase_time )
            let line_link_length = result2.data.line_node_dist.map( e => e.link_length )
            let line_speed = result2.data.line_speed.toFixed(0)
    
            let line_node_phase_offset = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
    
            let line_cycle = line_node_cycle[0]


            this.line_control = new LineSignalCal(line_cycle, line_link_length, line_speed/3.6, line_node_cycle, line_node_green_ratio[0], line_node_name)
            let line_node_offset = this.line_control.setOption( line_cycle, line_speed/3.6, line_node_cycle )
            let line_band_width = this.line_control.getBandWidth()
            this.line_depict = new LineDepict("#svg", line_node_name, line_link_length, line_speed, line_cycle, line_node_phase_offset, line_node_green_ratio, line_node_phase_schema, line_node_phase_time, line_node_offset )
            this.line_depict.setOption(line_speed, line_cycle, line_node_offset, line_band_width)

            this.setState({ line_node_name, line_cycle, line_speed, line_node_offset, line_band_width })

        }else{
            message.error("无法加载干线控制数据！")
        }

    }


    
    set_data = async () => {

        let line = this.state.line
        let line_id = 10

        const result = await reqLineById(line_id)
        const result2 = await reqLineControlData("2020-07-08", "2020-07-09", "07:00:00", "08:00:00", line_id)
        
        if(result.code === 1 && result2.code === 1){

            let line_node_name = result.data.nodes.map( e => e.node_name )

            let line_node_green_ratio = result2.data.line_node_green_ratio.filter( (e,i) => i < line_node_name.length ).map( e => e.green_ratio )
            line_node_green_ratio = [line_node_green_ratio, line_node_green_ratio]
            let line_node_cycle = result2.data.line_node_schema.map( e => e.schema_cycle )
            
            let line_node_phase_schema = result2.data.line_node_schema.map( e => e.phase_schema )
            let line_node_phase_time = result2.data.line_node_schema.map( e => e.phase_time )
            let line_link_length = result2.data.line_node_dist.map( e => e.link_length )
            let line_speed = this.state.line_speed
    
            let line_node_phase_offset = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
    
            let line_cycle = this.state.line_cycle

            this.line_control = new LineSignalCal(line_cycle, line_link_length, line_speed/3.6, line_node_cycle, line_node_green_ratio[0], line_node_name)
            let line_node_offset = this.line_control.setOption( line_cycle, line_speed/3.6, line_node_cycle )
            let line_band_width = this.line_control.getBandWidth()
            this.line_depict = new LineDepict("#svg", line_node_name, line_link_length, line_speed, line_cycle, line_node_phase_offset, line_node_green_ratio, line_node_phase_schema, line_node_phase_time, line_node_offset )
            this.line_depict.setOption(line_speed, line_cycle, line_node_offset, line_band_width)

            this.setState({ line_node_name, line_cycle, line_speed, line_node_offset, line_band_width })

        }else{
            message.error("无法加载干线控制数据！")
        }

    }

    // 提交修改
    handleSubmit = async ( event ) => {
        event.preventDefault()
        this.set_data()
    }

    componentDidMount() {
        this.load_data()
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
          return
        }
    }

    render() {

        const { line_speed, line_cycle, line_band_width, line_node_offset, line_node_name } = this.state

        // 表单行样式
        const form_layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 8 },
        }

        const tailLayout = {
            wrapperCol: { offset: 10, span: 12 },
        }

        return (
            <div className="lyf-card">
                <div className="lyf-card-title">
                    <LinkButton onClick={ () => this.props.history.goBack() }>
                        <Icon type="arrow-left"></Icon>
                    </LinkButton>
                    &nbsp;&nbsp;
                    <span>干线信号管理</span>
                </div>
                <div className="lyf-card-content">
                    <div id="svg" className="lyf-col-6"></div>
                    <div className="lyf-col-4">
                        <Form
                            { ...form_layout }
                            onSubmit = { this.handleSubmit }
                        >
                            <Form.Item label="起始日期">
                                <DatePicker
                                    value={moment(getTodayDateString())}
                                    size="small"
                                    format = "YYYY-MM-DD"
                                />
                            </Form.Item>
                            <Form.Item label="结束日期">
                                <DatePicker 
                                    value={moment(getNextNDayDateString(2))}
                                    size="small"
                                    format = "YYYY-MM-DD"
                                />
                            </Form.Item>
                            <Form.Item label="起始时间">
                                <TimePicker
                                    value={moment("2020-01-01 07:00:00")}
                                    size="small"
                                    format = "HH:mm:ss"
                                />
                            </Form.Item>
                            <Form.Item label="结束时间">
                                <TimePicker
                                    value={moment("2020-01-01 08:00:00")}
                                    size="small"
                                    format = "HH:mm:ss"
                                />
                            </Form.Item>
                            <Form.Item label="干线速度">
                                <InputNumber value={line_speed} onChange={ line_speed => this.setState({ line_speed }) }/>
                            </Form.Item>
                            <Form.Item label="周期时长">
                                <InputNumber value={line_cycle} onChange={ line_cycle => this.setState({ line_cycle }) }/>
                            </Form.Item>
                            <Form.Item { ...tailLayout }>
                                <Button htmlType="submit"> 提交 </Button>
                            </Form.Item>
                        

                        <Form.Item label="绿波带宽">
                            <Input value={ line_band_width[2] } suffix="s"/>
                        </Form.Item>
                        {
                            line_node_offset.length>0?line_node_offset.map( (e, i) => <Form.Item label={ line_node_name[i] } key={ i }>
                                <Input value={ e } suffix="s"/>
                            </Form.Item> ):""
                        }
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}
