import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, Image, ImageBackground
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import * as ScreenUtil from '../../../lib/Px2dp';
import fetchRequest from '../../../lib/Fetch';
import ToastNative from '../../../components/Toast'
import Loading from '../../../components/Loading'

class WorkerDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pId: '',
      uId: '',
      id: '',
      user: {},
      groups: [],
      groupsList: []
    }
  }
  static navigationOptions = ({navigation}) => {
    //let pId = navigation.getParam('pId')
    return {
      headerTitle:(
        <Text style={{ flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
          工人信息
        </Text>
      ),
/*       headerRight:(
        <TouchableOpacity onPress={() => {navigation.navigate('AddGroup', {pId, refresh: ()=>navigation.state.params.navigateRefresh()})}}>
          <View style={{marginRight: ScreenUtil.scaleSize(26)}}>
            <Feather name={'plus'} size={22} color={'white'}/>
          </View>
        </TouchableOpacity>
      ), */
    }
  }
  alterManager(){
    fetchRequest('/worker/doManager', 'POST', {id: this.state.id}).then(res=>{
      if (res.code === 200) {
        ToastNative('设置成功')
      } else {
        ToastNative(res.message)
      }
    })
  }
  deleteWorker(){
    fetchRequest('/worker/deleteUsersByProj', 'POST', {id: this.state.id}).then(res=>{
      if (res.code === 200) {
        this.props.navigation.state.params.refresh();
        this.props.navigation.goBack();
      } else {
        ToastNative(res.message)
      }
    })
  }
  componentWillMount() {
    const uId = this.props.navigation.getParam('uId');
    const id = this.props.navigation.getParam('id');
    const uType = this.props.navigation.getParam('uType');
    this.setState({
      uId, id, uType,
      loading: true
    })
    fetchRequest('/users/getWorkerMsg?uId='+uId, 'GET').then(res => {
      if (res.code === 200) {
        this.setState({
          user: res.data,
          loading: false
        })
      } else {
        ToastNative(res.message)  
        this.setState({
          loading: false
        })
      }
    }).catch(err => {
      console.log(err)
      this.setState({
        loading: false
      })
    })
    fetchRequest('/group/queryGroupByWorker?uId='+uId, 'GET').then(res => {
      if (res.code === 200) {
        var groups = [];
        res.data.forEach(element => {
          groups.push(element.groupName)
        });
        this.setState({
          groups: groups,
        })
      } else {
        ToastNative(res.message)
      }
    }).catch(err => {
      console.log(err)
    })
  }
  render() {
    return (
      <View style={styles.wrap}>
        <View style={styles.box}>
          <ImageBackground style={styles.bg} source={require('../../../images/worker.png')}>
            {
              this.state.user && this.state.user.photo ?
              <Image style={styles.headImage} source={{uri:this.state.user.photo}} /> :
              <Image style={styles.headImage} source={require('../../../images/test/worker.png')} />
            }
            <Text style={styles.name}>{this.state.user.name}</Text>
            <Text style={styles.phone}>{this.state.user.phoneNumber}</Text>
            <Text>班组: {this.state.groups.length > 0 ? this.state.groups.join('、') : '无'}</Text>
          </ImageBackground>
        </View>
         {
           this.state.uType === 1 ? (
             <View>
              <View>
                <TouchableOpacity style={styles.btn} onPress={this.alterManager.bind(this)}>
                  <Text style={styles.btnText}>设为管理员</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity style={styles.deleteBtn} onPress={this.deleteWorker.bind(this)}>
                  <Text style={styles.btnText}>删除</Text>
                </TouchableOpacity>
              </View>
             </View>
           ) : null
        }
        { this.state.loading ? (
          <Loading />
         ) : null
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center'
  },
  bg: {
    width: ScreenUtil.scaleSize(600),
    height: ScreenUtil.scaleSize(500),
    alignItems: 'center'
  },
  box: {
    width: ScreenUtil.scaleSize(950),
    height: ScreenUtil.scaleSize(800),
    marginTop: ScreenUtil.scaleSize(70),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f8fd'
  },
  headImage: {
    width: ScreenUtil.scaleSize(250),
    height: ScreenUtil.scaleSize(250),
  },
  name: {
    fontSize: ScreenUtil.setSpText(20),
    marginBottom: ScreenUtil.scaleSize(10),
    marginTop: ScreenUtil.scaleSize(10),
  },
  phone: {
    fontSize: ScreenUtil.setSpText(18),
    marginBottom: ScreenUtil.scaleSize(10),
  },
  btn: {
    width: ScreenUtil.scaleSize(950),
    height: ScreenUtil.scaleSize(140),
    backgroundColor: '#56A3EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  deleteBtn: {
    width: ScreenUtil.scaleSize(950),
    height: ScreenUtil.scaleSize(140),
    marginTop: ScreenUtil.scaleSize(10),
    backgroundColor: '#f96a6a',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  btnText: {
    color: '#fff',
    fontSize: ScreenUtil.setSpText(18)
  }
})

export default WorkerDetail;