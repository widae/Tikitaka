
import React, {Component} from "react";
import moment from "moment";
import PropTypes from "prop-types";
import {
  View,
  ScrollView,
  Text,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  AsyncStorage,
  Alert
} from "react-native";
import {connect} from "react-redux";
import {Actions} from "react-native-router-flux";
import RadioForm from 'react-native-simple-radio-button';
import Fetcher from "../utility/Fetcher";
import Interpreter from "../utility/Interpreter";

// ---------------------------------------------------------------------------------------------------------------------------------------------------


class App extends Component{

  constructor(){
    super();
    this.interP = new Interpreter();
    this.state = {
      "myTeams": null,
      "index": 0
    }
  }

  componentWillMount(){
    this.makeRemoteRequest();
  }

  makeRemoteRequest = async () => {
    try{
      let jwt = await AsyncStorage.getItem("jwt");
      if(jwt != null){
        let fetcher = new Fetcher();
        let response = await fetcher.fetch("GET", "team", jwt, null);
        if(response.status === 200){
          let myTeams = await response.json();
          if(myTeams.length !== 0){
            this.setState({
              "myTeams": myTeams
            });
          }else{
            Alert.alert(
              "생성된 팀이 없습니다!",
              "팀 생성 후 이용하실 수 있습니다",
              [
                {"text": "이전 화면으로", onPress: () => {
                  Actions.pop();
                }},
                {"text": "팀 생성", onPress: () => {
                  Actions.pop();
                  Actions.jump("myTeams");
                }}
              ],
              {"cancelable": false}
            );
          }
        }
      }
    }catch(err){
      console.error(err);
    }
  };

  getPickerItems = (myTeams) => {
    let pickerItems = myTeams.map((team, index) =>
      <Picker.Item key={index} value={team} label={team.name}/>
    );
    return pickerItems;
  };

  getRadioProps = () => {
    let myTeams = this.state.myTeams;
    let radio_props = [];
    for(let i = 0; i < myTeams.length; i++){
      let tmp = [{
        "label": myTeams[i].name,
        "value": i
      }];
      radio_props = radio_props.concat(tmp);
    }
    return radio_props;
  }

  handleSubmit = async () => {
    try{
      let jwt = await AsyncStorage.getItem("jwt");
      if(jwt != null){
        let fetcher = new Fetcher();
        let possible = JSON.parse(JSON.stringify(this.props.item));
        possible.awayTeam = this.state.myTeams[this.state.index];
        let response = await fetcher.fetch("POST", "fcm/notifyApply", jwt, possible);
        let status = response.status;
        if(status === 200){
          Actions.pop();
          Actions.refresh("matching");
        }else if(status === 409){
          Alert.alert(
            "신청 불가",
            "이미 신청하셨습니다",
            [
              {"text": "확인", onPress: () => {

              }}
            ],
            {"cancelable": true}
          );
        }
      }
    }catch(err){
      console.error(err);
    }
  };


