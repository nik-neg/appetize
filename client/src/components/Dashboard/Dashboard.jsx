import Card from '../Card/Card'
import { useSelector } from 'react-redux';
import FadeIn from 'react-fade-in';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import IconButton from '@material-ui/core/IconButton';
import { useDispatch } from 'react-redux';
import { getDishesInRadius,  } from '../../store/userSlice';

import './index.scss';

import Box from '@material-ui/core/Box';

export default function Dashboard (props) {
  let fadeCounter = 0;
  const userData = {...useSelector((state) => state.user.userData)};
  const searchData = {...useSelector((state) => state.user.searchData)};
  const dispatch = useDispatch();

  const nextPage = true;
  const handleClick = async (nextPage) => {
    if (nextPage){
      searchData.pageNumber += 1;
    } else {
      if (searchData.pageNumber === 1) return;
      searchData.pageNumber = searchData.pageNumber > 0
      ? searchData.pageNumber  - 1
      : 1;
    }
    dispatch(getDishesInRadius({
      id: userData._id,
      ...searchData
    }))
  }

  return ( // TODO: use clear dishes trigger to fade out dishes
    <div>
      <div className='cards-position'>
      { props.mouthWateringDishes && props.mouthWateringDishes.length > 0 ?
        <div className="arrow-box">
          <FadeIn delay={props.mouthWateringDishes.length*1000} transitionDuration={1000}>
            <IconButton aria-label="backward" onClick={() => handleClick(!nextPage)}>
                <ArrowBackIosIcon />
            </IconButton>
          </FadeIn>
        </div>
      : ''}
      { props.mouthWateringDishes && props.mouthWateringDishes.length > 0 ?
        props.mouthWateringDishes.map((dish, index) => {
          fadeCounter++;
          return (
            <FadeIn key={index} delay={fadeCounter*1000} transitionDuration={1000}>
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
            </FadeIn>)
                })
        : ''}
      { fadeCounter > 0
      ?
        <div className="arrow-box">
          <FadeIn delay={props.mouthWateringDishes.length*1000} transitionDuration={1000}>
            <IconButton aria-label="forward" onClick={() => handleClick(nextPage)}>
              <ArrowForwardIosIcon />
            </IconButton>
          </FadeIn>
        </div>
      : ''}
      </div>
    </div>
  );
}