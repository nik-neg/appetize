import LocalDishesParameter from '../LocalDishesParameter/LocalDischesParameter';
import Card from '../Card/Card'
// import { useState } from 'react';


export default function Dashboard ({id}) {

  // const [mouthWateringDishes, setMouthWateringDishes] = useState([]);

  return (
    <div>
      Hello Dashboard.
      <LocalDishesParameter/>
      <Card id={id}/>
    </div>
  );
}