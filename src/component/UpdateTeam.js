
import React, {Component} from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  ScrollView,
  TextInput,
  Picker,
  StyleSheet,
  Alert,
  Dimensions,
  AsyncStorage
} from "react-native";
import {connect} from "react-redux";
import moment from "moment";
import {Actions} from "react-native-router-flux";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import ImagePicker from "react-native-image-picker"
import DateTimePicker from "react-native-modal-datetime-picker";
import Fetcher from "../utility/Fetcher";
import Interpreter from "../utility/Interpreter";
import {SearchIcon, CheckedIcon} from "../icon/Icons";

// ---------------------------------------------------------------------------------------------------------------------------------------------------

class App extends Component {

  static propTypes = {
    "team": PropTypes.shape({}).isRequired
  };

  constructor(props){
    // this.props.team 사용 가능
    super(props);
    this.interP = new Interpreter();
    let team = this.props.team;
    let ageGroup;
    // "photo": null 중요함
    this.state = {
      "photo": null,
      "name": team.name,
      "level": [parseInt(team.level)],
      "ageGroup": [this.getAgeGroup(team.ageGroup)],
      "description": team.description
    }
  }

  getAgeGroup = (str) => {
    let ageGroup;
    let arr = str.split("0대 ");
    let deciderA = parseInt(arr[0]);
    let deciderB = arr[1];
    ageGroup = (deciderA-1)*3;
    if(deciderB === "초반"){
      ageGroup += 0;
    }else if(deciderB === "중반"){
      ageGroup += 1;
    }else{
      ageGroup += 2;
    }
    return ageGroup;
  };

// ---------------------------------------------------------------------------------------------------------------------------------------------------

  showImagePicker = (item) => {
    let options = {
      "title": "이미지 선택",
      "takePhotoButtonTitle": "사진 촬영",
      "chooseFromLibraryButtonTitle": "앨범에서 선택",
      "storageOptions": {
        "skipBackup": true,
        "path": "images"
      }
    };
    ImagePicker.showImagePicker(options, async (photo) => {
      if(photo.didCancel){

      }else if(photo.error){

      }else if(photo.customButton){

      }else {
        this.setState({
          "photo": photo
        });
      }
    });
  };

  alert = () => {
    Alert.alert(
      "팀을 수정하시겠습니까?",
      "",
      [
        {"text": "취소", onPress: () => {}},
        {"text": "팀 수정", onPress: () => this.updateTeam()}
      ],
      {"cancelable": true}
    );
  };

  getBody = () => {
    let body = this.props.team;
    body.level = this.state.level[0];
    body.ageGroup = this.interP.interpretAgeGroup(this.state.ageGroup[0]);
    body.description = this.state.description;
    return body;
  };

  updateTeam = async () => {
    try{
      let jwt = await AsyncStorage.getItem("jwt");
      if(jwt != null){
        let fetcher = new Fetcher();
        let body = this.getBody();
        let response = await fetcher.fetch("PUT", "team", jwt, body);
        if(response.status === 200){
          if(this.state.photo !== null){
            let teamId = this.props.team.id;
            response = await fetcher.upload("team", teamId, this.state.photo);
            if(response.status === 200){
              Actions.pop();
              Actions.refresh({"key": "myTeams"});
            }
          }else{
            Actions.pop();
            Actions.refresh({"key": "myTeams"});
          }
        }
      }
    }catch(err){
      console.error(err);
    }
  };

