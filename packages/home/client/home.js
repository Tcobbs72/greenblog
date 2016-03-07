Template.home.helpers({
    notLoggedIn: function(){
        return !Meteor.user();
    },
    username: function(){
        return Meteor.user().username;
    }
});