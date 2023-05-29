import React from 'react'
import { Link } from 'react-router-dom';
import { db } from '../pages/firebase';
import { collection, where, deleteDoc, query, getDocs, DocumentReference } from 'firebase/firestore';

export default function RemoveProductModal({
    open,
    onClose,
    onRemove,
    productID,
    productName}){

    const removeProduct = async (productID) =>{
        const productRef = collection(db, 'Products');
        const productQuery = where('id','==', productID);
        const data = await getDocs(query(productRef,productQuery));

        data.forEach((doc) => {
            const ref = new DocumentReference(doc);
            deleteDoc(ref);
        })
        
        onRemove();
    }

    
    if(!open) return null;
    
    return (
        <>
            <div className='product-overlay'/>
            <div className='product-modal'>
                <div className='modal-header'>
                    <header>Remove Product</header>
                </div>
                <div className='modal-boday'>
                    <header>Are you sure you want to remove: {productName} from the platform.</header>
                </div>

                <div className="modal-footer">
                    <Link className="button" onClick={() => removeProduct(productID)}>Confirm</Link>
                    <Link className="button" onClick={onClose} >Cancel</Link>
                </div>

            </div>
        </>
        
      )
}
 


