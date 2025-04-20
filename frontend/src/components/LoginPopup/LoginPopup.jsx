import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import './LoginPopup.css'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"

const LoginPopup = ({ setShowLogin }) => {

  const {url, setToken} = useContext(StoreContext)

  const [currState, setCurrState] = useState("Login")
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const showToast = (message, type = 'success') => {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    toast.innerHTML = `
      <div class="toast-content">${message}</div>
      <button class="toast-close">&times;</button>
    `;
    
    container.appendChild(toast);
    
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', () => {
      container.removeChild(toast);
    });
    
    setTimeout(() => {
      if (container.contains(toast)) {
        container.removeChild(toast);
      }
    }, 3000);
  }

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const onLogin = async (event) => {
    event.preventDefault()
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login"      
    } else {
      newUrl += "/api/user/register"
    }
    
    try {
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        
        const message = currState === "Login" ? 
          "Giriş başarılı! Hoş geldiniz." : 
          "Hesabınız başarıyla oluşturuldu!";
        showToast(message, 'success');
        
        setTimeout(() => {
          setShowLogin(false);
        }, 3000);
      } else {
        showToast(response.data.message, 'error');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
      showToast(errorMessage, 'error');
      console.error('Error:', error);
    }
  }

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} action="" className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState === "Login" ? "Giriş Yap" : "Hesap Oluştur"}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? <></> : <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Adınız' required />}
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='E-posta adresiniz' required />
          <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Şifre' required />
        </div>
        <button type='submit'>{currState === "Sign Up" ? "Hesap oluştur" : "Giriş yap"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>Devam ederek kullanım koşulları ve gizlilik politikasını kabul ediyorum</p>
        </div>
        {currState === "Login"
          ? <p>Yeni bir hesap oluşturmak ister misiniz? <span onClick={() => setCurrState("Sign Up")}>Buraya tıklayın</span></p>
          : <p>Zaten hesabınız var mı? <span onClick={() => setCurrState("Login")}>Giriş yapın</span></p>
        }
      </form>
    </div>
  )
}

export default LoginPopup
