import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFCMToken();
  }
}

const getFCMToken=async()=>{
   let fcmToken=await AsyncStorage.getItem("fcmtoken");
   console.log('token',fcmToken);
   if(!fcmToken){
     const token=await messaging().getToken();
     if(token){
        console.log('token gener',token);
        await AsyncStorage.setItem('fcmtoken',token);
     }
   }
}
export const notificationHandler=async()=>{
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        );
       // navigation.navigate(remoteMessage.data.type);
      });

        messaging().onMessage(async remoteMessage=>{
            console.log('remote message',remoteMessage);
        })
      messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          //setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
       
      });
}