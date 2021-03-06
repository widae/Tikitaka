
import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  AsyncStorage,
  ImageBackground,
  Dimensions
} from 'react-native';
import {connect} from 'react-redux';
import {SearchBar} from 'react-native-elements'
import {Actions} from 'react-native-router-flux';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import GroundListItem from "./GroundListItem";
import Fetcher from '../utility/Fetcher';
import {CREATE} from "./GroundListItem";

class App extends Component{

  constructor(props){
    super(props);
    this.state = {
      "data": [],
      "showLoading": false
    }
  }

  makeRemoteRequest = async (text) => {
    try{
      let jwt = await AsyncStorage.getItem("jwt");
      if(jwt != null){
        let {pageNum} = this.state;
        let fetcher = new Fetcher();
        // 수정되야 함
        let response = await fetcher.fetch("GET", "ground/"+ 1 + "?text=" + text, jwt, null);
        let jsonBody = await response.json();
        this.setState({"data" : jsonBody});
      }
    }catch(err){
      console.error(err);
    }
  };

  handleLoadMore = () => {

  }

  render(){
    return (
      <View style={styles.container}>
        <SearchBar
          searchIcon={{"size": 24}}
          onChangeText={(text) => {this.makeRemoteRequest(text)}}
          placeholder="구장 또는 지역명 입력"
          lightTheme
          containerStyle={styles.searchBar}
          inputStyle={styles.inputContainerStyle}
        />
        <FlatList
          data = {this.state.data}
          renderItem = {({item}) => {
              return (<GroundListItem item={item} purpose={1}/>);
          }}
          onEndReached={this.handleLoadMore}
          keyExtractor={item => item.id.toString()}
          style={{"flex": 1}}
          contentContainerStyle={styles.flatList}
        />
      </View>
    );
  }

}

// ---------------------------------------------------------------------------------------------------------------------------------------------------

const maxWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  "container": {
    "flex": 1,
    "alignItems": "center",
    "justifyContent": "flex-start"
  },
  "searchBar": {
    "width": maxWidth,
    "alignItems": "flex-start",
    "justifyContent": "center"
  },
  "inputContainerStyle": {
    "width": 300,
    "alignItems": "flex-start",
    "justifyContent": "center"
  },
  "flatList": {
    "alignItems": "center",
    "justifyContent": "flex-start"
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
