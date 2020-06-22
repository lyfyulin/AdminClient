import React, { Component } from 'react'
import L from 'leaflet'
import DataBox from '../../components/data-box'
import { reqCurrentDevNotMiss, reqDevices } from '../../api'
import { bd09togcj02 } from '../../utils/lnglatUtils'
import { message } from 'antd'
import { NODE_INFO, MAP_CENTER, TMS } from '../../utils/baoshan'

export default class Device extends Component {

    
    state = {
        firstRender: true,
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

    load_devices = async() => {
        const result = await reqDevices()
        if(result.code === 1){
            const devices = result.data
            this.device_info = {}
            devices.forEach( e => this.device_info[e.dev_id] = [e.dev_lng, e.dev_lat] )

            const result2 = await reqCurrentDevNotMiss()
            if(result2.code === 1){
                this.setDevice(result2.data)
            }else{
                message.error(result2.message)
            }

        }else{
            message.error(result.message)
        }
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
        this.load_devices()
    }

    componentDidMount() {
        this.initMap()
    }
    
    render() {
        return (
            <div className="full lyf-center">
                <div className="lyf-row-7" style={{ display: 'flex' }}>
                    <div className="lyf-col-6 lyf-center">
                        <DataBox title={ "设备状态" }>
                            <div id="map" className="full"></div>
                        </DataBox>
                    </div>
                    <div className="lyf-col-4 lyf-center">
                        <DataBox title={ "路段运行状态" }>
                        </DataBox>
                    </div>
                </div>
                
                <div className="lyf-row-3">
                </div>
            </div>
        )
    }
}
