use Test::More;
use SQL::Translator;

use Pad::Schema;

use Scalar::Util qw(refaddr);

my $schema = Pad::Schema->connect( 'dbi:SQLite:t/var/sqlite.db' );

#$schema->deploy;
my $queries = 0;
$schema->storage->debugcb(sub { print $_[1] if($ENV{DBIC_TRACE}); $queries++; });
$schema->storage->debug(1);

my $artist;

{
    $dist = $schema->resultset('Distribution')->find_by_name('Path-Class');
    is($dist->name, 'Path-Class');
    ok($dist->latest_release->version);
    ok($dist->latest_release->files->tree);
    is($queries, 3, 'latest release is an attribute');
}



done_testing;

