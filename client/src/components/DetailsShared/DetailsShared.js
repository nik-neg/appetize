import { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Image from 'material-ui-image'
import FadeIn from 'react-fade-in';
import ApiClient from '../../services/ApiClient';
import { useDispatch } from 'react-redux';
import history from '../../history';
import { backToProfileRequest } from '../../store/userSlice';

export default function DetailsShared ({ match }) {
  const [dish, setDish] = useState({});
  useEffect( async () => {
    const id = match.params.dishId;
    const dish = await ApiClient.getDish(id);
    setDish(dish);
  }, []);

  const dispatch = useDispatch();

  const handleBack = async () => {
    dispatch(backToProfileRequest());
    history.push('/profile')
  };

  return (
    <FadeIn delay={950} transitionDuration={1750}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={12}  className='dish-publisher'>
          {`${dish.creatorName} from ${dish.city}`}
        </Grid>
        <Grid item sm={12} xs={12}>
           <div className="dish-title">
              {`${dish.title}`}
            </div>
        </Grid>
        <Grid item sm={12} xs={12}>
          <Image
            src={dish.imageUrl}
            imageStyle={{ width:"57.5%", height:"100%", "borderRadius": "2.5%"}}
            style={{"backgroundColor": "inherit", "marginTop": "0%", "marginLeft": "30%", "padding": "10%"}}
          />
        </Grid>
        <Grid item sm={12} xs={12}>
          <div className="dish-description">
            {`${dish.description}`}
          </div>
        </Grid>
        <Grid item sm={12} xs={12}>
          <div className="dish-recipe">
            {`${dish.recipe}`}
          </div>
        </Grid>
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