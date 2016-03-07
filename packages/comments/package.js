Package.describe({
    summary: "Comments Page"
});

Package.on_use(function (api) {
    api.use(['jquery', 'underscore', 'templating', 'handlebars'], 'client');

    //files
    api.add_files("client/comments.html", "client");
    api.add_files("client/comments.js", "client");
});