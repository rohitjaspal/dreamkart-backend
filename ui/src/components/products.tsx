import "./products.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { environment } from "../environment";

export interface Product {
  _id: string;
  title: string;
  description: string;
  quantity: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

function products() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [products, setProducts] = useState<Product[]>([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [count, setCount] = useState(0);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getProducts();  
  }, []);
// eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    console.log('rohit' , count);  
  }, [count]);

  const getProducts = async () => {
    try {
      const result = await axios.get(`${environment.baseURL}/product`);
      if (result.status === 200) {
        setProducts([...result.data.data]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <button onClick={() => setCount(count + 1)}>
        Count {count}
      </button>





      {products.map((product , index) => {
        return (
          <div className="product-card" key={index}>
            <div
              className="product-image"
              style={{ backgroundImage: `url(${product.imageUrl})` }}
            ></div>

            <div className="product-info">
              <div className="product-title">{product.title}</div>
              <div className="product-description">{product.description}</div>
              <div className="product-quantity">
                Quantity {product.quantity}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default products;
