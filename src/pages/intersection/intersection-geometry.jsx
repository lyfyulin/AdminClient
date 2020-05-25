import React, { Component } from 'react'
import { Form, Input, Tabs, Radio, Button, TreeSelect, Icon, Select, Modal, Checkbox, message } from 'antd'
import { DIRECTION_LIST, LANE, DIRECTION } from '../../utils/ConstantUtils'
import LinkButton from '../../components/link-button'
import L from 'leaflet'
import { MAP_CENTER, TMS } from '../../utils/baoshan'
import memoryUtils from '../../utils/memoryUtils'
import { reqNodeById, reqUpdateNode } from '../../api'

const { TabPane } = Tabs
const { Option } = Select

class IntersectionGeometry extends Component {

    constructor(props) {
        super(props)
        this.map = null
    }

    state = {
        node: memoryUtils.node,
        activeDirection: '1',
        direction_list: ['1', '2', '3', '4'],
        direction_lane_dir: [3, 3, 3, 3],
        intersection_location_visible: false,
        more_settings: false,
    }

    initMap = () => {
        const { setFieldsValue }  = this.props.form
        window.onload = () => {
            if(!this.map){
                this.map = L.map('map', {
                    center: MAP_CENTER,
                    zoom: 14
                })
                L.tileLayer(TMS, { maxZoom: 16 }).addTo(this.map)
                let node_lng_lat = this.state.node.node_lng_lat
                node_lng_lat = node_lng_lat?[parseFloat(node_lng_lat.split(",")[1]), parseFloat(node_lng_lat.split(",")[0])]:[0,0]
                this.node_location = L.circle(node_lng_lat, {radius:20}).addTo(this.map)
                this.map.on("click", (e) => {
                    this.node_location.setLatLng([e.latlng.lat.toFixed(8), e.latlng.lng.toFixed(8)])
                    setFieldsValue({ node_lng_lat: e.latlng.lng.toFixed(8) + ',' + e.latlng.lat.toFixed(8) })
                })
                this.map._onResize()
            }
        }
    }

    // 将数据转化为 插入格式
    convertData = (node) => {
        let data = Object.entries(node)
        const { direction_list } = this.state
        let directions = []
        let node_info = this.state.node
        direction_list.forEach( direction => {
            let dir = direction
            let dir_object = {}
            dir_object["node_id"] = this.state.node.node_id
            dir_object["direction"] = dir
            dir_object["lane_dir"] = data.filter( (item, index) => item[0].indexOf("dir" + dir + "_lane_dir") !== -1).map( e => e[1]).join(",")
            data.filter( (item, index) => item[0].indexOf("dir" + dir) !== -1 && item[0].indexOf("lane_dir") === -1 ).forEach( e => dir_object[e[0].replace("dir" + dir + "_", "")] = e[1] === true?1:e[1] === false?0:e[1] )
            directions.push(dir_object)
        })
        node_info.directions = directions
        data.filter( item => item[0].indexOf("dir") === -1 ).forEach( e => node_info[e[0]] = e[1] )
        return node_info
    }

    handleSubmit = ( e ) => {
        e.preventDefault()
        this.props.form.validateFields( async (err, values) => {
            if( !err ){
                let node_info = this.convertData(values)
                const result = await reqUpdateNode(node_info)
                if(result.code === 1){
                    message.success("更新点位成功！")
                }else{
                    message.error(result.msg)
                }
            }
        } )
    }

    onTabChange = activeDirection => {
        this.setState({ activeDirection })
    }

    onDirectionChange = ( value ) => {
        this.setState({ direction_list: value, activeDirection: value[0] + '' })
    }

    showLocation = ( value ) => {
        this.setState({
            intersection_location_visible: true
        })
        if(this.map){
            this.map._onResize()
        }
    }

    getNode = async (node_id) => {
        const result = await reqNodeById(node_id)
        let direction_list = result.data.directions.map( e => e.direction + '' )
        let direction_lane_dir = result.data.directions.map( e => e.entry_main_num )
        if(result.code === 1){
            this.setState({
                node: result.data,
                direction_list,
                direction_lane_dir
            })
        }
    }
    
