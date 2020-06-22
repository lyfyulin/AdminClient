import {ArrayArgMax, ArrayFindValueIndex, ArrayMax, ArraySum} from '../../../utils/ArrayCal'
import $ from 'jquery'
import {d3} from 'd3-node'
export default class LineSignalCal {

	constructor(line_dir, line_ctrl_type, cross_phase_schema, cross_phase_time, cross_dist, cross_speed, cross_name, flag = false, fix_cycle = 0) {
        

        // 初始化参数
        this.init_params(line_dir, line_ctrl_type, cross_phase_schema, cross_phase_time, cross_dist, cross_speed, cross_name, flag, fix_cycle);

		// 参数及数据
		this.gap_skip = 10;

		// 结果集
		this.green_start_time_arr = [];
		this.green_end_time_arr = [];
		this.double_band_width = [];
		this.relative_offset = [];
    }
    

    init_params = (line_dir, line_ctrl_type, cross_phase_schema, cross_phase_time, cross_dist, cross_speed, cross_name, flag = false, fix_cycle = 0) => {
        // 1.数据输入

        // 2.输入数据预处理
        // 2.1公共周期确定
        let cross_cycle = cross_phase_time.map(e=>ArraySum(e));
        let publicCycle = ArrayMax(cross_cycle);
        let new_cross_cycle = [];
    
        // 是否定周期
        if(flag){
            publicCycle = fix_cycle;
            new_cross_cycle = cross_cycle.map( e => publicCycle);
        }else{
            publicCycle = publicCycle % 2 === 0?publicCycle : publicCycle + 1;	//偶数
            new_cross_cycle = cross_cycle.map( e => {
                if(e >= publicCycle * 0.6){
                    return publicCycle;
                }else{
                    return publicCycle/2;
                }
            })
        }
    
        // 2.2绿信比计算/关键相位获取
        // 协调相位绿信比
        let phase_green_ratio = [];
        // 协调相位在信号方案的序号 index
        let key_phase_index = [];
    
        // 东向西方向
        if(line_dir === 1){
            // 双向协调
            if(line_ctrl_type === 1){
                for (let i = 0; i < cross_phase_schema.length; i++) {
                    const element = cross_phase_schema[i];
                    // 东西直左
                    if(element.indexOf(0) !== -1){
                        let index = element.indexOf(0);
                        key_phase_index[i] = index;
                        phase_green_ratio[i] = cross_phase_time[i][index]/cross_cycle[i];
                    }
                    // 东西直行
                    if(ArrayFindValueIndex(element, 1).length !== 0){
                        let tmp = ArrayFindValueIndex(element, 1).map(e => {
                            return cross_phase_time[i][e];
                        })
                        // let max_phase_time = ArrayMax(tmp)/cross_cycle[i];
                        key_phase_index[i] = ArrayFindValueIndex(element, 1)[ArrayArgMax(tmp)];
                    }				
                }
            }
            // 东向西正向协调
            if(line_ctrl_type === 2){
                for (let i = 0; i < cross_phase_schema.length; i++) {
                    const element = cross_phase_schema[i];
                    // 东西直左
                    if(element.indexOf(0) !== -1){
                        let index = element.indexOf(0);
                        key_phase_index[i] = index;
                        phase_green_ratio[i] = cross_phase_time[i][index]/cross_cycle[i];
                    }
                    // 东西直行
                    if(ArrayFindValueIndex(element, 1).length !== 0 && ArrayFindValueIndex(element, 3) === -1){
                        let tmp = ArrayFindValueIndex(element, 1).map(e => {
                            return cross_phase_time[i][e];
                        })
                        // let max_phase_time = ArrayMax(tmp)/cross_cycle[i];
                        key_phase_index[i] = ArrayFindValueIndex(element, 1)[ArrayArgMax(tmp)];
                    }
                    // 东西直行+东口直左
                    if(ArrayFindValueIndex(element, 1).length !== 0 && ArrayFindValueIndex(element, 3) !== -1){
                        let index1 = element.indexOf(1);
                        let index2 = element.indexOf(3);
                        if(Math.abs(index1 - index2) === 1){
                            key_phase_index[i] = Math.min(index1, index2);
                            phase_green_ratio[i] = (cross_phase_time[i][index1] + cross_phase_time[i][index2])/cross_cycle[i];
                        }
                    }
                }
            }
            // 东向西反向协调
            if(line_ctrl_type === 3){
                for (let i = 0; i < cross_phase_schema.length; i++) {
                    const element = cross_phase_schema[i];
                    // 东西直左
                    if(element.indexOf(0) !== -1){
                        let index = element.indexOf(0);
                        key_phase_index[i] = index;
                        phase_green_ratio[i] = cross_phase_time[i][index]/cross_cycle[i];
                    }
                    // 东西直行
                    if(ArrayFindValueIndex(element, 1).length !== 0 && ArrayFindValueIndex(element, 4) === -1){
                        let tmp = ArrayFindValueIndex(element, 1).map(e => {
                            return cross_phase_time[i][e];
                        })
                        // let max_phase_time = ArrayMax(tmp)/cross_cycle[i];
                        key_phase_index[i] = ArrayFindValueIndex(element, 1)[ArrayArgMax(tmp)];
                    }
                    // 东西直行+西口直左
                    if(ArrayFindValueIndex(element, 1).length !== 0 && ArrayFindValueIndex(element, 4) !== -1){
                        let index1 = element.indexOf(1);
                        let index2 = element.indexOf(4);
                        if(Math.abs(index1 - index2) === 1){
                            key_phase_index[i] = Math.min(index1, index2);
                            phase_green_ratio[i] = (cross_phase_time[i][index1] + cross_phase_time[i][index2])/cross_cycle[i];
                        }
                    }
                }
            }
        }
    
        // 南向北方向
        if(line_dir === 2){
            // 南北双向协调
            if(line_ctrl_type === 1){
                for (let i = 0; i < cross_phase_schema.length; i++) {
                    const element = cross_phase_schema[i];
                    // 南北直左
                    if(element.indexOf(5) !== -1){
                        let index = element.indexOf(5);
                        key_phase_index[i] = index;
                        phase_green_ratio[i] = cross_phase_time[i][index]/cross_cycle[i];
                    }
                    // 南北直行
                    if(ArrayFindValueIndex(element, 6).length !== 0){
                        let tmp = ArrayFindValueIndex(element, 6).map(e => {
                            return cross_phase_time[i][e];
                        })
                        // let max_phase_time = ArrayMax(tmp)/cross_cycle[i];
                        key_phase_index[i] = ArrayFindValueIndex(element, 6)[ArrayArgMax(tmp)];
                    }				
                }
            }
            // 南向北正向协调
            if(line_ctrl_type === 2){
                for (let i = 0; i < cross_phase_schema.length; i++) {
                    const element = cross_phase_schema[i];
                    // 南北直左
                    if(element.indexOf(5) !== -1){
                        let index = element.indexOf(5);
                        key_phase_index[i] = index;
                        phase_green_ratio[i] = cross_phase_time[i][index]/cross_cycle[i];
                    }
                    // 南北直行
                    if(ArrayFindValueIndex(element, 6).length !== 0 && ArrayFindValueIndex(element, 8) === -1){
                        let tmp = ArrayFindValueIndex(element, 6).map(e => {
                            return cross_phase_time[i][e];
                        })
                        // let max_phase_time = ArrayMax(tmp)/cross_cycle[i];
                        key_phase_index[i] = ArrayFindValueIndex(element, 6)[ArrayArgMax(tmp)];
                    }
                    // 南北直行+南口直左
                    if(ArrayFindValueIndex(element, 6).length !== 0 && ArrayFindValueIndex(element, 8) !== -1){
                        let index1 = element.indexOf(6);
                        let index2 = element.indexOf(8);
                        if(Math.abs(index1 - index2) === 1){
                            key_phase_index[i] = Math.min(index1, index2);
                            phase_green_ratio[i] = (cross_phase_time[i][index1] + cross_phase_time[i][index2])/cross_cycle[i];
                        }
                    }
                }
            }
            // 南向北反向协调
            if(line_ctrl_type === 3){
                for (let i = 0; i < cross_phase_schema.length; i++) {
                    const element = cross_phase_schema[i];
                    // 南北直左
                    if(element.indexOf(5) !== -1){
                        let index = element.indexOf(5);
                        key_phase_index[i] = index;
                        phase_green_ratio[i] = cross_phase_time[i][index]/cross_cycle[i];
                    }
                    // 南北直行
                    if(ArrayFindValueIndex(element, 6).length !== 0 && ArrayFindValueIndex(element, 9) === -1){
                        let tmp = ArrayFindValueIndex(element, 6).map(e => {
                            return cross_phase_time[i][e];
                        })
                        // let max_phase_time = ArrayMax(tmp)/cross_cycle[i];
                        key_phase_index[i] = ArrayFindValueIndex(element, 6)[ArrayArgMax(tmp)];
                    }
                    // 南北直行+北口直左
                    if(ArrayFindValueIndex(element, 6).length !== 0 && ArrayFindValueIndex(element, 9) !== -1){
                        let index1 = element.indexOf(6);
                        let index2 = element.indexOf(9);
                        if(Math.abs(index1 - index2) === 1){
                            key_phase_index[i] = Math.min(index1, index2);
                            phase_green_ratio[i] = (cross_phase_time[i][index1] + cross_phase_time[i][index2])/cross_cycle[i];
                        }
                    }
                }
            }
        }
    
        // 西向东方向
        if(line_dir === 3){
            // 双向协调
            if(line_ctrl_type === 1){
                for (let i = 0; i < cross_phase_schema.length; i++) {
                    const element = cross_phase_schema[i];
                    // 东西直左
                    if(element.indexOf(0) !== -1){
                        let index = element.indexOf(0);
                        key_phase_index[i] = index;
                        phase_green_ratio[i] = cross_phase_time[i][index]/cross_cycle[i];
                    }
                    // 东西直行
                    if(ArrayFindValueIndex(element, 1).length !== 0){
                        let tmp = ArrayFindValueIndex(element, 1).map(e => {
                            return cross_phase_time[i][e];
                        })
                        // let max_phase_time = ArrayMax(tmp)/cross_cycle[i];
                        key_phase_index[i] = ArrayFindValueIndex(element, 1)[ArrayArgMax(tmp)];
                    }				
                }
            }
            // 西向东反向协调
            if(line_ctrl_type === 2){
                for (let i = 0; i < cross_phase_schema.length; i++) {
                    const element = cross_phase_schema[i];
                    // 东西直左
                    if(element.indexOf(0) !== -1){
                        let index = element.indexOf(0);
                        key_phase_index[i] = index;
                        phase_green_ratio[i] = cross_phase_time[i][index]/cross_cycle[i];
                    }
                    // 东西直行
                    if(ArrayFindValueIndex(element, 1).length !== 0 && ArrayFindValueIndex(element, 3) === -1){
                        let tmp = ArrayFindValueIndex(element, 1).map(e => {
                            return cross_phase_time[i][e];
                        })
                        // let max_phase_time = ArrayMax(tmp)/cross_cycle[i];
                        key_phase_index[i] = ArrayFindValueIndex(element, 1)[ArrayArgMax(tmp)];
                    }
                    // 东西直行+东口直左
                    if(ArrayFindValueIndex(element, 1).length !== 0 && ArrayFindValueIndex(element, 3) !== -1){
                        let index1 = element.indexOf(1);
                        let index2 = element.indexOf(3);
                        if(Math.abs(index1 - index2) === 1){
                            key_phase_index[i] = Math.min(index1, index2);
                            phase_green_ratio[i] = (cross_phase_time[i][index1] + cross_phase_time[i][index2])/cross_cycle[i];
                        }
                    }
                }
            }
            // 西向东正向协调
            if(line_ctrl_type === 3){
                for (let i = 0; i < cross_phase_schema.length; i++) {
                    const element = cross_phase_schema[i];
                    // 东西直左
                    if(element.indexOf(0) !== -1){
                        let index = element.indexOf(0);
                        key_phase_index[i] = index;
                        phase_green_ratio[i] = cross_phase_time[i][index]/cross_cycle[i];
                    }
                    // 东西直行
                    if(ArrayFindValueIndex(element, 1).length !== 0 && ArrayFindValueIndex(element, 4) === -1){
                        let tmp = ArrayFindValueIndex(element, 1).map(e => {
                            return cross_phase_time[i][e];
                        })
                        // let max_phase_time = ArrayMax(tmp)/cross_cycle[i];
                        key_phase_index[i] = ArrayFindValueIndex(element, 1)[ArrayArgMax(tmp)];
                    }
                    // 东西直行+西口直左
                    if(ArrayFindValueIndex(element, 1).length !== 0 && ArrayFindValueIndex(element, 4) !== -1){
                        let index1 = element.indexOf(1);
                        let index2 = element.indexOf(4);
                        if(Math.abs(index1 - index2) === 1){
                            key_phase_index[i] = Math.min(index1, index2);
                            phase_green_ratio[i] = (cross_phase_time[i][index1] + cross_phase_time[i][index2])/cross_cycle[i];
                        }
                    }
                }
            }
        }
    
        // 北向南方向
        if(line_dir === 4){
            // 南北双向协调
            if(line_ctrl_type === 1){
                for (let i = 0; i < cross_phase_schema.length; i++) {
                    const element = cross_phase_schema[i];
                    // 南北直左
                    if(element.indexOf(5) !== -1){
                        let index = element.indexOf(5);
                        key_phase_index[i] = index;
                        phase_green_ratio[i] = cross_phase_time[i][index]/cross_cycle[i];
                    }
                    // 南北直行
                    if(ArrayFindValueIndex(element, 6).length !== 0){
                        let tmp = ArrayFindValueIndex(element, 6).map(e => {
                            return cross_phase_time[i][e];
                        })
                        // let max_phase_time = ArrayMax(tmp)/cross_cycle[i];
                        key_phase_index[i] = ArrayFindValueIndex(element, 6)[ArrayArgMax(tmp)];
                    }				
                }
            }
            // 北向南反向协调
            if(line_ctrl_type === 2){
                for (let i = 0; i < cross_phase_schema.length; i++) {
                    const element = cross_phase_schema[i];
                    // 南北直左
                    if(element.indexOf(5) !== -1){
                        let index = element.indexOf(5);
                        key_phase_index[i] = index;
                        phase_green_ratio[i] = cross_phase_time[i][index]/cross_cycle[i];
                    }
                    // 南北直行
                    if(ArrayFindValueIndex(element, 6).length !== 0 && ArrayFindValueIndex(element, 8) === -1){
                        let tmp = ArrayFindValueIndex(element, 6).map(e => {
                            return cross_phase_time[i][e];
                        })
                        // let max_phase_time = ArrayMax(tmp)/cross_cycle[i];
                        key_phase_index[i] = ArrayFindValueIndex(element, 6)[ArrayArgMax(tmp)];
                    }
                    // 南北直行+南口直左
                    if(ArrayFindValueIndex(element, 6).length !== 0 && ArrayFindValueIndex(element, 8) !== -1){
                        let index1 = element.indexOf(6);
                        let index2 = element.indexOf(8);
                        if(Math.abs(index1 - index2) === 1){
                            key_phase_index[i] = Math.min(index1, index2);
                            phase_green_ratio[i] = (cross_phase_time[i][index1] + cross_phase_time[i][index2])/cross_cycle[i];
                        }
                    }
                }
            }
            // 北向南正向协调
            if(line_ctrl_type === 3){
                for (let i = 0; i < cross_phase_schema.length; i++) {
                    const element = cross_phase_schema[i];
                    // 南北直左
                    if(element.indexOf(5) !== -1){
                        let index = element.indexOf(5);
                        key_phase_index[i] = index;
                        phase_green_ratio[i] = cross_phase_time[i][index]/cross_cycle[i];
                    }
                    // 南北直行
                    if(ArrayFindValueIndex(element, 6).length !== 0 && ArrayFindValueIndex(element, 9) === -1){
                        let tmp = ArrayFindValueIndex(element, 6).map(e => {
                            return cross_phase_time[i][e];
                        })
                        // let max_phase_time = ArrayMax(tmp)/cross_cycle[i];
                        key_phase_index[i] = ArrayFindValueIndex(element, 6)[ArrayArgMax(tmp)];
                    }
                    // 南北直行+北口直左
                    if(ArrayFindValueIndex(element, 6).length !== 0 && ArrayFindValueIndex(element, 9) !== -1){
                        let index1 = element.indexOf(6);
                        let index2 = element.indexOf(9);
                        if(Math.abs(index1 - index2) === 1){
                            key_phase_index[i] = Math.min(index1, index2);
                            phase_green_ratio[i] = (cross_phase_time[i][index1] + cross_phase_time[i][index2])/cross_cycle[i];
                        }
                    }
                }
            }
        }
    
        // 距离计算速度
        // let cross_velocity = [];
        // for (let index = 0; index < cross_dist.length; index++) {
        //     if(index !== 0){
        //         cross_velocity.push(cross_dist[index]/cross_free_time[index]);
        //     }
        // }
		// let velocity = ArrayMin(cross_velocity););

		let velocity = ArrayMax(cross_speed);

		this.publicCycle = publicCycle;
		this.cross_dist = cross_dist;
		this.velocity = velocity;
		this.schema_cycle = new_cross_cycle;
		this.phase_green_ratio = phase_green_ratio;
		this.cross_name = cross_name;

		// console.log(this.publicCycle, this.velocity, this.phase_green_ratio, this.schema_cycle, this.cross_dist, this.cross_name);

    }
    


