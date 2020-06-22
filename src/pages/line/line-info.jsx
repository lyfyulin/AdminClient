import React, { Component } from 'react'
import { Table, message, Icon } from 'antd'
import L from 'leaflet'
import LinkButton from '../../components/link-button'
import { TMS, MAP_CENTER, AREA_CONFIG } from '../../utils/baoshan'
import { reqLines } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import '../../utils/leaflet/LeafletLegend'
import _ from 'lodash'


export default class LineInfo extends Component {

    state = {
        loading: false,
        lines: [],
    }

    // 初始化干线列
    initColumns = () => {
        return [{
            title: '干线编号',
            width: 200,
            dataIndex: 'line_id',
        },{
            title: '干线名称',
            width: 200,
            render: line => <a 
                onClick ={ () => { this.lineBlink(line) } }
            >
                { line.line_name }
            </a>
        },{
            title: '操作',
            width: 100,
            render: line => (
                <LinkButton onClick = { () => {
                    memoryUtils.line = line
                    this.props.history.push('/line/detail/' + line.line_id)
                } }>查看干线</LinkButton>)
        },{
            title: '干线控制',
            width: 100,
            render: line => (<span>
                <LinkButton onClick = { () => {
                    memoryUtils.line = line
                    this.props.history.push("/line/signal")
                } }>干线控制</LinkButton>
            </span>)
        },]
    }

    // 初始化地图
    initMap = () => {
        if(!this.map){
            this.map = L.map('map', {
                center: MAP_CENTER,
                zoom: 14,
                zoomControl: false,
                attributionControl: false,
            })
            L.tileLayer(TMS, { maxZoom: 16 }).addTo(this.map)
            this.map._onResize()
        }
    }

    // 加载干线列表数据
    loadLines = async () => {
        const result = await reqLines()
        if(result.code === 1){
            const lines = result.data.map( (e, index) => ({ index: index, ...e }) )
            this.setLine(lines)
            this.setState({ 
                lines
            })
        }else{
            message.error(result.message)
        }
    }

    // 将干线添加到地图
    setLine = (lines) => {
        this.line = []
        lines.forEach( line => {
            
        })
        L.layerGroup(this.line).addTo(this.map)
    }
    
    lineBlink = (line) => {
        /*
        this.map.fitBounds(this.line[line.index].getBounds())
        setTimeout( () => {
            this.line[line.index].setStyle({  ...AREA_CONFIG  })
        }, 1000 )
        */
    }

    onWindowResize = _.throttle(() => {
        this.setState({ tableBodyHeight: window.innerHeight * 0.9 - 166  })
    }, 800)

    componentWillMount() {
        this.columns = this.initColumns()
        this.loadLines()
    }

    componentDidMount() {
        this.initMap()
        window.addEventListener('resize', this.onWindowResize)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize)
        this.setState = (state, callback) => {
            return
        }
    }
    render() {
        const { loading, lines } = this.state

        return (
            <div className = "lvqi-row1-col2">
                <div className = "lvqi-col-2">
                    <div className="lvqi-card-title">
                        干线地图
                    </div>
                    <div className="lvqi-card-content" id="map">
                    </div>
                </div>
                <div className = "lvqi-col-2">
                    <div className="lvqi-card-title">
                        干线列表
                        <Icon type="plus" style={{ float:'right' }} onClick={ () => {
                            memoryUtils.line = {}
                            this.props.history.push({ pathname: "/line/add" })
                        } }></Icon>
                    </div>
                    <div className="lvqi-card-content" id="table">
                        <Table 
                            style={{ wordBreak: 'break-all' }}
                            bordered = { true }
                            rowKey = "line_id"
                            columns = { this.columns }
                            dataSource = { lines }
                            loading = { loading }
                            pagination = { false }
                            scroll={{ y: window.innerHeight * 0.9 - 166 }}
                        >
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}
