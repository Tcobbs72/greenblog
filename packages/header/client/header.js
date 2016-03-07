Template.header.onCreated(function(){
    var self = this;
    self.autorun(function(){
        self.subscribe("notifications");
    });
});


Template.header.helpers({
   loggedIn: function(){
       return Meteor.user();
   },
    username: function(){
        return Meteor.user() && Meteor.user().username;
    },
    selected: function(path){
        return Session.get("currentPath")===path ? "selected-link" : "";
    },
    admin: function(){
        return Meteor.user() && Meteor.user().profile.admin;
    },
    hasNotifications: function(){
        return Meteor.user() && Notifications.findOne({userId: Meteor.user()._id, viewed: false});
    }
});

Template.header.events({
    "click .logout-btn-js": function(e){
        $(".logout-btn-js").text("Logging Out...");
        Meteor.logout();
    }
})