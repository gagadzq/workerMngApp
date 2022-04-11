import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Image, TouchableHighlight, TouchableOpacity
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import * as ScreenUtil from '../../lib/Px2dp';
import Form from '../../components/Form/Form'
import fetchRequest from '../../lib/Fetch';
import ToastNative from '../../components/Toast'

const formOptions = [{
  name: 'demandName',
  type: 'TextInput',
  label: '材料名称',
  placeholder: '请输入材料名称',
  isEditable: true,
  required: true
}, {
  name: 'demandUnit',
  type: 'TextInput',
  label: '单位',
  placeholder: '请输入单位',
  isEditable: true,
  required: true
}, {
  name: 'demandNumber',
  type: 'TextInput',
  label: '所需数量',
  placeholder: '请输入所需数量(仅限数字)',
  isEditable: true,
  required: true
}, {
  name: 'dealDate',
  type: 'DatePicker',
  minDate: new Date(),
  label: '交付时间',
  isEditable: true,
  required: true
}, ]

class AddDemand extends Component {
  constructor(props) {
    super(props)
    this.state = ({
      formValue: {
        demandName: '',
        demandUnit: '',
        demandNumber: 0,
        dealDate: '',
      }
    })
  }
  static navigationOptions = ({navigation, screenProps}) => {
    return {
      headerTitle:(
        <Text style={{flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
          添加需求
        </Text>
      ),
    }
  }
  onHandleChange(name, value) {
    this.setState({
      formValue: {
        ...this.state.formValue,
        [name]: value
      }
    })
  }
  clickAdd() {
    fetchRequest('/demand/addDemand', 'POST', this.state.formValue).then( res => {
      if (res.code === 200) {
        ToastNative('添加成功');
        this.props.navigation.state.params.refresh();
        this.props.navigation.goBack();
      }
    })
  }
  componentWillMount(){
  }
  render() {
    return(
      <View style={styles.container}>
        <View style={styles.form}>
          <Form
            fields={formOptions}
            onChange={this.onHandleChange.bind(this)}
          />
          <TouchableOpacity style={styles.btn} onPress={this.clickAdd.bind(this)}>
            <Text style={styles.btnText}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    paddingHorizontal: ScreenUtil.scaleSize(40),
  },
  btn: {
    width: '100%',
    height: ScreenUtil.scaleSize(120),
    marginTop: ScreenUtil.scaleSize(90),
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

export default AddDemand;