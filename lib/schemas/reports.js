if(!Meteor.GreenBlog) Meteor.GreenBlog = {};
if(!Meteor.GreenBlog.Schemas) Meteor.GreenBlog.Schemas = {};

Reports = new Meteor.Collection("reports");

Meteor.GreenBlog.Schemas.Reports = new SimpleSchema({
    reason: {
        type: String,
        label: "Reason",
        optional: false
    } ,
    author: {
        type: String,
        label: "Author",
        optional: false
    } ,
    status: {
        type: String,
        label: "Status",
        defaultValue: "Not Reviewed"
    } ,
    type:{
        type: String,
        label: "Type of post",
        optional: false
    } ,
    postid: {
        type: String,
        label: "Id of Post",
        optional: false
    } ,
    date: {
        type: Date,
        label: "Creation Date",
        optional: false
    }
});

Reports.attachSchema(Meteor.GreenBlog.Schemas.Reports);