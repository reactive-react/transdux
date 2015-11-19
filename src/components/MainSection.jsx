import React, { Component, PropTypes } from 'react'
import TodoItem from './TodoItem'
import Footer from './Footer'
import {async, map, updateIn, extra, toJs} from 'con.js'
const {put,sub,take,chan} = async

// import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters'

const TODO_FILTERS = {
  // [SHOW_ALL]: () => true,
  // [SHOW_ACTIVE]: todo => !todo.completed,
  // [SHOW_COMPLETED]: todo => todo.completed
}
const todos = [{
  text: 'Dont Use Redux',
  completed: false,
  id: 0
},{
  text: 'Use transdux',
  completed: false,
  id: 1
}];

let MainSection = React.createClass({
  getInitialState(){
    return {
      todos: todos
    }
  },
  componentDidMount(){
    // -------vv code user should write vv------------------
    function complete(msg, data){
      return map(todo=>{
        if(todo.get('id')==msg.id)
          return updateIn(todo, ['completed'], _=>!_ )
          return todo
      }, data.get('todos'))
    }
    // ---------------------------------

    // ---------- code should extract to transdux -------------------
    let tx = map((msg)=>{
      return toJs(complete(msg, extra.toClj(this.state)))
    });

    let completeChan = chan(1, tx);
    
    sub(this.props.pub, "Todo.complete", completeChan);
    
    function takeloop(chan, action){
      take(chan).then(action).then(takeloop.bind(null, chan,action))
    }
    takeloop(completeChan, (newtodos)=>{
      this.setState({todos: newtodos})
    })
    // ----------
  },

  handleClearCompleted() {
    const atLeastOneCompleted = this.state.todos.some(todo => todo.completed)
    if (atLeastOneCompleted) {
    }
  },

  handleShow(filter) {
    this.setState({ filter })
  },

  renderToggleAll(completedCount) {
    const { todos } = this.state
    if (todos.length > 0) {
      return (
        <input className="toggle-all"
               type="checkbox"
               checked={completedCount === todos.length}
               />
      )
    }
  },

  renderFooter(completedCount) {
    const { todos } = this.state

    if (todos.length) {
      return (
        <Footer completedCount={completedCount}
                onClearCompleted={this.handleClearCompleted.bind(this)}
                onShow={this.handleShow.bind(this)} />
      )
    }
  },

  render() {
    const { actions } = this.props
    const {todos} = this.state

    const filteredTodos = todos
    const completedCount = todos.reduce((count, todo) =>
      todo.completed ? count + 1 : count,
      0
    )
    return (
      <section className="main">
        {this.renderToggleAll(0)}
        <ul className="todo-list">
          {filteredTodos.map(todo =>
            <TodoItem key={todo.id} todo={todo} {...this.props} />
          )}
        </ul>
        {this.renderFooter(0)}
      </section>
    )
  },
});

export default MainSection
