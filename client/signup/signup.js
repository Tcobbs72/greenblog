Template.signup.events({
    "click .complete-signup-btn": function(e){
        createUser();
    }
});

function createUser(){
    $(".complete-signup-btn").text("Creating Account");
    var firstname = $(".firstname-js").val().trim();
    var lastname = $(".lastname-js").val().trim();
    var username = $(".username-js").val().trim();
    var email = $(".email-js").val().trim();
    var password = $(".password-js").val().trim();
    var confirmPassword = $(".confirm-password-js").val().trim();

    Meteor.call("validateUser", firstname, lastname, username, email, password, confirmPassword, function(err, res){
        if(res){
            var validate = res;
            if(validate.valid){
                Meteor.call("createUserAndSendEmail", firstname, lastname, username, email, password, function(err, res){
                   if(err){
                       $.bootstrapGrowl(err.message, {type: "danger", width: "auto", align: "center", delay: 3000});
                   }
                   else{
                       $.bootstrapGrowl("Email has been sent to " + email + ", verify email to login!", {width: "auto", align: "center", delay: 3000});
                       FlowRouter.go("/home");
                   }
                });
            }
            else{
                _.each(validate.invalids, function(i){
                    Meteor.GreenBlog.Utilities.invalidate(i);
                })
            }
        }
    })
}
