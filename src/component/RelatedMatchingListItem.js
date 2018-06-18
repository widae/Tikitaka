
import React, {Component} from "react";
import PropTypes from "prop-types";
import moment from "moment";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions
} from "react-native";
import {Icon} from "react-native-elements";
import {connect} from "react-redux";
import {Actions} from "react-native-router-flux";
import Swipeout from "react-native-swipeout";
import {DeleteIcon, DetailIcon} from "../icon/Icons"

// ---------------------------------------------------------------------------------------------------------------------------------------------------

class App extends Component {

  static propTypes = {
    "matching": PropTypes.shape({}).isRequired,
    "applied": PropTypes.number.isRequired
  }

// -------------------------------------------------

  getStatus = (matching, myTeam) => {
    if(matching.awayTeam == null){
      return "대기";
    }else{
      if(matching.awayTeam.id === myTeam.id){
        return "완료";
      }else{
        return "거부";
      }
    }
  }

  showApplyList = (matching) => {
    if(matching.applies.length !== 0){
      Actions.applyList({"matching": matching});
    }else{
      Alert.alert(
        "",
        "신청 팀이 없습니다!",
        [
          {},
          {"text": "확인", onPress: () => {}}
        ],
        {"cancelable": true}
      );
    }
  };

  render(){
    let view;
    let matching = this.props.matching;
    let applies = matching.applies;
    let applied = this.props.applied;
    let homeTeam = matching.homeTeam;
    let source;
    if(homeTeam.pictureUrl == null){
      source = require("../image/defaultTeamImage.jpg");
    }else{
      source = {"uri": homeTeam.pictureUrl};
    }
    if(applied === -1){
      let buttons = [
        {
          "text": "Delete",
          "component": (<DeleteIcon/>)
        },
        {
          "text": "Detail",
          "component": (<DetailIcon/>),
          "onPress": () => {this.showApplyList(matching);}
        }
      ];
      /*--- set view ---*/
      view = (
        <Swipeout right={buttons} style={styles.swipeout}>
          <View style={styles.container}>
            <View style={styles.col1}>
              <Image source={source} style={styles.image}/>
              <Icon
                name="call-received"
                containerStyle={{
                  "position": "absolute",
                  "top": -5,
                  "right": -5,
                  "backgroundColor": "blue"
                }}
                size={10}
                reverse={true}/>
              <Text style={[styles.text, {"fontSize": 10}]}>
                {homeTeam.name}
              </Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.text}>
                {matching.ground.name}
              </Text>
              <Text style={styles.text}>
                {moment(matching.start).format("YYYY-MM-DD")}
              </Text>
              <Text style={styles.text}>
                {moment(matching.start).format("HH:mm")}~{moment(matching.end).format("HH:mm")}
              </Text>
            </View>
            <View style={styles.col3}>
              <Text style={[styles.text, {"fontSize": 10}]}>
                {matching.awayTeam !== null ? "완료("+applies.length+")" : "신청:"+applies.length}
              </Text>
            </View>
          </View>
        </Swipeout>
      );
    }else{
      let possible = applies[applied].team;
      let homeTeam = matching.homeTeam;
      let source;
      if(homeTeam.pictureUrl == null){
        source = require("../image/defaultTeamImage.jpg");
      }else{
        source = {"uri": homeTeam.pictureUrl};
      }
      let buttons = [
        {
          "text": "Delete",
          "component": <DeleteIcon/>
        }
      ];
      /*--- set view ---*/
      view = (
        <Swipeout right={buttons} style={styles.swipeout}>
        <View style={styles.container}>
            <View style={styles.col1}>
              <Image source={source} style={styles.image}/>
              <Icon
                name="call-made"
                containerStyle={{
                  "position": "absolute",
                  "top": -5,
                  "right": -5,
                  "backgroundColor": "red"
                }}
                size={10}
                reverse={true}/>
              <Text style={[styles.text, {"fontSize": 10}]}>
                {possible.name}
              </Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.text}>
                {matching.ground.name}
              </Text>
              <Text style={styles.text}>
                {moment(matching.start).format("YYYY-MM-DD")}
              </Text>
              <Text style={styles.text}>
                {moment(matching.start).format("HH:mm")}~{moment(matching.end).format("HH:mm")}
              </Text>
            </View>
            <View style={styles.col3}>
              <Text style={[styles.text, {"fontSize": 10}]}>
                {this.getStatus(matching, applies[applied].team)}
              </Text>
            </View>
          </View>
        </Swipeout>
      );
    }
    return view;
  }

}

const maxWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  "swipeout": {
    "width": maxWidth,
    "backgroundColor": "white",
    "marginVertical": 5
  },
  "container": {
    "width": maxWidth,
    "flexDirection": "row",
    "padding": 10
  },
  "col1": {
    "flex": 1,
    // width
    "alignItems": "center",
    "justifyContent": "center"
  },
  "image": {
    "width": 50,
    "height": 50,
    "borderRadius": 50
  },
  "text": {
    "fontSize": 14,
    "color": "black"
  },
  "col2": {
    "flex": 3,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "col3": {
    "flex": 1,
    "alignItems": "center",
    "justifyContent": "center"
  }
});

// ---------------------------------------------------------------------------------------------------------------------------------------------------

function mapStateToProps(state){
  return {"globalState": state};
}

function mapDispatchToProps(dispatch){
  return {
    setGlobalState: (data) => {
      dispatch({"type": "SET", data});
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
