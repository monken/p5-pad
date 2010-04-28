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
    print $module->file->content;
    print $module->code;
    print $module->pod;
}

done_testing;