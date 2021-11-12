import './LocalDishesParameter.scss'
import { useState } from 'react';
import Slider from '../Slider/Slider';
import Checkbox from '@material-ui/core/Checkbox';

import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';

import { useSelector, useDispatch } from 'react-redux';
import { getDishesInRadius, clearDishesInStoreRequest } from '../../store/userSlice';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function LocalDishesParameter () {

  const [radius, setRadius] = useState(1);
  const userDataClone = {...useSelector((state) => state.user.userData)};
  const dispatch = useDispatch();

  const initialPageNumber = 1;

  const handleRadiusSearch = async () => {
    // TODO: pop up window to choose paramters, e.g. alert
    if (!cookedOrdered.cooked && !cookedOrdered.ordered || !userDataClone.zipCode) {
      return;
    }
    try {
      dispatch(clearDishesInStoreRequest());
      setTimeout(() => {
        dispatch(getDishesInRadius({
          id: userDataClone._id,
          radius,
          cookedOrdered: JSON.stringify(cookedOrdered),
          pageNumber: initialPageNumber,
        }))
      }, 1750);

    } catch(e) {
      console.log(e);
    }
  }

  const upLoadButtonStyle = {maxWidth: '230px', maxHeight: '40px', minWidth: '230px', minHeight: '40px'};
  const [cookedOrdered, setCoockedOrdered] = useState({
    cooked: true,
    ordered: true
  });
  const handleCookedOrdered = async (event) => {
    const { name, checked } = event.target;
    setCoockedOrdered((prevValue) => ({
      ...prevValue,
      [name]: checked

    }));
  };

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
                id='local-dishes-parameter-cooked'
                onChange={handleCookedOrdered}
                label='Cooked'
                checked={cookedOrdered.cooked}
                name="cooked"
                color="primary"
                value={cookedOrdered.cooked}
              />
            }
          label="cooked"
        />
        </div>
        <div className="col">
        <FormControlLabel
          control={
            <Checkbox
              id='local-dishes-parameter-ordered'
              onChange={handleCookedOrdered}
              label='Ordered'
              checked={cookedOrdered.ordered}
              name='ordered'
              color="primary"
              value={cookedOrdered.ordered}
            />
          }
          label="ordered"
        />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Button
            id="dishes-in-radius-button"
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
