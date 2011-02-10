use Plack::Builder;
use File::Find::Rule;
use Plack::App::File;

my @files = 
    sort File::Find::Rule->new->file->name('*.js')->in('jslib');

builder {
    enable "JSConcat",
        files => [@files];
    
    mount "/static" => Plack::App::File->new( root => 'root/static' );
    mount '/' => sub { my $env = shift; [200,[200],[qq|
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>pad</title>
    <link rel="stylesheet" type="text/css" href="http://extjs.cachefly.net/ext-3.3.1/resources/css/ext-all.css" />
    <script type="text/javascript" src="http://extjs.cachefly.net/ext-3.3.1/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="http://extjs.cachefly.net/ext-3.3.1/ext-all.js"></script>
    <link rel="stylesheet" type="text/css" href="/static/Portal.css" />
    <link rel="stylesheet" type="text/css" href="/static/silk.css" />
    <link rel="stylesheet" type="text/css" href="/static/cpan.css" />
    <link rel="stylesheet" type="text/css" href="/static/pad.css" />

    <script type="text/javascript" src="$env->{'psgix.jsconcat.url'}"></script>

</head>
<body></body>
</html>
|
]] };
};