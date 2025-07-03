import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import './PlaceOrder.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {

   const {getTotalCartAmount,token,food_list,cartItems,url} = useContext(StoreContext)

   const [data,setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
   })

   const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
   }

   const placeOrder = async (event) => {
      event.preventDefault();
      let orderItems = [];
      food_list.map((item)=>{
        if (cartItems[item._id]>0) {
          let itemInfo = item;
          itemInfo["quantity"] = cartItems[item._id];
          orderItems.push(itemInfo)
        }
      })
      let orderData = {
        address:data,
        items:orderItems,
        amount:getTotalCartAmount()+10,
      }
      let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}});
      if (response.data.success) {
        const {session_url} = response.data;
        window.location.replace(session_url);
      }
      else{
        alert("Hata");
      }
   }

   const navigate = useNavigate();

   useEffect(()=>{
    if (!token) {
      navigate('/cart')
    }
    else if(getTotalCartAmount()===0)
    {
      navigate('/cart')
    }
   },[token])

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Teslimat Bilgileri</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='Ad'/>
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Soyad'/>
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='E-posta adresi'/>
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Cadde'/>
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='Şehir'/>
          <input required name='state'onChange={onChangeHandler} value={data.state} type="text" placeholder='Bölge'/>
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Posta Kodu'/>
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Ülke'/>
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Telefon'/>
      </div>
      <div className="place-order-right">
      <div className="cart-total">
          <h2>Siparişiniz</h2>
          <div>
          <div className="cart-total-details">
              <p>Ara Toplam</p>
              <p>{getTotalCartAmount()} TL</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Teslimat Ücreti</p>
              <p>{getTotalCartAmount() === 0 ? 0 : 10} TL</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Toplam</b>
              <b>{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 10} TL</b>
            </div>
          </div>
          <button type='submit' >ÖDEME YAP</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