  render(){

    let source;
    let pictureUrl = this.props.team.pictureUrl;
    let photo = this.state.photo;

    // 사실 3 경우가 있지만 이해하기 쉬움
    if(pictureUrl == null){
      if(photo == null){
        source = require("../image/defaultTeamImage.jpg");
      }else{
        source = {"uri": this.state.photo.uri};
      }
    }else{
      if(photo == null){
        source = {"uri": pictureUrl};
      }else{
        source = {"uri": this.state.photo.uri};
      }
    }

    return (
      <KeyboardAwareScrollView style={{"flex": 1, "backgroundColor": "white"}} contentContainerStyle={{"justifyContent": "flex-start"}}>
        <View style={styles.container}>
          {/* 1 -------------------------------------------------------------------------------------------------- */}
          <View style={styles.imageWrapper}>
            <TouchableHighlight onPress={() => this.showImagePicker()}>
              <Image source={source} style={styles.image}/>
            </TouchableHighlight>
          </View>
          {/* 2 -------------------------------------------------------------------------------------------------- */}
          <Text style={styles.label}>
            팀명
          </Text>
          <TextInput
            value={this.state.name}
            editable={false}
            style={styles.inputName}
            underlineColorAndroid={"transparent"}
            maxLength={10}
          />
          <Text style={styles.message}>
            참고: 이름은 수정할 수 없습니다
          </Text>
          <Text style={styles.label}>
            실력
          </Text>
          <Text style={styles.slideResult}>
            {this.interP.interpretLevel(this.state.level[0])}
          </Text>
          <MultiSlider
            values={this.state.level}
            min={0}
            max={4}
            onValuesChange={(value) => {
              this.setState({"level": value});
            }}
            containerStyle={styles.slider}
            sliderLength={200}
          />
          {/* 3 -------------------------------------------------------------------------------------------------- */}
          <Text style={styles.label}>
            연령대
          </Text>
          <Text style={styles.slideResult}>
            {this.interP.interpretAgeGroup(this.state.ageGroup[0])}
          </Text>
          <MultiSlider
            values={this.state.ageGroup}
            min={0}
            max={14}
            onValuesChange={(value) => {
              this.setState({"ageGroup": value});
            }}
            containerStyle={styles.slider}
            sliderLength={200}
          />
          {/* 4 -------------------------------------------------------------------------------------------------- */}
          <Text style={[styles.label, {"marginBottom": 0}]}>
            팀 설명
          </Text>
          <View style={styles.wrapper}>
            <Text>
              {this.state.description.length}/80
            </Text>
          </View>
          <TextInput
            value={this.state.description}
            onChangeText={(text) => {
              this.setState({"description": text});
            }}
            style={styles.description}
            underlineColorAndroid={"transparent"}
            maxLength={80}
            multiline
          />
          {/* 5 -------------------------------------------------------------------------------------------------- */}
          <Button title="팀을 수정합니다" onPress={() => this.alert()}/>
        </View>
      </KeyboardAwareScrollView>
    );

  }

}

// ---------------------------------------------------------------------------------------------------------------------------------------------------

const maxWidth = Dimensions.get("window").width;
const fontSize = 18;
const padding = 40;
const marginLeft = 10;
const shortMarginBottom = 10;
const longMarginBottom = 10;
const borderWidth = 1;

const styles = StyleSheet.create({
  "container": {
    "width": maxWidth,
    "alignItems": "flex-start",
    "padding": padding
  },
  "label": {
    "fontSize": fontSize,
    "fontWeight": "bold",
    "marginBottom": shortMarginBottom,
    "color": "black"
  },
  "picker": {
    "width": 200,
    "height": 18,
    "marginLeft": marginLeft
  },
  "row": {
    "flexDirection": "row",
    "justifyContent": "flex-start",
    "alignItems": "center"
  },
  "inputName": {
    "width": 200,
    "paddingVertical": 0,
    "borderBottomWidth": 1,
    "borderBottomColor": "green",
    "marginLeft": marginLeft
  },
  "message": {
    "fontSize": 10,
    "color": "blue",
    "marginLeft": marginLeft,
    "marginBottom": longMarginBottom
  },
  "slideResult": {
    "marginLeft": marginLeft,
    "marginBottom": shortMarginBottom
  },
  "slider": {
    "height": 24,
    "alignItems": "flex-start",
    "justifyContent": "center",
    "marginLeft": marginLeft,
    "marginBottom": longMarginBottom
  },
  "wrapper": {
    "width": maxWidth - padding*2 - borderWidth,
    "alignItems": "flex-end"
  },
  "description": {
    "width": maxWidth - padding*2 - borderWidth*2,
    "height": 100,
    "borderWidth": 1,
    "borderColor": "green",
    "marginBottom": longMarginBottom,
    "textAlignVertical": "top"
  },
  "image": {
    "width": 100,
    "height": 100,
    "borderRadius": 100
  },
  "imageWrapper": {
    "width": maxWidth - padding*2,
    "alignItems": "center",
    "marginBottom": longMarginBottom*3
  }
});

// ---------------------------------------------------------------------------------------------------------------------------------------------------

function mapStateToProps(state){
  return {"globalState": state};
}

function mapDispatchToProps(dispatch){
  return {
    updateGlobalState: (data) => {
      dispatch({"type": "UPDATE", data});
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
