import LocalDishesParameter from '../LocalDishesParameter/LocalDischesParameter';
import Card from '../Card/Card'
// import { useState, useEffect } from 'react';
import { useState } from 'react';
import FadeIn from 'react-fade-in';

export default function Dashboard ({id}) {

  const [mouthWateringDishes, setMouthWateringDishes] = useState([]);

  // to reduce processing delays data needs to be fetched
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
        (mouthWateringDishes.map((dish, index) => {
        fadeCounter++;
        return <FadeIn key={index} delay={fadeCounter*1000} transitionDuration={1000}>
                <Card
                  key={index}
                  voteID={id}
                  votes={dish.votes}
                  userID={dish.userID}
                  dishID={dish._id}
                  title={dish.title}
                  description={dish.description}
                  recipe={dish.recipe}
                  created={dish.created}
                  />
                </FadeIn>
              })).sort((a,b) =>  Date.parse(b.date) - Date.parse(a.date)).reverse()
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