const express = require("express")
const app = express()
const loginModal = require("../../Modals/Authentication/loginModal");
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
require("dotenv").config();
const cookieparser = require('cookie-parser');
app.use(cookieparser());
const jwt = require("jsonwebtoken")
//For creating new user


app.post("/create",
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    async (request, response) => {

        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }
        //Hash the password using env
        const password = request.body.password
        bcrypt.genSalt(10, async function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                // Store hash in your password DB.
                if (err) {
                    return response.status(400).json(err);
                }
                //Send the request with hashed password
                const user = new loginModal({
                    User_Id: request.body.userId,
                    User_Name: request.body.userName,
                    Email: request.body.email,
                    Password: hash,
                });

                try {
                    await user.save();
                    response.status(200).send({
                        success: true,
                        message: "Data sucessfully Inserted ",
                        response: user
                    });
                }
                catch (error) {
                    if (error.code == 11000) {
                        return response.status(400).send({ success: true, message: "Insertion failed, Dublicate field found", response: user });
                    }
                    else {
                        return response.status(400).send(error);
                    }
                }
            });
        })
    });


app.post("/",
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),

    async (request, response) => {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.status(200).json({ Login : false });
        }
        const { email, password } = request.body
        const user = await loginModal.findOne({ Email: email }).clone().catch(err=> response.status(400).send({ login: "Could not find Email" }))
        if (user) {
            const hashedPassword = user.Password;
            bcrypt.compare(password, hashedPassword, async function (err, result) {
                if (err) {
                    // Handle error
                    console.error(err);
                } else if (result) {
                    // Password is correct
                    //Access token for 3 minutes
                    //If you want to make access token at the fron then use authoriation headr with bearer token at front
                    const accessToken = jwt.sign({ email: user.Email },
                        process.env.ACCESS_TOKEN_KEY, {
                        expiresIn: '3m'
                    });
                    response.cookie('access_Token', accessToken, {
                        httpOnly: true,
                        secure : true,
                        sameSite: 'none'
                    })
                    //Refresh token for 5 minutes
                    const refreshToken = jwt.sign({ email: user.Email },
                        process.env.REFRESH_TOKEN_KEY, { expiresIn: '50m' },
                        { algorithm: 'RS256' });
                    //Now save the token in DB
                    const updatedData = await loginModal.updateOne(
                        { Email: email },
                        {
                            $set: {
                                Token: refreshToken
                            }
                        })
                    if (updatedData.modifiedCount > 0 && updatedData.matchedCount > 0) {
                        response.status(200).json({
                            Login: true,
                            message: 'Login Successfully',
                        })
                    }
                    else if (updatedData.matchedCount < 1) {
                        response.status(200).json({
                            Login: false,
                            message: 'Could not find email',
                        })
                    }
                    else {
                        response.status(400).json({
                            Login: true,
                            message: 'Login Failed',
                        })
                    }
                }
                else {
                    // Password is incorrect
                    return response.status(200).send({Login: false  })
                }
            })
        }
        else {
            response.status(200).send({ Login: false })
        }
    })

module.exports = app;