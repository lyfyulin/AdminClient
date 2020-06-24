import React, { Component } from 'react'
import { Card, Icon, Input, Select, Button, Modal, message, Form, TreeSelect } from 'antd'
import LinkButton from '../../components/link-button'
import L from 'leaflet'
import { reqLineById, reqNodes, reqUpdateLine, reqLinks, reqInsertLine } from '../../api'
import { TMS, MAP_CENTER, LINK_TYPE, LINE_DIR, LINK_CONFIG } from '../../utils/baoshan'
import '../../utils/leaflet/LeafletEditable'
import memoryUtils from '../../utils/memoryUtils'
import { Str2LatLng } from '../../utils/lnglatUtils'

const Item = Form.Item
const Option = Select.Option
const { SHOW_PARENT } = TreeSelect

class LineDetail extends Component {

    constructor(props) {
        super(props)
        this.map = null
    }

    state = {
        line: memoryUtils.line||{},
        map_visible: false,
        node_list: [],
        value: undefined,
        isUpdate: false,
    }
    
    // 根据ID获取干线详情
    loadLineById = async (line_id) => {
        const result = await reqLineById(line_id)
        if(result.code === 1){
            const line = result.data
            this.setState({ line })
        }else{
            message.error(result.message)
        }
    }

    // 加载点位
    loadNodes = async () => {
        const result = await reqNodes()
        if(result.code === 1){
            let node_list = result.data
            this.setState({ node_list })            
        }
    }

    // 初始化地图 包括加载line
    initMap = () => {
        const { line } = this.state
        if(!this.map){
            this.map = L.map('map', {
                editable: true,
                center: MAP_CENTER,
                zoom: 14,
                zoomControl: false,
                attributionControl: false,
            })
            L.tileLayer(TMS, { maxZoom: 16 }).addTo(this.map)
            this.map._onResize()
            
            this.setLinePts()
        }
    }

    // 将line映射到地图上
    setLinePts = () => {
        const { line } = this.state
        line.line_sequence = line.line_sequence?line.line_sequence:"99.175,25.12;99.175,25.122"
        this.setState({ line })
        this.polyline = L.polyline(Str2LatLng(line.line_sequence), {...LINK_CONFIG}).addTo(this.map)
        this.polyline.enableEdit()
        this.polyline.on('editable:vertex:dragend', (e) => {
            let line_lnglats = e.vertex.latlngs.map( e=> [e.lng.toFixed(7), e.lat.toFixed(7)])
            line.line_sequence = line_lnglats.map( e=> e.join(",")).join(";")
            this.setState({ line })
        })
        this.map.fitBounds(this.polyline.getBounds())
        this.map.setZoom(15)
    }
    
    // line 修改
    lineLocation = () => {
        this.setState({ map_visible: true })
        this.initMap()
    }

    // 表单点位过滤
    handleFilter = (inputValue, option) => {
        if(!/[a-zA-Z]/.test(inputValue)){
            return option.props.children.indexOf(inputValue) === -1?false:true
        }
    }

    onLineNodesChange = nodes => {
        const { line, isUpdate } = this.state
        line.node_num = nodes.length
        line.node_list = nodes.join(",")        
        line.nodes = isUpdate?nodes.map( (e,i) => ({ node_index: i + 1, line_id: line.line_id, node_id: e })):nodes.map( (e,i) => ({ node_index: i + 1, node_id: e }))
        this.setState({ line })
    }

    // 提交修改
    handleSubmit = ( event ) => {
        event.preventDefault()
        const {isUpdate} = this.state
        this.props.form.validateFields( async (error, values) => {
            if( !error ){
                let { line } = this.state
                if(isUpdate || line.line_sequence){
                    const result = isUpdate?await reqUpdateLine({ ...line, ...values }):await reqInsertLine({ ...line, ...values })
                    if(result.code === 1){
                        message.success(isUpdate?"更新干线成功！":"添加干线成功！")
                        this.props.history.replace("/line")
                    }else{
                        message.error(result.message)
                    }
                }else{
                    message.error("请选择干线形状！")
                }
            }
        } )
    }

    componentWillMount() {
        let { line } = this.state
        if(line.line_id){
            this.setState({ isUpdate: true })
            this.loadLineById(line.line_id)
        }
        this.loadNodes()
    }

    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return
        }
    }

    render() {

        const { getFieldDecorator }  = this.props.form

        const { map_visible, line, node_list } = this.state

        const title = (
            <span>
                <LinkButton onClick={ () => this.props.history.replace('/line') }>
                    <Icon type="arrow-left"></Icon>
                </LinkButton>
                &nbsp;&nbsp;
                <span>干线管理</span>
            </span>
        )

        const treeDataNode = node_list.map(node => ({ title: node.node_name, value: node.node_id, key: node.node_id }))
        const line_nodes = line.nodes&&line.nodes.length>0&&line.nodes[0]?line.nodes.map( e => e.node_id ):[]
        const treePropsNode = {
            treeData: treeDataNode,
            value: line_nodes,
            onChange: this.onLineNodesChange,
            treeCheckable: true,
        }

        // 表单行样式
        const form_layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 8 },
        }

        const tailLayout = {
            wrapperCol: { offset: 10, span: 12 },
        }

        return (
            <Card className="full" title={ title } >
                <Form
                    { ...form_layout }
                    onSubmit = { this.handleSubmit }
                >
                    <Item label="干线名称">
                        {
                            getFieldDecorator("line_name", {
                                initialValue: line.line_name || '',
                            })(
                                <Input />
                            )
                        }
                    </Item>
                    <Item label="干线形状">
                        <Button onClick={ this.lineLocation }> 修改 </Button>
                        <Modal
                            title = { "干线形状" }
                            onOk = {()=>this.setState({ map_visible: false })}
                            onCancel = {()=>this.setState({ map_visible: false })}
                            visible = { map_visible }
                            forceRender = { true }
                        >
                            <div style = {{ width: '100%', height: 300 }} id="map">  </div>
                        </Modal>
                    </Item>
                    <Item label="干线方向">
                        {
                            getFieldDecorator("line_dir", {
                                initialValue: line.line_dir || '',
                            })(
                                <Select>
                                    {
                                        LINE_DIR.map( (dir,index) => <Option key={index} value={index + 1}>{dir}</Option> )
                                    }
                                </Select>
                            )
                        }
                    </Item>
                    <Item label="干线点位">
                        <TreeSelect { ...treePropsNode } />
                    </Item>
                    <Item { ...tailLayout }>
                        <Button htmlType="submit"> 提交 </Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(LineDetail)