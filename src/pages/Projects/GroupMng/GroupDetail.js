import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, Image
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather'

import * as ScreenUtil from '../../../lib/Px2dp';
import fetchRequest from '../../../lib/Fetch';
import Loading from '../../../components/Loading';
import ToastNative from '../../../components/Toast'

class GroupDetail extends Component {
  static navigationOptions = ({navigation, screenProps}) => {
    var uType = navigation.getParam('uType')
    if(uType === 1) {
      return {
        headerTitle:(
          <Text style={{flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
            {navigation.getParam('gName')}
          </Text>
        ),
        headerRight:(
          <TouchableOpacity onPress={() => {navigation.navigate('AlterGroup', {gId: navigation.getParam('gId'), back: ()=>navigation.state.params.navigateGoBack()})}}>
            <View style={{marginRight: ScreenUtil.scaleSize(26)}}>
              <Feather name={'edit-3'} size={20} color={'white'}/>
            </View>
          </TouchableOpacity>
        ),
      }
    } else {
      return {
        headerTitle:(
          <Text style={{flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
            {navigation.getParam('gName')}
          </Text>
        ),
        headerRight:(
          <View/>
        ),
      }
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      column1: [],
      column2: [],
      column3: [],
      column4: [],
      user: [],
      loading: false,
      gId: '',
      pId: '',
      uType:0,
      gUtype:0
    }
  }
  goBack() {
    this.props.navigation.state.params.refresh();
    this.props.navigation.goBack();
  }
  init() {
    var gId = this.props.navigation.getParam('gId')
    var column1 = [], column2 = [], column3 = [], column4 = [];
    var user = []
    this.setState({
      loading: true
    })
    fetchRequest('/group/getWorkersByGroup?gId='+ gId, 'GET').then(res => {
      if (res.code === 200) {
        user = res.data
        this.setState({
          user: res.data,
          loading: false
        })
        user.forEach((value, index) => {
          switch((index + 1) % 4) {
            case 1: column1.push(value); break;
            case 2: column2.push(value); break;
            case 3: column3.push(value); break;
            case 0: column4.push(value); break;
            default: break;
          }
        })
        this.setState({
          column1,column2,column3,column4
        })
      } else {
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
    fetchRequest('/group/getWorkerAuthen?gId='+gId, 'GET').then(res => {
      if (res.code === 200) {
        this.setState({
          gUtype: res.data.uType
        })
      } else {
      }
    }).catch(err => {
    })
  }
  componentWillMount() {
    this.setState({
      gId: this.props.navigation.getParam('gId'),
      pId: this.props.navigation.getParam('pId'),
      uType: this.props.navigation.getParam('uType'),
    })
    this.props.navigation.setParams({navigateGoBack:this.goBack.bind(this)})
    this.init()
  }
  render() {
    return (
      <View>
        <View>
          <View style={styles.content}>
            <View style={styles.column}>
              { this.state.column1.map((field, index) => (
                <TouchableOpacity onPress={() => {this.props.navigation.navigate('GWorkerMng', {id: field.id, uId: field.idUser, refresh: ()=>this.init()})}}>
                  <View style={styles.border} key={index}>
                    { field.photoPath ? (
                      <Image style={styles.pic} source={{uri:field.photoPath}}></Image>
                      ) : (
                        <Image style={styles.pic} source={require('../../../images/test/worker.png')}></Image>
                        )}
                    <Text>{field.name}</Text>
                  </View>
                </TouchableOpacity>
              )) }
              {
                this.state.user.length % 4 === 0 && (this.state.uType === 1 || this.state.gUtype === 1) ?
                (
                  <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Worker',{pId: this.state.pId, gId: this.state.gId, refresh: ()=>this.init()})}}>
                    <View style={styles.border}>
                      <View style={styles.cub}>
                        <Feather name={'plus'} size={18} color={'#ccc'}/>
                      </View>
                      <Text>添加</Text>
                    </View>
                  </TouchableOpacity>
                ) : null
              }
            </View>
            <View style={styles.column}>
              { this.state.column2.map((field, index) => (
                <TouchableOpacity onPress={() => {this.props.navigation.navigate('GWorkerMng', {id: field.id, uId: field.idUser, refresh: ()=>this.init()})}}>
                <View style={styles.border} key={index}>
                  { field.photoPath ? (
                    <Image style={styles.pic} source={{uri:field.photoPath}}></Image>
                    ) : (
                      <Image style={styles.pic} source={require('../../../images/test/worker.png')}></Image>
                      )}
                  <Text>{field.name}</Text>
                </View>
                </TouchableOpacity>
              )) }
              {
                this.state.user.length % 4 === 1 && (this.state.uType === 1 || this.state.gUtype === 1) ?
                (
                  <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Worker',{pId: this.props.navigation.getParam('pId'), refresh: ()=>this.init()})}}>
                    <View style={styles.border}>
                      <View style={styles.cub}>
                        <Feather name={'plus'} size={18} color={'#ccc'}/>
                      </View>
                      <Text>添加</Text>
                    </View>
                  </TouchableOpacity>
                ) : null
              }
            </View>
            <View style={styles.column}>
              { this.state.column3.map((field, index) => (
                <TouchableOpacity onPress={() => {this.props.navigation.navigate('GWorkerMng', {id: field.id, uId: field.idUser, refresh: ()=>this.init()})}}>
                <View style={styles.border} key={index}>
                  { field.photoPath ? (
                    <Image style={styles.pic} source={{uri:field.photoPath}}></Image>
                    ) : (
                      <Image style={styles.pic} source={require('../../../images/test/worker.png')}></Image>
                      )}
                  <Text>{field.name}</Text>
                </View>
                </TouchableOpacity>
              )) }
              {
                this.state.user.length % 4 === 2 && (this.state.uType === 1 || this.state.gUtype === 1) ?
                (
                  <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Worker',{pId: this.props.navigation.getParam('pId'), refresh: ()=>this.init()})}}>
                    <View style={styles.border}>
                      <View style={styles.cub}>
                        <Feather name={'plus'} size={18} color={'#ccc'}/>
                      </View>
                      <Text>添加</Text>
                    </View>
                  </TouchableOpacity>
                ) : null
              }
            </View>
            <View style={styles.column}>
              { this.state.column4.map((field, index) => (
                <TouchableOpacity onPress={() => {this.props.navigation.navigate('GWorkerMng', {id: field.id, uId: field.idUser, refresh: ()=>this.init()})}}>
                <View style={styles.border} key={index}>
                  { field.photoPath ? (
                    <Image style={styles.pic} source={{uri:field.photoPath}}></Image>
                    ) : (
                      <Image style={styles.pic} source={require('../../../images/test/worker.png')}></Image>
                      )}
                  <Text>{field.name}</Text>
                </View>
                </TouchableOpacity>
              )) }
              {
                this.state.user.length % 4 === 3 && (this.state.uType === 1 || this.state.gUtype === 1) ?
                (
                  <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Worker',{pId: this.props.navigation.getParam('pId'), refresh: ()=>this.init()})}}>
                    <View style={styles.border}>
                      <View style={styles.cub}>
                        <Feather name={'plus'} size={18} color={'#ccc'}/>
                      </View>
                      <Text>添加</Text>
                    </View>
                  </TouchableOpacity>
                ) : null
              }
            </View>
          </View>
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
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: ScreenUtil.scaleSize(40),
    marginTop: ScreenUtil.scaleSize(60),
  },
  column: {
    width: '25%',
  },
  border: {
    marginBottom: ScreenUtil.scaleSize(40),
    alignItems: 'center',
  },
  cub: {
    width: ScreenUtil.scaleSize(150),
    height: ScreenUtil.scaleSize(150),
    marginBottom: ScreenUtil.scaleSize(10),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efefef'
  },
  pic: {
    width: ScreenUtil.scaleSize(150),
    height: ScreenUtil.scaleSize(150),
    marginBottom: ScreenUtil.scaleSize(10),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  }
})

export default GroupDetail;