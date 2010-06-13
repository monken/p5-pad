use Test::More;
use strict;
use warnings;
my $time;
BEGIN { $time = time; }

use Pad::Schema;

my $schema = Pad::Schema->connect('dbi:SQLite:t/var/sqlite.db');

{
    isa_ok( $schema->resultset("Release"), 'Pad::Schema::Release::Set' );
    ok(
        my $release =
          $schema->resultset("Release")->search( { version => '0.18' } )->first,
        'Get release'
    );
    is_deeply(
        $release->files->tree->[9],
        {
            'text'     => 't',
            'children' => [
                {
                    'text' => '01-basic.t',
                    'leaf' => \1
                },
                {
                    'text' => '02-foreign.t',
                    'leaf' => \1
                },
                {
                    'text' => '03-filesystem.t',
                    'leaf' => \1
                }
            ]
        }
    );
}
#DB::enable_profile();
my $files = $schema->resultset("Release")->search( { version => '1.212' } )->first->files->all;

print time - $time, $/;

done_testing;
