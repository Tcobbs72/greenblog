Meteor.methods({
    "newPost": function(post, anonymous){
        var user = Meteor.user();
        if(user){
            var date = new Date();
            var start = new Date(date);
            start.setMinutes(date.getMinutes()-5);
            var recent = Posts.find({author: user.username, date: {$gte: start}}).fetch().length;
            if(recent>=5){
                throw new Meteor.Error(403, "Excessive posting. Please wait to post again.");
            }
            else Posts.insert({text: post, author: user.username, anonymous: anonymous, date: new Date()});
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
    "subcribeUser": function(author){
        var user = Meteor.user();
        if(user){
            if(_.find(user.profile.subscribed, function(s){return s===author;})){
                throw new Meteor.Error("You are already subscribed to this user");
            }
            else if(_.find(user.profile.blocked, function(b){return b===author;})){
                throw new Meteor.Error("You cannot subscribe to someone that you have blocked");
            }
            else{
                Meteor.users.update({_id: Meteor.userId()}, {$push: {"profile.subscribed": author}});
            }
        }
    },
    "blockUser": function(author){
        var user = Meteor.user();
        if(user){
            if(_.find(user.profile.blocked, function(b){return b===author;})){
                throw new Meteor.Error("You have already blocked this user");
            }
            else if(_.find(user.profile.subscribed, function(s){return s===author;})){
                throw new Meteor.Error("You cannot block someone you have subscribed to");
            }
            else{
                Meteor.users.update({_id: Meteor.userId()}, {$push: {"profile.blocked": author}});
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
    addComment: function(comment, postid, anon){
        var user = Meteor.user();
        if(user){
            var date = new Date();
            var start = new Date(date);
            start.setMinutes(date.getMinutes()-5);
            var recent = Comments.find({author: user.username, date: {$gte: start}}).fetch().length;
            if(recent>=5){
                throw new Meteor.Error(403, "Excessive commenting. Please wait to post again.");
            }
            else{
                Comments.insert({postId: postid, text: comment, author: user.username, anonymous: anon, date: new Date()}, function(Error, _id){
                    if(_id){
                        Posts.update({_id: postid}, {$push: {comments: _id}});
                    }
                });
            }
        }
    },
    removeComment: function(commentId){
        var comment = Comments.findOne({_id: commentId});
        if(comment){
            var user = Meteor.user();
            if(user.username!==comment.author) throw new Meteor.Error("You can't delete someone elses comment");
            else{
                Comments.remove({_id: commentId});
                Posts.update({_id: comment.postId}, {$pull: {comments: commentId}});
            }
        }
    },
    updateLikes: function(increase, postId){
        var user = Meteor.user();
        if(user){
            if(increase){
                Meteor.users.update({_id: user._id}, {$push: {"profile.likes": postId}});
                Posts.update({_id: postId}, {$push: {likes: user.username}, $inc: {numLikes: 1}});
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