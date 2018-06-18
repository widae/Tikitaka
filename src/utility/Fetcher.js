
import {AsyncStorage} from "react-native";

export default class Fetcher{

  API = "http://172.30.1.11:8080/tiki-taka/api/";

  async fetch(method, uri, token, body){
    let url = this.API + uri;
    let rest = {
      "method": method,
      "headers": {
        "Content-Type": "application/json",
        "Authorization": token,
        "Accept": "application/json"
      }
    };
    if(body != null){
      rest["body"] = JSON.stringify(body);
    }
    let response = await fetch(url, rest);
    return response;
  }

  async upload(type, id, photo){
    let body = new FormData();
    body.append("type", type);
    body.append("id", id);
    body.append("file", {
      "uri" : photo.uri,
      "type": photo.type,
      "name": photo.fileName
    });
    let url = this.API + "file";
    let rest = {
      "method": "POST",
      "headers": {
        "Authorization": await AsyncStorage.getItem("jwt")
      },
      "body": body
    };
    let response = await fetch(url, rest);
    return response;
  }

}
