import React, { Component } from 'react'
import L from 'leaflet'
import DataBox from '../../components/data-box'
import { reqCurrentDevNotMiss, reqDevices, reqCurrentDevRcgRate, reqTodayDevRcgRate } from '../../api'
import { bd09togcj02 } from '../../utils/lnglatUtils'
import { message, Spin } from 'antd'
import { MAP_CENTER, TMS } from '../../utils/baoshan'
import LvqiTable from '../../components/table'
import Chart from '../../components/chart'
import { HeatmapOption } from '../../config/echartOption'

export default class Device extends Component {

    
    state = {
        firstRender: true,
        div21_data: [],
        div31_option: {},
    }

    initMap = () => {
        let { firstRender } = this.state
        if( firstRender ){
            
            this.setState({ firstRender: false })
            this.map = L.map('map', {
                center: MAP_CENTER, 
                zoom: 12, 
                zoomControl: false, 
                attributionControl: false, 
            })
            L.tileLayer(TMS, { maxZoom: 16 }).addTo(this.map)
        }
        this.map._onResize()
    }

    load_data = async() => {
        const result = await reqDevices()
        const result11 = await reqCurrentDevNotMiss()
        const result21 = await reqCurrentDevRcgRate()
        const result31 = await reqTodayDevRcgRate()

        let devices
        if(result.code === 1){
            devices = result.data
            this.device_info = {}
            devices.forEach( e => this.device_info[e.dev_id] = [e.dev_lng, e.dev_lat] )
            if(result11.code === 1){
                this.setDevice(result11.data)
            }else{
                message.error(result11.message)
            }
        }else{
            message.error(result.message)
        }

        let div21_data
        if(result21.code === 1){
            this.device_name = {}
            devices.forEach( e => this.device_name[e.dev_id] = e.dev_name )
            div21_data = result21.data.map( e => ({ name: this.device_name[e.dev_id], value: Math.round(e.rcg_rate * 100) + '%' }))
        }else{
            message.error(result11.message)
        }

        let div31_option
        if(result31.code === 1){
            let data = result31.data
            let x_data = [];
            let y_data = [];
            let res_data = [];
            for(let i = 0; i < data.length; i++){
                if(x_data.indexOf(data[i].time_point) == -1){
                    x_data.push(data[i].time_point);
                }
                if(y_data.indexOf("'" + data[i].dev_id + "'") == -1){
                    y_data.push("'" + data[i].dev_id + "'");
                }
                res_data.push([data[i].time_point, "'" + data[i].dev_id + "'", data[i].rcg_rate])
            }
            div31_option = HeatmapOption(x_data, y_data, res_data, this.device_name)
        }else{
            message.error(result31.message)
        }

        this.setState({ firstRender: false, div21_data, div31_option })
    }

    setDevice = (data) => {
        this.devices = []
        data.forEach( (e, i) => {
            if(this.device_info[e.dev_id] !== undefined){
                let lng = bd09togcj02(...this.device_info[e.dev_id])[0]
                let lat = bd09togcj02(...this.device_info[e.dev_id])[1]
                this.devices.push( L.circle([lat, lng], { color: e.not_miss_rate>0?'green':'red', stroke:false, fillOpacity: 0.9, opacity: 0.9, radius: 30}) )
            }
        })
        L.layerGroup(this.devices).addTo(this.map)
    }

    componentWillMount() {
        this.load_data()
    }

    componentDidMount() {
        this.initMap()
    }
    
    render() {
        const { firstRender, div21_data, div31_option } = this.state
        return (
            <div className="full lyf-center">
                <div className={firstRender?"loading lyf-center":"none"}>
                    <Spin size="large" spinning={firstRender}/>
                </div>
                <div className="lyf-row-7" style={{ display: 'flex' }}>
                    <div className="lyf-col-6 lyf-center">
                        <DataBox title={ "设备状态" }>
                            <div id="map" className="full"></div>
                        </DataBox>
                    </div>
                    <div className="lyf-col-4 lyf-center">
                        <DataBox title={ "设备识别率" }>
                            <LvqiTable data={ div21_data } rowNum = { 6 } slideTimer = { 3000 } dataType="tongqin"/>
                        </DataBox>
                    </div>
                </div>
                
                <div className="lyf-row-3">
                    <Chart option={ div31_option }/>
                </div>
            </div>
        )
    }
}
