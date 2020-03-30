const menulist = [
    {
        title: '首页',
        key: '/home',
        icon: 'home',
    },
    {
        title: '商品',
        key: '/products',
        icon: 'appstore',
        children: [
            {
                title: '品类管理',
                key: '/category',
                icon: 'bars',
            },
            {
                title: '商品管理',
                key: '/product',
                icon: 'tool',
            },
        ]
    },
    {
        title: '用户管理',
        key: '/user',
        icon: 'user'
    },
    {
        title: '角色管理',
        key: '/role',
        icon: 'book'
    },
    {
        title: '图表',
        key: '/charts',
        icon: 'bars',
        children: [
            {
                title: '折线图',
                key: '/line',
                icon: 'line-chart',
            },
            {
                title: '柱状图',
                key: '/bar',
                icon: 'bar-chart',
            },
            {
                title: '扇形图',
                key: '/pie',
                icon: 'pie-chart',
            }
        ]
    },
    {
        title: '订单管理',
        key: '/pie',
        icon: 'pie-chart',
    }
]

export default menulist