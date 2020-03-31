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

/*
const name = "admin"
const pwd = "admin"
reqLogin(name, pwd).then(data => {
    console.log(data);
})
*/



