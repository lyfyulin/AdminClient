import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Form, Input} from 'antd'

const {Item} = Form

class AddUpdateForm extends Component {

    static props = {
        setForm : PropTypes.func.isRequired,
        category: PropTypes.string,
    }

    componentWillMount() {
        this.props.setForm( this.props.form )
    }

    render() {
        const {getFieldDecorator} = this.props.form
        const {category} = this.props
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator("name", {
                            initialValue: category || '',
                            rules: [
                                { required: true, message: '必须输入名称' }
                            ]
                        })(<Input type="text" placeholder="输入商品品类"></Input>)
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(AddUpdateForm)
