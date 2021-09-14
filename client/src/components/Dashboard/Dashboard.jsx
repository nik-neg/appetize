import Card from '../Card/Card'
import { useSelector } from 'react-redux';
import FadeIn from 'react-fade-in';
// import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
// import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
// import IconButton from '@material-ui/core/IconButton';

import './index.scss';

import Box from '@material-ui/core/Box';

export default function Dashboard (props) {
  let fadeCounter = 0;
  const userData = {...useSelector((state) => state.user.userData)};

  return (
    <div>
      <div className='cards-position'>
      {/* { fadeCounter > 0 && fadeCounter ===  props.mouthWateringDishes.length ?
        <FadeIn delay={fadeCounter*1000} transitionDuration={1000}>
            <IconButton aria-label="back">
              <ArrowBackIosIcon />
            </IconButton>
          </FadeIn>
      : ''} */}
      { props.mouthWateringDishes && props.mouthWateringDishes.length > 0 ?

        (props.mouthWateringDishes.map((dish, index) => {
          console.log(fadeCounter)
          fadeCounter++;
          console.log(fadeCounter, props.mouthWateringDishes.length)
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
        {/* { fadeCounter > 0 && fadeCounter === props.mouthWateringDishes.length ?
        <div className="arrow-box">
          <FadeIn delay={fadeCounter*1000} transitionDuration={1000}>
            <IconButton aria-label="forward">
              <ArrowForwardIosIcon />
            </IconButton>
          </FadeIn>
        </div>
      : ''} */}
      </div>
    </div>
  );
}