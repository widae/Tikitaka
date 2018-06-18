
import React, {Component} from "react";
import moment from "moment";
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
} from "react-native";
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import MatchingListItem from "./MatchingListItem";
import Fetcher from '../utility/Fetcher';
import FCM from "../utility/FCM"

class App extends Component{

  constructor(){
    super();
    this.state = {
      data: [],
      pageNum: 1,
      refreshing : false
    };
  }

  componentDidMount(){

    this.makeRemoteRequest();

    let fcm = new FCM();
    fcm.requestPermissions();
    fcm.saveFcmToken();
    fcm.setListeners();

  }

  async makeRemoteRequest(){
    try{
      let jwt = await AsyncStorage.getItem('jwt');
      if(jwt != null){
        let {pageNum} = this.state;
        let fetcher = new Fetcher();
        let response = await fetcher.fetch("GET", "matching?pageNum=" + pageNum, jwt, null);
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
        pageNum : 1,
        refreshing : true
      },() => {this.makeRemoteRequest();}
    );
  }

  handleLoadMore = () => {
    this.setState({
        pageNum : this.state.pageNum + 1
      },() => {this.makeRemoteRequest();}
    );
  }

  renderItem = ({item, index}) => {
    /*--- 설정 ---*/
    let date = moment(item.start).format("YYYY-MM-DD");
    if(index === 0){
      this.tmpDate = date;
    }
    /*--- 추가 ---*/
    if(date !== this.tmpDate || index === 0){
      this.tmpDate = date;
      return (
        <View style={styles.itemContainer}>
          <View style={styles.label}>
            <Text style={styles.date}>
              {date}
            </Text>
          </View>
          <MatchingListItem item={item}/>
        </View>
      );
    }else{
      return (<MatchingListItem item={item}/>);
    }
  };

  render(){

    return (
      <View style={styles.container}>
        <FlatList
          data = {this.state.data}
          renderItem = {this.renderItem}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          keyExtractor={item => item.id.toString()}
        />
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item
            title="매치 생성"
            onPress={() => {
              Actions.createMatching();
            }}
            buttonColor='#9b59b6'>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }

}

const maxWidth = Dimensions.get("window").width;

const fontSize = 12;
const radius = fontSize;
const marginRight = 20;

const styles = StyleSheet.create({
  "label": {
    "width": maxWidth - marginRight,
    "alignItems": "flex-start",
    "justifyContent": "center",
    "paddingVertical": 5,
    "backgroundColor": "rgba(63,81,181,100)",
    "borderTopRightRadius": radius,
    "borderBottomRightRadius": radius,
    "marginRight": marginRight,
    "marginVertical": 10
  },
  "container": {
    "flex": 1,
    "backgroundColor": "white"
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
    "fontSize": fontSize,
    "fontWeight": "bold",
    "color": "white",
    "marginLeft": 10
  },
  "line": {
    "flex": 1,
    "height": 0,
    "borderTopWidth": 2,
    "borderColor": "black"
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
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
