import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation'
import {
  Image, StyleSheet, View, Text
} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'

import * as ScreenUtil from '../lib/Px2dp';

import Projects from '../pages/Projects/Projects'
import AddProj from '../pages/Projects/AddProj'
import EditProj from '../pages/Projects/EditProj'
import ProjDetail from '../pages/Projects/ProjDetail'
import Attendance from '../pages/Projects/Attendance/Index'
import BaiduMap from '../pages/BaiduMap/BaiduMap'

import WorkerMng from '../pages/Projects/WorkerMng/Index'
import CodeCamera from '../pages/Projects/WorkerMng/QRCodeCamera'
import AddWorker from '../pages/Projects/WorkerMng/AddWorker'
import WorkerDetail from '../pages/Projects/WorkerMng/WorkerDetail'

import GroupMng from '../pages/Projects/GroupMng/Index'
import AddGroup from '../pages/Projects/GroupMng/AddGroup'
import GroupDetail from '../pages/Projects/GroupMng/GroupDetail'
import Worker from '../pages/Projects/GroupMng/Worker'
import WorkerMsg from '../pages/Projects/GroupMng/WorkerMsg'
import AlterGroup from '../pages/Projects/GroupMng/AlterGroup'
import GWorkerMng from '../pages/Projects/GroupMng/GWorkerMng'

import TodoList from '../pages/TodoList/TodoList'
import Textarea from '../pages/TodoList/Textarea'

import Demand from '../pages/Demand/Demand'
import AddDemand from '../pages/Demand/AddDemand'
import QuotedList from '../pages/Demand/QuotedList'
import QuotedDetail from '../pages/Demand/QuotedDetail'
import Access from '../pages/Demand/Access'

import Mine from '../pages/Mine/Mine'
import QRCode from '../pages/Mine/QRCode'


