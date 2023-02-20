import { Route, Router, Switch } from "react-router-dom";
import { Details } from "./components/Details/Details";
import { Profile } from "./components/Profile/Profile";
import { RegisterLogin } from "./components/RegisterLogin/RegisterLogin";

import { SAppWrapper } from "./App.styles";
import { history } from "./history";

// https://www.sitepoint.com/how-to-migrate-a-react-app-to-typescript/

export const App = (): JSX.Element => {
  return (
    <SAppWrapper>
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={RegisterLogin} />
          <Route path="/profile" component={Profile} />
          <Route path="/details/:dishId" component={Details} />
        </Switch>
      </Router>
    </SAppWrapper>
  );
};

export default App;
