import React, { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  const [menu, setMenu] = useState("");

  return (
    <div className='header'>
      <div className="header-contents">
        <h2 className='title1'>
          Favori Yemeklerinizi Hemen Sipariş Edin!
        </h2>
        <p>
          Zengin menümüzden dilediğinizi seçin ve en kaliteli malzemelerle usta şefler tarafından hazırlanan
          enfes lezzetlerin tadını çıkarın. Amacımız, damak zevkinize hitap ederek her lokmada
          benzersiz bir deneyim yaşatmak! 🍽️✨
        </p>

        <button onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>
          <a href="#explore-menu">Menü</a>
        </button>

      </div>
    </div>
  );
};

export default Header;
