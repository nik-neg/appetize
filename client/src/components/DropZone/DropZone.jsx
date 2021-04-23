import React, { useState } from "react"; //useEffect
// import React, { useState, useEffect } from "react";

import './index.css';
// import { DropzoneArea } from 'material-ui-dropzone';
import { DropzoneDialogBase } from 'material-ui-dropzone';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import ApiClient from '../../services/ApiClient';

import Box from '@material-ui/core/Box';

import Image from 'material-ui-image'
import { TextField } from '@material-ui/core';

// import { makeStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

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

import FadeIn from 'react-fade-in';

export default function DropZone (props) {
  // const classes = useStyles();

  const [imagePath, setImagePath] = useState(``);

  const upLoadButtonStyle = {maxWidth: '200px', maxHeight: '40px', minWidth: '200px', minHeight: '40px'};
  const styles = {
    someTextField: {
      minHeight: 420,
      paddingTop: "10%"
    }
  };


  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const dialogTitle = () => (
    <>
      <span>Upload file</span>
      <IconButton
        style={{right: '12px', top: '8px', position: 'absolute'}}
        onClick={() => setOpen(false)}>
        <CloseIcon />
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
                Meal of the Day
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
          <FadeIn delay={1000} transitionDuration={1000}>
            <TextField
                id="standard-basic"
                label="Description"
                style={{"margin-left": "75%", "margin-top": "2.5%"}}
                multiline
                rowsMax="10"
                variant="filled"
                InputProps={{ classes: { input: styles.someTextField } }}
            />
          </FadeIn>
          : ''}

        </Grid>

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
