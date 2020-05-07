
# 保山 数据平台 数据库操作

-- to_date('2020-04-19', 'yyyy-mm-dd') 换为 sysdate
-- 缺少数据表
    data_miss_rate_4
    data_rcg_rate_all
    data_rcg_rate_dev
    quxian_device
    vehicle_foreign_ratio_node
    state_intersection_t3
    distinct_num
    dahua.picrecord

-- 缺少数据表 伪造

- 表1 data_miss_rate_4
create table data_miss_rate_4 as
select time_point, dev_id, not_miss_rate
from report_data_miss_lot_t1;

- 表2 data_rcg_rate_all
create table data_rcg_rate_all as
select  time_point, cnt_all, rcg_rate from report_data_rcg_low_t1;

- 表3 data_rcg_rate_dev
create table data_rcg_rate_dev as
select  time_point, dev_id, cnt_all, rcg_rate from report_data_rcg_low_t1;

- 表4 quxian_device

drop table quxian_device purge;
create table quxian_device(
    node_name varchar2(100),
    dev_name varchar2(100),
    dev_id varchar2(20),
    bdlng number(13,10),
    bdlat number(13,10),
    direction number(2)
);
select * from quxian_device;
insert into quxian_device values ('龙陵-芒市', '龙陵二关（芒市方向）', '1000690', 98.67998335, 24.57446489, 1);
insert into quxian_device values ('龙陵-芒市', '龙陵二关（龙陵方向）', '1000680', 98.67998335, 24.57446489, 2);
insert into quxian_device values ('隆阳区-大理/六库', '隆阳区瓦窑沙坝（六库方向）', '1000696', 99.21150649, 25.4962549, 2);
insert into quxian_device values ('隆阳区-大理/六库', '隆阳区瓦窑沙坝(瓦窑方向)', '1000695', 99.21150649, 25.4962549, 1);
insert into quxian_device values ('芒宽-六库', '丙瑞线K347十700M瑞丽方向（卡口）', '1000354', 98.872652, 25.369139, 2);
insert into quxian_device values ('芒宽-六库', '丙瑞线K347十700M六库方向（卡口）', '1000355', 98.872652, 25.369139, 1);
insert into quxian_device values ('昌宁-云县（九甲小河边）', '昌宁九甲小河边（临沧方向）', '1000013@004', 99.646666, 24.787416, 2);
insert into quxian_device values ('昌宁-云县（九甲小河边）', '昌宁九甲小河边（昌宁方向）', '1000014@004', 99.646666, 24.787416, 1);
insert into quxian_device values ('昌宁-云县（温泉大桥社）', '昌宁温泉大桥社（昌宁方向）', '1000167@004', 99.692823, 24.716196, 2);
insert into quxian_device values ('昌宁-云县（温泉大桥社）', '昌宁温泉大桥社（临沧方向）', '1000168@004', 99.692823, 24.716196, 1);

- 表5 vehicle_foreign_ratio_node
create table vehicle_foreign_ratio_node as
select time_point, inter_id node_id, cnt_day cnt_all, avg_delay/300 foreign_ratio  
from report_inter_delay_t4;

- 表6 state_intersection_t3
create table state_intersection_t3 as
select time_point, inter_id, cnt_day cnt, avg_delay from report_inter_delay_t4;

- 表7 distinct_num
create table distinct_num as
select time_point, cnt_all cnt from report_data_line_rcg_miss;

- 表8 dahua.picrecord               云MT0019 一辆车
create table  tmp_picrecord as
select * from baoshan_data_2019
where car_num = '云MT0019';

登录dahua
create table picrecord as
select cap_date, dev_id, car_num, to_char(cap_date, 'yyyymmdd') cap_day from gyorcl.tmp_picrecord;
select * from picrecord;

登录zju
create table device_import as
select * from gyorcl.device_import;

