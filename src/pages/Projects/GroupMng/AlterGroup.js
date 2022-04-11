import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, Image, Keyboard
} from 'react-native';

import ToastNative from '../../../components/Toast'
import * as ScreenUtil from '../../../lib/Px2dp';
import fetchRequest from '../../../lib/Fetch';
import Form from '../../../components/Form/Form'

const formOptions = [{
  name: 'groupName',
  type: 'TextInput',
  label: '班组名称',
  placeholder: '请设置班组名称（6字以内）',
  isEditable: true,
}, {
  name: 'gIntroduction',
  type: 'Textarea',
  label: '班组说明',
  placeholder: '填写班组简介',
  isEditable: true,
}]

class AlterGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pId: '',
      formValue: {},
      groupMsg: {},
      formOptions: [{
        name: 'groupName',
        type: 'TextInput',
        label: '班组名称',
        placeholder: '请设置班组名称（6字以内）',
        isEditable: true,
      }, {
        name: 'gIntroduction',
        type: 'Textarea',
        label: '班组说明',
        placeholder: '填写班组简介',
        isEditable: true,
      }]
    }
  }
  static navigationOptions = ({navigation, screenProps}) => {
    return {
      headerTitle:(
        <Text style={{flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
          班组信息
        </Text>
      ),
      headerRight:(
        <TouchableOpacity onPress={() => navigation.state.params.navigatePress()}>
          <View style={{paddingRight: ScreenUtil.scaleSize(45)}}>
            <Text style={{ color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
              修改
            </Text>
          </View>
        </TouchableOpacity>
      ),
    }
  }
  clickFinishButton() {
    var params = {
      gId: this.state.gId,
      groupName: this.state.formValue.groupName,
      gIntroduction: this.state.formValue.gIntroduction
    }
    fetchRequest('/group/alterGroup', 'POST', params).then(res => {
      if (res.code === 200) {
        ToastNative('修改成功');
        Keyboard.dismiss()
      }
    }).catch(err => {
      console.log(err)
    })
  }
  deleteGroup() {
    fetchRequest('/group/deleteGroup', 'POST', {gId: this.state.gId}).then(res => {
      if (res.code === 200) {
        ToastNative('班组删除成功');
        this.props.navigation.state.params.back();
      }
    }).catch(err => {
      console.log(err)
    })
  }
  onHandleChange(name, value) {
    this.setState((prevState) => {
      return {
        formValue: {
          ...prevState.formValue,
          [name]: value
        }
      }
    })
  }
  componentWillMount() {
    this.setState({
      loading: true,
      gId: this.props.navigation.getParam('gId')
    });
    fetchRequest('/group/getGroupMsg?gId='+this.props.navigation.getParam('gId'), 'GET').then(res => {
      if (res.code === 200) {
        this.setState(prevState => {
          prevState.formOptions[0].defaultValue = res.data.groupName
          prevState.formOptions[1].defaultValue = res.data.gIntroduction
          console.log(prevState.formOptions)
          return {
            groupMsg: res.data,
            formOptions: prevState.formOptions,
            formValue: {
              groupName: res.data.groupName,
              gIntroduction: res.data.gIntroduction
            }
          }
        })
      }
    }).catch(err => {
      console.log(err)
    })
    this.props.navigation.setParams({navigatePress:this.clickFinishButton.bind(this)})
  }
  render() {
    return (
      <View style={styles.content}>
        <View style={styles.form}>
          <Form fields={this.state.formOptions} onChange={this.onHandleChange.bind(this)}/>
        </View>
        <View>
          <TouchableOpacity style={styles.deleteBtn} onPress={this.deleteGroup.bind(this)}>
            <Text style={styles.btnText}>删除</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  },
  form: {
    width: ScreenUtil.scaleSize(950),
  },
  deleteBtn: {
    width: ScreenUtil.scaleSize(950),
    height: ScreenUtil.scaleSize(140),
    marginTop: ScreenUtil.scaleSize(10),
    backgroundColor: '#f96a6a',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  btnText: {
    color: '#fff',
    fontSize: ScreenUtil.setSpText(18)
  }
})

export default AlterGroup;