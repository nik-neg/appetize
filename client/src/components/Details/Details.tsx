import { useState } from 'react';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Image from 'material-ui-image'
import { history } from '../../history';
import { backToProfileRequest, updateDailyTreat } from '../../store/userSlice';
import './Details.scss';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { TextField } from '@material-ui/core';
import FadeIn from 'react-fade-in';
import ApiClient from '../../services/ApiClient';
import {IDetailsProps} from "./types";

export const Details  = ({ route }: IDetailsProps): JSX.Element => {
  const dishes = [...useSelector((state) => state.user.dishesInRadius)];
  const [dish, setDish] = useState(...dishes.filter((dish) => dish._id === route.params.dishId));
  const user = useSelector((state) => state.user.userData);

  const [editable, setEditable] = useState(false);
  const updateDish = async () => {
    if (editable) {
      const updatedDailyTreat = await ApiClient.updateDish(user._id, dish._id, { dishText, cookedOrdered })
      dispatch(updateDailyTreat(updatedDailyTreat));
    }
    setEditable(!editable);
    setDish((prevValue) => ({
      ...prevValue,
      ...dishText,
    }));
  }

  const dispatch = useDispatch();

  const handleBack = async () => {
    dispatch(backToProfileRequest());
    history.push('/profile')
  };
  const [cookedOrdered, setCoockedOrdered] = useState({
    cooked: dish.cookedNotOrdered,
    ordered: dish.cookedNotOrdered === false ? true : false,
  });

  const handleCookedOrdered = async (event) => {
    event.preventDefault();
    const { name, checked } = event.target;
    setCoockedOrdered(() => ({
      [name === 'cooked' ? 'ordered' : 'cooked'] : false,
      [name]: checked
    }));
  };

  const styles = {
    someTextField: {
      minHeight: 420,
      minWidth: 800,
      paddingTop: "10%"
    }
  };

  const CHARACTER_LIMIT_TITLE = 20;
  const CHARACTER_LIMIT_DESCRIPTION = 140;
  const CHARACTER_LIMIT_RECIPE = 500;

  const title = 'title';
  const description = 'description';
  const recipe = 'recipe';

  const initialDishTextState = {
    title: dish.title,
    description: dish.description,
    recipe: dish.recipe,
  }
  const [dishText, setDishText] = useState({
    ...initialDishTextState,
  });
  const handleChangeText = (name) => (event) => {
    setDishText((prevValue) => ({ ...prevValue, [name]: event.target.value }));
  }
  return (
    <FadeIn delay={950} transitionDuration={1750}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={12}  className='dish-publisher'>
          {`${dish.creatorName} from ${dish.city}`}
        </Grid>
        <Grid item sm={12} xs={12}>
          { !editable
            ?
              <div className="dish-title">
                {`${dishText.title}`}
              </div>
            :
            <TextField
              id="dish-title-change"
              label="Title"
              inputProps={{
                maxLength: CHARACTER_LIMIT_TITLE
              }}
              value={dishText.title}
              helperText={`${dishText.title.length}/${CHARACTER_LIMIT_TITLE}`}
              style={{"minWidth": "20vw"}}
              rowsMax="10"
              variant="filled"
              onChange={handleChangeText(title)}
              InputProps={{ classes: { input: styles.someTextField.toString() } }}
            />
          }
        </Grid>
        <Grid item sm={12} xs={12}>
          <Image
            src={dish.imageUrl}
            imageStyle={{ width:"57.5%", height:"100%", "borderRadius": "2.5%"}}
            style={{"backgroundColor": "inherit", "marginTop": "0%", "marginLeft": "30%", "padding": "10%"}}
          />
        </Grid>
        <Grid item sm={12} xs={12}>
        { !editable
          ?
            <div className="dish-description">
              {`${dishText.description}`}
            </div>
          :
            <TextField
              id="dish-description-change"
              label="Description"
              inputProps={{
                maxLength: CHARACTER_LIMIT_DESCRIPTION
              }}
              value={dishText.description}
              helperText={`${dishText.description.length}/${CHARACTER_LIMIT_DESCRIPTION}`}
              style={{"minWidth": "40vw"}}
              multiline
              rowsMax="10"
              variant="filled"
              onChange={handleChangeText(description)}
              InputProps={{ classes: { input: styles.someTextField.toString(), } }}
            />
        }
        </Grid>
        <Grid item sm={12} xs={12}>
          { !editable
            ?
              <div className="dish-recipe">
                {`${dishText.recipe}`}
              </div>
            :
            <TextField
              id="dish-recipe"
              label="Recipe"
              inputProps={{
                maxLength: CHARACTER_LIMIT_RECIPE
              }}
              value={dishText.recipe}
              helperText={`${dishText.recipe.length}/${CHARACTER_LIMIT_RECIPE}`}
              style={{"minWidth": "40vw"}}
              multiline
              rowsMax="10"
              variant="filled"
              onChange={handleChangeText(recipe)}
              InputProps={{ classes: { input: styles.someTextField.toString(), } }}
            />
          }
        </Grid>
        { user._id == dish.userID
          ?
          <Grid item xs={12} md={12} lg={12}>
            <div className="row">
              <div className="col">
                <FormControlLabel
                  control={
                    <Checkbox
                      id='local-dishes-parameter-cooked'
                      onChange={handleCookedOrdered}
                      label='Cooked'
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
                    id='local-dishes-parameter-ordered'
                    onChange={handleCookedOrdered}
                    label='Ordered'
                    checked={cookedOrdered.ordered}
                    name='ordered'
                    color="primary"
                    value={cookedOrdered.ordered}
                  />
                }
                label="ordered"
              />
              </div>
            </div>
          </Grid>
        : ''}
        { user._id == dish.userID
          ?
          <Grid item xs={12} md={12} lg={12}>
              <Button
                variant="contained"
                color="primary"
                id="update-button"
                className="button"
                onClick={updateDish}
                >
                { !editable ? 'Update' : 'Confirm' }
              </Button>
          </Grid>
          : ''
        }
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
}