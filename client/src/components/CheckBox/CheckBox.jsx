import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default function CheckboxLabels(props) {
  const [state, setState] = React.useState({
    checked: false,
    name: props.label
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <FormGroup row={true} >
      <FormControlLabel
        control={
          <Checkbox
            checked={state.name}
            onChange={handleChange}
            name="name"
            color="primary"
          />
        }
        label={props.label}
      />
    </FormGroup>
  );
}
