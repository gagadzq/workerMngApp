import React from 'react';
import { View, Text } from 'react-native'
import { createStackNavigator } from 'react-navigation'

import * as ScreenUtil from '../lib/Px2dp';

import TabNavigator from './TabNavigator'
import Login from '../pages/Login/Login'
import Authen from '../pages/Login/Authen'

const navigationHeader = {
  headerStyle: {
    backgroundColor: '#5CA2FF',  
  },
  headerTintColor: '#FFF',
  headerRight: <View/>
}

export default StackNavigator = createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions:{
        header: null
      }
    },
    TabNavigator: {
      screen: TabNavigator,
      navigationOptions:{
        header: null
      }
    },
    Authen: {
      screen: Authen,
      navigationOptions: {
        ...navigationHeader,
        headerTitle: (
          <Text style={{ flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
            实名认证
          </Text>
        ),
      }
    }
  }, {
    initialRouteName: 'TabNavigator',
  }
)