
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  ViewPropTypes,
  Button,
  AsyncStorage,
  Image,
  TouchableHighlight
} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {
  ThemeProvider,
  Avatar,
  COLOR,
  Drawer
} from 'react-native-material-ui';

const uiTheme = {
  "palette": {
    "primaryColor": COLOR.green500
  }
};

class App extends Component {

  static propTypes = {
    name: PropTypes.string,
    sceneStyle: ViewPropTypes.style,
    title: PropTypes.string
  }

  static contextTypes = {
    drawer: PropTypes.object
  }

  constructor(props){
    super(props);
    this.state = {
      "savedUser": null
    }
  }

  componentDidMount(){
    this.setSavedUser();
  }

  setSavedUser = async () => {
    try{
      let str = await AsyncStorage.getItem("savedUser");
      this.setState({"savedUser": JSON.parse(str)});
    }catch(err){
      console.error(err);
    }
    return null;
  }

  signOut = async () => {
    try{
      await AsyncStorage.removeItem("jwt");
      await AsyncStorage.removeItem("savedUser");
      Actions.reset("signIn");
    }catch(err){
      cosole.error(err);
    }
  };

  validateEmail = (email) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  render() {
    let user = this.state.savedUser;
    if(user != null){
      let image = <Image source={{"uri": user.pictureUrl}} style={styles.image} resizeMode="cover"/>;
      let avatar = <Avatar image={image} style={{"container": styles.avatarContainer}}/>;
      let email = user.email;
      if(!this.validateEmail(user.email)){
        email = null;
      }
      return (
        <ThemeProvider uiTheme={uiTheme}>
          <Drawer>
            <Drawer.Header >
              <Drawer.Header.Account
                avatar={avatar}
                footer={{
                  dense: true,
                  centerElement: {
                    primaryText: user.name,
                    secondaryText: email
                  }
                }}
                style={{
                  "container": styles.accountContainer,
                  "topContainer": styles.accountTopContainer,
                }}
              />
            </Drawer.Header>
            <Drawer.Section
              divider
              title="Personal"
              items={[
                { icon: 'settings', value: 'Settings' },
                { icon: "exit-to-app", value: 'Sign-out', onPress: this.signOut},
              ]}
            />
          </Drawer>
        </ThemeProvider>
      );
    }else{
      return (
        <View>
          <Text>문제 있음, 수정</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  "image": {
    "width": 50,
    "height": 50,
    "borderRadius": 25
  },
  "avatarContainer": {
    "width": 50,
    "height": 50,
    "borderRadius": 25
  },
  "accountContainer": {
    "backgroundColor": "#4CAF50"
  },
  "accountTopContainer": {
    "flex": 1,
    "alignItems": "center",
    "justifyContent": "flex-end"
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
