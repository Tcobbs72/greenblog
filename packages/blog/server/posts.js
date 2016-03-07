Meteor.methods({
    "newPost": function(post, topic, anonymous){
        var user = Meteor.user();
        if(user){
            var date = new Date();
            var start = new Date(date);
            start.setMinutes(date.getMinutes()-5);
            var recent = Posts.find({author: user.username, date: {$gte: start}}).fetch().length;
            if(recent>=5){
                throw new Meteor.Error(403, "Excessive posting. Please wait to post again.");
            }
            else Posts.insert({text: post, topic: topic, author: user.username, anonymous: anonymous, date: new Date()});
        }
    },
    "removePost": function(postId){
        var post = Posts.findOne({_id: postId});
        if(post){
            if(post.author!==Meteor.user().username){
                throw new Meteor.Error("You cannot delete someone elses post");
            }
            else{
                Posts.remove({_id: postId});
                Comments.remove({postId: postId});
                _.each(post.likes, function(l){
                    Meteor.users.update({username: l}, {$pull: {"profile.likes": postId}});
                });
                _.each(post.dislikes, function(l){
                    Meteor.users.update({username: l}, {$pull: {"profile.dislikes": postId}});
                })
            }
        }
    },
    reportPost: function(id, reason, type){
        var user = Meteor.user();
        if(user){
            var author = "";
            switch(type){
                case "Post":
                    author = Posts.findOne({_id: id}).author;
                    break;
                case "Comment":
                    author = Comments.findOne({_id: id}).author;
                    break;
            }
            Reports.insert({postid: id, reason: reason, author: author, date: new Date(), status: "Not Reviewed", type: type});
        }
    },
    updateLikes: function(increase, postId){
        var user = Meteor.user();
        if(user){
            if(increase){
                Meteor.users.update({_id: user._id}, {$push: {"profile.likes": postId}});
                Posts.update({_id: postId}, {$push: {likes: user.username}, $inc: {numLikes: 1}});

                var post = Posts.findOne({_id: postId});
                if(post && post.author!==user.username){
                    var author = post.author;
                    var text = user.username + " just liked your post! ... '";
                    var postText = post.text.length>20 ? post.text.substr(0, 20) + "..." : post.text;
                    var date = new Date();
                    if(!Notifications.findOne({text: text+postText+"'", userId: Meteor.users.findOne({username: author})._id})) {
                        Notifications.insert({text: text+postText+"'", date: date, userId: Meteor.users.findOne({username: author})._id});
                    }
                }
            }
            else{
                Meteor.users.update({_id: user._id}, {$pull: {"profile.likes": postId}});
                Posts.update({_id: postId}, {$pull: {likes: user.username}, $inc: {numLikes: -1}});
            }
        }
    },
    updateDislikes: function(increase, postId){
        var user = Meteor.user();
        if(user){
            if(increase){
                Meteor.users.update({_id: user._id}, {$push: {"profile.dislikes": postId}});
                Posts.update({_id: postId}, {$push: {dislikes: user.username}, $inc: {numDislikes: 1}});
            }
            else{
                Meteor.users.update({_id: user._id}, {$pull: {"profile.dislikes": postId}});
                Posts.update({_id: postId}, {$pull: {dislikes: user.username}, $inc: {numDislikes: -1}});
            }
        }
    }
});