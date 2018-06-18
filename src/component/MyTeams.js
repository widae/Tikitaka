
import React, {Component} from 'react';
import {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  StyleSheet,
  AsyncStorage,
  ScrollView,
  Dimensions,
  Image,
  ImageBackground
} from 'react-native';
import {Button} from "react-native-elements";
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import ImagePicker from 'react-native-image-picker';
import Fetcher from '../utility/Fetcher';
import Interpreter from '../utility/Interpreter';
import {AddBoxIcon} from '../icon/Icons';
import {Icon} from "react-native-elements";

const sliderWidth = Dimensions.get('window').width;
const itemWidth = sliderWidth*0.78;

class App extends Component{

  constructor(){
    super();
    this.state = {
      "myTeams": null,
      "textColor": "black",
      "activeSlide": 0
    }
  }

  componentDidMount() {
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
            this.setState({
              "myTeams": myTeams
            });
        }
      }
    }catch(err){
      console.error(err);
    }
  }

  _renderItem = ({item, index}) => {
    let myTeams = this.state.myTeams;
    let length = myTeams.length;
    if(index === length){
      return (
        <View style={styles.tmp}>
          <TouchableOpacity onPress={()=>{this.pushToStack();}}>
            <AddBoxIcon/>
          </TouchableOpacity>
          <Text style={{"marginTop": 10, "color": this.state.textColor}}>
            최대 3팀까지 생성할 수 있습니다
          </Text>
        </View>
      );
    }else{
      let source;
      if(item.pictureUrl == null){
        source = require("../image/defaultTeamImage.jpg");
      }else{
        source = {"uri": item.pictureUrl};
      }
      let interpreter = new Interpreter();
      let level = interpreter.interpretLevel(item.level);
      let ageGroup = item.ageGroup;
      return (
        <View style={styles.card}>
          <View style={[styles.row, {"backgroundColor": "rgba(63,81,181,100)"}]}>
            <View style={styles.colA}>
              <TouchableHighlight>
                <Image source={source} style={styles.cardImage}/>
              </TouchableHighlight>
              <Text style={styles.text}>
                {item.name}
              </Text>
            </View>
            <View style={styles.colB}>
              <Text style={styles.text}>
                실력: {level}
              </Text>
              <Text style={styles.text}>
                연령대: {ageGroup}
              </Text>
            </View>
          </View>
          <View style={[styles.row, styles.line, {"height": 100}]}>
            <Text style={styles.text}>
              {item.description}
            </Text>
          </View>
          <View style={[styles.row, {"justifyContent": "flex-end"}]}>
            <Icon name="create" size={12} reverse onPress={() => Actions.updateTeam({"team": item})}/>
            <Icon name="notifications" size={12} reverse onPress={() => Actions.relatedMatchingList({"selectedTeam": item})}/>
          </View>
        </View>
      );
    }
  }

  pushToStack = () => {
    let length = this.state.myTeams.length;
    if(3 <= length){
      this.setState({"textColor": "red"});
      setTimeout(() => {
          this.setState({"textColor": "black"});
      }, 1500);
    }else{
      Actions.createTeam();
    }
  };

  render(){
    let myTeams = this.state.myTeams;
    if(myTeams == null){
      return null;
    }
    let data = [];
    if(myTeams != null){
      let numOfCards = myTeams.length;
      for(let i = 0; i < numOfCards; i++){
          data.push(myTeams[i]);
      }
    }
    data.push({});
    return (
      <View style={styles.container}>
        <View>
          <Carousel
            data={data}
            renderItem={this._renderItem}
            sliderWidth={sliderWidth}
            slideStyle={styles.carousel}
            itemWidth={itemWidth}
            onSnapToItem={(index) => this.setState({"activeSlide": index })}
          />
          <Pagination
            dotsLength={data.length}
            activeDotIndex={this.state.activeSlide}
          />
        </View>
      </View>
    );
  }

}

const imageWidth = 70;

const styles = StyleSheet.create({
    "container": {
      "flex": 1,
      "alignItems": "center",
      "justifyContent": "center",
    },
    "carousel": {
      "alignItems": "center",
      "justifyContent": "center"
    },
    "card": {
      "width": itemWidth,
      "backgroundColor": "white"
    },
    "row": {
      "width": itemWidth,
      "flexDirection": "row",
      "padding": 10
    },
    "line": {
      "borderTopWidth": 1,
      "borderColor": "rgba(128,128,128, 0.5)"
    },
    "colA": {
      "width": imageWidth,
      "alignItems": "center"
    },
    "cardImage": {
      "width": imageWidth,
      "height": imageWidth,
      "borderRadius": imageWidth
    },
    "text": {
      "fontSize": 14,
      "color": "black"
    },
    "colB": {
      "justifyContent": "space-around",
      "paddingLeft": 20
    },
    "tmp": {
      "alignItems": "center"
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
