const AdminProfile = require("../models/profiles/adminProfile.model").Model;
const admin = require("firebase-admin");
// firebase integration
const serviceAccount = require("../serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.sendNotification = async function (data, tokens = []) {
  saveToFirebase(data);

  var admins = await AdminProfile.find({});
  var adminTokens = [];
  admins.forEach((admin) => {
    adminTokens.push(...admin.firebaseToken);
  });
  tokens.push(...adminTokens);
  if (!tokens.length) {
    return;
  }
  var message = {
    notification: {
      title: `طلب جديد (${data.oid})`,
      body: `طلب جديد من العميل ${data.client.profile.name} لمطبخ ${data.kitchen.profile.name}`,
    },
    tokens: tokens,
  };

  admin
    .messaging()
    .sendEachForMulticast(message)
    .then((response) => {
      console.log(response.successCount + " messages were sent successfully");
    })
    .catch((err) => {
      console.log("something went wrong", err);
    });
};

async function saveToFirebase(data) {
  const payload = {
    kitchenName: data.kitchen.profile.name,
    orderNumber: data.oid,
    clientName: data.client.profile.name,
    orderId: String(data.orderId),
    date: data.date,
    isRead: false,
    isAdminRead: false,
  };
  const notifications = db.collection("notifications");
  const user = notifications.doc(String(data.kitchen._id));
  const adminUnreadDoc = notifications.doc("adminUnreadDoc");

  // update kitchen unread
  await user
    .get()
    .then((doc) => {
      if (!doc.exists) {
        user.set({ unread: 1 });
      } else {
        user.set({ unread: ++doc.data().unread });
      }
    })
    .catch((err) => {
      console.log("Error getting document", err);
      return false;
    });
  // update admin unread
  await adminUnreadDoc
    .get()
    .then((doc) => {
      if (!doc.exists) {
        adminUnreadDoc.set({ unread: 1 });
      } else {
        adminUnreadDoc.set({ unread: ++doc.data().unread });
      }
    })
    .catch((err) => {
      console.log("Error getting document", err);
      return false;
    });

  const userNotification = user
    .collection("userNotification")
    .doc(String(data.orderId));
  await userNotification.set(payload);
}
