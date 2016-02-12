Meteor.methods({
    getSubscribers: function(username){
        return Meteor.users.find({"profile.subscribed": username}).fetch();
    },
    getUser: function(username){
        return Meteor.users.findOne({username: username});
    },
    getUserById: function(id){
        return Meteor.users.findOne({_id: id});
    },
    unblockUser: function(username){
        if(username){
            Meteor.users.update({_id: Meteor.userId()}, {$pull: {"profile.blocked": username}});
        }
    },
    "subscribeUser": function(author){
        var user = Meteor.user();
        if(user){
            if(_.find(user.profile.subscribed, function(s){return s===author;})){
                throw new Meteor.Error("You are already subscribed to this user");
            }
            else if(_.find(user.profile.blocked, function(b){return b===author;})){
                throw new Meteor.Error("You cannot subscribe to someone that you have blocked");
            }
            else if(user.profile.subscribed.length>=100){
                throw new Meteor.Error("You have reached the limit of people you can subscribe to");
            }
            else{
                var text = user.username + " just subscribed to you!";
                var userId = Meteor.users.findOne({username: author})._id;
                var date = new Date();
                if(!Notifications.findOne({userId: userId, text: text})) Notifications.insert({text: text, userId: userId, date: date});
                Meteor.users.update({_id: Meteor.userId()}, {$push: {"profile.subscribed": author}});
            }
        }
    },
    "unsubscribeUser": function(author){
        var user = Meteor.user();
        if(user){
            Meteor.users.update({_id: Meteor.userId()}, {$pull: {"profile.subscribed": author}});
        }
    },
    "blockUser": function(author){
        var user = Meteor.user();
        if(user){
            if(_.find(user.profile.blocked, function(b){return b===author;})){
                throw new Meteor.Error("You have already blocked this user");
            }
            else if(_.find(user.profile.subscribed, function(s){return s===author;})){
                throw new Meteor.Error("You cannot block someone you have subscribed to");
            }
            else{
                Meteor.users.update({_id: Meteor.userId()}, {$push: {"profile.blocked": author}});
                Meteor.users.update({username: author}, {$pull: {"profile.subscribed": user.username}});
            }
        }
    },
});