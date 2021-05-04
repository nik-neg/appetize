// import LocalDishesParameter from '../LocalDishesParameter/LocalDischesParameter';
import Card from '../Card/Card'
// import { useState, useEffect } from 'react';
// import { useState } from 'react';
import FadeIn from 'react-fade-in';

import './index.scss';

// import { spacing } from '@material-ui/system';
import Box from '@material-ui/core/Box';

export default function Dashboard (props) {
  let fadeCounter = 0;

  return (
    <div>
      <div className='cards-position'>
        {props.mouthWateringDishes && props.mouthWateringDishes.length > 0 ?
        (props.mouthWateringDishes.map((dish, index) => {
          fadeCounter++;
          return <FadeIn key={index} delay={fadeCounter*1000} transitionDuration={1000}>
                  <Box m={2}>
                    <Card
                      key={index}
                      city={dish.city}
                      voteID={props.id}
                      votes={dish.votes}
                      userID={dish.userID}
                      creatorName={dish.creatorName}
                      dishID={dish._id}
                      zipCode={dish.zipCode}
                      title={dish.title}
                      description={dish.description}
                      recipe={dish.recipe}
                      created={dish.created}
                      />
                  </Box>
                  </FadeIn>
                }))
        : ''}
      </div>
    </div>
  );
}