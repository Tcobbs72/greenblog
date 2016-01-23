Template.registerHelper("formatDate", function(d){
    return moment(d).format("MMM Do, YYYY - hh:mm:ss a")
});

Template.registerHelper("numNotifications", function(d){
    return Notifications.find({userId: Meteor.user()._id, viewed: false}).count();
});