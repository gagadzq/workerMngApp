import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  InteractionManager,
  Animated,
  Easing,
  Image,
  Alert,
  Vibration,
  Dimensions,
  Platform
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import * as ScreenUtil from '../../../lib/Px2dp';
import fetchRequest from '../../../lib/Fetch';
import ToastNative from '../../../components/Toast'

export default class CodeCamera extends Component {
static navigationOptions = ({navigation, screenProps}) => {
	return {
		headerTitle:(
			<Text style={{flex: 1, textAlign: 'center', color: '#FFF', fontSize: ScreenUtil.setSpText(18)}}>
					扫一扫
			</Text>
			),
		}
	}
  constructor(props) {
    super(props);
    this.state = {
      show:true,
      animation: new Animated.Value(0),
      pId: '',
      user: ''
    };
  }
  
  componentDidMount(){
    InteractionManager.runAfterInteractions(()=>{
      this.startAnimation()
    });
    this.setState({
      pId: this.props.navigation.getParam('pId')
    })
    console.log(this.props.navigation.getParam('pId'))
  }
  
  componentWillUnmount(){
    this.setState({
      show: false,
    })
  }
  
  startAnimation(){
    if(this.state.show){
      this.state.animation.setValue(0);
      Animated.timing(this.state.animation,{
        toValue:1,
        duration:1500,
        easing:Easing.linear,
      }).start(()=>this.startAnimation());
    }
  }
  
  render() {
    let scanView = null;
    let navigation = this.props.navigation
    scanView = (
    <RNCamera
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        googleVisionBarcodeType={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.QR_CODE}
        flashMode={RNCamera.Constants.FlashMode.auto}
        onBarCodeRead={(e) => this.barcodeReceived(e, navigation)}
    >
        <View style = {{height: (height-244)/3, width:width, backgroundColor:'rgba(0,0,0,0.5)',}}>
        </View>
        <View style={{flexDirection:'row'}}>
        <View style={styles.itemStyle}/>
        <View style={styles.rectangle}>
            <Animated.View style={[styles.animatedStyle, {
              transform: [{
                  translateY: this.state.animation.interpolate({
                  inputRange: [0,1],
                  outputRange: [0,200]
                  })
              }]
            }]}>
            </Animated.View>
        </View>
        <View style={styles.itemStyle}/>
        </View>
        <View style={{flex:1,backgroundColor:'rgba(0, 0, 0, 0.5)',width:width,alignItems:'center'}}>
            <Text style={styles.textStyle}>将二维码放入框内，即可自动扫描</Text>
        </View>
    </RNCamera>
    )
    return (
      <View style={styles.container}>
        {scanView}
      </View>
    );
  }
  
  barcodeReceived(e, navigation) {
    if (this.state.show) {
      this.state.show = false;
      if (e) {
        Vibration.vibrate([0, 500], false);
        let result = e.data;
        let params = {
          pId: this.props.navigation.getParam('pId'),
          uId: result
        }
        fetchRequest('/users/getWorkerMsg?uId='+result, 'GET').then(res => {
          if (res.code === 200) {
            this.setState({
              user: res.data.name,
            })
            Alert.alert(
              '信息',
              '是否确认添加工人:'+res.data.name,
              [
                {
                  text: '确定', onPress: () => {
                    fetchRequest('/worker/addUsersInProj', 'POST', params).then(res => {
                      if (res.code === 200) {
                        ToastNative('添加成功')
                        this.props.navigation.state.params.refresh();
                        this.props.navigation.goBack();
                      } else{
                        ToastNative('添加失败')
                        this.props.navigation.state.params.refresh();
                        this.props.navigation.goBack();
                      }
                    }).catch(err => {
                      this.props.navigation.state.params.refresh();
                      this.props.navigation.goBack();
                    })
                    this.setState({
                      show: true
                    })
                  }
                }
              ],
              {cancelable: false}
            )
          } else {
            Alert.alert(
              '提示',
              '获取用户失败',
              [
                {
                  text: '确定', onPress: () => {
                    this.setState({
                      show: true
                    })
                    this.props.navigation.state.params.refresh();
                    this.props.navigation.goBack();
                  }
                }
              ],
              {cancelable: false}
            ) 
          }
        }).catch(err => {
          console.log(err)
          this.setState({
            loading: false
          })
        })
       
      } else {
        Alert.alert(
          '提示',
          '扫描失败，请将手机对准二维码重新尝试',
          [
            {
              text: '确定', onPress: () => {
                this.setState({
                  show: true
                })
              }
            }
          ],
          {cancelable: false}
        )
      }
    }
  }
}

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  preview: {
    flex: 1,
  },
  itemStyle:{
    backgroundColor:'rgba(0,0,0,0.5)',
    width:(width-300)/2,
    height:300
  },
  textStyle:{
    color:'#ddd',
    marginTop:20,
    fontWeight:'bold',
    fontSize:16
  },
  animatedStyle:{
    height:2,
    backgroundColor:'#00c050'
  },
  rectangle: {
    height: 300,
    width: 300,
  }
});