import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Image, TouchableHighlight, TouchableOpacity
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import * as ScreenUtil from '../../lib/Px2dp';
import Form from '../../components/Form/Form'
import fetchRequest from '../../lib/Fetch';
import ToastNative from '../../components/Toast'

class QuotedDetail extends Component {
  constructor(props) {
    super(props)
    this.state = ({
      dId: '',
      qId: '',
      demandDetail: {},
      QuotedDetail: {}
    })
  }
  static navigationOptions = ({navigation, screenProps}) => {
    return {
      headerTitle:(
        <Text style={{flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
          报价详情
        </Text>
      ),
    }
  }
  toOrder() {
    const {qId, dId} = this.state
    const params = {qId, dId}
    fetchRequest('/demand/toOrder', 'POST', params).then(res => {
      if (res.code === 200) {
        ToastNative('交易成功')
        this.props.navigation.state.params.refresh();
        this.props.navigation.goBack();
      } else {
        ToastNative('交易失败')
      }
    })
  }
  componentWillMount(){
    const dId = this.props.navigation.getParam('dId')
    const qId = this.props.navigation.getParam('qId')
    this.setState({dId, qId})
    fetchRequest('/demand/getDemandDetail?dId='+dId, 'GET').then(res => {
      if (res.code === 200) {
        this.setState({
          demandDetail: res.data
        })
      } else {
        ToastNative('获取失败')
      }
    }).catch(err => {
      console.log(err)
    })
    fetchRequest('/demand/getQuotedDetail?id='+qId, 'GET').then(res => {
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
  render() {
    const {demandDetail, QuotedDetail} = this.state;
    return(
      <View style={styles.container}>
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
        </View>
        <View style={styles.demand}>
          <View style={styles.demandRow}>
            <Text style={styles.textTitle}>供应商：</Text>
            <Text style={styles.textContaint}>{QuotedDetail.supplierName}</Text>
          </View>
          <View style={styles.demandRow}>
            <Text style={styles.textTitle}>供应商联系方式：</Text>
            <Text style={styles.textContaint}>{QuotedDetail.supplierPhone}</Text>
          </View>
          <View style={styles.demandRow}>
            <Text style={styles.textTitle}>报价：</Text>
            <Text style={styles.price}>{QuotedDetail.price}</Text>
          </View>
        </View>
        <View>
          <TouchableOpacity style={styles.btn} onPress={this.toOrder.bind(this)}>
            <Text style={styles.btnText}>完成交易</Text>
          </TouchableOpacity>
        </View>
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
  company: {
    fontSize: ScreenUtil.setSpText(18),
    marginBottom: ScreenUtil.scaleSize(16),
    color: '#444'
  },
  price: {
    fontSize: ScreenUtil.setSpText(20),
    color: '#fda50e'
  },
  btn: {
    marginTop: ScreenUtil.scaleSize(40),
    marginHorizontal: ScreenUtil.scaleSize(40),
    height: ScreenUtil.scaleSize(120),
    backgroundColor: '#56A3EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  btnText: {
    fontSize: ScreenUtil.setSpText(18),
    color: '#fff'
  }
});

export default QuotedDetail;