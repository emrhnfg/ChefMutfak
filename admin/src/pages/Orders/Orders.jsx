import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Orders.css';

const Orders = ({ url }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllOrders = async () => {
        try {
            const response = await axios.get(`${url}/api/order/adminorders`);
            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                toast.error("Siparişler yüklenemedi");
            }
        } catch (error) {
            console.error(error);
            toast.error("Hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    const statusHandler = async (orderId, status) => {
        try {
            const response = await axios.put(`${url}/api/order/updatestatus/${orderId}`, { status });
            if (response.data.success) {
                toast.success("Durum güncellendi");
                await fetchAllOrders();
            } else {
                toast.error("Durum güncellenemedi");
            }
        } catch (error) {
            console.error(error);
            toast.error("Hata oluştu");
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    if (loading) {
        return <div className="orders-loading">Siparişler yükleniyor...</div>;
    }

    return (
        <div className="orders">
            <h3>Sipariş Yönetimi</h3>
            <div className="orders-list">
                {orders.length === 0 ? (
                    <p className="no-orders">Henüz sipariş bulunmamaktadır.</p>
                ) : (
                    orders.map((order, index) => (
                        <div key={index} className="orders-item">
                            <div className="orders-item-icon">
                                📦
                            </div>
                            <div className="orders-item-details">
                                <p className="orders-item-food">
                                    {order.items.map((item, index) => {
                                        if (index === order.items.length - 1) {
                                            return item.name + " x " + item.quantity;
                                        } else {
                                            return item.name + " x " + item.quantity + ", ";
                                        }
                                    })}
                                </p>
                                <p className="orders-item-name">
                                    {order.address.firstName + " " + order.address.lastName}
                                </p>
                                <div className="orders-item-address">
                                    <p>{order.address.street}</p>
                                    <p>{order.address.city + ", " + order.address.state + ", " + order.address.country}</p>
                                    <p>Posta Kodu: {order.address.zipcode}</p>
                                </div>
                                <p className="orders-item-phone">📞 {order.address.phone}</p>
                                <p className="orders-item-date">
                                    📅 {new Date(order.date).toLocaleDateString('tr-TR')}
                                </p>
                            </div>
                            <div className="orders-item-info">
                                <p>Ürün Sayısı: {order.items.length}</p>
                                <p className="orders-item-amount">${order.amount}</p>
                                <p className="orders-item-payment">
                                    {order.payment ? "✅ Ödendi" : "❌ Ödenmedi"}
                                </p>
                            </div>
                            <div className="orders-item-status">
                                <label>Durum:</label>
                                <select 
                                    onChange={(e) => statusHandler(order._id, e.target.value)} 
                                    value={order.status}
                                    className="orders-status-select"
                                >
                                    <option value="Hazırlanıyor">Hazırlanıyor</option>
                                    <option value="Kargoya Verildi">Kargoya Verildi</option>
                                    <option value="Yolda">Yolda</option>
                                    <option value="Teslim Edildi">Teslim Edildi</option>
                                    <option value="İptal Edildi">İptal Edildi</option>
                                </select>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Orders;