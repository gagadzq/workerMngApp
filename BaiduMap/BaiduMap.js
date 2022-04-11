import React, { Component } from 'react';
 
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView,
    Platform,
} from 'react-native';
 
import { MapView, MapTypes, Geolocation, Overlay } from 'react-native-baidu-map';
const { Marker } = Overlay;

import FontAwesome from 'react-native-vector-icons/FontAwesome'
 
import Dimensions from 'Dimensions';
const { width,height } = Dimensions.get('window');
import * as ScreenUtil from '../../lib/Px2dp';


export default class BaiduMapDemo extends Component {
  constructor() {
      super();
      this.state = {
        searchValue: '',
        zoomControlsVisible: true,
        trafficEnabled: false,
        baiduHeatMapEnabled: false,
        mapType: MapTypes.NORMAL,
        zoom: 16,
        center: {
            longitude: 113.896198,
            latitude: 22.959144,
        },
        marker: {
          location: {
            longitude: 113.896198,
            latitude: 22.959144
          }
        },
        clickMessage: '',
        poiMessage: '',
        mapValue: {
          addr: '',
          city: '',
          longitude: '',
          latitude: ''
        }
      };
  }

  componentDidMount() {
    Geolocation.getCurrentPosition()
      .then(data => {
        this.setState({
          center: {
            longitude: data.longitude,
            latitude: data.latitude
          },
          marker: {
            location:{
              longitude: data.longitude,
              latitude: data.latitude
            }
          }
        })
      })
      .catch(e =>{
        console.warn(e, 'error');
      })
  }

  handleSearch() {
    Geolocation.geocode('',this.state.searchValue)
      .then(data => {
        /* console.log(this.state.searchValue)
        console.log(data) */
        Geolocation.reverseGeoCode(data.latitude,data.longitude)
          .then(res => {
            console.log(res)
            this.setState({
              center: {
                longitude: data.longitude,
                latitude: data.latitude
              },
              marker: {
                location: {
                  longitude: data.longitude,
                  latitude: data.latitude
                }
              },
              zoom: 16,
              mapValue: {
                addr: this.state.searchValue,
                city: res.city,
                longitude: data.longitude,
                latitude: data.latitude
              }
            })
          }).catch(e =>{
            console.warn(e, 'error');
          })
      })
      .catch(e =>{
        console.warn(e, 'error');
      })
  }
  render() {
        return (
            <View style={styles.container}>
              <View style={styles.searchView}>
                <View style={styles.searchBox}>
                  <FontAwesome
                    name={'search'}
                    size={18}
                    color='#aaa'
                    style={styles.searchIcon}
                  />
                  <TextInput
                    style={styles.searchText}
                    value={this.state.searchValue}
                    onChangeText={value => {
                      this.setState({
                        searchValue: value,
                      })
                    }}
                    onEndEditing={this.handleSearch.bind(this)}
                  />
                </View>
                <Text
                  style={styles.button}
                  onPress={() => {
                    console.log(this.state.mapValue)
                    this.props.navigation.state.params.setAddr(this.state.mapValue)
                    this.props.navigation.navigate('AddProj',{ mapValue: this.state.mapValue });
                  }}
                >确认</Text>
              </View>
              <MapView 
                  zoomControlsVisible={this.state.zoomControlsVisible} //默认true,是否显示缩放控件,仅支持android
                  mapType={this.state.mapType} //地图模式,NORMAL普通 SATELLITE卫星图
                  zoom={this.state.zoom} //缩放等级,默认为10
                  center={this.state.center} // 地图中心位置

                  onMapLoaded={(e) => { //地图加载事件
                      Geolocation.getCurrentPosition()
                          .then(data => {
                            this.setState({
                              center: {
                                longitude: data.longitude,
                                latitude: data.latitude
                              },
                              marker: {
                                location:{
                                  longitude: data.longitude,
                                  latitude: data.latitude
                                }
                              }
                            })
                          })
                          .catch(e =>{
                              console.warn(e, 'error');
                          })
                  }}
                  onMapPoiClick={(e) => { //地图已有点点击
                    Geolocation.reverseGeoCode(e.latitude,e.longitude)
                      .then(res => {
                        this.setState({
                            center: {
                                longitude: e.longitude,
                                latitude: e.latitude,
                            },
                            marker: {
                              location:{
                                longitude: e.longitude,
                                latitude: e.latitude,
                                title: e.name,
                              }
                            },
                            poiMessage: res,
                            mapValue: {
                              addr: e.name,
                              city: res.city,
                              longitude: e.longitude,
                              latitude: e.latitude
                            },
                            searchValue: e.name
                        })
                      })
                      .catch(err => {
                          console.log(err)
                      })
                  }}
                  style={styles.map}
              >
                <Marker 
                  location={this.state.marker.location}
                />
              </MapView>
            </View>
        );
    }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  map: {
    width: width,
    height: ScreenUtil.scaleSize(1740),
    marginBottom: 5,
  },
  list: {
    flexDirection: 'row',
    paddingLeft: 10,
    marginBottom: 5,
  },
  searchView: {
    width: ScreenUtil.scaleSize(1080),
    height: ScreenUtil.scaleSize(120),
    paddingLeft: ScreenUtil.scaleSize(15),
    paddingRight: ScreenUtil.scaleSize(30),
    flexDirection: 'row',
    backgroundColor:'white',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  searchBox: {
    width: ScreenUtil.scaleSize(920),
    height: ScreenUtil.scaleSize(100),
    backgroundColor:'#efefef',
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    fontSize: ScreenUtil.setSpText(14),
  },
  searchIcon: {
    marginLeft: ScreenUtil.scaleSize(40),
    marginRight: ScreenUtil.scaleSize(10)
  },
  searchText: {
    color: '#565656',
    alignItems: 'center',
    fontSize: ScreenUtil.setSpText(14),
    width: ScreenUtil.scaleSize(900)
  }
})