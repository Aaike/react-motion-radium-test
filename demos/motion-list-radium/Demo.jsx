import React, { Component } from 'react';
import Radium, {Style} from 'radium';
import {Item} from './Item';
import {TransitionMotion, spring, presets} from 'react-motion';
import _ from 'lodash';

export default class Demo extends Component {

  constructor(props) {
    super(props);

    this.state = {
      todos: {
        // key is creation date
        't1': {text: 'Board the plane', isDone: false},
        't2': {text: 'Sleep', isDone: false},
        't3': {text: 'Try to finish conference slides', isDone: false},
        't4': {text: 'Eat cheese and drink wine', isDone: false},
        't5': {text: 'Go around in Uber', isDone: false},
        't6': {text: 'Talk with conf attendees', isDone: false},
        't7': {text: 'Show Demo 1', isDone: false},
        't8': {text: 'Show Demo 2', isDone: false},
        't9': {text: 'Lament about the state of animation', isDone: false},
        't10': {text: 'Show Secret Demo', isDone: false},
        't11': {text: 'Go home', isDone: false},
        't12': {text: 'Go home', isDone: false},
        't13': {text: 'Go home', isDone: false},
        't14': {text: 'Go home', isDone: false},
        't15': {text: 'Go home', isDone: false},
        't16': {text: 'Go home', isDone: false},
        't17': {text: 'Go home', isDone: false},
        't18': {text: 'Go home', isDone: false},
        't19': {text: 'Go home', isDone: false},
        't20': {text: 'Go home', isDone: false}
      },
      value: '',
      selected: 'all',
    };
  }

  // logic from todo, unrelated to animation
  handleChange({target: {value}}) {
    this.setState({value});
  }

  handleSubmit(e) {
    e.preventDefault();
    const {todos, value} = this.state;
    this.setState({
      todos: {
        ['t' + Date.now()]: {text: value, isDone: false},
        ...todos,
      },
    });
  }

  handleDone(key) {
    const {todos} = this.state;
    todos[key].isDone = !todos[key].isDone;
    this.forceUpdate();
  }

  handleToggleAll() {
    const {todos} = this.state;
    const keys = Object.keys(todos);
    const allDone = keys.every(date => todos[date].isDone);
    keys.forEach(date => todos[date].isDone = !allDone);
    this.forceUpdate();
  }

  handleSelect(selected) {
    this.setState({selected});
  }

  handleClearCompleted() {
    const {todos} = this.state;
    const newTodos = {};
    for (const prop in todos) {
      if (!todos[prop].isDone) {
        newTodos[prop] = todos[prop];
      }
    }
    this.setState({todos: newTodos});
  }

  handleDestroy(date) {
    const {todos} = this.state;
    delete todos[date];
    this.forceUpdate();
  }

  // actual animation-related logic
  getDefaultValue() {
    const {todos} = this.state;
    return Object.keys(todos).reduce((configs, date) => {
      configs[date] = {
        height: spring(0),
        opacity: spring(1),
        data: todos[date],
      };
      return configs;
    }, {});
  }

  getEndValue() {
    const {todos, value, selected} = this.state;
    return Object.keys(todos)
      .filter(date => {
        const todo = todos[date];
        return todo.text.toUpperCase().indexOf(value.toUpperCase()) >= 0 &&
          (selected === 'completed' && todo.isDone ||
          selected === 'active' && !todo.isDone ||
          selected === 'all');
      })
      .reduce((configs, date) => {
        configs[date] = {
          height: spring(42, presets.gentle),
          opacity: spring(1, presets.gentle),
          data: todos[date],
        };
        return configs;
      }, {});
  }

  willEnter(date) {
    return {
      height: spring(0),
      opacity: spring(1),
      data: this.state.todos[date],
    };
  }

  willLeave(date, styleThatJustLeft) {
    return {
      height: spring(0),
      opacity: spring(0),
      data: styleThatJustLeft.data,
    };
  }

  getStyles() {
    return {
      item: {

      }
    };
  }

  render() {
    const {todos, value, selected} = this.state;
    let styles = this.getStyles();
    return (
      <section className="todoapp">
        <header className="header">
          <form onSubmit={this.handleSubmit.bind(this)}>
            <input
              className="new-todo"
              placeholder="What needs to be done?"
              autoFocus
              value={value}
              onChange={this.handleChange.bind(this)}
            />
          </form>
        </header>
        <section className="main">
          <input className="toggle-all" type="checkbox" onChange={this.handleToggleAll.bind(this)} />
          <TransitionMotion defaultStyles={this.getDefaultValue()} styles={this.getEndValue()} willLeave={this.willLeave.bind(this)}
            willEnter={this.willEnter.bind(this)}>
                {configs =>
                  <ul className="todo-list">
                      {Object.keys(configs).map(key => {
                        const config = configs[key];

                        const {data: {isDone, text}, ...style} = config;

                        let itemStyle = _.merge({}, styles.item, style);

                        return (
                          <li key={key} style={itemStyle}>
                            <Item
                              onClose={this.handleDestroy.bind(this, key)}
                              style={styles.todoItem}
                              label={config.data.text}
                              iconRight="X"
                            />
                          </li>
                        );
                      })}
                  </ul>
                  }
          </TransitionMotion>
        </section>
      </section>
    );
  }

}
