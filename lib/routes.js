
if(Meteor.isClient){
    FlowRouter.route('/', {
        action: function (params, queryParams) {
            FlowRouter.go("/home");
        },
        name: 'base'
    });

    FlowRouter.route("/home", {
        action: function(params, queryParams) {
            FlowLayout.render('layout', { top: 'header', main: 'home' });
        },
        name: "home"
    });

    FlowRouter.route("/signup", {
        action: function(params, queryParams) {
            if(!Meteor.user())FlowLayout.render('layout', { top: 'header', main: 'signup' });
            else FlowRouter.go("/home");
        },
        name: "signup"
    });

    FlowRouter.route("/login", {
        action: function(params, queryParams) {
            if(!Meteor.user()) FlowLayout.render('layout', { top: 'header', main: 'login' });
            else FlowRouter.go("/home");
        },
        name: "login"
    });

    FlowRouter.route("/about", {
        action: function(params, queryParams) {
            FlowLayout.render('layout', { top: 'header', main: 'about' });
        },
        name: "about"
    });

    FlowRouter.route("/blog", {
        action: function(params, queryParams) {
            if(Meteor.user()) FlowLayout.render('layout', { top: 'header', main: 'blog' });
            else FlowRouter.go("/home");
        },
        name: "blog"
    });

    FlowRouter.route("/calculator", {
        action: function(params, queryParams) {
            if(Meteor.user()) FlowLayout.render('layout', { top: 'header', main: 'calculator' });
            else FlowRouter.go("/home");
        },
        name: "calculator"
    });

    FlowRouter.route("/account/:username", {
        action: function(params, queryParams) {
            if(Meteor.user() && Meteor.isClient){
                Meteor.call("getUser", params.username, function(err, res){
                    if(res){
                        Session.set("selectedAccount", res);
                        FlowLayout.render('layout', { top: 'header', main: 'account' });
                    }
                    else FlowRouter.go("/home");
                });
            }
            else FlowRouter.go("/home");
        },
        name: "account"
    });

    FlowRouter.route("/reports", {
        action: function(params, queryParams) {
            if(Meteor.user() && Meteor.user().profile.admin) FlowLayout.render('layout', { top: 'header', main: 'reports' });
            else FlowRouter.go("/home");
        },
        name: "reports"
    });

    FlowRouter.triggers.enter([function(){
        Session.set("currentPath", FlowRouter.current().path);
    }]);

    //these arent working
    var enter = function(){
        Meteor.setTimeout(function(){
            console.log("entering");
            $(".main-container").fadeIn("slow");
        }, 500);
    };

    var exit = function(){
        console.log("exitting");
        $(".main-container").fadeOut("slow", function(){
            $(this).css("display", "block");
        });
    };
}
