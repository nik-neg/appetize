import IconButton from "@material-ui/core/IconButton";
import { DropzoneDialogBase, FileObject } from "material-ui-dropzone";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../store";
import { selectUserData } from "../../store/selectors";
import {
  clearDishTextRequest,
  uploadImageBeforePublish,
} from "../../store/userSlice";
import { IDropZoneProps } from "./types";

export const DropZone = (props: IDropZoneProps) => {
  const [fileObjects, setFileObjects] = useState<FileObject[]>([]);
  const dialogTitle = () => (
    <>
      <span>Upload file</span>
      <IconButton
        style={{ right: "12px", top: "8px", position: "absolute" }}
        onClick={() => props.setOpen(false)}
      ></IconButton>
    </>
  );

  const uploadImageBeforePublishCallback = useCallback(async (data) => {
    dispatch(uploadImageBeforePublish(data));
  }, []);

  const dispatch = useDispatch();
  const userData = { ...useAppSelector(selectUserData) };
  const baseUrl = "http://localhost:3001";
  let imageURL = `${baseUrl}/profile/${userData._id}/download?created=`;

  const handleUpload = async () => {
    dispatch(clearDishTextRequest());
    props.setImagePath("");
    let chosenImageDate: string | number = new Date().getTime();
    chosenImageDate = props.avatar
      ? `${chosenImageDate}_avatar`
      : chosenImageDate;
    imageURL += chosenImageDate;

    // await asyncWrapper(dispatch, uploadImageBeforePublish, {
    //   userId: userData._id,
    //   file: fileObjects["0"],
    //   chosenImageDate,
    //   imageURL: props.avatar ? imageURL : undefined,
    // });
    await uploadImageBeforePublishCallback({
      userId: userData._id,
      file: fileObjects["0"],
      chosenImageDate,
      imageURL: props.avatar ? imageURL : undefined,
    });

    props.setImagePath(imageURL);
  };

  const handleDelete = (deleted: FileObject) => {
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
