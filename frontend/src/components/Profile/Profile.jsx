import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './Profile.css'; // İstersen stil dosyası ekleyebilirsin

const Profile = () => {
  // StoreContext'ten token ve url'i al
  const { token, url } = useContext(StoreContext);
  const [user, setUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Profil verisini backend'den çek
  useEffect(() => {
    if (!token || !url) return; // Token veya URL yoksa istek gönderme

    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Backend URL'sini doğru şekilde kullanıyoruz
        const res = await axios.get(`${url}/api/user/profile`, {
          headers: {
            token: token
          }
        });
        if (res.data.success) {
          setUser({ name: res.data.user.name, email: res.data.user.email });
        } else {
          // Hata durumunda mesajı göster
          setMessage(res.data.message || "Profil bilgileri alınamadı.");
        }
      } catch (error) {
        console.error("Profil bilgisi alınırken hata:", error);
        setMessage("Profil bilgileri alınırken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, url]); // Bağımlılık dizisine 'url'i ekledik

  // Formdaki değişiklikleri state'e aktar
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Profili güncelle
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Mesajı temizle
    if (!token || !url) { // Token veya URL yoksa güncelleme yapma
      setMessage("Giriş yapmalısınız veya API URL'si mevcut değil.");
      return;
    }

    try {
      setLoading(true);
      // Backend URL'sini doğru şekilde kullanıyoruz
      const res = await axios.put(`${url}/api/user/profile`, user, {
        headers: {
          token: token,
          'Content-Type': 'application/json',
        },
      });
      if (res.data.success) {
        setMessage('Profil başarıyla güncellendi!');
      } else {
        setMessage(res.data.message || 'Bir hata oluştu.');
      }
    } catch (error) {
      console.error("Profil güncellenirken hata:", error);
      setMessage('Profil güncellenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Token yoksa kullanıcıya bilgi ver
  if (!token) return <div className="profile-container">Giriş yapmalısınız.</div>;

  return (
    <div className="profile-container">
      <h2>Profilim</h2>
      {loading && <p>Yükleniyor...</p>}
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>İsim</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          required
        />

        <label>E-posta</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>Güncelle</button>
      </form>
    </div>
  );
};

export default Profile;