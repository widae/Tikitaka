
import React, {Component} from "react";
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

  constructor(props){
    super(props);
    let interpreter = new Interpreter();
    this.interpretAgeGroup = interpreter.interpretAgeGroup;
    this.interpretLevel = interpreter.interpretLevel;
    this.state = {
      "photo": null,
      "name": null,
      "exist": null,
      "level": [3],
      "ageGroup": [7],
      "description": ""
    }
  }

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

  checkExist = async (name) => {
    try{
      let jwt = await AsyncStorage.getItem("jwt");
      if(jwt != null){
        let fetcher = new Fetcher();
        let response = await fetcher.fetch("GET", "team/checkExist?name=" + name, jwt, null);
        if(response.status === 200){
          let exist = await response.json();
          this.setState({
            "exist":  exist
          });
        }
      }
    }catch(err){
      console.error(err);
    }
  };

  getMessage = () => {
    if(this.state.exist === null){
      return "팀 이름을 입력 바랍니다";
    }else if(this.state.exist === true){
      return "같은 이름이 존재합니다";
    }else{
      return "사용 가능합니다";
    }
  };

  validate = () => {
    let exist = this.state.exist;
    if(exist == true || exist == null){
      return false;
    }else{
      return true;
    }
  };

  alert = () => {
    if(this.validate() !== false){
      Alert.alert(
        "팀을 생성하시겠습니까?",
        "",
        [
          {"text": "취소", onPress: () => {}},
          {"text": "팀 생성", onPress: () => this.createTeam()}
        ],
        {"cancelable": true}
      );
    }
  };

  getBody = () => {
    let body = {
      "name": this.state.name,
      "level": this.state.level[0],
      "ageGroup": this.interpretAgeGroup(this.state.ageGroup[0]),
      "description": this.state.description
    };
    return body;
  };

  createTeam = async () => {
    try{
      let jwt = await AsyncStorage.getItem("jwt");
      if(jwt != null){
        let fetcher = new Fetcher();
        let body = this.getBody();
        console.log(body);
        let response = await fetcher.fetch("POST", "team", jwt, body);
        if(response.status === 200){
          if(this.state.photo !== null){
            let team = await response.json();
            response = await fetcher.upload("team", team.id, this.state.photo);
            if(response.status === 200){
              Actions.pop();
              Actions.refresh("myTeams");
            }
          }else{
            Actions.pop();
            Actions.refresh("myTeams");
          }
        }
      }
    }catch(err){
      console.error(err);
    }
  };

  render(){

    let source;
    if(this.state.photo == null){
      source = require("../image/defaultTeamImage.jpg");
    }else{
      source = {"uri": this.state.photo.uri};
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
          <Text style={styles.label}>
            팀명*
          </Text>
          <TextInput
            value={this.state.name}
            onChangeText={(text) => {
              if(text == null || text === ""){
                this.setState({"exist": null});
                this.setState({"name": text});
              }else{
                this.setState({"name": text});
                this.checkExist(text);
              }
            }}
            style={styles.inputName}
            underlineColorAndroid={"transparent"}
            maxLength={10}
          />
          <Text style={[styles.message, {"color": this.state.exist === true || this.state.exist === null ? "red" : "blue"}]}>
            {this.getMessage()}
          </Text>
          {/* 2 -------------------------------------------------------------------------------------------------- */}
          <Text style={styles.label}>
            실력
          </Text>
          <Text style={styles.slideResult}>
            {this.interpretLevel(this.state.level[0])}
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
            {this.interpretAgeGroup(this.state.ageGroup[0])}
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
          <Button title="팀을 생성합니다" onPress={() => this.alert()}/>
        </View>
      </KeyboardAwareScrollView>
    );

  }

}

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
