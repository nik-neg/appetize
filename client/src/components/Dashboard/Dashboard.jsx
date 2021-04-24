// import LocalDishesParameter from '../LocalDishesParameter/LocalDischesParameter';
import Card from '../Card/Card'
// import { useState, useEffect } from 'react';


export default function Dashboard ({id}) {

  // const [mouthWateringDishes, setMouthWateringDishes] = useState([]);

  // useEffect(() => {
  // setMouthWateringDishes(mouthWateringDishes)
  // }, [mouthWateringDishes]);

  return (
    <div>
      Hello Dashboard.
      {/* <LocalDishesParameter/>
      {mouthWateringDishes.length > 0 ?
        mouthWateringDishes.map((dish) => {
          return <Card id={id}/>
        })
      : ''} */}
      <Card id={id}/>
    </div>
  );
}