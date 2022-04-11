import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
// import { BoxShadow } from 'react-native-shadow'
import ToastNative from '../../components/Toast';
import * as ScreenUtil from '../../lib/Px2dp';
import fetchRequest from '../../lib/Fetch'
import { NavigationActions, StackActions } from 'react-navigation';

const resetAction = StackActions.reset({ 
  index: 0, 
  actions: [ 
    NavigationActions.navigate({ routeName: 'TabNavigator' }), 
  ], 
});

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        phoneNumber: '',
        password: '',
        isLogin: true
    }
  };
  signIn() {
    
  }
  toLogin() {
    if (!this.state.phoneNumber || !(/^1[34578]\d{9}$/.test(this.state.phoneNumber))) {
      ToastNative('请输入正确的手机号'); 
    } else if (this.state.password.length < 6) {
      ToastNative('请输入6位以上的密码');
    } else {
      if (this.state.isLogin) {
        fetchRequest('/users/loginByPhone', 'POST', {
          phoneNumber: this.state.phoneNumber,
          password: this.state.password
        }).then( res => {
          if (res.code === 200) {
            this.props.navigation.dispatch(resetAction)
          } else if (res.code === 304) {
            ToastNative(res.message);
            this.props.navigation.navigate('Authen')
          } else {
            ToastNative(res.message);
          }
        }).catch( err => {
          console.error(err);
        })
      } else {
        fetchRequest('/users/addUser', 'POST', {
          phoneNumber: this.state.phoneNumber,
          password: this.state.password
        }).then( res => {
          if (res.code === 200) {
            ToastNative('注册成功');
            const id = res.data;
            fetchRequest('http://apis.juhe.cn/qrcode/api?key=15f4f8cb796aa8cb46798a09478fc306&w=600&text='+ id, 'GET', '',true).then(res => {
              console.log(res)  
              if(res.reason === 'success') {
                fetchRequest('/users/updateQRCode', 'POST', {id, code: res.result.base64_image}).then(res => {
                  if (res.code === 200) {

                  } else {
                    ToastNative('二维码生成失败');
                  }
                })
              }
            }).catch(err => {
              console.log(err)
            })
            fetchRequest('/users/loginByPhone', 'POST', {
              phoneNumber: this.state.phoneNumber,
              password: this.state.password
            }).then(res => {
              if (res.code === 304) {
                ToastNative(res.message);
                this.props.navigation.navigate('Authen')
              } else {
                ToastNative('请重新登录');
              }
            }).catch(err => {
              ToastNative('请重新登录');
            })
          } else {
            ToastNative(res.message);
          }
        }).catch( err => {
          console.error(err)
        })
      } 
    }
  };
  render() {
    return (
      <View style={styles.content}>
        <ScrollView>
        <View style={{alignItems: 'center'}}>
          <Image style={styles.bgImage} source={require("../../images/login_bg.png")}></Image>
        </View>
        <View style={{alignItems: 'center', position: 'relative', top: -30}}>
          <View style={styles.shadow}>
            <View style={styles.loginForm}>
              <TouchableOpacity onPress={()=>{this.refs.phoneInput.focus()}}>
                <View style={styles.formItem}>
                  <Text style={styles.formLabel}>手机号</Text>
                  <TextInput
                    ref='phoneInput'
                    style={ styles.formInput }
                    keyboardType="number-pad"
                    maxLength={11}
                    onChangeText={(phoneNumber) => this.setState({phoneNumber: phoneNumber})}
                    value={this.state.phoneNumber}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{this.refs.pwdInput.focus()}}>
                <View style={ styles.formItem }>
                  <Text style={ styles.formLabel }>密码</Text>
                  <TextInput
                    ref='pwdInput'
                    style={ styles.formInput }
                    keyboardType="default"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({password: password})}
                    value={this.state.password}
                  />
                </View>
              </TouchableOpacity>
              <View>
                <Text
                  style={{marginTop: 10, justifyContent: 'flex-end'}}
                  onPress={() => {this.setState({isLogin: !this.state.isLogin, phoneNumber:'', password:''})}}
                >
                  {this.state.isLogin ? '首次注册' : '立即登录'}
                </Text>
              </View>
              <View style={ styles.formButtonItem}>
                <TouchableHighlight style={styles.ButtonBox} onPress={this.toLogin.bind(this)}>
                  <Text style={styles.loginButton}>{this.state.isLogin ? '登录' : '注册'}</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>
        </ScrollView>
      </View>
    );
  }
}

// 阴影部分
const shadowOpt = {
  width: ScreenUtil.scaleSize(1004),
  height: ScreenUtil.scaleSize(781),
  color:"#666",
  border:8,
  opacity:0.1,
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#FEFEFE'
  },
  bgImage: {
    width: ScreenUtil.scaleSize(823),
    height: ScreenUtil.scaleSize(638),
    marginTop: ScreenUtil.scaleSize(227),
  },
  loginForm: {
    borderWidth: 2,
    borderColor: "#eee",
    backgroundColor: '#FFF',
    paddingHorizontal: ScreenUtil.scaleSize(37),
    width: ScreenUtil.scaleSize(1004),
    height: ScreenUtil.scaleSize(781),
  },
  formItem: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 10,
    marginTop: ScreenUtil.scaleSize(100),
    borderBottomWidth: 1,
    borderColor: '#AAAAAA'
  },
  formLabel: {
    width: 60,  
    fontSize: 13
  },
  formInput: {
    width: ScreenUtil.scaleSize(700),
    justifyContent: 'flex-end',
    textAlignVertical:'bottom',
    padding: 0
  },
  formRight: {
    color: '#56A3EB',
  },
  formButtonItem :{
    marginTop: ScreenUtil.scaleSize(117),
  },
  ButtonBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#56A3EB',
    height: ScreenUtil.scaleSize(110),
    borderRadius: 80,
  },
  loginButton: {
    color: '#FFFFFF',
    fontSize: ScreenUtil.setSpText(16)
  }
})

export default LoginPage;