
import React, {Component} from "react";
import PropTypes from "prop-types";
import moment from "moment";
import {
  View,
  Button,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  Dimensions,
  AsyncStorage
} from "react-native";
import {connect} from "react-redux";
import {Actions} from "react-native-router-flux";
import Fetcher from "../utility/Fetcher";
import RelatedMatchingListItem from "./RelatedMatchingListItem";

// ---------------------------------------------------------------------------------------------------------------------------------------------------

class App extends Component {

  static propTypes = {
    "selectedTeam": PropTypes.shape({}).isRequired
  }

  constructor(){
    super();
    this.state = {
      "data": [],
      "pageNum": 1,
      "refreshing" : false
    };
  }

  componentDidMount(){
    this.makeRemoteRequest();
  }

  makeRemoteRequest = async () => {
    try{
      let jwt = await AsyncStorage.getItem("jwt");
      if(jwt != null){
        let teamId = this.props.selectedTeam.id;
        let {pageNum} = this.state;
        let fetcher = new Fetcher();
        let response = await fetcher.fetch("GET", "matching/related?teamId=" + teamId + "&pageNum=" + pageNum, jwt, null);
        let jsonBody = await response.json();
        this.setState({
            data : pageNum === 1 ? jsonBody : [...this.state.data, ...jsonBody],
            refreshing : false
        });
      }
    }catch(err){
      console.error(err);
    }
  }

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


  // -------------------------------------------------

  getApplied = (matching) => {
    console.log(matching);
    let applied;
    let homeTeam = matching.homeTeam;
    let applies = matching.applies;
    let selected = this.props.selectedTeam;
    if(selected.id === homeTeam.id){
      applied = -1;
    }else{
      for(let i = 0; i < applies.length; i++){
        if(selected.id === applies[i].team.id){
          applied = i;
          break;
        }
      }
    }
    return applied;
  };

  render(){
    return (
      <View style={styles.container}>
        <FlatList
          data = {this.state.data}
          renderItem = {({item}) => {
            let applied = this.getApplied(item);
            return (<RelatedMatchingListItem matching={item} applied={applied}/>);
          }}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    );
  }

}

const maxWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  "container": {
    "flex": 1
  },
  "itemContainer": {
    "flex": 1
  },
  "row": {
    "width": maxWidth,
    "flexDirection": "row",
    "alignItems": "center",
    "paddingVertical": 5
  },
  "date": {
    "fontSize": 18,
    "fontWeight": "bold",
    "color": "black",
    "marginLeft": 10,
    "marginRight": 20
  },
  "line": {
    "flex": 1,
    "height": 0,
    "borderTopWidth": 2,
    "borderColor": "black"
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
