Package.describe({
    summary: "Account Page"
});

Package.on_use(function (api) {
    api.use(['jquery', 'underscore', 'templating', 'handlebars', 'reactive-var'], 'client');

    //files
    api.add_files("client/account.html", "client");
    api.add_files("client/account.js", "client");
});