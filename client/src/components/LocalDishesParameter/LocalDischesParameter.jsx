import React from 'react';
import './index.css'
import { useState } from 'react';
import Slider from '../Slider/Slider';
import CheckBox from '../CheckBox/CheckBox';

import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';

import { useSelector, useDispatch } from 'react-redux';
import { getDishesInRadius } from '../../store/userSlice';


export default function LocalDishesParameter (props) {

  const [radius, setRadius] = useState(2);
  const userDataClone = {...useSelector((state) => state.user.userData)};
  const dispatch = useDispatch();

  const asyncWrapper = async (dispatch, asyncFunc, data) => {
    return await dispatch(asyncFunc(data));
  }

  const handleRadiusSearch = async () => {
    try {
      await asyncWrapper(dispatch, getDishesInRadius, { id: userDataClone._id, radius });
      props.onRadiusSearch()
    } catch(e) {
      console.log(e);
    }
  }

  const upLoadButtonStyle = {maxWidth: '230px', maxHeight: '40px', minWidth: '230px', minHeight: '40px'};

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <Slider onSearch={setRadius}/>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <CheckBox label='Cooked'/>
        </div>
        <div className="col">
          <CheckBox label='Ordered'/>
        </div>
      </div>
      <div className="row">
        <div className="col">
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
    </div>

    // <div className='dashboard-header'>
    //   <div className='dashboard-header-column'>

    //   </div>
    //   <div className='dashboard-header-column'>
    //     <div className='center-element'>
    //       <Slider onSearch={setRadius}/>
    //     </div>
    //     <div className='center-element'>
    //       <CheckBox label='Cooked'/>
    //     </div>
    //     <div className='center-element'>
    //       <CheckBox label='Ordered'/>
    //     </div>
    //     <div className='center-element'>
    //     <Button
    //       variant="contained"
    //       color="primary"
    //       startIcon={<SearchIcon />}
    //       style={upLoadButtonStyle}
    //       onClick={handleRadiusSearch}
    //       >
    //       Find nice dishes 😋
    //     </Button>
    //     </div>
    //   </div>
    //   <div className='dashboard-header-column'>
    //   </div>
    // </div>
  );
}
