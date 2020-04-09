import React, { Component } from 'react'
import {
    ResponsiveContainer,
    AreaChart,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Area,
    ReferenceLine,
} from 'recharts'
import { reqAvgSpeed, reqVnIn, reqVnInfo, reqVnOut } from '../../api'
import { intersection_titles } from '../../config/chartsTitle'
import './charts.less'

export default class AreaState extends Component{
    
    state ={
        avg_speed : [],
        vn_in: [],
        vn_out: [],
        vn_info: [],
    }

    async componentWillMount(){
        const result = await reqAvgSpeed( "2019-04-01 00:00:00", "2019-04-02 00:00:00" )
        if( result.code === 1 ){
            this.setState({
                avg_speed: result.data
            })
        }
        const result2 = await reqVnIn( "2019-03-05 00:00:00", "2019-03-06 00:00:00" )
        if( result2.code === 1 ){
            this.setState({
                vn_in: result2.data
            })
        }
        const result3 = await reqVnOut( "2019-03-05 00:00:00", "2019-03-06 00:00:00" )
        if( result3.code === 1 ){
            this.setState({
                vn_out: result3.data
            })
        }
        const result4 = await reqVnInfo( "2019-03-05 00:00:00", "2019-03-06 00:00:00" )
        if( result4.code === 1 ){
            this.setState({
                vn_info: result4.data
            })
        }
    }

    render() {
        const { avg_speed, vn_in, vn_out, vn_info } = this.state
        return (
            <div className = "lvqi-row2-col2">
                <div className = "lvqi-row-2">
                    <div className = "lvqi-col-2">
                        <div className = "lvqi-chart-title">
                            { intersection_titles[0] }
                        </div>
                        <div className = "lvqi-chart-content">
                            <ResponsiveContainer width={'100%'} height={'100%'} >
                                <AreaChart data={ avg_speed }
                                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <XAxis dataKey="time_point" tickFormatter ={ (value) => value.slice(10, 16) }/>
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <ReferenceLine x="Page C" stroke="green" label="Min PAGE" />
                                <Area type="monotone" dataKey="avg_speed" stroke="#8884d8" fill="#8884d8" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className = "lvqi-col-2">
                        <div className = "lvqi-chart-title">
                            { intersection_titles[1] }
                        </div>
                        <div className = "lvqi-chart-content">
                            <ResponsiveContainer width={'100%'} height={'100%'} >
                                <AreaChart data={ vn_in }
                                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <XAxis dataKey="time_point" tickFormatter ={ (value) => value.slice(10, 16) }/>
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Area type="monotone" dataKey="in_cnts" stroke="#8884d8" fill="#8884d8" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className = "lvqi-row-2">
                    <div className = "lvqi-col-2">
                        <div className = "lvqi-chart-title">
                            { intersection_titles[2] }
                        </div>
                        <div className = "lvqi-chart-content">
                            <ResponsiveContainer width={'100%'} height={'100%'}>
                                <AreaChart data={ vn_out }
                                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <XAxis dataKey="time_point" tickFormatter ={ (value) => value.slice(10, 16) }/>
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <ReferenceLine x="Page C" stroke="green" label="Min PAGE" />
                                <Area type="monotone" dataKey="out_cnts" stroke="#8884d8" fill="#8884d8" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className = "lvqi-col-2">
                        <div className = "lvqi-chart-title">
                            { intersection_titles[3] }
                        </div>
                        <div className = "lvqi-chart-content">
                            <ResponsiveContainer width={'100%'} height={'100%'} >
                                <AreaChart data={ vn_info }
                                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <XAxis dataKey="time_point" tickFormatter ={ (value) => value.slice(10, 16) }/>
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <ReferenceLine x="Page C" stroke="green" label="Min PAGE" />
                                <Area type="monotone" dataKey="truckbus_cnts" stroke="#8884d8" fill="#8884d8" />
                                <Area type="monotone" dataKey="car_cnts" stroke="#8884d8" fill="#8884d8" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


