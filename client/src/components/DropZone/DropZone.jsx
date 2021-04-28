import React, { useState } from "react"; //useEffect
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

  const handleUpload = async () => {
    // console.log("HANDLE SAVE")
    await ApiClient.uploadImage(props.id, fileObjects['0']);
    // console.log(uploadReponse)
  }

  const handleDownload = async () => {
    // console.log("DOWNLOAD IMAGE")
    const downloadResponse = await ApiClient.displayImage(props.id);
    // console.log("DOWNLOAD RESPONSE")
    // console.log(downloadResponse)
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
          // console.log('onSave', fileObjects);
          await handleUpload();
          handleDownload();
          props.setOpen(false);
        }}
        showPreviews={true}
        showFileNamesInPreview={true}
      />
      </div>
  );
}
