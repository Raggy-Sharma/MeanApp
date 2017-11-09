const User = require('../models/user');


module.exports = (router) => {
    router.post('/register', (req, res) => {
        if(!req.body.email){
            res.json({success: false, message: 'You must enter the Email'});
        }
        else if(!req.body.userName){
            res.json({success: false, message: 'You must enter the Username'});
        }
        else if(!req.body.passWord){
            res.json({success: false, message: 'You must enter the Passeord'});
        }
        else{
            let user = new User({
                email: req.body.email.toLowerCase(),
                userName: req.body.userName.toLowerCase(),
                passWord: req.body.passWord
            });
            user.save((err) => {
                if(err){
                    if(err.code === 11000){
                        res.json({success: false, message: 'Username or e-mail already exists'});
                    }
                    else if(err.errors){
                        if(err.errors.email){
                            res.json({success: false, message: err.errors.email.message});
                        } else if (err.errors.userName){
                            res.json({success: false, message: err.errors.userName.message});
                        } else if (err.errors.passWord){
                                res.json({success: false, message: err.errors.passWord.message});
                        } else {
                            res.json({success: false, message: err});
                        } 
                    } else {
                        res.json({success: false, message: 'Could not save user. Error: ', err});
                    }                       
                    
                }else{
                    res.json({success: true, message: 'User saved'});
                }
            });
        }
    });

    router.get('/checkEmail/:email', (req, res) => {
        // Check if email was provided in paramaters
        if (!req.params.email) {
          res.json({ success: false, message: 'E-mail was not provided' }); // Return error
        } else {
          // Search for user's e-mail in database;
          User.findOne({ email: req.params.email }, (err, user) => {
            if (err) {
              res.json({ success: false, message: err }); // Return connection error
            } else {
              // Check if user's e-mail is taken
              if (user) {
                res.json({ success: false, message: 'E-mail is already taken' }); // Return as taken e-mail
              } else {
                res.json({ success: true, message: 'E-mail is available' }); // Return as available e-mail
              }
            }
          });
        }
      });


      router.get('/checkUsername/:userName', (req, res) => {
        // Check if email was provided in paramaters
        if (!req.params.userName) {
          res.json({ success: false, message: 'Username was not provided' }); // Return error
        } else {
          // Search for user's e-mail in database;
          User.findOne({ userName: req.params.userName }, (err, user) => {
            if (err) {
              res.json({ success: false, message: err }); // Return connection error
            } else {
              // Check if user's e-mail is taken
              if (user) {
                res.json({ success: false, message: 'Username already exists' }); // Return as taken e-mail
              } else {
                res.json({ success: true, message: 'Username is available' }); // Return as available e-mail
              }
            }
          });
        }
      });
    return router;
};