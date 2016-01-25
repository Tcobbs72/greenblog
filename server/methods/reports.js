Meteor.methods({
    reportAction: function(post, action){
        switch(action){
            case "Dismiss":
                Reports.remove({_id: post.reportid});
                break;
            case "Remove":
                switch(post.type){
                    case "Post":
                        Posts.remove({_id: post._id});
                        var comments = _.pluck(Comments.find({postId: post._id}).fetch() || [], "_id");
                        Comments.remove({postId: post._id});
                        Reports.update({$or: [{postid: post._id}, {postid: {$in: comments}}]}, {$set: {status: "Reviewed"}});
                        Meteor.users.update({username: post.author}, {$inc: {"profile.timesReported": 1}});
                        break;
                    case "Comment":
                        Posts.update({_id: post.postId}, {$pull: {comments: post._id}});
                        Comments.remove({_id: post._id});
                        Reports.update({postid: post._id}, {$set: {status: "Reviewed"}});
                        Meteor.users.update({username: post.author}, {$inc: {"profile.timesReported": 1}});
                        break;
                }
                break;
        }
    },
    reviewAction: function(user, action){
        switch(action){
            case "Dismiss":
                break;
            case "Warn":
                Meteor.users.update({username: user.username}, {$inc: {"profile.timesWarned": 1}});
                var message = "A user recently reported something that you posted. We have removed the post and are giving you a warning. You have been warned " +
                    (user.profile.timesWarned+1) +
                    " times. Excessive warnings will result in a permanent ban.";
                Notifications.insert({userId: user._id, text: message, date: new Date()});
                break;
            case "Ban":
                Meteor.users.update({username: user.username}, {$set: {"profile.banned": true}});
                break;
        }
        Reports.remove({_id: user.reportid});
    }
});