	setOption = (line_dir, line_ctrl_type, cross_phase_schema, cross_phase_time, cross_dist, cross_speed, cross_name, flag = false, fix_cycle = 0) => {
        
        this.init_params(line_dir, line_ctrl_type, cross_phase_schema, cross_phase_time, cross_dist, cross_speed, cross_name, flag, fix_cycle);

		// 结果集
		this.green_start_time_arr = [];
		this.green_end_time_arr = [];
		this.double_band_width = [];
		this.relative_offset = [];

		this.calLineControl();
	}


	// 数组累计和
	accumSum = (arr) => {
		let result = [];
		let sum = 0;
		for(let i = 0; i < arr.length; i++)
		{
			sum += arr[i];
			result.push(sum);
		}
		return result;
	}

	// 数组排序返回序号
	arraySortReturnIndex = (arr) => {
		let index = [];
		let tmp = 0;
		let tmp_arr = [];
		for(let i = 0; i < arr.length; i++){
			tmp_arr.push(arr[i]);
		}
		for(let i = 0; i < arr.length; i++){
			index.push(i);
		}
		for (let i = 0; i < tmp_arr.length; i++)  
		{  
			for (let j = i + 1; j < tmp_arr.length; j++)  
			{  
				if (tmp_arr[i] >= tmp_arr[j])  {  
					tmp = tmp_arr[i];
					tmp_arr[i] = tmp_arr[j];
					tmp_arr[j] = tmp;
					tmp = index[i];
					index[i] = index[j];
					index[j] = tmp;
				}
			}
		}
		return index;
	}

