
import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  ImageBackground
} from 'react-native';
import {connect} from 'react-redux';
import { SocialIcon } from 'react-native-elements'
import {Actions} from 'react-native-router-flux';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import {FBLogin, FBLoginManager} from "react-native-facebook-login";
import Fetcher from "../utility/Fetcher";

class App extends Component {

  constructor(props){
    super(props);
  }

  render() {
    let {setGlobalState, globalState}= this.props;
    let fbButtonView = (
      <SocialIcon
        button={true}
        type="facebook"
        title="Sign In With Facebook"
        raised={false}
      />
    );
    return(
      <ImageBackground source={require("../image/defaultTeamImage.jpg")} style={styles.container}>
        <SocialIcon
          button={true}
          type="google-plus-official"
          title="Sign In With Google"
          onPress={this.signInWithGoogle}
          style={styles.googleBtn}
        />
        <SocialIcon
          button={true}
          type="facebook"
          title="Sign In With Facebook"
          onPress={this.signInWithFacebook}
          style={styles.facebookBtn}
        />

        <Text>
          Created by Dae-han Wi
        </Text>
      </ImageBackground>
    );
  }

  signInWithGoogle = async () => {
    try{
      await GoogleSignin.hasPlayServices({autoResolve: true});
      await GoogleSignin.configure({
        webClientId: "814666149027-dj34kblsc2h3n1rpil26iua4g46vlq9h.apps.googleusercontent.com"
      });
      let user = await GoogleSignin.signIn();
      await this.signUp(user, "Google");
      Actions.reset("drawer");
    }catch(err){
      console.error(err);
    }
    return null;
  }

  signInWithFacebook = async () => {
      FBLoginManager.loginWithPermissions(["public_profile"], async (err1, data) => {
        if(!err1){
            try{
              await this.signUp(data, "Facebook");
              Actions.reset("drawer");
            }catch(err2){
              console.error(err2);
            }
        }else{
          console.error(err1);
        }
      });
  }

  async signUp(user, provider){
    let token;
    let body;
    if(provider === "Google"){
      token = user.idToken;
      body = {
        "provider": provider
      };
    }else if(provider === "Facebook"){
      token = user.credentials.token;
      body = {
        "provider": provider,
        "facebookId": user.credentials.userId
      };
    }
    let fetcher = new Fetcher();
    let response = await fetcher.fetch("POST", "user/signUp", token, body);
    let jwt = response.headers.get("Authorization");
    await AsyncStorage.setItem("jwt", jwt);
    let savedUser = await response.json();
    await AsyncStorage.setItem("savedUser", JSON.stringify(savedUser));
  }

}

const styles = StyleSheet.create({
  "container": {
    "flex": 1,
    "paddingBottom": 70,
    "alignItems": 'center',
    "justifyContent": 'flex-end'
  },
  "googleBtn": {
    "width": 230,
    "height": 48,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "facebookBtn": {
    "width": 230,
    "height": 48,
    "alignItems": "center",
    "justifyContent": "center"
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
