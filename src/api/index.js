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


// user
export const reqRoles = () => ajax( base + "/role/list" )

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

export const reqUsers = () => ajax( base + "/user/list" )

export const reqAddUser = ( user ) => ajax.post(
    base + '/insert/user',
    JSON.stringify( {...user} ),
    {
        headers: { "Content-Type": "application/json" }
    }
)

export const reqUpdateUser = ( user ) => ajax.post(
    base  + '/update/user',
    JSON.stringify( { ...user } ),
    {
        headers: { 'Content-Type' : 'application/json' }
    }
)

export const reqDeleteUser = (user_id) => ajax.post( base + '/delete/user', {user_id} )



// car
export const reqCurrentTongqinHotRoad = () => ajax( base + "/car/tongqin/current/hotroad")

export const reqCurrentTongqinHotNode = () => ajax( base + "/car/tongqin/current/hotnode")

export const reqCurrentTongqinRatio = () => ajax( base + "/car/tongqin/today/ratio")

export const reqTongqinRatioSearch = (start_date, end_date) => ajax( base + "/search/car/tongqin/ratio", {
    params: {
        start_date, end_date
    }
} )
	
export const reqTodayOnlineDist = () => ajax( base + "/car/online/today/dist")

export const reqOnlineDistSearch = (start_date, end_date) => ajax( base + "/search/car/online/dist", {
    params: {
        start_date, end_date
    }
} )

export const reqTodayTaxiDist = () => ajax( base + "/car/taxi/today/dist")

export const reqTaxiDistSearch = (start_date, end_date) => ajax( base + "/search/car/taxi/dist", {
    params: {
        start_date, end_date
    }
} )
	
export const reqTodayOnlineVn = () => ajax( base + "/car/online/today/vn")

export const reqLastOnlineVn = () => ajax( base + "/car/online/last/vn")

export const reqOnlineVnSearch = (start_date, end_date) => ajax( base + "/search/car/online/vn", {
    params: {
        start_date, end_date
    }
} )

export const reqTodayTaxiVn = () => ajax( base + "/car/taxi/today/vn")

export const reqLastTaxiVn = () => ajax( base + "/car/taxi/last/vn")

export const reqTaxiVnSearch = (start_date, end_date) => ajax( base + "/search/car/taxi/vn", {
    params: {
        start_date, end_date
    }
} )

export const reqCurrentNodeNonlocalRatio = () => ajax( base + "/car/nonlocal/current/node/ratio")
	
export const reqNodeNonlocalRatioSearch = (start_date, end_date, node_id) => ajax( base + "/search/car/nonlocal/node/ratio", {
    params: {
        start_date, end_date, node_id
    }
} )	

export const reqWeekNonlocalRatio = () => ajax( base + "/car/nonlocal/week/ratio")
	
export const reqCurrentNonlocalRatio = () => ajax( base + "/car/nonlocal/today/ratio")
	
export const reqNonlocalRatioSearch = (start_date, end_date) => ajax( base + "/search/car/nonlocal/ratio", {
    params: {
        start_date, end_date
    }
} )	

export const reqTodayNonlocalVn = () => ajax( base + "/car/nonlocal/today/vn")
	
export const reqNonlocalVnSearch = (start_date, end_date) => ajax( base + "/search/car/nonlocal/vn", {
    params: {
        start_date, end_date
    }
} )	
	
// device
export const reqDevices = () => ajax( base + "//device/list")

export const reqCurrentDevNotMiss = () => ajax( base + "/device/current/each/not_miss_rate")

export const reqDevNotMissSearch = (start_date, end_date, dev_id) => ajax( base + "/search/device/dev/not_miss_rate", {
    params: {
        start_date, end_date, dev_id
    }
} )	

export const reqTodayNotMiss = () => ajax( base + "/device/not_miss_rate")

export const reqNotMissSearch = (start_date, end_date) => ajax( base + "/search/device/not_miss_rate", {
    params: {
        start_date, end_date
    }
} )	

export const reqWeekRcgRate = () => ajax( base + "/device/week/rcg_rate")
	
export const reqTodayRcgRate = () => ajax( base + "/device/rcg_rate")

export const reqRcgRateSearch = (start_date, end_date) => ajax( base + "/search/device/rcg_rate", {
    params: {
        start_date, end_date
    }
} )	

export const reqCurrentDevRcgRate = () => ajax( base + "/device/current/each/rcg_rate")

export const reqTodayDevRcgRate = () => ajax( base + "/device/today/each/rcg_rate")

export const reqDevRcgRateSearch = (start_date, end_date, dev_id) => ajax( base + "/search/device/dev/rcg_rate", {
    params: {
        start_date, end_date, dev_id
    }
} )	


// highway
export const reqRampCarTypeFlow = (direction) => ajax( base + "/ramp/last/car_type/flow", {
    params: {
        direction
    }
} )	

export const reqEnterAwayFlow = (direction) => ajax( base + "/highway/last/enter_and_away/flow", {
    params: {
        direction
    }
} )	

export const reqCarTypeFlow = (direction) => ajax( base + "/highway/last/car_type/flow", {
    params: {
        direction
    }
} )	

export const reqEnterAwayFlowEachHour = (direction) => ajax( base + "/highway/last/enter_ad_away/hour_flow", {
    params: {
        direction
    }
} )	

export const reqCarTypeFlowEachHour = (direction) => ajax( base + "/highway/last/car_type/hour_flow", {
    params: {
        direction
    }
} )	
    
export const reqRampByDirection = (direction) => ajax( base + "/ramp/info", {
    params: {
        direction
    }
} )	

export const reqCountyDev = () => ajax( base + "/county/info")

export const reqCountyNodeName = () => ajax( base + "/county/node/info")
	
