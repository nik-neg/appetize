import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
// import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import MoreVertIcon from '@material-ui/icons/MoreVert';

import Grid from '@material-ui/core/Grid';

// import NavigateNextIcon from '@material-ui/icons/NavigateNext';

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
}));

export default function RecipeReviewCard(props) {
  const classes = useStyles();


  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>

      </Grid>
      <Grid item xs={6}>

      </Grid>
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        title="Shrimp and Chorizo Paella"
        subheader="September 14, 2016"
      />

      <CardMedia
        className={classes.media}
        image={`http://localhost:3001/profile/${props.id}/download`}
        title="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          This impressive paella is a perfect party dish and a fun meal to cook together with your
          guests. Add 1 cup of frozen peas along with the mussels, if you like.
        </Typography>
      </CardContent>



      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>


      </Card>

        <Card className={classes.root} >
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            Description
          </Typography>
          <Typography variant="body2" component="p" align="left">
           This impressive paella is a perfect party dish and a fun meal to cook together with your
           guests. Add 1 cup of frozen peas along with the mussels, if you like.
          </Typography>

          <Typography className={classes.pos} color="textSecondary">
            Recipe
          </Typography>
          <Typography variant="body2" component="p" align="left">
           This impressive paella is a perfect party dish and a fun meal to cook together with your
           guests. Add 1 cup of frozen peas along with the mussels, if you like.
          </Typography>
        </CardContent>
      </Card>

    </Grid>
  );
}
