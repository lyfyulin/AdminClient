import React, { Component } from 'react'
import { Input, DatePicker, Form, TimePicker, Cascader, message, Button, Select, Table, Icon, Tooltip } from 'antd'

import { reqNodes, reqLinks, reqDevices, reqExportCsv, reqVnSearch, reqLines, reqAreas, reqSearchData } from '../../api'
import { SEARCH_TYPE, SEARCH_TIPS } from '../../utils/baoshan'
import _ from 'lodash'
import moment from 'moment'
import 'moment/locale/zh-cn'

import './search.less'
import { getNowDateTimeString, getDateString, getTimeString } from '../../utils/dateUtils'

const Item = Form.Item
const Option = Select.Option

class SearchData extends Component {


    state = {
        node_list: [],
        link_list: [],
        line_list: [],
        area_list: [],
        device_list: [],
        changeItem: [],
        search_data: [],
        search_type: "",
    }

    // 定义搜索列表
    initSearchType = () => {
        this.options = [{
            value: 'safety',
            label: '交通安全',
            children: [{
                value: 'location',
                label: '事故点位',
            }],
        },{
            value: 'control',
            label: '交通控制',
            children: [{
                value: 'flow',
                label: '流量',
            },{
                value: 'schema',
                label: '信号方案',
                children: [{
                    value: 'node',
                    label: '点位',
                },{
                    value: 'line',
                    label: '干线',
                },{
                    value: 'area',
                    label: '区域',
                }],
            },{
                value: 'evaluation',
                label: '信号评价',
                children: [{
                    value: 'node',
                    label: '点位',
                },{
                    value: 'line',
                    label: '干线',
                },{
                    value: 'area',
                    label: '区域',
                }],
            }],
        },{
            value: 'od',
            label: '机动车出行',
            children: [{
                value: 'cnts',
                label: '出行量',
            },{
                value: 'o_cnts',
                label: '发生量',
            },{
                value: 'd_cnts',
                label: '吸引量',
            },{
                value: 'trip_time',
                label: '出行时间',
            },{
                value: 'trip_dist',
                label: '出行距离',
            },{
                value: 'trip_freq',
                label: '出行次数',
            }],
        },{
            value: 'car',
            label: '主题车辆',
            children: [{
                value: 'nonlocal',
                label: '外地车',
            },{
                value: 'tongqin',
                label: '通勤车',
            },{
                value: 'taxi',
                label: '出租车',
            },{
                value: 'online',
                label: '网约车',
            },{
                value: 'yellow',
                label: '黄牌车',
            },{
                value: 'yellow_flow',
                label: '黄牌车流量',
            },{
                value: 'province',
                label: '各省车牌',
            },{
                value: 'province_flow',
                label: '各省车牌流量',
            }]
        },{
            value: 'state',
            label: '交通态势',
            children: [{
                value: 'rdnet',
                label: '路网速度',
            },{
                value: 'vn',
                label: '在途量',
            },{
                value: 'link',
                label: '路段状态',
            },{
                value: 'intersection',
                label: '路口状态',
            }]

        },{
            value: 'device',
            label: '设备状态',
            children: [{
                value: 'rcg_rate',
                label: '识别率',
            },{
                value: 'not_miss_rate',
                label: '传输率',
            }]
        }]
    }

    // 加载基础数据
    load_data = async () => {
        let result = await reqNodes()
        result.code === 1? this.setState({ node_list: result.data }):message.error(result.message)
        result = await reqLinks()
        result.code === 1? this.setState({ link_list: result.data }):message.error(result.message)
        result = await reqDevices()
        result.code === 1? this.setState({ device_list: result.data }):message.error(result.message)
        result = await reqLines()
        result.code === 1? this.setState({ line_list: result.data }):message.error(result.message)
        result = await reqAreas()
        result.code === 1? this.setState({ area_list: result.data }):message.error(result.message)
    }

    onSearchTypeChange = (value, selectedOptions) => {
        const search_type = value.join("/")
        const changeItem = SEARCH_TYPE[search_type]
        this.setState({ changeItem, search_type })
    }
    
    filter = (inputValue, path) => {
        return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    }

    // 下拉框数据过滤
    handleFilter = (inputValue, option) => {
        if(!/[a-zA-Z]/.test(inputValue)){
            return option.props.children.indexOf(inputValue) === -1?false:true
        }
    }

    handleSearch = (e) => {
        e.preventDefault()
        this.props.form.validateFields( async (error, values) => {
            if( !error ){
                let { search_type, start_date, end_date, start_time, end_time } = values
                if( search_type.length < 1 ){
                    message.error("请选择下载数据类型！")
                }else{
                    search_type = search_type.join("/")
                    start_date = getDateString(values['start_date'])
                    end_date = getDateString(values['end_date'])
                    start_time = getTimeString(values['start_time'])
                    end_time = getTimeString(values['end_time'])
                    const search_keys = { ...values, search_type, start_date, end_date, start_time, end_time }

                    // 数据请求
                    const result = await reqSearchData(search_keys)
                    if(result.code === 1){
                        const search_data = result.data.map( (e, key) => ({key: key + 1, ...e}) )
                        let keys = Object.keys(search_data[0])
                        this.columns = keys.map( e => ({ title: e, dataIndex: e }))
                        this.setState({ search_data })
                    }else{
                        message.error(result.message)
                    }
                }
            }else{
                message.error("数据输入不完整！")
            }
        } )
    }

    downloadCsv = () => {
        
        const { search_data, search_type } = this.state
        let keys = Object.keys(search_data[0])
        let data = [keys.join(",")]
        search_data.forEach( e => {
            let tmp = Object.values(e)
            data.push(tmp.join(","))
        })
        const blob = new Blob(['\uFEFF' + data.join("\n")], {type: "text/plain"})
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = search_type + "_" + getNowDateTimeString() + ".csv"
        link.click()
        URL.revokeObjectURL(link.href)
    }