```xml
-- 1.交通运行状态   (路网/路段/路口)
-- 1.1 路网

-- 今日 路网 速度               /rdnet/today/avg_speed
<select id="getTodayRdnetState" resultType="java.util.HashMap">
select speed
from avg_speed
where time_point >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd')
order by time_point
</select>

-- 上周同期 路网 速度           /rdnet/last/avg_speed
<select id="getLastRdnetState" resultType="java.util.HashMap">
select speed
from avg_speed
where time_point >= trunc(to_date('2020-04-19', 'yyyy-mm-dd') - 7, 'dd')
and time_point < trunc(to_date('2020-04-19', 'yyyy-mm-dd') - 6, 'dd')
order by time_point
</select>

-- 检索路网速度                 /search/rdnet/avg_speed
<select id="getRdnetStateSearch" resultType="java.util.HashMap">
select time_point, speed
from avg_speed
where time_point >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
order by time_point
</select>

-- 今日 路网 在途车辆数         /rdnet/today/vn
<select id="getTodayVn" resultType="java.util.HashMap">
select all_num
from vehicle_num
where time_point >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd')
order by time_point
</select>

-- 上周同期 路网 在途车辆数     /rdnet/last/vn
<select id="getLastVn" resultType="java.util.HashMap">
select all_num
from vehicle_num
where time_point >= trunc(to_date('2020-04-19', 'yyyy-mm-dd') - 7, 'dd')
and time_point < trunc(to_date('2020-04-19', 'yyyy-mm-dd') - 6, 'dd')
order by time_point
</select>

-- 检索 路网 在途车辆数         /search/vn
<select id="getVnSearch" resultType="java.util.HashMap">
select all_num
from vehicle_num
where time_point >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
order by time_point
</select>

-- 1.2 路段

-- 当前 link 状态       /link/current/state
<select id="getCurrentLinkState" resultType="java.util.HashMap">
select link_id, stateindex, speed
from link_state
where time_point = (select max(time_point) from link_state)
order by link_id
</select>

-- 检索 link 状态       /search/link/state?link_id=1
<select id="getLinkStateSearch" resultType="java.util.HashMap">
select time_point, stateindex state, speed
from link_state
where link_id = #{link_id}
and time_point >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
order by time_point
</select>

-- 一周内 同时段 link 的速度状态       /link/week/speed?link_id=1
<select id="getWeekLinkSpeed" resultType="java.util.HashMap">
select to_char(time_point, 'd') as day_id, nvl(speed, 28) as speed
from
(
    select *
    from link_state
    where link_id = #{link_id}
    and to_char(time_point, 'hh24:mi') = (select to_char(max(time_point), 'hh24:mi') from link_state)
    and time_point between trunc(to_date('2020-04-19', 'yyyy-mm-dd')-6, 'dd') and to_date('2020-04-19', 'yyyy-mm-dd')
    order by time_point
)
</select>

-- 1.3 路口

-- 当前 路口延误                /inter/current/delay
<select id="getCurrentInterDelay" resultType="java.util.HashMap">
select inter_id, avg_delay
from state_intersection_t3
where time_point=(select max(time_point) from state_intersection_t3)
order by inter_id
</select>

-- 检索 路口延误                /search/inter/delay?inter_id=1
<select id="getInterDelaySearch" resultType="java.util.HashMap">
select time_point, avg_delay
from state_intersection_t3
where inter_id = #{inter_id}
and time_point >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
order by time_point
</select>

-- 一周内 路口 的延误           /inter/delay/week?inter_id=1
<select id="getWeekInterDelay" resultType="java.util.HashMap">
select to_char(time_point-1, 'd') as day_id, nvl(avg_delay, 0) as delay
from
(
    select *
    from  state_intersection_t3
    where inter_id = #{inter_id}
    and to_char(time_point, 'hh24:mi') = (select to_char(max(time_point), 'hh24:mi') from state_intersection_t3)
    and time_point between trunc(to_date('2020-04-19', 'yyyy-mm-dd')-6, 'dd') and to_date('2020-04-19', 'yyyy-mm-dd')
    order by time_point
)
</select>

-- 2.主题车辆       (通勤/出租/网约/外地)
-- 2.1 通勤车辆

-- 当前 通勤车 热点路段             /car/tongqin/current/hotroad
<select id="getCurrentTongqinHotRoad" resultType="java.util.HashMap">
select link_id, cnt, rn from vehicle_tongqin_hotroad_t2
where time_point = (select max(time_point) from vehicle_tongqin_hotroad_t2)
and link_id < 121
order by rn
</select>

-- 当前 通勤车 热点点位             /car/tongqin/current/hotnode
<select id="getCurrentTongqinHotNode" resultType="java.util.HashMap">
select node_id, cnt_all
from vehicle_tongqin_ratio_node
where time_point = (select max(time_point) from vehicle_tongqin_ratio_node)
order by cnt_all
</select>

-- 今日 通勤车 比例                 /car/tongqin/today/ratio
<select id="getCurrentTongqinRatio" resultType="java.util.HashMap">
select round(tongqin_ratio, 2) tongqin_ratio
from vehicle_tongqin_ratio_all
where time_point >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and time_point < trunc( to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd' )
order by time_point
</select>

-- 检索 通勤车 比例                 /search/car/tongqin/ratio
<select id="getTongqinRatioSearch" resultType="java.util.HashMap">
select time_point, round(tongqin_ratio, 2) tongqin_ratio
from vehicle_tongqin_ratio_all
where time_point >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and time_point < trunc( to_date(#{end_date}, 'yyyy-mm-dd'), 'dd' )
order by time_point
</select>

-- 2.2 出租车
-- 今日 网约车 车公里数             /car/online/today/dist
<select id="getTodayOnlineDist" resultType="java.util.HashMap">
select trunc(carhailing_km/1000, 0) carhailing_km
from vehicle_km_like_taxi
where time_point >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd')
and carhailing_km is not null
order by time_point
</select>

-- 检索 网约车 车公里数             /search/car/online/dist
<select id="getOnlineDistSearch" resultType="java.util.HashMap">
select time_point, trunc(carhailing_km/1000, 0) carhailing_km
from vehicle_km_like_taxi
where time_point >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
and carhailing_km is not null
order by time_point
</select>

-- 今日 出租车 车公里数             /car/taxi/today/dist
<select id="getTodayTaxiDist" resultType="java.util.HashMap">
select trunc(taxi_km/1000, 0) taxi_km
from vehicle_km_like_taxi
where time_point >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd')
and taxi_km is not null
order by time_point
</select>

-- 检索 出租车 车公里数             /search/car/taxi/dist
<select id="getTaxiDistSearch" resultType="java.util.HashMap">
select time_point, trunc(taxi_km/1000, 0) taxi_km
from vehicle_km_like_taxi
where time_point >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
and taxi_km is not null
order by time_point
</select>

-- 今日 网约车 在途量               /car/online/today/vn
<select id="getTodayOnlineVn" resultType="java.util.HashMap">
select carhailing_num
from vehicle_num_like_taxi
where time_point >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd')
order by time_point
</select>

-- 上周同期 网约车 在途量           /car/online/last/vn
<select id="getLastOnlineVn" resultType="java.util.HashMap">
select carhailing_num
from vehicle_num_like_taxi
where time_point between trunc(to_date('2020-04-19', 'yyyy-mm-dd')-7, 'dd') and trunc(to_date('2020-04-19', 'yyyy-mm-dd')-6, 'dd')
order by time_point
</select>

-- 检索 网约车 在途量           /search/car/online/vn
<select id="getOnlineVnSearch" resultType="java.util.HashMap">
select time_point, carhailing_num
from vehicle_num_like_taxi
where time_point >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
order by time_point
</select>

-- 今日 出租车 在途量               /car/taxi/today/vn
<select id="getTodayTaxiVn" resultType="java.util.HashMap">
select taxi_num
from vehicle_num_like_taxi
where time_point >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd')
order by time_point
</select>

-- 上周同期 出租车 在途量           /car/taxi/last/vn
<select id="getLastTaxiVn" resultType="java.util.HashMap">
select taxi_num
from vehicle_num_like_taxi
where time_point between trunc(to_date('2020-04-19', 'yyyy-mm-dd')-7, 'dd') and trunc(to_date('2020-04-19', 'yyyy-mm-dd')-6, 'dd')
order by time_point
</select>

-- 检索 出租车 在途量               /search/car/taxi/vn
<select id="getTaxiVnSearch" resultType="java.util.HashMap">
select time_point, taxi_num
from vehicle_num_like_taxi
where time_point >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
order by time_point
</select>

-- 2.3 外地车
-- 当前 各点位 外地车 比例          /car/nonlocal/current/node/ratio
<select id="getCurrentNodeNonlocalRatio" resultType="java.util.HashMap">
select  node_id, round(foreign_ratio, 2) foreign_ratio
from
(
    select *
    from vehicle_foreign_ratio_node
    where time_point=(select max(time_point) from vehicle_foreign_ratio_node)
    order by cnt_all desc
)
order by node_id
</select>

-- 检索 某点位 外地车 比例           /search/car/nonlocal/node/ratio?node_id=1
<select id="getNodeNonlocalRatioSearch" resultType="java.util.HashMap">
select time_point, round(foreign_ratio, 2) foreign_ratio
from vehicle_foreign_ratio_node
where time_point >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
and node_id = #{node_id}
order by time_point
</select>

-- 近一周 外地车 比例               /car/nonlocal/week/ratio
<select id="getWeekNonlocalRatio" resultType="java.util.HashMap">
select to_char(time_point-1, 'd') as day_id, round(foreign_ratio, 2) foreign_ratio
from
(
    select *
    from vehicle_foreign_ratio_all_2
    where time_point between trunc(to_date('2020-04-19', 'yyyy-mm-dd')-6, 'dd') and trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
    order by time_point
)
</select>

-- 今日 外地车 比例                 /car/nonlocal/today/ratio
<select id="getCurrentNonlocalRatio" resultType="java.util.HashMap">
select round(foreign_ratio, 2) foreign_ratio
from vehicle_foreign_ratio_all_1
where time_point >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd')
order by time_point
</select>

-- 检索 外地车 比例                 /search/car/nonlocal/ratio
<select id="getNonlocalRatioSearch" resultType="java.util.HashMap">
select time_point, round(foreign_ratio, 2) foreign_ratio
from vehicle_foreign_ratio_all_1
where time_point >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
order by time_point
</select>

-- 今日 外地车 在途量                 /car/nonlocal/today/vn
<select id="getTodayNonlocalVn" resultType="java.util.HashMap">
select foreign_num
from vehicle_num
where time_point >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd')
order by time_point
</select>

-- 检索 外地车 在途量                 /search/car/nonlocal/vn
<select id="getNonlocalVnSearch" resultType="java.util.HashMap">
select time_point, foreign_num
from vehicle_num
where time_point >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
order by time_point
</select>


-- 3.机动车出行     (出行量/出行分布/出行特征)

-- 昨日 机动车 出行分布             /od/last/trip
<select id="getLastOdTrip" resultType="java.util.HashMap">
select o_node, d_node, sum(cnt) as cnts
from od_4
where start_time >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and start_time < trunc(to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd')
and cnt  > 300
group by o_node, d_node
order by 1, 2
</select>

-- 检索 机动车 出行分布             /search/od/trip
<select id="getOdTripSearch" resultType="java.util.HashMap">
select trunc(start_time, 'dd') time_point, o_node, d_node, sum(cnt) as cnts
from od_4
where start_time >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and start_time < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
and cnt  > 300
group by trunc(start_time, 'dd'), o_node, d_node
order by 1, 2, 3
</select>

-- 昨日 机动车 出行总量           /od/last/trip/count
<select id="getLastOdTripCount" resultType="java.util.HashMap">
select trunc(start_time, 'dd') time_point, sum(cnt) cnts
from od_4
where start_time >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and start_time < trunc(to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd')
group by trunc(start_time, 'dd')
order by 1
</select>


-- 检索 机动车 出行总量             /search/od/trip/count
<select id="getOdTripCountSearch" resultType="java.util.HashMap">
select trunc(start_time, 'dd') time_point, sum(cnt) cnts
from od_4
where start_time >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and start_time < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
group by trunc(start_time, 'dd')
order by 1
</select>

-- 昨日 发生量                      /od/last/o_cnts
<select id="getLastOCnts" resultType="java.util.HashMap">
select o_node, sum(cnt) as cnts
from od_4
where start_time >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and start_time < trunc(to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd')
group by o_node
order by 2 desc
</select>

-- 检索 发生量                     /search/od/o_cnts
<select id="getOCntsSearch" resultType="java.util.HashMap">
select trunc(start_time, 'dd') time_point, o_node, sum(cnt) as cnts
from od_4
where start_time >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and start_time < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
group by trunc(start_time, 'dd'), o_node
order by 1, 2
</select>

-- 昨日 吸引量                      /od/last/d_cnts
<select id="getLastDCnts" resultType="java.util.HashMap">
select d_node, sum(cnt) as cnts
from od_4
where start_time >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and start_time < trunc(to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd')
group by d_node
order by 2 desc
</select>

-- 检索 吸引量                     /search/od/d_cnts
<select id="getDCntsSearch" resultType="java.util.HashMap">
select trunc(start_time, 'dd') time_point, d_node, sum(cnt) as cnts
from od_4
where start_time >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and start_time < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
group by trunc(start_time, 'dd'), d_node
order by 1, 2
</select>

-- 昨日 出行距离 分布                    /od/last/trip_dist
<select id="getLastTripDist" resultType="java.util.HashMap">
select travel_dis as trip_dist, cnt
from od_7
where time_point >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd')
order by 1
</select>

-- 昨日 出行时长 分布                   /od/last/trip_time
<select id="getLastTripTime" resultType="java.util.HashMap">
select trunc(travel_time/60) as trip_time, cnt
from od_6
where time_point >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd')
order by 1
</select>

-- 昨日 出行次数 分布                   /od/last/trip_freq
<select id="getLastTripFreq" resultType="java.util.HashMap">
select travel_cnt as trip_freq, cnt
from od_5
where time_point >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd')
order by 1
</select>

-- 昨日 平均出行距离                /od/last/avg_trip_dist
<select id="getLastAvgTripDist" resultType="java.util.HashMap">
select trunc(sum(travel_dis*cnt)/sum(cnt)/1000, 2) avg_trip_dist
from od_7
where time_point >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd')
</select>

-- 检索 平均出行距离                /search/od/avg_trip_dist
<select id="getAvgTripDistSearch" resultType="java.util.HashMap">
select trunc(time_point, 'dd') time_point, trunc(sum(travel_dis*cnt)/sum(cnt)/1000, 2) avg_trip_dist
from od_7
where time_point >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
group by trunc(time_point, 'dd')
order by 1
</select>

-- 昨日 平均出行时长                /od/last/avg_trip_time
<select id="getLastAvgTripTime" resultType="java.util.HashMap">
select trunc(sum(travel_time*cnt)/sum(cnt)/60, 2) avg_trip_time
from od_6
where time_point >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd')
</select>

-- 检索 平均出行时长                /search/od/avg_trip_time
<select id="getAvgTripTimeSearch" resultType="java.util.HashMap">
select trunc(time_point, 'dd') time_point, trunc(sum(travel_time*cnt)/sum(cnt)/60, 2) avg_trip_time
from od_6
where time_point >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
group by trunc(time_point, 'dd')
order by 1
</select>

-- 昨日 平均出行次数                /od/last/avg_trip_freq
<select id="getLastAvgTripFreq" resultType="java.util.HashMap">
select trunc(sum(travel_cnt*cnt)/sum(cnt), 2) avg_trip_freq
from od_5
where time_point >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd')
</select>

-- 检索 平均出行次数                /search/od/avg_trip_freq
<select id="getAvgTripFreqSearch" resultType="java.util.HashMap">
select trunc(time_point, 'dd') time_point, trunc(sum(travel_cnt*cnt)/sum(cnt), 2) avg_trip_freq
from od_5
where time_point >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
group by trunc(time_point, 'dd')
order by 1
</select>



-- 4.设备信息       (设备状态/识别率/传输率)

-- 设备列表                       /device/list
<select id="getDevices" resultType="java.util.HashMap">
select 设备位置 locations, node_name, dev_name, ip_address, dev_id, bdlng, bdlat, 拍摄角度 angle
from device_import
where dev_id < 9999999
</select>

-- 当前 各设备 传输完整率           /device/current/each/not_miss_rate
<select id="getCurrentDevNotMiss" resultType="java.util.HashMap">
select dev_id, trunc(not_miss_rate, 4) not_miss_rate
from data_miss_rate_4
where dev_id < 9999999
and time_point = (select max(time_point) from data_miss_rate_4)
order by 2
</select>

-- 检索 某设备 传输完整率           /search/device/dev/not_miss_rate
<select id="getDevNotMissSearch" resultType="java.util.HashMap">
select dev_id, trunc(not_miss_rate, 4) not_miss_rate
from data_miss_rate_4
where time_point >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
and dev_id = #{dev_id}
order by 2
</select>

-- 今日 设备总体 传输完整率         /device/not_miss_rate
<select id="getTodayNotMiss" resultType="java.util.HashMap">
select time_point, round(avg(not_miss_rate), 2) not_miss_rate
from data_miss_rate_4
where time_point >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd')
group by time_point
order by 1
</select>

-- 检索 设备总体 传输完整率         /search/device/not_miss_rate
<select id="getNotMissSearch" resultType="java.util.HashMap">
select time_point, round(avg(not_miss_rate), 2) not_miss_rate
from data_miss_rate_4
where time_point >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
group by time_point
order by 1
</select>

-- 近一周 设备总体 识别率           /device/week/rcg_rate
<select id="getWeekRcgRate" resultType="java.util.HashMap">
select day_id, avg(a.rcg_rate) as rate
from
(
    SELECT to_char(time_point-1, 'D') as day_id, trunc(TIME_POINT) as time_point, RCG_RATE
    FROM data_rcg_rate_all
    where time_point between trunc(to_date('2020-04-19', 'yyyy-mm-dd')-6, 'dd') and trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
    order by time_point
) a
group by day_id, time_point
order by time_point
</select>

-- 今日 设备总体 识别率         /device/rcg_rate
<select id="getTodayRcgRate" resultType="java.util.HashMap">
select time_point, round(rcg_rate, 2) rcg_rate
from data_rcg_rate_all
where time_point >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd')
order by time_point
</select>

-- 检索 设备总体 识别率         /search/device/rcg_rate
<select id="getRcgRateSearch" resultType="java.util.HashMap">
select time_point, round(rcg_rate, 2) rcg_rate
from data_rcg_rate_all
where time_point >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
order by time_point
</select>


-- 当前 各设备 识别率           /device/current/each/rcg_rate
<select id="getCurrentDevRcgRate" resultType="java.util.HashMap">
select dev_id, trunc(rcg_rate, 4) rcg_rate
from data_rcg_rate_dev
where time_point = (select max(time_point) from data_rcg_rate_dev)
and dev_id < 9999999
order by rcg_rate
</select>

-- 今日 各设备 识别率           /device/today/each/rcg_rate
<select id="getTodayDevRcgRate" resultType="java.util.HashMap">
select to_char(time_point, 'hh24:mi') as time_point, dev_id, trunc(nvl(rcg_rate, 0), 4) as rate
from data_rcg_rate_dev
where dev_id < 9999999
and time_point >= trunc(to_date('2020-04-19', 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date('2020-04-19', 'yyyy-mm-dd') + 1, 'dd')
order by time_point, dev_id
</select>

-- 检索 某设备 识别率           /search/device/dev/rcg_rate
<select id="getDevRcgRateSearch" resultType="java.util.HashMap">
select time_point, trunc(rcg_rate, 4) rcg_rate
from data_rcg_rate_dev
where time_point >= trunc(to_date(#{start_date}, 'yyyy-mm-dd'), 'dd')
and time_point < trunc(to_date(#{end_date}, 'yyyy-mm-dd'), 'dd')
and dev_id = #{dev_id}
order by time_point
</select>


-- 5.交通安全       (事故录入/事故查询)

- 创建事故表
```mysql
drop table  if exists bs_traffic_accident;
create table bs_traffic_accident (
    accident_id int NOT NULL AUTO_INCREMENT COMMENT '事故编号(主键自增)',
    police_id int not null COMMENT '负责民警',
    accident_time datetime not null COMMENT '事故时间',
    accident_gpsx_gpsy varchar(20) COMMENT '事故经纬度',
    accident_location varchar(50) COMMENT '事故地点',
    accident_specific_location int COMMENT '事故具体位置(1-路口中央;2-路口进口处;3-路口出口处;4-右转弯处;5-机动车道处;6-非机动车道处;7-人行道处;8-单位小区或小支路开口处;9-道路渐变段（100米内车道增加或较少）;10-中央分隔带;11-机非隔离带;12-单位小区内部道路;13-停车场内部;14-村道乡道)',
    climate int COMMENT '天气(1-晴;2-阴;3-雨;4-雪;5-雾;6-大风;7-沙尘;8-冰雹;9-其它)',
    road_condition int COMMENT '道路条件(1-普通道路;2-高架;3-桥梁;4-隧道;5-匝道;6-长下坡;7-陡坡;8-急转弯;9-施工路段;10-结冰路面;11-湿滑路面;12-其他描述)',
    accident_pattern int COMMENT '事故形态(1-碰撞运动车辆;2-碰撞静止车辆;3-其他车辆事故;4-刮撞行人;5-碾压行人;6-碰撞碾压行人;7-侧翻;8-滚翻;9-坠车;10-失火;11-撞固定物;12-撞非固定物;13-乘员跌落或抛出)',
    accident_type int COMMENT '事故类型(1-机动车追尾机动车;2-机动车追尾停驶车辆;3-机动车同向刮擦;4-机动车对向刮擦;5-机动车违反车道行驶发生碰撞;6-机动车正面碰撞;7-机动车直角碰撞;8-机动车撞非机动车;9-机动车撞行人;10-机动车撞固定物;11-机动车侧翻;12-多车事故;13-非机动车撞固定物;14-非机动车撞非机动车;15-非机动车撞行人;16-非机动车撞停驶车辆;17-非机动车单车事故)',
    light_condition int COMMENT '照明条件(1-灯光无影响;2-灯光干扰;3-灯光过暗)',
    sign_marking_condition int COMMENT '标志标线条件(1:标志标线完整清晰;2-标志标线不一致;;3-标线残缺模糊;4-标志提醒缺失)',
    primary key (accident_id)
) COMMENT '交通事故表';

