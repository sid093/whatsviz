import React from "react";
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from "./components/screens/Home";
import HelloWorld from "./components/helloworld/HelloWorld";
import Whatsviz from "./components/whatsviz/Whatsviz";
import { appsList } from "./config";


export default function App() {
  return (
    <Router>
      <Switch>
        <Route path={appsList.route("Hello World")} children={<HelloWorld />} />
        <Route path={appsList.route("Whatsviz")} children={<Whatsviz />} />
        <Route path="/" children={<Home />} />
      </Switch>
    </Router>
  );
}