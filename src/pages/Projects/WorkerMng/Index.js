import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, Image
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather'

import * as ScreenUtil from '../../../lib/Px2dp';
import fetchRequest from '../../../lib/Fetch';
import Loading from '../../../components/Loading';
import ToastNative from '../../../components/Toast'

class WorkerMng extends Component {
  static navigationOptions = ({navigation, screenProps}) => {
    return {
      headerTitle:(
        <Text style={{flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
          工人管理
        </Text>
      ),
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
      pId: '',
      uType: ''
    }
  }
  init() {
    var pId = this.props.navigation.getParam('pId')
    var uType = this.props.navigation.getParam('uType')
    var column1 = [], column2 = [], column3 = [], column4 = [];
    var user = []
    this.setState({
      loading: true
    })
    fetchRequest('/worker/getUsersByProj?pId='+ pId, 'GET').then(res => {
      if (res.code === 200) {
        user = res.data
        this.setState({
          user: res.data,
          loading: false
        })
        user.sort((a, b) => {
          if(a.uType === 1) return -1;
          else return 1
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
  }
  componentWillMount() {
    this.setState({
      pId: this.props.navigation.getParam('pId'),
      uType: this.props.navigation.getParam('uType')
    })
    console.log(this.props.navigation.getParam('uType'))
    this.init()
  }
  render() {
    return (
      <View>
        <View>
          <View style={styles.content}>
            <View style={styles.column}>
              { this.state.column1.map((field, index) => (
                <TouchableOpacity  key={index} onPress={() => {this.props.navigation.navigate('WorkerDetail', {id: field.id, uId: field.idUser, uType: this.state.uType, refresh: ()=>this.init()})}}>
                  <View style={styles.border}>
                    { field.photoPath ? (
                      <Image style={styles.pic} source={{uri:field.photoPath}}></Image>
                      ) : (
                        <Image style={styles.pic} source={require('../../../images/test/worker.png')}></Image>
                        )}
                    <View style={{flexDirection:"row", justifyContent:'center', alignItems: 'center'}}>
                      { field.uType === 1 ?
                        <View style={styles.circle}></View> :
                        null
                      }
                      <Text>{field.name}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )) }
              {
                this.state.user.length % 4 === 0  && this.state.uType === 1 ?
                (
                  <TouchableOpacity onPress={()=>{this.props.navigation.navigate('CodeCamera',{pId: this.props.navigation.getParam('pId'), refresh: ()=>this.init()})}}>
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
                <TouchableOpacity key={index} onPress={() => {this.props.navigation.navigate('WorkerDetail', {id: field.id, uId: field.idUser, uType: this.state.uType, refresh: ()=>this.init()})}}>
                <View style={styles.border}>
                  { field.photoPath ? (
                    <Image style={styles.pic} source={{uri:field.photoPath}}></Image>
                    ) : (
                      <Image style={styles.pic} source={require('../../../images/test/worker.png')}></Image>
                      )}
                  <View style={{flexDirection:"row", justifyContent:'center', alignItems: 'center'}}>
                      { field.uType === 1 ?
                        <View style={styles.circle}></View> :
                        null
                      }
                      <Text>{field.name}</Text>
                    </View>
                </View>
                </TouchableOpacity>
              )) }
              {
                this.state.user.length % 4 === 1  && this.state.uType === 1 ?
                (
                  <TouchableOpacity onPress={()=>{this.props.navigation.navigate('CodeCamera',{pId: this.props.navigation.getParam('pId'), refresh: ()=>this.init()})}}>
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
                <TouchableOpacity key={index} onPress={() => {this.props.navigation.navigate('WorkerDetail', {id: field.id, uId: field.idUser, uType: this.state.uType, refresh: ()=>this.init()})}}>
                <View style={styles.border} key={index}>
                  { field.photoPath ? (
                    <Image style={styles.pic} source={{uri:field.photoPath}}></Image>
                    ) : (
                      <Image style={styles.pic} source={require('../../../images/test/worker.png')}></Image>
                      )}
                  <View style={{flexDirection:"row", justifyContent:'center', alignItems: 'center'}}>
                      { field.uType === 1 ?
                        <View style={styles.circle}></View> :
                        null
                      }
                      <Text>{field.name}</Text>
                    </View>
                </View>
                </TouchableOpacity>
              )) }
              {
                this.state.user.length % 4 === 2  && this.state.uType === 1 ? 
                (
                  <TouchableOpacity onPress={()=>{this.props.navigation.navigate('CodeCamera',{pId: this.props.navigation.getParam('pId'), refresh: ()=>this.init()})}}>
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
                <TouchableOpacity key={index} onPress={() => {this.props.navigation.navigate('WorkerDetail', {id: field.id, uId: field.idUser, uType: this.state.uType, refresh: ()=>this.init()})}}>
                <View style={styles.border}>
                  { field.photoPath ? (
                    <Image style={styles.pic} source={{uri:field.photoPath}}></Image>
                    ) : (
                      <Image style={styles.pic} source={require('../../../images/test/worker.png')}></Image>
                      )}
                  <View style={{flexDirection:"row", justifyContent:'center', alignItems: 'center'}}>
                      { field.uType === 1 ?
                        <View style={styles.circle}></View> :
                        null
                      }
                      <Text>{field.name}</Text>
                    </View>
                </View>
                </TouchableOpacity>
              )) }
              {
                this.state.user.length % 4 === 3  && this.state.uType === 1 ?
                (
                  <TouchableOpacity onPress={()=>{this.props.navigation.navigate('CodeCamera',{pId: this.props.navigation.getParam('pId'), refresh: ()=>this.init()})}}>
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
  circle: {
    width: ScreenUtil.scaleSize(20),
    height: ScreenUtil.scaleSize(20),
    backgroundColor: '#fcae29',
    borderRadius: 50
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

export default WorkerMng;