	// 计算实际交叉口与理想交叉口间距
	calGreenWave = (arr, v, c, min_actual2dream_gap, max_actual2dream_gap, gap_skip) => {

		let result = [];
		let coordinate = this.accumSum(arr);
		
		let dream_max_shift_gap = 0;
		let dream_max_shift_gap_cross = 0;			// 最大挪移的交叉口
		let dream_gap = 0;							// 最佳x值
		let dream_shift_gap = 0;
		for(let gaps_arr = min_actual2dream_gap; gaps_arr < max_actual2dream_gap; gaps_arr += gap_skip)			// x值
		{
			let dream2actual_gap = [];				//与理想交叉口的距离
			for(let i = 0; i < arr.length; i++)
			{
				dream2actual_gap.push(coordinate[i] - gaps_arr * parseInt(coordinate[i]/gaps_arr, 10));		// 表中间内容
			}
			dream2actual_gap.push(gaps_arr);
			let sort_index = this.arraySortReturnIndex(dream2actual_gap);

			let shift_gap = [];
			for(let i = 1; i < dream2actual_gap.length; i++)
			{
				let index = sort_index[i];
				shift_gap.push(dream2actual_gap[index] - dream2actual_gap[sort_index[i - 1]]);		// 计算相邻挪移量之差。

				if(dream2actual_gap[index] - dream2actual_gap[sort_index[i - 1]] > dream_max_shift_gap)
				{
					dream_max_shift_gap = dream2actual_gap[index] - dream2actual_gap[sort_index[i - 1]];
					
					dream_max_shift_gap_cross = sort_index[i-1];											// 最大挪移在哪个交叉口
					dream_shift_gap = (gaps_arr - dream_max_shift_gap) / 2;			// 最大挪移
					dream_gap = gaps_arr;
				}
			}
		}
		result.push(dream_shift_gap);
		result.push(dream_max_shift_gap_cross);
		result.push(dream_gap);
		return result;
	}