drop table  if exists bs_traffic_accident_party;
create table bs_traffic_accident_party(
    party_id int NOT NULL AUTO_INCREMENT COMMENT '事故当事人(主键自增)',
    accident_id int COMMENT '事故编号',
    is_presence int COMMENT '是否在场',
    party_name varchar(10) COMMENT '姓名',
    id_card varchar(18) COMMENT '身份证号',
    trip_mode int COMMENT '出行方式(1-小客车;2-非机动车;3-自行车;4-行人;5-大货车;6-大客车;7-小货车)',
    plate_number varchar(12) COMMENT '车牌号码',
    is_breakdown int default 1 COMMENT '车辆是否故障(1-无故障;2-故障)',
    illegal_behavior int default 1 COMMENT '违法行为(1-无;2-闯红灯;3-酒驾醉驾;4-无证驾驶;5-超速行驶;6-违停;7-占用非机动车道;8-占用对向车道;9-占用人行道;10-占用机动车道;11-逆行;12-随意横穿马路)',
    car_damage int default 1 COMMENT '车损情况(1-无;2-轻微车损;3-严重车损)',
    minor_injure int default 0 COMMENT '轻伤人数',
    serious_injure int default 0 COMMENT '重伤人数',
    death int default 0 COMMENT '死亡人数',
    primary key (party_id)
) COMMENT '事故当事人表';
```

```oracle
-- 创建序列
drop sequence bs_accident_id_seq;
create sequence bs_accident_id_seq
minvalue 1
nomaxvalue
start with 1
increment by 1
nocycle
nocache;

