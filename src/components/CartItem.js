import React, { useState, useEffect } from 'react';
import {doc, getDoc} from "firebase/firestore";
import {db} from "../pages/firebase";

const CartItem = ({ item, quantity: initialQuantity, onUpdateSubtotal, onRemove, onUpdateQuantity }) => {

    const actualPrice = item.sale ? parseFloat(item.sale).toFixed(2) : parseFloat(item.price).toFixed(2); // Determine the actual price

    const [quantity, setQuantity] = useState(initialQuantity);

    const [stock, setStock] = useState(10000); // initialize stock to a safe value

    useEffect(() => {
        const fetchProductStock = async () => {
            const productRef = doc(db, 'Products', item.id);
            const productSnapshot = await getDoc(productRef);

            if (productSnapshot.exists()) {
                const productData = productSnapshot.data();
                setStock(productData.stock); // assume that your product's stock is stored in a 'stock' field
            }
        };

        fetchProductStock();
    }, [item.id]); // dependency on item.id

    useEffect(() => {
        onUpdateSubtotal(item.id, actualPrice * quantity);
    }, [item, quantity, onUpdateSubtotal]);

    const handleChange = (event) => {
        const newQuantity = parseInt(event.target.value);

        if (newQuantity < 1 || newQuantity > stock) {
            return;
        }

        setQuantity(newQuantity);
        const newSubtotal = newQuantity * actualPrice;
        onUpdateSubtotal(item.id, newSubtotal);
        onUpdateQuantity(item.id, newQuantity);
    };

    const handleRemoveClick = () => {
        onRemove(item.id);
    };

    const totalPrice = actualPrice * quantity;

    return (
        <div className="card-data py-3 mb-2 d-flex justify-content-between align-items-center">
            <div className="cart-col-1 gap-15 d-flex align-items-center">
                <div className="w-25">
                    {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                    <img src={item.image} className="img-fluid" alt="product-image" />
                </div>
                <div className="w-75 text-black">
                    <p>{item.name}</p>
                    <p className="color">{item.color}</p>
                    <p className="size">{item.size}</p>
                </div>
            </div>
            <div className="cart-col-2">
                <h5 className="price">R{actualPrice}</h5>
            </div>
            <div className="cart-col-3 d-flex align-items-center gap-50">
                <div>
                    <input
                        className="form-control"
                        type="number"
                        name=""
                        defaultValue={initialQuantity}
                        min={1}
                        max={stock}
                        id=""
                        onChange={handleChange} // Update this line
                        role={"spinbutton"}
                    />
                </div>
                <div className="cart-col-5">
                    <button onClick={handleRemoveClick} className="btn btn-danger" >Delete</button>
                </div>
            </div>
            <div className="cart-col-4">
                <h5 className="price">R{totalPrice.toFixed(2)}</h5>
            </div>
        </div>
    );
};

export default CartItem;
