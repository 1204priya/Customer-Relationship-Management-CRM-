const { acceptNotificationRequest, getNotifications } = require("../controllers/notification-controller")
const { createNotificationValidations } = require("../middlewares/notification-validation")


module.exports = (app)=>{
    app.post("crm/api/v1/notification",[createNotificationValidations],acceptNotificationRequest)
    app.get("crm/api/v1/notification",getNotifications)
}

















