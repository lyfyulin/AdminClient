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
        title: '用户管理',
        key: '/user',
        icon: 'car'
    },
    {
        title: '角色管理',
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
    }
]

export default menuList