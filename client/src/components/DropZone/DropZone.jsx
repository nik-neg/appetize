import React, { useState } from "react";
// import { DropzoneAreaBase } from "material-ui-dropzone";
import './index.css';
// import { DropzoneArea } from 'material-ui-dropzone';
import { DropzoneDialogBase } from 'material-ui-dropzone';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import ApiClient from '../../services/ApiClient';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import Card from '../Card/Card'

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

export default function DropZone (props) {

  // const classes = useStyles();

  // const handleAdd = newFiles => {
  //   newFiles = newFiles.filter(file => !files.find(f => f.data === file.data));
  //   setFiles([...files, ...newFiles]);
  // };

  // const handleDelete = deleted => {
  //   setFiles(files.filter(f => f !== deleted));
  // };


  const upLoadButtonStyle = {maxWidth: '130px', maxHeight: '40px', minWidth: '130px', minHeight: '40px'};


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

  const handleSave = async () => {
    console.log("HANDLE SAVE")
    console.log(fileObjects['0'])
    const uploadReponse = await ApiClient.uploadImage(props.id, fileObjects['0']);
    console.log(uploadReponse)
  }

  // const [files, setFiles] = useState([]);
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
            <Box component="span" display="block">
              <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
              startIcon={<CloudUploadIcon />}
              style={upLoadButtonStyle}
              >
              Breakfast
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
        style={{"padding-left": "25%",  "position": "absolute"}}
      >
        <Grid item xs={6}>
          <Card/>
        </Grid>
      </Grid>
      </Grid>

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
            <Box component="span" display="block">
              <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
              startIcon={<CloudUploadIcon />}
              style={upLoadButtonStyle}
              >
              Lunch
              </Button>
            </Box>
          </div>
        </Grid>
      </Grid>

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
            <Box component="span" display="block">
              <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
              startIcon={<CloudUploadIcon />}
              style={upLoadButtonStyle}
              >
              Dinner
              </Button>
            </Box>
          </div>
        </Grid>
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
          console.log('onAdd', newFileObjs);
          console.log('onAdd', newFileObjs['0'].data);
          setFileObjects([].concat(fileObjects, newFileObjs));
        }}
        // onDelete={deleteFileObj => {
        //   console.log('onDelete', deleteFileObj);
        // }}
        onDelete={handleDelete}
        onClose={() => setOpen(false)}
        onSave={() => {
          console.log('onSave', fileObjects);
          handleSave();
          setOpen(false);
        }}
        showPreviews={true}
        showFileNamesInPreview={true}
      />
    </div>
  );
}
