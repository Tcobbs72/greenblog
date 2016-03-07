Template.about.helpers({
    notLoggedIn: function(){
        return !Meteor.user();
    }
});