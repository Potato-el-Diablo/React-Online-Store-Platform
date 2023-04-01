import React from 'react'
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import {AiFillDelete} from "react-icons/ai";
import {Link} from "react-router-dom";

{/*import watch from "../image/watch.jpg"*/}
const Cart = () => {
  return (
    <>
        <Meta title={"Cart"}/>
        <BreadCrumb title="Cart"/>
        <section className="cart-wrapper home-wrapper-2 py-5">
            <div className="container-xxl">
                <div className="row">
                    <div className="col-12">
                        <div className="cart-header py-3 d-flex justify-content-between align-items-center">
                            <h4 className="cart-col-1">Product</h4>
                            <h4 className="cart-col-2">Price</h4>
                            <h4 className="cart-col-3">Quantity</h4>
                            <h4 className="cart-col-4">Total</h4>
                        </div>
                        {/*First product in cart*/}
                        <div className="card-data py-3 mb-2 d-flex justify-content-between align-items-center">
                            <div className="cart-col-1 gap-15 d-flex align-items-center">
                                <div className="w-25">
                                    <img src="/image/watch.jpg"
                                         className="img-fluid"
                                         alt="product-image"
                                    />
                                    {/*the above image should have {watch} imported but that causes errors*/}
                                </div>
                                <div className="w-75 text-black">
                                   <p>title</p>
                                   <p className="color">color</p>
                                   <p className="size">size</p>
                                </div>
                            </div>
                            <div className="cart-col-2">
                                <h5 className="price">R100  {/*price*/}</h5>
                            </div>
                            <div className="cart-col-3 d-flex align-items-center gap-50">
                                <div>
                                    <input className="form-control"
                                           type="number"
                                           name=""
                                           defaultValue={1}
                                           min={1}
                                           max={99}
                                           id=""
                                    />
                                </div>
                                <div>
                                    <AiFillDelete className="text-danger "/>
                                </div>
                            </div>
                            <div className="cart-col-4">
                                <h5 className="price">R100  {/*price*/}</h5>

                            </div>
                        </div>
                        {/*end of first product in cart.*/}
                    </div>
                    <div className="col-12 py-2 mt-4">
                    </div>
                    <div className="d-flex justify-content-between align-items-baseline">
                        <Link to="/product" className="button">Continue Shopping</Link>
                        <div className="d-flex flex-column align-items-end">
                            <h4>Subtotal: R 100</h4>
                            <p>Taxes and Shipping Calculated at checkout</p>
                            <Link to="/Checkout"className="button">Checkout</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </>
  )
}

export default Cart;