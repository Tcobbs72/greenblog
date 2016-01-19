Template.account.onCreated(function(){
    var self = this;
    self.autorun(function(){
        self.subscribe("posts", Meteor.user());
        self.subscribe("notifications");
        //self.subscribe("reports");
    });
});

Template.account.helpers({
    account: function(){
        return Session.get("selectedAccount");
    },
    notifications: function(){
        return Notifications.find({userId: Meteor.user()._id});
    }
});