import React, { Component } from 'react'
import { Form, Input, Button, Icon, message } from 'antd'
import { Redirect } from 'react-router-dom'

import { reqLogin } from '../../api'
import storageUtils from '../../utils/storageUtils'
import memoryUtils from '../../utils/memoryUtils'

import logo from '../../assets/images/logo.png'
import './login.less'

const Item = Form.Item

/*
    用户名/密码的合法性要求
    1）必须输入
    2）必须大于等于4位
    3）必须小于等于18位
    4）必须是英文、数字或下划线组成
*/

class Login extends Component {
    
    handleSubmit = (e) => {
        e.preventDefault()

        // 取出输入相关的数据
        /*
        const form = this.props.form
        const values = form.getFieldsValue()
        const username = form.getFieldValue("username")
        console.log(values);
        console.log(username);
        */

        // 对表单所有字段进行 统一 验证(用户名和密码统一验证)
        this.props.form.validateFields( async (err, {username, password}) => {

            if(!err){
                // 发送登录的请求
                const result = await reqLogin(username, password)
                if( result.code === 1 ){
                    // 跳转到 /admin 界面
                    this.props.history.replace( '/' )
                    message.success("登录成功！")

                    // user保存到本地
                    const user = result.data;
                    // localStorage.setItem( "user_key", JSON.stringify(user) )
                    storageUtils.saveUser(user)
                    memoryUtils.user = user
                    
                }else{
                    message.error(result.message)
                }
            }else{
                console.log("登录键出发的，用户名或密码验证失败！")
            }
        })
    }

    // 对密码进行自定义验证
    validatorPwd = (rule, value, callback) => {

        value = value.trim()
        if( !value ){
            callback("密码必须输入！")
        }else if( value.length < 4 ){
            callback("密码必须大于4位！")
        }else if( value.length > 18 ){
            callback("密码必须小于18位！")
        }else if( !/^[a-zA-Z0-9_]+$/.test( value ) ){
            callback("密码必须为字母或者数字")
        } else {
            callback() // 验证通过
        }
    }

    render() {

        // 读取到保存的user，如果存在跳转到 admin 页面
        // const user = JSON.parse(localStorage.getItem("user_key") || '{}')
        // const user = storageUtils.getUser()
        const user = memoryUtils.user
        if(user.id){
            return <Redirect to="/"/>
        }

        const { getFieldDecorator } = this.props.form
        return (
            <div className="login">
                <div className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>交通指数运行平台</h1>
                </div>
                <div className="login-content">
                    <h1>登 录</h1>
                    <Form className="login-form" onSubmit={this.handleSubmit} >
                        <Item>
                            {getFieldDecorator("username", {
                                initialValue: '',   // 初始值
                                rules: [ // 声明实时表单验证，使用 插件定义好的规则 进行验证。
                                    { required: true, whitespace: true, message: "必须输入用户名！" },
                                    { min: 4, message: "用户名不能小于4位！" },
                                    { max: 12, message: "用户名不能大于18位！" },
                                    { pattern: /^[a-zA-Z0-9_]+$/i, message: "用户名必须为字母或数字！" }
                                ]
                            })(
                                <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />} placeholder="用户名" />
                            )}
                        </Item>
                        <Item>
                        {getFieldDecorator("password", {
                                initialValue: '',       // 初始值
                                rules: [
                                    { validator: this.validatorPwd }
                                ]
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />} type="password" placeholder="密码" />
                            )}
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                            Log in
                            </Button>
                        </Item>
                    </Form>
                </div>
            </div>
        )
    }
}

/*
    Form.create() 包装 Form 组件生成一个新的组件
    新组件向 Form 组件传递属性 form

    高阶函数：接收参数时函数或返回值是函数，场景的有： 数组遍历的方法 / 定时器 / Promise / 高阶组件 / fn.bind(obj)()
    作用：实现动态功能

    高阶组件：函数接收一个组件，返回一个新的组件， Form.create() 返回的就是一个高阶组件

*/
const WrapperForm = Form.create()(Login)
export default WrapperForm
