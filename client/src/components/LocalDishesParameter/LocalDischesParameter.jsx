import React from 'react';
import './index.css'
// import { makeStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
// import Grid from '@material-ui/core/Grid';

import { useState } from 'react';
// import { TextField } from '@material-ui/core';
import Slider from '../Slider/Slider';
import CheckBox from '../CheckBox/CheckBox';

import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';

import ApiClient from '../../services/ApiClient';
// import Grid from '@material-ui/core/Grid';


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

export default function LocalDishesDashboard (props) {
  // const classes = useStyles();


  const [radius, setRadius] = useState(2);

  const handleRadiusSearch = async () => {
    console.log("API CLIENT - HANDLE RADIUS SEARCH")
    let APIResponse;
    try {
      APIResponse = await ApiClient.getDishesInRadius(props.id, radius);
      APIResponse.sort((a,b) =>  b.votes - a.votes);
      console.log(APIResponse)
      props.onRadiusSearch(APIResponse)
    } catch(e) {
      console.log(e);
    }// votes needed in votes of card
    // console.log(dishesInRadiusResponse)
    // await props.onRadiusSearch(APIResponse) //.sort((a,b) =>  b.votes - a.votes)
  }


  // const styles = {
  //   someTextField: {
  //     minHeight: 420,
  //     minWidth: 800,
  //     paddingTop: "10%"
  //   }
  // };
  const upLoadButtonStyle = {maxWidth: '230px', maxHeight: '40px', minWidth: '230px', minHeight: '40px'};

  return (
    // <Grid container spacing={1}>
    //   <Grid container item xs={12} spacing={3}>
    //     <Slider onSearch={setRadius}/>
    //   </Grid>
    //   <Grid container item xs={12} spacing={3}>
    //     <CheckBox />
    //   </Grid>
    //   <Grid container item xs={12} spacing={3}>
    //    <Button
    //       variant="contained"
    //       color="primary"
    //       startIcon={<SearchIcon />}
    //       style={upLoadButtonStyle}
    //       onClick={handleRadiusSearch}
    //       >
    //       Find nice dishes 😋
    //     </Button>
    //   </Grid>
    // </Grid>
    <div className='dashboard-header'>
      <div className='dashboard-header-column'>

      </div>
      <div className='dashboard-header-column'>
        <div className='center-element'>
          <Slider onSearch={setRadius}/>
        </div>
        <div className='center-element'>
          <CheckBox />
        </div>
        <div className='center-element'>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          style={upLoadButtonStyle}
          onClick={handleRadiusSearch}
          >
          Find nice dishes 😋
        </Button>
        </div>
      </div>
      <div className='dashboard-header-column'>
      </div>
    </div>
  );
}
