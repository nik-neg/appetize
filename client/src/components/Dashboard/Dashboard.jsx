import { useState, useEffect } from 'react';
import { useSelector,  useDispatch} from 'react-redux'; // useDispatch
import Card from '../Card/Card'
import FadeIn from 'react-fade-in';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import IconButton from '@material-ui/core/IconButton';
import { getDishesInRadius, } from '../../store/userSlice';
import { store } from '../../store/index';
import Grow from "@mui/material/Grow";

import './index.scss';

import Box from '@material-ui/core/Box';

export default function Dashboard () {
  const dispatch = useDispatch();
  const userData = {...useSelector((state) => state.user.userData)};
  const searchData = {...useSelector((state) => state.user.searchData)};


  const [mouthWateringDishes, setMouthWateringDishes] = useState([...store.getState().user.dishesInRadius]);

  const dishes = useSelector((state) => state.user.dishesInRadius);
  useEffect(() => {
    const newMouthWateringDishes = [...store.getState().user.dishesInRadius]
    newMouthWateringDishes.sort((a,b) =>  b.votes - a.votes);
    setMouthWateringDishes(newMouthWateringDishes);
  }, [dishes]);

  const [checked, setChecked] = useState(true);

  const nextPage = true;
  const handleClick = async (nextPage) => {
    if (!nextPage && searchData.pageNumber === 1) return;
    // TODO: set info for user that there are no more images ?
    setChecked(!checked);
    setTrigger(true);
    if (nextPage) {
      searchData.pageNumber += 1;
    } else {
      searchData.pageNumber = searchData.pageNumber > 0
      ? searchData.pageNumber  - 1
      : 1;
    }
    dispatch(getDishesInRadius({
      id: userData._id,
      ...searchData
    }))
  }
  const transitionTime = 1750;
  const [trigger, setTrigger] = useState(false);
  const easeObject = {
    // enter:  (func, triggerValue) => {
    //   if (!triggerValue) return;
    //   func(() => {
    //     console.log('ease out', checked);
    //     setChecked(!checked)
    //   }, 1250)
    // },
    exit:  (func, triggerValue) => {
      if (!triggerValue) return;
      func(() => {
        setChecked(!checked)
      }, transitionTime)
      setTrigger(false);
    },
  }

  return (
    <div>
      { mouthWateringDishes && mouthWateringDishes.length > 0 ?
      <div className='cards-position'>
        <div className="arrow-box">
          <FadeIn delay={transitionTime} transitionDuration={1000}>
            <IconButton aria-label="backward" onClick={() => handleClick(!nextPage)}>
                <ArrowBackIosIcon />
            </IconButton>
          </FadeIn>
        </div>
        <>
          { mouthWateringDishes.map((dish, index) => {
            return (
            <div className="card-box" key={index}>
            <Grow
              key={index}
              in={checked}
              // enter={checked ? easeObject.enter(setTimeout, trigger) : ''}
              exit={ !checked ? easeObject.exit(setTimeout, trigger) : '' }
              style={{ transformOrigin: "0 0 0",}} // style={{ transformOrigin: "0 0 0", transform: "", translate:  "" }}
              {...(checked ? { timeout: index*1000 } : {timeout: index*1250})}
            >
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
            </Grow>
            </div>
            );
          })}
        </>
        <div className="arrow-box">
          <FadeIn delay={transitionTime} transitionDuration={1000}>
            <IconButton aria-label="forward" onClick={() => handleClick(nextPage)}>
              <ArrowForwardIosIcon />
            </IconButton>
          </FadeIn>
        </div>
      </div>
      : ''}
    </div>
  );
}