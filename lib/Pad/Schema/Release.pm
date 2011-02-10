package Pad::Schema::Release;

use MooseX::DBIC;
#with 'AutoUpdate';

has_column uploaded   => ( isa => 'DateTime', required => 1 );
has_many dependencies => ( isa => ResultSet['Pad::Schema::Dependency'] );
has_many [qw(files modules)];
has_column [qw(license version abstract release_status name)] => ( required => 1 );
has_column version_numified => ( isa => 'Num', lazy_build => 1, required => 1 );
has_column resources => ( isa => 'HashRef' );
has_column files_tree => ( is => 'rw', isa => 'ArrayRef', lazy_build => 1 );
belongs_to author => ( required => 1 );
belongs_to distribution => ( required => 1 );

sub _build_version_numified {
    return version->parse(shift->version)->numify;
}

sub _build_files_tree {
    return shift->files->tree;
}

__PACKAGE__->meta->make_immutable;

__END__

=head1 SEE ALSO

L<http://search.cpan.org/perldoc?CPAN::Meta::Spec>  