drop sequence bs_accident_party_id_seq;
create sequence bs_accident_party_id_seq
minvalue 1
nomaxvalue
start with 1
increment by 1
nocycle
nocache;

drop table bs_traffic_accident purge;
create table bs_traffic_accident (
    accident_id int NOT NULL,
    police_id int not null,
    accident_time date default sysdate,
    accident_gpsx_gpsy varchar2(20) not null,
    accident_location varchar2(50),
    accident_specific_location int,
    climate int,
    road_condition int,
    accident_pattern int,
    accident_type int,
    light_condition int,
    sign_marking_condition int
);

drop table bs_traffic_accident_party;
create table bs_traffic_accident_party(
    party_id int NOT NULL,
    accident_id int,
    is_presence int,
    party_name varchar(10),
    id_card varchar2(18),
    trip_mode int,
    plate_number varchar2(12),
    is_breakdown int default 1,
    illegal_behavior int default 1,
    car_damage int default 1,
    minor_injure int default 0,
    serious_injure int default 0,
    death int default 0
);
```

```xml
-- 事故列表         /accident/list
<select id="getAccidents" resultType="java.util.HashMap">
select * from bs_traffic_accident
</select>

-- 检索事故         /accident/info
<select id="getAccidentInfo" resultType="java.util.HashMap">
select * from bs_traffic_accident where accident_id = #{accident_id}
</select>

