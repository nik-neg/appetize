import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Image from 'material-ui-image'
import history from '../../history';
import { backToProfileRequest, updateDailyTreat } from '../../store/userSlice';
import './Details.scss';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { TextField } from '@material-ui/core';
import FadeIn from 'react-fade-in';
import ApiClient from '../../services/ApiClient';

export default function Details ({ match }) {
  const dishes = [...useSelector((state) => state.user.dishesInRadius)];
  const [dish, setDish] = useState(...dishes.filter((dish) => dish._id === match.params.dishId));
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
    await dispatch(backToProfileRequest());
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
    const limit = handleCharacterLimit(name);
    setDishText((prevValue) => ({ ...prevValue, [name]: event.target.value.slice(0, limit) }));
  }
  const handleCharacterLimit = (name) => {
    let limit;
    switch(name) {
      case title: limit = CHARACTER_LIMIT_TITLE;
        break;
      case description: limit = CHARACTER_LIMIT_DESCRIPTION;
        break;
      case recipe: limit = CHARACTER_LIMIT_RECIPE;
        break;
    }
    return limit;
  }
  return (
    <FadeIn delay={950} transitionDuration={1750}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={12}  className='dish-publisher'>
          {`${dish.creatorName} from ${dish.city}`}
        </Grid>
        <Grid item xs={12} md={12} lg={12} className='dish-title'>
          { !editable
          ?
            <div contentEditable={editable}>
              {`${dishText.title}`}
            </div>
          :
            <TextField
              id="dish-title"
              label="Title"
              inputProps={{
                maxLength: CHARACTER_LIMIT_TITLE
              }}
              value={dishText.title}
              helperText={`${dishText.title.length}/${CHARACTER_LIMIT_TITLE}`}
              style={{ height: '3vw', width: '20vw' }}
              rowsMax="10"
              variant="filled"
              onChange={handleChangeText(title)}
            />
          }
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Image
            src={dish.imageUrl}
            imageStyle={{ width:"58%", height:"100%", "borderRadius": "2.5%"}}
            style={{"backgroundColor": "inherit", "marginTop": "0%", "marginLeft": "30%", "padding": "10%"}}
          />
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
        <Grid item xs={12} md={12} lg={12} className='dish-description'>
        { !editable
          ?
            <div contentEditable={editable} >
              {`${dishText.description}`}
            </div>
          :
            <TextField
              id="dish-description"
              label="Description"
              inputProps={{
                maxLength: CHARACTER_LIMIT_DESCRIPTION
              }}
              value={dishText.description}
              helperText={`${dishText.description.length}/${CHARACTER_LIMIT_DESCRIPTION}`}
              style={{ height: '3vw', width: '40vw' }}
              rowsMax="10"
              variant="filled"
              onChange={handleChangeText(description)}
            />
        }
        </Grid>
        <Grid item xs={12} md={12} lg={12} className='dish-recipe'>
        { !editable
          ?
            <div contentEditable={editable} >
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
              style={{ height: '3vw', width: '40vw' }}
              rowsMax="10"
              variant="filled"
              onChange={handleChangeText(recipe)}
            />
        }
        </Grid>

        { user._id == dish.userID
          ?
          <Grid item xs={12} md={12} lg={12}>
            <Button
              variant="contained"
              color="primary"
              id="update-button"
              className="button"
              // startIcon={<ExitToAppIcon />}
              // style={logOutButtonStyle}
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
            id="logout-button"
            className="button"
            // startIcon={<ExitToAppIcon />}
            // style={logOutButtonStyle}
            onClick={handleBack}
            >
            Back
          </Button>
        </Grid>
      </Grid>
      </FadeIn>
  );
}