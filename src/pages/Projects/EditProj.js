import React, { Component } from 'react';
import {
  Text, View, StyleSheet, ScrollView, TouchableHighlight, TouchableOpacity
} from 'react-native'
import { NavigationActions, StackActions } from 'react-navigation';
import Feather from 'react-native-vector-icons/Feather'
import Form from '../../components/Form/Form'
import * as ScreenUtil from '../../lib/Px2dp';
import fetchRequest from '../../lib/Fetch'
import ToastNative from '../../components/Toast';

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

class EditProj extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValue: {},
      projData: {},
      formOptions: [{
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
    }
  }
  static navigationOptions = {
    headerTitle: (
      <Text style={{ flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
        项目详情
      </Text>
    ),
    headerRight:(
      <TouchableOpacity onPress={this.deleteProj}>
        <View style={{marginRight: ScreenUtil.scaleSize(20)}}>
          <Feather name={'trash'} size={22} color={'white'}/>
        </View>
      </TouchableOpacity>
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
      fetchRequest('/projects/editProj?pId='+this.state.pId,'POST',this.state.formValue)
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
  deleteProj(){
    const params = {pId: this.state.pId}
    fetchRequest('/projects/deleteProj', params, 'POST').then(res => {
      if (res.code === 200) {
        this.props.navigation.navigate('Projects');
      } else {

      }
    })
  }
  componentWillMount() {
    this.setState({
      loading: true,
      pId: this.props.navigation.getParam('pId')
    });
    const pId = this.props.navigation.getParam('pId')
    fetchRequest('/projects/getProjDetail?pId=' + pId, 'GET').then(res => {
      if (res.code === 200) {
        var projData = res.data[0]
        this.setState({
          loading: false,
          pId,
          projData: res.data[0]
        });
        this.setState(prevState => {
          prevState.formOptions[0].defaultValue = projData.pName
          prevState.formOptions[1].defaultValue = projData.pManager
          prevState.formOptions[2].defaultValue = projData.managerPhone
          prevState.formOptions[3].defaultValue = projData.startDate
          prevState.formOptions[4].defaultValue = projData.endDate
          prevState.formOptions[5].defaultValue = projData.base64
          prevState.formOptions[6].defaultValue = projData.addrName
          return {
            loading: false,
            pId,
            projData: res.data[0],
            formOptions: prevState.formOptions,
            formValue: res.data[0]
          }
        })
        console.log(res.data[0])
      } else {
        this.setState({
          loading:false
        })
        ToastNative(res.message)
      }
    })
  }
  render() {
    const {navigation} = this.props
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.formView}>
            <Form
              fields={this.state.formOptions}
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
    backgroundColor: '#e8e6ec'
  },
  formView: {
    width: ScreenUtil.scaleSize(1020),
    backgroundColor: '#EFEFEF',
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

export default EditProj;