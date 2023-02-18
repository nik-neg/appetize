import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"; // useDispatch
import { RecipeReviewCard } from "../Card";
import FadeIn from "react-fade-in";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import IconButton from "@material-ui/core/IconButton";
import { getDishesInRadius } from "../../store/userSlice";
import { store } from "../../store/index";
import Grow from "@mui/material/Grow";
import "./index.scss";
import Box from "@material-ui/core/Box";
import { IDetailsProps } from "../Details/index.js";
import { selectDishes } from "../../store/selectors";

export const Dashboard = (): JSX.Element => {
  const dispatch = useDispatch();
  const userData = { ...useSelector((state) => state.user.userData) };
  const searchData = { ...useSelector((state) => state.user.searchData) };

  const dishes = selectDishes();

  const [mouthWateringDishes, setMouthWateringDishes] = useState([...dishes]);

  useEffect(() => {
    const newMouthWateringDishes = [...dishes];
    setMouthWateringDishes(newMouthWateringDishes);
  }, [dishes]);

  const request = useSelector((state) => state.user.newDishesRequest);
  const allDishesDeletedRequest = useSelector(
    (state) => state.user.allDishesDeletedRequest
  );

  useEffect(() => {
    // check if all dishes in the next page are deleted, then go one page back
    if (allDishesDeletedRequest) {
      if (searchData.pageNumber > 1) {
        searchData.pageNumber -= 1;
      }
      dispatch(
        getDishesInRadius({
          id: userData._id,
          radius: searchData.radius,
          filter: JSON.stringify(searchData.filter),
          pageNumber: searchData.pageNumber,
          geoLocationPolygon: JSON.stringify(searchData.geoLocationPolygon),
        })
      );
    }
  }, [allDishesDeletedRequest]);

  useEffect(() => {
    setTimeout(() => {
      setTrigger(true);
      setChecked(!checked);
      setTrigger(false);
    }, transitionTime);
  }, [request]);

  const [checked, setChecked] = useState(
    store.getState().user.initialProfileRender
  );

  const nextPage = true;
  const handleArrowClick = async (nextPage: boolean) => {
    if (nextPage === false && searchData.pageNumber === 1) return;
    // TODO: set info for user that there are no more images ?
    setChecked(!checked);
    setTrigger(true);
    if (nextPage) {
      searchData.pageNumber += 1;
    } else {
      searchData.pageNumber =
        searchData.pageNumber > 0 ? searchData.pageNumber - 1 : 1;
    }
    searchData.geoLocationPolygon =
      store.getState().user.searchData.geoLocationPolygon;
    dispatch(
      getDishesInRadius({
        id: userData._id,
        radius: searchData.radius,
        filter: searchData.filter,
        pageNumber: searchData.pageNumber,
        geoLocationPolygon: searchData.geoLocationPolygon,
      })
    );
  };
  const numberOfImages = useSelector(
    (state) => state.user.dishesInRadius.length
  );
  const transitionTime = 1600;
  let fadeInFadeOutCoefficent = 0.4;
  const transitionTimeForArrowButton =
    transitionTime * (mouthWateringDishes.length / numberOfImages);
  const [trigger, setTrigger] = useState(false);
  const easeObject = {
    // enter:  (func, triggerValue) => {
    //   if (!triggerValue) return;
    //   func(() => {
    //     console.log('ease out', checked);
    //     setChecked(!checked)
    //   }, 1250)
    // },
    exit: (func, triggerValue) => {
      if (!triggerValue) return;
      func(() => {
        setChecked(!checked);
      }, transitionTime);
      setTrigger(false);
    },
  };

  return (
    <div>
      {mouthWateringDishes && mouthWateringDishes.length > 0 ? (
        <div className="cards-position">
          {checked ? (
            <div className="arrow-box">
              <FadeIn
                delay={transitionTimeForArrowButton}
                transitionDuration={1000}
              >
                <IconButton
                  aria-label="backward"
                  onClick={() => handleArrowClick(!nextPage)}
                >
                  <ArrowBackIosIcon />
                </IconButton>
              </FadeIn>
            </div>
          ) : (
            ""
          )}
          <>
            {mouthWateringDishes.map((dish, index) => {
              return (
                <div className="card-box" key={index}>
                  <Grow
                    key={index}
                    in={checked}
                    // enter={checked ? easeObject.enter(setTimeout, trigger) : ''}
                    exit={
                      !checked ? easeObject.exit(setTimeout, trigger) : true
                    }
                    style={{ transformOrigin: "0 0 0" }} // style={{ transformOrigin: "0 0 0", transform: "", translate:  "" }}
                    {...(checked
                      ? { timeout: (index + 1) * transitionTime }
                      : {
                          timeout:
                            index * transitionTime * fadeInFadeOutCoefficent,
                        })}
                  >
                    <Box m={2}>
                      <RecipeReviewCard
                        key={index}
                        index={index}
                        city={dish.city}
                        voted={dish.likedByUserID.some(
                          (userId) => userId === userData._id
                        )}
                        userID={userData._id}
                        votes={dish.votes}
                        dishUserID={dish.userID}
                        creatorName={dish.creatorName}
                        dishID={dish._id}
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
          {checked ? (
            <div className="arrow-box">
              <FadeIn
                delay={transitionTimeForArrowButton}
                transitionDuration={1000}
              >
                <IconButton
                  aria-label="forward"
                  onClick={() => handleArrowClick(nextPage)}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </FadeIn>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
