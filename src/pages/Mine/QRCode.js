import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Image
} from 'react-native';
import fetchRequest from '../../lib/Fetch';
import * as ScreenUtil from '../../lib/Px2dp';

class QRCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {}
    }
  }
  static navigationOptions = {
    headerTitle:(
      <Text style={{flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
        我的二维码
      </Text>
    ),
  }
  componentWillMount() {
    fetchRequest('/users/getUserMsg', 'GET').then(res => {
      if (res.code === 200) {
        this.setState({
          user: res.data,
          loading: false
        })
      } else if (res.code === -200) {
        ToastNative(res.message)  
      } else if (res.code === 401) {
        ToastNative(res.message);
        this.setState({
          loading: false
        })
        this.props.navigation.navigate('Login');
      }
    }).catch(err => {
      console.log(err)
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <View style={styles.msgBox}>
            <View>
              {
                this.state.user && this.state.user.photo ?
                <Image style={styles.headImage} source={{uri:this.state.user.photo}} /> :
                <Image style={styles.headImage} source={require('../../images/test/worker.png')} />
              }
            </View>
            <View style={styles.texts}>
              <Text style={styles.name}>{this.state.user.name}</Text>
              <Text style={styles.phone}>手机号:{this.state.user.phoneNumber}</Text>
            </View>
          </View>
          <View style={styles.qrcodeBox}>
            <Image style={styles.qrcode} source={{uri:this.state.user.qrcode}} />
          </View>
          <View>
            <Text style={styles.phone}>扫码添加员工</Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  name: {
    fontSize: ScreenUtil.setSpText(18),
  },
  phone: {
    fontSize: ScreenUtil.setSpText(16),
    color: '#ddd'
  },
  box: {
    margin: ScreenUtil.scaleSize(50),
    marginTop: ScreenUtil.scaleSize(120),
    paddingTop: ScreenUtil.scaleSize(70),
    height: ScreenUtil.scaleSize(1300),
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  msgBox: {
    flexDirection: 'row',
    width: ScreenUtil.scaleSize(750),
  },
  texts: {
    marginLeft: ScreenUtil.scaleSize(40),
    justifyContent: 'space-around'
  },
  headImage: {
    width: ScreenUtil.scaleSize(150),
    height: ScreenUtil.scaleSize(150),
    borderWidth: 1,
    borderColor: '#eee',
  },
  qrcode: {
    width: ScreenUtil.scaleSize(900),
    height: ScreenUtil.scaleSize(900)
  }
});

export default QRCode;