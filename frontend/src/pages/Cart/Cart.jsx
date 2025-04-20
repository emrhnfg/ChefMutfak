import React from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import './Cart.css'

const Cart = () => {

  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);

  const navigate = useNavigate();

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Ürünler</p>
          <p>Ürün Adı</p>
          <p>Fiyat</p>
          <p>Adet</p>
          <p>Toplam Ücret</p>
          <p>Kaldır</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div>
                <div className='cart-items-title cart-items-item'>
                  <img src={url+"/images/"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>{item.price} TL</p>
                  <p>{cartItems[item._id]}</p>
                  <p>{item.price * cartItems[item._id]} TL</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            )
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Sepet Toplamı</h2>
          <div>
            <div className="cart-total-details">
              <p>Ara Toplam</p>
              <p>{getTotalCartAmount()} TL</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Teslimat Ücreti</p>
              <p>{getTotalCartAmount() === 0 ? 0 : 2} TL</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Toplam</b>
              <b>{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2} TL</b>
            </div>
          </div>
          <button onClick={() => navigate('/order')}>ÖDEME SAYFASINA GEÇ</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>Bir promosyon kodunuz varsa, buraya girin</p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='promosyon kodu' />
              <button>Gönder</button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    
  )
}

export default Cart
