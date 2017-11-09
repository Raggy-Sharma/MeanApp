const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');


/*  ***     VALIDATORS      *** */

let emailValidator = (email) => {
    if(!email){
        return false;
    }else{
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
};

const emailValidators = [
    {
        validator:  emailValidator,
        message: 'Please enter a valid e-mail' 
    }
];


let userNameLenghtChecker = (userName) => {
    if(!userName){
        return false;
    } else if (userName.length < 5 || userName.length >=20) {
        return false;
    } else {
        return true;
    }
};

let userNameValidator = (userName) => {
    if(!userName){
        return false;
    }else{
        const regExp = new RegExp(/^[a-zA-Z0-9]+([a-zA-Z0-9](_|-|)[a-zA-Z0-9])*[a-zA-Z0-9]+$/);
        return regExp.test(userName);
    }
};

const userNameValidators = [
    {
        validator: userNameLenghtChecker,
        message: 'Username should be no less than 5 or greater than 20 characters.'
    },
    {
        validator: userNameValidator,
        message: 'Please enter a valid Username. Username can be alphanumeric with \'underscores\' or \'hyphens\' only.'
    }
];


let passwordLenghtChecker = (passWord) => {
    if(!passWord){
        return false;
    } else if (passWord.length < 8 || passWord.length >=35) {
        return false;
    } else {
        return true;
    }
};

let passwordValidator = (passWord) => {
    if(!passWord){
        return false;
    } else {
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(passWord);
    }
};


const passwordValidators = [
    {
        validator: passwordLenghtChecker,
        message: 'Password should be no less than 8 or greater than 20 characters'
    },
    {
        validator: passwordValidator,
        message: 'Password must contain at least one uppercase, lowercase, special character and number'
    }
]

/*  ***     -----END-VALIDATORS-----      *** */




mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, required: true, unique: true, lowercase: true, validate: emailValidators},
    userName: {type: String, required: true, unique: true, validate: userNameValidators},
    passWord: {type: String, required: true, validate: passwordValidators}
});


//  ---MIDDELWARE FOR SCHEMA--- \\

//  ---encrypt password---  \\
userSchema.pre('save', function(next){
    if(!this.isModified)
        return next();        
    
    bcrypt.hash(this.passWord, null, null, (err, hash) => {
        if(err)
            return next();
        this.passWord = hash;
        next();
    });
});

//  ---End-encrypt password---  \\

//  ---decrypt password---  \\

userSchema.methods.comparePassword = (passWord) => {
    return bcrypt.compareSync(passWord, this.passWord);
};

//  ---End-decrypt password---  \\

//  ---End-MIDDELWARE FOR SCHEMA--- \\



module.exports = mongoose.model('User', userSchema);

