import React, { Component } from 'react'
import DataBox from '../../components/data-box'
import { MAP_CENTER, TMS, NODE_INFO } from '../../utils/baoshan'
import L from 'leaflet'
import { reqCurrentNodeNonlocalRatio } from '../../api'
import { bd09togcj02 } from '../../utils/lnglatUtils'
import { message } from 'antd'

export default class Nonlocal extends Component {

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
            this.initNode()
        }
        this.map._onResize()
    }

    load_data = async () => {
        const result = await reqCurrentNodeNonlocalRatio()
        if(result.code === 1){
            this.setNode(result.data)
        }else{
            message.error(result.message)
        }
    }

    initNode = () => {
        this.nodes = []
        for(let i = 0; i < NODE_INFO.length; i++){
            let lng = bd09togcj02(NODE_INFO[i][2], NODE_INFO[i][3])[0]
            let lat = bd09togcj02(NODE_INFO[i][2], NODE_INFO[i][3])[1]
            this.nodes.push( L.circle([lat, lng], {color: '#33CCCC', stroke:false, fillOpacity: 0.9, opacity: 0.9, radius: 30}) )
        }
        L.layerGroup(this.nodes).addTo(this.map)
    }

    setNode = (data) => {
        data.forEach( (e, i) => {
            this.nodes[i].setRadius(e.foreign_ratio*400)
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
                        <DataBox title={ "外地车分布" }>
                            <div id="map" className="full">

                            </div>
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
