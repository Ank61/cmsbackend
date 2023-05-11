const express = require("express")
const app = express()
const cookieparser = require('cookie-parser');
const loginModal = require("../Modals/Authentication/loginModal")
app.use(cookieparser());
const jwt = require("jsonwebtoken")

const middleware = async(request, response, next) => {
    if (request.cookies?.access_Token ) {
        const access_Token = request.cookies.access_Token;

        //check the access token expiraiton 
        //check the expiration of refresh token
        const checkEmail = jwt.decode(access_Token)
        const getUser = await loginModal.findOne({ Email: checkEmail.email }).catch(err =>
            response.status(400).send("Unauthorised "))
            if(getUser){
                const refresh_Token = getUser.Token
              jwt.verify(refresh_Token, process.env.REFRESH_TOKEN_KEY, async function (err, decoded) {
            if (err) {
                if (err.message == "invalid signature") {
                    return response.status(400).send("Unauthorised Refresh token")
                }
                else{
                return response.status(200).send("Logout")
                }
                }
                    jwt.verify(access_Token, process.env.ACCESS_TOKEN_KEY, async function (err, decoded) {
                        if (err) {
                            if (err.message == "invalid signature") {
                                return response.status(400).send("Unauthorised Token")
                            }
                            else {
                                //if expired then generate new on with the help of refresh token
                                const decoded = jwt.decode(access_Token)
                                //Check email is present in db 
                                const user = await loginModal.findOne({ Email: decoded.email }).catch(err =>
                                    response.status(400).send("Unauthorised "))
                                if (user.Token) {
                                    //Check the refresh token matched the one you gt from db and request
                                        const newAccessToken = jwt.sign({ email: decoded.email },
                                            process.env.ACCESS_TOKEN_KEY, {
                                            expiresIn: '3m'
                                        });
                                        console.log("Access token regenrated : " )
                                        response.cookie('access_Token', newAccessToken, {
                                            httpOnly: true,
                                            sameSite: 'Lax'
                                        })
                                        next()
                                        //give tick here
                                       // return response.status(400).send("Token regerated")
                                    }
                                else {
                                    //Could not find email that means dont generate the token in this case
                                    return response.status(400).send("Unauthorised Email")
                                }
                            }
                        }
                        else {
                            //valid access token then give access 
                            next()
                        }
                    })
                }

        )}
        else{
            return response.status(400).send("Accesss token not valid")
        }
    }
    else {
        return response.status(400).send("Refresh or access Token not present")
    }
}

module.exports = middleware;
