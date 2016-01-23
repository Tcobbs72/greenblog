var react = new ReactiveVar(true);
var query = new ReactiveVar({});
var sort = new ReactiveVar({date: -1});

Template.blog.onCreated(function(){
    var self = this;
    self.autorun(function(){
        self.subscribe("posts", Meteor.user());
        self.subscribe("comments");
        self.subscribe("reports");
    });
});

Template.newPost.onCreated(function(){
    var self = this;
    self.autorun(function(){
        self.subscribe("topics");
    });
});

Template.blog.helpers({
    posts: function(){
        return Posts.find(query.get(), {reactive: react.get(), sort: sort.get()}).fetch();
    },
    postsExist: function(){
        return Posts.find(query.get(), {reactive: react.get()}).fetch().length>0;
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
    "keypress .new-post-js": function(e){
        if(e.keyCode===13 || e.which === 13){
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
                            if(react && !react.get()) $.bootstrapGrowl("Post successfully submitted. Resume updates to see post", {align: "center", width: "auto", type: "info", delay: 5000});
                        }
                    })
                }
            }
            else $.bootstrapGrowl("Not a valid post", {align: "center", width: "auto", type: "danger", delay: 3000});
        }
    }
});

Template.blogOptions.events({
    "click .options-menu": function(e){
        //e.preventDefault();
        e.stopPropagation();
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
        else return Comments.find({_id: {$in: comments}}, {reactive: react.get()}).fetch().length;
    }
    , getComments: function(comments){
        return Comments.find({_id: {$in: comments}}, {sort: {date: 1}, reactive: react.get()}).fetch();
    }
});

Template.blogPost.events({
    "click .show-comments": function(e){
        var post = $(e.target).parent().data("postid");
        if(post){
            $("#"+post).children().children(".post-comments").slideToggle();
        }
    }
    , "click .like-post": function(e){
        var postId = $(e.target).parent().data("postid");
        if($(e.target).parent().hasClass("like-post-selected")){
            Meteor.call("updateLikes", false, postId, function(err, res){
                if(err) $.bootstrapGrowl(err.message, {align: "center", width: "auto", type: "danger", delay: 3000});
            })
        }
        else{
            if($(e.target).parent().siblings(".dislike-post-selected").length!==0){
                Meteor.call("updateDislikes", false, postId, function(err, res){
                    if(err) $.bootstrapGrowl(err.message, {align: "center", width: "auto", type: "danger", delay: 3000});
                })
            }
            Meteor.call("updateLikes", true, postId, function(err, res){
                if(err) $.bootstrapGrowl(err.message, {align: "center", width: "auto", type: "danger", delay: 3000});
            })
        }
    }
    , "click .dislike-post": function(e){
        var postId = $(e.target).parent().data("postid");
        if($(e.target).parent().hasClass("dislike-post-selected")){
            Meteor.call("updateDislikes", false, postId, function(err, res){
                if(err) $.bootstrapGrowl(err.message, {align: "center", width: "auto", type: "danger", delay: 3000});
            })
        }
        else{
            if($(e.target).parent().siblings(".like-post-selected").length!==0){
                Meteor.call("updateLikes", false, postId, function(err, res){
                    if(err) $.bootstrapGrowl(err.message, {align: "center", width: "auto", type: "danger", delay: 3000});
                })
            }
            Meteor.call("updateDislikes", true, postId, function(err, res){
                if(err) $.bootstrapGrowl(err.message, {align: "center", width: "auto", type: "danger", delay: 3000});
            })
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

Template.comment.helpers({
    iPostedThis: function(author){
        return Meteor.user() && author===Meteor.user().username;
    }
    //formatDate: function(d){
    //    return moment(d).format("MMM Do, YYYY - hh:mm:ss a")
    //}
    , formatAuthor: function(comment){
        return comment.anonymous ? "Anonymous" : comment.author;
    }
});

Template.comment.events({
    "click .delete-comment": function(e){
        var comment = $(e.target).hasClass("fa") ? $(e.target).parent().data("comment") : $(e.target).data("comment");
        if(comment){
            Meteor.call("removeComment", comment, function(err, res){
                if(err) $.bootstrapGrowl(err.message, {align: "center", width: "auto", type: "danger", delay: 3000});
            })
        }
    },
    "click .report-comment": function(e){
        e.preventDefault();
        bootbox.prompt("Why do you want to report this comment? All reports are sent anonymously.", function(res){
            if(res && res.trim()!==""){
                var id = $(e.target).data("comment");
                Meteor.call("reportPost", id, res, "Comment", function(err, res){
                    if(err) $.bootstrapGrowl(err.message, {align: "center", width: "auto", type: "danger", delay: 3000});
                    else $.bootstrapGrowl("Your report has been noted. Our admins will review this post and make consequences accordingly", {align: "center", width: "auto", type: "info", delay: 4000});
                })
            }
            else $.bootstrapGrowl("No report sent", {align: "center", width: "auto", type: "info", delay: 3000});
        });
    }
});

Template.filters.helpers({
    topics: function(){
        return Topics.find({}).fetch();
    }
});

Template.filters.events({
    "click #show-all": function(e){
        var q = query.get();
        if($(e.target).prop("checked")) _.extend(q, {author: {$in: Meteor.user().profile.subscribed}});
        else delete q["author"];
        query.set(q);
    },
    "change .filterByTopic": function(e){
        var topic = $(".filterByTopic").val();
        var q = query.get();
        if(topic && topic!=="") _.extend(q, {topic: topic});
        else delete q["topic"];
        query.set(q);
    }
});

Template.sorters.events({
    "click .sort-box": function(e){
        var field = $(e.target).data("sort");
        var value = parseInt($(e.target).data("value"));
        var s = {};

        var checked = $(e.target).prop("checked");
        if(checked) s[field]=value;
        else if(!checked || field!=="date") _.extend(s, {date: -1});

        $(".sort-box").each(function(){
           $(this).prop("checked", false);
        });
        if(checked) $(e.target).prop("checked", true);

        sort.set(s);
    }
});

Template.options.helpers({
   updatesClass: function(){
       return react.get() ? "fa fa-pause" : "fa fa-play";
   },
    updatesVerbiage: function(){
        return react.get() ? "Pause Updates" : "Resume Updates";
    }
});

Template.options.events({
   "click #disable-updates": function(e){
       if($(e.target).prop("checked")) react.set(false);
       else react.set(true);
   }
});
