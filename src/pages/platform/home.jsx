import React, { Component } from 'react'
import DataBox from '../../components/data-box'
import Chart from '../../components/chart'
import { GaugeOption5, RadarOption2, GaugeOption2, BiAreaOption, BiLineOption, AreaOption, CalendarOption, HorizontalBarOption, BallOption3 } from '../../config/echartOption'

import {  reqTodayVn, 
    reqLastOCnts, 
    reqLastRdnetState,
    reqLastAvgTripTime,
    reqLastAvgTripFreq,
    reqCurrentNonlocalRatio,
    reqCurrentInterDelay,
    reqLastDCnts,
    reqTodayRcgRate,
    reqTodayTaxiDist, 
    reqTodayOnlineDist, 
    reqCurrentTongqinRatio, 
    reqLastAvgTripDist, 
    reqCurrentLinkState, 
    reqTodayRdnetState, 
    reqNotMissSearch,
    reqTodayTaxiVn,
    reqTodayOnlineVn,
    reqTodayNonlocalVn
} from '../../api'
import { NODE_INFO } from '../../utils/baoshan'
import { TIME_POINT } from '../../utils/ConstantUtils'
import { Spin } from 'antd'
import LvqiTable from '../../components/table'
import LvqiMap from '../../components/map'

export default class Home extends Component {

    state = {
        firstRender: false,
        div11_option: {},   //RadarOption2(),
        div12_option: {},   //BiAreaOption(),
        div13_option: {},   //CalendarOption(),
        div21_option: {},   //GaugeOption2(),
        div22_option: {},   //AreaOption(),
        div23_data: [],
        div32_option: {},   //BiLineOption(),
        div41_option: {},   //GaugeOption5(),
        div42_option: {},   //AreaOption(),
        div43_data: [],
        div51_option: {},   //RadarOption2(),
        div52_option: {},   //HorizontalBarOption(),
        div53_option: {},   //BallOption3,
    }

    load_data = async() => {

        const result11 = await reqLastOCnts()

        const result12_1 = await reqTodayTaxiDist()
        const result12_2 = await reqTodayOnlineDist()

        const result13 = await reqNotMissSearch( "2020-04-01", "2020-04-19" )
        
        const result21 = await reqTodayRdnetState()

        const result22 = await reqCurrentTongqinRatio()

        const result23 = await reqCurrentLinkState()

        const result32_1 = await reqLastRdnetState()

        const result41_1 = await reqLastAvgTripDist()
        const result41_2 = await reqLastAvgTripTime()
        const result41_3 = await reqLastAvgTripFreq()

        const result42 = await reqCurrentNonlocalRatio()

        const result43 = await reqCurrentInterDelay()

        const result51 = await reqLastDCnts()

        const result52_1 = await reqTodayVn()
        const result52_2 = await reqTodayTaxiVn()
        const result52_3 = await reqTodayOnlineVn()
        const result52_4 = await reqTodayNonlocalVn()

        const result53 = await reqTodayRcgRate()

        let data11 = result11.data.slice(0, 10)
        let div11_option = RadarOption2(data11.map(e => NODE_INFO[e.O_NODE][1]), data11.map((e, i) => e.CNTS), "right" )

        let data12_1 = result12_1.data.map( e => e.TAXI_KM )
        let data12_2 = result12_2.data.map( e => e.CARHAILING_KM )
        let div12_option = BiAreaOption(data12_1, data12_2)
        
        let data13_x = result13.data.map( e => e.TIME_POINT )
        let data13 = result13.data.map( e => [e.TIME_POINT, e.NOT_MISS_RATE] )
        let div13_option = CalendarOption( [data13_x[0].slice(0, 10), data13_x[data13_x.length - 1].slice(0, 10)], data13 )
        
        let data21 = result21.data.map( e => e.SPEED )
        let div21_option = GaugeOption2(data21[data21.length - 1])

        let data22 = result22.data.map( e => e.TONGQIN_RATIO )
        let div22_option = AreaOption( TIME_POINT.slice(0, data22.length - 1), data22, "通勤车流量比例" )

        let div23_data = result23.data

        let data42 = result42.data.map( e => e.FOREIGN_RATIO )
        let div42_option = AreaOption( TIME_POINT.slice(0, data42.length - 1), data42, "外地车流量比例" )

        let div43_data = result43.data

        let data32_1 = result32_1.data.map( e => e.SPEED )
        let div32_option = BiLineOption( TIME_POINT, data21, data32_1 )

        let div41_option = GaugeOption5( result41_1.data[0].AVG_TRIP_DIST, result41_2.data[0].AVG_TRIP_TIME, result41_3.data[0].AVG_TRIP_FREQ )
        
        let data51 = result51.data.slice(0, 10)
        let div51_option = RadarOption2(data51.map(e => NODE_INFO[e.D_NODE][1]), data51.map((e, i) => e.CNTS), "left" )

        let data52_1 = result52_1.data
        let data52_2 = result52_2.data
        let data52_3 = result52_3.data
        let data52_4 = result52_4.data
        let div52_option = HorizontalBarOption(["在途量", "外地车", "出租车", "网约车"], [data52_1[data52_1.length - 1].ALL_NUM, data52_2[data52_2.length - 1].TAXI_NUM, data52_3[data52_3.length - 1].ONLINE_VN, data52_4[data52_4.length - 1].FOREIGN_NUM])

        let data53 = result53.data[result53.data.length - 1].RCG_RATE
        let div53_option = BallOption3(data53)

        this.setState({ 
            div11_option, div12_option, div13_option, div21_option, div22_option, div23_data, div32_option,
            div41_option, div42_option, div43_data, div51_option, div52_option,  div53_option, firstRender: true 
        })
    }

