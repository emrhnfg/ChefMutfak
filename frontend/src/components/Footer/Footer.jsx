import React from 'react'
import { assets } from '../../assets/assets'
import './Footer.css'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo} alt="" />
                    <p>Bizi sosyal medyada takip edin ve en yeni lezzetlerimizi keşfedin! Sosyal medya hesaplarımızdan yeniliklerden haberdar olun.
                    </p>
                    <div className="footer-social-icons">
                        <button className="Btn facebook">
                            <img src={assets.facebook_icon} alt="Facebook" className="svgIcon" />
                            <span className="text">Facebook</span>
                        </button>
                        <button className="Btn twitter">
                            <img src={assets.x_icon_new} alt="Twitter" className="svgIcon" />
                            <span className="text">X</span>
                        </button>
                        <button className="Btn instagram">
                            <img src={assets.instagram} alt="Instagram" className="svgIcon" />
                            <span className="text">Instagram</span>
                        </button>
                        <button className="Btn linkedin">
                            <img src={assets.linkedin_icon} alt="LinkedIn" className="svgIcon" />
                            <span className="text">LinkedIn</span>
                        </button>
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>ŞİRKET</h2>
                    <ul>
                        <li>Ana Sayfa</li>
                        <li>Hakkımızda</li>
                        <li>Teslimat</li>
                        <li>Gizlilik Politikası</li>
                    </ul>

                </div>
                <div className="footer-content-right">
                    <h2>İLETİŞİM</h2>
                    <ul>
                        <li>+1-123-456-7890</li>
                        <li>chefmutfak@gmail.com</li>
                    </ul>
                </div>
            </div><hr />
            <p className="footer-copyright">Copyright 2024 © chefmutfak.com - Tüm Hakları Saklıdır"</p>
        </div>
    )
}

export default Footer
