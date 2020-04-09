import React, { Component } from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import { Layout } from 'antd' 

import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import RoadState from '../charts/roadstate'
import InterState from '../charts/interstate'
import AreaState from '../charts/areastate'
import IntersectionInfo from '../intersection/intersection-info'
import LinkInfo from '../link/link-info'
import DeviceInfo from '../device/device-info'
import FlowInfo from '../flow/flow-info'
import SignalInfo from '../signal/signal-info'

import { connect } from 'react-redux'


const { Content, Footer, Sider } = Layout

class Admin extends Component {

    render() {
        // 读取保存的user信息，不存在则跳到登录界面
        const user = this.props.user
        if(!user.id){
            return <Redirect to="/login"/>
        }
        return (
            <Layout style={{ height: '100%' }}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header/>
                    <Content 
                        id = "content"
                        style={{ backgroundColor: '#ccc', padding: 0, margin: 0 }}
                    >
                        <Switch>
                            <Route path="/home" component={ Home }></Route>
                            <Route path="/category" component={ Category }></Route>
                            <Route path="/product" component={ Product }></Route>
                            <Route path="/role" component={ Role }></Route>
                            <Route path="/user" component={ User }></Route>
                            <Route path="/charts/roadstate" component={ RoadState }></Route>
                            <Route path="/charts/interstate" component={ InterState }></Route>
                            <Route path="/charts/areastate" component={ AreaState }></Route>
                            <Route path="/intersection-info" component={ IntersectionInfo }></Route>
                            <Route path="/link-info" component={ LinkInfo }></Route>
                            <Route path="/device-info" component={ DeviceInfo }></Route>
                            <Route path="/flow-info" component={ FlowInfo }></Route>
                            <Route path="/signal-info" component={ SignalInfo }></Route>
                            <Redirect to="/home" />
                        </Switch>
                    </Content>
                    <Footer style={{ backgroundColor: '#0003', textAlign: 'center', padding: '10px 10px' }} >Copyright (c) 2019-2020 杭州绿启交通科技有限公司 </Footer>
                </Layout>
            </Layout>
        )
    }
}

export default  connect(
    state => ({ user: state.user }),
    { }
)(Admin)
