import React, { useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import ProductCard from "../components/ProductCard";
/*lastest commit*/
const OurStore = () => {
    const[grid, setGrid] = useState(4);
    
  return (
    <>
    <Meta title={"OurStore"}/>
    <BreadCrumb title="Our Store"/> 
    <div className="store-wrapper home-wrapper-2 py-5" >
        <div className="container-xxl">
            <div className="row" style={{"width":"1500px"}}>
                <div className="col-2">
                    <div className="filter-card mb-3">
                        <h3 className="filter-title">Shop By Catergory</h3>
                        <div >
                            <ul ps-0>
                                <li>Watch</li>
                                <li>TV</li>
                                <li>Camera</li>
                                <li>Laptop</li>
                            </ul>
                        </div>
                    </div>
                    <div className="filter-card mb-3">
                        <h3 className="filter-title">Filter By</h3>
                        <div>
                            <h5 className="sub-title">Availability</h5>
                            <div>
                            <div class="form-check">
                                <input className="form-check-input" type="checkbox" value="checked" id="" />
                                <label className="form-check-label" htmlfor="">
                                    In Stock(2)
                                </label>
                            </div>
                            <div class="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="" />
                                <label className="form-check-label" htmlfor="">
                                    Out of Stock(0)
                                </label>
                            </div>
                            </div>
                            <h5 className="sub-title">Price</h5>
                            <div className="d-flex align-items-center gap-10">
                                <div className="form-floating ">
                                    <input type="" className="form-control py-1" id="" placeholder="From"/>
                                    <label htmlfor="floatingInput">From</label>
                                </div>
                                <div className="form-floating ">
                                    <input type="" className="form-control py-1" id="" placeholder="To"/>
                                    <label htmlfor="floatingInput">To</label>
                                </div>
                            </div>
                            <h5 className="sub-title">Colours</h5>
                            <div>
                                <ul className="colors ps-0">
                                    <li className="color1"></li>
                                    <li className="color2"></li>
                                    <li className="color3"></li>
                                    <li className="color4"></li>
                                    <li className="color5"></li>
                                    <li className="color6"></li>
                                    <li className="color7"></li>
                                    <li className="color8"></li>
                                    <li className="color9"></li>
                                    
                                </ul>

                            </div>
                            <h5 className="sub-title">Sizes</h5>
                            <div>
                            <div class="form-check">
                                <input className="form-check-input" type="checkbox" value="checked" id="color-1" />
                                <label className="form-check-label" htmlfor="">
                                    S (2)
                                </label>
                            </div>
                            <div class="form-check">
                                <input className="form-check-input" type="checkbox" value="checked" id="color-2" />
                                <label className="form-check-label" htmlfor="">
                                    M (2)
                                </label>
                            </div>
                            <div class="form-check">
                                <input className="form-check-input" type="checkbox" value="checked" id="color-3" />
                                <label className="form-check-label" htmlfor="">
                                    L (2)
                                </label>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="filter-card mb-3">
                        <h3 className="filter-title mb-3">Product Tags</h3>
                        <div>
                            <div className="product-tags d-flex flex-wrap align-items-center gap-10">
                                <span className="badge bg-light text-secondary rounder-3 py-2 px-3">Headphone</span>
                                <span className="badge bg-light text-secondary rounder-3 py-2 px-3">Watches</span>
                                <span className="badge bg-light text-secondary rounder-3 py-2 px-3">Laptop</span>
                                <span className="badge bg-light text-secondary rounder-3 py-2 px-3">Mobile</span>
                                <span className="badge bg-light text-secondary rounder-3 py-2 px-3">Apple</span>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className="col-10">
                    <div className="filter-sort-grid mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-10">
                            <p className="mb-0 d-block" style={{"width":"100px"}}>Sort By</p>
                            <select name="" className="form-control form-select" id="">
                                <option value="manual" >Featured</option>
                                <option value="best-selling" selected="selected" >Best Selling</option>
                                <option value="title-ascending" >Alphabetically A-Z</option>
                                <option value="title-descedning" >Alphabetically Z-A</option>
                                <option value="price-ascending" >Price, low to high</option>
                                <option value="price-descending" >Price, high to low</option>
                                
                            </select>
                        </div>
                        <div className="d-flex align-items-center gap-10">
                            <p className="totalproducts">21 products</p>
                        </div>
                        </div>
                    </div>
                    <div className="products-list flex-wrap">
                        <div className="d-flex  gap-10">
                            <ProductCard grid= {grid}/>
                            <ProductCard grid= {grid} />
                            <ProductCard grid= {grid}/>
                            <ProductCard grid= {grid}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default OurStore;