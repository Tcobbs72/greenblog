Template.login.events({
    "click .login-btn": function(e){
        login();
    },
    "click .forgot-password-btn": function(){
        forgotPassword();
    },
    "keypress": function(e){
        if(e.keyCode===13) $(".login-btn").trigger("click");
    }
});

function forgotPassword(){
    bootbox.prompt("What is your email?", function(res){
        if(res && res.trim!==""){
            if(!Meteor.GreenBlog.Utilities.validateEmail(res)){
                $.bootstrapGrowl("That is not a valid email", {align: "center", width: "auto", type: "danger", delay: 3000});
            }
            else{
                Accounts.forgotPassword({email: res}, function(Error){
                    if(Error){
                        $.bootstrapGrowl(Error.message, {align: "center", width: "auto", type: "danger", delay: 3000});
                    }
                    else{
                        $.bootstrapGrowl("An email has been sent to " + res + " for password assistance", {align: "center", width: "auto", type: "info", delay: 5000});
                    }
                })
            }
        }
    })
}

function login(){
    $(".login-btn").text("Logging in...");
    var invalids = [];

    var user = $(".username-js").val().trim();
    var email = $(".email-js").val().trim();
    var password = $(".password-js").val().trim();


    if(!user || user===""){
        if(!email || email===""){
            invalids.push({select: ".username-js", message: "Login requires username or email", placeholder: "Username"});
            invalids.push({select: ".email-js", message: "Login requires email or username", placeholder: "Email"});
        }
        else{
            if(!password || password==="") invalids.push({select: ".password-js", message: "Login requires password", placeholder: "Password"});
            else{
                Meteor.loginWithPassword(email, password, function(Error){
                    if(Error){
                        $.bootstrapGrowl(Error.message, {align: "center", width: "auto", type: "danger", delay: 3000});
                        $(".email-js").val("");
                        $(".password-js").val("");
                        $(".login-btn").text("Login");
                    }
                    else{
                        FlowRouter.go("/home");
                    }
                })
            }
        }
    }
    else{
        if(!password || password==="") invalids.push({select: ".password-js", message: "Login requires password", placeholder: "Password"});
        else{
            Meteor.loginWithPassword(user, password, function(Error){
                if(Error){
                    $.bootstrapGrowl(Error.message, {align: "center", width: "auto", type: "danger", delay: 3000});
                    $(".username-js").val("");
                    $(".password-js").val("");
                    $(".login-btn").text("Login");
                }
                else{
                    FlowRouter.go("/home");
                }
            })
        }
    }

    _.each(invalids, function(i){
        Meteor.GreenBlog.Utilities.invalidate(i);
    });
    if(invalids.length>0) $(".login-btn").text("Login");
}