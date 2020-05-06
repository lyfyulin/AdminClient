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
            rolesSelect = roles.map( item => (<Option key={item.ROLE_ID} value={item.ROLE_ID}>{item.ROLE_NAME}</Option>) )
        }

        return (
            <Form
            >
                <Item>
                    {
                        getFieldDecorator("USERNAME", {
                            initialValue: user.USERNAME || '',
                            rules: [
                                { required: true, message: '必须输入用户名' },
                                { max: 12, message: '最大输入12位' }
                            ]
                        })( <Input placeholder = "请输入用户名" /> )
                    }
                </Item>
                <Item>
                    {
                        getFieldDecorator("PASSWORD", {
                            initialValue: user.PASSWORD || '',
                            rules: [
                                { required: true, message: '必须输入密码' },
                                { max: 12, message: '最大输入12位密码' }
                            ]
                        })( <Input type = "text" placeholder = "请输入密码" /> )
                    }
                </Item>
                <Item>
                    {
                        getFieldDecorator("PHONE_NUMBER", {
                            initialValue: user.PHONE_NUMBER || '',
                            rules: [
                                { required: true, message: '必须输入手机号' },
                                { max: 12, message: '最大输入12位' }
                            ]
                        })( <Input placeholder = "请输入手机号" /> )
                    }
                </Item>
                <Item>
                    {
                        getFieldDecorator("ROLE_ID", {
                            initialValue: user.ROLE_ID || '',
                            rules: [
                                { required: true, message: '必须输入橘色名称' },
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
