Template.registerHelper("formatDate", function(d){
    return moment(d).format("MMM Do, YYYY - hh:mm:ss a")
});

Template.registerHelper("numNotifications", function(d){
    return Meteor.user() ? Notifications.find({userId: Meteor.user()._id, viewed: false}).count() : 0;
});

Template.registerHelper("loggedIn", function(d){
    return Meteor.user();
});