const {signup, signin, findData, findWithId, updateData, deleteData} = require("../controllers/user-controller");
const { signupMw, signinMw , verifyJwtToken , isAdmin , isAdminOrOwner , isValidUserIdInReqParam} = require("../middlewares/user-middleware");

module.exports = (app) => { 

    app.post("/mdb/api/test/users/signup",[signupMw],signup);
    app.post("/mdb/api/test/users/signin",[signinMw],signin);
    app.get("/mdb/api/test/users",[verifyJwtToken , isAdmin],findData);
    app.get("/mdb/api/test/users/:userId",[verifyJwtToken , isValidUserIdInReqParam,isAdminOrOwner],findWithId);
    app.put("/mdb/api/test/users/:userId",[verifyJwtToken , isValidUserIdInReqParam , isAdminOrOwner],updateData);
    app.delete("/mdb/api/test/users/:userId",deleteData);  
 
}    