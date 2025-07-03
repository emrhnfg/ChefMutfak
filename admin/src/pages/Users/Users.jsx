import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Users.css';

const Users = ({ url }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAllUsers = async () => {
        try {
            // Backend'den gelen kullanıcı listesini kontrol edelim
            const response = await axios.get(`${url}/api/user/admin/all`);
            if (response.data.success) {
                setUsers(response.data.data);
            } else {
                toast.error("Kullanıcılar yüklenemedi");
            }
        } catch (error) {
            console.error(error);
            toast.error("Hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, [url]); // url prop'unu da bağımlılık olarak eklemek daha iyi bir pratiktir.

    // Arama fonksiyonu
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="users-loading">Kullanıcılar yükleniyor...</div>;
    }

    return (
        <div className="users">
            <div className="users-header">
                <h3>Kullanıcı Yönetimi</h3>
                <div className="users-stats">
                    <span className="total-users">Toplam Kullanıcı: {users.length}</span>
                </div>
            </div>

            <div className="users-search">
                <input
                    type="text"
                    placeholder="Kullanıcı ara (isim veya e-posta)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="users-table">
                <div className="users-table-header">
                    <div className="table-header-item">👤 Kullanıcı</div>
                    <div className="table-header-item">📧 E-posta</div>
                    <div className="table-header-item">🛒 Sipariş</div>
                    <div className="table-header-item">💰 Harcama</div>
                    <div className="table-header-item">📅 Kayıt Tarihi</div>
                </div>

                <div className="users-table-body">
                    {filteredUsers.length === 0 ? (
                        <div className="no-users">
                            {searchTerm ? "Arama kriterine uygun kullanıcı bulunamadı." : "Henüz kullanıcı bulunmamaktadır."}
                        </div>
                    ) : (
                        filteredUsers.map((user, index) => (
                            <div key={index} className="users-table-row">
                                <div className="table-cell">
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'} {/* user.name null/undefined ise 'U' göster */}
                                        </div>
                                        <div className="user-details">
                                            <p className="user-name">{user.name}</p>
                                            <p className="user-id">ID: {user._id}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-cell">
                                    <p className="user-email">{user.email}</p>
                                </div>
                                <div className="table-cell">
                                    <div className="order-info">
                                        <span className="order-count">{user.orderCount || 0}</span> {/* orderCount yoksa 0 göster */}
                                        <span className="order-text">sipariş</span>
                                    </div>
                                </div>
                                <div className="table-cell">
                                    <span className="total-spent">${user.totalSpent ? user.totalSpent.toFixed(2) : '0.00'}</span> {/* totalSpent yoksa 0.00 göster */}
                                </div>
                                <div className="table-cell">
                                    <span className="join-date">
                                        {/* Burası Kayıt Tarihi kısmı - KONTROL ETTİK */}
                                        {user.createdAt ?
                                            new Date(user.createdAt).toLocaleDateString('tr-TR')
                                            : 'Tarih Yok'} {/* Eğer createdAt yoksa 'Tarih Yok' yaz */}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Users;