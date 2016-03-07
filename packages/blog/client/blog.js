Template.blog.onCreated(function(){
    Session.set("blogQuery", {});
    Session.set("blogSort", {date: -1});
    Session.set("blogReact", true);
    Session.set("loadingPosts", true);
    Session.set("loadingComments", true);
    var self = this;
    self.autorun(function(){
        self.subscribe("posts", Meteor.user(), function(){
            Session.set("loadingPosts", false);
        });
        self.subscribe("comments", Meteor.user(), function(){
            Session.set("loadingComments", false);
        });
        self.subscribe("reports");
        self.subscribe("topics");
    });
});
//
//Template.newPost.onCreated(function(){
//    var self = this;
//    self.autorun(function(){
//        self.subscribe("topics");
//    });
//});

Template.blog.helpers({
    posts: function(){
        var query = Session.get("blogQuery") || {};
        var react = Session.get("blogReact") || false;
        var sort = Session.get("blogSort") || {date: -1};
        return Posts.find(query, {reactive: react, sort: sort}).fetch();
    },
    postsExist: function(){
        var query = Session.get("blogQuery") || {};
        var react = Session.get("blogReact") || false;
        return Posts.find(query, {reactive: react}).fetch().length>0;
    },
    doneLoading: function(){
        return !Session.get("loadingPosts") && !Session.get("loadingComments");
    }
});

Template.newPost.onRendered(function(){
   Meteor.setTimeout(function(){
       //$(".new-post-topic-js").val("").chosen({}).trigger("chosen:updated");
   }, 100);
});

Template.newPost.helpers({
   topics: function(){
       return Topics.find({}).fetch();
   }
});

Template.newPost.events({
    "click .submit-post-js": function(e){
        $(".submit-post-js").prop("disabled", true);
        var post = $(".new-post-js").val().trim();
        var topic = $(".new-post-topic-js").val();
        if(post && post!==""){
            if(!topic || topic==="") $.bootstrapGrowl("Must select a topic", {align: "center", width: "auto", type: "danger", delay: 3000});
            else{
                var anon = $("#post-anonymous").prop("checked");
                Meteor.call("newPost", post, topic, anon, function(err, res){
                    if(err) $.bootstrapGrowl(err.message, {align: "center", width: "auto", type: "danger", delay: 3000});
                    else{
                        $(".new-post-js").val("");
                        $(".new-post-topic-js").val("");
                        var react = Session.get("blogReact");
                        if(!react) $.bootstrapGrowl("Post successfully submitted. Resume updates to see post", {align: "center", width: "auto", type: "info", delay: 5000});
                    }
                    $(".submit-post-js").prop("disabled", false);
                })
            }
        }
        else $.bootstrapGrowl("Not a valid post", {align: "center", width: "auto", type: "danger", delay: 3000});
    }
});

Template.blogPost.helpers({
   //formatDate: function(d){
   //    return moment(d).format("MMM Do, YYYY - hh:mm:ss a")
   //}
    formatAuthor: function(post){
        return post.anonymous ? "Anonymous" : post.author;
    }
    , likedPost: function(postId){
        return Meteor.user() && _.find(Meteor.user().profile.likes || [], function(l){return l===postId}) ? "like-post-selected" : "";
    }
    , dislikedPost: function(postId){
        return Meteor.user() && _.find(Meteor.user().profile.dislikes, function(d){return d===postId}) ? "dislike-post-selected" : "";
    }
    , numComments: function(comments){
        return comments.length;
    }
    , iPostedThis: function(author){
        return Meteor.user() && author===Meteor.user().username;
    }
    , commentsExist: function(comments){
        if(comments.length===0) return false;
        else{
            var react = Session.get("blogReact") || false;
            return Comments.find({_id: {$in: comments}}, {reactive: react}).fetch().length;
        }
    }
    , getComments: function(comments){
        var react = Session.get("blogReact") || false;
        return Comments.find({_id: {$in: comments}}, {sort: {date: 1}, reactive: react}).fetch();
    }
});

