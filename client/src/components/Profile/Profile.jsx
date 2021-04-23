import { useState, useEffect } from 'react';
// import Image from 'material-ui-image'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import ApiClient from '../../services/ApiClient';
import DropZone from '../DropZone/DropZone';
import LocalDishesParameter from '../LocalDishesParameter/LocalDischesParameter';

import { TextField } from '@material-ui/core';

import Card from '../Card/Card'


const useStylesAvatar = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));


const useStylesGrid = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));


export default function Profile ({id}) {
  const CHARACTER_LIMIT_TITLE = 10;
  const [zipCode, setZipCode] = useState('');
  const [userData, setUserData] = useState({});
  const classesAvatar = useStylesAvatar();
  const classesGrid = useStylesGrid();

  const styles = {
    someTextField: {
      minHeight: 420,
      minWidth: 800,
      paddingTop: "10%"
    }
  };

  // const [images, setImages] = useState({});

  useEffect(() => {
    ApiClient.getProfile(id)
    .then((data) => setUserData(data))
    }, []);

    const handleChange = (event) => {
      setZipCode(event.target.value);
      console.log(zipCode)
    }

  return (
    <div className={classesGrid.root}>
      <Grid
        container
        spacing={4}
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        style={{"padding-left": "11%", "padding-top": "5%"}}
      >
        <Grid item xs={6}>
          <h1>{userData.firstName}</h1>
          <Avatar alt="No Avatar" src="./logo.jpg" className={classesAvatar.large} style={{ height: '100px', width: '100px' }}/>
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="standard-basic"
            label="ZIP CODE"
            inputProps={{
              maxlength: CHARACTER_LIMIT_TITLE
            }}
            value={zipCode}
            helperText={`${zipCode.length}/${CHARACTER_LIMIT_TITLE}`}
            style={{"margin-top": "2.5%", "max-width": "6rem"}}
            variant="filled"
            onChange={handleChange}
            InputProps={{ classes: { input: styles.someTextField } }}
          />
        </Grid>
      </Grid>
      <DropZone id={id}/>
      {/* <Grid item xs={6}>
          <TextField
            id="standard-basic"
            label="Standard"
            style={{"margin-left": "75%"}}
          />
        </Grid> */}
        <LocalDishesParameter/>
         <Card/>
    </div>
  );
}