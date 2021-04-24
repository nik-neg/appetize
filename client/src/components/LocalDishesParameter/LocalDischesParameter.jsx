import React from 'react';
import './index.css'
// import { makeStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
// import Grid from '@material-ui/core/Grid';

import { useState } from 'react';
import { TextField } from '@material-ui/core';
import Slider from '../Slider/Slider';
import CheckBox from '../CheckBox/CheckBox';

import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';

import ApiClient from '../../services/ApiClient';


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
  const CHARACTER_LIMIT_TITLE = 10;
  const [zipCode, setZipCode] = useState('');

  const handleChange = (event) => {
    setZipCode(event.target.value);
    console.log(zipCode)
  }

  const [radius, setRadius] = useState(2);

  const handleRadiusSearch = async () => {
    console.log("API CLIENT - HANDLE RADIUS SEARCH")
    const APIResponse = await ApiClient.getDishesInRadius(props.id, radius);
    console.log(APIResponse)
    // console.log(dishesInRadiusResponse)
    props.onRadiusSearch(APIResponse)
  }


  const styles = {
    someTextField: {
      minHeight: 420,
      minWidth: 800,
      paddingTop: "10%"
    }
  };
  const upLoadButtonStyle = {maxWidth: '230px', maxHeight: '40px', minWidth: '230px', minHeight: '40px'};

  return (
    <div className='dashboard-header'>
      <div className='dashboard-header-column'>

      </div>
      <div className='dashboard-header-column'>
      <TextField
        id="standard-basic"
        label="ZIP CODE"
        inputProps={{
          maxlength: CHARACTER_LIMIT_TITLE
        }}
        value={zipCode}
        helperText={`${zipCode.length}/${CHARACTER_LIMIT_TITLE}`}
        style={{"margin-top": "2.5%", "max-width": "6rem"}}
        variant="filled"
        onChange={handleChange}
        InputProps={{ classes: { input: styles.someTextField } }}
        />
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