	// 计算理想交叉口位置
	calactual2dreamLocation = (coordinate, gap_cross) => {
		let result = [];
		let min_cross = Math.ceil(((coordinate[gap_cross[1]] - gap_cross[0]) - coordinate[0]) / gap_cross[2]);
		let max_cross = Math.ceil((coordinate[coordinate.length - 1] - (coordinate[gap_cross[1]] - gap_cross[0])) / gap_cross[2]);
		let center_coor = coordinate[gap_cross[1]] - gap_cross[0];
		
		let dream_coor = [];
		let first_dream_coor = center_coor - min_cross * gap_cross[2];
		dream_coor.push(first_dream_coor);
		for(let i = 1; i < min_cross + max_cross + 1; i++)
		{
			dream_coor.push(first_dream_coor + i * gap_cross[2]);
		}
		let actual2dream_gap = [];
		let actual2dream_left_or_right = [];
		let actual2dream_index = [];
			
		for(let i = 0; i < coordinate.length; i++)
		{
			let temp_tmp = coordinate[i] - dream_coor[0];
			let temp_tmp2 = 0;
			let temp_tmp3 = 0;
			for(let j = 0; j < dream_coor.length; j++)
			{
				if(temp_tmp >= Math.abs(coordinate[i] - dream_coor[j]))
				{
					temp_tmp = Math.abs(coordinate[i] - dream_coor[j]);
					// 实际交叉口位于理想交叉口右侧
					if((coordinate[i] - dream_coor[j]) > 0)		
					{	
						temp_tmp2 = 2;
					}
					else{
						temp_tmp2 = 1;
					}
					temp_tmp3 = j + 1;
				}
			}
			actual2dream_gap.push(temp_tmp);				//	实际交叉口与理想交叉口的距离
			actual2dream_left_or_right.push(temp_tmp2);		//	实际交叉口位于理想交叉口的左侧或者右侧
			actual2dream_index.push(temp_tmp3);				//	实际交叉口对应理想交叉口的编号
		}
		result.push(actual2dream_left_or_right);
		result.push(actual2dream_gap);
		result.push(actual2dream_index);
		return result;
	}

