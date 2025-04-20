import React, { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
import './FoodDisplay.css'

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext)
  
  // Filtrelenmiş yemek listesi
  const filteredFoodList = food_list.filter(item => 
    category === "All" || category === item.category
  )

  return (
    <section className='food-display' id='food-display'>
      <h2>Size En Yakın Lezzetler</h2>
      
      {filteredFoodList.length === 0 ? (
        <div className="no-food-message">
          Bu kategoride henüz yemek bulunmuyor.
        </div>
      ) : (
        <div className="food-display-list">
          {filteredFoodList.map((item) => (
            <FoodItem 
              key={item._id} 
              id={item._id} 
              name={item.name} 
              description={item.description} 
              price={item.price} 
              image={item.image}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default FoodDisplay