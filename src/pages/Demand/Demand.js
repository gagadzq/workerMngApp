import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Image, TouchableHighlight, TouchableOpacity
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import * as ScreenUtil from '../../lib/Px2dp';
import fetchRequest from '../../lib/Fetch';
import ToastNative from '../../components/Toast'


class Demand extends Component {
  constructor(props) {
    super(props)
    this.state = ({
      pageType: 0,
      unList: [],
      havePriceList: [],
      finishedList: [],
      priceList: []
    })
  }
  changePage(type) {
    this.setState({
      pageType: type
    })
    switch(type) {
      case 0 : this.getNewDemand();break;
      case 1 : this.getQuotedList();break;
      case 2 : this.getFinishedDemand();break;
      default: break;
    }
  }
  getNewDemand() {
    fetchRequest('/demand/getDemand?status=0', 'GET').then(res => {
      if (res.code === 200) {
        this.setState({
          unList: res.data
        })
      } else {
        ToastNative('获取失败')
      }
    }).catch(err => {
      console.log(err)
    })
  }
  getQuotedList() {
    fetchRequest('/demand/getDemand?status=1', 'GET').then(res => {
      if (res.code === 200) {
        this.setState({
          havePriceList: res.data
        })
      } else {
        ToastNative('获取失败')
      }
    }).catch(err => {
      console.log(err)
    })
  }
  getFinishedDemand() {
    fetchRequest('/demand/getDemand?status=2', 'GET').then(res => {
      if (res.code === 200) {
        this.setState({
          finishedList: res.data
        })
        fetchRequest('/demand/getOrderPrice', 'GET').then(res => {
          if (res.code === 200) {
            this.setState({
              priceList: res.data
            })
          }
        })
      } else {
        ToastNative('获取失败')
      }
    }).catch(err => {
      console.log(err)
    })
  }
  init() {
    this.getNewDemand()
  }
  componentWillMount(){
    this.init()   
  }
  render() {
    var page = null
    switch(this.state.pageType) {
      case 0: {
        page = (
          <View>
            {this.state.unList.map((item, index) => (
              <View style={styles.dRow} key={index}>
                <View>
                  <Text style={styles.name}>{item.demandName}</Text>
                  <Text>{item.dealDate.substring(0,10)}</Text>
                </View>
                <View>
                  <Text style={styles.number}>{item.demandNumber}{item.demandUnit}</Text>
                </View>
              </View>
            ))}
          </View>
        )
        break;
      }
      case 1: {
        page = (
          <View>
            {this.state.havePriceList.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('QuotedList', {dId: item.id})}>
                <View style={styles.dRow} >
                  <View>
                    <Text style={styles.name}>{item.demandName}</Text>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                      <Text style={styles.numberTwo}>{item.demandNumber} {item.demandUnit}</Text>
                      <Text>{item.dealDate.substring(0,10)}</Text>
                    </View>
                  </View>
                  <View>
                    <FontAwesome name={'chevron-right'} size={14} color={'#bbb'}/>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )
        break;
      }
      case 2: {
        page = (
          <View>
            {this.state.finishedList.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('QuotedList', {dId: item.id})}>
                <View style={styles.dRow}>
                  <View>
                    <Text style={styles.name}>{item.demandName}</Text>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                      <Text style={[styles.numberTwo, {color: '#689cf5'}]}>{item.demandNumber} {item.demandUnit}</Text>
                      <Text>{item.dealDate.substring(0,10)}</Text>
                    </View>
                  </View>
                  {
                    this.state.priceList.map((price,pdex) => {
                      if (price.idDemand === item.id) {
                        return(
                          <View key={pdex}>
                            <Text style={styles.price}>{price.price}</Text>
                          </View>
                        )
                      }
                    })
                  }     
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )
        break;
      }
      default: break;
    }
    return (
      <View style={styles.container}>
        <View style={styles.switch}>
          <TouchableOpacity onPress={this.changePage.bind(this, 0)}>
            <View style={this.state.pageType === 0 ? [styles.switchBtn, styles.activeBtn] : styles.switchBtn}>
              <Text style={this.state.pageType === 0 ? styles.activeText : styles.switchText}>未报价</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.changePage.bind(this, 1)}>
            <View style={this.state.pageType === 1 ? [styles.switchBtn, styles.activeBtn] : styles.switchBtn}>
              <Text style={this.state.pageType === 1 ? styles.activeText : styles.switchText}>已报价</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.changePage.bind(this, 2)}>
            <View style={this.state.pageType === 2 ? [styles.switchBtn, styles.activeBtn] : styles.switchBtn}>
              <Text style={this.state.pageType === 2 ? styles.activeText : styles.switchText}>已完成</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          {page}
        </View>
        {
          this.state.pageType === 0 ? (
            <View style={styles.contentFindView}>
              <TouchableHighlight style={styles.findMoreView} onPress={() => {this.props.navigation.navigate('AddDemand',{refresh: ()=>this.init()})}} >
                <View style={styles.findMore}>
                  <FontAwesome name={'plus'} size={24} color={'white'}/>
                </View>
              </TouchableHighlight>
            </View>
          ) : null
        }
       
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
    marginHorizontal:  ScreenUtil.scaleSize(40),
    height: ScreenUtil.scaleSize(180),
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  name: {
    fontSize: ScreenUtil.setSpText(18)
  },
  number: {
    fontSize: ScreenUtil.setSpText(18),
    color: '#fcae29'
  },
  numberTwo: {
    marginRight: ScreenUtil.scaleSize(20),
    fontSize: ScreenUtil.setSpText(18),
    color: '#fcae29'
  },
  price: {
    fontSize: ScreenUtil.setSpText(20),
    color: '#fda50e'
  },
  switch: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: ScreenUtil.scaleSize(40),
    backgroundColor: '#fbfbfb'
  },
  switchBtn: {
    width: ScreenUtil.scaleSize(190),
    height: ScreenUtil.scaleSize(100),
    justifyContent: 'center',
    alignItems: 'center'
  },
  activeBtn: {
    borderBottomWidth: 2,
    borderBottomColor: '#689cf5',
  },
  switchText: {
    fontSize: ScreenUtil.setSpText(16),
    color: '#888'
  },
  activeText:{
    fontSize: ScreenUtil.setSpText(16),
    color: '#000'
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

export default Demand;