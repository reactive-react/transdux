import React, { Component, PropTypes } from 'react'
import TodoItem from './TodoItem'
import Footer from './Footer'
import {TxMixin} from 'transdux'
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
  complete(msg, state){
    return {
      todos:state.todos.map(todo=>{
        if(todo.id==msg.id)
          todo.completed = !todo.completed
        return todo
      })
    }
  },
  show(msg,state){
    switch(msg){
      case('SHOW_ALL'):
        return {filter: id}
      case('SHOW_ACTIVE'):
        return {filter: todos=>todos.filter(todo=>!todo.completed)}
      case('SHOW_COMPLETED'):
        return {filter: todos=>todos.filter(todo=>todo.completed)}

    }
  },
  clear(msg,state){
    return {
      todos: state.todos.filter(todo=>todo.completed==false)
    }
  },
  add(msg, state){
    let todos = state.todos
    todos.unshift({id:todos.length+1, text:msg, completed:false})
    return {
      todos: todos
    }
  },
  edit(msg, state){
    let todos = state.todos
    todos.map(todo=>{
      if(todo.id == msg.id){todo.text=msg.text}
      return todo;
    })
  },
  delete(msg, state){
    return {
      todos: state.todos.filter(todo=>todo.id != msg.id)
    }
  }
  
}

let MainSection = React.createClass({
  mixins: [TxMixin],
  getInitialState(){
    return {
      todos: todos,
      filter: id
    }
  },
  componentDidMount(){
    this.bindActions(actions)
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
    const activeCount = todos.length - completedCount;

    if (todos.length) {
      return (
        <Footer completedCount={completedCount} activeCount={activeCount} {...this.props}/>
      )
    }
  },

  render() {
    const { actions } = this.props
    const {todos} = this.state
    const completedCount = todos.reduce((count, todo) =>
      todo.completed ? count + 1 : count,
                                        0
    );

    const filteredTodos = this.state.filter(todos);
    return (
      <section className="main">
        {this.renderToggleAll(completedCount)}
        <ul className="todo-list">
          {filteredTodos.map(todo =>
            <TodoItem key={todo.id} todo={todo} {...this.props} />
          )}
        </ul>
        {this.renderFooter(completedCount)}
      </section>
    )
  },
});

export default MainSection