-- 添加事故         /insert/accident
<insert id="insertAccident">
insert into bs_traffic_accident (
    accident_id,
    police_id,
    accident_gpsx_gpsy,
    accident_location,
    accident_specific_location,
    climate,
    road_condition,
    accident_pattern,
    accident_type,
    light_condition,
    sign_marking_condition
)
values (
    bs_accident_id_seq.nextval, #{police_id}, #{accident_gpsx_gpsy},
    #{accident_location}, #{accident_specific_location}, #{climate}, #{road_condition},
    #{accident_pattern}, #{accident_type}, #{light_condition}, #{sign_marking_condition}
)
</insert>

-- 修改事故         /update/accident
<update id="updateAccident">
update bs_traffic_accident
    <trim suffixOverrides=",">
        <set>
            <if test="police_id != null and police_id != ''">
                police_id = #{police_id},
            </if>
            <if test="accident_gpsx_gpsy != null and accident_gpsx_gpsy != ''">
                accident_gpsx_gpsy = #{accident_gpsx_gpsy},
            </if>
            <if test="accident_location != null and accident_location != ''">
                accident_location = #{accident_location},
            </if>
            <if test="accident_specific_location != null and accident_specific_location != ''">
                accident_specific_location = #{accident_specific_location},
            </if>
            <if test="climate != null and climate != ''">
                climate = #{climate},
            </if>
            <if test="road_condition != null and road_condition != ''">
                road_condition = #{road_condition},
            </if>
            <if test="accident_pattern != null and accident_pattern != ''">
                accident_pattern = #{accident_pattern},
            </if>
            <if test="accident_type != null and accident_type != ''">
                accident_type = #{accident_type},
            </if>
            <if test="light_condition != null and light_condition != ''">
                light_condition = #{light_condition},
            </if>
            <if test="sign_marking_condition != null and sign_marking_condition != ''">
                sign_marking_condition = #{sign_marking_condition},
            </if>
        </set>
    </trim>
    where accident_id = #{accident_id}
