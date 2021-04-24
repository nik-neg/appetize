import LocalDishesParameter from '../LocalDishesParameter/LocalDischesParameter';
import Card from '../Card/Card'
// import { useState, useEffect } from 'react';
import { useState } from 'react';

export default function Dashboard ({id}) {

  const [mouthWateringDishes, setMouthWateringDishes] = useState([]);

  // useEffect(() => {
    // setMouthWateringDishes(mouthWateringDishes)
  // }, [mouthWateringDishes]);

  return (
    <div>
      Hello Dashboard.
      <LocalDishesParameter
        // mouthWateringDishes={mouthWateringDishes}
        onRadiusSearch={setMouthWateringDishes}
        id={id}
      />
      { mouthWateringDishes.length > 0 ?
        mouthWateringDishes.map((dish, index) => {
          return <Card
              key={index}
              id={dish.userID}
              title={dish.title}
              description={dish.description}
              recipe={dish.recipe}
              />
        })
      : ''}
      {/* <LocalDishesParameter
        // mouthWateringDishes={mouthWateringDishes}
        onRadiusSearch={setMouthWateringDishes}
        id={id}
      /> */}
      {/* <Card id={id}/> */}
    </div>
  );
}