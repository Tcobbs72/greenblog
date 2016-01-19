Template.layout.onCreated(function(){
   if(Accounts._verifyEmailToken) Accounts.verifyEmail(Accounts._verifyEmailToken)
});