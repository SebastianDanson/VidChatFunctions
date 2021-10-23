const functions = require("firebase-functions");
const apn = require("apn");

exports.test = functions.https.onCall((data) => {
  const config = {
    production: false /* change this when in production */,
    token: {
      key: "./AuthKey_RXQSJ6B4W5.p8",
      keyId: "RXQSJ6B4W5",
      teamId: "PVV4QAF8VB",
    },
  };
  const apnProvider = new apn.Provider(config);
  const notification = new apn.Notification();

  const recepients = [];
  recepients.push(
    apn.token(
      "db16365a48d6c8a4ae1cd3104fe5dd37ca2185d3db19aaa2925777b7c841be9f"
    )
  );

  notification.topic = "com.SebastianDanson.VidChatApp.voip";
  notification.payload = {
    data,
  };

  return apnProvider.send(notification, recepients).then((reponse) => {
    console.log(reponse);
    return response.send("finished!");
  });
});
