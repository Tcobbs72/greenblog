Meteor.startup(function(){
   process.env.MAIL_URL = "smtp://admin@sandbox7f26902927234d189bef626e0b17116f.mailgun.org:ISUcyclones16@smtp.mailgun.org:587";
});

Accounts.validateLoginAttempt(function(attempt){
    if(attempt.user && attempt.user.emails && !attempt.user.emails[0].verified){
        throw new Meteor.Error(403, "Email for this account is not verified");
    }
    else if(attempt.user && attempt.user.profile && attempt.user.profile.banned){
        throw new Meteor.Error(403, "This account has been banned. Email us if you would like your account back.");
    }
    return true;
})