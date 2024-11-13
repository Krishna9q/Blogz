const { validateToken } = require("../Utils/authentication");

function checkForAuthenticationCookie(cookieName){

    return (req ,res ,next ) =>{
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue) {
           return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            // console.log("Token Verfied");
            // console.log(userPayload);
            
            req.user = userPayload;
            return next();
        } catch (error) {
            
        };
        return next();
    }

}

module.exports = {
    checkForAuthenticationCookie,
}