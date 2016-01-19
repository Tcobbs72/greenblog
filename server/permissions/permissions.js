Posts.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return false;
    },
    remove: function(){
        return false;
    }
});

Meteor.users.allow({
    insert: function(){
        return false;
    },
    update: function(){
        return false;
    },
    remove: function(){
        return false;
    }
});

Notifications.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return false;
    },
    remove: function(){
        return false;
    }
});

Comments.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return false;
    },
    remove: function(){
        return false;
    }
});