	//step 14 计算各个交叉口的相位差
	calOffset = (cross_lamda_arr, cross_cycle_arr, to_dream_cross_index) => {
		let offset = [];
		for(let i = 0; i < cross_lamda_arr.length; i++)
		{
			if(to_dream_cross_index[i] % 2 === 0)
			{
				offset.push(parseInt((0.5 - 0.5 * cross_lamda_arr[i]) * cross_cycle_arr[i], 10));
			}
			else
			{
				offset.push(parseInt((1 - 0.5 * cross_lamda_arr[i]) * cross_cycle_arr[i], 10));
			}
		}	
		return offset;
	}
	
	// step 15 计算相对相位差
	calRelativeOffset = (offset, publicCycle, suppose_cross_index) => {
		let relative_offset = [];
		
		for(let i = 0; i < offset.length; i++)
		{
			if(offset[i] >= offset[suppose_cross_index])
			{
				relative_offset.push(offset[i] - offset[suppose_cross_index]);
				
			}
			else
			{
				relative_offset.push(offset[i] - offset[suppose_cross_index] + publicCycle);
			}
		}
		return relative_offset;
	}
			
	// 计算关键相位绿灯启亮时刻
	calGreenStartTime = (lamda_arr, publicCycle, relative_offset, index) => {
		let green_start_time_arr = [];
		for(let i = 0; i < index.length; i++)
		{
			let temp = relative_offset[i];
			
			while(true)
			{
				if((index[i] * 0.5 - 0.75) * publicCycle <= temp && temp <= (index[i] * 0.5 - 0.25) * publicCycle)
				{
					break;
				}
				else if((index[i] * 0.5 - 0.75) * publicCycle >= temp)
				{
					temp += publicCycle * 0.5;
				}
				else if((index[i] * 0.5 - 0.25) * publicCycle <= temp)
				{
					temp -= publicCycle * 0.5;
				}
			}
			green_start_time_arr.push(temp);
		}
		return green_start_time_arr;
	}
	
