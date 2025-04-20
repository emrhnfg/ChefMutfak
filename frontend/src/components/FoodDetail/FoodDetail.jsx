import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './FoodDetail.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FoodDetail = () => {
  const { foodId } = useParams();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  useEffect(() => {
    const fetchFoodDetail = async () => {
      try {
        const response = await axios.get(`${url}/api/food/${foodId}`);
        if (response.data.success) {
          setFood(response.data.data);
        } else {
          setError("Yiyecek bulunamadı");
        }
      } catch (error) {
        setError("Yiyecek detayları çekilirken hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetail();
  }, [foodId, url]);

  const handleAddToCart = (itemId) => {
    addToCart(itemId);
    if (food) {
      toast.success(`${food.name} sepete eklendi!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleRemoveFromCart = (itemId) => {
    if (cartItems[itemId] && cartItems[itemId] > 0) {
      removeFromCart(itemId);
      if (food) {
        toast.info(`${food.name} sepetten çıkarıldı.`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  if (error) return <div>{error}</div>;

  if (!food) return <div>Yemek bulunamadı.</div>;

  const itemQuantity = cartItems[food._id] || 0;

  return (
    <div className="food-detail">
      <div className="food-detail-container">
        <div className="food-detail-image">
          <img 
            src={food.image.startsWith('http') ? food.image : `${url}/images/${food.image}`} 
            alt={food.name} 
            className="food-detail-image" 
          />
        </div>

        <div className="food-detail-info">
          <h2>{food.name}</h2>
          <p><strong>Kategori:</strong> {food.category}</p>
          <p><strong>Açıklama:</strong> {food.description}</p>
          <p><strong>Fiyat:</strong> {food.price} TL</p>

          <div className="food-detail-cart-actions">
            <div className="cart-quantity-controls">
              <button 
                onClick={() => handleRemoveFromCart(food._id)}
                className="quantity-btn"
                disabled={itemQuantity <= 0}
              >
                <img src={assets.remove_icon_red} alt="-" />
              </button>

              <span className="quantity-display">{itemQuantity}</span>

              <button 
                onClick={() => handleAddToCart(food._id)}
                className="quantity-btn"
              >
                <img src={assets.add_icon_green} alt="+" />
              </button>
            </div>

            {itemQuantity === 0 && (
              <button 
                onClick={() => handleAddToCart(food._id)}
                className="add-to-cart-btn"
              >
                Sepete Ekle
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
