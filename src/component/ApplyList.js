
import React, {Component} from "react";
import PropTypes from "prop-types";
import moment from "moment";
import {
  View,
  Button,
  Text,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
  Dimensions,
  AsyncStorage,
  TouchableHighlight
} from "react-native";
import {connect} from "react-redux";
import {Actions} from "react-native-router-flux";
import Fetcher from "../utility/Fetcher";
import Interpreter from "../utility/Interpreter";
import RelatedMatchingListItem from "./RelatedMatchingListItem";

// ---------------------------------------------------------------------------------------------------------------------------------------------------

class App extends Component {

  static propTypes = {
    "matching": PropTypes.shape({}).isRequired
  }

  constructor(){
    super();
    this.interP = new Interpreter();
    this.state = {
      "data": [],
      "pageNum": 1,
      "refreshing" : false
    };
  }

  componentDidMount(){
    this.makeRemoteRequest();
  }

  // 변경할 수 있음
  makeRemoteRequest = async () => {
    this.setState({
      "data": this.props.matching.applies,
      "refreshing": false
    });
  };

  handleRefresh = () => {
    this.setState({
        "pageNum" : 1,
        "refreshing" : true
      },() => {this.makeRemoteRequest();}
    );
  };

  handleLoadMore = () => {
    this.setState({
        "pageNum" : this.state.pageNum + 1
      },() => {this.makeRemoteRequest();}
    );
  };

  getButton = (teamId, matching) => {
    let awayTeam = matching.awayTeam;
    if(awayTeam == null){
      return <Button title="Accept" onPress={() => this.complete(teamId, matching.id)}/>;
    }else{
      if(awayTeam.id === teamId){
        return <Text style={{"fontSize": 18, "color": "rgba(162,0,37,0.9)"}}>SELECTED</Text>
      }else{
        return null;
      }
    }
  };

  getItemView = (apply) => {
    let team = apply.team;
    let source;
    if(team.pictureUrl == null){
      source = require("../image/defaultTeamImage.jpg");
    }else{
      source = {"uri": team.pictureUrl};
    }
    let itemView = (
      <View style={styles.card}>
        <View style={[styles.row, {"backgroundColor": "rgba(162,0,37,0.9)"}]}>
          <View style={styles.colA}>
            <TouchableHighlight>
              <Image source={source} style={styles.cardImage}/>
            </TouchableHighlight>
            <Text style={styles.text}>
              {team.name}
            </Text>
          </View>
          <View style={styles.colB}>
            <Text style={styles.text}>
              실력: {this.interP.interpretLevel(team.level)}
            </Text>
            <Text style={styles.text}>
              연령대: {team.ageGroup}
            </Text>
          </View>
        </View>
        <View style={[styles.row, styles.line, {"height": 100}]}>
          <Text style={styles.text}>
            {team.description}
          </Text>
        </View>
        <View style={[styles.row, {"justifyContent": "flex-end"}]}>
          {this.getButton(team.id, this.props.matching)}
        </View>
      </View>
    );
    return itemView;
  };

  complete = async (teamId, matchingId) => {
    try{
      let jwt = await AsyncStorage.getItem("jwt");
      if(jwt != null){
        let fetcher = new Fetcher();
        let body = {
          "teamId": teamId,
          "matchingId": matchingId
        };
        let response = await fetcher.fetch("PUT", "matching/complete", jwt, body);
        if(response.status === 200){
            Actions.pop();
        }
      }
    }catch(err){
      console.error(err);
    }
  }


  // -------------------------------------------------

  render(){
    let length = this.state.data.length;
    if(length === 0){
      return null;
    }
    return (
      <View style={styles.container}>
        <FlatList
          data = {this.state.data}
          renderItem = {({item}) => {
            return this.getItemView(item);
          }}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          keyExtractor={item => item.id.toString()}
          style={{"width": maxWidth}}
          contentContainerStyle={{"alignItems": "center"}}
        />
      </View>
    );
  }

}

const maxWidth = Dimensions.get("window").width;
const itemWidth = maxWidth*0.8;
const imageWidth = 70;

const styles = StyleSheet.create({
    "container": {
      "flex": 1,
      "alignItems": "center"
    },
    "card": {
      "width": itemWidth,
      "backgroundColor": "white",
      "marginVertical": 10
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
