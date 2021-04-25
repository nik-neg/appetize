// import LocalDishesParameter from '../LocalDishesParameter/LocalDischesParameter';
import Card from '../Card/Card'
// import { useState, useEffect } from 'react';
// import { useState } from 'react';
import FadeIn from 'react-fade-in';

import './index.scss';

export default function Dashboard (props) {

  // const [mouthWateringDishes, setMouthWateringDishes] = useState([]);

  // to reduce processing delays data needs to be fetched
  // useEffect(() => {
  //   setMouthWateringDishes(mouthWateringDishes)
  //   console.log(mouthWateringDishes)
  // }, [mouthWateringDishes]);

  // const handleLocalDishesParameterResults = (updatedValues) => {
  //   // request for all button?
  //   console.log(updatedValues)
  //   setMouthWateringDishes(null)
  //   setMouthWateringDishes(updatedValues);
  // }

  let fadeCounter = 0;

  return (
    <div>
      {/* <LocalDishesParameter
        // mouthWateringDishes={mouthWateringDishes}
        onRadiusSearch={handleLocalDishesParameterResults}
        id={id}
      /> */}
      <div className='fadeOut'>
        {props.mouthWateringDishes && props.mouthWateringDishes.length > 0 ?
        (props.mouthWateringDishes.map((dish, index) => {
        fadeCounter++;
        return <FadeIn key={index} delay={fadeCounter*1000} transitionDuration={1000}>
                <Card
                  key={index}
                  voteID={props.id}
                  votes={dish.votes}
                  userID={dish.userID}
                  dishID={dish._id}
                  zipCode={dish.zipCode}
                  title={dish.title}
                  description={dish.description}
                  recipe={dish.recipe}
                  created={dish.created}
                  />
                </FadeIn>
              }))
            : ''}
      </div>
      {/* <LocalDishesParameter
        // mouthWateringDishes={mouthWateringDishes}
        onRadiusSearch={setMouthWateringDishes}
        id={id}
      /> */}
      {/* <Card id={id}/> */}
    </div>
  );
}