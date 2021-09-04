import React from 'react';
import './index.css'
import { useState } from 'react';
import Slider from '../Slider/Slider';
// import CheckBox from '../CheckBox/CheckBox';
import Checkbox from '@material-ui/core/Checkbox';

import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';

import { useSelector, useDispatch } from 'react-redux';
import { getDishesInRadius } from '../../store/userSlice';
import FormControlLabel from '@material-ui/core/FormControlLabel';


export default function LocalDishesParameter (props) {

  const [radius, setRadius] = useState(2);
  const userDataClone = {...useSelector((state) => state.user.userData)};
  const dispatch = useDispatch();

  const asyncWrapper = async (dispatch, asyncFunc, data) => {
    return await dispatch(asyncFunc(data));
  }

  const handleRadiusSearch = async () => {
    if (!cookedOrdered.cooked && !cookedOrdered.ordered) { //TODO: pop up window to choose paramters, e.g. alert
      return;
    }
    try {
      await asyncWrapper(
        dispatch, getDishesInRadius, { id: userDataClone._id, radius,  cookedOrdered: JSON.stringify(cookedOrdered)}
        );
      props.onRadiusSearch()
    } catch(e) {
      console.log(e);
    }
  }

  const upLoadButtonStyle = {maxWidth: '230px', maxHeight: '40px', minWidth: '230px', minHeight: '40px'};
  const [cookedOrdered, setCoockedOrdered] = useState({
    cooked: true,
    ordered: true
  })
  const handleCookedOrdered = async (event) => {
    const { name, checked } = event.target;
    setCoockedOrdered((prevValue) => ({
      ...prevValue,
      [name]: checked

    }))
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <Slider onSearch={setRadius}/>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleCookedOrdered}
                label='Cooked'
                checked={cookedOrdered.cooked}
                name="cooked"
                color="primary"
              />
            }
          label="cooked"
        />
        </div>
        <div className="col">
        <FormControlLabel
          control={
            <Checkbox
              onChange={handleCookedOrdered}
              label='Ordered'
              checked={cookedOrdered.ordered}
              name='ordered'
              color="primary"
            />
          }
          label="ordered"
        />
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
  );
}
