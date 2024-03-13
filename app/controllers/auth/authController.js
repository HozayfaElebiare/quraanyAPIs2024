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

function sendEmail(d) {
    if (d == 0) {
        const msg = {
            to: 'mahmoudelebiare@gmail.com', // Change to your recipient
            from: 'otp@quraan.me', // Change to your verified sender
            subject: 'منصة قراني - رمز التحقق',
            text: 'منصة قراني - رمز التحقق',
            html: '<strong>0552156</strong>',
        }
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
                console.error(error)
            })
    } else {
        const msg = {
            to: 'mahmoudelebiare@gmail.com',
            from: 'OTP@quraan.me',
            templateId: 'd-6ddb1802559c49ee916df00039db0475',
            dynamicTemplateData: {
                subject: 'Testing Templates',
                name: 'Some One',
                city: 'Denver',
                code: "660259"
            },
        };
        sgMail.send(msg);
    }
}





/**
 * User registration.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.register = async(req, res) => {
    try {
        bcrypt.hash(req.body.password, 10, async function(err, hash) {
            // generate OTP for confirmation
            let otp = utility.randomNumber(4);
            // Create User object with escaped and trimmed data
            var user = new UserModel({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                type: 'profile_' + req.body.type,
                mobile: req.body.mobile,
                password: hash,
                confirmOTP: otp,
            });

            /////////////////////////////////////////////////////////////////////////////////////////////////
            //////// check if Mobile or Email are Existed ?
            var resultMobile = await checkDublicated(req.body.mobile, 'mobile');
            if (!resultMobile) {
                return apiResponse.unauthorizedResponse(
                    res,
                    "Mobile existed.",

                );
            }
            var resultEmail = await checkDublicated(req.body.email, 'email');
            if (!resultEmail) {
                return apiResponse.unauthorizedResponse(
                    res,
                    "Email existed."
                );
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////
            // check if Mobile or Email are Existed ? 
            ///  Coooooode to check 
            // // Html email body
            // let html =
            //     "<p>Please Confirm your Account.</p><p>OTP: " + otp + "</p>";
            // // Send confirmation email
            // mailer.send(
            //     constants.confirmEmails.from,
            //     req.body.email,
            //     "Confirm Account",
            //     html
            // ).then(function() {
            //     // was save code here
            // }).catch(err => {
            //     console.log(err);
            //     //return apiResponse.ErrorResponse(res, err);
            // });



            const msg = {
                to: req.body.email,
                from: 'OTP@quraan.me',
                templateId: 'd-6ddb1802559c49ee916df00039db0475',
                dynamicTemplateData: {
                    code: otp
                },
            };
            sgMail.send(msg);



            try {
                // Save user.
                user.save(function(err) {
                    if (err) {
                        return apiResponse.ErrorResponse(res, err);
                    }
                    let userData = {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        type: user.type,
                    };

                    // Create free profile
                    var profile = null;
                    profile = new allProfiles[userData.type.replace('profile_', '')]({
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        fullName: userData.firstName + " "+ userData.lastName,
                        mobile: userData.email,
                        email: userData.email,
                        userId: userData._id
                    });


                    profile.save().then(
                        () => {
                            user.profile = profile._id;
                            user.save();
                            return apiResponse.successResponseWithExtraData(
                                res,
                                "Registration Success.",
                                userData, { profile: profile }
                            );
                        }


                    );

                });
            } catch (err) {}

        });
    } catch (err) {
        //throw error in json response with status 500.
        return apiResponse.ErrorResponse(res, err.message);
    }
};






exports.registerAsAstudent = async(req, res) => {
    try {
        bcrypt.hash(req.body.password, 10, async function(err, hash) {
            // generate OTP for confirmation
            let otp = utility.randomNumber(4);
            // Create User object with escaped and trimmed data
            var user = new UserModel({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                type: 'profile_student',
                mobile: req.body.mobile,
                password: hash,
                confirmOTP: otp,
                isConfirmed: 1,
            });
            /////////////////////////////////////////////////////////////////////////////////////////////////
            //////// check if Mobile or Email are Existed ?
            var resultMobile = await checkDublicated(req.body.mobile, 'mobile');
            if (!resultMobile) {
                return apiResponse.unauthorizedResponse(
                    res,
                    "Mobile existed.",

                );
            }
            var resultEmail = await checkDublicated(req.body.email, 'email');
            if (!resultEmail) {
                return apiResponse.unauthorizedResponse(
                    res,
                    "Email existed."
                );
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////





            // check if Mobile or Email are Existed ? 
            ///  Coooooode to check 
            const msg = {
                to: req.body.email,
                from: 'OTP@quraan.me',
                templateId: 'd-6ddb1802559c49ee916df00039db0475',
                dynamicTemplateData: {

                    code: otp
                },
            };
            sgMail.send(msg);
            // Save user.
            user.save(function(err) {
                if (err) {
                    return apiResponse.ErrorResponse(res, err);
                }
                let userData = {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    type: 'profile_student',
                    isMobileConfirmed: user.isMobile,
                    isEmailConfirmed: user.isConfirmed,
                    mobile: user.mobile,

                };
                //Prepare JWT token for authentication
                const jwtPayload = userData;
                const jwtData = {
                    expiresIn: process.env.JWT_TIMEOUT_DURATION,
                };
                const secret = process.env.JWT_SECRET;
                //Generated JWT token with Payload and secret.
                userData.token = jwt.sign(jwtPayload, secret, jwtData);

                // Create free profile
                var profile = null;
                profile = new allProfiles['student']({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    userId: userData._id
                });


                profile.save().then(
                    
                    () => {
                        user.profile = profile._id;
                        user.save();
                        return apiResponse.successResponseWithExtraData(
                            res,
                            "Registration Success.",
                            userData, { profile: profile }
                        );
                    }


                );
            });



        });

    } catch (err) {
        //throw error in json response with status 500.
        return apiResponse.ErrorResponse(res, err);
    }
};




/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 * @param {string}      type
 *
 * @returns {Object}
 */
