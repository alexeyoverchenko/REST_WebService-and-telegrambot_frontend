import React from "react";
import './App.css';
import City from "./pages/City";
import {BrowserRouter, Route} from "react-router-dom";

const App = () => {
  return (
      <BrowserRouter>
        <Route path='/resliv/city' component={City}/>
      </BrowserRouter>
  );
}

export default App;
