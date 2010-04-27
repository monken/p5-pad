use Test::More;
use strict;
use warnings;

use Pad::Schema;

ok( my $schema = Pad::Schema->connect('dbi:SQLite::memory:'), 'Schema loads ok' );

ok( !$schema->deploy, 'Schema deploys ok' );

done_testing;