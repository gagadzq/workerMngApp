import React, { Component } from 'react';
import {
  Text, View, ImageBackground, StyleSheet, TouchableOpacity, Image
} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import * as ScreenUtil from '../../lib/Px2dp';
import fetchRequest from '../../lib/Fetch';
import Loading from '../../components/Loading'

function ButtonRole(props) {
  return (
    <View style={styles.buttonItem}>
      <TouchableOpacity onPress={props.click}>
        <Image style={styles.buttonImg} source={props.source}></Image>
      </TouchableOpacity>
      <Text>{props.title}</Text>
    </View>
  )
}

class ProjDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pId: '',
      projData: {},
      weather: '',
      temperature: '',
      wind: '',
      inPersonNum: 0,
      nowPersonNum: 0,
      allPersonNum: 0,
      uType: ''
    }
  }
  static navigationOptions = ({navigation}) => {
    let pId = navigation.getParam('pId')
    return {
      headerTitle:(
        <Text style={{ flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
          {navigation.getParam('projName')}
        </Text>
      ),
      headerRight:(
          <View></View>
      ),
    }
  }
  componentDidMount() {
    this.setState({
      loading: true,
      pId: this.props.navigation.getParam('pId')
    });
    const pId = this.props.navigation.getParam('pId')
    fetchRequest('/projects/getProjDetail?pId=' + pId, 'GET').then(res => {
      this.setState({
        loading: false,
        projData: res.data[0]
      });
      fetchRequest('http://v.juhe.cn/weather/index?key=b7a14bfe0c2ee50f870fd64d3a4c5148&cityname='+ res.data[0].city, 'GET', '',true).then(res => {
        const { weather, temperature, wind } = res.result.today;
        this.setState({
          weather, temperature, wind
        })
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
      this.setState({
        loading: false
      });
    })
    fetchRequest('/attendance/getTodayAtt?pId=' + pId, 'GET').then(res => {
      if (res.code === 200) {
        const {data} = res;
        var signBackNum = 0
        data.map((item,index) => {
          if(item.sign_back_time) {
            signBackNum++
          }
        })
        if (res.data) {
          this.setState({
            inPersonNum: data.length,
            nowPersonNum: data.length-signBackNum
          })
        }
      } 
    }).catch(err => {
      console.log(err)
    })
    fetchRequest('/worker/getUsersNum?pId=' + pId, 'GET').then(res => {
      if (res.code === 200) {
        this.setState({ 
          allPersonNum: res.data
        })
      } else {}
    }).catch(err => {
      console.log(err)
    })
    fetchRequest('/projects/getUserAuthen?pId=' + pId, 'GET').then(res => {
      if (res.code === 200) {
        this.setState({
          uType: res.data[0].uType
        })
      } else {}
    }).catch(err => {
      console.log(err)
    })
  }
  render() {
    return(
      <View style={styles.container}>
        <ImageBackground style={styles.section} source={require('../../images/pj_detail_bg.png')}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerLeftOne}>
                <Text style={[styles.font36,styles.fontWhite]}>{this.state.temperature}</Text>
              </View>
                <Text style={[styles.font18, styles.fontWhite]}>{this.state.weather}</Text>
              <View>
                <Text style={[styles.font18,styles.fontWhite]}>{this.state.wind}</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.curcle}>
                <Text style={styles.font18}>
                  {this.state.projData.completed / this.state.projData.total < 0.01 ? parseInt((this.state.projData.completed / this.state.projData.total) * 100) : '100'}%
                </Text>
              </View>
              <Text style={[styles.font14, styles.fontWhite, {textAlign:'center'}]}>竣工日期</Text>
              <Text style={[styles.font14, styles.fontWhite, {textAlign:'center'}]}>{this.state.projData.endDate ? this.state.projData.endDate.substring(0,10) : ''}</Text>
            </View>
          </View>
          <View style={styles.dataBox}>
            <View>
              <Text style={[styles.font26, styles.fontGray, {textAlign:'center'}]}>{this.state.nowPersonNum}</Text>
              <Text style={[styles.fontGray, {textAlign:'center'}]}>实时在场人数</Text>
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text style={[styles.font26, styles.fontGray, {textAlign:'center'}]}>{this.state.inPersonNum}</Text>
              <Text style={[styles.fontGray, {textAlign:'center'}]}>今日进场人数</Text>
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text style={[styles.font26, styles.fontGray, {textAlign:'center'}]}>{(this.state.inPersonNum / this.state.allPersonNum) * 100}%</Text>
              <Text style={[styles.fontGray, {textAlign:'center'}]}>今日出勤率</Text>
            </View>
          </View>
          <View style={styles.toolBox}>
            <View style={styles.toolRow}>
              <ButtonRole source={require('../../images/icon_check.png')} title='考勤打卡' click={()=>{this.props.navigation.navigate('Attendance', {pId: this.state.pId, uType: this.state.uType})}} />
              <ButtonRole source={require('../../images/icon_worker.png')} title='工人管理' click={()=>{this.props.navigation.navigate('WorkerMng', {pId: this.state.pId, uType: this.state.uType})}} />
              <ButtonRole source={require('../../images/icon_team.png')} title='班组管理' click={()=>{this.props.navigation.navigate('GroupMng', {pId: this.state.pId, uType: this.state.uType})}} />
              <ButtonRole source={require('../../images/icon_offer.png')} title='项目管理' click={()=>{this.props.navigation.navigate('EditProj', {pId: this.state.pId, uType: this.state.uType})}}/>
            </View>
            <View style={styles.toolRow}>
            </View>
          </View>
        </ImageBackground>
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
    alignItems: 'center',
  },
  fontWhite: {
    color: '#FFF'
  },
  fontGray: {
    color: '#A6A5A6'
  },
  font56: {
    fontSize:ScreenUtil.setSpText(56),
    fontWeight: 'bold'
  },
  font36: {
    fontSize:ScreenUtil.setSpText(36)
  },
  font26: {
    fontSize:ScreenUtil.setSpText(26)
  },
  font18: {
    fontSize:ScreenUtil.setSpText(18)
  },
  font14: {
    fontSize:ScreenUtil.setSpText(14)
  },
  section: {
    flex: 1,
    alignItems: 'center',
    width: ScreenUtil.scaleSize(1080),
    height: ScreenUtil.scaleSize(1700),
  },
  header: {
    width: ScreenUtil.scaleSize(1020),
    height: ScreenUtil.scaleSize(365),
    paddingTop: ScreenUtil.scaleSize(62),
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerLeft: {
    color: '#FFF',
    justifyContent: 'center',
  },
  headerRight: {
    marginTop: ScreenUtil.scaleSize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLeftOne:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  curcle: {
    borderRadius: 50,
    width: ScreenUtil.scaleSize(143),
    height: ScreenUtil.scaleSize(143),
    marginBottom: ScreenUtil.scaleSize(20),
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dataBox: {
    width: ScreenUtil.scaleSize(1020),
    height: ScreenUtil.scaleSize(265),
    marginTop: ScreenUtil.scaleSize(45),
    backgroundColor: '#FFF',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ScreenUtil.scaleSize(60),
  },
  buttonImg: {
    width: ScreenUtil.scaleSize(115),
    height: ScreenUtil.scaleSize(115),
    marginBottom: ScreenUtil.scaleSize(15)
  },
  buttonItem: {
    alignItems: 'center'
  },
  toolBox: {
    width: ScreenUtil.scaleSize(1020),
    height: ScreenUtil.scaleSize(888),
    marginTop: ScreenUtil.scaleSize(45),
    paddingTop: ScreenUtil.scaleSize(80),
    backgroundColor: '#FFF',
    borderRadius: 10
  },
  toolRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: ScreenUtil.scaleSize(85),
    marginBottom: ScreenUtil.scaleSize(85)
  }
})
export default ProjDetail