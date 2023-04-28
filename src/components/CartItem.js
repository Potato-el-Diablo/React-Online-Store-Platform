import React, { useState, useEffect } from 'react';

const CartItem = ({ item, onUpdateSubtotal, onRemove }) => {
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        onUpdateSubtotal(item.id, item.price * quantity);
    }, [item, quantity, onUpdateSubtotal]);

    const handleQuantityChange = (event) => {
        const newQuantity = parseInt(event.target.value);
        setQuantity(newQuantity);
    };

    const handleRemoveClick = () => {
        onRemove(item.id);
    };

    const totalPrice = item.price * quantity;

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
                <h5 className="price">R{item.price}</h5>
            </div>
            <div className="cart-col-3 d-flex align-items-center gap-50">
                <div>
                    <input
                        className="form-control"
                        type="number"
                        name=""
                        defaultValue={1}
                        min={1}
                        max={99}
                        id=""
                        onChange={handleQuantityChange}
                    />
                </div>
                <div className="cart-col-5">
                    <button onClick={handleRemoveClick} className="btn btn-danger">Delete</button>
                </div>
            </div>
            <div className="cart-col-4">
                <h5 className="price">R{totalPrice.toFixed(2)}</h5>
            </div>

        </div>
    );
};

export default CartItem;