    componentWillMount() {
        this.load_data()
    }

    componentDidMount = () => {
        this.timer = setInterval( this.load_data, 100000 )
    }

    componentWillUnmount() {
        clearInterval( this.timer )
    }

    render() {
        let { firstRender, div11_option, div12_option, div13_option, div21_option, div22_option, div23_data, div32_option, div41_option, div42_option, div43_data, div51_option, div52_option, div53_option } = this.state
        return (
            <div className="full" style={{ display: 'flex' }}>
                <div className={firstRender?"none":"loading lyf-center"}>
                    <Spin size="large" spinning={!firstRender}/>
                </div>
                <div className="lyf-6-col">
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "交通发生量" }>
                            <Chart option={ div11_option }/>
                        </DataBox>
                    </div>
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "运营车公里数" }>
                            <Chart option={ div12_option }/>
                        </DataBox>
                    </div>
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "数据传输完整率" }>
                            <Chart option={ div13_option }/>
                        </DataBox>
                    </div>
                </div>
                <div className="lyf-6-col">
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "路网平均速度" }>
                            <Chart option={ div21_option }/>
                        </DataBox>
                    </div>
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "通勤流量比例" }>
                            <Chart option={ div22_option }/>
                        </DataBox>
                    </div>
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "路段行程速度" }>
                            <LvqiTable data={ div23_data } slideTimer = { 3000 } dataType="link"/>
                        </DataBox>
                    </div>
                </div>
                <div className="lyf-3-col">
                    <div className="lyf-2-3-row lyf-center">
                        <DataBox title={ "路段运行状态" }>
                            <LvqiMap data = {div23_data} dataType="link"/>
                        </DataBox>
                    </div>
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "宏观态势" }>
                            <Chart option={ div32_option }/>
                        </DataBox>
                    </div>
                </div>
                <div className="lyf-6-col">
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "机动车出行特征" }>
                            <Chart option={ div41_option }/>
                        </DataBox>
                    </div>
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "外地车流量比例" }>
                            <Chart option={ div42_option }/>
                        </DataBox>
                    </div>
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "交叉口延误" }>
                            <LvqiTable data={ div43_data } slideTimer = { 3000 } dataType="inter"/>
                        </DataBox>
                    </div>
                </div>
                <div className="lyf-6-col">
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "交通吸引量" }>
                            <Chart option={ div51_option }/>
                        </DataBox>
                    </div>
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "在途车辆数" }>
                            <Chart option={ div52_option }/>
                        </DataBox>
                    </div>
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "车牌识别准确率" }>
                            <Chart option={ div53_option }/>
                        </DataBox>
                    </div>
                </div>
            
            </div>
        )
    }
}

