import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, Image
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import * as ScreenUtil from '../../../lib/Px2dp';
import fetchRequest from '../../../lib/Fetch';
import Loading from '../../../components/Loading'

class Worker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pId: '',
      workerList: []
    }
  }
  static navigationOptions = ({navigation}) => {
    let pId = navigation.getParam('pId')
    return {
      headerTitle:(
        <Text style={{ flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
          项目工人
        </Text>
      ),
    }
  }
  componentWillMount() {  
    var pId = this.props.navigation.getParam('pId');
    var gId = this.props.navigation.getParam('gId')
    this.setState({
      pId, gId, loading:true
    })
    fetchRequest('/worker/getUsersByProj?pId='+ pId, 'GET').then(res => {
      if (res.code === 200) {
        this.setState({
          workerList: res.data,
          loading: false
        })
      } else {
        this.setState({
          loading: false
        })
      }
    }).catch(res => {
      this.setState({
        loading: false
      })
    })
  }
  render() {
    return (
      <View>
        <View>
          { this.state.workerList.map((worker, index) => (
            <TouchableOpacity
              key={index}
              onPress={()=>{this.props.navigation.navigate('WorkerMsg', {uId: worker.idUser, gId: this.state.gId, refresh: ()=>{this.props.navigation.state.params.refresh(); this.props.navigation.goBack();}})}}>
              <View style={styles.groupItem}>
                <Text style={styles.groupName}>{worker.name}</Text>
              </View>
            </TouchableOpacity>
          ))
          }
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
  noLogo: {
    width: ScreenUtil.scaleSize(684),
    height: ScreenUtil.scaleSize(321),
    marginTop: ScreenUtil.scaleSize(500),
    marginBottom: ScreenUtil.scaleSize(25)
  },
  groupItem: {
    height: ScreenUtil.scaleSize(140),
    paddingHorizontal: ScreenUtil.scaleSize(40),
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupName: {
    fontSize: ScreenUtil.setSpText(16)
  }
})

export default Worker;