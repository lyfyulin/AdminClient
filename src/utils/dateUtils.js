export function formatDate(time){
    if(!time) return '';
    let data = new Date(time)
    return data.getFullYear() + '-' + ((data.getMonth() + 1) + '').padStart(2, '0') + '-' + data.getDate() + ' ' + (data.getHours() + '').padStart(2, '0') + ':'+ (data.getMinutes() + '').padStart(2, '0') + ':'+ (data.getSeconds() + '').padStart(2, '0')
}