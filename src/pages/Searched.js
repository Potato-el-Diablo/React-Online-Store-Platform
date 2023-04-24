import React, { useState, useEffect } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { db } from "./firebase";
import { Link, useSearchParams } from "react-router-dom";

const Searched = () => {
    const [results, setResults] = useState([]);
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q"); {/* gets query from header.js*/}

    useEffect(() => {
        if (query) {
            searchProducts();
        }
    }, [query]);

    const searchProducts = async () => {
        const productsRef = db.collection('Products'); {/* queries firestore for names eqaul and similar to the query given*/}
        const querySnapshot = await productsRef
            .orderBy("name")
            .startAt(query)
            .endAt(query + "\uf8ff")
            .get();

        const searchResults = [];
        querySnapshot.forEach((doc) => {
            searchResults.push({ id: doc.id, data: doc.data() });
        });

        setResults(searchResults);
    };


    return (
        <>
            <Meta title={"Search Results"} />
            <BreadCrumb title="Search Results" />
            <ul>
                {results.map((result) => (
                    <li key={result.id}> {/*dispalys products with their images as well as the link to the product pagey*/}
                        <Link to={`/product/${result.id}`}> 
                            <img src={result.data.image} alt={result.data.name} />
                            <h3>{result.data.name}</h3> 
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Searched;
