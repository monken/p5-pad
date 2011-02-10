package Pad::Schema::Dependency;

use MooseX::DBIC;
use version;

has_column version => ( required => 1 );
has_column [qw(phase relationship)];
has_column module_name => ( required => 1 );
belongs_to release => ( required => 1 );
has_column version_numified => ( isa => 'Num', lazy_build => 1, required => 1 );

sub _build_version_numified {
    return version->parse(shift->version)->numify;
}

__PACKAGE__->meta->make_immutable;