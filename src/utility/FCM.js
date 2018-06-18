
import {Platform, AsyncStorage} from "react-native";
import {Actions} from "react-native-router-flux";
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType, NotificationActionType, NotificationCategoryOption, NotificationActionOption} from "react-native-fcm";
import Fetcher from "./Fetcher";

export default class App{

  requestPermissions = async () => {
    // Exception Handling 해야 함, 현재 X
    await FCM.requestPermissions({"badge": false, "sound": true, "alert": true});
  }

  saveFcmToken = async (fcmToken) => {
    try{
      if(fcmToken == null){
        fcmToken = await FCM.getFCMToken();
      }
      let body = {"fcmToken": fcmToken};
      let jwt = await AsyncStorage.getItem("jwt");
      if(jwt != null){
        let fetcher = new Fetcher();
        let response = await fetcher.fetch("PUT", "user/fcmToken", jwt, body);
      }
    }catch(e){
      console.error(e);
    }
  };

  setListeners = () => {

    FCM.setNotificationCategories([
      {
        "id": "com.Tikitaka.fcm",
        "actions": [
          {
            "type": NotificationActionType.Default,
            "id": "view",
            "title": "View in App",
            "intentIdentifiers": [],
            "options": NotificationActionOption.Foreground
          },
          {
            "type": NotificationActionType.Default,
            "id": "dismiss",
            "title": "Dismiss",
            "intentIdentifiers": [],
            "options": NotificationActionOption.Foreground
          }
        ],
        "options": [NotificationCategoryOption.PreviewsShowTitle]
      }
    ]);

    this.notificationListner = FCM.on(FCMEvent.Notification, (notif) => {
      if(notif.local_notification){
        // 수정해야 함
        Actions.jump("myTeams");
        return;
      }
      if(notif.opened_from_tray){
        return;
      }
      if(Platform.OS === "ios"){
        switch(notif._notificationType){
          case NotificationType.Remote:
            notif.finish(RemoteNotificationResult.NewData);
            break;
          case NotificationType.NotificationResponse:
            notif.finish();
            break;
          case NotificationType.WillPresent:
            notif.finish(WillPresentNotificationResult.All);
            break;
        }
      }
      this.present(notif);
    });

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, this.saveFcmToken);

  };

  present = async (notif) => {
    if(notif.fcm != null){

      // add
      //let existing = await FCM.getBadgeNumber();
      //await FCM.setBadgeNumber(existing + 1);

      FCM.presentLocalNotification({
        "title": notif.fcm.title,
        "body": notif.fcm.body,
        "show_in_foreground": true,
        "priority": "high",
        "sound": "default",
        "vibrate": 300,
        "lights": true
      });
    }
  };

}
