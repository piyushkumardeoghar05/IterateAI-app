import React, { useState, useEffect } from "react";
import classes from "./Product_list_gen.module.css";
// require('dotenv').config();
const ProductList = () => {
  const [idea, setIdea] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
  const apiKey = process.env.REACT_APP_OPEN_AI_KEY; // Replace with your actual API key
  // console.log(process.env.REACT_APP_OPEN_AI_KEY);
  const endpoint = "https://api.openai.com/v1/chat/completions";

  useEffect(() => {
    if (idea.trim() !== "") {
      fetchProducts();
    } else {
      setProducts([]); // Clear products if idea is empty
    }
  }, [idea]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
        setIsError(false);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `List products with properties related to "${idea}"`,
            },
          ],
        }),
      });
      const data = await response.json();
      if (data.choices && Array.isArray(data.choices)) {
        const productsList = extractProducts(data.choices);
        setProducts(productsList);
        // setIsError(false);
        // setIsLoading(false);

      } else {
        console.error("Invalid API response:", data);
        if(idea!='')
            setIsError(true);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      if(idea!='')
            setIsError(true);
    }
    finally {
      setIsLoading(false);
  }
  };

  const handleInputChange = (event) => {
    setIdea(event.target.value);
  };

  // Function to extract products from API response
  const extractProducts = (choices) => {
    const productsList = [];
    choices.forEach((choice) => {
      const content = choice.message.content.trim();
      if (content !== "") {
        const product = { name: "", properties: [] };
        const lines = content.split("\n");
        product.name = lines[0];
        for (let i = 1; i < lines.length; i++) {
          const property = lines[i].split(":");
          if (property.length === 2) {
            product.properties.push({
              name: property[0].trim(),
              value: property[1].trim(),
            });
          }
        }
        productsList.push(product);
      }
    });
    return productsList;
  };

  // return (
  //   <div className="flex flex-col items-center justify-center min-h-screen">
  //     <form>
  //       <input
  //         type="text"
  //         placeholder="Enter your idea..."
  //         value={idea}
  //         onChange={handleInputChange}
  //       />
  //     </form>
  //     <div>
  //       <h2>Products</h2>
  //       <ul>
  //         {products.map((product, index) => (
  //           <li key={index}>
  //             <strong>{product.name}</strong>
  //             <ul>
  //               {product.properties.map((property, index) => (
  //                 <li key={index}>
  //                   <strong>{property.name}:</strong> {property.value}
  //                 </li>
  //               ))}
  //             </ul>
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //   </div>
  // );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className={classes.inputContainer}>
        <div className={classes.promptContainer}>
          <label className={classes.promptstat} htmlFor="prompt">
            Enter a Product Idea:{" "}
          </label>
        </div>
        <div className={classes.img_input}>
          <form>
            <input
            className={classes.inputfield}
              type="text"
              placeholder="Enter your idea..."
              value={idea}
              onChange={handleInputChange}
            />
          </form>
        </div>
        
      </div>
      {products.length > 0 && (
          <div className={classes.allimgContainer}>
            <div className={classes.listcontainer}>
              {products.map((product, index) => (
                <div key={index}>
                  {/* <strong>{product.name}</strong> */}
                    {product.properties.map((property, index) => (
                      <div className={classes.listcontainer2} key={index}>
                        <strong>{property.name}:</strong> {property.value}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        )}
      {isLoading ? (
        <div className={classes.loading}>Loading...</div>
      ) : (
        isError && (
          <div className={classes.errorstat}>
            Some error occurred. Try searching something different.
          </div>
        )
      )}
    </div>
  );
};

export default ProductList;
