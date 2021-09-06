import React, { useState } from "react";
import './index.css';
import { DropzoneDialogBase } from 'material-ui-dropzone';
import IconButton from '@material-ui/core/IconButton';
import ApiClient from '../../services/ApiClient';

export default function DropZone (props) {

  const [fileObjects, setFileObjects] = useState([]);
  const dialogTitle = () => (
    <>
      <span>Upload file</span>
      <IconButton
        style={{right: '12px', top: '8px', position: 'absolute'}}
        onClick={() => props.setOpen(false)}>
      </IconButton>
    </>
  );

  const [createdImageDate, setCreateImageDate] = useState(0); // TODO: create async thunk with redux

  const handleUpload = async () => { // TODO: set limitation here, or handle image control via a counter to save / retrive the actual image
    const newCreatedImageDate = new Date().getTime();
    setCreateImageDate(newCreatedImageDate);
    await ApiClient.uploadImage(props.id, fileObjects['0'], newCreatedImageDate);
  }

  const handleDownload = async () => {
    console.log(createdImageDate)
    const downloadResponse = await ApiClient.displayImage(props.id, createdImageDate); // TODO: pass date informatinon
    props.setImagePath(downloadResponse.url);
  }

  const handleDelete = deleted => {
    setFileObjects(fileObjects.filter(f => f !== deleted));
  };

  return (
    <div>
      <DropzoneDialogBase
        dialogTitle={dialogTitle()}
        acceptedFiles={['image/*']}
        fileObjects={fileObjects}
        cancelButtonText={"cancel"}
        submitButtonText={"submit"}
        maxFileSize={5000000}
        open={props.open}
        onAdd={newFileObjs => {
          setFileObjects([].concat(fileObjects, newFileObjs));
        }}
        onDelete={handleDelete}
        onClose={() => props.setOpen(false)}
        onSave={ async () => {
          await handleUpload();
          await handleDownload();
          props.setOpen(false);
        }}
        showPreviews={true}
        showFileNamesInPreview={true}
      />
      </div>
  );
}
