if(!Meteor.GreenBlog) Meteor.GreenBlog = {};
if(!Meteor.GreenBlog.Schemas) Meteor.GreenBlog.Schemas = {};

Topics = new Meteor.Collection("topics");

Meteor.GreenBlog.Schemas.Topics = new SimpleSchema({
    name: {
        type: String,
        label: "Topic",
        optional: false
    }
});

Topics.attachSchema(Meteor.GreenBlog.Schemas.Topics);