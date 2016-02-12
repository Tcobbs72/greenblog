Template.blogOptions.events({
    "click .options-menu": function(e){
        //e.preventDefault();
        e.stopPropagation();
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

Template.filters.helpers({
    topics: function(){
        return Topics.find({}).fetch();
    }
});

Template.filters.events({
    "click #show-all": function(e){
        var q = Session.get("blogQuery") || {};
        if($(e.target).prop("checked")) _.extend(q, {author: {$in: Meteor.user().profile.subscribed}});
        else delete q["author"];
        Session.set("blogQuery", q);
    },
    "change .filterByTopic": function(e){
        var topic = $(".filterByTopic").val();
        var q = Session.get("blogQuery") || {};
        if(topic && topic!=="") _.extend(q, {topic: topic});
        else delete q["topic"];
        Session.set("blogQuery", q);
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

        Session.set("blogSort", s);
    }
});

Template.options.helpers({
    updatesClass: function(){
        return Session.get("blogReact") ? "fa fa-pause" : "fa fa-play";
    },
    updatesVerbiage: function(){
        return Session.get("blogReact") ? "Pause Updates" : "Resume Updates";
    }
});

Template.options.events({
    "click #disable-updates": function(e){
        if($(e.target).prop("checked")) Session.set("blogReact", false);
        else Session.set("blogReact", true);
    }
});
