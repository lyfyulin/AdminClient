import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item
const Option = Select.Option
class AddUpdateUser extends Component {

    static propTypes = {
        roles: PropTypes.array,
        user: PropTypes.object,
    }

    componentWillMount() {
        this.props.setForm( this.props.form )
    }


    render() {

        const { getFieldDecorator } = this.props.form

        const { user, roles } = this.props

        let rolesSelect

        if(roles){
            rolesSelect = roles.map( item => (<Option key={item.id} value={item.id}>{item.name}</Option>) )
        }

        return (
            <Form

            >
                <Item>
                    {
                        getFieldDecorator("username", {
                            initialValue: user.username || '',
                            rules: [
                                { required: true, message: '必须输入用户名' },
                                { max: 12, message: '最大输入12位' }
                            ]
                        })( <Input placeholder = "请输入用户名" /> )
                    }
                </Item>
                <Item>
                    {
                        getFieldDecorator("password", {
                            initialValue: user.password || '',
                            rules: [
                                { required: true, message: '必须输入密码' },
                                { max: 12, message: '最大输入12位密码' }
                            ]
                        })( <Input type = "text" placeholder = "请输入密码" /> )
                    }
                </Item>
                <Item>
                    {
                        getFieldDecorator("email", {
                            initialValue: user.email || '',
                            rules: [
                                { required: true, message: '必须输入电子邮箱' },
                                { max: 12, message: '最大输入12位' }
                            ]
                        })( <Input placeholder = "请输入电子邮箱" /> )
                    }
                </Item>
                <Item>
                    {
                        getFieldDecorator("role", {
                            initialValue: user.role || '',
                            rules: [
                                { required: true, message: '必须输入电子邮箱' },
                            ]
                        })( <Select>
                            <Option value = "">请选择</Option>
                            { rolesSelect }
                        </Select> )
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(AddUpdateUser)
