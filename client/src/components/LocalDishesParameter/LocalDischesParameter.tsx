import "./LocalDishesParameter.scss";
import { useState } from "react";
import { InputSlider } from "../Slider";
import Checkbox from "@material-ui/core/Checkbox";

import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";

import { useSelector, useDispatch } from "react-redux";
import {
  getDishesInRadius,
  clearDishesInStoreRequest,
  getGeoLocation,
} from "../../store/userSlice";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import clientHelper from "../../helpers/clientHelper";

import { store } from "../../store/index";
import { IGeolocation } from "../Profile";
import React from "react";
import { selectUserData } from "../../store/selectors";

export const LocalDishesParameter = (): JSX.Element => {
  const [radius, setRadius] = useState(1);
  const userData = selectUserData();
  const userDataClone = { ...userData };
  const dispatch = useDispatch();

  const initialPageNumber = 1;

  // for geo point
  const success = async (pos: IGeolocation) => {
    var crd = pos.coords;
    const { latitude, longitude } = crd;

    const geoLocationPolygon = clientHelper.calculatePolygon(
      { latitude, longitude },
      radius
    );
    dispatch(getGeoLocation(geoLocationPolygon));
  };
  // for geo point

  const handleRadiusSearch = async () => {
    if ((!filter.cooked && !filter.ordered) || !userDataClone.city) {
      return;
    }
    clientHelper.getGeoLocation(success);
    try {
      dispatch(clearDishesInStoreRequest());
      setTimeout(() => {
        const geoLocationPolygon =
          store.getState().user.searchData.geoLocationPolygon;
        dispatch(
          getDishesInRadius({
            id: userDataClone._id,
            radius,
            filter: JSON.stringify(filter),
            pageNumber: initialPageNumber,
            geoLocationPolygon: JSON.stringify(geoLocationPolygon),
          })
        );
      }, 1750);
    } catch (e) {
      console.log(e);
    }
  };

  const upLoadButtonStyle = {
    maxWidth: "230px",
    maxHeight: "40px",
    minWidth: "230px",
    minHeight: "40px",
  };
  const [filter, setFilter] = useState({
    cooked: true,
    ordered: true,
    own: true,
  });
  const handleFilter = async (event: any) => {
    const { name, checked } = event.target;
    setFilter((prevValue) => ({
      ...prevValue,
      [name]: checked,
    }));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <InputSlider onSearch={setRadius} />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <FormControlLabel
            control={
              <Checkbox
                id="local-dishes-parameter-cooked"
                onChange={handleFilter}
                //label='Cooked'
                checked={filter.cooked}
                name="cooked"
                color="primary"
                value={filter.cooked}
              />
            }
            label="cooked"
          />
        </div>
        <div className="col">
          <FormControlLabel
            control={
              <Checkbox
                id="local-dishes-parameter-ordered"
                onChange={handleFilter}
                //label='Ordered'
                checked={filter.ordered}
                name="ordered"
                color="primary"
                value={filter.ordered}
              />
            }
            label="ordered"
          />
        </div>
        <div className="col">
          <FormControlLabel
            control={
              <Checkbox
                id="local-dishes-parameter-own"
                onChange={handleFilter}
                //label='Own'
                checked={filter.own}
                name="own"
                color="primary"
                value={filter.own}
              />
            }
            label="own"
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
};
