/* eslint-disable no-undef */
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Collapse from "@material-ui/core/Collapse";
import { red } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FavoriteIcon from "@material-ui/icons/Favorite";
import StarsIcon from "@material-ui/icons/Stars";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import clsx from "clsx";
import moment from "moment";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { history } from "../../history";
import { selectDishes } from "../../store/selectors";
import {
  allDishesDeletedRequest,
  deleteDish,
  upDownVote,
} from "../../store/userSlice";
import { SCardMediaWrapper } from "./Card.styles";
import { IRecipeReviewCardProps } from "./types";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  ownImageColor: {
    color: red[500],
    // backgroundColor: '#3c52b2',
    //   color: red[500],
    //   '&:hover': {
    //     backgroundColor: '#fff',
    //     color: '#3c52b2',
    // },
  },
}));

// https://blog.logrocket.com/12-essential-eslint-rules-react/

export const RecipeReviewCard = (props: IRecipeReviewCardProps) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const [likeColor, setLikeColor] = useState(
    props.userID === props.dishUserID || props.voted
  );

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleLike = async () => {
    if (props.userID === props.dishUserID) return;
    setLikeColor(!likeColor);
    let vote = "";
    if (!props.voted) {
      vote = "up";
    } else {
      vote = "down";
    }
    try {
      dispatch(
        upDownVote({ voteID: props.userID, dishID: props.dishID, vote })
      );
    } catch (e) {
      console.log(e);
    }
  };

  const likeColorStatement =
    props.userID === props.dishUserID || props.voted ? "#ff0000" : "inherit";

  const [mouseIsNotOver, setMouseIsNotOver] = useState(true);
  const handleOnMouse = async () => {
    setMouseIsNotOver(!mouseIsNotOver);
  };

  // const asyncWrapper = async (dispatch, asyncFunc, data) => {
  //   await dispatch(asyncFunc(data));
  // }

  const deleteDishCallback = useCallback(async () => {
    dispatch(deleteDish({ userId: props.userID, dishId: props.dishID }));
  }, []);

  const dispatch = useDispatch();

  const selectedDishes = selectDishes();

  const handleDelete = async () => {
    try {
      // await asyncWrapper(dispatch, deleteDish, { userId: props.userID, dishId: props.dishID });
      await deleteDishCallback();

      const dishes = [...selectedDishes];
      if (dishes.length === 0) {
        dispatch(allDishesDeletedRequest());
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleDishClick = async () => {
    history.push(`/details/${props.dishID}`);
  };

  const handleShareDish = async () => {
    navigator.clipboard.writeText(
      `${process.env.DETAILS_SHARED_MICROFRONTEND_URL}/details-shared/${props.dishID}`
    );
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar
            aria-label="recipe"
            className={classes.avatar}
            id={`dish-votes-${props.index}`}
          >
            {props.votes}
          </Avatar>
        }
        id={`dish-title-${props.index}`}
        title={props.title}
        subheader={moment(+props.created).format("MMMM Do, YYYY")}
        style={{ textAlign: "left" }}
      />
      <SCardMediaWrapper
        id={`dish-image-${props.index}`}
        className={`${classes.media}`}
        image={props.imageUrl}
        title={props.title}
        onClick={handleDishClick}
      />
      <CardContent id={`dish-description-${props.index}`}>
        <Typography variant="body2" color="textSecondary" component="p">
          {props.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="add to favorites"
          className="like"
          style={{ color: likeColorStatement }}
          onClick={handleLike}
        >
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share" onClick={handleShareDish}>
          <ContentCopyIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          id={`dish-expand-${props.index}`}
        >
          <ExpandMoreIcon />
        </IconButton>

        {props.userID === props.dishUserID ? (
          <IconButton
            className="delete-button"
            onMouseEnter={handleOnMouse}
            onMouseLeave={handleOnMouse}
            onClick={handleDelete}
          >
            {mouseIsNotOver ? (
              <StarsIcon className={classes.ownImageColor} id="star-icon" />
            ) : (
              <DeleteIcon id="delete-icon" />
            )}
          </IconButton>
        ) : (
          ""
        )}
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            {props.creatorName + " from " + props.city + ":"}
          </Typography>
          <Typography paragraph>{props.recipe}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};
