package Pad::Schema::Module;

use MooseX::DBIC;
use version;
use PPI;
use Pod::POM;
use Catalyst::Controller::POD::POM::View;


has_column name => ( required => 1 );
has_column 'version';
has_column version_numified => ( isa => 'Num', lazy_build => 1, required => 1 );

belongs_to 'release';
belongs_to file => ( isa => 'Pad::Schema::File' );

has [qw(pod pod_html code)] => ( is => 'ro', isa => 'Str', lazy_build => 1 );
has ppi => ( is => 'ro', isa => 'PPI::Document', lazy_build => 1 );

sub _build_version_numified {
    return version->parse(shift->version)->numify;
}

sub _build_ppi {
    return PPI::Document->new( shift->file->content );
}

sub _build_pod {
    my $found = shift->ppi->find('PPI::Token::Pod');
    return join("\n\n", @$found);
}

sub _build_pod_html {
    my $pod = shift->pod;
    return Catalyst::Controller::POD::POM::View->print( Pod::POM->new( warn => 0 )->parse_text( $pod ) );
}

sub _build_code {
    my $ppi = shift->ppi->clone;
    $ppi->prune('PPI::Token::Pod');
    return $ppi->serialize;
}


__PACKAGE__->meta->make_immutable;