if(!Meteor.GreenBlog) Meteor.GreenBlog = {};
if(!Meteor.GreenBlog.Schemas) Meteor.GreenBlog.Schemas = {};

Posts = new Meteor.Collection("posts");

Meteor.GreenBlog.Schemas.Posts = new SimpleSchema({
   text: {
       type: String,
       label: "Post",
       optional: false
   } ,
   author: {
       type: String,
       label: "Author",
       optional: false
   } ,
   date: {
       type: Date,
       label: "Date",
       defaultValue: new Date()
   },
   likes: {
       type: [String],
       label: "Likes",
       defaultValue: []
   } ,
    dislikes: {
        type: [String],
        label: "Dislikes",
        defaultValue: []
    } ,
    numLikes: {
        type: Number,
        label: "Number of Likes",
        defaultValue: 0
    } ,
    numDislikes: {
        type: Number,
        label: "Number of Dislikes",
        defaultValue: 0
    } ,
    comments: {
        type: [String],
        label: "Comments",
        defaultValue: []
    } ,
    anonymous: {
        type: Boolean,
        label: "Anonymous",
        defaultValue: false
    }
});

Posts.attachSchema(Meteor.GreenBlog.Schemas.Posts);