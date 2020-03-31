/*
应用根组件
*/

import React, {Component} from 'react'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'

import Login from './pages/login/login'
import Admin from './pages/admin/admin'

export default class App extends Component{

    render(){
        return (
            <HashRouter>
                <Switch>
                {/*       
                        / 表示匹配任意路由， 下面的顺序表示：先匹配是否访问 /login ，除/login的其他访问都匹配到 / 的路由组件，
                        用 exact 来表示 / 的精确匹配
                 */}
                    <Route path = "/login" component={ Login }/>
                    <Route path = "/" component={ Admin }/>
                </Switch>
            </HashRouter>
            
        )
    }
}