</update>

-- 删除事故         /delete/accident
<delete id="deleteAccident">
delete from bs_traffic_accident where accident_id = #{accident_id}
</delete>

-- 查询事故当事人           /accident/party/info
<select id="getAccidentParty" resultType="java.util.HashMap">
select * from bs_traffic_accident_party
where accident_id = #{accident_id}
</select>

-- 添加事故当事人           /insert/accident/party
<insert id="insertAccidentParty">
insert into bs_traffic_accident_party(
    party_id,
    accident_id,
    is_presence,
    party_name,
    id_card,
    trip_mode,
    plate_number,
    is_breakdown,
    illegal_behavior,
    car_damage,
    minor_injure,
    serious_injure,
    death
) values (
    bs_accident_party_id_seq.nextval, #{accident_id}, #{is_presence}, #{party_name}, #{id_card}, #{trip_mode},
    #{plate_number}, #{is_breakdown}, #{illegal_behavior}, #{car_damage}, #{minor_injure}, #{serious_injure}, #{death}
)
</insert>

-- 修改事故当事人               /update/accident/party
<update id="updateAccidentParty">
update bs_traffic_accident_party
    <trim suffixOverrides=",">
        <set>
            <if test="accident_id != null and accident_id != ''">
                accident_id = #{accident_id},
            </if>
            <if test="is_presence != null and is_presence != ''">
                is_presence = #{is_presence},
            </if>
            <if test="party_name != null and party_name != ''">
                party_name = #{party_name},
            </if>
            <if test="id_card != null and id_card != ''">
                id_card = #{id_card},
            </if>
            <if test="trip_mode != null and trip_mode != ''">
                trip_mode = #{trip_mode},
            </if>
            <if test="plate_number != null and plate_number != ''">
                plate_number = #{plate_number},
            </if>
            <if test="is_breakdown != null and is_breakdown != ''">
                is_breakdown = #{is_breakdown},
            </if>
            <if test="illegal_behavior != null and illegal_behavior != ''">
                illegal_behavior = #{illegal_behavior},
            </if>
            <if test="car_damage != null and car_damage != ''">
                car_damage = #{car_damage},
            </if>
            <if test="minor_injure != null and minor_injure != ''">
                minor_injure = #{minor_injure},
            </if>
            <if test="serious_injure != null and serious_injure != ''">
                serious_injure = #{serious_injure},
            </if>
            <if test="death != null and death != ''">
                death = #{death},
            </if>
        </set>
    </trim>
    where bs_traffic_accident_party = #{bs_traffic_accident_party}
</update>

-- 删除事故当事人                   /delete/accident/party
<delete id="deleteAccidentParty">
delete from bs_traffic_accident_party where party_id = #{party_id}
</delete>

-- 删除事故所有当事人               /delete/accident/parties
<delete id="deleteAllAccidentParty">
delete from bs_traffic_accident_party where accident_id = #{accident_id}
</delete>

-- 6.高速/区县道路/路径检索
-- 昨日 各匝道 大小外地本地车 流量          /ramp/last/car_type/flow
<select id="getRampCarTypeFlow" resultType="java.util.HashMap">
select
    b.zone_name zone_name,
    nvl(a.loc_small, 0) loc_mini,
    nvl(a.loc_large, 0) loc_huge,
    nvl(a.fore_small, 0) fore_mini,
    nvl(a.fore_large, 0) fore_huge
