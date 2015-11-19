jest.dontMock('../TodoItem');
import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import classnames from 'classnames'
import {hash, async, map, updateIn, extra, toJs} from 'con.js'

import TodoTextInput from '../TodoTextInput'
import MainSection from '../MainSection'
import Transdux from '../../../lib/transdux'

let {default: TodoItem} = require('../TodoItem');
describe('TodoItem', () => {
    it('changes the text after click', () => {
        var todo = {
            text: 'Dont Use Redux',
            completed: false,
            id: 0
        };
        var todoItem = TestUtils.renderIntoDocument(
            <TodoItem todo={todo} />
        );
        TestUtils.Simulate.change(
            TestUtils.findRenderedDOMComponentWithTag(todoItem, 'input')
        );
        expect(Transdux.dispatch).toBeCalledWith(MainSection, 'complete', {id:todo.id});
    });

});

