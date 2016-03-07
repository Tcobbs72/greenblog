Package.describe({
    summary: "Home Page"
});

Package.on_use(function (api) {
    api.use(['jquery', 'underscore', 'templating', 'handlebars'], 'client');

    //files
    api.add_files("client/home.html", "client");
    api.add_files("client/home.js", "client");
});