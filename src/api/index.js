/**
 *      封装所有请求
 */
import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'
const base = ''
export const reqLogin = (username, password) => ajax.post( base + "/login", {username, password} )

// jsonp 只能解决 GET 类型的 ajax 请求跨域问题
// jsonp 请求不是 ajax 请求，而是一般的 get 请求 
export const reqWeather = (location) => {
    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${location}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        jsonp(url, {}, (error, data) => {
            if( !error && data.error === 0 ){
                const { dayPictureUrl, weather } = data.results[0].weather_data[0]
                resolve( { dayPictureUrl, weather } )
            }else{
                message.error("获取天气信息失败！")
            }
        })
    })
}


export const reqCategories = () => ajax(base + "/product")
export const reqAddCategory = (name) => ajax.post( base + "/insert/product", { name } )
export const reqUpdateCategory = ({id, name}) => ajax.post( base + "/update/product", { id, name } )

export const reqGoods = (pageNum, pageSize) => ajax( base + `/good/${pageNum}`, {
    params: {       // 包含请求参数的对象
        pageSize
    }
} )

export const reqSearchGoods = ({ pageNum, pageSize, searchName, searchType}) => ajax( base + "/good/search", {
    params: {
        pageNum,
        pageSize,
        searchType,
        searchName,   // productName 或 productDescs
    }
})


export const reqUpdateStatus = ( goodsId, status ) => ajax.post( base + "/update/good", JSON.stringify({ id : goodsId, status: status,}), {
    headers: {
        "Content-Type": 'application/json'
    },
})

export const reqCategory = (categoryId) => ajax( base + "/product/info", {
    params: {
        id: categoryId
    }
} )

export const reqDeleteImage = ( image ) => ajax.post( base + '/image/delete', { image } )

export const reqAddUpdateProduct = (product) => ajax.post(
     base + (product.id?'/update/good':'/insert/good'),
     JSON.stringify(product),
     {
        headers: {
            "Content-Type": 'application/json'
        },
     }
)
export const reqProductById = ( goodId ) => ajax( base + "/good/info", {
    params: {
        id: goodId
    }
} )

export const reqRoles = () => ajax( base + "/role" )

export const reqAddRole = ( role ) => ajax.post(
    base + '/insert/role',
    JSON.stringify( {...role} ),
    {
        headers: { "Content-Type": "application/json" }
    }
)

export const reqUpdateRole = ( role ) => ajax.post(
    base  + '/update/role',
    JSON.stringify( { ...role } ),
    {
        headers: { 'Content-Type' : 'application/json' }
    }
)

export const reqUsers = () => ajax( base + "/user" )

export const reqAddUser = ( user ) => ajax.post(
    base + '/user/insert',
    JSON.stringify( {...user} ),
    {
        headers: { "Content-Type": "application/json" }
    }
)

export const reqUpdateUser = ( user ) => ajax.post(
    base  + '/user/update',
    JSON.stringify( { ...user } ),
    {
        headers: { 'Content-Type' : 'application/json' }
    }
)

export const reqDeleteUser = (id) => ajax.post( base + '/user/delete', {id} )

export const reqAvgSpeed = ( start_time, end_time ) => ajax( base + '/avgspeed', {
    params: {
        start_time,
        end_time,
    }
} )

export const reqVnIn = ( start_time, end_time ) => ajax( base + '/vnin', {
    params: {
        start_time,
        end_time,
    }
} )

export const reqVnOut = ( start_time, end_time ) => ajax( base + '/vnout', {
    params: {
        start_time,
        end_time,
    }
} )

export const reqVnInfo = ( start_time, end_time ) => ajax( base + '/vninfo', {
    params: {
        start_time,
        end_time,
    }
} )

