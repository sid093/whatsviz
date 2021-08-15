import React from "react";
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Whatsviz from "./components/Whatsviz";



export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/:id?" children={<Whatsviz />} />
      </Switch>
    </Router>
  );
}