    // 下载
    handleDownload = async () => {

        if(this.state.search_data.length < 1){
            message.error("请先查询数据！")
        }else{
            this.downloadCsv()
        }
    }

    onWindowResize = _.throttle(() => {
        this.setState({ tableBodyHeight: window.innerHeight * 0.9 - 166  })
    }, 800)

    componentWillMount() {
        this.initSearchType()
        this.load_data()
        this.columns = null
    }
    
    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize)
        this.setState = (state, callback) => {
            return
        }
    }

    render() {
        
        const { changeItem, node_list, link_list, device_list, line_list, area_list, search_data, search_type } = this.state

        const { getFieldDecorator } = this.props.form

        const formLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        }
    
        return (
            <div className="full">
                <Form
                    style={{ height: 80 }}
                    { ...formLayout }
                    onSubmit = { this.handleSearch }
                >
                    <div className="lyf-center" style={{ height: 40 }}>
                        <div className="lyf-col-3 lyf-center">
                            <Item label="数据类型">
                                {
                                    getFieldDecorator("search_type", {
                                        initialValue: [],
                                        rules: []
                                    })(
                                        <Cascader
                                            size="small"
                                            options = { this.options }
                                            onChange = { this.onSearchTypeChange }
                                            placeholder = "选择检索数据"
                                            showSearch = {this.filter}
                                        />
                                    )
                                }
                            </Item>
                            
                        </div>
                        <Tooltip title={SEARCH_TIPS[search_type] || "数据下载"}>
                            &nbsp;&nbsp;<Icon type="info"/>&nbsp;&nbsp;
                        </Tooltip>
                        <div className="lyf-col-2 lyf-center">
                            {
                                changeItem.length > 0?changeItem.map( item =>
                                    <Item key={ item.name } label={ item.title } name={ item.name }>
                                        {
                                            getFieldDecorator(item.name, {
                                                initialValue: "",
                                            })(
                                                <Select
                                                    showSearch
                                                    filterOption={ this.handleFilter } 
                                                >
                                                    {
                                                        item.name === "node_id"? node_list.map( e=> <Option key={e.node_id} value={e.node_id}>{ e.node_name }</Option>):
                                                        item.name === "dev_id"? device_list.map( e=> <Option key={e.dev_id} value={e.dev_id}>{ e.dev_name }</Option>):
                                                        item.name === "link_id"? link_list.map( e=> <Option key={e.link_id} value={e.link_id}>{ e.link_name }</Option>):
                                                        item.name === "line_id"? line_list.map( e=> <Option key={e.line_id} value={e.line_id}>{ e.line_name }</Option>):
                                                        item.name === "area_id"? area_list.map( e=> <Option key={e.area_list} value={e.area_id}>{ e.area_name }</Option>):(<></>)
                                                    }
                                                </Select>
                                            )
                                        }
                                    </Item>
                                ):(<></>)
                            }
                        </div>
                    </div>
                    <div className="lyf-center" style={{ height: 40, borderBottom: '1px solid #1DA57A', borderTop: '1px solid #1DA57A' }}>
                        <div className="lyf-col-2 lyf-center">
                            <Item label="起始日期">
                                {
                                    getFieldDecorator("start_date", {
                                        initialValue: moment(),
                                    })(
                                        <DatePicker 
                                            placeholder="请选择日期" 
                                            size="small"
                                            format = "YYYY-MM-DD"
                                        />
                                    )
                                }
                            </Item>
                        </div>
                        <div className="lyf-col-2 lyf-center">
                            <Item label="结束日期" name="end_date">
                                {
                                    getFieldDecorator("end_date", {
                                        initialValue: moment(),
                                    })(
                                        <DatePicker 
                                            placeholder="请选择日期" 
                                            size="small"
                                            format = "YYYY-MM-DD"
                                        />
                                    )
                                }
                            </Item>
                        </div>
                        <div className="lyf-col-2 lyf-center">
                            <Item label="起始时间" name="start_time">
                                {
                                    getFieldDecorator("start_time", {
                                        initialValue: moment("2020-01-01 00:00:00"),
                                    })(
                                        <TimePicker 
                                            size="small"
                                            placeholder="请选择时间" 
                                            size="small"
                                            format = "HH:mm:00"
                                        />
                                    )
                                }
                            </Item>
                        </div>
                        <div className="lyf-col-2 lyf-center">
                            <Item label="结束时间" name="end_time">
                                {
                                    getFieldDecorator("end_time", {
                                        initialValue: moment("2020-01-01 23:59:59"),
                                    })(
                                        <TimePicker 
                                            size="small"
                                            placeholder="请选择时间" 
                                            size="small"
                                            format = "HH:mm:00"
                                        />
                                    )
                                }
                            </Item>
                        </div>
                        <div className="lyf-col-1 lyf-center">
                            <Item>
                                <Button htmlType="submit">查询</Button>
                            </Item>
                        </div>
                        <div className="lyf-col-1 lyf-center">
                            <Item>
                                <Button onClick={ this.handleDownload }>下载</Button>
                            </Item>
                        </div>
                    </div>
                </Form>
                <div style={{ backgroundColor:'#fff', height: 'calc(100% - 82px)' }}>
                    <Table
                        style={{ wordBreak: 'break-all' }}
                        rowKey = "key"
                        columns = { this.columns }
                        dataSource = { search_data }
                        pagination = { false }
                        scroll={{ y: window.innerHeight * 0.9 - 176 }}
                    />
                </div>
            </div>
        )
    }
}


export default Form.create()(SearchData)
