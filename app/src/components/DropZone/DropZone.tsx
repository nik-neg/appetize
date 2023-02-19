import IconButton from "@material-ui/core/IconButton";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearDishTextRequest,
  uploadImageBeforePublish,
} from "../../store/userSlice";
import { IDropZoneProps } from "./types";

export const DropZone = (props: IDropZoneProps) => {
  const [fileObjects, setFileObjects] = useState([]);
  const dialogTitle = () => (
    <>
      <span>Upload file</span>
      <IconButton
        style={{ right: "12px", top: "8px", position: "absolute" }}
        onClick={() => props.setOpen(false)}
      ></IconButton>
    </>
  );

  const asyncWrapper = async (dispatch, asyncFunc, data) => {
    await dispatch(asyncFunc(data));
  };

  const dispatch = useDispatch();
  const userData = { ...useSelector((state) => state.user.userData) };
  const baseUrl = "http://localhost:3001";
  let imageURL = `${baseUrl}/profile/${userData._id}/download?created=`;

  const handleUpload = async () => {
    dispatch(clearDishTextRequest());
    props.setImagePath("");
    let chosenImageDate = new Date().getTime();
    chosenImageDate = props.avatar
      ? `${chosenImageDate}_avatar`
      : chosenImageDate;
    imageURL += chosenImageDate;
    await asyncWrapper(dispatch, uploadImageBeforePublish, {
      userId: userData._id,
      file: fileObjects["0"],
      chosenImageDate,
      imageURL: props.avatar ? imageURL : undefined,
    });
    props.setImagePath(imageURL);
  };

  const handleDelete = (deleted) => {
    setFileObjects(fileObjects.filter((f) => f !== deleted));
  };

  return (
    <div>
      <DropzoneDialogBase
        dialogTitle={dialogTitle()}
        acceptedFiles={["image/*"]}
        fileObjects={fileObjects}
        cancelButtonText={"cancel"}
        submitButtonText={"submit"}
        maxFileSize={5000000}
        filesLimit={1}
        open={props.open}
        onAdd={(newFileObjs) => {
          setFileObjects(newFileObjs);
        }}
        onDelete={handleDelete}
        onClose={() => props.setOpen(false)}
        onSave={async () => {
          await handleUpload();
          props.setOpen(false);
        }}
        showPreviews={true}
        showFileNamesInPreview={true}
      />
    </div>
  );
};
