import React, { Component } from 'react'
import { Modal, Card, Button, Icon, Table, message, Input } from 'antd'

import { reqCategories, reqAddCategory, reqUpdateCategory } from '../../api'
import AddUpdateForm from './add-update-form'
import LinkButton from '../../components/link-button'
import './category.less'

export default class Category extends Component {

    state = {
        categories: [],
        loading: false,
        showStatus: 0,  //0 不显示；1 显示添加； 2 显示修改
    }

    getCategories = async () => {
        
        // 显示 loading 画面
        this.setState( { loading: true } )

        const result = await reqCategories()

        // 隐藏 loading 画面
        this.setState( { loading: false } )

        if(result.code === 1){

            const categories = result.data.map(item => ({ id: item.id, name: item.name }))

            this.setState({
                categories
            })

        }else{

            message.error(result.message)

        }
    }

    initColumns = () => {
        this.columns = [
            {
              title: '名称',
              dataIndex: 'name',
            },
            {
              title: '操作',
              render: (text) => <LinkButton onClick={()=>{
                  this.category = text
                  this.setState({showStatus : 2})
                }}>修改分类</LinkButton>,
            },
        ]
    }

    handleOk = ()=>{

        // 表单验证
        this.form.validateFields(async (err, values) => {

            if(!err){

                this.form.resetFields()   //重置输入数据, 变为初始值

                const { name } = values
                const { showStatus } = this.state
                let result

                if( showStatus === 1){
                    result = await reqAddCategory( name )
                }else{
                    const id = this.category.id
                    result = await reqUpdateCategory( { id, name } )
                }
                this.setState({showStatus: 0})
                if(result.code === 0){
                    message.error(result.message)
                }else{
                    message.success(result.message)
                    this.getCategories()
                }
            }
        })
    }

    handleCancel = ()=>{
        this.setState({
            showStatus: 0
        })
    }

    addProduct = (e) => {
        this.category = null
        this.setState({
            showStatus: 1
        })
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount = () => {
      this.getCategories()
    };

    render() {

        const { categories, loading, showStatus } = this.state

        const category = this.category || {}

        let extra = <Button type = "primary" onClick={ this.addProduct }>
            <Icon type="plus"/>
            添加
        </Button>

        return (
            <Card extra={ extra } >
                <Table 
                    bordered = { true }
                    rowKey = "id"
                    loading = { loading }
                    columns = { this.columns }
                    dataSource = { categories }
                    pagination = {{ defaultPageSize: 6, showQuickJumper: true }}
                />
                <Modal
                    title = { showStatus === 1 ? "添加分类": "修改分类" }
                    visible={ showStatus === 0 ? false: true }
                    onOk={ this.handleOk }
                    onCancel = { this.handleCancel }
                >
                    {/* 将子组件传递过来的对象保存到当前组件对象 */}
                    <AddUpdateForm setForm = {form => this.form = form} category = { category.name } />
                </Modal>
            </Card>
        )
    }
}
