
import React, {Component} from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import {Actions} from "react-native-router-flux";
import {connect} from 'react-redux';
import moment from "moment";

const CREATE = 1;
const READ = 2;

class App extends Component {

  static propTypes = {
    "item": PropTypes.shape({}).isRequired,
    "purpose": PropTypes.Number
  }

  constructor(props){
    super(props);
    if(this.props.purpose == null){
      this.props.purpose = READ;
    }
  }

  render(){
    let pressingPurpose = this.props.globalState.pressingPurpose;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            if(this.props.purpose === CREATE){
              this.props.setGlobalState({"selectedGround": this.props.item});
              Actions.popTo("createMatching");
            }else{
              Actions.groundDetail({"item": this.props.item});
            }
          }}
          style={styles.row}>
          <Text style={styles.longText}>{this.props.item.name}</Text>
          <Text style={styles.smallText}>
            {this.props.item.address}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

}

const maxWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  "container": {
    "width": maxWidth,
    "flexDirection": "row",
    "justifyContent": "center",
    "paddingLeft": 10,
    "paddingRight": 10,
    "marginTop": 5,
    "marginBottom": 5
  },
  "row": {
    "flex": 1,
    "flexDirection": "column",
    "alignItems": "flex-start",
    "paddingLeft": 20
  },
  "longText": {
    "fontWeight": "bold"
  },
  "smallText": {
    "fontSize": 10
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
