if(!Meteor.GreenBlog) Meteor.GreenBlog = {};
if(!Meteor.GreenBlog.Schemas) Meteor.GreenBlog.Schemas = {};

Comments = new Meteor.Collection("comments");

Meteor.GreenBlog.Schemas.Comments = new SimpleSchema({
    text: {
        type: String,
        label: "Report",
        optional: false
    } ,
    author: {
        type: String,
        label: "Author",
        optional: false
    } ,
    postId: {
        type: String,
        label: "Id",
        optional: false
    } ,
    anonymous: {
        type: Boolean,
        label: "Anonymous",
        defaultValue: false
    } ,
    date: {
        type: Date,
        label: "Creation Date",
        optional: false
    }
});

Comments.attachSchema(Meteor.GreenBlog.Schemas.Comments);