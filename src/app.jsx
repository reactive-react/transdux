import React, { Component, PropTypes } from 'react';
import Header from './components/Header'
import MainSection from './components/MainSection'
import {render} from 'react-dom';

const todos = [{
  text: 'Use Redux',
  completed: false,
  id: 0
}];

class App extends Component {
  render(){
    return (
      <div>
          <Header/>
          <MainSection todos={todos} />
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'));
