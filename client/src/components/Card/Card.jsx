import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StarsIcon from '@material-ui/icons/Stars';
import DeleteIcon from '@material-ui/icons/Delete';

import moment from 'moment';

import { useState } from 'react';

import './index.scss';

import { useDispatch } from 'react-redux';
import { deleteDish, upDownVote, allDishesDeletedRequest} from '../../store/userSlice';
import { store } from '../../store/index';


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  ownImageColor: {
    color: red[500]
    // backgroundColor: '#3c52b2',
  //   color: red[500],
  //   '&:hover': {
  //     backgroundColor: '#fff',
  //     color: '#3c52b2',
  // },
  },
}));

export default function RecipeReviewCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const [likeColor, setLikeColor] = useState(((props.userID === props.dishUserID) || props.voted));

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleLike = async () => {
    if (props.userID === props.dishUserID) return;
    setLikeColor(!likeColor);
    let vote = ''
    if(!props.voted) {
      vote = 'up'
    } else {
      vote = 'down';
    }
    try {
      dispatch(upDownVote({ voteID: props.userID, dishID: props.dishID, vote }));
    } catch(e) {
      console.log(e)
    }
  }

  const likeColorStatement = ((props.userID === props.dishUserID) || props.voted ) ? "#ff0000": 'inherit';

  const [mouseIsNotOver, setMouseIsNotOver] = useState(true);
  const handleOnMouse = async () => {
    setMouseIsNotOver(!mouseIsNotOver)
  }

  const asyncWrapper = async (dispatch, asyncFunc, data) => {
    await dispatch(asyncFunc(data));
  }

  const dispatch = useDispatch();

  const handleDelete = async () => { // https://mui.com/components/dialogs/
    try {
      await asyncWrapper(dispatch, deleteDish, { userId: props.userID, dishId: props.dishID });
      const dishes = [...store.getState().user.dishesInRadius];
      if (dishes.length === 0) {
        dispatch(allDishesDeletedRequest());
      }
    } catch(e) {
      console.log(e)
    }
  }

  return (
    <Card className={classes.root} >
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar} id={`dish-votes-${props.index}`}>
            {props.votes}
          </Avatar>
        }
        title={props.title}
        subheader={moment(+props.created).format("MMMM Do, YYYY")}
        style={{'textAlign': 'left'}}
      />
      <CardMedia
        className={classes.media}
        image={props.imageUrl}
        title={props.title}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {props.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites"  className="like" style={{ color: likeColorStatement}} onClick={handleLike}>
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>

        { props.userID === props.dishUserID
        ?
        <IconButton
          className="delete-button"
          onMouseEnter={handleOnMouse}
          onMouseLeave={handleOnMouse}
          onClick={handleDelete}
        >
        { mouseIsNotOver
          ? <StarsIcon className={classes.ownImageColor} id="star-icon"/>
          : <DeleteIcon id="delete-icon"/>
        }
        </IconButton>
        : ''}
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>{props.creatorName+' from '+props.city+':'}</Typography>
          <Typography paragraph>
            {props.recipe}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
