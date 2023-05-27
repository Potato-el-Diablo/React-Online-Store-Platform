import React, { useState, useEffect } from 'react'
import { Link, matchRoutes } from 'react-router-dom'
import { db } from '../pages/firebase';
import { collection, where,  query, getDocs, getDoc} from 'firebase/firestore';
import { toast } from 'react-toastify';
import BarChart from './BarChart';

export default function ViewProductRevenueModal({open, onClose, onRefresh, myLabels,dataset,totalRev,productName}) {
    const [chartData, setChartData] = useState({labels: [], datasets:[{label:"",data:[]}]})
        
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
                    <label for="exampleFormControlTextarea1" class="form-label">Total revenue over last year: R{totalRev} </label>
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
