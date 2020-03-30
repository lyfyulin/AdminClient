import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import {Menu, Icon} from 'antd'

import menuList from '../../config/menuConfig'
import logo from '../../assets/images/logo.png'
import './index.less'

const { SubMenu } = Menu
const { Item } = Menu
/*
    左侧导航
*/



class LeftNav extends Component {

    /*
    根据指定菜单数据列表产生<Menu>的子节点数组
    使用 reduce() + 递归
    */
    getMenuNodes = (menuList) => {

        // 得到当前请求的path
        const path = this.props.location.pathname

        return menuList.reduce((pre, item) => {
            // 添加<Menu.Item></Menu.Item>
            if (!item.children) {
                pre.push((
                    <Menu.Item key={item.key}>
                    <Link to={item.key}>
                        <Icon type={item.icon} />
                        <span>{item.title}</span>
                    </Link>
                    </Menu.Item>
                ))
            } else { // 添加<SubMenu></SubMenu>
                // 如果当前请求路由与当前菜单的某个子菜单的key匹配, 将菜单的key保存为openKey
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                if (cItem) {
                    this.openKey = item.key
                }

                pre.push((
                    <SubMenu
                    key={item.key}
                    title={
                        <span>
                        <Icon type={item.icon} />
                        <span>{item.title}</span>
                        </span>
                    }
                    >
                    {this.getMenuNodes(item.children)}
                    </SubMenu>
                ))
            }
            return pre
        }, [])
    }

      /*
  根据指定菜单数据列表产生<Menu>的子节点数组
  使用 map() + 递归
  */
  getMenuNodes2 = (menuList) => {

    // 得到当前请求的path
    const path = this.props.location.pathname

    return menuList.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      } else {
        // 如果当前请求路由与当前菜单的某个子菜单的key匹配, 将菜单的key保存为openKey
        if (item.children.find(cItem => path.indexOf(cItem.key) === 0)) {
          this.openKey = item.key
        }
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
        )
      }
    })
  }

    render() {
        let menuNodes = this.getMenuNodes(menuList)
        let selectKey = this.props.location.pathname
        return (
            <div className="left-nav">
                <Link className="left-nav-link" to="/home">
                    <img src={logo} alt="logo"/>
                    <h1>绿启信控</h1>
                </Link>
                <Menu
                    SelectedKeys={[selectKey]}
                    defaultOpenKeys={[this.openkey]}
                    mode="inline"
                    theme="dark"
                >
                    {
                        menuNodes
                    }
                </Menu>
            </div>
        )
    }
}

// 高阶组件包装路由组件，形成新组件
// 新组件 传递 3 个特别属性：history / location / match
export default withRouter(LeftNav)
/**
 * 默认选择对应的 menuItem
 * 有可能需要打开某个 SubMenu：访问的是某个二级菜单
 */