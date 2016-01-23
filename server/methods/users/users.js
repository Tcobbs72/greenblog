Meteor.methods({
    getSubscribers: function(username){
        return Meteor.users.find({"profile.subscribed": username}).fetch();
    },
    getUser: function(username){
        return Meteor.users.findOne({username: username});
    },
    getUserById: function(id){
        return Meteor.users.findOne({_id: id});
    }
});