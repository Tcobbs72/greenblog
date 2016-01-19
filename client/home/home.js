Template.home.helpers({
    notLoggedIn: function(){
        return !Meteor.user();
    }
});