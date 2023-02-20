import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Grow from "@mui/material/Grow";
import { useEffect, useState } from "react";
import FadeIn from "react-fade-in";
import { useDispatch } from "react-redux"; // useDispatch
import { store, useAppSelector } from "../../store/index";
import {
  numberOfDishes,
  selectAllDishesDeletedRequest,
  selectDishes,
  selectNewDishesRequest,
  selectSearchData,
  selectUserData,
} from "../../store/selectors";
import { IDailyTreat } from "../../store/types";
import { getDishesInRadius } from "../../store/userSlice";
import { RecipeReviewCard } from "../Card";
import {
  SArrowContainer,
  SCardContainer,
  SDashboardContainer,
} from "./Dashboard.styles";

export const Dashboard = (): JSX.Element => {
  const dispatch = useDispatch();
  const userData = {
    ...useAppSelector(selectUserData),
  };
  const searchData = { ...useAppSelector(selectSearchData) };

  const dishes = useAppSelector(selectDishes);

  const [mouthWateringDishes, setMouthWateringDishes] = useState([...dishes]);

  useEffect(() => {
    const newMouthWateringDishes = [...dishes];
    setMouthWateringDishes(newMouthWateringDishes);
  }, [dishes]);

  const request = useAppSelector(selectNewDishesRequest);
  const allDishesDeletedRequest = useAppSelector(selectAllDishesDeletedRequest);

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
  const numberOfImages = useAppSelector(numberOfDishes);

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
    exit: (func: any, triggerValue: boolean) => {
      if (!triggerValue) return;
      func(() => {
        setChecked(!checked);
      }, transitionTime);
      setTrigger(false);
    },
  };

  console.log({ mouthWateringDishes, dishes });

  return (
    <div>
      {dishes && dishes.length > 0 ? (
        <SDashboardContainer>
          {checked ? (
            <SArrowContainer>
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
            </SArrowContainer>
          ) : (
            ""
          )}
          <>
            {dishes.map((dish: IDailyTreat, index: number) => {
              return (
                <SCardContainer key={index}>
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
                          (userId: string) => userId === userData._id
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
                </SCardContainer>
              );
            })}
          </>
          {checked ? (
            <SArrowContainer>
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
            </SArrowContainer>
          ) : (
            ""
          )}
        </SDashboardContainer>
      ) : (
        ""
      )}
    </div>
  );
};