exports.login = (req, res) => {
    var type = req.body.type;
    try {
        UserModel.findOne({ email: req.body.email }).then((user) => {
            if (user) {
                //Compare given password with db's hash.
                bcrypt.compare(req.body.password, user.password, async function(err, same) {
                    if (same && user.type == ('profile_' + type)) {
                        //Check account confirmation.
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
                                if(profiletype == "tutor") userData.accountFinalConfirmation = user.profile.accountFinalConfirmation;


                                //Prepare JWT token for authentication
                                const jwtPayload = userData;
                                const jwtData = {
                                    expiresIn: process.env.JWT_TIMEOUT_DURATION,
                                };
                                const secret = process.env.JWT_SECRET;
                                //Generated JWT token with Payload and secret.
                                userData.token = jwt.sign(jwtPayload, secret, jwtData);
                                

                                // get my profile
                                // const myprofile = await allProfiles[profiletype].findOne({ 'userId': userData._id });
                                return apiResponse.successResponseWithExtraData(
                                    res,
                                    "Login Success.",
                                    userData, { myprofile: user.profile, profiletype: profiletype }
                                );
                            } else {
                                return apiResponse.unauthorizedResponse(
                                    res,
                                    "Account is not active. Please contact admin."
                                );
                            }
                        } else {
                            return apiResponse.unauthorizedResponse(
                                res,
                                "Account is not confirmed. Please confirm your account."
                            );
                        }
                    } else {
                        return apiResponse.unauthorizedResponse(
                            res,
                            "Password Or Type wrong."
                        );
                    }
                });
            } else {
                return apiResponse.unauthorizedResponse(
                    res,
                    "Email wrong."
                );
            }
        });
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
};

/**
 * Verify Confirm otp.
 *
 * @param {string}      email
 * @param {string}      otp
 *
 * @returns {Object}
 */
