Tracker.autorun(function(){
   if(!Meteor.user() || Meteor.user().profile.banned) FlowRouter.go("/home");
});