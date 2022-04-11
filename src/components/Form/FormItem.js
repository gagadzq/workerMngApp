import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native'
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-picker';
import * as ScreenUtil from '../../lib/Px2dp';

class FormItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      datetime: '',
      imageSource: null
    }
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
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const file = {
          uri: response.uri,
          type: 'multipart/form-data',
          name: Date.parse(new Date()) + ".jpg"
        }
        this.setState({
          imageSource: {
            uri: response.uri,
            file: file
          }
        });
        this.props.onChange({file,});
      }
    })
  }
  render() {
    let {type, label, placeholder, isEditable, required, defaultValue, minDate} = this.props.itemOptions;
    let item = '';
    if (type === 'TextInput') {
      item = (
        <TextInput
          style={styles.textInput}
          editable={isEditable}
          keyboardType='default'
          value={this.state.value ? this.state.value : defaultValue}
          placeholder={placeholder}
          placeholderTextColor='#C2C2C2'
          onChangeText={value => {
            this.setState({value: value})
            this.props.onChange(value)
          }}
        />
      )
    } else if (type === 'DatePicker') {
      item = (
        <DatePicker
          date={this.state.datetime ? this.state.datetime : defaultValue}
          mode="date"
          format="YYYY-MM-DD"
          confirmBtnText="确定"
          placeholder='请选择日期'
          minDate={minDate}
          customStyles={ {
            dateInput: {
              borderWidth: 0,
            },
            dateText: {
              position: 'absolute',
              right: 0,
            },
            placeholderText: {
              position: 'absolute',
              right: 0,
            }
          } }
          cancelBtnText="取消"
          showIcon={false}
          onDateChange={(datetime) => {
            this.setState({datetime: datetime});
            this.props.onChange(datetime);
          }}
        />
      )
    } else if (type === 'Image') {
      item = (
        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
          <View style={styles.imageBox}>
            {
              this.state.imageSource === null && defaultValue ? (
                <Image style={styles.avatar} source={{uri:defaultValue}}></Image>
              ) : null
            }
            {this.state.imageSource === null && !defaultValue? (
              <View style={{alignItems: 'center'}}>
                <Text style={{color: '#bbb'}}>点击上传图片</Text>
              </View>
            ) : null}
            {
              this.state.imageSource ? (
                <Image style={styles.avatar} source={this.state.imageSource}></Image>
              ) : null
            }
          </View>
        </TouchableOpacity>
      )
    } else if (type === 'Map') {
      item = (
        <Text
          style={[styles.textInput, !this.props.mapValue ? {color: '#C2C2C2'} : '']}
          onPress={() => this.props.onClickMap()}
        >
          {this.props.mapValue ? this.props.mapValue : (defaultValue? defaultValue : this.props.mapValue.addr)}
        </Text>
      )
    } else if (type == 'Textarea') {
      item = (
      <TextInput style={styles.inputTextStyle}
          multiline={true}
          placeholder={placeholder}
          paddingVertical={0}
          editable={isEditable}
          selectionColor = {'#b2b2b2'}
          textAlignVertical={'top'}
          placeholderTextColor={'#b2b2b2'}
          underlineColorAndroid={'transparent'}
          maxLength={1000}
          value={this.state.value ? this.state.value : defaultValue}
          onChangeText={value => {
            this.setState({value: value})
            this.props.onChange(value)
          }}
        />
      )
    }
    return (
      <View>
        { type === 'Textarea' ? 
        (
          <View style={styles.textarea}>
            <View style={styles.leftContent}>
              <Text style={styles.label}>{ required ? (<Text style={{ color: 'red'}}>*</Text>) : null}{label}</Text>
              <Text>:</Text>
            </View>
            <View styel={styles.textareaInput}>{ item }</View>
          </View>
        ) :
        (
          <View style={type === 'Image' ? styles.ImageContent : styles.ItemContent}>
            { label ? 
              (<View style={styles.leftContent}>
                <Text style={styles.label}>{ required ? (<Text style={{ color: 'red'}}>*</Text>) : null}{label}</Text>
                <Text>:</Text>
              </View> ): null
            }
            <View style={styles.inputContainer}>
              { item }
            </View>
          </View>
        )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  ItemContent: {
    height: ScreenUtil.scaleSize(160),
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
    justifyContent: 'space-between',
  },
  textarea: {
    height: ScreenUtil.scaleSize(500),
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
    paddingTop: ScreenUtil.scaleSize(40),
  },
  textareaInput: {
    width: ScreenUtil.scaleSize(980),
    borderRadius: 10,
    marginHorizontal: ScreenUtil.scaleSize(50),
    marginTop: ScreenUtil.scaleSize(200),
  },
  inputTextStyle: {
    fontSize: ScreenUtil.setSpText(14),
    width: '100%',
    minHeight: ScreenUtil.scaleSize(600),
    paddingBottom: 30,
    paddingTop: 10
  },
  ImageContent: {
    height: ScreenUtil.scaleSize(260),
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: ScreenUtil.scaleSize(240)
  },
  label: {

  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    textAlign: 'right'
  },
  imageBox: {
    width: ScreenUtil.scaleSize(320),
    height: ScreenUtil.scaleSize(240),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  avatar: {
    width: ScreenUtil.scaleSize(320),
    height: ScreenUtil.scaleSize(240)
  }
})

export default FormItem;