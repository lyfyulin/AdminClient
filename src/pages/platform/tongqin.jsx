import React, { Component } from 'react'
import DataBox from '../../components/data-box'
import L from 'leaflet'
import { MAP_CENTER, TMS, LINK_INFO } from '../../utils/baoshan'
import { message } from 'antd'
import { reqCurrentTongqinHotRoad } from '../../api'

export default class Tongqin extends Component {


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
            this.initLink()
        }
        this.map._onResize()
    }

    load_data = async () => {
        const result = await reqCurrentTongqinHotRoad()
        if(result.code === 1){
            this.setLink(result.data)
        }else{
            message.error(result.message)
        }
    }

    initLink = () => {
        this.links = []
        for(let i = 0; i < 121/*LINK_INFO.length*/; i++){

            this.links.push( L.polyline(LINK_INFO[i], {color: '#33CCCC'}) )
        }
        L.layerGroup(this.links).addTo(this.map)
    }

    setLink = (data) => {
        data.forEach( (e, i) => {
            this.links[i].setStyle({ opacity: e.cnt/200 })
        })
    }

    componentWillMount() {
        this.load_data()
    }
    

    componentDidMount() {
        this.initMap()
    }

    render() {
        return (
            <div className="full lyf-center">
                <div className="lyf-row-7" style={{ display: 'flex' }}>
                    <div className="lyf-col-6 lyf-center">
                        <DataBox title={ "热点路段" }>
                            <div id="map" className="full"></div>
                        </DataBox>
                    </div>
                    <div className="lyf-col-4 lyf-center">
                        <DataBox title={ "路段通勤流量" }>
                        </DataBox>
                    </div>
                </div>
                
                <div className="lyf-row-3">
                </div>
            </div>
        )
    }
}
