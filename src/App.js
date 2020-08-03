import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "./components/header/Header";
import Question from "./components/question/Question";
import Study from "./components/study/Study";

function App() {
  return (
    <BrowserRouter basename={"/flags"}>
      <div className="layout">
        <div className="layout-center">
          <div className="layout-top">
            <Header />
          </div>
          <div className="layout-bottom">
            <Switch>
              <Route exact path="/" component={Question} />
              <Route path="/study" component={Study} />
            </Switch>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
