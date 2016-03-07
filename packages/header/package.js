Package.describe({
    summary: "Header Page"
});

Package.on_use(function (api) {
    api.use(['jquery', 'underscore', 'templating', 'handlebars'], 'client');

    //files
    api.add_files("client/header.html", "client");
    api.add_files("client/header.js", "client");
});