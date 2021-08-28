import { useState,  } from 'react'; // useEffect
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import ApiClient from '../../services/ApiClient';
import DropZone from '../DropZone/DropZone';

import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Dashboard from '../Dashboard/Dashboard';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Box from '@material-ui/core/Box';
const upLoadButtonStyle = {maxWidth: '200px', maxHeight: '40px', minWidth: '200px', minHeight: '40px'};

import FadeIn from 'react-fade-in';
import Image from 'material-ui-image'

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import LocalDishesParameter from '../LocalDishesParameter/LocalDischesParameter';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserZipCode } from '../../store/userSlice';
import './index.css'

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


export default function Profile () {
  const classes = useStylesSaveButton();

  const CHARACTER_LIMIT_ZIP_CODE = 10;
  const [zipCode, setZipCode] = useState('');
  const userData = {...useSelector((state) => state.user.userData)};
  let firstName = userData.firstName;
  userData.firstName = firstName[0].toUpperCase()+firstName.slice(1);

  const [cookedOrdered, setCoockedOrdered] = useState({
    cooked: false,
    ordered: false
  })

  const classesAvatar = useStylesAvatar();
  const classesGrid = useStylesGrid();

  const [open, setOpen] = useState(false);
  const [imagePath, setImagePath] = useState(``);

  const CHARACTER_LIMIT_TITLE = 20;
  const CHARACTER_LIMIT_DESCRIPTION = 140;
  const CHARACTER_LIMIT_RECIPE = 500;

  const [dish, setDish] = useState({
    title: "",
    description: "",
    recipe: ""
  });


  const styles = {
    someTextField: {
      minHeight: 420,
      minWidth: 800,
      paddingTop: "10%"
    }
  };

  const dispatch = useDispatch();

  const asyncWrapper = async (dispatch, asyncFunc, data) => {
    await dispatch(asyncFunc(data));
  }

  // useEffect(() => {
  //   // ApiClient.getProfile(id)
  //   // .then((data) => setUserData(data))
  //   }, []);

    const handleChangeZipCode = (event) => {
      setZipCode(event.target.value);
    }
    const handleChangeTextArea = name => (event) => {
      setDish((prevValue) => ({ ...prevValue, [name]: event.target.value }));
    }

    const handleUpdateZipCode = async () => {
      await asyncWrapper(dispatch, updateUserZipCode, { id: userData._id, zipCode });
      setZipCode('');
    }

    const handleCookedOrdered = async (event) => {
      event.preventDefault();
      const { name, checked } = event.target;
      setCoockedOrdered((prevValue) => ({
        [name === 'cooked' ? prevValue['ordered'] : prevValue['cooked']]: false,
        [name]: checked

      }))
    }

  const handlePublish = async (event) => {
    if(event.target.checked) {
      const firstName = userData.firstName;
      const publishObject = {...dish, firstName};
      try {
        await ApiClient.publishToDashBoard(userData._id, publishObject)
      } catch(e) {
        console.log(e);
      }
    }
  }

  const [mouthWateringDishes, setMouthWateringDishes] = useState([]);

  const handleLocalDishesParameterResults = (updatedValues) => {
    setMouthWateringDishes(null)
    setMouthWateringDishes(updatedValues);
  }


  return (
    <div className={classesGrid.root}>
      <FadeIn delay={950} transitionDuration={1750}>
        <Grid
          container
          spacing={4}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          <Grid item lg={4}>
            <h1>{userData.firstName}</h1>
            <Avatar alt="No Avatar" src="./logo.jpg" className={classesAvatar.large} style={{ height: '100px', width: '100px', marginLeft: "42%" }} />
            <TextField
              id="standard-basic"
              label="ZIP CODE"
              inputProps={{
                maxlength: CHARACTER_LIMIT_ZIP_CODE
              }}
              value={zipCode}
              helperText={`${zipCode.length}/${CHARACTER_LIMIT_TITLE}`}
              style={{"margin-top": "2.5%", "max-width": "6rem"}}
              variant="filled"
              onChange={handleChangeZipCode}
              InputProps={{ classes: { input: styles.someTextField } }}
            />
            <div className="button-box">
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
            </div>
            <div className="button-box">
              <Box component="span" display="block" >
                <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen(true)}
                startIcon={<CloudUploadIcon />}
                style={upLoadButtonStyle}
                >
                Daily Treat
                </Button>
              </Box>
            </div>
            <LocalDishesParameter
              onRadiusSearch={handleLocalDishesParameterResults}
              id={userData._id}
            />
          </Grid>
          {imagePath.length > 0 ?
          <Grid item lg={4}>
            <Image
              src={imagePath}
              imageStyle={{width:"80%", height:"48%"}} // 500 to 300 proportion => 5/8, 3/8 => 80 % / (5/8) => x => x * (3/8)
              style={{"backgroundColor": "inherit", "marginTop": "25%", "marginLeft": "5%"}}
            />
          </Grid>
          : ''}
        <Grid item lg={4}>
          <Grid item lg={4}>
            <Grid item lg={4}  style={{"marginTop": "42.5%", "margin-right:": "10%", "min-width": "24rem"}}>
            { imagePath.length > 0 ?
              <FadeIn delay={1500} transitionDuration={1000}>
                <TextField
                  id="standard-basic"
                  label="Title"
                  inputProps={{
                    maxlength: CHARACTER_LIMIT_TITLE
                  }}
                  value={dish.title}
                  helperText={`${dish.title.length}/${CHARACTER_LIMIT_TITLE}`}
                  style={{"marginTop": "16.5%", "marginRight": "16.5%", "min-width": "30rem"}}
                  rowsMax="10"
                  variant="filled"
                  onChange={handleChangeTextArea('title')}
                  InputProps={{ classes: { input: styles.someTextField } }}
                />
              </FadeIn>
              : ''}
            </Grid>
          <Grid item lg={4}  style={{"min-width": "30rem"}}>
            { imagePath.length > 0 ?
              <FadeIn delay={2500} transitionDuration={1000}>
                <TextField
                  id="standard-basic"
                  label="Description"
                  inputProps={{
                    maxlength: CHARACTER_LIMIT_DESCRIPTION
                  }}
                  value={dish.description}
                  helperText={`${dish.description.length}/${CHARACTER_LIMIT_DESCRIPTION}`}
                  style={{"min-width": "30rem"}}
                  multiline
                  rowsMax="10"
                  variant="filled"
                  onChange={handleChangeTextArea('description')}
                  InputProps={{ classes: { input: styles.someTextField } }}
                />
             </FadeIn>
              : ''}
            </Grid>
            <Grid item lg={4}>
              { imagePath.length > 0 ?
                <FadeIn delay={3500} transitionDuration={1000}>
                  <TextField
                    id="standard-basic"
                    label="Recipe"
                    inputProps={{
                      maxlength: CHARACTER_LIMIT_RECIPE
                    }}
                    value={dish.recipe}
                    helperText={`${dish.recipe.length}/${CHARACTER_LIMIT_RECIPE}`}
                    style={{"margin-top": "2.5%", "min-width": "30rem"}} //
                    multiline
                    rowsMax="10"
                    variant="filled"
                    onChange={handleChangeTextArea('recipe')}
                    InputProps={{ classes: { input: styles.someTextField } }}
                  />
                </FadeIn>
                : ''}
            </Grid>
          { imagePath.length > 0 ?
                <FadeIn delay={4500} transitionDuration={1000}>
                  <div className="publish-button-row">
                    <div className="publish-button-col">
                      <FormControlLabel
                        control={<Checkbox
                                  onChange={handlePublish}
                                  icon={<FavoriteBorder />}
                                  checkedIcon={<Favorite/>}
                                />}
                        label="Publish"
                      />
                    </div>
                    <div className="publish-button-col">
                      <FormControlLabel
                        control={<Checkbox
                                  onChange={handleCookedOrdered}
                                  icon={<FavoriteBorder />}
                                  checkedIcon={<Favorite/>}
                                  checked={cookedOrdered.cooked}
                                  name='cooked'
                                />}
                        label="Coocked"
                      />
                    </div>
                    <div className="publish-button-col">
                      <FormControlLabel
                        control={<Checkbox
                                  onChange={handleCookedOrdered}
                                  icon={<FavoriteBorder />}
                                  checkedIcon={<Favorite/>}
                                  checked={cookedOrdered.ordered}
                                  name="ordered"
                                />}
                        label="Ordered"
                      />
                    </div>
                  </div>
                </FadeIn>
              : ''}
        </Grid>
        </Grid>
          <Grid item lg={12}>
              <DropZone
                id={userData._id}
                firstName={userData.firstName}
                setOpen={setOpen}
                open={open}
                setImagePath={setImagePath}
                imagePath={imagePath}
                dish={dish}
              />
               <Dashboard
                id={userData._id}
                mouthWateringDishes={mouthWateringDishes}
               />
          </Grid>
        </Grid>

      </FadeIn>
    </div>
  );
}