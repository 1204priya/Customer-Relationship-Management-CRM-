const { acceptNotificationRequest, getNotifications } = require("../controllers/notification-controller")
const { createNotificationValidations } = require("../middlewares/notification-validation")


module.exports = (app)=>{
    app.post("/notiserve/api/v1/notification",[createNotificationValidations],acceptNotificationRequest)
    app.get("/notiserve/api/v1/notification/:id",getNotifications)
}

















