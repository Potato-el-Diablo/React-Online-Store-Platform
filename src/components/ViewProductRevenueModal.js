import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BarChart from './BarChart';

export default function ViewProductRevenueModal({
    open,
    onClose,
    onRefresh,
    onChangeView,
    currentView,
    timePeriodDisplay,
    myLabels,
    dataset,
    totalRev,
    productName}) {
    const [chartData, setChartData] = useState({labels: [], datasets:[{label:"",data:[]}]})
        
    //Every time the dataset changes, set the chart data to the new data
    useEffect(() => {
        if(dataset.length==0){
            return;
        }else{
            setChartData({labels:myLabels,datasets:[{label:"Revenue",data:dataset}]});
        }   
    },[dataset]);
    
    if (!open) return null

    return (
        <>
            <div className='product-overlay'/>
            <div className='product-modal'>
                <div className='modal-header'>
                    <header>Analytics for {productName}</header>
                </div>
                
                <div classname="analytic-details">
                <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                    <label for="exampleFormControlTextarea1" class="form-label">Total revenue over last {timePeriodDisplay}: R{totalRev} </label>
                    <div class="btn-group">
                        <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{currentView}</button>
                        <ul class="dropdown-menu">
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <li><a class="dropdown-item" href="#" onClick={onChangeView()}>Weekly View</a></li>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <li><a class="dropdown-item" href="#" onClick={onChangeView()}>Monthly View</a></li>
                        </ul>
                    </div>
                </div>
                    <BarChart chartData={chartData}/> 
                </div>

                <div className="modal-footer">
                    <Link className="button"  onClick={onRefresh}>Refresh</Link>
                    <Link className="button" onClick={onClose} >Close</Link>
                </div>

            </div>
        </>
    )
}
