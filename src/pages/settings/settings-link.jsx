import React, { Component } from 'react'
import L from 'leaflet'
import LinkButton from '../../components/link-button'
import { Icon } from 'antd'

export default class SettingsLink extends Component {

    state = {
        link_latlngs: [],
    }

    initMap = () => {
        this.map = L.map('map', {
            center: [25.12, 99.175],
            zoom: 14
        })
        L.tileLayer('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}', {}).addTo(this.map)
        this.map._onResize()
    }

    onTextChange = (e) => {
        let link_latlngs = []
        let value = e.target.value
        let reg = /^([0-9]{2,3}\.[0-9]{2,}\,[0-9]{2,3}\.[0-9]{2,}\;){1,}([0-9]{2,3}\.[0-9]{2,}\,[0-9]{2,3}\.[0-9]{2,})$/i
        if(reg.test(value)){
            let latlngs = value.split(';')
            console.log(latlngs);
            
            for (let index = 0; index < latlngs.length; index++) {
                link_latlngs.push( [parseFloat(latlngs[index].split(",")[1]), parseFloat(latlngs[index].split(",")[0])] )
            }
        }
        this.setState({ link_latlngs })
    }

    componentDidMount() {
        this.initMap()
    }

    componentWillUpdate = (nextProps, nextState) => {
        const { link_latlngs } = nextState
        if(this.polyline){
            this.map.removeLayer(this.polyline)
        }
        this.polyline = L.polyline(link_latlngs, {color: '#' + Math.floor(Math.random()*(256*256*256-1)).toString(16)}).addTo(this.map)
    }
    
    render() {
        return (
            <div className="lyf-card" style={{ display: 'flex', flexWrap: 'wrap' }}>
                <div className="lyf-card-title">
                    <LinkButton onClick={ () => this.props.history.goBack() }>
                        <Icon type="arrow-left"></Icon>
                    </LinkButton>
                    &nbsp;&nbsp;
                    <span>设置</span>
                </div>
                <div className="lyf-card-content">
                    <div className="lyf-col2" id="map">map</div>
                    <div className="lyf-col2">
                        <textarea onChange = { this.onTextChange } style={{ width: '100%', height: '100%' }}>

                        </textarea>
                    </div>
                </div>

            </div>
        )
    }
}
