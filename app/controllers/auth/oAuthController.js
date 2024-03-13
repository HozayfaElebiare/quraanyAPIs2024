const UserModel = require("./UserModel");
//helper file to prepare responses.
const apiResponse = require("../../helpers/apiResponse");
const utility = require("../../helpers/utility");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../../helpers/mailer");
const { constants } = require("../../helpers/constants");
const auth = require("../../middlewares/jwt");
var qs = require("querystring");
var http = require("https");
var axios = require("axios");

// Profiles 
const allProfiles = [];
allProfiles['admin'] = require("./profiles/adminModel")
allProfiles['coordinator'] = require("./profiles/coordinatorModel")
allProfiles['publisher'] = require("./profiles/publisherModel")
allProfiles['student'] = require("./profiles/studentModel")
allProfiles['tutor'] = require("./profiles/tutorModel")

var subsciptionModel = require("../StudentApp/supscriptions/sub.Model").Model;
var StudentProfileModel = require("../StudentApp/Profiles/Profiles.Model").Model;
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

/// GOOGLE
async function verifyGoogle(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //   const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    return payload;
}

/////// FACEBOOK
async function checkFacebookToken(accessToken) {
    try {
        const check = await axios.get(
            `https://graph.facebook.com/me?access_token=${accessToken}`
        );
        console.log(check.data);
        return { ...check.data, valid: true };
    } catch (error) {
        console.log(error.response.data.error.message);
        return { valid: false }
    }
};





exports.googleAuth = async (req, res) => {
    try {

        var token = req.headers.token;
        var type = req.headers.type;
        var returner = await verifyGoogle(token).catch(console.error);
        console.log("returner",returner);
        if (returner) {
            var data = await authCheckpoint(type,returner?.sub,returner?.given_name,returner?.family_name,token,returner?.picture,"google",returner?.email,"")
        return apiResponse.successResponseWithExtraData(
            res,
            "googleAuth Registration Success.",
            data, {returner:returner}
        );
        }else{
            return apiResponse.unauthorizedResponse(res, 'googleAuth Registration failed.');
        }
        
    } catch (err) {
        //throw error in json response with status 500.
        return apiResponse.ErrorResponse(res, err.message);
    }
};




exports.facebookAuth = async (req, res) => {
    try {
        var token = req.headers.token;
        var type = req.headers.type;
        var returner = await checkFacebookToken(token);
        var data={};
        console.log(req.body.authToken);
        if(returner.valid == true){
            // In case of facebook account without valid email 
            // 1. check if this account existed
            if (!req.body.email){
                var user = await UserModel.findOne({authId:req.body.id}).populate("profile");
                console.log(user)
                if (user == null) {
                    // الحالة دي يوزر سجل جديد بالفيس بوك وحسابه مش فيه ايميل 
                    return res.status(403).json({err:2346})
                }else{
                    // في حال ان اليوزر بالفعل سجل مرة قبل كدا 
                    // استبدلت الايميل في الشيكر بالايميل بتاعه اللى متسجل معايا قبل كدا
                    data = await authCheckpoint(type,req.body.id,req.body.firstName,req.body.lastName,token,req.body.photoUrl,"facebook",user.email,"")
            return apiResponse.successResponseWithExtraData(
                res,
                "facebookAuth Registration Success.",
                data, {returner:returner}
            );
                }

            }else{
                data = await authCheckpoint(type,req.body.id,req.body.firstName,req.body.lastName,token,req.body.photoUrl,"facebook",req.body.email,"")
            return apiResponse.successResponseWithExtraData(
                res,
                "facebookAuth Registration Success.",
                data, {returner:returner}
            );
            }

            
        }else{
            return apiResponse.unauthorizedResponse(
                res,
                "facebookAuth Registration failed.",
                returner
            );
        }

        


        


    } catch (err) {
        //throw error in json response with status 500.
        return apiResponse.ErrorResponse(res, err.message);
    }
};



