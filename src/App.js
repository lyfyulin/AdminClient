/*
应用根组件
*/

import React, {Component} from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'

import Login from './pages/login/login'
import Admin from './pages/admin/admin'

export default class App extends Component{

    render(){
        return (
            <HashRouter>
                <Switch>
                {/* / 表示匹配任意路由， 下面的顺序表示：除了 /login，其他都匹配 / 路由 */}
                    <Route path="/login" component={Login}/>
                    <Route path="/" component={Admin}/>
                </Switch>
            </HashRouter>
            
        )
    }
}


