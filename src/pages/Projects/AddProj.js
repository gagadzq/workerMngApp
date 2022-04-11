import React, { Component } from 'react';
import {
  Text, View, StyleSheet, ScrollView, TouchableHighlight
} from 'react-native'
import { NavigationActions, StackActions } from 'react-navigation';
import Form from '../../components/Form/Form'
import * as ScreenUtil from '../../lib/Px2dp';
import fetchRequest from '../../lib/Fetch'

const resetAction = StackActions.reset({ 
  index: 0, 
  actions: [ 
    NavigationActions.navigate({ routeName: 'TabNavigator' }), 
  ], 
});


const formOptions = [{
  name: 'projName',
  type: 'TextInput',
  label: '项目名称',
  placeholder: '请输入项目名称',
  isEditable: true,
  required: true
}, {
  name: 'managerName',
  type: 'TextInput',
  label: '联系人名称',
  placeholder: '请输入联系人名称',
  isEditable: true,
  required: true
}, {
  name: 'managerPhone',
  type: 'TextInput',
  label: '联系人电话',
  placeholder: '请输入联系人电话',
  isEditable: true,
  required: true
}, {
  name: 'startDate',
  type: 'DatePicker',
  label: '项目开始时间',
  isEditable: true,
  required: true
}, {
  name: 'endDate',
  type: 'DatePicker',
  label: '项目结束时间',
  isEditable: true,
  required: true
}, {
  name: 'projImage',
  type: 'Image',
  label: '项目展示图片',
  isEditable: true,
  required: true
}, {
  name: 'projAddr',
  type: 'Map',
  label: '项目详细地址',
  placeholder: '点击选择地址',
  isEditable: true,
  required: true
}]

class AddProj extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValue: {}
    }
  }
  static navigationOptions = {
    headerTitle: (
      <Text style={{ flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
        项目添加
      </Text>
    ),
  }
  onHandleChange(name, value) {
    if (name === 'projImage') {
      var fd = new FormData();
      fd.append('file', value.file);
      fetch('http://172.20.10.2:3000/upload', {
        method: 'POST',
        body: fd,
      }).then(response => {
        const res = JSON.parse(response._bodyInit)
        this.setState({
          formValue: {
            ...this.state.formValue,
            [name]: res.file_path
          }
        })
      }).catch(err => {
        console.log(err)
      })
    } else {
      this.setState({
        formValue: {
          ...this.state.formValue,
          [name]: value
        }
      })
    }
  }
  confirm() {
    const { formValue } = this.state;
    if (formValue.projName && formValue.managerName && formValue.managerPhone && formValue.startDate && formValue.endDate && formValue.projImage && formValue.addrMsg) {
      fetchRequest('/projects/addProj','POST',this.state.formValue)
      .then(res => {
        if (res.code === 200) {
          this.props.navigation.dispatch(resetAction);
        } else {
          console.log(res.message);
        }
      }).catch(err => {
        console.log(err);
      })
    } else {
      console.log('请完整填写项目信息')
    }
    console.log(this.state.formValue)
  }
  render() {
    const {navigation} = this.props
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.formView}>
            <Form
              fields={formOptions}
              onChange={this.onHandleChange.bind(this)}
              onClickMap={() => {
                let _this = this;
                navigation.navigate('BaiduMap',
                {
                  setAddr: function(mapValue) { 
                    _this.setState({
                      formValue:{
                        ..._this.state.formValue,
                        addrMsg:mapValue
                      }
                    })
                  }
                }
              )}}
              mapValue={navigation.getParam('mapValue') ? navigation.getParam('mapValue') : ''}
            />
            <View style={styles.buttonView}>
              <TouchableHighlight style={styles.ButtonBox} onPress={this.confirm.bind(this)}>
                <Text style={styles.loginButton}>确定</Text>
              </TouchableHighlight>
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
    alignItems: 'center',
    backgroundColor: '#EFEFEF'
  },
  formView: {
    width: ScreenUtil.scaleSize(1020),
    backgroundColor: '#fff',
    padding: ScreenUtil.scaleSize(30),
    marginTop: ScreenUtil.scaleSize(35),
  },
  buttonView: {
    marginVertical: ScreenUtil.scaleSize(60),
  },
  ButtonBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#56A3EB',
    height: ScreenUtil.scaleSize(120),
    borderRadius: 5,
  },
  loginButton: {
    color: '#FFFFFF',
  },
});

export default AddProj;