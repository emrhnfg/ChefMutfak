import React, { useState, useContext, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("menu");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // Yükleniyor durumu için

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const debouncedSearch = debounce(async (term) => {
    if (term.trim() === '') {
      setFilteredFoods([]);
      setShowSearchResults(false);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await axios.get(`http://localhost:4000/api/food/search?term=${term}`);

      if (response.data.success) {
        setFilteredFoods(response.data.data);
      } else {
        setFilteredFoods([]);
      }

      setShowSearchResults(true);
      setIsSearching(false);
    } catch (error) {
      console.error('Arama yapılırken hata oluştu:', error);
      setFilteredFoods([]);
      setIsSearching(false);
    }
  }, 300);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      setFilteredFoods([]);
      setShowSearchResults(false);
    } else {
      debouncedSearch(term);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const searchContainer = document.getElementById('search-container');
      if (searchContainer && !searchContainer.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFoodClick = (foodId) => {
    setShowSearchResults(false);
    setSearchTerm('');
    navigate(`/food/${foodId}`);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <div className='navbar'>
      <Link to={'/'}><img src={assets.logo1} alt="" className="logo" /></Link>
      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>
          Ana Sayfa
        </Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menü</a>
        <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Uygulama</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>İletişim</a>
      </ul>
      <div className="navbar-right">
        <div id="search-container" className="search-container">
          <input
            className="input"
            name="text"
            placeholder="Ara"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchTerm ? (
            <img
              src={assets.cross_icon}
              alt="Kapat"
              className="close-icon"
              onClick={() => {
                setSearchTerm('');
                setFilteredFoods([]);
                setShowSearchResults(false);
              }}
            />
          ) : (
            <img
              src={assets.search_icon}
              alt="Ara"
              className="search-icon"
            />
          )}

          {showSearchResults && (
            <div className="search-results">
              {isSearching ? (
                <div className="searching">Aranıyor...</div>
              ) : filteredFoods.length > 0 ? (
                filteredFoods.map((food) => (
                  <div
                    key={food._id}
                    className="search-result-item"
                    onClick={() => handleFoodClick(food._id)}
                  >
                    <img
                      src={food.image.startsWith('http') ? food.image : `http://localhost:4000/images/${food.image}`}
                      alt={food.name}
                      className="search-food-img"
                    />
                    <div className="search-food-info">
                      <h4>{food.name}</h4>
                      <p>{food.category} - {food.price}TL</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">Sonuç bulunamadı</div>
              )}
            </div>
          )}
        </div>

        <div className="navbar-search-icon">
          <Link to={'/cart'}><img src={assets.basket_icon} alt="" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {!token ? (
          <button onClick={() => setShowLogin(true)}>Giriş Yap</button>
        ) : (
          <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate('/myorders')}>
                <img src={assets.bag_icon} alt="" />
                <p>Siparişlerim</p>
              </li>
              <li onClick={() => navigate('/profile')}>
                <img src={assets.profile_icon} alt="" />
                <p>Profilim</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
                <p>Çıkış Yap</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
