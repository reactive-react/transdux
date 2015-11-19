import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import TodoTextInput from './TodoTextInput'
import {hash, async, map, updateIn, extra, toJs} from 'con.js'
const {put,sub,take,chan} = async
import MainSection from './MainSection'
import Transdux from '../../lib/transdux'
let TodoItem = React.createClass({
  mixins: [Transdux],
  getInitialState(){
    return {
      editing: false,
    }
  },

  handleDoubleClick() {
    this.setState({ editing: true })
  },

  handleSave(id, text) {
    if (text.length === 0) {
      this.props.deleteTodo(id)
    } else {
      this.props.editTodo(id, text)
    }
    this.setState({ editing: false })
  },

  render() {
    const { chan, todo } = this.props

    let element
    if (this.state.editing) {
      element = (
        <TodoTextInput text={todo.text}
                       editing={this.state.editing}
                       onSave={(text) => this.handleSave(todo.id, text)} />
      )
    } else {
      element = (
        <div className="view">
          <input className="toggle"
                 type="checkbox"
                 checked={todo.completed}
                 onChange={() => this.dispatch(MainSection, 'complete',{id:todo.id})} />
          <label onDoubleClick={this.handleDoubleClick}>
            {todo.text}
          </label>
          <button className="destroy"
                  onClick={() => deleteTodo(todo.id)} />
        </div>
      )
    }

    return (
      <li className={classnames({
        completed: todo.completed,
        editing: this.state.editing
      })}>
        {element}
      </li>
    )
  },
});

export default TodoItem
