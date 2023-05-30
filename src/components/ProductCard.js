// ProductCard.js
// eslint-disable-next-line no-unused-vars
import ReactStars from "react-rating-stars-component";
import { Link, useLocation } from "react-router-dom";

// Added product Sale to latest update for spint 4 check line 69, 
// need to add formatting for font colour and size
// readjust the width since sale price pushes the buttons out of order
// wishlist

const ProductCard = ({
                         grid,
                         productImage,
                         brand,
                         productName,
                         productDescription,
                         productPrice,
                         productStock,
                         productId,
                         productSale,
                         productCategory,
                         averageRating,

                      
                     }) => {

    let location = useLocation();
    
    // function to calculate discount percentage
    const calculateDiscountPercentage = () => {
        if (productSale !== '') {
          const discount = productPrice - productSale;
          const percentage = (discount / productPrice) * 100;
          return Math.round(percentage);
        }
        return 0;
      };


    return (
        <>
            <div
                className={` ${location.pathname === "/store" ? `gr-${grid}` : "col-3"} productCard`}
                data-testid="product-card"
                >
            <Link
                to={`/product/${productName}`}
                className="product-card position-relative"
                state={{
                    productImage,
                    brand,
                    productName,
                    productDescription,
                    productPrice,
                    productStock,
                    productId,
                    productSale,
                    productCategory,
                    averageRating,
                }}>
                    <div className="product-image">
                        <img src={productImage} alt={productName} width="150" height="150"/>
                        {/* display the discount percentage */}
                        {productSale !== '' && (
                            <>
                    <div className="discount-percentage">{calculateDiscountPercentage()}% <br/>OFF!</div>
                    {/* <div className="limited-offer">Limited Offer!</div> */}
                        </>
                    )}
                    </div>
                    <div className="product-details">
                        <h6 className="brand">{brand} </h6>

                        {/* adjusted product name so that it slices long names */}
                        {productName && typeof productName === "string" && (
                            <h5 className="product-title">
                                {productName.length > 25
                                    ? productName.substring(0, 25) + "..."
                                    : productName}
                            </h5>
                        )}
                        <ReactStars
                            count={5}
                            value={averageRating}
                            edit = {false}
                            size={24}
                            activeColor="#ffd700"
                        />

                        {/* added this div to fix formattinng issues */}
                        {/* invisible text to help with button alignment */}
                        <div className="price-container">
                        <p className={`price ${productSale !== '' ? 'salePriceStrikethrough' : ''}`}>R {parseFloat(productPrice).toFixed(2)}</p>
                            {productSale !== '' ? (
                            <p className="salePrice standout">R {parseFloat(productSale).toFixed(2)}</p>
                            ) : (
                            <p className="invisibleText">&nbsp;</p>
                            )}

                            
                        </div>

                        <div className="add-to-cart">
                            <Link><img src="/images/add-cart.svg" alt="addcart"/>
                            </Link>
                            <label> View Product </label>
                        </div>

                    </div>
                    <div className="action-bar position-absolute">
                        <div className="d-flex flex-column">

                            <Link>
                                <img src="/images/wish.svg" alt="wishlist"/>
                            </Link>
                        </div>
                    </div>
                    <div className="add-cart">

                    </div>
                </Link>
            </div>
        </>
    )
}

export default ProductCard;
