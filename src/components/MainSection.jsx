import React, { Component, PropTypes } from 'react'
import TodoItem from './TodoItem'
import Footer from './Footer'
import {async, filter, map, updateIn, extra, toJs} from 'con.js'
const {put,sub,take,chan} = async
import Transdux from '../../lib/transdux'

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
const id = _=>_;
let actions = {
  complete(msg, data){
    return {
      todos:data.todos.map(todo=>{
        if(todo.id==msg.id)
          todo.completed = !todo.completed
        return todo
      })
    }
  },
  show(msg,data){
    switch(msg){
      case('SHOW_ALL'):
        return {filter: id}
      case('SHOW_ACTIVE'):
        return {filter: todos=>todos.filter(todo=>!todo.completed)}
      case('SHOW_COMPLETED'):
        return {filter: todos=>todos.filter(todo=>todo.completed)}

    }
  }
}

let MainSection = React.createClass({
  mixins: [Transdux],
  getInitialState(){
    return {
      todos: todos,
      filter: id
    }
  },
  componentDidMount(){
    this.bindActions(actions, MainSection)
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
        <Footer completedCount={completedCount} {...this.props}/>
      )
    }
  },

  render() {
    const { actions } = this.props
    const {todos} = this.state

    const filteredTodos = this.state.filter(todos);
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
