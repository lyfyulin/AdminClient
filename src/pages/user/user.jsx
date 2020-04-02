import React, { Component } from 'react'
import { Card, Button, Table, message, Modal } from 'antd'

import {formatDate} from '../../utils/dateUtils'
import { reqUsers, reqRoles, reqAddUser, reqUpdateUser, reqDeleteUser } from '../../api'
import AddUpdateUser from './add-update'
import { PAGE_SIZE } from '../../utils/ConstantUtils'

export default class User extends Component {

    state = {
        users: [],
        roles: [],
        showOrAddOrUpdate: 0,
    }

    initColumns = () => {
        this.columns = [{
            title: '用户名',
            dataIndex: 'username',
        },{
            title: '创建时间',
            dataIndex: 'create_time',
            render: formatDate,
        },{
            title: '邮箱',
            dataIndex: 'email',
        },{
            title: '所属角色',
            dataIndex: 'role',
            render: role => this.roleNames[role],
        },{
            title: '描述',
            dataIndex: 'info',
        },{
            title: '操作',
            render: user => <span><Button type = "default" onClick = { () => { this.updateUser(user) } } >修改</Button>&nbsp;&nbsp;
                                <Button type = "default" onClick = { () => this.deleteUser(user) }>删除</Button></span>
        }]
    }

    getUsers = async () => {
        const usersRes = await reqUsers()
        const rolesRes = await reqRoles()

        if(usersRes.code === 0){
            message.success("加载用户失败！");
        }else{
            if(rolesRes.code === 1){
                let users = usersRes.data
                let roles = rolesRes.data
                this.roleNames = {}
                roles.forEach((item,index)=>{this.roleNames[''+index]=item.name})
                this.setState({
                    users,
                    roles
                })
            }

        }
    }

    addUser = () => {
        this.user = {}
        this.setState({ showOrAddOrUpdate: 1 }) 
    }

    updateUser = (user) => {
        this.user = user
        this.setState({
            showOrAddOrUpdate: 2
        })
    }

    deleteUser = async (user) => {
        Modal.confirm({
            title: "是否删除该用户?",
            onOk:  async () => {
                const result = await reqDeleteUser( user.id )
                if(result.code === 1){
                    message.success("删除成功！")
                    this.getUsers()
                }else{
                    message.error("删除失败！")
                }
            }
        })
    }
    
    addOrUpdateUser = () => {
        const {showOrAddOrUpdate} = this.state
        this.form.validateFields( async (error, values) => {
            if(!error){
                const user = values
                let result
                if(showOrAddOrUpdate === 1){
                    result = await reqAddUser(user)
                }else{
                    user.id = this.user.id
                    result = await reqUpdateUser(user)
                }
                if(result.code === 1){
                    message.success(showOrAddOrUpdate===1? "添加用户成功":"更新用户成功")
                }else{
                    message.error("数据加载失败！")
                }
            }else{
                message.error(showOrAddOrUpdate===1? "添加用户失败":"更新用户失败" )
            }
        })
        this.getUsers()
        this.setState({showOrAddOrUpdate: 0})
    }

    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getUsers()
    }

    render() {

        const { users, roles, showOrAddOrUpdate } = this.state
        const title = (
            <Button type = "primary" onClick = { this.addUser } >创建用户</Button>
        )
        return (
            <Card title = {title}>
                <Table
                    columns = { this.columns }
                    dataSource = { users }
                    rowKey = "id"
                    pagination = {{ pageSize: PAGE_SIZE }}
                >
                </Table>
                <Modal 
                    title = { showOrAddOrUpdate === 1 ? "添加用户": "修改用户" }
                    visible = { showOrAddOrUpdate === 0 ? false: true }
                    onCancel = { () => { this.setState({ showOrAddOrUpdate: 0 }) } }
                    onOk = { this.addOrUpdateUser }
                >
                    <AddUpdateUser user = { showOrAddOrUpdate === 1 ? {} : this.user } roles = {roles} setForm = { form => {this.form = form} } />
                </Modal>
            </Card>
        )
    }
}
