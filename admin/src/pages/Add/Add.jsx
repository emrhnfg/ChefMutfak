import React, { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'

const Add = ({ url }) => {

  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Kebaplar"
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("price", Number(data.price))
    formData.append("category", data.category)
    formData.append("image", image)
    const response = await axios.post(`${url}/api/food/add`, formData);
    if (response.data.success) {
      setData({
        name: "",
        description: "",
        price: "",
        category: "Kebaplar"
      })
      setImage(false)
      toast.success(response.data.message)
    }
    else {
      toast.error(response.data.message)
    }
  }

  return (
    <div>
      <div className="add">
        <form className='flex-col' onSubmit={onSubmitHandler}>
          <div className="add-img-upload flex-col">
            <p>Resim Yükle</p>
            <label htmlFor="image">
              <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
            </label>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
          </div>
          <div className="add-product-name flex-col">
            <p>Ürün adı</p>
            <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Ekle' />
          </div>
          <div className="add-product-description flex-col" >
            <p>Ürün Açıklaması</p>
            <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Açıklama Ekleyin' required></textarea>
          </div>
          <div className="add-category-price">
            <div className="add-category flex-col">
              <p>Ürün Kategorisi Seçin</p>
              <select onChange={onChangeHandler} name="category">
                <option value="Kebaplar">Kebaplar</option>
                <option value="Çorbalar">Çorbalar</option>
                <option value="Mezeler">Mezeler</option>
                <option value="Pide ve Lahmacun">Pide ve Lahmacun</option>
                <option value="Tatlılar">Tatlılar</option>
                <option value="İçecekler">İçecekler</option>
                <option value="Sulu Yemekler">Sulu Yemekler</option>
              </select>

            </div>
            <div className="add-price flex-col">
              <p>Fiyat Ekle</p>
              <input onChange={onChangeHandler} value={data.price} type="Number" name='price' placeholder='20 TL' />
            </div>
          </div>
          <button type='submit' className='add-btn'>EKLE</button>
        </form>
      </div>
    </div>
  )
}

export default Add