from highway_t5 a left join highway_zone b on a.o_zoneid = b.zone_id and a.direction = b.direction
where time_point = trunc(to_date('2020-04-19', 'yyyy-mm-dd'))
and a.direction != #{direction}
order by b.rn desc
</select>

-- 昨日 高速公路 入城/路过 保山车辆         /highway/last/enter_and_away/flow
<select id="getEnterAwayFlow" resultType="java.util.HashMap">
select
    nvl(sum(cnt_away),0) cnt_away,
    nvl(sum(cnt_entr),0) cnt_enter
from highway_t3
where time_point = trunc(to_date('2020-04-19', 'yyyy-mm-dd'))
and direction != #{direction}
</select>

-- 昨日 大小外地本地车 总流量               /highway/last/car_type/flow
<select id="getCarTypeFlow" resultType="java.util.HashMap">
select
    nvl(sum(loc_small),0) loc_mini,
    nvl(sum(loc_large),0) loc_huge,
    nvl(sum(fore_small),0) fore_mini,
    nvl(sum(fore_large),0) fore_huge
from highway_t4
where trunc(time_point) = trunc(to_date('2020-04-19', 'yyyy-mm-dd'))
and direction != #{direction}
</select>

-- 昨日 每小时 高速公路 进/路过保山 车辆        /highway/last/enter_ad_away/hour_flow
<select id="getEnterAwayFlowEachHour" resultType="java.util.HashMap">
select
    to_char(time_point-1/24, 'hh24:mi') time_point,
    nvl(sum(cnt_away),0) cnt_away,
    nvl(sum(cnt_entr),0) cnt_enter
from highway_t4
where time_point > trunc(to_date('2020-04-19', 'yyyy-mm-dd')-1)
and time_point < trunc(to_date('2020-04-19', 'yyyy-mm-dd'))
and direction != #{direction}
group by time_point
order by 1 asc
</select>

-- 昨日 每小时 大小外地本地车 流量          /highway/last/car_type/hour_flow
<select id="getCarTypeFlowEachHour" resultType="java.util.HashMap">
select
    to_char(time_point-1/24, 'hh24:mi') time_point,
    nvl(sum(loc_small),0) loc_mini,
    nvl(sum(loc_large),0) loc_huge,
    nvl(sum(fore_small),0) fore_mini,
    nvl(sum(fore_large),0) fore_huge
from highway_t4
where time_point > trunc(to_date('2020-04-19', 'yyyy-mm-dd')-1)
and time_point < trunc(to_date('2020-04-19', 'yyyy-mm-dd'))
and direction != #{direction}
group by time_point
order by 1 asc
</select>

-- 高速公路 匝道 信息                       /ramp/info
<select id="getLngLatByDirection" resultType="java.util.HashMap">
select a.zone_name, b.ramp_name, b.bd09lng, b.bd09lat
from highway_zone a left join highway_ramp b on a.zone_id = b.zone_id and a.direction = b.direction
where b.direction != #{direction}
</select>

-- 区县 设备 信息                           /county/info
<select id="getCountyDev" resultType="java.util.HashMap">
select node_name, dev_name, dev_id, bdlng, bdlat from quxian_device
</select>

-- 区县 点位 信息                           /county/node/info
<select id="getCountyNodeName" resultType="String">
select distinct node_name from quxian_device
</select>

-- 今日 区县 流量                           /county/today/flow
<select id="getCountyFlow" resultType="java.util.HashMap">
select dev_name, to_char(time_point-1/24, 'hh24:mi') time_point, cnt_hour, cnt_acc
from quxian_flow a left join quxian_device b on a.dev_id = b.dev_id
where a.time_point > trunc(to_date('2020-04-19','yyyy-mm-dd'), 'dd')
and a.time_point < trunc(to_date('2020-04-19','yyyy-mm-dd') + 1, 'dd')
and b.node_name = #{node_name} and b.direction = #{direction} order by 2
</select>

-- 车辆 轨迹 查询           /search/path/plate
<select id="getPathByPlate" resultType="java.util.HashMap">
select to_char(cap_date, 'yyyy-mm-dd hh24:mi:ss') time_point,
        node_name,
        lat as olat,
        lead(lat) over(order by rownum) as dlat,
        lng as olng,
        lead(lng) over(order by rownum) as dlng,
        (lead(cap_date) over(order by rownum) - cap_date)*86400 as tt
