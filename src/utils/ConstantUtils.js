export const PAGE_SIZE = 5
export const BASE_IMG = "http://localhost:3005/"
export const IMG_THRESHOLD = 3
export const BASE_MENU = "/home"
export const DIRECTION_LIST = ['东', '南', '西', '北']
export const LANE = [
    { key: 1, title: '直行', value: 'T' },
    { key: 2, title: '左转', value: 'L' },
    { key: 3, title: '右转', value: 'R' },
    { key: 4, title: '直右', value: 'TR' },
    { key: 5, title: '直左', value: 'TL' },
    { key: 6, title: '直左右', value: 'TLR' },
    { key: 7, title: '调头', value: 'U' },
    { key: 8, title: '左转调头', value: 'LU' },
    { key: 9, title: '直行调头', value: 'TU' },
    { key: 10, title: '左右转', value: 'LR' }
]
export const DIRECTION = [
    { key: 1, title: '主道进口车道宽度', value: 'main_entry_width', defaultValue: '3' },
    { key: 2, title: '主道出口车道宽度', value: 'main_entry_width', defaultValue: '3' },
    { key: 3, title: '辅道进口车道宽度', value: 'main_entry_width', defaultValue: '3' },
    { key: 4, title: '辅道出口车道宽度', value: 'main_entry_width', defaultValue: '3' },
    { key: 5, title: '进口非机动车道宽度', value: 'main_entry_width', defaultValue: '2' },
    { key: 6, title: '出口非机动车道宽度', value: 'main_entry_width', defaultValue: '2' },
    { key: 7, title: '进口道渠化方式', value: 'main_entry_width', defaultValue: '1', children: [
        { key: 1, title: '分隔线', value: '1' },
        { key: 2, title: '分隔栏', value: '2' },
        { key: 3, title: '分隔带', value: '3' },
    ] },
    { key: 8, title: '中央分隔宽度', value: 'median_width', defaultValue: '2' },
    { key: 9, title: '主辅分隔方式', value: 'main_sub_type', defaultValue: '1', children: [
        { key: 1, title: '分隔线', value: '1' },
        { key: 2, title: '分隔栏', value: '2' },
        { key: 3, title: '分隔带', value: '3' },
    ] },
    { key: 10, title: '主辅分隔宽度', value: 'main_sub_width', defaultValue: '2' },
    { key: 11, title: '机非分隔方式', value: 'separation_type', defaultValue: '1', children: [
        { key: 1, title: '分隔线', value: '1' },
        { key: 2, title: '分隔栏', value: '2' },
        { key: 3, title: '分隔带', value: '3' },
    ] },
    { key: 12, title: '机非分隔宽度', value: 'separation_width', defaultValue: '2' },
    { key: 13, title: '提前右转距停车线距离', value: 'right2stop_length', defaultValue: '30' },
    { key: 14, title: '渠化长度', value: 'channelized_length', defaultValue: '50' },
    { key: 15, title: '待行区长度', value: 'left_wait_length', defaultValue: '6' },

]