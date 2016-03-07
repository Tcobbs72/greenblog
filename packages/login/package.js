Package.describe({
    summary: "Login Page"
});

Package.on_use(function (api) {
    api.use(['jquery', 'underscore', 'templating', 'handlebars'], 'client');

    //files
    api.add_files("client/login.html", "client");
    api.add_files("client/login.js", "client");
});