import React, { Component } from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import { Layout } from 'antd'

// import storageUtils from '../../utils/storageUtils'
import memoryUtils from '../../utils/memoryUtils'
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
import { connect } from 'react-redux'


const { Content, Footer, Sider } = Layout

class Admin extends Component {

    componentDidMount(){
        let content = document.getElementById("content")
        console.log(content.clientHeight);
    }
    render() {
        // 读取保存的user信息，不存在则跳到登录界面
        // const user = JSON.parse(localStorage.getItem("user_key") || '{}')   // 如果没有则为 空对象 {}
        // const user = storageUtils.getUser()
        // const user = memoryUtils.user
        const user = this.props.user
        if(!user.id){
            // this.props.history.replace( "/login" )   // render中不使用这个，得回调函数中使用
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
