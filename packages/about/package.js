Package.describe({
    summary: "About Page"
});

Package.on_use(function (api) {
    api.use(['jquery', 'underscore', 'templating', 'handlebars'], 'client');

    //files
    api.add_files("client/about.html", "client");
    api.add_files("client/about.js", "client");
});