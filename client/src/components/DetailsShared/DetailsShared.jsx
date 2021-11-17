import { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Image from 'material-ui-image'
import FadeIn from 'react-fade-in';
import ApiClient from '../../services/ApiClient';

export default function DetailsShared ({ match }) {
  const [dish, setDish] = useState({});
  useEffect( async () => {
    const id = match.params.dishId;
    const dish = await ApiClient.getDish(id);
    setDish(dish);
  }, []);

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
      </Grid>
    </FadeIn>
  );
}