exports.verifyConfirm = async(req, res) => {
    try {
        var query = { email: req.body.email };
        UserModel.findOne(query).then(async(user) => {
            if (user) {
                //Check already confirm or not.
                if (!user.isConfirmed) {
                    //Check account confirmation.
                    if (user.confirmOTP == req.body.otp) {
                        //Update user as confirmed
                        UserModel.findOneAndUpdate(query, {
                            isConfirmed: 1,
                            confirmOTP: null,
                        }).catch((err) => {
                            return apiResponse.ErrorResponse(res, err);
                        });
                        ///// Confirmed
                        // Check User's account active or not.
                        if (user.status) {
                            let userData = {
                                _id: user._id,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email,
                                type: user.type
                            };
                            //Prepare JWT token for authentication
                            const jwtPayload = userData;
                            const jwtData = {
                                expiresIn: process.env.JWT_TIMEOUT_DURATION,
                            };
                            const secret = process.env.JWT_SECRET;
                            //Generated JWT token with Payload and secret.
                            userData.token = jwt.sign(jwtPayload, secret, jwtData);
                            const profiletype = req.body.type;

                            // get my profile
                            const myprofile = await allProfiles[profiletype].findOne({ 'userId': userData._id });
                            const msg = {
                                to: req.body.email,
                                from: 'welcome@quraan.me',
                                templateId: 'd-472f75ffb9ab459dbb25f9486221963d',
                                dynamicTemplateData: {
                                    name: userData.firstName + " " + userData.lastName
                                },
                            };
                            sgMail.send(msg);
                            return apiResponse.successResponseWithExtraData(
                                res,
                                "Login Success.",
                                userData, { myprofile: myprofile, profiletype: 'profile_' + profiletype }
                            );
                        } else {
                            return apiResponse.unauthorizedResponse(
                                res,
                                "Account is not active. Please contact admin."
                            );
                        }

                        /// 
                        // return apiResponse.successResponse(
                        //     res,
                        //     "Account confirmed success."
                        // );
                    } else {
                        return apiResponse.unauthorizedResponse(res, "Otp does not match");
                    }
                } else {
                    return apiResponse.unauthorizedResponse(
                        res,
                        "Account already confirmed."
                    );
                }
            } else {
                return apiResponse.unauthorizedResponse(
                    res,
                    "Specified email not found."
                );
            }
        });
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
};

/**
 * Resend Confirm otp.
 *
 * @param {string}      email
 *
 * @returns {Object}
 */
exports.resendConfirmOtp = (req, res) => {
    try {
        var query = { email: req.body.email };
        UserModel.findOne(query).then((user) => {
            if (user) {
                //Check already confirm or not.
                if (!user.isConfirmed) {
                    // Generate otp
                    let otp = utility.randomNumber(4);


                    const msg = {
                        to: req.body.email,
                        from: 'OTP@quraan.me',
                        templateId: 'd-6ddb1802559c49ee916df00039db0475',
                        dynamicTemplateData: {

                            code: otp
                        },
                    };
                    sgMail.send(msg);


                    user.isConfirmed = 0;
                    user.confirmOTP = otp;
                    // Save user.
                    user.save(function(err) {
                        if (err) {
                            return apiResponse.ErrorResponse(res, err);
                        }
                        return apiResponse.successResponse(res, "Confirm otp sent.");
                    });
                } else {
                    return apiResponse.unauthorizedResponse(
                        res,
                        "Account already confirmed."
                    );
                }
            } else {
                return apiResponse.unauthorizedResponse(
                    res,
                    "Specified email not found."
                );
            }
        });
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
};



/**
 * Verify Confirm otp.
 *
 * @param {string}      email
 * @param {string}      otp
 *
 * @returns {Object}
 */
exports.updateProfile = [auth, (req, res) => {
    try {
        var updateFields = {...req.body };
        var query = { userId: req.params.id };
        var usertype = req.body.type;
        console.log(usertype);

        allProfiles['tutor'].findOneAndUpdate(query, updateFields, { new: true }, (err, data) => {
            if (!err) {
                //Data Edited.
                return apiResponse.successResponseWithData(
                    res,
                    "Account confirmed success......",
                    data
                );
            } else {
                return apiResponse.unauthorizedResponse(
                    res,
                    "Error Ouccured."
                );
            }
        });
    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message);
    }
}];



exports.getMyProfile = [auth, async (req, res) => {
    try {
        var query = { userId: req.params.id };
        var usertype = req.params.type;
        var data  = await allProfiles[usertype].findOne(query).populate("userId");
        if (data == null) {
            return apiResponse.notFoundResponse(res,"Not Exist.")
        }
        return apiResponse.successResponseWithData(
            res,
            "Account Details",
            data
        );

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
}];





exports.ifMobileExist = [async(req, res) => {
    try {
        var result = await checkDublicated(req.body.mobile, 'mobile');
        console.log(result);
        if (!result) {
            return apiResponse.unauthorizedResponse(
                res,
                "Mobile existed.",

            );
        } else {
            return apiResponse.successResponseWithData(
                res,
                "Mobile not existed.", { mobile: req.body.mobile }
            );

        }

    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
}];


/**
 * Verify Confirm otp.
 *
 * @param {string}      email
 *
 * @returns {Bolean}
 * 
 */
exports.ifEmailExist = [async(req, res) => {
    try {
        var result = await checkDublicated(req.body.email, 'email');
        console.log(result);
        if (!result) {
            return apiResponse.unauthorizedResponse(
                res,
                "Email existed."
            );
        } else {
            return apiResponse.successResponseWithData(
                res,
                "Email not existed.", { email: req.body.email }

            );

        }
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
}];





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
            return false;
        } else {
            return true;
        }
    } catch (err) {
        return false;
    }
}

function sendNewMessage(mobile) {
    try {


        var options = {
            "method": "POST",
            "hostname": "api.ultramsg.com",
            "port": null,
            "path": "/instance9632/messages/chat",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            }
        };

        var req = http.request(options, function(res) {
            var chunks = [];

            res.on("data", function(chunk) {
                chunks.push(chunk);
            });

            res.on("end", function() {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
            });
        });

        req.write(qs.stringify({
            token: 'ocnpwtml0ll6y2id',
            to: mobile,
            body: `يتم الان تأكيد رقم جوالك على منصة تحفيظ القران الكريم (http://Quraan.me)
                We check your mobile number now to validate your registration in our portal(http: //Quraan.me)`,
            priority: '1',
            referenceId: ''
        }));
        req.end();

    } catch (err) {
        console.log(err);
    }
}

