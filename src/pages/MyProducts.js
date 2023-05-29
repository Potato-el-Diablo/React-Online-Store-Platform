import React, { useState, useEffect } from 'react';
import {collection, getDocs, query, where} from "firebase/firestore";
import { auth } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb';
import SellerProductCard from '../components/SellerProductCard';
import { Link } from 'react-router-dom';
import { db } from "./firebase";
import AddProductModal from '../components/AddProductModal';
import UpdateProductModal from '../components/UpdateProductModal';
import ViewRevenueModal from '../components/ViewRevenueModal';
import ViewProductRevenueModal from '../components/ViewProductRevenueModal';
import RemoveProductModal from '../components/RemoveProductModal';

const MyProducts = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isProductRevenueOpen, setIsProductRevenueOpen] = useState(false);
    const [isRevenueOpen, setIsRevenueOpen] = useState(false);
    const [isRemoveOpen, setIsRemoveOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [seller, setSeller] = useState([]);
    const [analytics, setAnalytics] = useState([]);
    const [revenueData, setRevenueData] = useState([]); 
    const [totalRevenue, setTotalRevenue] = useState([]);
    const [timePeriod, setTimePeriod] = useState(new Map());
    const [analyticView, setAnalyticView] = useState("Monthly View");
    const [timePeriodDisplay, setTimePeriodDisplay] = useState("year");
    const grid = 12; //Static Grid size for viewing products

    const [products, setProducts] = useState([]);

    //Get product list from Firebase according to user
    useEffect(() => {
        const authInstance = getAuth();
        const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
            if (user) {
                const email = user.email;
                const productsRef = collection(db, 'Products');
                const productsQuery = where('sellerEmail', '==', email);
                const data = await getDocs(query(productsRef, productsQuery));

                setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            }
        });

        return () => {
            if(typeof unsubscribe === "function"){
                unsubscribe();
            }
        };
    }, []);

    console.log(products);

    //Manages making updates to products
    const handleEditOnClick = (product) => {
        setSelectedProduct(product);
        setIsUpdateOpen(true);
    };

    //Refreshes the page when any changes are made
    const refreshProducts = async () => {
        const email = auth.currentUser.email;
        const productsRef = collection(db, 'Products');
        const productsQuery = where('sellerEmail', '==', email);
        const data = await getDocs(query(productsRef, productsQuery));

        setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    //Manages view of removing products 
    const handleRemoveOnClick = (product) => {
        setSelectedProduct(product);
        setIsRemoveOpen(true);
    };

    

    //Handle the change in analytic View
    const handleAnalyticView = (view) => {
        setAnalyticView(view.target.text);
    }
    
    //Get analytics for User
    const getAnalytics = async () =>{
        const email = auth.currentUser.email;
        const sellerRef = collection(db, 'sellers');
        const sellerQuery = where('companyEmail', '==', email);
        const sellerData = await getDocs(query(sellerRef,sellerQuery,));
    
        setSeller(sellerData.docs.map((doc)=> ({...doc.data(), id: doc.id})));
    
        const analyticsCollectionRef = collection(sellerRef,seller[0].id+"/analytics");

        const handleAnalytics = async () =>{
            const analyticsData = await getDocs(analyticsCollectionRef);
                
            setAnalytics(analyticsData.docs.map((doc)=> ({...doc.data(), id:doc.id})));
        }

        handleAnalytics();
    }

    //Handle pressing Global Revenue
    const viewGlobalRevenue = () =>{
        getAnalytics();
        setIsRevenueOpen(true);
        if(analyticView==="Monthly View"){   
            setTimePeriodDisplay("year");
            totalMonthlyRevenue();
        }else{
            setTimePeriodDisplay("month");
            totalWeeklyRevenue();
        }
        
    }


    //Handle Total revenue of user
    const totalMonthlyRevenue = () =>{

        const months = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"}

        let tempTime = [];
        let tempRevenue = [0,0,0,0,0,0,0,0,0,0,0,0];
        const currDate = new Date();
        const currMonth = currDate.getMonth()+1;
        let tempTotal = 0;
        
        for(let i=0;i<12;i++){
            let temp = currMonth-i; 
            if(temp<1){
                temp+=12;
            } 
            tempTime.push(months[temp]);
        }

        analytics.forEach((object) => {
            const [day, month, year] = object.id.split("-");

            const date = new Date(`${year}-${month}-${day}`);

            const monthDiff = (currDate.getFullYear() - date.getFullYear())*12+(currMonth - parseInt(month,10));
            
            if((monthDiff<12)&&(monthDiff >=0)){
                tempRevenue[monthDiff]+=object.TotalRevenue;
                tempTotal += object.TotalRevenue;
            } 
        })

        tempTime.reverse();
        tempRevenue.reverse();

        setTimePeriod(tempTime);
        setRevenueData(tempRevenue);
        setTotalRevenue(tempTotal);
    }

    const totalWeeklyRevenue = () =>{

        let tempRevenue = [0,0,0,0];
        let tempTotal = 0;
        
        const today = new Date();
    
        const oneWeek = 7 * 24 * 60 * 60 * 1000; 
        const currentDayOfWeek = today.getDay();
        const daysToSubtract = currentDayOfWeek > 1 ? currentDayOfWeek - 1 : 6;
        
        analytics.forEach((object) => {
            const dateParts = object.id.split('-');
            const inputDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
            const currentMonday = new Date(inputDate.getTime() - (daysToSubtract * 24 * 60 * 60 * 1000));

            const timeDiff = today.getTime() - currentMonday.getTime();
            
            const weeksAgo = Math.floor(timeDiff / oneWeek);

            if((weeksAgo<4)&&(weeksAgo >=0)){
                tempRevenue[weeksAgo]+=object.TotalRevenue;
                tempTotal += object.TotalRevenue;
            } 
        })

        tempRevenue.reverse();

        setTimePeriod(["3 Weeks Ago","2 Weeks Ago","Last Week","This Week"]);
        setRevenueData(tempRevenue);
        setTotalRevenue(tempTotal);

    }

    //Handle product change in analytic View
    const handleProductAnalyticView = (view) => {
        setAnalyticView(view.target.text);
    }

    //Handle individual product Revenue
    const totalMonthlyProductRevenue = () =>{

        const months = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"}

        let tempTime = [];
        let tempRevenue = [0,0,0,0,0,0,0,0,0,0,0,0];
        const currDate = new Date();
        const currMonth = currDate.getMonth()+1;
        let tempTotal = 0;
        
        for(let i=0;i<12;i++){
            let temp = currMonth-i; 
            if(temp<1){
                temp+=12;
            } 
            tempTime.push(months[temp]);
        }

        analytics.forEach((object) => {
            const [day, month, year] = object.id.split("-");

            const date = new Date(`${year}-${month}-${day}`);

            const monthDiff = (currDate.getFullYear() - date.getFullYear())*12+(currMonth - parseInt(month,10));
            
            const mockObject = new Map(Object.entries(object));
            if((monthDiff<12)&&(monthDiff >=0)&&(mockObject.has(selectedProduct.id))){
                tempRevenue[monthDiff]+=mockObject.get(selectedProduct.id).revenue;
                tempTotal += mockObject.get(selectedProduct.id).revenue;
            } 
        })

        tempTime.reverse();
        tempRevenue.reverse();

        setTimePeriod(tempTime);
        setRevenueData(tempRevenue);
        setTotalRevenue(tempTotal);
    }

    //Handle single product weekly revenue
    const totalWeeklyProductRevenue = () =>{

        let tempRevenue = [0,0,0,0];
        let tempTotal = 0;
        
        const today = new Date();
    
        const oneWeek = 7 * 24 * 60 * 60 * 1000; 
        const currentDayOfWeek = today.getDay();
        const daysToSubtract = currentDayOfWeek > 1 ? currentDayOfWeek - 1 : 6;
        
        analytics.forEach((object) => {
            const dateParts = object.id.split('-');
            const inputDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
            const currentMonday = new Date(inputDate.getTime() - (daysToSubtract * 24 * 60 * 60 * 1000));

            const timeDiff = today.getTime() - currentMonday.getTime();
            
            const weeksAgo = Math.floor(timeDiff / oneWeek);

            const mockObject = new Map(Object.entries(object));
            if((weeksAgo<4)&&(weeksAgo >=0)&&(mockObject.has(selectedProduct.id))){
                tempRevenue[weeksAgo]+=mockObject.get(selectedProduct.id).revenue;
                tempTotal += mockObject.get(selectedProduct.id).revenue;
            } 
        })

        tempRevenue.reverse();

        setTimePeriod(["3 Weeks Ago","2 Weeks Ago","Last Week","This Week"]);
        setRevenueData(tempRevenue);
        setTotalRevenue(tempTotal);

    }

    const viewProductRevenue = async (product) =>{
        setSelectedProduct(product); 
        await getAnalytics();
        setIsProductRevenueOpen(true);

        if(analyticView==="Monthly View"){   
            setTimePeriodDisplay("year");
            totalMonthlyProductRevenue();
        }else{
            setTimePeriodDisplay("month");
            totalWeeklyProductRevenue();
        }
        
    }

    const viewProductRevenueRefresh = () =>{
        setIsProductRevenueOpen(true);
        getAnalytics();
        if(analyticView==="Monthly View"){   
            setTimePeriodDisplay("year");
            totalMonthlyProductRevenue();
        }else{
            setTimePeriodDisplay("month");
            totalWeeklyProductRevenue();
        }
    }



    return (
        <>
            <Meta title={'My Products'} />
            <BreadCrumb title="My Products" />
            <div className="store-wrapper home-wrapper-2 py-5">
                <div className="row">
                    <div className="col-9">
                        <div className="filter-sort-grid mb-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-10">
                                    <p className="mb-0 d-block" style={{ width: '100px' }}>
                                        Sort By:
                                    </p>
                                    <select name="" className="form-control form-select" id="">
                                        <option value="manual">Featured</option>
                                        <option value="best-selling">
                                            Best Selling
                                        </option>
                                        <option value="title-ascending">Alphabetically, A-Z</option>
                                        <option value="title-descending">Alphabetically, Z-A</option>
                                        <option value="price-ascending">Price, low to high</option>
                                        <option value="price-descending">Price, high to low</option>
                                        <option value="created-ascending">Date, old to new</option>
                                        <option value="created-descending">Date, new to old</option>
                                    </select>
                                </div>
                                <div className="d-flex align-items-center gap-5">
                                    <Link className="button" onClick={() =>setIsOpen(true)}>Add Product</Link>
                                    <Link className="button" onClick={() => viewGlobalRevenue(true)}>View Revenue</Link>
                                </div>
                                <div className="d-flex align-items-center gap-10">
                                    <p className="totalproducts">21 products</p>
                                </div>
                            </div>
                        </div>
                        <div className="products-list pb-5">
                            <div className="d-flex gap-10 flex-wrap">
                                {products.map((product) => (
                                    <SellerProductCard
                                        key={product.id}
                                        productId={product.id}
                                        grid={grid}
                                        productImage={product.image}
                                        brand={product.brand}
                                        productName={product.name}
                                        productDescription={product.description}
                                        productPrice={product.price}
                                        productStock={product.stock || 'Not available'}
                                        productSale={product.sale || ''}
                                        editOnClick={() => handleEditOnClick(product)}
                                        viewOnClick={() => viewProductRevenue(product)}
                                        removeOnClick={() => handleRemoveOnClick(product)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddProductModal open={isOpen} onClose={() => setIsOpen(false)} onProductAdd={refreshProducts} />
            {selectedProduct && (
                <UpdateProductModal
                    open={isUpdateOpen}
                    onClose={() => setIsUpdateOpen(false)}
                    productId={selectedProduct.id}
                    productImage={selectedProduct.image}
                    brand={selectedProduct.brand}
                    productName={selectedProduct.name}
                    productDescription={selectedProduct.description}
                    productTags={selectedProduct.tags || []}
                    productPrice={selectedProduct.price}
                    productStock={selectedProduct.stock || 'Not available'}
                    onProductUpdate={refreshProducts}
                />
                
            )}
            {selectedProduct && (
                <ViewProductRevenueModal
                    open={isProductRevenueOpen}
                    onClose={() => setIsProductRevenueOpen(false)}
                    onRefresh={() => viewProductRevenueRefresh()}
                    onChangeView={() => handleProductAnalyticView}
                    currentView={analyticView}
                    timePeriodDisplay={timePeriodDisplay}
                    productName={selectedProduct.name}
                    dataset={revenueData}
                    totalRev={totalRevenue}
                    myLabels={timePeriod}
                />
            )}

            <ViewRevenueModal 
                open={isRevenueOpen}
                onClose={() => setIsRevenueOpen(false)}
                onRefresh={() => viewGlobalRevenue()}
                onChangeView={() => handleAnalyticView}
                currentView={analyticView}
                timePeriodDisplay={timePeriodDisplay}
                myLabels={timePeriod}
                dataset={revenueData}
                totalRev={totalRevenue}
                />
            
            {selectedProduct && (
                <RemoveProductModal 
                    open={isRemoveOpen}
                    onClose={() => setIsRemoveOpen(false)}
                    onRemove={() => setIsRemoveOpen(false)}
                    productID={selectedProduct.id}
                    productName={selectedProduct.name}
                />
            )}
        </>
    );
};

export default MyProducts

