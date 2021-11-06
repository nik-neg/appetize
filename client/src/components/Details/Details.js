// import { store } from '../../store/index';
import { useState } from 'react';
import { useSelector } from 'react-redux'; // useDispatch
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Image from 'material-ui-image'
import history from '../../history';

export default function Details ({ match }) {
  const dishes = [...useSelector((state) => state.user.dishesInRadius)];
  const [dish, setDish] = useState(...dishes.filter((dish) => dish._id === match.params.dishId));
  const user = useSelector((state) => state.user.userData);
  console.log(dish, user._id, dish.userID)
  const updateDish = async () => {
    setDish(dish); // TODO: add title, description,  recipe update
  }

  const handleBack = async () => {
    history.push('/profile')
  }
  // TODO: add votes
  return (
    <div>
    <Grid container spacing={2}>
      <Grid item xs={12} md={12} lg={12}>
        <h1>
          {`${dish.creatorName} from ${dish.city}`}
        </h1>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <h1>
          {`${dish.title}`}
        </h1>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <Image
          src={dish.imageUrl}
          imageStyle={{ width:"72.5%", height:"100%", "borderRadius": "5%"}}
          style={{"backgroundColor": "inherit", "marginTop": "0%", "marginLeft": "22.5%", "padding": "15%"}}
        />
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <h2>
          {`${dish.description}`}
        </h2>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <h2>
          {`${dish.recipe}`}
        </h2>
      </Grid>
      { user._id == dish.userID
        ?
          <Grid item xs={12} md={12} lg={12}>
            <Button
              variant="contained"
              color="primary"
              id="logout-button"
              // startIcon={<ExitToAppIcon />}
              // style={logOutButtonStyle}
              onClick={updateDish}
              >
              Update
            </Button>
          </Grid>
        : ''
      }
      <Grid item xs={12} md={12} lg={12}>
        <Button
          variant="contained"
          color="primary"
          id="logout-button"
          // startIcon={<ExitToAppIcon />}
          // style={logOutButtonStyle}
          onClick={handleBack}
          >
          Back
        </Button>
      </Grid>
    </Grid>
    </div>

  );
}