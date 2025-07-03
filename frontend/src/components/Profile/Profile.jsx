import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './Profile.css'; // İstersen stil dosyası ekleyebilirsin

const Profile = () => {
  const { token } = useContext(StoreContext);
  const [user, setUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Profil verisini backend'den çek
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:4000/api/user/profile', {
          headers: {
            token: token
          }
        });
        if (res.data.success) {
          setUser({ name: res.data.user.name, email: res.data.user.email });
        }
      } catch (error) {
        console.error("Profil bilgisi alınırken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // Formdaki değişiklikleri state'e aktar
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Profili güncelle
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      setLoading(true);
      const res = await axios.put('http://localhost:4000/api/user/profile', user, {
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

  if (!token) return <div>Giriş yapmalısınız.</div>;

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
