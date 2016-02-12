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