import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Image, ImageBackground, TouchableHighlight, TouchableOpacity
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import EZSwiper from '../../components/EZSwiper';
import Loading from '../../components/Loading';
import ToastNative from '../../components/Toast'

import * as ScreenUtil from '../../lib/Px2dp';
import fetchRequest from '../../lib/Fetch';

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectsList: [],
      userName: '',
      userType: 0,
      loading: false
    }
  }
  static navigationOptions = {
    tabBarLabel: '项目',
    tabBarIcon: ({ focused }) =>
      {
        if (focused) {
          return (
            <Image style={styles.tabBarIcon} source={require('../../images/nav_xm_do.png')}/>
          );
        }
        return (
          <Image style={styles.tabBarIcon} source={require('../../images/nav_xm.png')}/>
        );
      },
  }
  componentDidMount() {
    this.setState({
      loading: true
    })
    fetchRequest('/users/getUserMsg', 'GET').then(res => {
      if (res.code === 200) {
        this.setState({
          userName: res.data.name,
          userType: res.data.userType
        })
      } else if (res.code === -200) {
        ToastNative(res.message);
        
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
    fetchRequest('/projects/getProjList','GET').then(res => {
      if (res.code === 200) {
        this.setState({
          projectsList: res.data,
          loading: false
        })
      } else {
        this.setState({
          loading: false
        })
        ToastNative(res.message);
      }
    }).catch(err => {
      this.setState({
        loading: false
      })
      console.log(err)
    })
  }
  renderRow(obj, index) {
    return (
      <View style={[styles.cell, {backgroundColor:index % 2 === 0 ? '#FCAE29' : '#FCBA4A'}]}>
        <TouchableOpacity activeOpacity={1} onPress={() => {this.props.navigation.navigate('ProjDetail', {pId: obj.pId, projName: obj.pName, uType: this.state.userType})}}>
          <View style={{height: ScreenUtil.scaleSize(1300)}}>
            <View style={{alignItems: 'center'}}>
              <Image style={styles.projImage} source={{uri:obj.base64}}></Image>
            </View>
            
            <View style={styles.cardMsg}>
              <Text style={[styles.bigSize, styles.whiteColor]}>{obj.pName}</Text>
              <View style={styles.cardItem}>
                <Image style={styles.icon} source={require('../../images/icon_address.png')}></Image>
                <Text style={[styles.middleSize, styles.whiteColor]}>{obj.addrName}</Text>
              </View>
              <View style={styles.cardItem}>
                <Image style={styles.icon} source={require('../../images/icon_manager.png')}></Image>
                <Text style={[styles.middleSize, styles.whiteColor]}>{obj.pManager}</Text>
              </View>
              <View style={styles.cardItem}>
                <Image style={styles.icon} source={require('../../images/icon_phone.png')}></Image>
                <Text style={[styles.middleSize, styles.whiteColor]}>{obj.managerPhone}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground style={styles.bg} source={require('../../images/pj_bg.png')}>
          <Image style={styles.headImage} source={require('../../images/test/worker.png')} />
          <View style={styles.workerMsg}>
            <Text style={{color: '#efefef'}}>{this.state.userName}</Text>
          </View>
          {
            this.state.projectsList && this.state.projectsList.length > 0 ?
            (
              <View>
                <View>
                  <EZSwiper style={styles.ezsStyle}
                    dataSource={this.state.projectsList}
                    renderRow={this.renderRow.bind(this)}
                    width={ ScreenUtil.scaleSize(1080) }
                    height={ ScreenUtil.scaleSize(1300) }
                    cardParams={{cardSide:ScreenUtil.scaleSize(1080*0.846), cardSmallSide: ScreenUtil.scaleSize(1100),cardSpace:ScreenUtil.scaleSize(30)}}                 
                  />
                </View>
              </View>
            ) :
            (
              <View style={{alignItems:'center'}}>
                <Image style={styles.noLogo} source={require('../../images/warning_noProject.png')}/>
                <Text>暂无项目</Text>
              </View>
            )
          }
        </ImageBackground>
          <View style={styles.contentFindView}>
            <TouchableHighlight style={styles.findMoreView} onPress={() => {this.props.navigation.navigate('AddProj')}} >
              <View style={styles.findMore}>
                <FontAwesome name={'plus'} size={24} color={'white'}/>
              </View>
            </TouchableHighlight>
          </View>
        <View></View>
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
    alignItems: 'center'
  },
  bg: {
    width: ScreenUtil.scaleSize(1080),
    height :ScreenUtil.scaleSize(1920),
    alignItems: 'center'
  },
  bigSize: {
    fontSize: ScreenUtil.setSpText(24)
  },
  middleSize: {
    fontSize: ScreenUtil.setSpText(16)
  },
  whiteColor: {
    color: '#FFF'
  },
  cell: {
    backgroundColor: '#FCAE29',
    flex: 1
  },
  ezsStyle: {
    marginTop: ScreenUtil.scaleSize(65),
    width: ScreenUtil.scaleSize(1080),
    height: ScreenUtil.scaleSize(1300)
  },
  cardMsg: {
    marginLeft: ScreenUtil.scaleSize(40),
    marginTop: ScreenUtil.scaleSize(40),
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ScreenUtil.scaleSize(40)
  },
  projImage: {
    marginTop: ScreenUtil.scaleSize(45),
    width: ScreenUtil.scaleSize(820),
    height: ScreenUtil.scaleSize(520)
  },
  icon: {
    width: ScreenUtil.scaleSize(38),
    height: ScreenUtil.scaleSize(42),
    marginRight: ScreenUtil.scaleSize(20)
  },
  headImage: {
    width: ScreenUtil.scaleSize(187),
    height: ScreenUtil.scaleSize(183),
    marginTop: ScreenUtil.scaleSize(202),
    borderRadius: 50
  },
  noLogo: {
    width: ScreenUtil.scaleSize(622),
    height: ScreenUtil.scaleSize(390),
    marginTop: ScreenUtil.scaleSize(360),
    marginBottom: ScreenUtil.scaleSize(20)
  },
  workerMsg: {
    flexDirection: 'row',
    marginTop: ScreenUtil.scaleSize(50),
  },
  contentFindView: {
    position: "relative",
    top: -ScreenUtil.scaleSize(275),
    right: -ScreenUtil.scaleSize(435)
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
  tabBarIcon: {
    width: ScreenUtil.scaleSize(56),
    height: ScreenUtil.scaleSize(50),
  },
});

export default Projects;