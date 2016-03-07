Package.describe({
    summary: "Signup Page"
});

Package.on_use(function (api) {
    api.use(['jquery', 'underscore', 'templating', 'handlebars'], 'client');

    //files
    api.add_files("client/signup.html", "client");
    api.add_files("client/signup.js", "client");

    api.add_files("server/signup.js", "server");
});