Template.blogPost.events({
    "click .show-comments": function(e){
        e.preventDefault();
        var post = $(e.target).parent().data("postid");
        if(post){
            $("#"+post).children().children(".post-comments").slideToggle();
        }
    }
    , "click .like-post": function(e){
        e.preventDefault();
        if(!Meteor.user()) $.bootstrapGrowl("Create an account to like a post", {align: "center", width: "auto", type: "danger", delay: 3000});
        else {
            var postId = $(e.target).parent().data("postid");
            if ($(e.target).parent().hasClass("like-post-selected")) {
                Meteor.call("updateLikes", false, postId, function (err, res) {
                    if (err) $.bootstrapGrowl(err.message, {
                        align: "center",
                        width: "auto",
                        type: "danger",
                        delay: 3000
                    });
                })
            }
            else {
                if ($(e.target).parent().siblings(".dislike-post-selected").length !== 0) {
                    Meteor.call("updateDislikes", false, postId, function (err, res) {
                        if (err) $.bootstrapGrowl(err.message, {
                            align: "center",
                            width: "auto",
                            type: "danger",
                            delay: 3000
                        });
                    })
                }
                Meteor.call("updateLikes", true, postId, function (err, res) {
                    if (err) $.bootstrapGrowl(err.message, {
                        align: "center",
                        width: "auto",
                        type: "danger",
                        delay: 3000
                    });
                })
            }
        }
    }
    , "click .dislike-post": function(e){
        e.preventDefault();
        if(!Meteor.user()) $.bootstrapGrowl("Create an account to dislike a post", {align: "center", width: "auto", type: "danger", delay: 3000});
        else {
            var postId = $(e.target).parent().data("postid");
            if ($(e.target).parent().hasClass("dislike-post-selected")) {
                Meteor.call("updateDislikes", false, postId, function (err, res) {
                    if (err) $.bootstrapGrowl(err.message, {
                        align: "center",
                        width: "auto",
                        type: "danger",
                        delay: 3000
                    });
                })
            }
            else {
                if ($(e.target).parent().siblings(".like-post-selected").length !== 0) {
                    Meteor.call("updateLikes", false, postId, function (err, res) {
                        if (err) $.bootstrapGrowl(err.message, {
                            align: "center",
                            width: "auto",
                            type: "danger",
                            delay: 3000
                        });
                    })
                }
                Meteor.call("updateDislikes", true, postId, function (err, res) {
                    if (err) $.bootstrapGrowl(err.message, {
                        align: "center",
                        width: "auto",
                        type: "danger",
                        delay: 3000
                    });
                })
            }
        }
    }
    , "click .delete-post": function(e){
        e.preventDefault();
        bootbox.confirm("Are you sure you want to delete this post?", function(res){
           if(res){
               var postId = $(e.target).data("postid");
               Meteor.call("removePost", postId, function(err, res){
                   if(err) $.bootstrapGrowl(err.message, {align: "center", width: "auto", type: "danger", delay: 3000});
               })
           }
        });
    }
    , "click .report-post": function(e){
        e.preventDefault();
        bootbox.prompt("Why do you want to report this post? All reports are sent anonymously.", function(res){
            if(res && res.trim()!==""){
                var id = $(e.target).data("postid");
                Meteor.call("reportPost", id, res, "Post", function(err, res){
                    if(err) $.bootstrapGrowl(err.message, {align: "center", width: "auto", type: "danger", delay: 3000});
                    else $.bootstrapGrowl("Your report has been noted. Our admins will review this post and make consequences accordingly", {align: "center", width: "auto", type: "info", delay: 4000});
                })
            }
            else $.bootstrapGrowl("No report sent", {align: "center", width: "auto", type: "info", delay: 3000});        });
    }
    , "click .block-user": function(e){
        e.preventDefault();
        bootbox.confirm("Are you sure you want to block this user?", function(res){
            if(res){
                var author = $(e.target).data("author");
                Meteor.call("blockUser", author, function(err, res){
                    if(err) $.bootstrapGrowl(err.message, {align: "center", width: "auto", type: "danger", delay: 3000});
                })
            }
        });
    }
    , "click .subscribe-user": function(e){
        e.preventDefault();
        var author = $(e.target).data("author");
        Meteor.call("subscribeUser", author, function(err, res){
            if(err) $.bootstrapGrowl(err.message, {align: "center", width: "auto", type: "danger", delay: 3000});
            else {
                var s = Session.get("selectedAccountSubscribers") || [];
                s.push(Meteor.user().username);
                Session.set("selectedAccountSubscribers", s);
            }
        })
    }
    , "keypress .add-comment-js": function(e){
        if(e.keyCode===13 || e.which===13){
            var postid = $(e.target).data("postid");
            var comment = $(e.target).val().trim();
            if(!comment || comment==="") $.bootstrapGrowl("That is not a valid comment", {align: "center", width: "auto", type: "danger", delay: 3000});
            else{
                var anon = $("#post-anonymous").prop("checked");
                Meteor.call("addComment", comment, postid, anon, function(err, res){
                    if(err) $.bootstrapGrowl(err.message, {align: "center", width: "auto", type: "danger", delay: 3000});
                    else{
                        $(e.target).val("");
                        $(".post-comments").each(function(){
                            $(this).css("display", "none");
                        });
                        $("#"+postid).children().children(".post-comments").css("display", "block");
                    }
                })
            }
        }
    }
});
