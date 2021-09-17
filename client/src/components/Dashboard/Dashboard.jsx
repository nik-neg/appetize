import { useState, useEffect } from 'react';
import { useSelector,  } from 'react-redux'; // useDispatch
// import Card from '../Card/Card'
import FadeIn from 'react-fade-in';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import IconButton from '@material-ui/core/IconButton';
// import { getDishesInRadius, clearDishesInStore } from '../../store/userSlice';
import { store } from '../../store/index';
import Paper from "@material-ui/core/Paper";
import Grow from "@mui/material/Grow";

import './index.scss';

import Box from '@material-ui/core/Box';

export default function Dashboard () {
  // let fadeCounter = 0;
  // const dispatch = useDispatch();
  // const userData = {...useSelector((state) => state.user.userData)};
  const searchData = {...useSelector((state) => state.user.searchData)};


  const [mouthWateringDishes, setMouthWateringDishes] = useState([...store.getState().user.dishesInRadius]);

  const dishes = useSelector((state) => state.user.dishesInRadius);
  useEffect(() => {
    const newMouthWateringDishes = [...store.getState().user.dishesInRadius]
    newMouthWateringDishes.sort((a,b) =>  b.votes - a.votes);
    setMouthWateringDishes(newMouthWateringDishes);
  }, [dishes])

  const icon = (
    <Paper sx={{ m: 1 }} elevation={4}>
        TEST
    </Paper>
  );
  const iconArray = Array(4).fill(icon);
  const [checked, setChecked] = useState(false);

  const nextPage = true;
  const handleClick = async (nextPage) => {
    setChecked(!checked);
    setTrigger(true);
    if (nextPage){
      searchData.pageNumber += 1;
    } else {
      if (searchData.pageNumber === 1) return;
      searchData.pageNumber = searchData.pageNumber > 0
      ? searchData.pageNumber  - 1
      : 1;
    }
    // dispatch(clearDishesInStore());
    // dispatch(getDishesInRadius({
    //   id: userData._id,
    //   ...searchData
    // }))
  }
  const [trigger, setTrigger] = useState(false);
  const easeObject = {
    enter:  (func, triggerValue) => {
      if (!triggerValue) return;
      func(() => {
        console.log('ease out', checked);
        setChecked(!checked)
      }, 1250)
    },
    exit:  (func, triggerValue) => {
      if (!triggerValue) return;
      func(() => {
        console.log('ease in', checked);
        setChecked(!checked)
      }, 1750)
      setTrigger(false);
    },
  }

  return (
    <div>
      {/* { mouthWateringDishes && mouthWateringDishes.length > 0 ? */}
      <div className='cards-position'>
        <div className="arrow-box">
          <FadeIn delay={mouthWateringDishes.length*1000} transitionDuration={1000}>
            <IconButton aria-label="backward" onClick={() => handleClick(!nextPage)}>
                <ArrowBackIosIcon />
            </IconButton>
          </FadeIn>
        </div>
        <Box sx={{ display: "flex" }}>
          { iconArray.map((el, index) => {
            return (
          <Box sx={{ display: "flex" }} key={index}>
            <Grow
              key={index}
              in={checked}
              // enter={checked ? easeObject.enter(setTimeout, trigger) : ''}
              exit={ !checked ? easeObject.exit(setTimeout, trigger) : '' }
              style={{ transformOrigin: "0 0 0" }}
              {...(checked ? { timeout: index*1000 } : {timeout: index*750})}
            >
              {iconArray[0]}
            </Grow>
            </Box>
            );
          })}
        </Box>
        <div className="arrow-box">
          <FadeIn delay={mouthWateringDishes.length*1000} transitionDuration={1000}>
            <IconButton aria-label="forward" onClick={() => handleClick(nextPage)}>
              <ArrowForwardIosIcon />
            </IconButton>
          </FadeIn>
        </div>
      {/* { mouthWateringDishes && mouthWateringDishes.length > 0 ?
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
      : ''} */}
      </div>
      {/* : ''} */}
    </div>
  );
}