exports.ConfirmMobileNumber = [auth, async(req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
            UserModel.findByIdAndUpdate(decoded._id, { isMobile: true }, { new: true }, async(err, data) => {
                if (!err) {
                    //Data Edited.
                    let userData = {
                        _id: data._id,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        type: data.type,
                        accountFinalConfirmation: data.accountFinalConfirmation,
                        isMobileConfirmed: data.isMobile,
                        isEmailConfirmed: data.isConfirmed,
                        mobile: data.mobile,

                    };
                    //Prepare JWT token for authentication
                    const jwtPayload = userData;
                    const jwtData = {
                        expiresIn: process.env.JWT_TIMEOUT_DURATION,
                    };
                    const secret = process.env.JWT_SECRET;
                    //Generated JWT token with Payload and secret.
                    userData.token = jwt.sign(jwtPayload, secret, jwtData);
                    const profiletype = userData.type;

                    // get my profile
                    const myprofile = await allProfiles['student'].findOne({ 'userId': userData._id });
                    return apiResponse.successResponseWithExtraData(
                        res,
                        "Mobile Confirmed Success......",
                        userData, { myprofile: myprofile, profiletype: profiletype }
                    );

                } else {
                    return apiResponse.unauthorizedResponse(
                        res,
                        "Error Ouccured."
                    );
                }
            });
        } else {
            return apiResponse.unauthorizedResponse(
                res,
                "Error Ouccured."
            );
        }
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
}];




exports.testEmail = [async(req, res) => {
    try {

        sendEmail(132123)

        return apiResponse.unauthorizedResponse(
            res,
            "Email sent."
        );

    } catch (err) {
        return apiResponse.ErrorResponse(res, err.message);
    }
}];




