
import React, {Component} from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  Linking
} from "react-native";
import MapView, {Marker} from "react-native-maps";
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {IndoorIcon, ParkIcon, LightIcon, UrlIcon, PhoneIcon} from "../icon/Icons"

class App extends Component{

  constructor(props){
    super(props);
    this.lat = parseFloat(this.props.item.latitude);
    this.long = parseFloat(this.props.item.longitude);
    this.state = {
      "initialRegion": {
        "latitude": this.lat,
        "longitude": this.long,
        "latitudeDelta": 0.015,
        "longitudeDelta": 0.005,
      },
      "activeSlide": 0
    }
  }

  onRegionChange = (region) => {
    this.setState({region});
  };

  renderImage = ({item, index}) => {
    return (
      <Image
        source={{"uri": item.pictureUrl}}
        style={styles.image}
      />
    );
  };

  render(){

    let ground = this.props.item;
    // 가정: image.length > 0
    let images = ground.groundImages;

    /*let images = [
      {"id": 1, "groundId": 1, "pictureUrl": "http://i2.imgtong.com/1504/98af65a9e13b2197f105545ed9b9299d_Jvoju9FNDvqD.jpg"},
      {"id": 2, "groundId": 1, "pictureUrl": "http://i2.imgtong.com/1504/98af65a9e13b2197f105545ed9b9299d_Jvoju9FNDvqD.jpg"},
      {"id": 3, "groundId": 1, "pictureUrl": "http://i2.imgtong.com/1504/98af65a9e13b2197f105545ed9b9299d_Jvoju9FNDvqD.jpg"}
    ];*/

    return (
      <ScrollView style={{"flex": 1}} contentContainerStyle={styles.container}>
        <Text style={styles.name}>
          {ground.name}
        </Text>
        <Text style={styles.addr}>
          {ground.address}
        </Text>
        <Carousel
          ref={(c) => {
            this._carousel = c;
          }}
          data={images}
          renderItem={this.renderImage}
          sliderWidth={sliderWidth}
          slideStyle={styles.carousel}
          itemWidth={sliderWidth}
          onSnapToItem={(index) => {
            this.setState({"activeSlide": index});
          }}
        />
        <View style={{
            "width": maxWidth,
            "flexDirection": "row",
            "justifyContent": "space-between",
            "alignItems": "center"
        }}>
          <Pagination
            dotsLength={images.length}
            activeDotIndex={this.state.activeSlide}
          />
          <Text style={styles.unit}>
            {ground.unit} VS {ground.unit}
          </Text>
        </View>
        <View style={styles.icons}>
          <IndoorIcon value={ground.indoor}/>
          <ParkIcon value={ground.park}/>
          <LightIcon value={ground.light}/>
        </View>
        <View style={styles.icons}>
          <UrlIcon value={ground.url}/>
          <PhoneIcon value={ground.phone}/>
        </View>
        <MapView
          initialRegion={this.state.initialRegion}
          onRegionChange={this.onRegionChange}
          style={styles.mapView}>
          <Marker
            title={this.props.item.name}
            coordinate={{
              "latitude": this.lat,
              "longitude": this.long
            }}
          />
        </MapView>
      </ScrollView>

    );
  }

}

const maxWidth = Dimensions.get("window").width;
const fontSize = 20;
const marginTop = 10;
const shortMarginBottom = 5;
const longMarginBottom = 20;
const shortMarginLeft = 20;
const longMarginLeft = 40;
const marginRight = 20;

const sliderWidth = maxWidth;
const sliderHieght = 200;

const styles = StyleSheet.create({
  "container": {
    "alignItems": "flex-start",
    "justifyContent": "flex-start",
    "backgroundColor": "white"
  },
  "name": {
    "fontSize": fontSize,
    "fontWeight": "bold",
    "color": "black",
    "marginTop": marginTop,
    "marginBottom": shortMarginBottom,
    "marginLeft": shortMarginLeft
  },
  "addr": {
    "marginBottom": longMarginBottom,
    "marginLeft": longMarginLeft
  },
  "unit": {
    "fontSize": fontSize,
    "fontWeight": "bold",
    "color": "black",
    "marginRight": marginRight
  },
  "phone": {
    "marginLeft": longMarginLeft,
    "marginBottom": longMarginBottom
  },
  "url": {
    "marginLeft": longMarginLeft,
    "marginBottom": longMarginBottom
  },
  "label": {
    "fontWeight": "bold",
    "marginLeft": shortMarginLeft,
    "marginBottom": shortMarginBottom
  },
  "carousel": {
    "width": sliderWidth,
    "height": sliderHieght,
    "marginBottom": shortMarginBottom,
    "backgroundColor": "black"
  },
  "image": {
    "width": sliderWidth,
    "height": sliderHieght,
    "resizeMode": "stretch"
  },
  "icons": {
    "width": maxWidth,
    "flexDirection": "row",
    "justifyContent": "space-between",
    "paddingLeft": 50,
    "paddingRight": 50,
    "marginBottom": longMarginBottom
  },
  "mapView": {
    "width": maxWidth,
    "height": 300,
    "marginBottom": longMarginBottom*2
  }
});

export default App;
