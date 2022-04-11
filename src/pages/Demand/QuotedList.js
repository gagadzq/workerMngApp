import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Image, TouchableOpacity, ScrollView
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import * as ScreenUtil from '../../lib/Px2dp';
import Form from '../../components/Form/Form'
import fetchRequest from '../../lib/Fetch';
import ToastNative from '../../components/Toast'

class QuotedList extends Component {
  constructor(props) {
    super(props)
    this.state = ({
      dId: '',
      demandDetail: {},
      QuotedDetail: [],
      order: {},
      star: require('../../images/icon_star.png'),
      starAl: require('../../images/icon_star_do.png'),
    })
  }
  static navigationOptions = ({navigation, screenProps}) => {
    return {
      headerTitle:(
        <Text style={{flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
          报价列表
        </Text>
      ),
    }
  }
  init(){
    const dId = this.props.navigation.getParam('dId')
    this.setState({dId})
    var orderQuoted = ''
    fetchRequest('/demand/getDemandDetail?dId='+dId, 'GET').then(res => {
      if (res.code === 200) {
        this.setState({
          demandDetail: res.data
        })
        if (res.data.status === 2) {
          fetchRequest('/demand/getOrderDetail?dId='+dId, 'GET').then(res => {
            if (res.code === 200) {
              this.setState({
                order: res.data
              })
              orderQuoted = res.data.idQuoted
            }
          })
        }
      } else {
        ToastNative('获取失败')
      }
    }).catch(err => {
      console.log(err)
    })
    fetchRequest('/demand/getQuotedList?dId='+dId, 'GET').then(res => {
      if (res.code === 200) {
        this.setState({
          QuotedDetail: res.data
        })
      } else {
        ToastNative('获取失败')
      }
    }).catch(err => {
      console.log(err)
    })
  }
  componentWillMount(){
    this.init()
  }
  render() {
    const {demandDetail, QuotedDetail, order, starAl, star} = this.state;
    const {qualityScore, serverScore, totalScore} = this.state.order
    var quality= [], server = [], total=[]
    for(let i = 0; i < qualityScore; i++) {
      quality.push(
        <Image style={styles.starIcon} source={starAl}></Image>
      ) 
    }
    for(let j = qualityScore; j < 5; j++) {
      quality.push(
          <Image style={styles.starIcon} source={star}></Image>
      )
    }
    for(let i = 0; i < serverScore; i++) {
      server.push(
          <Image style={styles.starIcon} source={starAl}></Image>
      ) 
    }
    for(let j = serverScore; j < 5; j++) {
      server.push(
          <Image style={styles.starIcon} source={star}></Image>
      )
    }
    for(let i = 0; i < totalScore; i++) {
      total.push(
          <Image style={styles.starIcon} source={starAl}></Image>
      ) 
    }
    for(let j = totalScore; j < 5; j++) {
      total.push(
          <Image style={styles.starIcon} source={star}></Image>
      )
    }
    return(
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.demand}>
            <View style={styles.demandRow}>
              <Text style={styles.textTitle}>材料名称：</Text>
              <Text style={styles.textContaint}>{demandDetail.demandName}</Text>
            </View>
            <View style={styles.demandRow}>
              <Text style={styles.textTitle}>材料规格：</Text>
              <Text style={styles.textContaint}>{demandDetail.demandNumber}</Text>
              <Text style={styles.textContaint}>{demandDetail.demandUnit}</Text>
            </View>
            <View style={styles.demandRow}>
              <Text style={styles.textTitle}>交付时间：</Text>
              <Text style={styles.textContaint}>{demandDetail.dealDate ? demandDetail.dealDate.substring(0,10): null}</Text>
            </View>
            <View style={styles.demandRow}>
              <Text style={styles.textTitle}>发起人：</Text>
              <Text style={styles.textContaint}>{demandDetail.name}</Text>
            </View>
            {
              order.idOrder ? (
                <View>
                  {
                    demandDetail.status === 2 && order.totalScore ?
                    (
                      <View>
                        <View style={styles.demandRow}>
                          <Text style={styles.textTitle}>材料质量：</Text>
                          {quality}
                        </View>
                        <View style={styles.demandRow}>
                          <Text style={styles.textTitle}>服务态度：</Text>
                          {server}
                        </View>
                        <View style={styles.demandRow}>
                          <Text style={styles.textTitle}>总体评价：</Text>
                          {total}
                        </View>
      
                      </View>
                    ) : (
                      <TouchableOpacity style={styles.demandRow} onPress={()=> this.props.navigation.navigate('Access', {oId: order.idOrder, refresh: ()=>this.init()})}>
                        <Text style={styles.accessText}>本次交易满意度如何？立即评价</Text>
                      </TouchableOpacity>
                    )
                  } 
                </View>
              ) : null
            }
            
            {
              demandDetail.status === 2 && order.totalScore ?
              (
                <View style={styles.demandRow}>
                  <Text style={styles.textTitle}>评价：</Text>
                  <Text style={styles.textContaint}>{order.assessment}</Text>
                </View>
              ) : null
            }
          </View>
          <View>
            <View>
              {QuotedDetail.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('QuotedDetail', {qId: item.id, dId: this.state.dId, refresh: () => this.init()})}>
                  <View style={styles.QuotedRow}>
                    <View style={styles.QuotedLeft}>
                      <Text style={styles.company}>{item.supplierName}</Text>
                      <Text style={styles.phone}>{item.supplierPhone}</Text>
                    </View>
                    <View style={styles.QuotedRight}>
                      {
                        item.id === order.idQuoted ?
                        (
                          <Image style={styles.iconDeal} source={require('../../images/icon_deal.png')}></Image>
                        ) : null
                      }
                      <Text style={styles.price}>{item.price}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              <View></View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: ScreenUtil.scaleSize(40)
  },
  demand: {
    marginTop: ScreenUtil.scaleSize(60),
    paddingLeft: ScreenUtil.scaleSize(60),
    paddingBottom: ScreenUtil.scaleSize(40),
    borderBottomWidth: 5,
    borderBottomColor: '#f1f1f1',
  },
  demandRow: {
    flexDirection: 'row',
    height: ScreenUtil.scaleSize(120),
    alignItems: 'center',
  },
  textContaint: {
    fontSize: ScreenUtil.setSpText(18),
    color: '#111'
  },
  starIcon: {
    width: ScreenUtil.scaleSize(60),
    height: ScreenUtil.scaleSize(60),
    marginRight: ScreenUtil.scaleSize(10)
  },
  textTitle: {
    fontSize: ScreenUtil.setSpText(16),
    color: '#aaa'
  },
  QuotedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: ScreenUtil.scaleSize(180),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  QuotedRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  company: {
    fontSize: ScreenUtil.setSpText(18),
    marginBottom: ScreenUtil.scaleSize(16),
    color: '#444'
  },
  price: {
    fontSize: ScreenUtil.setSpText(20),
    color: '#fda50e'
  },
  accessText: {
    fontSize: ScreenUtil.setSpText(18),
    color: '#7EABF4'
  },
  iconDeal: {
    width: ScreenUtil.scaleSize(120),
    height: ScreenUtil.scaleSize(120),
  }
});

export default QuotedList;