if(!Meteor.GreenBlog) Meteor.GreenBlog = {};
if(!Meteor.GreenBlog.Schemas) Meteor.GreenBlog.Schemas = {};

Notifications = new Meteor.Collection("notifications");

Meteor.GreenBlog.Schemas.Notifications = new SimpleSchema({
    text: {
        type: String,
        label: "Notification Text",
        optional: false
    } ,
    date: {
        type: Date,
        label: "Date",
        defaultValue: new Date()
    },
    userId: {
        type: String,
        label: "User",
        optional: false
    },
    viewed: {
        type: Boolean,
        label: "Viewed",
        defaultValue: false
    }
});

Notifications.attachSchema(Meteor.GreenBlog.Schemas.Notifications);