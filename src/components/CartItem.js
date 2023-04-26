import React, { useState, useEffect } from 'react';

const CartItem = ({ item, onUpdateSubtotal, onRemove }) => {
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        onUpdateSubtotal(item.price * quantity, 'add');
        return () => onUpdateSubtotal(item.price * quantity, 'subtract');
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
                    <p>{item.title}</p>
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
                <div onClick={handleRemoveClick}>
                    <svg
                        role="img"
                        aria-label="remove"
                        className="text-danger"
                        fill="currentColor"
                        height="1em"
                        stroke="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 1024 1024"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >


                    <path
                            d="M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zm-200 0H360v-72h304v72z"
                        />
                    </svg>
                </div>
            </div>
            <div className="cart-col-4">
                <h5 className="price">R{totalPrice.toFixed(2)}</h5>
            </div>
        </div>
    );
};

export default CartItem;


