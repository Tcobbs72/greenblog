Meteor.methods({
   validateUser: function(firstname, lastname, username, email, password, confirmPassword){
       var validate = {invalids: [], valid: true};

       if(!firstname || firstname==="") validate.invalids.push({select: ".firstname-js", message: "Need a valid first name", placeholder: "First Name"});
       if(!lastname || lastname==="") validate.invalids.push({select: ".lastname-js", message: "Need a valid last name", placeholder: "Last Name"});

       if(!password || password==="") validate.invalids.push({select: ".password-js", message: "Must provide a valid password", placeholder: "Password"});
       else if(!confirmPassword || confirmPassword==="") validate.invalids.push({select: ".confirm-password-js", placeholder: "Confirm Password", message: "Must provide a valid matching password"});
       else if(password!==confirmPassword){
           validate.invalids.push({select: ".password-js", message: "Passwords do not match", placeholder: "Password"});
           validate.invalids.push({select: ".confirm-password-js", message: "Passwords do not match", placeholder: "Confirm Password"});
       }

       if(!username || username===""){
           validate.invalids.push({select: ".username-js", message: "Must provide a valid username", placeholder: "Username"});
       }
       else if(username.length>15){
           validate.invalids.push({select: ".username-js", message: "Username must be less than 15 characters", placeholder: "Username"});
       }
       else if(Meteor.users.findOne({username: username})){
           validate.invalids.push({select: ".username-js", message: "Username already exists", placeholder: "Username"});
       }

       if(!email || email===""){
           validate.invalids.push({select: ".email-js", message: "Must provide a valid email", placeholder: "Email"});
       }
       else if(!Meteor.GreenBlog.Utilities.validateEmail(email)){
           validate.invalids.push({select: ".email-js", message: "Must provide a valid email of format example@example.com", placeholder: "Email"});
       }
       else if(Meteor.users.findOne({"emails.address": email})){
           validate.invalids.push({select: ".email-js", message: "Email already exists", placeholder: "Email"});
       }
       if(validate.invalids.length>0) validate.valid = false;
       return validate;
   },
    createUserAndSendEmail: function(firstname, lastname, username, email, password){
        var profile = {name: {first: firstname, last: lastname}, likes: [],
                            dislikes: [], subscribed: [], blocked: [],
                            timesReported: 0, timesWarned: 0, banned: false};
        var userId = Accounts.createUser({username: username, email: email, password: password, profile: profile});
        if(userId) Accounts.sendVerificationEmail(userId);
    }
});