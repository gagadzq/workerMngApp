import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, Image
} from 'react-native';
//import { Geolocation} from 'react-native-baidu-map';
import * as ScreenUtil from '../../../lib/Px2dp';
import fetchRequest from '../../../lib/Fetch';
import Loading from '../../../components/Loading'
import ToastNative from '../../../components/Toast';


class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      status: 0,
      pId: '',
      projData: {},
      projAddr: '',
      week: '',
      longitude: '',
      latitude: '',
      address: '',
      signInTime: '',
      signOutTime: ''
    }
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle:(
        <Text style={{ flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
          考勤打卡
        </Text>
      ),
    }
  }
  // 获取经纬度
  getLocation() {
   /*  Geolocation.getCurrentPosition()
      .then(data => {
        Geolocation.reverseGeoCode(data.latitude,data.longitude)
          .then(res => {
            this.setState({
              longitude: data.longitude,
              latitude: data.latitude,
              address: res.address
            })
          })
          .catch(e => {
            console.warn(e, 'error');
          })
      })
      .catch(e =>{
        console.warn(e, 'error');
      }) */
  }
  reLocation() {
    this.setState({
      address: ''
    })
    this.getLocation();
  }
  // 检查距离
  checkLocation() {
    function rad(d){
      return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
    }
    if (this.state.longitude && this.state.latitude && this.state.projData.addrLatitude && this.state.projData.addrLongitude) {
      var radLat1 = rad(this.state.latitude);
      var radLat2 = rad(this.state.projData.addrLatitude);
      var a = radLat1 - radLat2;
      var b = rad(this.state.longitude) - rad(this.state.projData.addrLongitude);
      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * 6378.137;
      // EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000;
      return s;
    }
  }
  getAttendance(pId) {
    fetchRequest('/attendance/getAttendance?pId=' + pId, 'GET').then(res => {
      if (res.code === 200) {
        if (res.data.attStatus !== 0) {
          var signInTime = new Date(res.data.sign_in_time).toLocaleTimeString();
          if (res.data.attStatus === 2) {
            var signOutTime = new Date(res.data.sign_back_time).toLocaleTimeString();
          }
          this.setState({
            signInTime,
            signOutTime,
            status: res.data.attStatus
          })
        }
      } else {
        console.log(res.message)
      }
    })
  }
  getProjectDetail(pId) {
    fetchRequest('/projects/getProjDetail?pId=' + pId, 'GET').then(res => {
      this.setState({
        loading: false,
        projData: res.data[0],
        projAddr: res.data[0].addrName
      })
    }).catch(err => {
      console.log(err)
      this.setState({
        loading: false
      });
    })
  }
  getButton() {
    if (!this.state.signInTime && !this.state.signOutTime) {
      return (
        <View style={[styles.curcleButton, styles.normalBackground]}>
          <Text style={styles.buttonText}>签到</Text>
        </View>
      )
    } else if(this.state.signInTime && !this.state.signOutTime) {
      return (
        <View style={[styles.curcleButton, styles.successBackground]}>
          <Text style={styles.buttonText}>签退</Text>
        </View>
      )
    } else if (this.state.signInTime && this.state.signOutTime) {
      return (
        <View style={[styles.curcleButton, styles.finishedBackground]}>
          <Text style={styles.buttonText}>好好休息</Text>
        </View>
      )
    }
  }
  clock() {
    var distance = this.checkLocation();
    if (distance < 2) {
      if (this.state.status === 0) {
        fetchRequest('/attendance/signIn?pId=' + this.state.pId, 'POST').then(res => {
          if (res.code === 200) {
            this.getAttendance(this.state.pId);
          } else {
            ToastNative(res.message);
          }
        }).catch(err => {
          ToastNative('请求失败');
        })
      } else if (this.state.status === 1) {
        fetchRequest('/attendance/signOut?pId=' + this.state.pId, 'POST').then(res => {
          if (res.code === 200) {
            this.getAttendance(this.state.pId);
          } else {
            ToastNative(res.message);
          }
        }).catch(err => {
          ToastNative('请求失败');
        })
      }
    } else {
      ToastNative('不在工地范围内');
    }
  }
  componentDidMount() {
    /* this.setState({
      loading: true
    }) */
    const today = new Date();
    const week = today.getDay();  
    const weekName = ["日", "一", "二", "三", "四", "五", "六"];
    const pId = this.props.navigation.getParam('pId');
    /* const pId = 1; */
    this.setState({
      pId,
      week: '星期' + weekName[week],
      date: today.getFullYear() + '年' + (today.getMonth() + 1) + '月' + today.getDate() + '日'
    })
    this.getProjectDetail(pId);
    this.getLocation();
    this.getAttendance(pId);
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text>{this.state.week} {this.state.date}</Text>
          <Text>{this.state.projAddr}</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.boder}>
            <View style={styles.toTop} >
              <View style={styles.curcle}></View>
              <View>
                <Text style={styles.statuText}>出勤打卡8:00</Text>
                { this.state.signInTime ? 
                  <View style={{flexDirection: 'row', alignItems: 'center', marginTop: ScreenUtil.setSpText(10)}}>
                    <View style={[styles.dkbox, styles.successColor]}><Text style={styles.fontSuccess}>已打卡</Text></View>
                    <View style={styles.txtbox}><Text>{this.state.signInTime}</Text></View>
                  </View>
                  :
                  <View style={[styles.dkbox, styles.normalColor]}><Text style={styles.fontNormal}>未打卡</Text></View>
                }
              </View>  
            </View>
            <View style={styles.toBottom} >
              <View style={styles.curcle}></View>
              <View>
                <Text style={styles.statuText}>退勤打卡18:00</Text>
                { this.state.signOutTime ? 
                  <View style={{flexDirection: 'row', alignItems: 'center', marginTop: ScreenUtil.setSpText(10)}}>
                    <View style={[styles.dkbox, styles.successColor]}><Text style={styles.fontSuccess}>已打卡</Text></View>
                    <View style={styles.txtbox}><Text>{this.state.signOutTime}</Text></View>
                  </View>
                  :
                  <View style={[styles.dkbox, styles.normalColor]}><Text style={styles.fontNormal}>未打卡</Text></View>
                }
              </View>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={this.clock.bind(this)}>
            { this.getButton() }
          </TouchableOpacity>  
          <Text>{this.state.address}</Text>
          <Text style={{color: '#7EABF4', marginTop: 10}} onPress={this.reLocation.bind(this)}>重新定位</Text>
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
    flex: 1
  },
  header: {
    height: ScreenUtil.scaleSize(120),
    paddingHorizontal: ScreenUtil.scaleSize(40),
    flexDirection: 'row',
    backgroundColor: '#eee',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  body: {
    marginTop: ScreenUtil.scaleSize(120),
    marginLeft: ScreenUtil.scaleSize(50),
  },
  boder: {
    height: ScreenUtil.scaleSize(400),
    paddingLeft: ScreenUtil.scaleSize(40),
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
    justifyContent: 'space-between'
  },
  statuText: {
    fontSize: ScreenUtil.setSpText(18),
  },
  dkbox: {
    width: ScreenUtil.setSpText(56),
    height: ScreenUtil.setSpText(25),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5, 
  },
  txtbox: {
    marginLeft: ScreenUtil.setSpText(20),
    height: ScreenUtil.setSpText(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  successColor: {
    borderColor: '#194',
  },
  fontSuccess: {
    color: '#194'
  },
  normalColor: {
    borderColor: '#7EABF4',
  },
  fontNormal: {
    color: '#7EABF4'
  },
  curcle: {
    width: ScreenUtil.scaleSize(25),
    height: ScreenUtil.scaleSize(25),
    marginRight: ScreenUtil.scaleSize(30),
    borderRadius: 50,
    backgroundColor: '#aaa'
  },
  toTop: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: -ScreenUtil.scaleSize(12)
  },
  toBottom: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -ScreenUtil.scaleSize(130),
    left: -ScreenUtil.scaleSize(12)
  },
  footer: {
    marginTop: ScreenUtil.scaleSize(320),
    alignItems: 'center',
  },
  curcleButton: {
    width: ScreenUtil.scaleSize(340),
    height: ScreenUtil.scaleSize(340),
    marginBottom: ScreenUtil.scaleSize(80),
    borderRadius: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  normalBackground: {
    backgroundColor: '#7EABF4'
  },
  normalBackground: {
    backgroundColor: '#7EABF4'
  },
  successBackground: {
    backgroundColor: '#119944'
  },
  finishedBackground: {
    backgroundColor: '#bbb'
  },
  buttonText: {
    color: 'white',
    fontSize: ScreenUtil.setSpText(20)
  }
});
export default Attendance;