    async componentDidMount () {
        this.initMap()
        let node = this.state.node
        if( node.node_id ){
            this.getNode(node.node_id)
        }else{
            const node_id = this.props.match.params.id
            this.getNode(node_id)
        }
    }

    render() {

        const { getFieldDecorator }  = this.props.form

        const { node, direction_list, activeDirection, intersection_location_visible, more_settings } = this.state

        let Dirs = DIRECTION_LIST.map( (e, i) => ({ title: e, key: i + 1, value: i+1 }))

        let node_directions = direction_list.map( item => ({title: DIRECTION_LIST[item - 1], key: item, value: item}))

        if(node.directions){
            node_directions = direction_list.map( (item, key) => ({title: DIRECTION_LIST[item - 1], key: item, value: item, ...node.directions[item - 1]}))
        }

        const formLayout = {
            labelCol : { span: 11 } ,
            wrapperCol : { span: 11 },
        }

        return (
            <div style = {{  width: '100%', height: '100%', margin: 0, padding: 0 }}>
                <div style = {{ width: '100%', height: 40, marginLeft: 10, display: 'flex', alignItems: 'center' }}>
                    <LinkButton onClick={ () => this.props.history.goBack() }>
                        <Icon type="arrow-left"></Icon>
                    </LinkButton>
                    &nbsp;&nbsp;
                    <span>交叉口</span>
                </div>
                <div style = {{width: '100%', height: 'calc(100% - 40px)'}}>
                    <div style={{ display: 'flex', height: '100%' }}>
                        <Form 
                            { ...formLayout } 
                            onSubmit = { this.handleSubmit }
                            style = {{ width: '50%', height: '100%', margin: 0, padding: 0 }}
                        >
                            <div style={{ display: 'inline', width: '50%' }}>
                                <div style={{ width: '100%', height: '25%', justifyContent:'center', alignItems: 'center' }}>
                                    <div style = {{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
                                        <div style = {{ width: '30%', textAlign: 'right' }}>交叉口名称：&nbsp;</div>
                                        <div style = {{ width: '60%' }}>
                                            {
                                                getFieldDecorator("node_name", {
                                                    initialValue: node.node_name|| "",
                                                    rules: [
                                                        { required: false, message: "必须输入事故类型！" }
                                                    ]
                                                })(<Input size="small"/>)
                                            }
                                        </div>
                                    </div>
                                    <div style = {{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
                                        <div style = {{ width: '30%', textAlign: 'right' }}>交叉口方向：&nbsp;</div>
                                        <div style = {{ width: '60%' }}>
                                            {
                                                getFieldDecorator("direction_list", {
                                                    initialValue: direction_list,
                                                })(
                                                    <TreeSelect 
                                                        size="small"
                                                        treeData = { Dirs }
                                                        onChange = { this.onDirectionChange }
                                                        treeCheckable = { true }
                                                    />
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div style = {{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
                                        <div style = {{ width: '30%', textAlign: 'right' }}>交叉口经纬度：&nbsp;</div>
                                        <div style = {{ width: '60%' }}>
                                        {
                                            getFieldDecorator("node_lng_lat", {
                                                initialValue: node.node_lng_lat||"",
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
                                            visible = { intersection_location_visible }
                                            onOk = { () => this.setState({ intersection_location_visible: false }) }
                                            onCancel = { () => this.setState({ intersection_location_visible: false }) }
                                        >
                                            <div style={{ width: '100%', height: 300 }} id="map"></div>
                                        </Modal>
                                        </div>
                                    </div>

                                    <div style = {{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
                                        <div style = {{ width: '30%', textAlign: 'right' }}>交叉口方向：&nbsp;</div>
                                        <div style = {{ width: '60%' }}>
                                            {
                                                getFieldDecorator("sidewalk_style", {
                                                    initialValue: node.sidewalk_style + '' || '1',
                                                })(
                                                    <Radio.Group size="small">
                                                        <Radio.Button value="1">行人过街</Radio.Button>
                                                        <Radio.Button value="2">天桥</Radio.Button>
                                                        <Radio.Button value="3">地下通道</Radio.Button>
                                                    </Radio.Group>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div style={{ width: '100%', height: '60%'}}>
                                    <div style = {{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                        <Tabs 
                                            activeKey = { activeDirection }
                                            onChange = { this.onTabChange }
                                            style = {{ width: '100%' }}
                                            type = "line"
                                        >
                                            {
                                                node_directions.map(  (item, dir_index) => (
                                                    <TabPane tab = { item.title } key = { item.key } style={{ display: 'flex' }}>
                                                        <div style = {{ width: '50%' }}>
                                                            <div style = {{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
                                                                <div style = {{ width: '50%', textAlign: 'right' }}>角度：&nbsp;</div>
                                                                <div style = {{ width: '40%' }}>
                                                                    {
                                                                        getFieldDecorator("dir" + item.direction + "_angle", {
                                                                            initialValue: item.angle || (450 - 90 * item.direction)%360 + '',
                                                                        })(
                                                                            <Input size="small" />
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div style = {{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
                                                                <div style = {{ width: '50%', textAlign: 'right' }}>进口车道数：&nbsp;</div>
                                                                <div style = {{ width: '40%' }}>
                                                                    {
                                                                        getFieldDecorator("dir" + item.direction + "_entry_main_num", {
                                                                            initialValue: item.entry_main_num || 3,
                                                                        })(
                                                                            <Input size="small" type='number' onChange = { (e) => {
                                                                                const { direction_lane_dir } = this.state
                                                                                direction_lane_dir[dir_index] = parseInt(e.target.value, 10)
                                                                                this.setState({ direction_lane_dir })
                                                                            } }/>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div style = {{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
                                                                <div style = {{ width: '50%', textAlign: 'right' }}>出口车道数：&nbsp;</div>
                                                                <div style = {{ width: '40%' }}>
                                                                    {
                                                                        getFieldDecorator("dir" + item.direction + "_exit_main_num", {
                                                                            initialValue: item.exit_main_num || 3,
                                                                        })(
                                                                            <Input size="small" type='number'/>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div style = {{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
                                                                <div style = {{ width: '50%', textAlign: 'right' }}>渠化车道数：&nbsp;</div>
                                                                <div style = {{ width: '40%', display: 'flex', flexWrap: "wrap" }}>
                                                                    {
                                                                        getFieldDecorator("dir" + item.direction + "_entry_expand_num", {
                                                                            initialValue: item.entry_expand_num || 1,
                                                                        })(
                                                                            <Input type="number" size = "small" />
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div style = {{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
                                                                <div style = {{ width: '50%', textAlign: 'center' }}>
                                                                    {
                                                                        getFieldDecorator("dir" + item.direction + "_entry_expand", {
                                                                            initialValue: (item.entry_expand || 1) === 1?true:false,
                                                                        })(
                                                                            <Checkbox>进口渠化</Checkbox>
                                                                        )
                                                                    }
                                                                </div>
                                                                <div style = {{ width: '50%', textAlign: 'center' }}>
                                                                    {
                                                                        getFieldDecorator("dir" + item.direction + "_entry_sub", {
                                                                            initialValue: (item.entry_sub || 1) === 1?true:false,
                                                                        })(
                                                                            <Checkbox>进口辅道</Checkbox>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div style = {{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
                                                                <div style = {{ width: '50%', textAlign: 'center' }}>
                                                                    {
                                                                        getFieldDecorator("dir" + item.direction + "_right_ahead", {
                                                                            initialValue: (item.right_ahead || 1) === 1 ? true : false,
                                                                        })(
                                                                            <Checkbox>提前右转</Checkbox>
                                                                        )
                                                                    }
                                                                </div>
                                                                <div style = {{ width: '50%', textAlign: 'center' }}>
                                                                    {
                                                                        getFieldDecorator("dir" + item.direction + "_left_wait", {
                                                                            initialValue: (item.left_wait || 1) === 1 ? true : false,
                                                                        })(
                                                                            <Checkbox>待行区</Checkbox>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style = {{ width: '50%' }}>
                                                            {
                                                                this.state.direction_lane_dir[dir_index]>0?new Array(this.state.direction_lane_dir[dir_index]).toString().split(',').map( (lane, lane_index) => (
                                                                    <div key={lane_index} style = {{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
                                                                        <div style = {{ width: '30%', textAlign: 'right' }}>车道{ lane_index + 1 }：&nbsp;</div>
                                                                        <div style = {{ width: '50%', display: 'flex', flexWrap: "wrap" }}>
                                                                            {
                                                                                getFieldDecorator("dir" + item.direction + "_lane_dir" + "_lane" + (lane_index + 1), {
                                                                                    initialValue: item.lane_dir?(item.lane_dir.split(",")[lane_index]||"1"):"1",
                                                                                })(
                                                                                    <Select
                                                                                        size = "small"
                                                                                        dropdownMatchSelectWidth = { false }
                                                                                    >
                                                                                        {
                                                                                            LANE.map( e => (<Option key={e.key} value = {e.key + ''}>{e.title}</Option>) )
                                                                                        }
                                                                                    </Select>
                                                                                )
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                )):(<></>)
                                                            }
                                                            <div style = {{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: 10, marginTop: 10 }}>
                                                                <div style = {{ width: '100%', textAlign: 'center' }}>
                                                                    <Button onClick={ () => this.setState({ more_settings: true }) }>更多设置</Button>
                                                                </div>
                                                                <Modal
                                                                    title = { "方向" + item.title + " - 几何参数设置" }
                                                                    okText = { "确定" }
                                                                    cancelText = { "取消" }
                                                                    visible = { more_settings }
                                                                    onOk = { () => this.setState({ more_settings: false }) }
                                                                    onCancel = { () => this.setState({ more_settings: false }) }
                                                                    width = { 800 }
                                                                    style = {{  height: 600  }}
                                                                    centered = { true }
                                                                >
                                                                    <div style={{ width: '100%', height: 500, display: 'flex', flexWrap: 'wrap' }}>
                                                                        {
                                                                            DIRECTION.map( (ele, arr_index) => {
                                                                                return (
                                                                                <div key = { arr_index } style = {{ width: '50%', display: 'flex', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
                                                                                    <div style = {{ width: '50%', textAlign: 'right' }}> { ele.title }：&nbsp;</div>
                                                                                    <div style = {{ width: '40%', display: 'flex', flexWrap: "wrap" }}>
                                                                                        {
                                                                                            item.direction?getFieldDecorator("dir" + item.direction + "_" + ele.value, {
                                                                                                initialValue: item[ele.value]||ele.defaultValue,
                                                                                            })(
                                                                                                ele.children?(
                                                                                                    <Select>
                                                                                                        {
                                                                                                            ele.children.map( (opt, opt_index) => (
                                                                                                                <Option key = { opt_index } value = {opt.value}>{opt.title}</Option>
                                                                                                            ) )
                                                                                                        }
                                                                                                    </Select>
                                                                                                ):(<Input type="number" size = "small" />)
                                                                                            ):(<></>)
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            )} )
                                                                        }
                                                                    </div>
                                                                </Modal>
                                                            </div>
                                                        </div>
                                                        
                                                    </TabPane>
                                                ))
                                            }
                                        </Tabs>
                                    </div>
                                </div>
                                <div style={{ width: '100%', height: '10%' }}>
                                    <div style = {{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Button htmlType="submit">提交</Button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                        <div style={{ display: 'inline', width: '50%'}}>
                            <div style={{width: '100%', height: '50%', backgroundColor: 'gray'}}>
                            </div>
                            <div style={{width: '100%', height: '50%', backgroundColor: 'green'}}>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Form.create()( IntersectionGeometry )