import React, {
  Component,
} from 'react';

import { PropTypes} from 'prop-types'

import {
  MapView, 
  MapTypes, 
  Geolocation 
} from 'react-native-baidu-map';


import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';


export default class BaiduMap extends Component {

  constructor() {
      super();

      this.state = {
          mayType: MapTypes.NORMAL,
          zoom: 15, 
          trafficEnabled: false,
          baiduHeatMapEnabled: false,
      };
  }

  componentDidMount() { // 获取位置
      Geolocation.getCurrentPosition().then(
          (data) => {
              this.setState({
                  zoom:18,
                  markers:[{
                      latitude:data.latitude,
                      longitude:data.longitude,
                      title:'我的位置'
                  }],
                  center:{
                      latitude:data.latitude,
                      longitude:data.longitude,
                  }
              })
          }
      ).catch(error => {
          console.warn(error,'error')
      })
  }

  render() {
      return (
          <View style={styles.container}>
              <MapView
                  trafficEnabled={this.state.trafficEnabled}
                  baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
                  zoom={this.state.zoom}
                  mapType={this.state.mapType}
                  center={this.state.center}
                  marker={this.state.marker}
                  markers={this.state.markers}
                  style={styles.map}
                  onMapClick={(e) => {
                  }}
              >
              </MapView>

          </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      height:400,
      flexDirection:'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
  },
  map: {
      flex:1,
      height:400,
  }

});