import Card from '../Card/Card'
import { useSelector } from 'react-redux';
import FadeIn from 'react-fade-in';

import './index.scss';

import Box from '@material-ui/core/Box';

export default function Dashboard (props) {
  let fadeCounter = 0;
  const userData = {...useSelector((state) => state.user.userData)};

  return ( // TODO: use clear dishes trigger to fade out dishes
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
                      voteID={userData._id}
                      votes={dish.votes}
                      userID={dish.userID}
                      creatorName={dish.creatorName}
                      dishID={dish._id}
                      zipCode={dish.zipCode}
                      title={dish.title}
                      description={dish.description}
                      recipe={dish.recipe}
                      imageUrl={dish.imageUrl}
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