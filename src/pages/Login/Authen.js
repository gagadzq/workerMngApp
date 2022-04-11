import React, {Component} from 'react';
import {
  ScrollView,
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
} from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';

import * as ScreenUtil from '../../lib/Px2dp';
import fetchRequest from '../../lib/Fetch'
import ToastNative from '../../components/Toast';
import Loading from '../../components/Loading'

import Form from '../../components/Form/Form'

const resetAction = StackActions.reset({ 
  index: 0, 
  actions: [ 
    NavigationActions.navigate({ routeName: 'TabNavigator' }), 
  ], 
});


class Authen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formOptions: [{
        name: 'realName',
        type: 'TextInput',
        label: '姓名',
        placeholder: '请输入身份证上的姓名',
        isEditable: true,
        required: true
      }, {
        name: 'idCardCode',
        type: 'TextInput',
        label: '身份证号',
        placeholder: '请输入身份证号',
        isEditable: true,
        required: true
      }],
      avatarSource: {
        front: null,
        back: null
      },
      name: '',
      idCardCode: '',
      formValue: {},
      loading: false,
      cardMsg: {}
    };
  }
  selectPhotoTapped(type) {
    const options = {
      title: '请选择图片来源',
      cancelButtonTitle:'取消',
      takePhotoButtonTitle:'拍照',
      chooseFromLibraryButtonTitle:'相册图片',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { 
          uri: response.uri,
          file: {
            uri: response.uri,
            type: 'multipart/form-data',
            name: Date.parse(new Date()) + ".jpg"
          }
        };
        const formData = new FormData();
        formData.append('image_file', source.file);
        formData.append('api_key', '1ynh04sjAQxIV7oGzr8XT1Fm78DDBxZZ');
        formData.append('api_secret', 'xflkimhsbFqTHJpG0zmNo0_2ES_EdAC9');
        this.setState({
          loading: true
        })
        fetchRequest('https://api-cn.faceplusplus.com/cardpp/v1/ocridcard', 'POST', formData,'upload').then(res => {
          console.log(res)
          if (!res.error_message) {
            const cardMsg = res.cards[0];
            if (type === 'front' && cardMsg.side === 'front') {
              this.setState(prevState => {
                prevState.formOptions[0].defaultValue = cardMsg.name
                prevState.formOptions[1].defaultValue = cardMsg.id_card_number
                return {
                  avatarSource: {
                    ...this.state.avatarSource,
                    front: source
                  },
                  formOptions: prevState.formOptions,
                  cardMsg: cardMsg,
                  loading: false,
                  formValue: {
                    realName: cardMsg.name,
                    idCardCode: cardMsg.id_card_number
                  }
                }
              });
            } else if(type === 'back' && cardMsg.side === 'back') {
              this.setState({
                avatarSource: {
                  ...this.state.avatarSource,
                  back: source
                },
                loading: false
              });
            } else {
              this.setState({
                loading: false
              });
              ToastNative('请确认上传身份证'+(type === 'front' ? '国徽面' : '人像面'));
            }
          } else {
            ToastNative('请确认上传合法身份证');
            this.setState({
              loading: false
            });
          }
        }).catch((error) => {
          console.error(error);
        });
       
      }
    })
  }
  nextStep() {
    console.log(this.state)
    if (!this.state.formValue.realName && !this.state.formValue.idCardCode) {
      ToastNative('请输入信息');
      /* ToastAndroid.showWithGravity('请输入信息', ToastAndroid.SHORT, ToastAndroid.CENTER); */
    } else {
      if(this.state.cardMsg.name!==this.state.formValue.realName){
        ToastNative('请确认姓名与身份证相符');
      } else if( this.state.cardMsg.id_card_number!==this.state.formValue.idCardCode) {
        ToastNative('请确认身份证号与身份证相符');
      } else {
        fetchRequest('/users/addAuthen', 'POST', this.state.formValue)
          .then(res => {
            console.log(res)
            if (res.code === 200) {
              ToastNative('认证成功');
              this.props.navigation.dispatch(resetAction);
            } else {
              ToastNative(res.message);
            }
          }).catch(error => {})
      }
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
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.boxDiv}>
            <TouchableOpacity onPress={this.selectPhotoTapped.bind(this, 'front')}>
              <View style={styles.idCardBox}>
                {this.state.avatarSource.front === null ? (
                  <View style={{alignItems: 'center'}}>
                    <Image style={styles.idCardIcon} source={require('../../images/idcard1.png')} />
                    <Text style={{color: '#ababab'}}>请上传身份证人像面</Text>
                  </View>
                ) : (
                  <Image style={styles.avatar} source={this.state.avatarSource.front} ></Image>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.selectPhotoTapped.bind(this, 'back')}>
              <View style={styles.idCardBox}>
                {this.state.avatarSource.back === null ? (
                  <View style={{alignItems: 'center'}}>
                    <Image style={styles.idCardIcon} source={require('../../images/idcard2.png')} />
                    <Text style={{color: '#ababab'}}>请上传身份证国徽面</Text>
                  </View>
                ) : (
                  <Image style={styles.avatar} source={this.state.avatarSource.back} ></Image>
                )}
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.itemTitle}>填写信息</Text>
            <View style={{backgroundColor: '#fff'}}>
              <View style={styles.item}>
                <Form fields={this.state.formOptions} onChange={this.onHandleChange.bind(this)}/>
              </View>
            </View>
          </View>
          <View style={styles.buttonView}>
            <TouchableHighlight style={styles.ButtonBox} onPress={this.nextStep.bind(this)}>
              <Text style={styles.loginButton}>下一步</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
        { this.state.loading ? (
          <Loading />
         ) : null
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8e6ec',
  },
  boxDiv: {
    backgroundColor: '#fff',
    paddingHorizontal: ScreenUtil.scaleSize(30),
    paddingBottom: ScreenUtil.scaleSize(30),
  },
  idCardBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: ScreenUtil.scaleSize(30),
    width: ScreenUtil.scaleSize(1015),
    height: ScreenUtil.scaleSize(625),
    borderStyle: 'dashed',
    borderWidth: 2 / PixelRatio.get(),
    borderColor: '#CDCDCD',
    color: '#CDCDCD'
  },
  idCardIcon: {
    width: ScreenUtil.scaleSize(370),
    height: ScreenUtil.scaleSize(255)
  },
  avatar: {
    width: ScreenUtil.scaleSize(1015),
    height: ScreenUtil.scaleSize(625),
  },
  idcardForm: {
    fontSize: ScreenUtil.setSpText(40)
  },
  itemTitle: {
    padding: ScreenUtil.scaleSize(30)
  },
  item: {
    paddingHorizontal: ScreenUtil.scaleSize(40)
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
  buttonView: {
    marginVertical: ScreenUtil.scaleSize(60),
    marginHorizontal: ScreenUtil.scaleSize(40),
  }
});

export default Authen;