import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <div className="sidebar-options">
                <NavLink to='/add' className="sidebar-option">
                    <img src={assets.add_icon} alt="" />
                    <p>Ürün Ekle</p>
                </NavLink>
                <NavLink to='/list' className="sidebar-option">
                    <img src={assets.order_icon} alt="" />
                    <p>Ürünleri Listele</p>
                </NavLink>
                <NavLink to='/orders' className="sidebar-option">
                    <img src={assets.order_icon} alt="" />
                    <p>Siparişler</p>
                </NavLink>
                <NavLink to='/users' className="sidebar-option">
                    <img src={assets.order_icon} alt="" />
                    <p>Kullanıcılar</p>
                </NavLink>
            </div>
        </div>
    )
}

export default Sidebar