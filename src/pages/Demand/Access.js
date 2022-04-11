import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Image, TextInput, TouchableOpacity
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import * as ScreenUtil from '../../lib/Px2dp';
import Form from '../../components/Form/Form'
import fetchRequest from '../../lib/Fetch';
import ToastNative from '../../components/Toast'

class Access extends Component {
  constructor(props) {
    super(props)
    this.state = ({
      oId: '',
      star: require('../../images/icon_star.png'),
      starAl: require('../../images/icon_star_do.png'),
      qualityScore: 0,
      serverScore: 0,
      totalScore: 0,
      accessValue:'',
    })
  }
  static navigationOptions = ({navigation, screenProps}) => {
    return {
      headerTitle:(
        <Text style={{flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
          交易评价
        </Text>
      ),
    }
  }
  clickAccess() {
    var {qualityScore, serverScore, totalScore, accessValue, oId} = this.state
    var formValue = {
      qualityScore, serverScore, totalScore, accessValue, oId
    }
    if (qualityScore == 0 || totalScore == 0 ) {
      ToastNative('请对材料质量进行评分')
    } else if(serverScore == 0) {
      ToastNative('请对交易服务进行评分')
    } else if(totalScore == 0) {
      ToastNative('请对整体交易进行评分')
    } else {
      fetchRequest('/demand/access', 'POST', formValue).then(res => {
        if (res.code === 200) {
          this.props.navigation.state.params.refresh();
          this.props.navigation.goBack();
        } else {
          ToastNative('评价失败')
        }
      })
    }
  }
  componentWillMount(){
    const oId = this.props.navigation.getParam('oId')
    this.setState({oId})
  }
  render() {
    //const {demandDetail, QuotedDetail} = this.state;
    const {star, starAl, qualityScore, serverScore, totalScore} = this.state
    var quality= [], server = [], total=[]
    for(let i = 0; i < qualityScore; i++) {
      quality.push(
        <TouchableOpacity onPress={()=>this.setState({qualityScore: i+1})}>
          <Image style={styles.starIcon} source={starAl}></Image>
        </TouchableOpacity>
      ) 
    }
    for(let j = qualityScore; j < 5; j++) {
      quality.push(
        <TouchableOpacity onPress={()=>this.setState({qualityScore: j+1})}>
          <Image style={styles.starIcon} source={star}></Image>
        </TouchableOpacity>
      )
    }
    for(let i = 0; i < serverScore; i++) {
      server.push(
        <TouchableOpacity onPress={()=>this.setState({serverScore: i+1})}>
          <Image style={styles.starIcon} source={starAl}></Image>
        </TouchableOpacity>
      ) 
    }
    for(let j = serverScore; j < 5; j++) {
      server.push(
        <TouchableOpacity onPress={()=>this.setState({serverScore: j+1})}>
          <Image style={styles.starIcon} source={star}></Image>
        </TouchableOpacity>
      )
    }
    for(let i = 0; i < totalScore; i++) {
      total.push(
        <TouchableOpacity onPress={()=>this.setState({totalScore: i+1})}>
          <Image style={styles.starIcon} source={starAl}></Image>
        </TouchableOpacity>
      ) 
    }
    for(let j = totalScore; j < 5; j++) {
      total.push(
        <TouchableOpacity onPress={()=>this.setState({totalScore: j+1})}>
          <Image style={styles.starIcon} source={star}></Image>
        </TouchableOpacity>
      )
    }
    return(
      <View style={styles.container}>
        <View style={styles.score}>
          <View style={styles.row}>
            <Text style={styles.title}>材料质量</Text>
            <View style={styles.starRow}>
              {quality}
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>服务态度</Text>
            <View style={styles.starRow}>
              {server}
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>总体评价</Text>
            <View style={styles.starRow}>
              {total}
            </View>
          </View>
        </View>
        <View>
          <TextInput style={styles.inputTextStyle}
            multiline={true}
            placeholder={'最终交易满足需求吗？分享交易评价'}
            paddingVertical={0}
            selectionColor = {'#b2b2b2'}
            textAlignVertical={'top'}
            placeholderTextColor={'#b2b2b2'}
            underlineColorAndroid={'transparent'}
            maxLength={1000}
            value={this.state.accessValue}
            onChangeText={value => {
              this.setState({accessValue: value})
            }}
          />
        </View>
        <TouchableOpacity style={styles.btn} onPress={this.clickAccess.bind(this)}>
            <Text style={styles.btnText}>完成评价</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: ScreenUtil.scaleSize(40)
  },
  row: {
    flexDirection: 'row',
    height: ScreenUtil.scaleSize(120),
    alignItems: 'center',
  },
  title: {
    fontSize: ScreenUtil.setSpText(16),
    marginRight: ScreenUtil.scaleSize(50),
  },
  starRow: {
    flexDirection: 'row'
  },
  score: {
    marginTop: ScreenUtil.scaleSize(40),
    paddingBottom: ScreenUtil.scaleSize(40),
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
  },
  starIcon: {
    width: ScreenUtil.scaleSize(70),
    height: ScreenUtil.scaleSize(70),
    marginRight: ScreenUtil.scaleSize(10)
  },
  inputTextStyle: {
    fontSize: ScreenUtil.setSpText(16),
    width: '100%',
    color: '#444',
    minHeight: ScreenUtil.scaleSize(600),
    paddingBottom: 30,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
  },
  btn: {
    width: '100%',
    height: ScreenUtil.scaleSize(120),
    marginTop: ScreenUtil.scaleSize(60),
    backgroundColor: '#56A3EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  btnText: {
    color: '#fff',
    fontSize: ScreenUtil.setSpText(18)
  }
});

export default Access;