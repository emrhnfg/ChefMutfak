import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null,
    currentImage: '' // Backend'den gelen tam URL olmalı
  });
  const [categories, setCategories] = useState([]);

  // Yiyecek listesini getirme
  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error('Yiyecekler getirilirken bir hata oluştu');
      }
    } catch (error) {
      console.error("Yiyecek listesi getirilirken hata:", error);
      toast.error("Sunucuya bağlanırken hata oluştu.");
    }
  };

  // Kategorileri getirme fonksiyonu
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}/api/food/categories`); // Veya /api/category/list
      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        toast.error('Kategoriler getirilirken hata oluştu');
      }
    } catch (error) {
      console.error("Kategoriler getirilirken hata:", error);
      toast.error("Kategorileri getirirken sunucuya bağlanılamadı.");
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error('Yiyecek silinirken bir hata oluştu');
      }
    } catch (error) {
      console.error("Yiyecek silinirken hata:", error);
      toast.error("Sunucuya bağlanırken hata oluştu.");
    }
  };

  const handleEditClick = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category,
      image: null, // Yeni görsel yüklenecekse burası doldurulur
      currentImage: food.image // Backend'den gelen tam URL'yi alır
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await axios.put(`${url}/api/food/${editingFood._id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setEditingFood(null);
        await fetchList();
      } else {
        toast.error('Yiyecek güncellenirken bir hata oluştu');
      }
    } catch (error) {
      console.error("Yiyecek güncellenirken hata:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Sunucuya bağlanırken hata oluştu.");
      }
    }
  };

  useEffect(() => {
    fetchList();
    fetchCategories();
  }, [url]); // url prop'u useEffect bağımlılığına eklendi

  return (
    <div className='list add flex-col'>
      <p>Tüm Yemekler Listesi</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Resim</b>
          <b>Adı</b>
          <b>Kategori</b>
          <b>Fiyat</b>
          <b>İşlem</b>
          <b>Düzenle</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className='list-table-format'>
              {/* Resim URL'si: item.image'in zaten tam URL olduğunu varsayıyoruz */}
              <img src={item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price}₺</p>
              <p onClick={() => removeFood(item._id)} className='cursor'>X</p>
              <p onClick={() => handleEditClick(item)} className='cursor edit-button'>Düzenle</p>
            </div>
          );
        })}
      </div>

      {/* Güncelleme Modalı */}
      {editingFood && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Yiyeceği Düzenle</h2>
            <form onSubmit={handleUpdateSubmit} className="flex-col">
              <div className="form-group">
                <label htmlFor="image">Mevcut Resim:</label>
                {/* Resim URL'si: formData.currentImage'in zaten tam URL olduğunu varsayıyoruz */}
                <img src={formData.currentImage} alt="Mevcut Resim" style={{ width: '100px', height: 'auto' }} />
                <input type="file" id="image" name="image" onChange={handleImageChange} accept="image/*" />
              </div>
              <div className="form-group">
                <label htmlFor="name">Yiyecek Adı:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="description">Açıklama:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="price">Fiyat:</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="category">Kategori:</label>
                <select name="category" value={formData.category} onChange={handleChange} required>
                  <option value="">Kategori Seç</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit">Güncelle</button>
                <button type="button" onClick={() => setEditingFood(null)}>İptal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;