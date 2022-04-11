import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity, Image
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

class AddGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pId: '',
      formValue: {}
    }
  }
  static navigationOptions = ({navigation, screenProps}) => {
    return {
      headerTitle:(
        <Text style={{flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
          添加班组
        </Text>
      ),
      headerRight:(
        <TouchableOpacity onPress={() => navigation.state.params.navigatePress()}>
          <View style={{paddingRight: ScreenUtil.scaleSize(45)}}>
            <Text style={{ color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
              完成
            </Text>
          </View>
        </TouchableOpacity>
      ),
    }
  }
  clickFinishButton() {
    var params = {
      pId: this.state.pId,
      groupName: this.state.formValue.groupName,
      gIntroduction: this.state.formValue.gIntroduction
    }
    fetchRequest('/group/addGroup', 'POST', params).then(res => {
      if (res.code === 200) {
        ToastNative('添加成功');
        this.props.navigation.state.params.refresh();
        this.props.navigation.goBack();
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
      pId: this.props.navigation.getParam('pId')
    });
    this.props.navigation.setParams({navigatePress:this.clickFinishButton.bind(this)})
  }
  render() {
    return (
      <View style={styles.form}>
        <Form fields={formOptions} onChange={this.onHandleChange.bind(this)}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: ScreenUtil.scaleSize(30),
  }
})

export default AddGroup;