import React, { Component } from 'react'
import './home.less'
import { Icon } from 'antd'

export default class Home extends Component {
    render() {
        return (
            <div className="home">
                <div className="lvqi-col-3">
                    <div className = "lvqi-card">
                        <div className = "lvqi-card-content">
                            {/* <img src={require("./images/home_img1.png")} alt="产品特点1" /> */}
                            <Icon type="table"/>
                        </div>
                        <div className = "lvqi-card-title">
                            <h1>路网数字化建模</h1>
                            <p>数字化建模存储交叉口, 路段等交通参数, 包括<b>组织、渠化、控制方案</b>等, 匹配结构化数据.</p>
                        </div>
                    </div>
                </div>
                <div className="lvqi-col-3">
                    <div className = "lvqi-card">
                        <div className = "lvqi-card-content">
                            <Icon type="car"/>
                            {/* <img src={require("./images/home_img2.png")} alt="产品特点2" /> */}
                        </div>
                        <div className = "lvqi-card-title">
                            <h1>信号控制辅助优化</h1>
                            <p>融合处理线圈、视频等结构化数据预测交通流量, 实时计算<b> 单点、干线、区域 </b>配时优化方案。</p>
                        </div>
                    </div>
                </div>
                <div className="lvqi-col-3">
                    <div className = "lvqi-card">
                        <div className = "lvqi-card-content">
                            <Icon type="area-chart"/>
                            {/* <img src={require("./images/home_img3.png")} alt="产品特点3" /> */}
                        </div>
                        <div className = "lvqi-card-title">
                            <h1>信号控制评价</h1>
                            <p>基于历史结构化数据, 评价信号控制效果, 包括: <b>排队次数、失调指数、延误</b> 等。</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
