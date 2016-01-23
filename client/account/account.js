var loadMoreNotifications = new ReactiveVar(false);

Template.account.onCreated(function(){
    var self = this;
    self.autorun(function(){
        self.subscribe("posts", Meteor.user());
        self.subscribe("notifications");
        self.subscribe("users");
        self.subscribe("comments");
    });
});

Template.account.helpers({
    account: function(){
        return Meteor.users.findOne({username: Session.get("selectedAccount")});
    },
    myProfile: function(){
        return Meteor.user() && Session.get("selectedAccount")===Meteor.user().username;
    },
    notifications: function(){
        if(Meteor.user()){
            var date = new Date();
            var start = new Date(date);
            start.setDate(date.getDate()-5);
            var query = {userId: Meteor.user()._id};
            if(!loadMoreNotifications.get()){
                _.extend(query, {date: {$gte: start}});
            }
            return Notifications.find(query, {sort: {date: -1}}).fetch();
        }
        return [];
    },
    posts: function(){
        return Posts.find({author: Session.get("selectedAccount")}, {sort: {date: -1}}).fetch();
    },
    moreNotifications: function(){
        if(Meteor.user()){
            var date = new Date();
            var start = new Date(date);
            start.setDate(date.getDate()-5);
            var query1 = {userId: Meteor.user()._id, date: {$gte: start}};
            var query2 = {userId: Meteor.user()._id};
            return !loadMoreNotifications.get() && Notifications.find(query2).fetch().length > Notifications.find(query1).fetch().length;
        }
        return false;
    },
    showingMoreNotifications: function(){
        return loadMoreNotifications.get();
    },
    subscribers: function(){
        Meteor.call("getSubscribers", Session.get("selectedAccount"), function(err, res){
            if(res) Session.set("selectedAccountSubscribers", res);
        });
        return Session.get("selectedAccountSubscribers") || [];
    }
});

Template.account.events({
    "click .loadNotifications": function(e){
        e.preventDefault();
        loadMoreNotifications.set(true);
    },
    "click .hideNotifications": function(e){
        e.preventDefault();
        loadMoreNotifications.set(false);
    },
    "click .block-user": function(e){
        bootbox.confirm("Are you sure you want to block this user?", function(res){
            if(res){
                var username = $(e.target).data("username");
                Meteor.call("blockUser", username, function(err, res){
                    if(err) $.bootstrapGrowl(err.message, {align: "center", width: "auto", type: "danger", delay: 2000});
                });
            }
        })
    },
    "click .unsubscribe-user": function(e){
        bootbox.confirm("Are you sure you want to unsubscribe to this user?", function(res){
            if(res){
                var username = $(e.target).parent().data("username");
                Meteor.call("unsubscribeUser", username, function(err, res){
                    if(err) $.bootstrapGrowl(err.message, {align: "center", width: "auto", type: "danger", delay: 2000});
                });
            }
        })
    }
});

Template.notification.events({
    "click .view-notification": function(e){
        var id = $(e.target).parent().data("id");
        Meteor.call("viewNotification", id);
    }
});