Meteor.methods({
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
    }
});