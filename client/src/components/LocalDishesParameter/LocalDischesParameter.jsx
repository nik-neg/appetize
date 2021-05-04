import React from 'react';
import './index.css'
import { useState } from 'react';
import Slider from '../Slider/Slider';
import CheckBox from '../CheckBox/CheckBox';

import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';

import ApiClient from '../../services/ApiClient';

export default function LocalDishesParameter (props) {

  const [radius, setRadius] = useState(2);

  const handleRadiusSearch = async () => {
    // console.log("API CLIENT - HANDLE RADIUS SEARCH")
    let APIResponse;
    try {
      APIResponse = await ApiClient.getDishesInRadius(props.id, radius);
      APIResponse.sort((a,b) =>  b.votes - a.votes);
      // console.log(APIResponse)
      props.onRadiusSearch(APIResponse)
    } catch(e) {
      console.log(e);
    }
  }

  const upLoadButtonStyle = {maxWidth: '230px', maxHeight: '40px', minWidth: '230px', minHeight: '40px'};

  return (
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
