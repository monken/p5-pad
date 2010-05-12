use Test::More;
use strict;
use warnings;

use Pad::Schema;

my $schema = Pad::Schema->connect('dbi:SQLite:t/var/sqlite.db');

{
    ok(
        my $module = 
            $schema->resultset("Module")->search({ name => 'Path::Class::File'})->first,
        'Get module');
    use Data::Dumper; $Data::Dumper::Indent = 1; $Data::Dumper::Maxdepth = 2; warn Dumper $module->pod_lines;
}

done_testing;