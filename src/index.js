import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation'

import StackNavigator from './components/StackNavigator'


const App  = createAppContainer(StackNavigator)

export default class ReactNativeWorkmateApp extends Component {
  render() {
    return (
        <App />
    )
  }
}
