if(!Meteor.GreenBlog) Meteor.GreenBlog = {};
if(!Meteor.GreenBlog.Utilities) Meteor.GreenBlog.Utilities = {};

Meteor.GreenBlog.Utilities.invalidate = function(i){
    $(i.select).val("");
    $(i.select).addClass("invalid");
    $(i.select).attr("placeholder", i.message);
    $(i.select).keydown(function(e){
        $(this).removeClass("invalid");
        $(this).attr("placeholder", i.placeholder);
    })
};

Meteor.GreenBlog.Utilities.validateEmail = function(email){
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
};