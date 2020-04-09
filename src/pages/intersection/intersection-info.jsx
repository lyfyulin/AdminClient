import React, { Component } from 'react'
import { Table } from 'antd'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './intersection-info.less'

export default class IntersectionInfo extends Component {

    state = {
        loading: false,
        intersections: [],
    }

    initColumns = () => {
        return [{
            title: '交叉口名称',
            dataIndex: 'name'
        },{
            title: '几何布局',
            render: intersection => (<span>查看布局</span>)
        },{
            title: '流量信息',
            render: intersection => (<span>查看详情</span>)
        },]
    }

    componentWillMount() {
        this.columns = this.initColumns()

    }

    componentDidMount() {

        this.map = L.map('map', {
            center: [23, 99],
            zoom: 13
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        }).addTo(this.map);
        
        const intersections = [{
            id: 1,
            name: "正阳路-保岫路交叉口",
        },{
            id: 2,
            name: "正阳路-龙泉路交叉口",
        },{
            id: 3,
            name: "正阳路-玉泉路交叉口",
        },{
            id: 4,
            name: "正阳路-升阳路交叉口",
        },{
            id: 5,
            name: "正阳路-人民路交叉口",
        },{
            id: 6,
            name: "太保路-龙泉路交叉口",
        },{
            id: 7,
            name: "太保路-玉泉路交叉口",
        },{
            id: 8,
            name: "太保路-升阳路交叉口",
        },{
            id: 9,
            name: "太保路-人民路交叉口",
        },{
            id: 10,
            name: "太保路-人民路交叉口",
        },]
        this.setState({ 
            intersections,
         })
    }

    render() {
        const { loading, intersections } = this.state
        return (
            <div className = "lvqi-row1-col2">
                <div className = "lvqi-col-2">
                    <div className="lvqi-card-title">
                        交叉口地图
                    </div>
                    <div className="lvqi-card-content" id="map">
                    </div>
                </div>
                <div className = "lvqi-col-2">
                    <div className="lvqi-card-title">
                        交叉口列表
                    </div>
                    <div className="lvqi-card-content" id="table">
                        <Table 
                            bordered = { true }
                            rowKey = "id"
                            columns = { this.columns }
                            dataSource = { intersections }
                            loading = { loading }
                            pagination = { false }
                            scroll={{ y: 480 }}
                        >
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}
