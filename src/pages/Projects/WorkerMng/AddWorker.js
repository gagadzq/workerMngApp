import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, Image
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import * as ScreenUtil from '../../../lib/Px2dp';
import fetchRequest from '../../../lib/Fetch';

class AddWorker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pId: '',
      groupsList: []
    }
  }
  
  componentWillMount() {  
    
  }
  render() {
    return (
      <View>
        <View>
          <View></View>
          <View>
            <Text></Text>
            <Text></Text>
          </View>
        </View>
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

export default AddWorker;