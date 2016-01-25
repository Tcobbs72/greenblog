Meteor.methods({
    "viewNotification": function(id){
        Notifications.update({_id: id}, {$set: {viewed: true}});
    }
});