export const reqCountyFlow = (node_name, direction) => ajax( base + "/county/today/flow", {
    params: {
        node_name, direction
    }
} )	
	
export const reqPathByPlate = (start_date, end_date, plate) => ajax( base + "/search/path/plate", {
    params: {
        start_date, end_date, plate
    }
} )	

export const reqChangzhuCntsSearch = (start_date, end_date, location, numOfDay, dayOfMonth) => ajax( base + "/search/changzhu/cnts", {
    params: {
        start_date, end_date, location, numOfDay, dayOfMonth
    }
} )	

export const reqChangzhuVn = (start_date, end_date) => ajax( base + "/search/changzhu/vn", {
    params: {
        start_date, end_date
    }
} )	

export const reqUniquePlateCnt = (start_date, end_date) => ajax( base + "/search/unique/plate_num", {
    params: {
        start_date, end_date
    }
} )	



// od
export const reqLastOdTrip = () => ajax( base + "/od/last/trip")

export const reqOdTripSearch = (start_date, end_date) => ajax( base + "/search/od/trip", {
    params: {
        start_date, end_date
    }
} )	

export const reqLastOdTripCount = () => ajax( base + "/od/last/trip/count")

export const reqOdTripCountSearch = (start_date, end_date) => ajax( base + "/search/od/trip/count", {
    params: {
        start_date, end_date
    }
} )	
	
export const reqLastOCnts = () => ajax( base + "/od/last/o_cnts")

export const reqOCntsSearch = (start_date, end_date) => ajax( base + "/search/od/o_cnts", {
    params: {
        start_date, end_date
    }
} )	

export const reqLastDCnts = () => ajax( base + "/od/last/d_cnts")

export const reqDCntsSearch = (start_date, end_date) => ajax( base + "/search/od/d_cnts", {
    params: {
        start_date, end_date
    }
} )	

export const reqLastTripDist = () => ajax( base + "/od/last/trip_dist")

export const reqLastTripTime = () => ajax( base + "/od/last/trip_time")

export const reqLastTripFreq = () => ajax( base + "/od/last/trip_freq")

export const reqLastAvgTripDist = () => ajax( base + "/od/last/avg_trip_dist")

export const reqAvgTripDistSearch = (start_date, end_date) => ajax( base + "/search/od/avg_trip_dist", {
    params: {
        start_date, end_date
    }
} )	

export const reqLastAvgTripTime = () => ajax( base + "/od/last/avg_trip_time")

export const reqAvgTripTimeSearch = (start_date, end_date) => ajax( base + "/search/od/avg_trip_time", {
    params: {
        start_date, end_date
    }
} )	

export const reqLastAvgTripFreq = () => ajax( base + "/od/last/avg_trip_freq")

export const reqAvgTripFreqSearch = (start_date, end_date) => ajax( base + "/search/od/avg_trip_freq", {
    params: {
        start_date, end_date
    }
} )	



// accident
export const reqAccidents = () => ajax( base + "/accident/list")

export const reqAccidentInfo = (accident_id) => ajax( base + "/accident/info", {
    params: {
        accident_id
    }
} )	

export const reqInsertAccident = (accident) => ajax.post( base + "/insert/accident",
    JSON.stringify( {...accident} ),
    {
        headers: { "Content-Type": "application/json" }
    }
)

export const reqUpdateAccident = (accident) => ajax.post( base + "/update/accident",
    JSON.stringify( {...accident} ),
    {
        headers: { "Content-Type": "application/json" }
    }
)

export const reqDeleteAccident = (accident_id) => ajax.post( base + "/delete/accident", {accident_id} )

export const reqAccidentParty = (accident_id) => ajax( base + "/accident/party/info", {accident_id} )

export const reqInsertAccidentParty = (accident_party) => ajax.post( base + "/insert/accident/party",
    JSON.stringify( {...accident_party} ),
    {
        headers: { "Content-Type": "application/json" }
    }
)

export const reqUpdateAccidentParty = (accident_party) => ajax.post( base + "/update/accident/party",
    JSON.stringify( {...accident_party} ),
    {
        headers: { "Content-Type": "application/json" }
    }
)

export const reqDeleteAccidentParty = (party_id) => ajax.post( base + "/delete/accident/party", {party_id} )

export const reqDeleteAllAccidentParty = (accident_id) => ajax.post( base + "/delete/accident/parties", {accident_id} )


// state
export const reqTodayRdnetState = () => ajax( base + "/rdnet/today/avg_speed")

export const reqLastRdnetState = () => ajax( base + "/rdnet/last/avg_speed")

export const reqRdnetStateSearch = (start_date, end_date) => ajax( base + "/search/rdnet/avg_speed", {
    params: {
        start_date, end_date
    }
} )	

export const reqTodayVn = () => ajax( base + "/rdnet/today/vn")

export const reqLastVn = () => ajax( base + "/rdnet/last/vn")

export const reqVnSearch = (start_date, end_date) => ajax( base + "/search/vn", {
    params: {
        start_date, end_date
    }
} )	

export const reqCurrentLinkState = () => ajax( base + "/link/current/state")

export const reqLinkStateSearch = (start_date,  end_date,  link_id) => ajax( base + "/search/link/state", {
    params: {
        start_date, end_date, link_id
    }
} )	

export const reqWeekLinkSpeed = (link_id) => ajax( base + "/link/week/speed", {
    params: {
        link_id
    }
} )	

export const reqCurrentInterDelay = () => ajax( base + "/inter/current/delay")

export const reqInterDelaySearch = (start_date,  end_date, inter_id) => ajax( base + "/search/inter/delay", {
    params: {
        start_date, end_date, inter_id
    }
} )	

export const reqWeekInterDelay = (inter_id) => ajax( base + "/inter/delay/week", {
    params: {
        inter_id
    }
} )	

