Package.describe({
    summary: "Blog Page"
});

Package.on_use(function (api) {
    api.use(['jquery', 'underscore', 'templating', 'handlebars'], 'client');

    //files
    api.add_files("client/blog.html", "client");
    api.add_files("client/blog.js", "client");

    api.add_files("server/posts.js", "server");
});