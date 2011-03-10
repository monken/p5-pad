#!/usr/bin/env perl

use strict;
use warnings;

system("rm -rvf build/*");

system("cp -v *.htm build/");

open FILE, "<", "index.htm";
my @file = <FILE>;
close FILE;

my @out;
my @js;
my @css;
while ( my $line = shift @file ) {
    if ( $line =~ /"(js\/.+?)"/ ) {
        push( @js, $1 );
    } elsif ( $line =~ /"(css\/.+?)"/ ) {
        push( @css, $1 );
    } elsif ( $line =~ /<\/head>/ ) {
        push( @out,
              '<script type="text/javascript" src="min.js"></script>',    $/,
              '<link rel="stylesheet" type="text/css" href="min.css" />', $/,
              $line );
    } elsif ($line =~ /maps.google.com\/maps/) {
        push( @out,
'<script src="http://maps.google.com/maps?file=api&v=3.x&key=ABQIAAAAi2YyfW8defwbxJKgu7ewXBQ_gB-V_MtlUb_svvM7Brxc7FxRGBRDb_BOHqohNEjOO4X31cKBVgo6lg" type="text/javascript"></script>'
        );
    } else {
        $line =~ s/-debug//;
        push( @out, $line );
    }
}

open FILE, ">", "build/index.htm";
while ( my $line = shift @out ) {
    print FILE $line;
}
close FILE;

system("cp -vR resources build/resources");

while ( my $js = shift @js ) {
    system("cat $js >> build/tmp.js");
}

system("yuicompressor -v --type js build/tmp.js >> build/min.js");

while ( my $css = shift @css ) {
    system("cat $css >> build/tmp.css");
}

system("yuicompressor -v --type css build/tmp.css >> build/min.css");

system("rm -v build/tmp.*");

print "Build was successful" . $/;
print "Test with cd build && ../server" . $/;