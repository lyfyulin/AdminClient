/**
 *      封装所有请求
 */
import ajax from './ajax'


export function reqLogin(username, password){
    ajax({
        method: "post",
        url: "/login",
        data: {
            username,
            password
        }
    })
}