  render(){
    if(this.state.myTeams === null){
      return null;
    }
    let matching = this.props.item;
    let homeTeam = matching.homeTeam;
    let awayTeam = this.state.myTeams[this.state.index];
    let source;
    if(homeTeam.pictureUrl != null){
      source = {"uri": homeTeam.pictureUrl};
    }else{
      source = require("../image/defaultTeamImage.jpg");
    }
    let ground = matching.ground;
    return (
      <ScrollView style={styles.scrollView}>
        <Image source={source} style={styles.image}/>
        <View style={styles.container}>
          <Text style={styles.text}>
            {moment(matching.start).format("YYYY-MM-DD")}
          </Text>
          <Text style={[styles.text, {"marginBottom": marginBottom}]}>
            {moment(matching.start).format("HH:mm")}~{moment(matching.end).format("HH:mm")}
          </Text>
          <View style={styles.row}>
            <Text style={[styles.text, {"flex": 1}]}>
              인원수: {matching.playerNumber}VS{matching.playerNumber}
            </Text>
            <Text style={[styles.text, {"flex": 1}]}>
              가격: {this.interP.interpretPrice(matching.price)}
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.label}>
            <Text style={[styles.text, {"fontSize": fontSize, "color": "white"}]} numberOfLines={1}>
              Home Team: {homeTeam.name}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.text, {"flex": 1}]}>
              실력: {this.interP.interpretLevel(homeTeam.level)}
            </Text>
            <Text style={[styles.text, {"flex": 1}]}>
              연령대: {homeTeam.ageGroup}
            </Text>
          </View>
          <View style={styles.box}>
            <Text>
              {homeTeam.description}
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.label}>
            <Text style={[styles.text, {"fontSize": fontSize, "color": "white"}]} numberOfLines={1}>
              {ground.name}
            </Text>
          </View>
          <Text style={[styles.text, {"marginBottom": marginBottom}]}>
            {ground.address}
          </Text>
          <View style={[styles.row, {"justifyContent": "flex-end"}]}>
            <Button
              title="구장 상세 보기"
              onPress={()=> {
                Actions.groundDetailForMatching({"item": ground});
              }}
              style={styles.button}
            />
          </View>
        </View>
        <View style={[styles.container, {"marginBottom": 40}]}>
          <View style={styles.label}>
            <Text style={[styles.text, {"fontSize": fontSize, "color": "white"}]} numberOfLines={1}>
              Away Team: {awayTeam.name}
            </Text>
          </View>
          <RadioForm
            radio_props={this.getRadioProps()}
            initial={0}
            onPress={(value) => {
              this.setState({"index": value});
            }}
            style={styles.radioForm}
            buttonColor={color}
            selectedButtonColor={color}
            buttonSize={10}
          />
          <View style={[styles.row, {"justifyContent": "flex-end"}]}>
            <Button
              title="매칭 신청하기"
              onPress={this.handleSubmit}
              style={styles.button}
            />
          </View>
        </View>
      </ScrollView>
    );
  }

}

const maxWidth = Dimensions.get("window").width;
const paddingHorizontal = 20;
const borderWidth = 1;
const marginLeft = 20;
const marginBottom = 10;
const fontSize = 12;
const radius = fontSize;
const color = "rgba(63,81,181,100)";

const styles = StyleSheet.create({
  "scrollView": {
    "flex": 1,
    "backgroundColor": "white"
  },
  "image": {
    "width": maxWidth,
    "height": 200
  },
  "container": {
    "width": maxWidth,
    "paddingTop": 20,
    "paddingHorizontal": paddingHorizontal,
    "backgroundColor": "white"
  },
  "row": {
    "width": maxWidth - paddingHorizontal*2,
    "flexDirection": "row",
    "justifyContent": "flex-start",
    "alignItems": "center",
    "marginBottom": marginBottom
  },
  "label": {
    "width": maxWidth - paddingHorizontal*2,
    "alignItems": "center",
    "justifyContent": "center",
    "paddingVertical": 5,
    "backgroundColor": color,
    "borderTopLeftRadius": radius,
    "borderBottomLeftRadius": radius,
    "marginBottom": marginBottom
  },
  "box": {
    "width": maxWidth - paddingHorizontal*2 -borderWidth*2,
    "height": 100,
    "alignItems": "flex-start",
    "justifyContent": "flex-start",
    "padding": 5,
    "borderWidth": borderWidth,
    "borderColor": "black"
  },
  "text": {
    "justifyContent": "center",
    "fontSize": 16,
    "color": "black"
  },
  "radioForm": {
    "alignItems": "flex-start",
    "marginBottom": 20
  },
  "buttonWrapper": {
    "marginTop": 10,
    "marginBottom": 40
  },
  "border": {
    "width": maxWidth,
    "height": 0,
    "borderTopWidth": 1,
    "borderColor": "red"
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
