import React, { Component } from 'react'
import { Form, Input, Tabs, Radio, Button, TreeSelect, Icon, Select, Modal, Checkbox } from 'antd'
import { DIRECTION_LIST, LANE, DIRECTION } from '../../utils/ConstantUtils'
import LinkButton from '../../components/link-button'
import L from 'leaflet'
import { MAP_CENTER, TMS } from '../../utils/baoshan'


const { TabPane } = Tabs
const { Option } = Select

class IntersectionGeometry extends Component {

    constructor(props) {
        super(props)
        this.map = null
    }

    state = {
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
                this.node_location = L.circle([25.12, 99.175], {radius:20}).addTo(this.map)
                this.map.on("click", (e) => {
                    this.node_location.setLatLng([e.latlng.lat, e.latlng.lng])
                    setFieldsValue({ node_gpsx_gpsy: e.latlng.lat + ',' + e.latlng.lng })
                })
                this.map._onResize()
            }
        }
    }

    handleSubmit = ( e ) => {
        e.preventDefault();
        this.props.form.validateFields( (err, values) => {
            if( !err ){
                console.log( values );
            }
        } )
    }

    onTabChange = activeDirection => {
        this.setState({ activeDirection });
    }

    onDirectionChange = ( value ) => {
        this.setState({ direction_list: value, activeDirection: value[0] + '' })
    }

    onLaneChange = ( value ) => {
        console.log(value)
    }

    handleSubmit = ( e ) => {
        e.preventDefault();
        this.props.form.validateFields( (err, values) => {
            if( !err ){
                console.log( values );
            }
        } )
    }

    showLocation = ( value ) => {
        this.setState({
            intersection_location_visible: true
        })
        if(this.map){
            this.map._onResize()
        }
    }

    componentDidMount() {
        this.initMap()
    }

    render() {

        const { getFieldDecorator }  = this.props.form

        const { direction_list, activeDirection, intersection_location_visible, more_settings } = this.state

        let dirs = DIRECTION_LIST.map( (e, i) => ({ title: e, key: i + 1, value: i+1 }))

        let intersection_dirs = direction_list.map( e => ({title: DIRECTION_LIST[e - 1], key: e, value: e}))

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
                                                getFieldDecorator("intersection_name", {
                                                    initialValue: '交叉口1',
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
                                                getFieldDecorator("direction", {
                                                    initialValue: direction_list,
                                                })(
                                                    <TreeSelect 
                                                        size="small"
                                                        treeData = { dirs }
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
                                            getFieldDecorator("node_gpsx_gpsy", {
                                                initialValue: '',
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
                                                    initialValue: '1',
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
                                                intersection_dirs.map(  (item, dir_index) => (
                                                    <TabPane tab = { item.title } key = { item.key } style={{ display: 'flex' }}>
                                                        <div style = {{ width: '50%' }}>
                                                            <div style = {{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
                                                                <div style = {{ width: '50%', textAlign: 'right' }}>角度：&nbsp;</div>
                                                                <div style = {{ width: '40%' }}>
                                                                    {
                                                                        getFieldDecorator("dir" + item.key + "_angle", {
                                                                            initialValue: (450 - item.key * 90)%360,
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
                                                                        getFieldDecorator("dir" + item.key + "_entry_num", {
                                                                            initialValue: '3',
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
                                                                        getFieldDecorator("dir" + item.key + "_exit_num", {
                                                                            initialValue: '2',
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
                                                                        getFieldDecorator("dir" + item.key + "_entry_expand_num", {
                                                                            initialValue: '1',
                                                                        })(
                                                                            <Input type="number" size = "small" />
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div style = {{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
                                                                <div style = {{ width: '50%', textAlign: 'center' }}>
                                                                    {
                                                                        getFieldDecorator("dir" + item.key + "_entry_expand", {
                                                                            initialValue: false,
                                                                        })(
                                                                            <Checkbox>进口渠化</Checkbox>
                                                                        )
                                                                    }
                                                                </div>
                                                                <div style = {{ width: '50%', textAlign: 'center' }}>
                                                                    {
                                                                        getFieldDecorator("dir" + item.key + "_entry_sub", {
                                                                            initialValue: false,
                                                                        })(
                                                                            <Checkbox>进口辅道</Checkbox>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div style = {{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
                                                                <div style = {{ width: '50%', textAlign: 'center' }}>
                                                                    {
                                                                        getFieldDecorator("dir" + item.key + "_right_ahead", {
                                                                            initialValue: false,
                                                                        })(
                                                                            <Checkbox>提前右转</Checkbox>
                                                                        )
                                                                    }
                                                                </div>
                                                                <div style = {{ width: '50%', textAlign: 'center' }}>
                                                                    {
                                                                        getFieldDecorator("dir" + item.key + "_left_wait", {
                                                                            initialValue: false,
                                                                        })(
                                                                            <Checkbox>待行区</Checkbox>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style = {{ width: '50%' }}>
                                                            {
                                                                new Array(this.state.direction_lane_dir[dir_index]).toString().split(',').map( (lane, lane_index) => (
                                                                    <div key={lane_index} style = {{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
                                                                        <div style = {{ width: '30%', textAlign: 'right' }}>车道{ lane_index + 1 }：&nbsp;</div>
                                                                        <div style = {{ width: '50%', display: 'flex', flexWrap: "wrap" }}>
                                                                            {
                                                                                getFieldDecorator("dir" + item.key + "_lane_dir" + "_lane" + (lane_index + 1), {
                                                                                    initialValue: 'T',
                                                                                })(
                                                                                    <Select
                                                                                        size = "small"
                                                                                        dropdownMatchSelectWidth = { false }
                                                                                    >
                                                                                        {
                                                                                            LANE.map( e => (
                                                                                                <Option key={e.key} value = {e.value}>{e.title}</Option>
                                                                                            ))
                                                                                        }
                                                                                    </Select>
                                                                                )
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            }
                                                            <div style = {{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
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
                                                                    <div style={{ width: '100%', height: 440, display: 'flex', flexWrap: 'wrap' }}>
                                                                        {
                                                                            DIRECTION.map( (ele, arr_index) => (
                                                                                <div key = { arr_index } style = {{ width: '50%', display: 'flex', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
                                                                                    <div style = {{ width: '50%', textAlign: 'right' }}> { ele.title }：&nbsp;</div>
                                                                                    <div style = {{ width: '40%', display: 'flex', flexWrap: "wrap" }}>
                                                                                        {
                                                                                            getFieldDecorator("dir" + item.key + "_" + ele.value, {
                                                                                                initialValue: ele.defaultValue,
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
                                                                                            )
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            ) )
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