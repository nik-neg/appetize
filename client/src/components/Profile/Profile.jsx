import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import withWidth from '@material-ui/core/withWidth';
import PropTypes from 'prop-types';

import ApiClient from '../../services/ApiClient';
import DropZone from '../DropZone/DropZone';

import { TextField } from '@material-ui/core';
import Dashboard from '../Dashboard/Dashboard';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Box from '@material-ui/core/Box';

import FadeIn from 'react-fade-in';
import Image from 'material-ui-image'

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import LocalDishesParameter from '../LocalDishesParameter/LocalDischesParameter';
import { useDispatch, useSelector} from 'react-redux';
import { updateUserZipCode, logoutUser } from '../../store/userSlice';
import './index.css'
import { store } from '../../store/index';
import history from '../../history';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';
const upLoadButtonStyle = { maxWidth: '200px', maxHeight: '40px', minWidth: '200px', minHeight: '40px' };
const logOutButtonStyle = { maxWidth: '150px', maxHeight: '40px', minWidth: '150px', minHeight: '40px' };

import apiServiceJWT from '../../services/ApiClientJWT';

import IconButton from '@material-ui/core/IconButton';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';

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

function Profile () {
  const classes = useStylesSaveButton();

  const CHARACTER_LIMIT_ZIP_CODE = 10;
  const [zipCode, setZipCode] = useState('');

  const [userData, setUserData] = useState({
    _id: '',
    firstName: '',
    hasUpdatedZipCode: store.getState().user.userData.zipCode !== undefined ? true : false,
    notUpdatedZipCodeMessage: 'Please update the zip code'
  })

  const cookedOrderedInitialState = {
    cooked: false,
    ordered: false,
    published: false
  }
  const [cookedOrdered, setCoockedOrdered] = useState(cookedOrderedInitialState);

  const classesAvatar = useStylesAvatar();
  const classesGrid = useStylesGrid();

  const [open, setOpen] = useState(false);
  const [openAvatar, setOpenAvatar] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const [imagePathForAvarar, setImagePathForAvatar] = useState('');

  const CHARACTER_LIMIT_TITLE = 20;
  const CHARACTER_LIMIT_DESCRIPTION = 140;
  const CHARACTER_LIMIT_RECIPE = 500;

  const dishTextInitialState = {
    title: "",
    description: "",
    recipe: ""
  }
  const [dish, setDish] = useState(dishTextInitialState);

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

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const getProfile = async (accessToken) => {
      const userInfo = await apiServiceJWT.getProfile(accessToken);
      if (userInfo.err) {
        history.push('/');
      } else {
        let { firstName, _id } = userInfo;
        firstName = firstName && firstName[0].toUpperCase() + firstName.slice(1);
        setImagePathForAvatar(store.getState().user.userData.avatarImageUrl);
        setUserData((prevValue) => ({
          ...prevValue,
          _id,
          firstName,
        }));
      }
    }
    getProfile(accessToken);
  }, []);

  let clearDishTextRequest = useSelector((state) => state.user.clearDishTextRequest);
  useEffect(() => {
    setDish(dishTextInitialState)
  }, [clearDishTextRequest]);

  const handleChangeZipCode = (event) => {
    setZipCode(event.target.value);
  }
  const handleChangeTextArea = name => (event) => {
    setDish((prevValue) => ({ ...prevValue, [name]: event.target.value }));
  }

  const handleUpdateZipCode = async () => {
    await asyncWrapper(dispatch, updateUserZipCode, { id: userData._id, zipCode });
    setZipCode('');
    if(!userData.hasUpdatedZipCode) {
      setUserData((prevValue) => ({
        ...prevValue,
        hasUpdatedZipCode: true,
      }));
    }
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
    const userId = userData._id;
    const chosenImageDate = store.getState().user.chosenImageDate;
    if(event.target.checked) {
      const firstName = userData.firstName;
      const userZipCode = store.getState().user.userData.zipCode;
      const publishObject = {
        ...dish,
        firstName,
        userZipCode,
        cookedNotOrdered: cookedOrdered.cooked === true ? true : false,
        chosenImageDate
      };
      setDish(dishTextInitialState);
      const {cooked, ordered } = cookedOrderedInitialState;

      setCoockedOrdered(() => ({
        cooked,
        ordered,
        published: event.target.checked,
      }));
      setTimeout(() => {
        setCoockedOrdered(() => (cookedOrderedInitialState));
      }, 1000);
      try {
        await ApiClient.publishToDashBoard(userId, publishObject);
        await ApiClient.removeUnusedImagesFromDB(userId);

      } catch(e) {
        console.log(e);
      }
    }
  }

  const handleLogout = async () => {
    await asyncWrapper(dispatch, logoutUser);
    history.push('/');
  }

  return (
    <div className={classesGrid.root}>
      <FadeIn delay={950} transitionDuration={1750}>
        <Grid
          container
          spacing={4}
          direction="row"
          justify='center'
          alignItems="flex-start"
        >
          <Grid item lg={4} sm={12} xs={12} >
            <h1>{userData.firstName}</h1>
            <div className="avatar-box">
                <Avatar alt="No Avatar" src={imagePathForAvarar} className={classesAvatar.large} style={{ height: '8rem', width: '8rem' }} />
            </div>
            <div>
              <DropZone
                setOpen={setOpenAvatar}
                open={userData.hasUpdatedZipCode ? openAvatar : null}
                setImagePath={setImagePathForAvatar}
                avatar={true}
              />
              <IconButton
              aria-label="foto"
              onClick={() => setOpenAvatar(true)}
              >
                <AddAPhotoIcon />
            </IconButton>
            </div>
            <TextField
              id="zip-code-field"
              label="ZIP CODE"
              inputProps={{
                maxLength: CHARACTER_LIMIT_ZIP_CODE
              }}
              value={zipCode}
              helperText={`${zipCode.length}/${CHARACTER_LIMIT_TITLE}`}
              style={{"marginTop": "2.5%", "maxWidth": "6rem"}}
              variant="filled"
              onChange={handleChangeZipCode}
              InputProps={{ classes: { input: styles.someTextField.toString() } }}
            />
            <div id="update-zip-code-message">
            { !userData.hasUpdatedZipCode ? userData.notUpdatedZipCodeMessage : ''}
            </div>
            <div className="button-box">
              <Button
                id="save-zip-code-button"
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
                id="daily-treat-upload-button"
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
          </Grid>
          <Hidden only={['xs', 'sm', 'md']}>
            <Grid item lg={4}>
            { imagePath.length > 0 ?
              <Image
                src={imagePath}
                imageStyle={{"borderRadius": "12.5%"}} // 500 to 300 proportion => 5/8, 3/8 => 80 % / (5/8) => x => x * (3/8)
                style={{"backgroundColor": "inherit", "marginTop": "17.5%","padding": "150px"}}
              />
            : ''}
            </Grid>
          </Hidden>
          <Hidden only={['xs', 'sm', 'md']}>
            <Grid item lg={4}>
              <div className="logout">
                <Button
                  variant="contained"
                  color="primary"
                  id="logout-button"
                  startIcon={<ExitToAppIcon />}
                  style={logOutButtonStyle}
                  onClick={handleLogout}
                  >
                  Logout
                </Button>
              </div>
              <Grid item lg={4}>
                <Grid item lg={4}>
                  <Grid item lg={4}  style={{"marginTop": "42.5%", "marginRight:": "10%", "minWidth": "24rem"}}>
                  { imagePath.length > 0 ?
                    <FadeIn delay={1500} transitionDuration={1000}>
                      <TextField
                        id="dish-title"
                        label="Title"
                        inputProps={{
                          maxLength: CHARACTER_LIMIT_TITLE
                        }}
                        value={dish.title}
                        helperText={`${dish.title.length}/${CHARACTER_LIMIT_TITLE}`}
                        style={{"marginTop": "5%", "marginRight": "16.5%", "minWidth": "30rem"}}
                        rowsMax="10"
                        variant="filled"
                        onChange={handleChangeTextArea('title')}
                        InputProps={{ classes: { input: styles.someTextField.toString() } }}
                      />
                    </FadeIn>
                    : ''}
                  </Grid>
                <Grid item lg={4}  style={{"minWidth": "30rem"}}>
                  { imagePath.length > 0 ?
                    <FadeIn delay={2500} transitionDuration={1000}>
                      <TextField
                        id="dish-description"
                        label="Description"
                        inputProps={{
                          maxLength: CHARACTER_LIMIT_DESCRIPTION
                        }}
                        value={dish.description}
                        helperText={`${dish.description.length}/${CHARACTER_LIMIT_DESCRIPTION}`}
                        style={{"minWidth": "30rem"}}
                        multiline
                        rowsMax="10"
                        variant="filled"
                        onChange={handleChangeTextArea('description')}
                        InputProps={{ classes: { input: styles.someTextField.toString() } }}
                      />
                  </FadeIn>
                    : ''}
                  </Grid>
                  <Grid item lg={4}>
                    { imagePath.length > 0 ?
                      <FadeIn delay={3500} transitionDuration={1000}>
                        <TextField
                          id="dish-recipe"
                          label="Recipe"
                          inputProps={{
                            maxLength: CHARACTER_LIMIT_RECIPE
                          }}
                          value={dish.recipe}
                          helperText={`${dish.recipe.length}/${CHARACTER_LIMIT_RECIPE}`}
                          style={{"marginTop": "2.5%", "minWidth": "30rem"}}
                          multiline
                          rowsMax="10"
                          variant="filled"
                          onChange={handleChangeTextArea('recipe')}
                          InputProps={{ classes: { input: styles.someTextField.toString(), } }}
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
                                        checked={cookedOrdered.published}
                                        name='publish'
                                        value={cookedOrdered.published}
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
                                        value={cookedOrdered.cooked}
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
                                        value={cookedOrdered.ordered}
                                      />}
                              label="Ordered"
                            />
                          </div>
                        </div>
                      </FadeIn>
                    : ''}
                    </Grid>
                  </Grid>
                </Grid>
              </Hidden>

        <Hidden lgUp>
        { imagePath.length > 0 ?
          <Grid item sm={12} xs={12}>
            <Image
              src={imagePath}
              imageStyle={{ width:"72.5%", height:"100%", "borderRadius": "5%"}}
              style={{"backgroundColor": "inherit", "marginTop": "0%", "marginLeft": "22%", "padding": "150px"}}
            />
          </Grid>
          : ''}
          { imagePath.length > 0 ?
          <>
          <Grid item sm={12} xs={12}>
            <FadeIn delay={1500} transitionDuration={1000}>
              <TextField
                id="dish-title"
                label="Title"
                inputProps={{
                  maxLength: CHARACTER_LIMIT_TITLE
                }}
                value={dish.title}
                helperText={`${dish.title.length}/${CHARACTER_LIMIT_TITLE}`}
                style={{"minWidth": "55vw"}}
                rowsMax="10"
                variant="filled"
                onChange={handleChangeTextArea('title')}
                InputProps={{ classes: { input: styles.someTextField.toString() } }}
              />
            </FadeIn>
          </Grid>
          <Grid item sm={12} xs={12}>
            <FadeIn delay={2500} transitionDuration={1000}>
              <TextField
                id="dish-description"
                label="Description"
                inputProps={{
                  maxLength: CHARACTER_LIMIT_DESCRIPTION
                }}
                value={dish.description}
                helperText={`${dish.description.length}/${CHARACTER_LIMIT_DESCRIPTION}`}
                style={{"minWidth": "55vw"}}
                multiline
                rowsMax="10"
                variant="filled"
                onChange={handleChangeTextArea('description')}
                InputProps={{ classes: { input: styles.someTextField.toString(), } }}
              />
          </FadeIn>
          </Grid>
          <Grid item sm={12} xs={12}>
            <FadeIn delay={3500} transitionDuration={1000}>
              <TextField
                id="dish-recipe"
                label="Recipe"
                inputProps={{
                  maxLength: CHARACTER_LIMIT_RECIPE
                }}
                value={dish.recipe}
                helperText={`${dish.recipe.length}/${CHARACTER_LIMIT_RECIPE}`}
                style={{"minWidth": "55vw"}}
                multiline
                rowsMax="10"
                variant="filled"
                onChange={handleChangeTextArea('recipe')}
                InputProps={{ classes: { input: styles.someTextField.toString(), } }}
              />
            </FadeIn>
          </Grid>
          <Grid item sm={12} xs={12}>
          <FadeIn delay={4500} transitionDuration={1000}>
            <div className="publish-button-row-small-device">
                <FormControlLabel
                  control={<Checkbox
                            onChange={handlePublish}
                            icon={<FavoriteBorder />}
                            checkedIcon={<Favorite/>}
                            checked={cookedOrdered.published}
                            name='publish'
                            value={cookedOrdered.published}
                          />}
                  label="Publish"
                />
                <FormControlLabel
                  control={<Checkbox
                            onChange={handleCookedOrdered}
                            icon={<FavoriteBorder />}
                            checkedIcon={<Favorite/>}
                            checked={cookedOrdered.cooked}
                            name='cooked'
                            value={cookedOrdered.cooked}
                          />}
                  label="Coocked"
                />
                <FormControlLabel
                  control={<Checkbox
                            onChange={handleCookedOrdered}
                            icon={<FavoriteBorder />}
                            checkedIcon={<Favorite/>}
                            checked={cookedOrdered.ordered}
                            name="ordered"
                            value={cookedOrdered.ordered}
                          />}
                  label="Ordered"
                />
            </div>
          </FadeIn>
          </Grid>
          </>
          : ''}
        </Hidden>
        <Grid item lg={4} style={{ top: '8rem' }}>
          <LocalDishesParameter
          />
        </Grid>
        <DropZone
          setOpen={setOpen}
          open={userData.hasUpdatedZipCode ? open : null}
          setImagePath={setImagePath}
        />
        <Hidden only={['xs', 'sm', 'md']}>
          <Grid item lg={4}>

          </Grid>
        </Hidden>
        <Hidden only={['xs', 'sm', 'md']}>
          <Grid item lg={4}>

          </Grid>
        </Hidden>
        <Hidden only={['xs', 'sm', 'md']}>
          <Grid item lg={4}>

          </Grid>
        </Hidden>

        <Hidden only={['xs', 'sm', 'md']}>
          <Grid item lg={12}>
          <Dashboard
            id={userData._id}
            />
          </Grid>
          </Hidden>
        </Grid>
        <Hidden lgUp>
          <Grid item sm={12}>
            <div className="dashboard">
              <Dashboard
                id={userData._id}
                />
            </div>
          </Grid>
          <div className="logout-small-devices">
                <Button
                  variant="contained"
                  color="primary"
                  id="logout-button"
                  startIcon={<ExitToAppIcon />}
                  style={logOutButtonStyle}
                  onClick={handleLogout}
                  >
                  Logout
                </Button>
              </div>
        </Hidden>
      </FadeIn>
    </div>
  );
}

Profile.propTypes = {
  width: PropTypes.oneOf(['lg', 'md', 'sm', 'xl', 'xs']).isRequired,
};


export default withWidth()(Profile);