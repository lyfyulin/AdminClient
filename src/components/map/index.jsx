import React, { Component } from 'react'
import L from 'leaflet'
import PropTypes from 'prop-types'
import { LINK_INFO, LINK_COLOR, INTER_INFO } from '../../utils/baoshan'
import { bd09togcj02 } from '../../utils/lnglatUtils'

export default class LvqiMap extends Component {

    static props = {
        data : PropTypes.array.isRequired,
    }
    
    state = {
        firstRender: true,
    }

    initLink = () => {
        this.link = []
        for(let i = 0; i < LINK_INFO.length; i++){
            let line
            line = L.polyline(LINK_INFO[i], {color: 'grey'})
            this.link.push(line)
        }
        L.layerGroup(this.link).addTo(this.map)
    }

    initInter = () => {
        this.inter = []
        for(let i = 0; i < INTER_INFO.length; i++){
            let lng = bd09togcj02(INTER_INFO[i][2], INTER_INFO[i][3])[0]
            let lat = bd09togcj02(INTER_INFO[i][2], INTER_INFO[i][3])[1]
            this.inter.push( L.circle([lat, lng], {color: 'grey', fillOpacity: 1, radius: 30}) )
        }
        L.layerGroup(this.inter).addTo(this.map)
    }

    setLink = (link_state) => {
        link_state.forEach( (e, i) => {
            this.link[i].setStyle({ color: LINK_COLOR[parseInt(e.STATEINDEX / 2)] })
        })
    }

    setInter = (inter_state) => {

        inter_state.forEach( (e, i) => {
            if( e.AVG_DELAY > 120 ){
                this.inter[i].setStyle({ color: LINK_COLOR[4] })
            }else if( e.AVG_DELAY > 90 ){
                this.inter[i].setStyle({ color: LINK_COLOR[3] })
            }else if( e.AVG_DELAY > 60 ){
                this.inter[i].setStyle({ color: LINK_COLOR[2] })
            }else if( e.AVG_DELAY > 30 ){
                this.inter[i].setStyle({ color: LINK_COLOR[1] })
            }else{
                this.inter[i].setStyle({ color: LINK_COLOR[0] })
            }
        })
    }

    initMap = async() => {
        let { firstRender } = this.state

        if( firstRender ){
            this.setState({ firstRender: false })
            this.map = L.map('map', {
                center: [25.12, 99.225], 
                zoom: 12, 
                zoomControl: false, 
                attributionControl: false, 
            })
            L.tileLayer('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16 }).addTo(this.map)
        }

        if(this.props.dataType === "link"){
            this.initLink()
        }else if(this.props.dataType === "inter"){
            this.initInter()
        }

        this.map._onResize()
        this.setState({ loading: false })
    }

    componentDidMount() {
        this.initMap()
    }

    componentWillReceiveProps = (nextProps) => {
        let { data } = nextProps
        if(this.props.dataType === "link"){
            this.setLink(data)
        }else if(this.props.dataType === "inter"){
            this.setInter(data)
        }
    }
    
    render() {
        return (
            <div className="full" id="map">
            </div>
        )
    }
}
