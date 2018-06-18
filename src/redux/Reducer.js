
import {combineReducers} from "redux";
import {SET} from "./Action";

const initialState = {
  "selectedTeamIndex": 0
}

export default function getNewState(state=initialState, action){
	switch (action.type){
		case SET:
			return Object.assign({}, state, action.data);
		default:
			return state;
  }
}
