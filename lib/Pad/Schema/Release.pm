package Pad::Schema::Release;

use MooseX::DBIC;

has_column uploaded   => ( isa => 'DateTime', required => 1 );
has_many dependencies => ( isa => ResultSet['Pad::Schema::Dependency'] );
has_many files        => ( isa => ResultSet['Pad::Schema::File'] );
has_many modules      => ( isa => ResultSet['Pad::Schema::Module'] );
has_column [qw(license version abstract release_status)] => ( required => 1 );
has_column version_numified => ( isa => 'Num', lazy_build => 1, required => 1 );
has_column resources => ( isa => 'HashRef' );
belongs_to author => ( required => 1 );
belongs_to distribution => ( required => 1 );

sub _build_version_numified {
    return version->parse(shift->version)->numify;
}

__PACKAGE__->meta->make_immutable;

__END__

=head1 SEE ALSO

L<http://search.cpan.org/perldoc?CPAN::Meta::Spec>  