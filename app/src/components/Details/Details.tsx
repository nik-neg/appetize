import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Image from "material-ui-image";
import { useState } from "react";
import FadeIn from "react-fade-in";
import { useDispatch } from "react-redux";
import { history } from "../../history";
import ApiClient from "../../services/ApiClient";
import { RootState, useAppSelector } from "../../store";
import { selectDishes } from "../../store/selectors";
import { backToProfileRequest, updateDailyTreat } from "../../store/userSlice";
import {
  CHARACTER_LIMIT_DESCRIPTION,
  CHARACTER_LIMIT_RECIPE,
  CHARACTER_LIMIT_TITLE,
  DESCRIPTION,
  RECIPE,
  TITLE,
} from "./constants";
import {
  SDetailsTitleWrapper,
  SDishDescription,
  SDishRecipeWrapper,
  SDishTitleWrapper,
} from "./Details.styles";
import "./Details.txt";
import { IDetailsProps, IDish } from "./types";

export const Details = ({ route }: IDetailsProps): JSX.Element => {
  const dishes = [...useAppSelector(selectDishes)];
  const filteredDish = dishes.filter(
    (dish) => dish._id === route.params.dishId
  );
  const [dish, setDish] = useState<IDish>(filteredDish[0]);
  const user = useAppSelector((state: RootState) => state?.user?.userData);

  const [editable, setEditable] = useState(false);
  const updateDish = async () => {
    if (editable) {
      const updatedDailyTreat = await ApiClient.updateDish(user._id, dish._id, {
        dishText,
        cookedOrdered,
      });
      dispatch(updateDailyTreat(updatedDailyTreat));
    }
    setEditable(!editable);
    setDish((prevValue) => ({
      ...prevValue,
      ...dishText,
    }));
  };

  const dispatch = useDispatch();

  const handleBack = async () => {
    dispatch(backToProfileRequest());
    history.push("/profile");
  };
  const [cookedOrdered, setCoockedOrdered] = useState({
    cooked: dish.cookedNotOrdered,
    ordered: dish.cookedNotOrdered === false ? true : false,
  });

  const handleCookedOrdered = async (event: any): Promise<void> => {
    event.preventDefault();
    const { name, checked } = event.target;
    setCoockedOrdered((): any => ({
      [name === "cooked" ? "ordered" : "cooked"]: false,
      [name]: checked,
    }));
  };

  const styles = {
    someTextField: {
      minHeight: 420,
      minWidth: 800,
      paddingTop: "10%",
    },
  };

  const initialDishTextState = {
    title: dish.title,
    description: dish.description,
    recipe: dish.recipe,
  };
  const [dishText, setDishText] = useState({
    ...initialDishTextState,
  });
  const handleChangeText = (name: string) => (event: any) => {
    setDishText((prevValue) => ({ ...prevValue, [name]: event.target.value }));
  };
  return (
    <FadeIn delay={950} transitionDuration={1750}>
      <Grid container spacing={2}>
        <SDetailsTitleWrapper>
          <Grid item xs={12} md={12} lg={12}>
            {`${dish.creatorName} from ${dish.city}`}
          </Grid>
        </SDetailsTitleWrapper>

        <Grid item sm={12} xs={12}>
          {!editable ? (
            <SDishTitleWrapper>{`${dishText.title}`}</SDishTitleWrapper>
          ) : (
            <TextField
              id="dish-title-change"
              label="Title"
              inputProps={{
                maxLength: CHARACTER_LIMIT_TITLE,
              }}
              value={dishText.title}
              helperText={`${dishText.title.length}/${CHARACTER_LIMIT_TITLE}`}
              style={{ minWidth: "20vw" }}
              rowsMax="10"
              variant="filled"
              onChange={handleChangeText(TITLE)}
              InputProps={{
                classes: { input: styles.someTextField.toString() },
              }}
            />
          )}
        </Grid>
        <Grid item sm={12} xs={12}>
          <Image
            src={dish.imageUrl}
            imageStyle={{
              width: "57.5%",
              height: "100%",
              borderRadius: "2.5%",
            }}
            style={{
              backgroundColor: "inherit",
              marginTop: "0%",
              marginLeft: "30%",
              padding: "10%",
            }}
          />
        </Grid>
        <Grid item sm={12} xs={12}>
          {!editable ? (
            <SDishDescription>{`${dishText.description}`}</SDishDescription>
          ) : (
            <TextField
              id="dish-description-change"
              label="Description"
              inputProps={{
                maxLength: CHARACTER_LIMIT_DESCRIPTION,
              }}
              value={dishText.description}
              helperText={`${dishText.description.length}/${CHARACTER_LIMIT_DESCRIPTION}`}
              style={{ minWidth: "40vw" }}
              multiline
              rowsMax="10"
              variant="filled"
              onChange={handleChangeText(DESCRIPTION)}
              InputProps={{
                classes: { input: styles.someTextField.toString() },
              }}
            />
          )}
        </Grid>
        <Grid item sm={12} xs={12}>
          {!editable ? (
            <SDishRecipeWrapper>{`${dishText.recipe}`}</SDishRecipeWrapper>
          ) : (
            <TextField
              id="dish-recipe"
              label="Recipe"
              inputProps={{
                maxLength: CHARACTER_LIMIT_RECIPE,
              }}
              value={dishText.recipe}
              helperText={`${dishText.recipe.length}/${CHARACTER_LIMIT_RECIPE}`}
              style={{ minWidth: "40vw" }}
              multiline
              rowsMax="10"
              variant="filled"
              onChange={handleChangeText(RECIPE)}
              InputProps={{
                classes: { input: styles.someTextField.toString() },
              }}
            />
          )}
        </Grid>
        {user._id == dish.userID ? (
          <Grid item xs={12} md={12} lg={12}>
            <div className="row">
              <div className="col">
                <FormControlLabel
                  control={
                    <Checkbox
                      id="local-dishes-parameter-cooked"
                      onChange={handleCookedOrdered}
                      //label='Cooked'
                      checked={cookedOrdered.cooked}
                      name="cooked"
                      color="primary"
                      value={cookedOrdered.cooked}
                    />
                  }
                  label="cooked"
                />
              </div>
              <div className="col">
                <FormControlLabel
                  control={
                    <Checkbox
                      id="local-dishes-parameter-ordered"
                      onChange={handleCookedOrdered}
                      //label='Ordered'
                      checked={cookedOrdered.ordered}
                      name="ordered"
                      color="primary"
                      value={cookedOrdered.ordered}
                    />
                  }
                  label="ordered"
                />
              </div>
            </div>
          </Grid>
        ) : (
          ""
        )}
        {user._id == dish.userID ? (
          <Grid item xs={12} md={12} lg={12}>
            <Button
              variant="contained"
              color="primary"
              id="update-button"
              className="button"
              onClick={updateDish}
            >
              {!editable ? "Update" : "Confirm"}
            </Button>
          </Grid>
        ) : (
          ""
        )}
        <Grid item xs={12} md={12} lg={12}>
          <Button
            variant="contained"
            color="primary"
            id="back-button"
            className="button"
            onClick={handleBack}
          >
            Back
          </Button>
        </Grid>
      </Grid>
    </FadeIn>
  );
};
