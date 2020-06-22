import React, { Component } from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { Icon, Dropdown, Menu, notification } from 'antd'

import Home from './home'
import Link from './link'
import Inter from './inter'
import './platform.less'
import Device from './device'
import Nonlocal from './nonlocal'
import Od from './od'
import './platform.less'
import Tongqin from './tongqin'

class Platform extends Component {

    state = {
        menu: [
            { path: "/platform", name: "首页" },
            { path: "/platform/inter", name: "路口" },
            { path: "/platform/link", name: "路段" },
            { path: "/platform/nonlocal", name: "外地车" },
            { path: "/platform/tongqin", name: "通勤车" },
            { path: "/platform/od", name: "出行" },
            { path: "/platform/device", name: "设备" },
        ]
    }

    // 警告函数
    openNotification = (type, message, description, goTo) => {
        notification[type]({
            message: message,
            description: description,
            placement: 'topRight',
            duration: 3,
            rtl: true,
            onClick: () => {
                this.props.history.replace(goTo)
            },
        })
    }

    componentDidMount() {
        /*
        setTimeout( () => {
            this.openNotification('warning', '数据传输失效', '数据传输中断！', "/home")
        }, 0)
        setTimeout( () => {
            this.openNotification('warning', '设备质量问题', '设备正阳路-保岫路北口、永昌路-保岫路南口设备识别率低，识别率为20.8%！', "/platform/device")
        }, 2000)
        setTimeout( () => {
            this.openNotification('warning', '道路车均速度', '路网车均速度小于12.8%！', "/platform/link")
        }, 4000)
        setTimeout( () => {
            this.openNotification('warning', '事故黑点', '永昌路-沙河路口事故数量较多，可作优化！', "/accidents")
        }, 6000)
        */
    }
    

    render() {
        const user = this.props.user
        if(!user.user_id){
            return <Redirect to="/login"/>
        }else{
            const menu = (
                <Menu onClick={ (e) => { this.props.history.replace(e.key) } }>
                {
                    this.state.menu.map( e => (
                        <Menu.Item key={e.path}>{e.name}</Menu.Item>
                    ))
                }
                </Menu>
            )
            return (
                <div className="platform">
                    <div className="header">
                        保山中心城区交通数据研判分析平台&nbsp;&nbsp;
                        <Dropdown overlay={menu}>
                            <a className="ant-dropdown-link" onClick={ e => e.preventDefault()}><Icon type="menu"/></a>
                        </Dropdown>
                    </div>
                    <div className="content lyf-center">
                        <Switch>
                            <Route exact path="/platform" component={ Home }></Route>
                            <Route path="/platform/link" component={ Link }></Route>
                            <Route path="/platform/inter" component={ Inter }></Route>
                            <Route path="/platform/device" component={ Device }></Route>
                            <Route path="/platform/nonlocal" component={ Nonlocal }></Route>
                            <Route path="/platform/od" component={ Od }></Route>
                            <Route path="/platform/tongqin" component={ Tongqin }></Route>
                        </Switch>
                    </div>
                    <div className="footer">Copyright ©2020年 保山交警支队. 版权所有</div>
                </div>
            )
        }
    }
}

export default  connect(
    state => ({ user: state.user }),
    { }
)(Platform)
