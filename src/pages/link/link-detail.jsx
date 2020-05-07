import React, { Component } from 'react'
import { Card, Icon, List, Button, Modal } from 'antd'
import LinkButton from '../../components/link-button'
import L from 'leaflet'
import { TMS, MAP_CENTER } from '../../utils/baoshan'

const Item = List.Item

export default class LinkDetail extends Component {

    constructor(props) {
        super(props)
        this.map = null
    }

    state = {
        map_visible: false
    }

    componentDidMount() {

        window.onload = () => {
            if(!this.map){
                this.map = L.map('map', {
                    center: MAP_CENTER,
                    zoom: 14
                })
                L.tileLayer(TMS, { maxZoom: 16 }).addTo(this.map)
                this.node_location = L.circle([25.12, 99.175], {radius:20}).addTo(this.map)
                this.map.on("click", (e) => {
                    console.log("clicked:", e)
                })
                this.map._onResize()
            }
        }
    }

    location = () => {
        this.setState({ map_visible: true })
        if(!this.map){
            this.map = L.map('map', {
                center: [25.12, 99.175],
                zoom: 14,
            })
            L.tileLayer(TMS, { maxZoom: 16 }).addTo(this.map)
            this.node_location = L.circle([25.12, 99.175], {radius:20}).addTo(this.map)
            this.map.on("click", (e) => {
                console.log("clicked:", e)
            })
            this.map._onResize()
        }
    }
    
    render() {

        const { map_visible } = this.state

        const title = (
            <span>
                <LinkButton onClick={ () => this.props.history.goBack() }>
                    <Icon type="arrow-left"></Icon>
                </LinkButton>
                &nbsp;&nbsp;
                <span>路段</span>
            </span>
        )

        return (
            <Card title={title} >
                <List>
                    <Item>
                        <Button onClick={ this.location }> 定位 </Button>
                        <Modal
                            title = { "定位" }
                            onOk = {()=>this.setState({ map_visible: false })}
                            onCancel = {()=>this.setState({ map_visible: false })}
                            visible = { map_visible }
                            forceRender = { true }
                        >
                            <div style = {{ width: '100%', height: 300 }} id="map">  </div>
                        </Modal>
                    </Item>
                    <Item>

                    </Item>
                </List>
            </Card>
        )
    }
}
