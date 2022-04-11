import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, Image
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import * as ScreenUtil from '../../../lib/Px2dp';
import fetchRequest from '../../../lib/Fetch';
import Loading from '../../../components/Loading'

class GroupMng extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pId: '',
      groupsList: []
    }
  }
  static navigationOptions = ({navigation}) => {
    let pId = navigation.getParam('pId')
    let uType = navigation.getParam('uType')
    if (uType === 1) {
      return {
        headerTitle:(
          <Text style={{ flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
            班组管理
          </Text>
        ),
        headerRight:(
          <TouchableOpacity onPress={() => {navigation.navigate('AddGroup', {pId, refresh: ()=>navigation.state.params.navigateRefresh()})}}>
            <View style={{marginRight: ScreenUtil.scaleSize(26)}}>
              <Feather name={'plus'} size={22} color={'white'}/>
            </View>
          </TouchableOpacity>
        ),
      }
    } else {
      return {
        headerTitle:(
          <Text style={{ flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
            班组管理
          </Text>
        ),
        headerRight:(
          <View/>
        ),
      }
    }
  }
  init() {
    this.setState({
      loading: true,
      pId: this.props.navigation.getParam('pId'),
      uType: this.props.navigation.getParam('uType'),
    });
    const pId = this.props.navigation.getParam('pId')
/*     const pId = 5 */
    fetchRequest('/group/getGroupsByProj?pId=' + pId, 'GET').then(res => {
      if (res.code === 200) {
        this.setState({
          loading: false,
          groupsList: res.data
        });
      } else {
        this.setState({
          loading: false
        });
      }
    }).catch(err => {
      console.log(err)
      this.setState({
        loading: false
      });
    })
  }
  componentWillMount() {  
    this.props.navigation.setParams({navigateRefresh:this.init.bind(this)})
    this.init()
  }
  render() {
    return (
      <View>
        <View></View>
        {
            this.state.groupsList && this.state.groupsList.length > 0 ?
            (
              <View>
                { this.state.groupsList.map((group, index) => (
                  <TouchableOpacity  key={index} onPress={()=>{this.props.navigation.navigate('GroupDetail', {gId: group.groupId, pId:5, gName: group.groupName, uType: this.state.uType, refresh:()=>{this.init()}})}}>
                    <View style={styles.groupItem}>
                      <Text style={styles.groupName}>{group.groupName}</Text>
                      <View>
                        <Feather name={'chevron-right'} size={20} color={'#ccc'}/>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
                }
              </View>
            ) : 
            (
              <View style={{alignItems:'center'}}>
                <Image style={styles.noLogo} source={require('../../../images/warning-noGroups.png')}/>
                <Text>暂无班组</Text>
              </View>
            )
        }
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

export default GroupMng;