Meteor.publish("posts", function(user){
    if(user) return Posts.find({author: {$nin: user.profile.blocked}});
    this.ready();
});

Meteor.publish("comments", function(){
    if(this.userId){
        var user = Meteor.users.findOne({_id: this.userId});
        if(user) return Comments.find({author: {$nin: user.profile.blocked}});
    }
    this.ready();
});

Meteor.publish("reports", function(){
    return Reports.find();
});

Meteor.publish("notifications", function(){
    return Notifications.find();
});