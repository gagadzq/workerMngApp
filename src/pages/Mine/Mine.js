import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Image, TouchableOpacity
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

import * as ScreenUtil from '../../lib/Px2dp';
import ToastNative from '../../components/Toast'
import fetchRequest from '../../lib/Fetch';
import Loading from '../../components/Loading';

class Mine extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      imageUri: '',
      loading: false
    }
  }
  logout() {
    fetchRequest('/users/logout', 'POST').then( res => {
      if (res.code === 200) {
        ToastNative(res.message);
        this.props.navigation.navigate('Login');
      }
    })
  }
  selectPhotoTapped(type) {
    const options = {
      title: '请选择图片来源',
      cancelButtonTitle:'取消',
      takePhotoButtonTitle:'拍照',
      chooseFromLibraryButtonTitle:'相册图片',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const file = {
          uri: response.uri,
          type: 'multipart/form-data',
          name: Date.parse(new Date()) + ".jpg"
        }

        var fd = new FormData();
        fd.append('file', file);
        fetch('http://172.20.10.2:3000/upload', {
          method: 'POST',
          body: fd,
        }).then(response => {
          const res = JSON.parse(response._bodyInit)
          console.log(res)
          fetchRequest('/users/setPhoto','POST',{photo: res.file_path}).then(res => {
            if (res.code === 200) {
              this.setState({
                imageUri: res.photo
              })
            } else {
              ToastNative('操作失败');
            }
          })
        }).catch(err => {
          console.log(err)
        })
      }
    })
  }
  componentWillMount(){
    this.setState({
      loading: true
    })
    fetchRequest('/users/getUserMsg', 'GET').then(res => {
      if (res.code === 200) {
        res.data.idCardCode = res.data.idCardCode.substring(0,1)+ '***********' + res.data.idCardCode.substring(17,18)
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
      } else if (res.code === 304) {
        ToastNative(res.message);
        this.setState({
          loading: false
        })
        this.props.navigation.navigate('Authen');
      }
    }).catch(err => {
      this.setState({
        loading: false
      })
      console.log(err)
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
            {
              this.state.user && this.state.user.photo ?
              <Image style={styles.headImage} source={{uri:this.state.user.photo}} /> :
              <Image style={styles.headImage} source={require('../../images/test/worker.png')} />
            }
          </TouchableOpacity>
          <Text>{this.state.user.name}</Text>
        </View>
        <View style={styles.mesBody}>
          <View style={styles.mesItem}>
            <Text style={styles.middleText}>手机号</Text>
            <Text style={styles.middleText}>{this.state.user? this.state.user.phoneNumber : ''}</Text>
          </View>
          <TouchableOpacity onPress={() =>this.props.navigation.navigate('QRCode')}>
            <View style={styles.mesItem}>
              <Text style={styles.middleText}>二维码</Text>
              <Image style={styles.icon} source={require('../../images/icon_qrcode.png')}></Image>
            </View>
          </TouchableOpacity>
          <View style={styles.mesItem}>
            <Text style={styles.middleText}>身份证</Text>
            <Text style={styles.middleText}>{this.state.user? this.state.user.idCardCode : ''}</Text>
          </View>
        </View>
        <View style={styles.btn}>
          <Text style={styles.logout} onPress={this.logout.bind(this)}>
            退出登录
          </Text>
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
    backgroundColor: '#F9FCFF',
  },
  header: {
    alignItems: 'center',
  },
  headImage: {
    width: ScreenUtil.scaleSize(187),
    height: ScreenUtil.scaleSize(187),
    marginTop: ScreenUtil.scaleSize(202),
    marginBottom: ScreenUtil.scaleSize(25),
    borderRadius: 50
  },
  mesBody: {
    paddingHorizontal: ScreenUtil.scaleSize(40),
    marginTop: ScreenUtil.scaleSize(160),
    backgroundColor: '#FFF',  
  },
  middleText: {
    fontSize: ScreenUtil.setSpText(16),
  },
  mesItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: ScreenUtil.scaleSize(130),
    borderBottomWidth: 1,
    borderColor: '#f2f2f2',
  },
  icon: {
    height: ScreenUtil.scaleSize(60),
    width: ScreenUtil.scaleSize(60),
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    marginTop:  ScreenUtil.scaleSize(50),
    height: ScreenUtil.scaleSize(130),
  },
  logout: {
    color: '#ff4400',
    fontSize: ScreenUtil.setSpText(16)
  }
});

export default Mine;