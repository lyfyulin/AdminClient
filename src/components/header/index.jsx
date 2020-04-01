import React, { Component } from 'react'

import { Modal } from 'antd'
import { withRouter } from 'react-router-dom'
import menuList from '../../config/menuConfig'
import { reqWeather } from '../../api'

import { formatDate } from '../../utils/dateUtils'
import storageUtils from '../../utils/storageUtils'
import memoryUtils from '../../utils/memoryUtils'
import './index.less'
import LinkButton from '../link-button'
class Header extends Component {

    state = {
        currentTime: Date.now(),
        dayPictureUrl: '', 
        weather: ''
    }

    logout = ( e ) => {
        // 提示是否删除，删除内存中 user 信息，跳转到 /login 
        Modal.confirm({
            title: "是否退出?",
            onOk: () => {
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.visible = false
                this.props.history.replace('/login')
            },
            onCancel: () => {
                console.log("退出登录取消了！")
            },
            okText: "确认",
            cancelText: "取消",
        })
    }

    getTitle = () => {
        const path = '/' +  this.props.location.pathname.split('/')[1]
        let title = ''
        menuList.forEach( data => {
            if( data.key === path ){
                title = data.title
            } else if( data.children ){
                const cItem = data.children.find( cItem => cItem.key === path )
                if(cItem){
                    title = cItem.title
                }
            }
        })
        return title
    }

    getWeather = async () => {
        const { dayPictureUrl, weather } = await reqWeather("杭州")
        this.setState({
            dayPictureUrl, weather
        })
    }

    componentDidMount() {
        // 启动定时器
        this.intervalId = setInterval(() => {
            this.setState({
                currentTime: Date.now()
            })
        }, 1000)
        this.getWeather()
    }

    componentWillUnmount = () => {
      clearInterval( this.intervalId )
    };
    

    render() {
        const user = memoryUtils.user
        const title = this.getTitle()
        const time = formatDate(this.state.currentTime)
        const { dayPictureUrl, weather } = this.state

        return (
            <div className = "header">
                <div className = "header-top">
                    {/* 标签体文本以 children 传给子标签 */}
                    欢迎, { user.username } &nbsp;&nbsp; <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className = "header-bottom">
                    <div className = "header-bottom-left">{title}</div>
                    <div className = "header-bottom-right">
                        <span>{time}</span>
                        <img src = {dayPictureUrl} alt = "tips" />
                        <span>{ weather }</span>
                    </div>
                </div>
            </div>
        )
    }
}

// 包装之后 可以 直接使用 this.props.history

export default withRouter( Header )