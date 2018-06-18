
import React, {Component} from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Image,
  Linking
} from "react-native";
import {Icon} from "react-native-elements";
import Communications from "react-native-communications";

export class DeleteIcon extends Component {
    render() {
      	return (
          <View style={{"flex": 1, "alignItems": "center", "justifyContent": "center", "backgroundColor": "rgba(255,0,0,0.5)"}}>
            <Icon name='delete' size={28}/>
          </View>
      	);
    }
}

export class DetailIcon extends Component {
    render() {
      	return (
          <View style={{"flex": 1, "alignItems": "center", "justifyContent": "center"}}>
            <Icon name='navigate-next' size={28}/>
          </View>
      	);
    }
}

export class MatchIcon extends Component {
    render() {
      	return (
          <Image source={require("../image/matches.png")} style={{"width": 28, "height": 28}}/>
      	);
    }
}

export class MyTeamIcon extends Component {
    render() {
      	return (
          <Icon name='group' size={28}/>
      	);
    }
}

export class GroundIcon extends Component {
    render() {
      	return (
          <Icon name='place' size={28}/>
      	);
    }
}

export class AddBoxIcon extends Component {
    render() {
      	return (
          <Icon name="add-box" size={200}/>
      	);
    }
}

export class UpdateIcon extends Component {
    render() {
      	return (
          <Icon name='create' size={20}/>
      	);
    }
}

export class SearchIcon extends Component{
    render() {
      	return (
          <Icon name="search" size={10}/>
      	);
    }
}

export class CheckedIcon extends Component{
    render() {
      	return (
          <Icon name="check-circle" size={10}/>
      	);
    }
}


export class IndoorIcon extends Component{

  static propTypes = {
    "value": PropTypes.number.isRequired
  }

  render(){

    let desc;
    let show;
    let reverse;
    if(this.props.value == 1){
      desc = "실내 풋살장";
      show = 0;
      reverse = false;
    }else{
      desc = "실외 풋살장";
      show = 10;
      reverse = true;
    }

  	return (
      <View style={{"alignItems": "center"}}>
        <Icon name="input" size={25} reverse/>
        <Icon
          name="clear"
          containerStyle={{
            "position": "absolute",
            "top": 0,
            "right": 0,
            "backgroundColor": "red",
          }}
          size={show}
          reverse={reverse}/>
        <Text>
          {desc}
        </Text>
      </View>
  	);

  }

}

export class ParkIcon extends Component{

  static propTypes = {
    "value": PropTypes.number.isRequired
  }

  render(){

    let desc;
    let show;
    let reverse;
    if(this.props.value == 1){
      desc = "주차 가능";
      show = 0;
      reverse = false;
    }else{
      desc = "주차 불가";
      show = 10;
      reverse = true;
    }

  	return (
      <View style={{"alignItems": "center"}}>
        <Icon name="directions-car" size={25} reverse/>
        <Icon
          name="clear"
          containerStyle={{
            "position": "absolute",
            "top": 0,
            "right": 0,
            "backgroundColor": "red",
          }}
          size={show}
          reverse={reverse}/>
        <Text>
          {desc}
        </Text>
      </View>
  	);

  }

}

export class LightIcon extends Component{

  static propTypes = {
    "value": PropTypes.number.isRequired
  }

  render(){

    let desc;
    let show;
    let reverse;
    if(this.props.value == 1){
      desc = "조명 있음";
      show = 0;
      reverse = false;
    }else{
      desc = "조명 없음";
      show = 10;
      reverse = true;
    }

  	return (
      <View style={{"alignItems": "center"}}>
        <Icon name="wb-incandescent" size={25} reverse/>
        <Icon
          name="clear"
          containerStyle={{
            "position": "absolute",
            "top": 0,
            "right": 0,
            "backgroundColor": "red"
          }}
          size={show}
          reverse={reverse}/>
        <Text>{desc}</Text>
      </View>

  	);
  }

}

export class UrlIcon extends Component{

  static propTypes = {
    "value": PropTypes.number.isRequired
  }

  render(){

    let desc;
    let show;
    let reverse;
    if(this.props.value != null){
      desc = "사이트 이동";
      show = 0;
      reverse = false;
    }else{
      desc = "사이트 없음";
      show = 10;
      reverse = true;
    }

  	return (
      <View style={{"alignItems": "center"}}>
        <Icon
          name="web"
          onPress={() => {
            if(this.props.value != null){
                Linking.openURL(this.props.value);
            }
          }}
          size={25}
          reverse/>
        <Icon
          name="clear"
          containerStyle={{
            "position": "absolute",
            "top": 0,
            "right": 0,
            "backgroundColor": "red"
          }}
          size={show}
          reverse={reverse}/>
        <Text>{desc}</Text>
      </View>

  	);
  }

}

export class PhoneIcon extends Component{

  static propTypes = {
    "value": PropTypes.number.isRequired
  }

  render(){

    let desc;
    let show;
    let reverse;
    if(this.props.value != null){
      desc = "연락하기";
      show = 0;
      reverse = false;
    }else{
      desc = "연락처 없음";
      show = 10;
      reverse = true;
    }

  	return (
      <View style={{"alignItems": "center"}}>
        <Icon
          name="phone"
          onPress={() => {
            if(this.props.value != null){
                Communications.phonecall(this.props.value, true)
            }
          }}
          size={25}
          reverse/>
        <Icon
          name="clear"
          containerStyle={{
            "position": "absolute",
            "top": 0,
            "right": 0,
            "backgroundColor": "red"
          }}
          size={show}
          reverse={reverse}/>
        <Text>{desc}</Text>
      </View>

  	);
  }

}
