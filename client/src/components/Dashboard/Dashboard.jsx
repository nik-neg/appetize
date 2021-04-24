import LocalDishesParameter from '../LocalDishesParameter/LocalDischesParameter';
import Card from '../Card/Card'
// import { useState, useEffect } from 'react';
import { useState } from 'react';
import FadeIn from 'react-fade-in';

export default function Dashboard ({id}) {

  const [mouthWateringDishes, setMouthWateringDishes] = useState([]);

  // useEffect(() => {
    // setMouthWateringDishes(mouthWateringDishes)
  // }, [mouthWateringDishes]);

  let fadeCounter = 0;

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
        fadeCounter++;
        return <FadeIn key={index} delay={fadeCounter*1000} transitionDuration={1000}>
                <Card
                  key={index}
                  id={dish.userID}
                  title={dish.title}
                  description={dish.description}
                  recipe={dish.recipe}
                  />
                </FadeIn>
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