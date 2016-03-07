Package.describe({
    summary: "Reports Page"
});

Package.on_use(function (api) {
    api.use(['jquery', 'underscore', 'templating', 'handlebars'], 'client');

    //files
    api.add_files("client/reports.html", "client");
    api.add_files("client/reports.js", "client");

    api.add_files("server/reports.js", "server");
});