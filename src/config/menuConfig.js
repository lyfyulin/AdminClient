const menuList = [
    {
        title: '首页',
        key: '/home',
        icon: 'home',
        public: true,
    },
    {
        title: '数据中心',
        key: '/products',
        icon: 'database',
        children: [
            {
                title: '路网数据',
                key: '/category',
                icon: 'table',
            },
            {
                title: '结构化数据',
                key: '/product',
                icon: 'video-camera',
            },
        ]
    },
    {
        title: '信号控制',
        key: '/user',
        icon: 'car'
    },
    {
        title: '信号评价',
        key: '/role',
        icon: 'area-chart'
    },
    {
        title: '堵点治理',
        key: '/charts',
        icon: 'alert',
        children: [
            {
                title: '拥堵交叉口',
                key: '/charts/interstate',
                icon: 'plus',
            },
            {
                title: '拥堵路段',
                key: '/charts/roadstate',
                icon: 'pause',
            },
            {
                title: '拥堵区域',
                key: '/charts/areastate',
                icon: 'number',
            }
        ]
    },
    {
        title: '交叉口管理',
        key: '/intersection',
        icon: 'area-chart'
    },
    {
        title: '路段管理',
        key: '/link',
        icon: 'area-chart'
    },
    {
        title: '流量管理',
        key: '/flow-info',
        icon: 'area-chart'
    },
    {
        title: '设备管理',
        key: '/device-info',
        icon: 'area-chart'
    },
    {
        title: '信号管理',
        key: '/signal-info',
        icon: 'area-chart'
    },
    {
        title: '事故处理',
        key: '/accidents',
        icon: 'area-chart'
    },
]

export default menuList