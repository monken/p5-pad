use Test::More;
use strict;
use warnings;

use Pad::Schema;

unlink('t/var/sqlite.db') if(-e 't/var/sqlite.db');
my $schema = Pad::Schema->connect('dbi:SQLite:t/var/sqlite.db');
$schema->deploy;

{
    my $release = $schema->resultset('Release')->import_tarball('t/var/Path-Class-0.18.tar.gz');
    is( $release->files->count, 15 );
    is( $release->dependencies->count, 11 );
    is( $release->modules->count, 4 );
    is( $release->distribution->releases->count, 1 );
}

{
    my $release = $schema->resultset('Release')->import_tarball('t/var/Hash-MultiValue-0.08.tar.gz');
    is( $release->files->count, 37 );
    is( $release->dependencies->count, 5 );
    is( $release->modules->count, 1 );
    is( $release->distribution->releases->count, 1 );
}

#my $release = $schema->resultset('Release')->import_tarball('t/var/PPI-1.212.tar.gz');

done_testing;