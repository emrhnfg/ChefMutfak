import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom'; // Link importunu ekliyoruz
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './FoodItem.css';

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  const handleAddToCart = (itemId) => {
    addToCart(itemId);
    toast.success(`${name} sepete eklendi!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleRemoveFromCart = (itemId) => {
    if (cartItems[itemId] && cartItems[itemId] > 0) {
      removeFromCart(itemId);
      toast.info(`${name} sepetten çıkarıldı.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  

  return (
    
    <div className='food-item'>
      <div className="food-item-img-container">
        <Link to={`/food/${id}`} className="food-image-link">
          <img
            className='food-item-image'
            src={image.startsWith('http') ? image : `${url}/images/${image}`}
            alt={name}
          />
          <div className="image-overlay">
            <span className="overlay-text">Daha fazlasını gör</span>
          </div>
        </Link>
        

        {!cartItems[id] ? (
          <button 
            className='add-to-cart-button'
            onClick={() => handleAddToCart(id)}
          >
            Sepete Ekle
          </button>
        ) : (
          <div className='food-item-counter'>
            <img
              onClick={() => handleRemoveFromCart(id)}
              src={assets.remove_icon_red}
              alt="Remove from Cart"
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => handleAddToCart(id)}
              src={assets.add_icon_green}
              alt="Add to Cart"
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">{price} TL</p>
      </div>
      
    </div>
  );
};

export default FoodItem;
