import React, { Component } from 'react'
import { 
    Card, 
    Icon,
    Form,
    Input,
    Select,
    Button,
    message,  
} from 'antd'
import LinkButton from '../../components/link-button'
import PictureWall from './picture-wall'
import { reqCategories, reqAddUpdateProduct } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import RichTextEditor from './rich-text-editor'

const Option = Select.Option
const Item = Form.Item

class ProductAddUpdate extends Component {

    state = {
        categories: [],
    }

    constructor(props) {
        super(props)
        // 创建 Ref 容器，并保存到组件对象
        this.picWallRef = React.createRef()
        this.editorRef = React.createRef()
    }
    

    getCategories = async () => {
        const result = await reqCategories();
        if( result.code === 1 ){
            this.setState({
                categories: result.data
            })
        }
    }

    validatePrice = ( rule, value, callback ) => {
        const res = parseInt( value.trim(), 10 )
        if( isNaN( res ) ){
            callback( "价格必须输入大于0的值！" )
        } else if( res <= 0 ){
            callback( "价格必须大于0！" )
        }else{
            callback()
        }
    }

    handleSubmit = ( e ) => {
        e.preventDefault();
        this.props.form.validateFields( async ( err, values ) => {
            if( !err ){

                const { name, descs, price, categoryId } = values

                let images = this.picWallRef.current.getImages()

                images = !images? '': images.join(";")

                const detail = this.editorRef.current.getDetail()

                // 添加或修改
                let product = { name, descs, price, categoryId, image:images, detail }

                if( this.isUpdate ){

                    product.id = this.product.id
                }

                const result = await reqAddUpdateProduct(product)

                if(result.code === 1){

                    message.success( `${this.isUpdate?'修改':'添加'}货物成功！` )
                    this.props.history.replace('/product')
                }else{

                    message.error( `${this.isUpdate?'修改':'添加'}货物失败！` )
                }
                
            }
        } )
    }

    componentWillMount() {
        this.product = memoryUtils.product
        this.isUpdate = !!this.product.id
    }

    componentDidMount() {
        this.getCategories()
    }


    render() {
        const { categories } = this.state
        const isUpdate = this.isUpdate
        const product = isUpdate ? this.product : {}

        const { getFieldDecorator }  = this.props.form
        const title = (
            <span>
                <LinkButton onClick = { () => { this.props.history.replace("/product") } } >
                    <Icon type = "arrow-left" />
                </LinkButton>
                <span> { isUpdate ? "更新货物" : "添加货物" } </span>
            </span>
        )

        // form 的所有 item 的布局
        const formLayout = {
            labelCol : { span: 2 } ,
            wrapperCol : { span: 10 },
        }
        return (
            <Card title = {title} >
                <Form
                    {...formLayout}
                    onSubmit = { this.handleSubmit }
                >
                    <Item label = "货物名称">
                        {
                            getFieldDecorator("name", {
                                initialValue: product.name,
                                rules: [
                                    { required: true, message: "必须输入货物名称！" },
                                ]
                            })( <Input type = "text" placeholder = "请输入货物名称" /> )
                        }
                    </Item>
                    <Item label = "货物描述">
                        {
                            getFieldDecorator("descs", {
                                initialValue: product.descs,
                                rules: [
                                    { required: true, message: "必须输入货物名称！" },
                                ]
                            })( <Input type = "text" placeholder = "请输入货物名称" /> )
                        }
                    </Item>
                    <Item label = "货物价格">
                        {
                            getFieldDecorator("price", {
                                initialValue: product.price,
                                rules: [
                                    { validator: this.validatePrice }
                                ]
                            })( <Input type = "number" placeholder = "请输入货物名称" addonAfter = "  元  " /> )
                        }
                    </Item>
                    <Item label = "货物品类">
                        {
                            getFieldDecorator("categoryId", {
                                initialValue: product.categoryId,
                                rules: [
                                    { required: true, message: "必须输入货物品类！" },
                                ]
                            })( 
                                <Select >
                                    <Option value = "">未选择</Option>
                                    {
                                        categories.map( c => (<Option key = { c.id } value = { c.id }>{ c.name }</Option>) )
                                    }
                                </Select>
                             )
                        }
                    </Item>
                    <Item label = "货物图片">
                        <PictureWall ref = { this.picWallRef } images = { product.image }/>
                    </Item>
                    <Item label = "货物详情" wrapperCol = {{ span: 20 }} >
                        <RichTextEditor detail = { product.detail } ref = { this.editorRef } />
                    </Item>
                    <Item>
                        <Button type = "primary" htmlType = "submit"> 提交 </Button>
                    </Item>
                </Form>

            </Card>
        )
    }
}

export default Form.create()(ProductAddUpdate)