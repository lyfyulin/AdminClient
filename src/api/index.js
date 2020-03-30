/**
 *      封装所有请求
 */
import ajax from './ajax'

const base = ''

export const reqLogin = (username, password) => ajax.post( base + "/login", {username, password} )




/*
const name = "admin"
const pwd = "admin"
reqLogin(name, pwd).then(data => {
    console.log(data);
})
*/



