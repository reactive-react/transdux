import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import {TxMixin} from 'transdux'
import MainSection from './MainSection'
import TodoItem from './TodoItem'
let TodoTextInput = React.createClass({
  mixins: [TxMixin],
  getInitialState(){
    return {
      text: this.props.text || ''
    }
  },

  handleSubmit(e) {
    const text = e.target.value.trim()
    if (e.which === 13) {
      this.dispatch(MainSection, 'add', text)
      if (this.props.newTodo) {
        this.setState({ text: '' })
      }
    }
  },

  handleChange(e) {
    this.setState({ text: e.target.value })
  },

  handleBlur(e) {
    if (!this.props.newTodo) {
      this.dispatch(TodoItem, 'completeEdit', '')
      this.dispatch(MainSection, 'edit', {id:this.props.itemid,text:e.target.value})
    }
  },

  render() {
    return (
      <input className={
        classnames({
          edit: this.props.editing,
          'new-todo': this.props.newTodo
        })}
        type="text"
        placeholder={this.props.placeholder}
        autoFocus="true"
        value={this.state.text}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleSubmit} />
    )
  },
});

export default TodoTextInput
