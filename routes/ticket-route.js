/**
 * Route logic for the ticket resource
 */

const { createTicket, getAllUsers , updateTicket } = require("../controllers/ticket-controller")
const { isValidOwnerOfTheTicket } = require("../middlewares/ticket-middleware")
const { verifyJwtToken  } = require("../middlewares/user-middleware")




module.exports = (app)=>{
    //create a ticket
    app.post("/crm/api/v1/tickets",[verifyJwtToken],createTicket)
    app.get("/crm/api/v1/tickets",getAllUsers)
    app.put("/crm/api/v1/tickets/:id",[isValidOwnerOfTheTicket],updateTicket)
}