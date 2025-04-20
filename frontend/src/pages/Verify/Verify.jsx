import React, { useContext, useEffect, useState } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import axios from "axios";

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const { url } = useContext(StoreContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);

    const verifyPayment = async () => {
        try {
            const response = await axios.post(url + "/api/order/verify", { success, orderId });
            if (response.data.success) {
                setIsSuccess(true);
                setTimeout(() => {
                    navigate("/myorders");
                }, 3000);
            } else {
                setTimeout(() => {
                    navigate("/");
                }, 3000);
            }
        } catch (error) {
            console.error("Ödeme doğrulama hatası:", error);
            setTimeout(() => {
                navigate("/");
            }, 3000);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        verifyPayment();
    }, []); // boş bağımlılık dizisi ile sadece bir kez çalışmasını sağlıyoruz

    return (
        <div className='verify'>
            {loading ? (
                <div className="spinner"></div>
            ) : isSuccess ? (
                <div className="success-container">
                    <div className="success-icon">
                        <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="26" cy="26" r="25" fill="white" stroke="#4CAF50" strokeWidth="2" />
                            <path d="M14.1 27.2l7.1 7.2 16.7-16.8" fill="none" stroke="#4CAF50" strokeWidth="4" />
                        </svg>
                    </div>
                    <h2>İşlem Başarılı</h2>
                    <p>Siparişiniz başarıyla tamamlanmıştır.</p>
                </div>
            ) : (
                <div className="error-container">
                    <h2>İşlem Başarısız</h2>
                    <p>Ödeme işlemi sırasında bir sorun oluştu.</p>
                </div>
            )}
        </div>
    )
}

export default Verify