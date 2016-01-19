Template.reports.onCreated(function(){
    var self = this;
    self.autorun(function(){
        self.subscribe("posts", Meteor.user());
        self.subscribe("comments");
        self.subscribe("reports");
    });
});

Template.reports.helpers({
    notReviewedReportsExist: function(){
        return Reports.find({status: "Not Reviewed"}).count();
    },
    nonReviewedReports: function(){
        return Reports.find({status: "Not Reviewed"}, {sort: {date: 1}});
    },
    reviewedReportsExist: function(){
        return Reports.find({status: "Reviewed"}, {sort: {date: 1}}).count();
    },
    reviewedReports: function(){
        return Reports.find({status: "Reviewed"}, {sort: {date: 1}});
    },
    selectedPost: function(){
        return Session.get("selectedPost");
    },
    selectedUser: function(){
        return Session.get("selectedUser");
    }
});

Template.reports.events({
    "click .take-action": function(e){
        var action = $(e.target).data("action");
        Meteor.call("reportAction", Session.get("selectedPost"), action, function(err, res){
           if(err) console.log(err);
        });
    },
    "click .take-action-reviewed": function(e){
        var action = $(e.target).data("action");
        Meteor.call("reviewAction", Session.get("selectedUser"), action, function(err, res){
            if(err) console.log(err);
        })
    }
});

Template.report.helpers({
    formatDate: function(date){
        return moment(date).format("MMM Do, YYYY - hh:mm:ss a")
    }
});

Template.report.events({
    "click .show-post": function(e){
        var status = $(e.target).data("status");
        console.log(status)
        switch(status){
            case "Reviewed":
                var author = $(e.target).data("author");
                var reportid = $(e.target).data("reportid");
                console.log(author);
                Meteor.call("getUser", author, function(err, res){
                    if(err) console.log(err);
                    else if(res){
                        _.extend(res, {reportid: reportid});
                        Session.set("selectedUser", res);
                        Meteor.setTimeout(function(){
                            $("#reportModalReviewed").modal("show");
                        }, 100);
                    }
                });
                break;
            case "Not Reviewed":
                var type = $(e.target).data("type");
                var postid = $(e.target).data("postid");
                var reportid = $(e.target).data("reportid");
                var obj = type==="Post" ? Posts.findOne({_id: postid}) : Comments.findOne({_id: postid});
                if(obj){
                    _.extend(obj, {type: type, reportid: reportid});
                    Session.set("selectedPost", obj);
                    Meteor.setTimeout(function(){
                        $("#reportModalNotReviewed").modal("show");
                    }, 100);
                }
                break;
        }
    }
});