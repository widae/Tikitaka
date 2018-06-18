
import React, {Component} from "react";
import {AsyncStorage} from "react-native";
import {createStore} from "redux";
import {Provider, connect} from "react-redux";
import {
  Router,
  Scene,
  Stack,
  Tabs,
  Actions,
  Lightbox,
  Drawer
} from "react-native-router-flux";
import getNewState from "./redux/Reducer"
import {MatchIcon, MyTeamIcon, GroundIcon} from "./icon/Icons"
import SignInScreen from "./component/SignInScreen";
import Matching from "./component/Matching";
import MyTeams from "./component/MyTeams";
import CreateMatching from "./component/CreateMatching";
import InputGround from "./component/InputGround";
import MatchingDetail from "./component/MatchingDetail";
import CreateTeam from "./component/CreateTeam";
import UpdateTeam from "./component/UpdateTeam";
import DrawerContent from "./component/DrawerContent";
import Ground from "./component/Ground";
import GroundDetail from "./component/GroundDetail";
import RelatedMatchingList from "./component/RelatedMatchingList";
import ApplyList from "./component/ApplyList";

export default class App extends Component{

  constructor(){
    super();
    this.state = {
      "hasJwt": null
    }
  }

  componentWillMount(){
    this.checkSignedIn();
  }

  checkSignedIn = async () => {
    try{
      let jwt = await AsyncStorage.getItem("jwt");
      if(jwt != null){
        this.setState({"hasJwt": true});
      }else{
        this.setState({"hasJwt": false});
      }
    }catch(err){
      console.error(err);
    }
  }

  render(){
    let store = createStore(getNewState);
    let ConnectedRouter = connect()(Router);
    if(this.state.hasJwt === null){
      return null;
    }
    console.log(this.state.hasJwt);
		return (
			<Provider store={store}>
				<ConnectedRouter>
          <Lightbox>
            <Scene key="root" hideNavBar>
              <Scene key="signIn" component={SignInScreen} initial={!this.state.hasJwt} hideNavBar/>
              <Drawer key="drawer" contentComponent={DrawerContent} initial={this.state.hasJwt} hideNavBar>
                <Tabs key="main" tabBarPosition="bottom" swipeEnabled={false}>
                  <Stack key="tab1" title="매칭" icon={MatchIcon}>
                    <Scene key="matching" title="Matching" component={Matching}/>
                    <Scene key="createMatching" component={CreateMatching} title="Create Matching" hideTabBar hideDrawerButton/>
                    <Scene key="inputGround" component={InputGround} title="Search & Select Ground" hideTabBar hideDrawerButton/>
                    <Scene key="matchingDetail" component={MatchingDetail} title="Matching Detail" hideTabBar hideDrawerButton/>
                    <Scene key="groundDetailForMatching" component={GroundDetail} title="Ground Detail" hideTabBar hideDrawerButton/>
                  </Stack>
                  <Stack key="tab2" title="나의 팀" icon={MyTeamIcon}>
                    <Scene key="myTeams" component={MyTeams} title="My Team"/>
                    <Scene key="createTeam" component={CreateTeam} title="Create Team" hideTabBar hideDrawerButton/>
                    <Scene key="updateTeam" component={UpdateTeam} title="Update Team" hideTabBar hideDrawerButton/>
                    <Scene key="relatedMatchingList" component={RelatedMatchingList} title="Notification" hideTabBar hideDrawerButton/>
                    <Scene key="applyList" component={ApplyList} title="Apply List" hideTabBar hideDrawerButton/>
                  </Stack>
                  <Stack key="tab3" title="구장" icon={GroundIcon}>
                    <Scene key="ground" component={Ground} title="Ground"/>
                    <Scene key="groundDetail" component={GroundDetail} title="Ground Detail" hideTabBar hideDrawerButton/>
                  </Stack>
                </Tabs>
              </Drawer>
            </Scene>
          </Lightbox>
        </ConnectedRouter>
			</Provider>
		);
	}

}