from
    (
        select a.cap_date, b.node_name, b.bdlng lng, b.bdlat lat
        from dahua.picrecord a left join zju.device_import b on a.dev_id = b.dev_id
        where b.dev_id is not null and a.cap_date between to_date(#{start_date}, 'yyyy-mm-dd hh24:mi:ss')
            and to_date(#{end_date}, 'yyyy-mm-dd hh24:mi:ss')
            and a.car_num = #{plate}
        order by a.cap_date
    )
    order by time_point
</select>

-- 按要求检索 城区 常驻车辆     /search/changzhu/cnts?start_date=2020-04-16&end_date=2020-04-18&location=1&numOfDay=1&dayOfMonth=1
<select id="getChangzhuCntsSearch" resultType="java.util.HashMap">
select count(*) cnts from
(
    select car_num from
    (
        select a.car_num, a.cap_day
        from dahua.picrecord a left join device_import b on a.dev_id = b.dev_id
        where a.cap_day >= #{start_date} and a.cap_day < #{end_date}
        and length(a.car_num) > 6
        and b.设备位置 != #{location}
        group by a.car_num, a.cap_day having count(*) >= #{numOfDay}
    )
    group by car_num having count(*) >= #{dayOfMonth}
)
</select>

-- 检索 城区 常驻车辆数                 /search/changzhu/vn
<select id="getChangzhuVn" resultType="java.util.HashMap">
select time_point, loc_small, loc_large, fore_small, fore_large
from changzhu_num
where time_point between to_date(#{start_date}, 'yyyy-mm-dd') and to_date(#{end_date}, 'yyyy-mm-dd')
and time_point <> to_date(#{start_date}, 'yyyy-mm-dd')
</select>

-- 检索 唯一车牌数                      /search/unique/plate_num
<select id="getUniquePlateCnt" resultType="java.util.HashMap">
select time_point, cnt
from distinct_num
where time_point between to_date(#{start_date}, 'yyyy-mm-dd') and to_date(#{end_date}, 'yyyy-mm-dd')
and time_point <> to_date(#{start_date}, 'yyyy-mm-dd')
</select>


-- 6.用户管理
-- 6.1 准备工作
-- 创建序列
drop sequence bs_user_id_seq;
create sequence bs_user_id_seq
minvalue 1
nomaxvalue
start with 1
increment by 1
nocycle
nocache;
drop sequence bs_role_id_seq;
create sequence bs_role_id_seq
minvalue 1
nomaxvalue
start with 1
increment by 1
nocycle
nocache;

-- 创建表
drop table bs_role purge;
create table bs_role (
role_id number,
role_name varchar2(20) not null,
menu varchar2(200) default '/home',
create_time date default sysdate,
auth_time date,
auth_name varchar2(30),
primary key ( role_id )
);
drop table bs_user purge;
create table bs_user (
user_id number,
username varchar2(20) not null,
password varchar2(20) not null,
name varchar2(20),
info varchar2(30),
phone_number varchar2(11),
create_time date default sysdate,
role_id number default 8,
constraint role_id_constraint foreign key (role_id) references bs_role(role_id),
primary key ( user_id )
);

-- 插入数据
insert into bs_role (role_id, role_name) values (bs_role_id_seq.nextval, 'admin');
insert into bs_role (role_id, role_name) values (bs_role_id_seq.nextval, 'user');
insert into bs_role (role_id, role_name) values (bs_role_id_seq.nextval, 'state');
insert into bs_role (role_id, role_name) values (bs_role_id_seq.nextval, 'test');
insert into bs_role (role_id, role_name) values (bs_role_id_seq.nextval, 'state');
insert into bs_role (role_id, role_name) values (bs_role_id_seq.nextval, 'accident');
insert into bs_role (role_id, role_name) values (bs_role_id_seq.nextval, 'guest');
insert into bs_user ( user_id, username, password, name, info, phone_number, role_id )
values ( bs_user_id_seq.nextval, 'admin', 'admin', '张国平', ' ', '13123455432', 8  );

-- 添加用户                             /insert/user
<insert id="insertUser">
insert into bs_user ( user_id,
<trim suffixOverrides=",">
    <if test="username != null and username != ''">
        username,
    </if>
    <if test="password != null and password != ''">
        password,
    </if>
    <if test="name != null and name != ''">
        name,
    </if>
    <if test="info != null and info != ''">
        info,
    </if>
    <if test="phone_number != null and phone_number != ''">
        phone_number,
    </if>
    <if test="role_id != null and role_id != ''">
        role_id,
    </if>
</trim>
) values ( BS_USER_ID_SEQ.nextval,
<trim suffixOverrides=",">
    <if test="username != null and username != ''">
        #{username},
    </if>
    <if test="password != null and password != ''">
        #{password},
    </if>
    <if test="name != null and name != ''">
        #{name},
    </if>
    <if test="info != null and info != ''">
        #{info},
    </if>
    <if test="phone_number != null and phone_number != ''">
        #{phone_number},
    </if>
    <if test="role_id != null and role_id != ''">
        #{role_id},
    </if>
</trim>
)
</insert>


-- 查询全部用户                         /user/list
<select id="getUsers" resultType="java.util.HashMap">
select * from bs_user
</select>

-- 查询用户                         /user/info
<select id="getUserById" resultType="java.util.HashMap">
select * from bs_user where user_id = #{user_id}
</select>

-- 修改用户                         /update/user
<update id="updateUser">
update BS_USER
<trim suffixOverrides=",">
    <set>
        <if test="username != null and username != ''">
            username = #{username},
        </if>
        <if test="password != null and password != ''">
            password = #{password},
        </if>
        <if test="name != null and name != ''">
            name = #{name},
        </if>
        <if test="info != null and info != ''">
            info = #{info},
        </if>
        <if test="phone_number != null and phone_number != ''">
            phone_number = #{phone_number},
        </if>
        <if test="role_id != null and role_id != ''">
            role_id = #{role_id},
        </if>
    </set>
</trim>
where user_id = #{user_id}
</update>
-- 删除用户                         /delete/user
<delete id="deleteUser">
delete from BS_USER where USER_ID=#{user_id}
</delete>

-- 查询全部角色                         /role/list
<select id="getRoles" resultType="java.util.HashMap">
select * from bs_role
</select>

-- 添加角色                             /insert/role
<insert id="insertRole">
insert into BS_ROLE ( role_id, role_name ) values ( BS_ROLE_ID_SEQ.nextval, #{role_name} )
</insert>

-- 查询角色                             /role/info
<select id="getRoleById" resultType="java.util.HashMap">
select * from BS_ROLE where role_id = #{role_id}
</select>

-- 修改角色                             /update/role
<update id="updateRole">
update BS_ROLE
<trim suffixOverrides=",">
    <set>
        <if test="role_name != null and role_name != ''">
            role_name = #{role_name},
        </if>
        <if test="menu != null and menu != ''">
            menu = #{menu},
        </if>
        <if test="auth_name != null and auth_name != ''">
            auth_name = #{auth_name},
        </if>
        <if test="auth_time != null and auth_time != ''">
            auth_time = #{auth_time},
        </if>
    </set>
</trim>
where role_id = #{role_id}
</update>

-- 删除角色                         /delete/role
<delete id="deleteRole">
delete from BS_ROLE where ROLE_ID = #{role_id}
</delete>



-- 7.信号控制


-- 7.1 基础信息管理


-- 7.2 信号控制

-- 7.3 信号评价

-- 7.4 拥堵点
