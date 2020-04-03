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
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import { connect } from 'react-redux'


const { Content, Footer, Sider } = Layout

class Admin extends Component {
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
                    <Content style={{ backgroundColor: '#ccc', padding: '20px' }}>
                        <Switch>
                            <Route path="/home" component={ Home }></Route>
                            <Route path="/category" component={ Category }></Route>
                            <Route path="/product" component={ Product }></Route>
                            <Route path="/role" component={ Role }></Route>
                            <Route path="/user" component={ User }></Route>
                            <Route path="/charts/bar" component={ Bar }></Route>
                            <Route path="/charts/line" component={ Line }></Route>
                            <Route path="/charts/pie" component={ Pie }></Route>
                            <Redirect to="/home" />
                        </Switch>
                    </Content>
                    <Footer style={{ backgroundColor: '#0003', textAlign: 'center' }} >杭州绿启交通科技有限公司 @ 2019-2020</Footer>
                </Layout>
            </Layout>
        )
    }
}

export default  connect(
    state => ({ user: state.user }),
    { }
)(Admin)
