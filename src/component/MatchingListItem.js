
import React, {Component} from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Button,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import moment from "moment";
import {Actions} from "react-native-router-flux";
import Interpreter from '../utility/Interpreter';


class App extends Component {

  static propTypes = {
    "item": PropTypes.shape({}).isRequired
  }

  constructor(){
    super();
    this.interP = new Interpreter();
  }

  render(){
    // 수정되야 한다
    let matching = this.props.item;
    let homeTeam = matching.homeTeam;
    let ground = matching.ground;
    let source;
    if(homeTeam.pictureUrl == null){
      source = require("../image/defaultTeamImage.jpg");
    }else{
      source = {"uri": homeTeam.pictureUrl};
    }
    return (
      <ImageBackground source={source} style={styles.imageBackground}>
        <TouchableOpacity style={styles.touchable} onPress={() => Actions.matchingDetail({"item": matching})}>
          <View style={styles.colsWrapper}>
            <View style={styles.leftCol}>
              <Text style={styles.bigText}>
                {moment(matching.start).format("HH:mm")}~{moment(matching.end).format("HH:mm")}
              </Text>
              <Text style={styles.bigText}>
                {matching.playerNumber} vs {matching.playerNumber}
              </Text>
              <Text style={styles.bigText} numberOfLines={1}>
                홈팀 | {homeTeam.name}
              </Text>
              <Text style={styles.smallText}>
                연령대 | {homeTeam.ageGroup}
              </Text>
            </View>
            <View style={styles.rightCol}>
              <Text style={styles.bigText} numberOfLines={1}>
                {ground.name}
              </Text>
              <Text style={styles.smallText} numberOfLines={1}>
                {ground.address}
              </Text>
              <Text style={styles.smallText}>
                가격 | {this.interP.interpretPrice(matching.price)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </ImageBackground>
    );
  }

}

const maxWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  "imageBackground": {
    "width": maxWidth,
    "height": 200,
    "marginTop": 10,
    "marginBottom": 10
  },
  "touchable": {
    "flex": 1
  },
  "colsWrapper": {
    "flex": 1,
    "flexDirection": "row",
    "padding": 10,
    "backgroundColor": "rgba(0,0,0,0.1)"
  },
  "leftCol": {
    "flex": 2,
    "alignItems": "flex-start",
    "justifyContent": "flex-start"
  },
  "rightCol": {
    "flex": 1,
    "alignItems": "flex-end",
    "justifyContent": "flex-start"
  },
  "bigText": {
    "fontSize": 16,
    "color": "white"
  },
  "smallText": {
    "fontSize": 14,
    "color": "rgba(255,255,255,0.54)"
  }
});

export default App;
