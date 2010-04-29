package Pad::Schema::Distribution;

use MooseX::DBIC;

has_column name       => ( required => 1 );
has_column ratings    => ( isa => 'Int', default => 0 );
has_column rating     => ( isa => 'Num' );
has_column [qw(pass fail na unknown)] => ( isa => 'Int', default => 0 );
has_many releases => ( isa => ResultSet['Pad::Schema::Release'] );


sub latest_release {
    return shift->search_related('releases', undef, { order_by => { -desc => 'version_numified' } })->first;
}

__PACKAGE__->meta->make_immutable;

__END__

=head1 SEE ALSO

L<http://search.cpan.org/perldoc?CPAN::Meta::Spec>  