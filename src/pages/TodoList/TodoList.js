import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Image, TouchableHighlight, TouchableOpacity
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import JPushModule from 'jpush-react-native'

import * as ScreenUtil from '../../lib/Px2dp';
import Loading from '../../components/Loading';
import ToastNative from '../../components/Toast'
import fetchRequest from '../../lib/Fetch';

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      checked: true,
      todoList: [],
      doneList: [],
      loading: false
    }
  }
  deleteTodo(id){
    var params = { id }
    fetchRequest('/todo/deleteTodo', 'POST', params).then(res => {
      if (res.code === 200) {
        this.init();
      } else {
        ToastNative(res.message);
      }
    })
  }
  checked(id) {
    this.state.todoList.find((value, index, arr) => {
      if (value.id == id) {
        this.setState(prevState => {
          prevState.doneList.push(value)
          prevState.todoList.splice(index, 1)
          return {
            doneList: prevState.doneList,
            todoList: prevState.todoList
          }
        })
        this.updateStatus(id, 0);
      }
    })
  }
  checkedFalse(id) {
    this.state.doneList.find((value, index, arr) => {
      if (value.id == id) {
        this.setState(prevState => {
          prevState.todoList.push(value)
          prevState.doneList.splice(index, 1)
          return {
            doneList: prevState.doneList,
            todoList: prevState.todoList
          }
        })
        this.updateStatus(id, 1);
      }
    })
  }
  updateStatus(id, status) {
    var params = {
      id, status
    }
    fetchRequest('/todo/updateStatus', 'POST', params).then(res => {
      if (res.code === 200) {
        
      } else {
        ToastNative(res.message);
      }
    })
  }
  init() {
    this.setState({
      loading: true
    })
    fetchRequest('/users/getUserMsg', 'GET').then(res => {
      console.log(res.code)
      if (res.code === 200) {
        this.setState({
          userName: res.data.name
        })
        fetchRequest('/todo/getTodoListByUser', 'GET').then(res => {
          if (res.code === 200) {
            var todoList = res.data.filter((currentValue, index) => {
              return currentValue.status === 1
            })
            var doneList = res.data.filter((currentValue, index) => {
              return currentValue.status === 0
            })
            this.setState({
              todoList, doneList,
              loading: false
            })
          } else {
            ToastNative(res.message);
            this.setState({
              loading: false
            })
          }
        })
      } else if (res.code === -200) {
        ToastNative(res.message);
        this.setState({
          loading: false
        })
        
      } else if (res.code === 401) {
        ToastNative(res.message);
        this.setState({
          loading: false
        })
        ('Login');
      }
    }).catch(err => {
      console.log(err)
    })
  }
  componentWillMount() {
    this.init();
    /* JPushModule.addReceiveCustomMsgListener(map => {
      this.setState({
          pushMsg: map.message
      })
      console.log('extras: ' + map.extras)
    })
    //接收通知监听
    JPushModule.addReceiveNotificationListener((map) => {
        console.log("alertContent: " + map.alertContent);
        console.log("extras: " + map.extras);
    })
    var currentDate = new Date()
    JPushModule.sendLocalNotification({
      id: 5,
      content: 'content',
      extra: { key1: 'value1', key2: 'value2' },
      fireTime: currentDate.getTime() + 3000,
      badge: 8,
      sound: 'fasdfa',
      subtitle: 'subtitle',
      title: 'title'
    }) */
  }
  render() {
    return (
      <View style={styles.container}>
        <View>
          { this.state.todoList && this.state.doneList && (this.state.todoList.length > 0 || this.state.doneList.length > 0) ? (
            <View>
              <View>
                <View style={styles.status}><Text>未完成</Text></View>
                { this.state.todoList.map((item, index) => (
                  <View style={styles.listItem} key={item.id}>
                    <TouchableHighlight onPress={this.checked.bind(this, item.id)}>
                      <Feather name={'circle'} size={24} color='#7EABF4'/>
                    </TouchableHighlight>
                    <View style={styles.inputBox}>
                      <Text style={styles.todoText}>{item.todo}</Text>
                    </View>
                    <TouchableOpacity onPress={this.deleteTodo.bind(this, item.id)}>
                      <View><Feather name={'x-circle'} size={18} color='#bbb'/></View>
                    </TouchableOpacity>
                  </View>  
                ))
                }
              </View>
              <View>
                <View style={styles.status}><Text>已完成</Text></View>
                { this.state.doneList.map((item, index) => (
                  <View style={styles.listItem} key={item.id}>
                    <TouchableHighlight onPress={this.checkedFalse.bind(this, item.id)}>
                      <Feather name={'check-circle'} size={24} color='#aaa'/>
                    </TouchableHighlight>
                    <View style={styles.inputBox}>
                      <Text style={styles.todoText}>{item.todo}</Text>
                    </View>
                    <TouchableHighlight onPress={this.deleteTodo.bind(this, item.id)}>
                      <View><Feather name={'x-circle'} size={18} color='#bbb'/></View>
                    </TouchableHighlight>
                  </View>
                ))
                }
              </View>
            </View>
          ) : (
            <View style={{alignItems:'center'}}>
              <Image style={styles.noLogo} source={require('../../images/warning_noTodo.png')}/>
              <Text>没有任务，放松一下</Text>
            </View>
          )}    
        </View>
        <View style={styles.contentFindView}>
          <TouchableHighlight style={styles.findMoreView} onPress={() => {this.props.navigation.navigate('Textarea',{refresh: ()=>this.init()})}} >
            <View style={styles.findMore}>
              <FontAwesome name={'plus'} size={24} color={'white'}/>
            </View>
          </TouchableHighlight>
        </View>
        { this.state.loading ? (
          <Loading />
         ) : null
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  noLogo: {
    width: ScreenUtil.scaleSize(468),
    height: ScreenUtil.scaleSize(454),
    marginTop: ScreenUtil.scaleSize(500),
    marginBottom: ScreenUtil.scaleSize(25)
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  removeBtn: {
    position: 'relative',
    //right: -ScreenUtil.scaleSize(200),
    width: ScreenUtil.scaleSize(200),
    height: '100%',
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center'
  },
  status: {
    color: '#DDD',
    backgroundColor: '#F5FCFF',
    height: ScreenUtil.scaleSize(100),
    paddingLeft: ScreenUtil.scaleSize(40),
    justifyContent: 'center'
  },
  tabBarIcon: {
    width: ScreenUtil.scaleSize(56),
    height: ScreenUtil.scaleSize(56),
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ScreenUtil.scaleSize(130),
    paddingLeft: ScreenUtil.scaleSize(40),
    paddingRight: ScreenUtil.scaleSize(40),
    backgroundColor: '#FFF'
  },
  inputBox: {
    flex: 1,
    height: '100%',
    paddingLeft: ScreenUtil.scaleSize(26),
    justifyContent: 'center'
  },
  todoText: {
    fontSize: ScreenUtil.setSpText(18)
  },
  contentFindView: {
    position: "absolute",
    bottom: ScreenUtil.scaleSize(50),
    right: ScreenUtil.scaleSize(40)
  },
  findMoreView: {
    width: ScreenUtil.scaleSize(150),
    height: ScreenUtil.scaleSize(150),
    backgroundColor: '#7EABF4',
    borderRadius: 100
  },
  findMore: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default TodoList;