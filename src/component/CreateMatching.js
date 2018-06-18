
import React, {Component} from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
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
import DateTimePicker from "react-native-modal-datetime-picker";
import Fetcher from "../utility/Fetcher";
import Interpreter from "../utility/Interpreter";
import {SearchIcon, CheckedIcon} from "../icon/Icons";

// ---------------------------------------------------------------------------------------------------------------------------------------------------

class App extends Component {

  constructor(props){
    super(props);
    this.props.globalState.selectedGround = null;
    this.intP = new Interpreter();
    this.state = {
      "myTeams": null,
      "index": 0,
      "date": null,
      "isDateTimePickerVisible": false,
      "time": [5*2, 15*2],
      "playerNumber": [6],
      "price": "0"
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

  showDateTimePicker = () => {
    this.setState({
      "isDateTimePickerVisible": true
    });
  };

  hideDateTimePicker = () => {
    this.setState({
      "isDateTimePickerVisible": false
    });
  };

  handleDatePicked = (date) => {
    this.setState({
      "date": date
    });
    this.hideDateTimePicker();
  };

  getBody = (state) => {
    let body = {};
    body["homeTeam"] = state.myTeams[state.index];
    body["ground"] = this.props.globalState.selectedGround;
    let matching = {};
    let start = state.date;
    start.setHours(Math.floor(state.time[0]/2));
    start.setMinutes(state.time[0]%2 === 0 ? 0 : 30);
    body["start"] = start;
    let end = new Date(start.getTime());
    end.setHours(Math.floor(state.time[1]/2));
    end.setMinutes(state.time[1]%2 === 0 ? 0 : 30);
    body["end"] = end;
    let playerNumber = state.playerNumber[0];
    body["playerNumber"] = playerNumber;
    let price = state.price;
    if(price == null){
      price = 0;
    }
    body["price"] = parseInt(price);
    return body;

  };

  validate = () => {
    let ground = this.props.globalState.selectedGround;
    let date = this.state.date;
    if(ground == null || date == null){
      return false;
    }else{
      return true;
    }
  };

  alert = () => {
    if(this.validate() !== false){
      Alert.alert(
        "매치를 생성하시겠습니까?",
        "",
        [
          {"text": "취소", onPress: () => {}},
          {"text": "매치 생성", onPress: () => this.createMatching()}
        ],
        {"cancelable": true}
      );
    }
  };

  createMatching = async () => {
    try{
      let jwt = await AsyncStorage.getItem("jwt");
      if(jwt != null){
        let fetcher = new Fetcher();
        let body = this.getBody(this.state);
        let response = await fetcher.fetch("POST", "matching", jwt, body);
        if(response.status === 200){
          Actions.pop();
          Actions.refresh({"key": "matching"});
        }
      }
    }catch(err){
      console.error(err);
    }
  };

  render(){
    let myTeams = this.state.myTeams;
    if(myTeams == null){
      return null
    }
    return (
      <KeyboardAwareScrollView
        style={{"flex": 1, "backgroundColor": "white"}}
        contentContainerStyle={{"justifyContent": "flex-start"}}>
        <View style={styles.container}>
          <Text style={[styles.label, {"marginBottom": 0}]}>
            팀명
          </Text>
          <Picker
            selectedValue={myTeams[this.state.index]}
            onValueChange={(v, i) => {
              this.setState({"index": i});
            }}
            style={styles.picker}>
            {this.getPickerItems(myTeams)}
          </Picker>
          <Text style={styles.label}>
            구장
          </Text>
          <TouchableOpacity
            onPress={() => {
              Actions.inputGround();
            }}
            style={styles.ground}>
            <Text style={{"fontSize": 16}}>
              {this.props.globalState.selectedGround == null ? "구장 선택" :  this.props.globalState.selectedGround.name}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.message, {"color": "red"}]}>
            {this.props.globalState.selectedGround == null ? "구장을 입력 바랍니다" : ""}
          </Text>
          <Text style={styles.label}>
            날짜
          </Text>
          <TouchableOpacity
            onPress={this.showDateTimePicker}
            style={styles.date}>
            <Text style={{"fontSize": 16}}>
              {this.state.date === null ? "날짜 선택" :  moment(this.state.date).format("YYYY-MM-DD")}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.message, {"color": "red"}]}>
            {this.state.date == null ? "날짜를 입력 바랍니다" : ""}
          </Text>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            minimumDate={new Date()}
          />
          <Text style={styles.label}>
            시간
          </Text>
          <Text style={styles.slideResult}>
            {this.intP.interpretTime(this.state.time)}
          </Text>
          <MultiSlider
            values={this.state.time}
            min={0}
            max={24*2}
            onValuesChange={(value) => {
              this.setState({"time": value});
            }}
            containerStyle={styles.slider}
            sliderLength={200}
          />
          <Text style={styles.label}>
            인원
          </Text>
          <Text style={styles.slideResult}>
            {this.state.playerNumber}명
          </Text>
          <MultiSlider
            values={this.state.playerNumber}
            min={3}
            max={11}
            onValuesChange={(value) => {
              this.setState({"playerNumber": value});
            }}
            containerStyle={styles.slider}
            sliderLength={200}
          />
          <Text style={styles.label}>
            가격
          </Text>
          <Text style={styles.slideResult}>
            {this.intP.interpretPrice(this.state.price)}
          </Text>
          <TextInput
            value={this.state.price}
            onChangeText={(text) => {
              this.setState({"price": text});
            }}
            style={styles.price}
            maxLength={6}
            keyboardType="numeric"
            underlineColorAndroid={"transparent"}
          />
          <Button title="매치를 생성합니다" onPress={() => this.alert()}/>
        </View>
      </KeyboardAwareScrollView>
    );
  }

}

const maxWidth = Dimensions.get("window").width;
const fontSize = 18;
const padding = 40;
const marginLeft = 10;
const shorMarginBottom = 10;
const longMarginBottom = 10;

const styles = StyleSheet.create({
  "container": {
    "width": maxWidth,
    "alignItems": "flex-start",
    "padding": padding,
    "backgroundColor": "white"
  },
  "label": {
    "fontSize": fontSize,
    "fontWeight": "bold",
    "marginBottom": shorMarginBottom,
    "color": "black"
  },
  "picker": {
    "width": 200,
    "marginLeft": marginLeft
  },
  "ground": {
    "marginLeft": marginLeft
  },
  "date": {
    "marginLeft": marginLeft
  },
  "slideResult": {
    "marginLeft": marginLeft,
    "marginBottom": shorMarginBottom
  },
  "slider": {
    "height": 24,
    "alignItems": "flex-start",
    "justifyContent": "center",
    "marginLeft": marginLeft,
    "marginBottom": longMarginBottom
  },
  "price": {
    "width": 200,
    "alignItems": "flex-end",
    "paddingVertical": 0,
    "borderBottomWidth": 1,
    "borderBottomColor": "green",
    "marginLeft": marginLeft,
    "marginBottom": longMarginBottom*2
  },
  "message": {
    "fontSize": 10,
    "marginLeft": marginLeft,
    "marginBottom": longMarginBottom
  }
});

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
