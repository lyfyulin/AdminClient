import React, { Component } from 'react'
import DataBox from '../../components/data-box'

export default class Nonlocal extends Component {
    render() {
        return (
            <div className="full lyf-center">
                <div className="lyf-row-7" style={{ display: 'flex' }}>
                    <div className="lyf-col-6 lyf-center">
                        <DataBox title={ "外地车分布" }>
                        </DataBox>
                    </div>
                    <div className="lyf-col-4 lyf-center">
                        <DataBox title={ "路段运行状态" }>
                        </DataBox>
                    </div>
                </div>
                
                <div className="lyf-row-3">
                </div>
            </div>
        )
    }
}