	// 计算关键相位绿灯停止时刻。
	calGreenEndTime = (lamda_arr, publicCycle, green_start_time_arr) => {
		let green_end_time_arr = [];
		for(let i = 0; i < green_start_time_arr.length; i++)
		{
			green_end_time_arr.push(green_start_time_arr[i] + publicCycle * lamda_arr[i]);
		}
		return green_end_time_arr;
	}

	// 计算绿波带宽度
	calGreenBandWidth = (actual2dreamgap, actual2dreamdirection, actual2dream_index, dream_gap, velocity, green_start_time, green_end_time) => {
		let relative_left_coor = [];
		let relative_right_coor = [];
		for(let i = 0; i < actual2dream_index.length; i++)
		{
			let temp = actual2dreamgap[i] * (actual2dreamdirection[i] - 1.5) * 2 + dream_gap * (actual2dream_index[i] - 1);
			relative_left_coor.push(temp);
		}
		for(let i = actual2dream_index.length - 1; i >= 0; i--)
		{
			let temp = actual2dreamgap[i] * (1.5 - actual2dreamdirection[i]) * 2 + dream_gap * (actual2dream_index[actual2dream_index.length - 1] - actual2dream_index[i]);
			relative_right_coor.push(temp);
		}
		let max_k1 = 0;
		let min_k2 = 0;
		max_k1 = green_start_time[0] - relative_left_coor[0] / velocity;
		min_k2 = green_end_time[0] - relative_left_coor[0] / velocity;
		for(let i = 0; i < green_start_time.length; i++)
		{
			if(max_k1 < green_start_time[i] - relative_left_coor[i] / velocity)
			{
				max_k1 = green_start_time[i] - relative_left_coor[i] / velocity;
			}
			
			if(min_k2 > green_end_time[i] - relative_left_coor[i] / velocity)
			{
				min_k2 = green_end_time[i] - relative_left_coor[i] / velocity;
			}
		}
		// 正向绿波带宽度
		let positive_bandwidth = parseInt(min_k2 - max_k1, 10);
		
		max_k1 = 0;
		min_k2 = 0;
		max_k1 = green_start_time[green_start_time.length - 1] + relative_right_coor[0] / velocity;
		min_k2 = green_end_time[green_start_time.length - 1] + relative_right_coor[0] / velocity;
		for(let i = 0; i < green_start_time.length; i++)
		{
			if(max_k1 < green_start_time[green_start_time.length - 1 - i] + relative_right_coor[i] / velocity)
			{
				max_k1 = green_start_time[green_start_time.length - 1 - i] + relative_right_coor[i] / velocity;
			}
			
			if(min_k2 > green_end_time[green_start_time.length - 1 - i] + relative_right_coor[i] / velocity)
			{
				min_k2 = green_end_time[green_start_time.length - 1 - i] + relative_right_coor[i] / velocity;
			}
		}
		// 反向绿波带宽度
		let opposite_bandwidth = parseInt(min_k2 - max_k1, 10);		
		return [parseInt((opposite_bandwidth + positive_bandwidth) / 2, 10), opposite_bandwidth, positive_bandwidth];
		
	}


