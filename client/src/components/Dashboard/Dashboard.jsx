import { useState, useEffect } from 'react';
import Card from '../Card/Card'
import { useSelector, useDispatch } from 'react-redux';
import FadeIn from 'react-fade-in';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import IconButton from '@material-ui/core/IconButton';
import { getDishesInRadius, clearDishesInStore } from '../../store/userSlice';
import { store } from '../../store/index';

import './index.scss';

import Box from '@material-ui/core/Box';

export default function Dashboard () {
  let fadeCounter = 0;
  const userData = {...useSelector((state) => state.user.userData)};
  const searchData = {...useSelector((state) => state.user.searchData)};
  const dispatch = useDispatch();

  const [mouthWateringDishes, setMouthWateringDishes] = useState([...store.getState().user.dishesInRadius]);

  const dishes = useSelector((state) => state.user.dishesInRadius);
  useEffect(() => {
    const newMouthWateringDishes = [...store.getState().user.dishesInRadius]
    newMouthWateringDishes.sort((a,b) =>  b.votes - a.votes);
    setMouthWateringDishes(newMouthWateringDishes);
  }, [dishes])

  const nextPage = true;
  const handleClick = async (nextPage) => { // TODO: use of fadein when using pagination ?
    if (nextPage){
      searchData.pageNumber += 1;
    } else {
      if (searchData.pageNumber === 1) return;
      searchData.pageNumber = searchData.pageNumber > 0
      ? searchData.pageNumber  - 1
      : 1;
    }
    dispatch(clearDishesInStore());
    dispatch(getDishesInRadius({
      id: userData._id,
      ...searchData
    }))
  }

  return ( // TODO: use clear dishes trigger to fade out dishes
    <div>
      <div className='cards-position'>
      { mouthWateringDishes && mouthWateringDishes.length > 0 ?
        <div className="arrow-box">
          <FadeIn delay={mouthWateringDishes.length*1000} transitionDuration={1000}>
            <IconButton aria-label="backward" onClick={() => handleClick(!nextPage)}>
                <ArrowBackIosIcon />
            </IconButton>
          </FadeIn>
        </div>
      : ''}
      { mouthWateringDishes && mouthWateringDishes.length > 0 ?
        mouthWateringDishes.map((dish, index) => {
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
          <FadeIn delay={mouthWateringDishes.length*1000} transitionDuration={1000}>
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