/**
 * Route logic for the ticket resource
 */

const { createTicket, getAllUsers } = require("../controllers/ticket-controller")
const { verifyJwtToken } = require("../middlewares/user-middleware")



module.exports = (app)=>{
    //create a ticket
    app.post("/crm/api/v1/tickets",[verifyJwtToken],createTicket)
    app.get("/crm/api/v1/tickets",getAllUsers)
}