	// 计算控制方案
	calLineControl = (cycle = this.publicCycle, velocity = this.velocity, green_ratio = this.phase_green_ratio, schema_cycle = this.schema_cycle, cross_dist = this.cross_dist, cross_name = this.cross_name) => {

		let gap_skip = this.gap_skip;
		let min_actual2dream_gap = velocity * cycle / 2 - gap_skip * 10;
		let max_actual2dream_gap = velocity * cycle / 2 + gap_skip * 10;
		let gap_cross = this.calGreenWave(cross_dist, velocity, cycle, min_actual2dream_gap, max_actual2dream_gap, gap_skip);
		
		let coordinate = this.accumSum(cross_dist);
			
		//  step 12 实际交叉口与理想协调交叉口距离
		let actual2dreamlocation = this.calactual2dreamLocation(coordinate, gap_cross);
		

		// 计算相对相位差
		let offset_arr = this.calOffset(green_ratio, schema_cycle, actual2dreamlocation[2]);
		let relative_offset = this.calRelativeOffset(offset_arr, cycle, 0);				// 假设相对第1个交叉口进行相位差计算  
		
		// 计算绿灯起始时刻/结束时刻
		let green_start_time_arr = this.calGreenStartTime(green_ratio, cycle, relative_offset, actual2dreamlocation[2]);
		let green_end_time_arr = this.calGreenEndTime(green_ratio, cycle, green_start_time_arr);

		// 计算双向绿波宽度
		let double_band_width = this.calGreenBandWidth(actual2dreamlocation[1], actual2dreamlocation[0], actual2dreamlocation[2], gap_cross[2], velocity, green_start_time_arr, green_end_time_arr);

		this.relative_offset = relative_offset;
		this.green_start_time_arr = green_start_time_arr;
		this.green_end_time_arr = green_end_time_arr;
		
		this.double_band_width = double_band_width;
	
	}

	// 打印文字到textarea
	printResult = (divID, cycle = this.publicCycle, double_band_width = this.double_band_width, green_start_time_arr = this.green_start_time_arr, green_end_time_arr = this.green_end_time_arr) => {
		
		let oText1 = document.getElementById(divID);
		let str_cal_result = "";
		if(double_band_width[0] > 0 && double_band_width[0] < cycle / 2) {
			str_cal_result = '双向绿波带宽为' + double_band_width[0] + 's\n';
		} else {
			str_cal_result = '';
		}
		for(let i = 0; i < green_start_time_arr.length - 1; i++){
			str_cal_result += '第' + (i+1) + '个交叉口绿灯启亮时刻：' + green_start_time_arr[i] + 's\n第' + (i+1) + '个交叉口绿灯停止时刻：' + green_end_time_arr[i] + 's\n';
		}
		oText1.innerHTML = str_cal_result;
	}

	// 画线段
	drawSvgLine = (svg, lines) => {
		svg.append("g").attr("id", "lines").selectAll("line").data(lines).enter().append("line").attr("x1", (d,i) => d[0]).attr("y1", (d,i) => d[1])
		.attr("x2", (d,i) =>d[2]).attr("y2", (d,i) => d[3])
		.attr("stroke", (d,i) => d[4]).attr("stroke-width", (d,i) => d[5])
		.attr("transform", (d,i) => ("translate(" + d[6] + ", " + d[7] + "),rotate(" + d[8] + ")"));
	}

	// 画文字
	drawSvgText = (svg, texts) => {
		svg.append("g").attr("id", "texts").selectAll("text").data(texts).enter().append("text")
		.attr("x", (d,i) => d[0]).attr("y", (d,i) => d[1]).attr("fill", (d,i)=> d[2])
		.attr("font-size", (d,i) => d[3]).text((d,i) => d[4])
		.attr("text-anchor", "middle");
	}

	// 画曲线
	drawSvgPath = (svg, paths) => {
		svg.append("g").attr("id", "paths").selectAll("path").data(paths).enter().append("path")
		.attr("d", (d,i)=> d[0]).attr("stroke", (d,i)=> d[1]).attr("stroke-width", (d,i)=> d[2]).attr("fill", (d,i)=> d[3])
		.attr("transform", (d, i) => ("translate(" + d[4] + ", " + d[5] + "),rotate(" + d[6] + ")"));

	}

