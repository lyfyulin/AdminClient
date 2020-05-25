export function getTimeString(time){
    if(!time) return ''
    let data = new Date(time)
    return data.getFullYear() + '-' + ((data.getMonth() + 1) + '').padStart(2, '0') + '-' + (data.getDate() + '').padStart(2, '0') + ' ' + (data.getHours() + '').padStart(2, '0') + ':'+ (data.getMinutes() + '').padStart(2, '0') + ':'+ (data.getSeconds() + '').padStart(2, '0')
}

export function getDateString(time){
    if(!time) return ''
    let data = new Date(time)
    return data.getFullYear() + '-' + ((data.getMonth() + 1) + '').padStart(2, '0') + '-' + (data.getDate() + '').padStart(2, '0')
}

export function getNowTimeString(){
    let data = new Date()
    return data.getFullYear() + '-' + ((data.getMonth() + 1) + '').padStart(2, '0') + '-' + (data.getDate() + '').padStart(2, '0') + ' ' + (data.getHours() + '').padStart(2, '0') + ':'+ (data.getMinutes() + '').padStart(2, '0') + ':'+ (data.getSeconds() + '').padStart(2, '0')
}

export function getNowDateString(){
    let data = new Date()
    return data.getFullYear() + '-' + ((data.getMonth() + 1) + '').padStart(2, '0') + '-' + (data.getDate() + '').padStart(2, '0')
}

export function getTodayTimeString() {
    let data = new Date()
    return data.getFullYear() + '-' + ((data.getMonth() + 1) + '').padStart(2, '0') + '-' + (data.getDate() + '').padStart(2, '0') + " 00:00:00"
}
