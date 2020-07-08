import React, { Component } from 'react'
import LinkButton from '../../components/link-button'
import { Icon, Form, Input, InputNumber, Button } from 'antd'
import {LineSignalCal, LineDepict} from '../../utils/traffic/line-signal-cal'
import { ArrayMax } from '../../utils/ArrayCal'

export default class LineSignalAdd extends Component {

    state = {
        line_cycle: 120,
        line_speed: 45,
        line_node_offset: [],
        line_band_width: [0, 0, 0],
    }

    load_data = () => {

        /*
        // 测试数据
        let line_cycle = 80
        let line_link_length = [0, 350, 400, 160, 540, 280, 280, 270]
        let line_speed = 45
        let line_node_phase_offset = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
        let line_node_cycle = [80, 80, 80, 80, 80, 80, 80, 80]
        let line_node_green_ratio = [[0.55, 0.6, 0.65, 0.65, 0.6, 0.65, 0.7, 0.5], [0.55, 0.6, 0.65, 0.65, 0.6, 0.65, 0.7, 0.5]]
        let line_node_phase_schema = ["0,5", "0,5", "0,5", "0,5", "0,5", "0,5", "0,5", "0,5"]
        let line_node_phase_time = ["44,36", "48,32", "52,28", "52,28", "48,32", "52,28", "56,24", "40,40"]
        let line_node_name = ["路口1", "路口2", "路口3", "路口4", "路口5", "路口6", "路口7", "路口8"]
        */

        // 点位间距离
        this.line_link_length = [0, 292, 634, 420, 395, 245, 611]
        // 点位周期时长
        this.line_node_cycle = [120, 120, 120, 120, 120, 120, 120]
        // 协调相位时间差(协调相位为第一相位则为0)   [[正向], [反向]]
        this.line_node_phase_offset = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
        // 协调相位绿信比   [[正向], [反向]]
        this.line_node_green_ratio = [[0.392, 0.475, 0.32, 0.525, 0.566, 0.525, 0.525], [0.392, 0.475, 0.32, 0.525, 0.566, 0.525, 0.525]]
        // 路口方案和时长
        this.line_node_phase_schema = ["1,2,8,9", "1,2,5", "1,4,2,6,9,7", "1,2,5", "1,2,5", "1,2,5", "1,2,5"]
        this.line_node_phase_time = ["47,23,13,37", "57,33,30", "38,4,23,28,3,24", "63,27,30", "68,24,28", "63,27,30", "63,27,30"]
        this.line_node_name = ["人民路与永昌路交叉口", "龙泉路与永昌路交叉口", "保岫路与永昌路交叉口", "永昌路与新闻路交叉口", "象山路与永昌路交叉口", "建设路与永昌路交叉口", "升阳路与永昌路交叉口"]
        
        // 干线周期
        let line_cycle = ArrayMax(this.line_node_cycle)
        // 点位间速度 km/h
        let line_speed = 45

        this.setState({ line_cycle, line_speed })

    }


    init_cal_line_control = () => {

        const {line_speed, line_cycle} = this.state

        let line_link_length = this.line_link_length
        let line_node_cycle = this.line_node_cycle.map( e => line_cycle )
        let line_node_green_ratio = this.line_node_green_ratio
        let line_node_name = this.line_node_name

        this.line_control = new LineSignalCal(line_cycle, line_link_length, line_speed/3.6, line_node_cycle, line_node_green_ratio[0], line_node_name)
        this.line_control.setOption(line_cycle, line_link_length, line_speed/3.6, line_node_cycle, line_node_green_ratio[0], line_node_name)
        
        this.setState({ line_node_offset: this.line_control.getOffset(), line_band_width: this.line_control.getBandWidth() })

    }

    init_depict_line_control = () => {

        const { line_speed, line_cycle } = this.state

        let line_link_length = this.line_link_length
        let line_node_green_ratio = this.line_node_green_ratio
        let line_node_name = this.line_node_name

        let line_node_phase_offset = this.line_node_phase_offset
        let line_node_phase_schema = this.line_node_phase_schema
        let line_node_phase_time = this.line_node_phase_time

        let line_node_offset = this.line_control.getOffset()
        this.line_depict = new LineDepict("#svg", line_node_name, line_link_length, line_speed, line_cycle, line_node_phase_offset, line_node_green_ratio, line_node_phase_schema, line_node_phase_time, line_node_offset )
        this.line_depict.setOption(line_speed, line_cycle)
    }

    set_cal_line_control = () => {

        const {line_speed, line_cycle} = this.state

        let line_link_length = this.line_link_length
        let line_node_cycle = this.line_node_cycle.map( e => line_cycle )
        let line_node_green_ratio = this.line_node_green_ratio
        let line_node_name = this.line_node_name

        this.line_control.setOption(line_cycle, line_link_length, line_speed/3.6, line_node_cycle, line_node_green_ratio[0], line_node_name)
        
        this.setState({ line_node_offset: this.line_control.getOffset(), line_band_width: this.line_control.getBandWidth() })
    }

    set_depict_line_control = () => {

        const { line_speed, line_cycle } = this.state
        let line_link_length = this.line_link_length
        let line_node_green_ratio = this.line_node_green_ratio
        let line_node_name = this.line_node_name

        let line_node_phase_offset = this.line_node_phase_offset
        let line_node_phase_schema = this.line_node_phase_schema
        let line_node_phase_time = this.line_node_phase_time

        let line_node_offset = this.line_control.getOffset()

        this.line_depict.setOption(line_speed, line_cycle)
        
    }



    cal_line = () => {
        this.load_data()
        this.init_cal_line_control()
        this.init_depict_line_control()
    }

    set_line = () => {
        this.set_cal_line_control()
        this.set_depict_line_control()
    }

    // 提交修改
    handleSubmit = async ( event ) => {
        event.preventDefault()
        this.set_line()
    }

    componentDidMount() {
        this.cal_line()
    }
    

    render() {

        const { line_speed, line_cycle, line_band_width } = this.state

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
                            <Form.Item label="公共周期">
                                <InputNumber defaultValue={ line_cycle } onChange={ line_cycle => this.setState({ line_cycle }) }/>
                            </Form.Item>
                            <Form.Item label="干线速度">
                                <InputNumber defaultValue={ line_speed } onChange={ line_speed => this.setState({ line_speed }) }/>
                            </Form.Item>
                            <Form.Item { ...tailLayout }>
                                <Button htmlType="submit"> 提交 </Button>
                            </Form.Item>
                        </Form>

                        { "双向绿波带宽为:" + line_band_width[2] + 's' }
                    </div>
                </div>
            </div>
        )
    }
}
