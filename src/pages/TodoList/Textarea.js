import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Image, TextInput, TouchableHighlight
} from 'react-native';
import * as ScreenUtil from '../../lib/Px2dp';
import ToastNative from '../../components/Toast'
import fetchRequest from '../../lib/Fetch';

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoText: ''
    }
  }
  static navigationOptions = ({navigation, screenProps}) => {
    return {
      headerTitle:(
        <Text style={{flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
          新建待办
        </Text>
      ),
    }
  }
  creatTodo() {
    console.log(this.state.todoText)
    var params = {unfinished: this.state.todoText}
    fetchRequest('/todo/addTodo', 'POST', params).then(res => {
      if (res.code === 200) {
        ToastNative('创建成功');
        this.props.navigation.state.params.refresh();
        this.props.navigation.goBack();
      } else {
        ToastNative(res.message);
      }
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputBox}>
          <TextInput
            style={[styles.inputTextStyle]}
            multiline={true}
            placeholder='新建一个待办任务'
            paddingVertical={0}
            selectionColor = {'#b2b2b2'}
            textAlignVertical={'top'}
            placeholderTextColor={'#b2b2b2'}
            underlineColorAndroid={'transparent'}
            maxLength={1000}
            value= {this.state.todoText}
            onChangeText={
              (text) => {
                  this.setState({
                      todoText: text
                  })
              }
            }
          />
          <TouchableHighlight style={styles.ButtonBox} onPress={this.creatTodo.bind(this)}>
            <View style={styles.buttonView}>
                <Text style={styles.loginButton}>确认</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  tabBarIcon: {
    width: ScreenUtil.scaleSize(59),
    height: ScreenUtil.scaleSize(55),
  },
  textarea: {
    height: ScreenUtil.scaleSize(100),
  },
  inputBox: {
    width: ScreenUtil.scaleSize(980),
    borderRadius: 10,
    marginHorizontal: ScreenUtil.scaleSize(50),
    marginTop: ScreenUtil.scaleSize(100),
    backgroundColor: '#FFF',
  },
  inputTextStyle: {
    fontSize: ScreenUtil.setSpText(18),
    color: '#666666',
    width: '100%',
    minHeight: ScreenUtil.scaleSize(600),
    padding: 10,
    paddingBottom: 30,
    paddingTop: 10
  },
  buttonView: {
    marginVertical: ScreenUtil.scaleSize(60),
    marginHorizontal: ScreenUtil.scaleSize(40),
  },
  ButtonBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#56A3EB',
    height: ScreenUtil.scaleSize(120),
    borderRadius: 5,
  },
  loginButton: {
    color: '#FFFFFF',
    fontSize: ScreenUtil.setSpText(16),
  },
});

export default Message;