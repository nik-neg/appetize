import { useState, useEffect } from 'react';
// import Image from 'material-ui-image'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import ApiClient from '../../services/ApiClient';
import DropZone from '../DropZone/DropZone';
import LocalDishesParameter from '../LocalDishesParameter/LocalDischesParameter';

import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

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

const useStylesSaveButton = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));


export default function Profile ({id}) {
  const classes = useStylesSaveButton();

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

    const handleUpdateZipCode = async () => {
      console.log("HANDLE UPDATE ZIP CODE")
      const updateZipCodeResponse = await ApiClient.confirmZipCode(id, {zipCode: zipCode});
      console.log(updateZipCodeResponse);
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
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.button}
            startIcon={<SaveIcon />}
            onClick={handleUpdateZipCode}
          >
            Save
          </Button>
        </Grid>

      </Grid>
      <DropZone id={id} firstName={userData.firstName}/>
      {/* <Grid item xs={6}>
          <TextField
            id="standard-basic"
            label="Standard"
            style={{"margin-left": "75%"}}
          />
        </Grid> */}
        <LocalDishesParameter/>
         <Card id={id}/>
    </div>
  );
}