async function authCheckpoint(profileType, authId, fName, lName, authToken, photoUrl, provider, email, mobile) {
    var registrationType = 'oauth';

    // Check If User Existed
    // By: 1. AuthID,Email
    // 1.A Check Email
    var resultEmail = await checkDublicated(email, 'email');
    if (resultEmail.exist == true) 
    {
        return await loginTokenReturner(resultEmail.user._id.toString());

    //     return {
    //         message: "User email existed. Token Generated",
    //         date: await loginTokenReturner(resultEmail.user._id.toString())}
    }
    // 1.B check auth id
    var resultAuthId = await checkDublicated(authId, 'authId');
    if (resultAuthId.exist == true) {
        return await loginTokenReturner(resultAuthId.user._id.toString());
        // return { message: "User authId existed. Token Generated",
        //     data: await loginTokenReturner(resultAuthId.user._id.toString())}
    }


    // If Exist >>> Update data Token and profile | And call loginTokenReturner() Fn.





    // If not Exist >> Create new user | Profile | And call loginTokenReturner() Fn.
    var user = new UserModel({
        firstName: fName,
        lastName: lName,
        email: email,
        type: 'profile_' + profileType,
        mobile: mobile,
        password: 'passw0rd',
        authToken: authToken,
        photoUrl: photoUrl,
        provider: provider,
        isConfirmed: true,
        isMobile: false,
        status: true,
        accountFinalConfirmation: false,
        fullName: fName + " "+ lName,
        authId:authId

    });

    await user.save();

    // Create free profile
    var profile = null;
    profile = new allProfiles[user.type.replace('profile_', '')]({
        firstName: fName,
        lastName: lName,
        email: email,
        type: 'profile_' + profileType,
        mobile: mobile,
        password: 'passw0rd',
        authToken: authToken,
        photoUrl: photoUrl,
        provider: provider,
        isConfirmed: true,
        isMobile: false,
        accountFinalConfirmation: false,
        imgUrl:photoUrl,
        fullName: fName + " "+ lName,
        userId:user._id
    });


    await profile.save().then(
        async () => {
            user.profile = profile._id;
            await user.save();
            return await loginTokenReturner(user._id.toString());
        }


    );

    return await loginTokenReturner(user._id.toString())
}





async function loginTokenReturner(userId) {
    var user = await UserModel.findById(userId).populate("profile");

    if (user) {
        if (user.isConfirmed) {
            // Check User's account active or not.
            if (user.status) {
                let userData = {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    type: user.type,
                    accountFinalConfirmation: user.accountFinalConfirmation,
                    isMobileConfirmed: user.isMobile,
                    isEmailConfirmed: user.isConfirmed,
                    mobile: user.mobile
                };
                const profiletype = userData.type.replace('profile_', '');
                if(profiletype == "tutor" && user.profile) userData.accountFinalConfirmation = user.profile.accountFinalConfirmation ;


                //Prepare JWT token for authentication
                const jwtPayload = userData;
                const jwtData = {
                    expiresIn: process.env.JWT_TIMEOUT_DURATION,
                };
                const secret = process.env.JWT_SECRET;
                //Generated JWT token with Payload and secret.
                userData.token = jwt.sign(jwtPayload, secret, jwtData);
                userData.profile = user.profile;
                userData.type = profiletype;
                
                return userData
            } else {
                return {
                    message: "Account is not active. Please contact admin.",
                    data:{}
                }
            }
        } else {
            return {
                message: "Account is not confirmed. Please confirm your account.",
                data:{}
            }
        }
    } else {
        return {
            message: "can not create login Token Returner for this account.",
            data:{}
        }
    }
}




async function checkDublicated(param, mobileOrPhone) {
    try {
        var query;
        if (mobileOrPhone == 'mobile') {
            query = { mobile: param };
            sendNewMessage(param);
        } else {
            query = { email: param };
        }
        console.log(query);
        var user = await UserModel.findOne(query).lean(true);
        if (user) {
            console.log(user._id);
            return { exist: true, user: user };
        } else {
            return { exist: false };
        }
    } catch (err) {
        return { exist: false };
    }
}