const navigationHeader = {
  headerStyle: {
    backgroundColor: '#5CA2FF',  
  },
  headerTintColor: '#FFF',
  headerRight: <View/>
}
const ProjectsStack = createStackNavigator({
  Projects: {
    screen: Projects,
    navigationOptions:{
      header: null
    }
  },
  AddProj: {
    screen: AddProj,
    navigationOptions: navigationHeader
  },
  BaiduMap: {
    screen: BaiduMap,
    navigationOptions:{
      headerStyle: {
        backgroundColor: '#5CA2FF',
      },
      headerTitle: (
        <Text style={{ flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
          项目地址
        </Text>
      ),
      headerRight: <View/>,
      headerTintColor: '#FFF',
    }
  },
  EditProj: {
    screen: EditProj,
    navigationOptions: { 
      headerStyle: {
        backgroundColor: '#5CA2FF',  
      },
      headerTintColor: '#FFF',
    }
  },
  ProjDetail: {
    screen: ProjDetail,
    navigationOptions: { 
      headerStyle: {
        backgroundColor: '#5CA2FF',  
      },
      headerTintColor: '#FFF',
    }
  },
  Attendance: {
    screen: Attendance,
    navigationOptions: navigationHeader
  },
  WorkerMng: {
    screen: WorkerMng,
    navigationOptions: navigationHeader
  },
  WorkerDetail: {
    screen: WorkerDetail,
    navigationOptions: navigationHeader
  },
  CodeCamera: {
    screen: CodeCamera,
    navigationOptions: navigationHeader
  },
  AddWorker: {
    screen: AddWorker,
    navigationOptions: navigationHeader
  },
  GroupMng: {
    screen: GroupMng,
    navigationOptions: { 
      headerStyle: {
        backgroundColor: '#5CA2FF',  
      },
      headerTintColor: '#FFF',
    }
  },
  AddGroup: {
    screen: AddGroup,
    navigationOptions: { 
      headerStyle: {
        backgroundColor: '#5CA2FF',  
      },
      headerTintColor: '#FFF',
    }
  },
  Worker: {
    screen: Worker,
    navigationOptions: navigationHeader
  },
  WorkerMsg: {
    screen: WorkerMsg,
    navigationOptions: navigationHeader
  },
  GroupDetail: {
    screen: GroupDetail,
    navigationOptions: { 
      headerStyle: {
        backgroundColor: '#5CA2FF',  
      },
      headerTintColor: '#FFF',
    }
  },
  GWorkerMng: {
    screen: GWorkerMng,
    navigationOptions: navigationHeader
  },
  AlterGroup: {
    screen: AlterGroup,
    navigationOptions: { 
      headerStyle: {
        backgroundColor: '#5CA2FF',  
      },
      headerTintColor: '#FFF',
    }
  },
  Textarea: {
    screen: Textarea,
    navigationOptions: navigationHeader
  },
}, {
  initialRouteName: 'Projects',
});

const TodoStack = createStackNavigator({
  TodoList: {
    screen: TodoList,
    navigationOptions:{
      header: null
    }
  },
  Textarea: {
    screen: Textarea,
    navigationOptions: navigationHeader
  },
}, {
  initialRouteName: 'TodoList',
})

const DemandStack = createStackNavigator({
  Demand: {
    screen: Demand,
    navigationOptions:{
      header: null
    }
  },
  AddDemand: {
    screen: AddDemand,
    navigationOptions: navigationHeader
  },
  QuotedList: {
    screen: QuotedList,
    navigationOptions: navigationHeader
  },
  QuotedDetail: {
    screen: QuotedDetail,
    navigationOptions: navigationHeader
  },
  Access: {
    screen: Access,
    navigationOptions: navigationHeader
  }
}, {
  initialRouteName: ''
})

const MyStack = createStackNavigator({
  Mine: {
    screen: Mine,
    navigationOptions:{
      header: null
    }
  },
  QRCode: {
    screen: QRCode,
    navigationOptions: navigationHeader
  }
}, {
initialRouteName: 'Mine',
})


export default TabNavigator = createBottomTabNavigator (
  {
    Projects: {
      screen: ProjectsStack,
      navigationOptions: {
        tabBarLabel: '项目',
        tabBarIcon: ({ focused }) =>
          {
            if (focused) {
              return (
                <Image style={styles.tabBarIcon} source={require('../images/nav_xm_do.png')}/>
              );
            }
            return (
              <Image style={styles.tabBarIcon} source={require('../images/nav_xm.png')}/>
            );
          }
      }
    },
    TodoList: { 
      screen: TodoStack,
      navigationOptions:{
        tabBarLabel: '待办',
        tabBarIcon: ({ focused }) =>
          {
            if (focused) {
              return (
                <Image style={styles.tIcon} source={require('../images/nav_db_do.png')}/>
              );
            }
            return (
              <Image style={styles.tIcon} source={require('../images/nav_db.png')}/>
            );
          },
      }
    },
    Demand: {
      screen: DemandStack,
      navigationOptions:{
        tabBarLabel: '需求',
        tabBarIcon: ({ focused }) =>
          {
            if (focused) {
              return (
                <Image style={styles.dIcon} source={require('../images/nav_demand_do.png')}/>
              );
            }
            return (
              <Image style={styles.dIcon} source={require('../images/nav_demand.png')}/>
            );
          },
      }
    },
    Mine: {
      screen: MyStack,
      navigationOptions:{
        tabBarLabel: '我的',
        tabBarIcon: ({ focused }) =>
          {
            if (focused) {
              return (
                <Image style={styles.mIcon} source={require('../images/nav_mine_do.png')}/>
              );
            }
            return (
              <Image style={styles.mIcon} source={require('../images/nav_mine.png')}/>
            );
          },
      }
     }
  },{
    initialRouteName: 'Demand',
    tabBarOptions: {
      style: {
        height: 68,
        backgroundColor: '#FFF',
        borderTopWidth: 0.5,
        borderTopColor: '#DDDADA',
        activeTintColor: '#5CA2FF',
        inactiveTintColor: '#CACACA',
        pressColor: '#5CA2FF',
        pressOpacity: 0.8,
      },
      labelStyle: {
        fontSize: 12,
        marginBottom: 14,
      }
    },
    showIcon: true,
    showLabel: true,
    swipeEnabled: true,
    animationEnabled: true,
    lazy: true,
    tabBarPosition:'bottom'
  }
)

const styles = StyleSheet.create({
  tIcon: {
    width: ScreenUtil.scaleSize(56),
    height: ScreenUtil.scaleSize(55),
  },
  tabBarIcon: {
    width: ScreenUtil.scaleSize(56),
    height: ScreenUtil.scaleSize(50),
  },
  dIcon: {
    width: ScreenUtil.scaleSize(70),
    height: ScreenUtil.scaleSize(70),
  },
  mIcon: {
    width: ScreenUtil.scaleSize(56),
    height: ScreenUtil.scaleSize(66),
  },
})