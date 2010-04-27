package Pad::Schema::Module;

use MooseX::DBIC;
use version;

has_column name => ( required => 1 );
has_column 'version';
has_column version_numified => ( isa => 'Num', lazy_build => 1, required => 1 );

belongs_to 'release';
belongs_to file => ( isa => 'Pad::Schema::File' );


sub _build_version_numified {
    return version->parse(shift->version)->numify;
}

__PACKAGE__->meta->make_immutable;