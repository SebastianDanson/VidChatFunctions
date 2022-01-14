const functions = require("firebase-functions");
const apn = require("apn");
const admin = require("firebase-admin");
admin.initializeApp();

exports.makeCall = functions.https.onCall((data) => {
  const config = {
    production: false /* change this when in production */,
    token: {
      key: "./AuthKey_ZB9WSABD8V.p8",
      keyId: "ZB9WSABD8V",
      teamId: "S5GWMTL4BM",
    },
  };
  const apnProvider = new apn.Provider(config);
  const notification = new apn.Notification();

  const recepients = [];
  recepients.push(
    apn.token(
      data.token
    )
  );

  notification.topic = "com.SebastianDanson.saylo.voip";
  notification.payload = {
    data,
  };


  return apnProvider.send(notification, recepients).then((response) => {
    functions.logger.log("Hello from info. Here's an objec", response);
    return response.send("finished!");
  });
});

exports.subscribeToTopic = functions.https.onCall((data) => {
  admin.messaging().subscribeToTopic(data.tokens, data.chatId);
});


exports.sendNotification = functions.https.onCall((data) => {

  const token = data.token;
  const topic = data.topic;

  const title = data.title;
  const body = data.body;

  const metaData = data.metaData

  // if (data.notificationsEnabled) {
  var message = {

    notification: {
      title: title,
      body: body,
    },

    apns: {
      payload: {
        aps: {
          "mutable-content": 1,
        },
        data: metaData,
      },
    },
  };

  if (token == null) {
    message.topic = topic
  } else {
    message.token = token
  }

  // if (data.image != null) {
  //   message.apns.fcm_options = {
  //     image: data.image,
  //   };
  // }

  admin.messaging().send(message);
  //}
});