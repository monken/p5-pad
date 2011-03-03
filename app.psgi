use Plack::Builder;
use File::Find::Rule;
use Plack::App::File;
use Plack::App::Proxy;

my @files = 
    sort File::Find::Rule->new->file->name('*.js')->in('jslib');

builder {
    enable "JSConcat",
        files => [@files];
    
    mount "/static" => Plack::App::File->new( root => 'root/static' );
    mount "/api" => Plack::App::Proxy->new( remote => 'http://localhost:5000' );
    
    my $debug = '-debug';
    mount '/' => sub { my $env = shift; [200,['Content-type', 'text/html'],[qq|
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>pad</title>
    <link rel="stylesheet" type="text/css" href="http://extjs.cachefly.net/ext-3.3.1/resources/css/ext-all.css" />
    <script type="text/javascript" src="http://extjs.cachefly.net/ext-3.3.1/adapter/ext/ext-base$debug.js"></script>
    <script type="text/javascript" src="http://extjs.cachefly.net/ext-3.3.1/ext-all$debug.js"></script>
    <link href="http://alexgorbatchev.com/pub/sh/current/styles/shCore.css" rel="stylesheet" type="text/css" />
    <link href="http://alexgorbatchev.com/pub/sh/current/styles/shThemeDefault.css" rel="stylesheet" type="text/css" />
    <script src="http://alexgorbatchev.com/pub/sh/current/scripts/shCore.js" type="text/javascript"></script>
    <script src="http://alexgorbatchev.com/pub/sh/current/scripts/shBrushPerl.js" type="text/javascript"></script>
    <script type="text/javascript" src="http://cdn.simplegeo.com/js/1.2/simplegeo.context.min.js"></script>
    <script src="http://maps.google.com/maps?file=api&v=3.x&key=ABQIAAAA2CKu_qQN-JHtlfQ5L7BLlRT2yXp_ZAY8_ufC3CFXhHIE1NvwkxQl3I3p2yrGARYK4f4bkjp9NHpm5w" type="text/javascript"></script>
    <link rel="stylesheet" type="text/css" href="/static/Portal.css" />
    <link rel="stylesheet" type="text/css" href="/static/silk.css" />
    <link rel="stylesheet" type="text/css" href="/static/cpan.css" />
    <link rel="stylesheet" type="text/css" href="/static/pad.css" />
    <script type="text/javascript" src="$env->{'psgix.jsconcat.url'}"></script>
</head>
<body><form id="history-form" class="x-hidden">
    <input type="hidden" id="x-history-field" />
    <iframe id="x-history-frame"></iframe>
</form></body>
</html>
|
]] };
};