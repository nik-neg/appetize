import React, { useState } from "react"; //useEffect
// import React, { useState, useEffect } from "react";

import './index.css';
// import { DropzoneArea } from 'material-ui-dropzone';
import { DropzoneDialogBase } from 'material-ui-dropzone';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
// import CloseIcon from '@material-ui/icons/Close';
// import SendIcon from '@material-ui/icons/Send';

import ApiClient from '../../services/ApiClient';

import Box from '@material-ui/core/Box';

import Image from 'material-ui-image'
import { TextField } from '@material-ui/core';

// import { makeStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

// import { makeStyles } from '@material-ui/core/styles';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import SearchIcon from '@material-ui/icons/Search';

// import {  withStyles } from '@material-ui/core/styles';
// import Icon from '@material-ui/core/Icon';

// import Card from '../Card/Card'

// import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   paper: {
//     padding: theme.spacing(2),
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
//   },
// }));

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   paper: {
//     padding: theme.spacing(2),
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
//   },
// }));

// const useStyles = makeStyles((theme) => ({
//   button: {
//     margin: theme.spacing(1),
//   },
// }));

  // const useStylessButton = makeStyles((theme) => ({
  //   button: {
  //     margin: theme.spacing(1),
  //   },
  // }));


import FadeIn from 'react-fade-in';

export default function DropZone (props) {
  // const classes = useStylessButton();

  const CHARACTER_LIMIT_TITLE = 20;
  const CHARACTER_LIMIT_DESCRIPTION = 140;
  const CHARACTER_LIMIT_RECIPE = 500;
  const [imagePath, setImagePath] = useState(``);

  const [dish, setDish] = useState({
    title: "",
    description: "",
    recipe: ""
  });

  const upLoadButtonStyle = {maxWidth: '200px', maxHeight: '40px', minWidth: '200px', minHeight: '40px'};
  const styles = {
    someTextField: {
      minHeight: 420,
      minWidth: 800,
      paddingTop: "10%"
    }
  };

  // const ColorButton = withStyles(() => ({
  //   root: {
  //     color: "#FFFFFF",
  //     backgroundColor: "#B8B8B8",
  //     '&:hover': {
  //       backgroundColor: "#B8B8B8",
  //     },
  //   },
  // }))(Button);




  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const dialogTitle = () => (
    <>
      <span>Upload file</span>
      <IconButton
        style={{right: '12px', top: '8px', position: 'absolute'}}
        onClick={() => setOpen(false)}>
        {/* <CloseIcon /> */}
      </IconButton>
    </>
  );

  const handleUpload = async () => {
    console.log("HANDLE SAVE")
    const uploadReponse = await ApiClient.uploadImage(props.id, fileObjects['0']);
    console.log(uploadReponse)
  }

  const handleDownload = async () => {
    console.log("DOWNLOAD IMAGE")
    const downloadResponse = await ApiClient.displayImage(props.id);
    console.log("DOWNLOAD RESPONSE")
    console.log(downloadResponse)
    setImagePath(downloadResponse.url);
  }

  const handleDelete = deleted => {
    setFileObjects(fileObjects.filter(f => f !== deleted));
  };

  const handleChange = name => (event) => {
    // const { name, value } = event.target;
    // setInput((prevInput) => ({ ...prevInput, [name]: value }));
    setDish((prevValue) => ({ ...prevValue, [name]: event.target.value }));
    console.log(dish)
  }

  // const handleChange = name => event => {
  //   setValues({ ...values, [name]: event.target.value });
  // };

  const handlePublish = async (event) => {
    console.log('click', event.target.value)
    // Api client send save request with url to images db for dashbard
    const firstName = props.firstName;
    const publishObject = {...dish, firstName};
    console.log(publishObject);
    const publishResponse = await ApiClient.publishToDashBoard(props.id, publishObject)
    console.log(publishResponse)
  }

  return (
    <div>
      <Grid
        container
        spacing={6}
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        style={{"padding-left": "5%", "padding-top": "2%"}}
      >
      {/* <ColorButton variant="contained" color="primary" className={classes.margin}>
        Custom CSS
      </ColorButton> */}
        <Grid item xs={6}>
          <div className="button-box">
            <Box component="span" display="block" style={{"padding-left": "30%", "padding-top": "5%"}}>
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
        </Grid>
        <Grid item xs={6}>
          <div className="button-box">
            <Box component="span" display="block" style={{"padding-left": "30%", "padding-top": "5%"}}>
              <Button
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              style={upLoadButtonStyle}
              >
              Hall of Fame
              </Button>
            </Box>
          </div>
        </Grid>
      <Grid
        container
        spacing={6}
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        style={{"padding-left": "5%", "padding-top": "2%"}}
      >
      {/* <Grid item xs={3}>
          <Paper className={classes.paper}>xs=6</Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>xs=6</Paper>
        </Grid> */}

        <Grid item xs={6}>
          {imagePath.length > 0 ?
          <Image
            src={imagePath}
            imageStyle={{width:500, height:300}}
            style={{"backgroundColor": "inherit", "position": "absolute", "padding-right": "1%"}}
          /> : ''}
        </Grid>
        </Grid>
      </Grid>

      <Grid item xs={6}>
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
              style={{"margin-left": "75%", "margin-top": "2.5%", "min-width": "32rem"}}
              rowsMax="10"
              variant="filled"
              onChange={handleChange('title')}
              InputProps={{ classes: { input: styles.someTextField } }}
            />
          </FadeIn>
          : ''}
        </Grid>
        <Grid item xs={6}>
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
              style={{"margin-left": "75%", "margin-top": "2.5%", "min-width": "32rem"}}
              multiline
              rowsMax="10"
              variant="filled"
              onChange={handleChange('description')}
              InputProps={{ classes: { input: styles.someTextField } }}
            />
          </FadeIn>
          : ''}
        </Grid>
        <Grid item xs={6}>
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
              style={{"margin-left": "75%", "margin-top": "2.5%", "min-width": "32rem"}}
              multiline
              rowsMax="10"
              variant="filled"
              onChange={handleChange('recipe')}
              InputProps={{ classes: { input: styles.someTextField } }}
            />
          </FadeIn>
          : ''}
        </Grid>
        { imagePath.length > 0 ?
        <FadeIn delay={4500} transitionDuration={1000}>
          <FormControlLabel
            control={<Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} name="checkedH" />}
            label="Publish"
            style={{"margin-left": "1.5%"}}
            onClick={handlePublish}
          />
        </FadeIn>
        : ''}
        {/* <Button
        variant="contained"
        color="primary"
        style={{right: '12px', top: '8px'}}
        className={classes.button}
        endIcon={<SendIcon/>}
      >
       Go online 🤩
      </Button> */}
        {/* <Card/> */}


      <DropzoneDialogBase
        dialogTitle={dialogTitle()}
        acceptedFiles={['image/*']}
        fileObjects={fileObjects}
        cancelButtonText={"cancel"}
        submitButtonText={"submit"}
        maxFileSize={5000000}
        open={open}
        onAdd={newFileObjs => {
          setFileObjects([].concat(fileObjects, newFileObjs));
        }}
        onDelete={handleDelete}
        onClose={() => setOpen(false)}
        onSave={ async () => {
          console.log('onSave', fileObjects);
          await handleUpload();
          handleDownload();
          setOpen(false);
        }}
        showPreviews={true}
        showFileNamesInPreview={true}
      />
    </div>
  );
}