	// 画图
	drawInSvg = (divID, bgc = "#777", velocity=this.velocity, cycle = this.publicCycle, dist = this.cross_dist, band_width = this.double_band_width, start_time = this.green_start_time_arr, end_time = this.green_end_time_arr, cross_name = this.cross_name) => {

		// 初始化
		let odiv = $("#" + divID)[0];
		let width = odiv.offsetWidth;
		let height = odiv.offsetHeight;

		// 清除已有内容
		d3.select("body").select("#" + divID).selectAll("*").remove();
		let svg = d3.select("body").select("#" + divID).append("svg").attr("width", width).attr("height", height).style("background", bgc);

		// 参数计算
		let actual_coor = dist;
		let location = this.accumSum(actual_coor);
		let show_cycle_num = parseInt(end_time[end_time.length - 1]/cycle, 10);

		// 缩放计算
		let scale_y = height / (show_cycle_num * cycle) / 1.5;
		let scale_x = width / location[location.length - 1] / 1.2;
		let offset_x = width/12;
		let offset_y = height/12;
		let font_size = 10;

		// 画图最小周期
		let mincycle = 4;

		// 绘制中 绿灯起始时刻/结束时刻 最小值
		let first_green = [];
		let first_red = [];
		for(let i = 0; i < start_time.length; i++)
		{
			let tmp = start_time[i] - cycle * mincycle;
			let tmp2 = end_time[i] - cycle * mincycle;
			first_green.push(tmp);
			first_red.push(tmp2);
		}

		// 相位绘制
		let lines = [];
		let texts = [];
		let paths = [];
		for(let i = 0; i < location.length; i++)
		{
			for(let j = 0; j < show_cycle_num * 5; j++)
			{
				let green_y1 = first_green[i] + j * cycle;
				let green_y2 = first_red[i] + j * cycle;
				let red_y1 = first_red[i] + j * cycle;
				let red_y2 = first_green[i] + (j + 1) * cycle;

				if(green_y2<=0){
					continue;
				}
				if(green_y2>0 && green_y1<=0){
					green_y1 = 0;
				}
				
				if(red_y2<=0){
					continue;
				}
				if(red_y2>0 && red_y1<=0){
					red_y1 = 0;
				}

				if(green_y1 >= (height-2*offset_y)/scale_y){
					green_y1 = (height-2*offset_y)/scale_y;
					green_y2 = (height-2*offset_y)/scale_y;
				}
				if(green_y1 < (height-2*offset_y)/scale_y && green_y2 >= (height-2*offset_y)/scale_y){
					green_y2 = (height-2*offset_y)/scale_y;
				}

				if(red_y1 >= (height-2*offset_y)/scale_y){
					red_y1 = (height-2*offset_y)/scale_y;
					red_y2 = (height-2*offset_y)/scale_y;
				}
				if(red_y1 < (height-2*offset_y)/scale_y && red_y2 >= (height-2*offset_y)/scale_y){
					red_y2 = (height-2*offset_y)/scale_y;
				}

				lines.push([location[i] * scale_x, scale_y * green_y1, location[i] * scale_x, scale_y * green_y2, "#0f0", 3, offset_x, offset_y, 0]);
				lines.push([location[i] * scale_x, scale_y * red_y1, location[i] * scale_x, scale_y * red_y2, "#f00", 3, offset_x, offset_y, 0]);
			}
			texts.push([location[i] * scale_x + offset_x, height-offset_y + font_size + 5, "#0f0", font_size, cross_name[i]]);
		}

		// 速度线段
		// 反向
		let pt12 = [
			location[0] * scale_x, 
			scale_y * (first_green[first_green.length - 1] + cycle * mincycle - location[location.length - 1] / velocity), 
			location[location.length - 1] * scale_x, 
			scale_y * (first_green[first_green.length - 1] + cycle * mincycle)
		];
		let pt34 = [
			location[0] * scale_x, 
			scale_y * (first_green[first_green.length - 1] + cycle * mincycle - location[location.length - 1] / velocity + band_width[1]), 
			location[location.length - 1] * scale_x, 
			scale_y * (first_green[first_green.length - 1] + cycle * mincycle + band_width[1])]

		// 正向
		let cycle_index_positive = 2;
		let pt56 = [
			location[location.length - 1] * scale_x, 
			scale_y * (first_red[first_red.length - 1] + cycle_index_positive * cycle), 
			location[0] * scale_x, 
			scale_y * (first_red[first_red.length - 1] + cycle_index_positive * cycle + location[location.length - 1] / velocity)
		];
		let pt78 = [
			location[location.length - 1] * scale_x, 
			scale_y * (first_red[first_red.length - 1] + cycle_index_positive * cycle - band_width[2]), 
			location[0] * scale_x, 
			scale_y * (first_red[first_red.length - 1] + cycle_index_positive * cycle + location[location.length - 1] / velocity - band_width[2])
		];

		let path_data = "M " + pt12[0] + "," + pt12[1] + " L " + pt12[2] + "," + pt12[3] + " L " + pt34[2] + "," + pt34[3] + " L " + pt34[0] + "," + pt34[1] + " Z";
		paths.push([path_data, "#ff0", 1, "#ccc4", offset_x, offset_y, 0]);

		path_data = "M " + pt56[0] + " " + pt56[1] + " L " + pt56[2] + " " + pt56[3] + " L " + pt78[2] + " " + pt78[3] + " L " + pt78[0] + " " + pt78[1] + " Z";
		paths.push([path_data, "#ff0", 1, "#ccc4", offset_x, offset_y, 0]);
		this.drawSvgLine(svg, lines);
		this.drawSvgText(svg, texts);
		this.drawSvgPath(svg, paths);
	}

	getOffset = () => {
		return this.relative_offset;
	}

}

