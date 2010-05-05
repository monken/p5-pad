package Pad::Schema::Module;

use MooseX::DBIC;
use version;
use PPI;
use Pod::POM;
use Pod::POM::View::TOC;
use List::MoreUtils qw(uniq);
use Catalyst::Controller::POD::POM::View;


has_column name => ( required => 1 );
has_column 'version';
has_column version_numified => ( isa => 'Num', lazy_build => 1, required => 1 );

belongs_to 'release';
belongs_to file => ( isa => 'Pad::Schema::File' );

has [qw(pod pod_html code)] => ( is => 'ro', isa => 'Str', lazy_build => 1 );
has toc => ( is => 'rw', isa => 'ArrayRef', lazy_build => 1 );
has ppi => ( is => 'ro', isa => 'PPI::Document', lazy_build => 1 );

sub _build_version_numified {
    return version->parse(shift->version)->numify;
}

sub _build_ppi {
    return PPI::Document->new( shift->file->content );
}

sub _build_pod {
    my $found = shift->ppi->find('PPI::Token::Pod');
    if($found) { 
        return join("\n\n", @$found);
    } else {
        return "=head1 ERROR\n\nThere is no documentation for this file."
    }
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

sub _build_toc {
	my $self = shift;
	my $toc = Pod::POM::View::TOC->print( Pod::POM->new( warn => 0 ) )->parse_text( $self->pod );
	return _toc_to_json( [], split( /\n/, $toc ) );
}

sub _toc_to_json {
	my $tree     = shift;
	my @sections = @_;
	my @uniq     = uniq( map { ( split(/\t/) )[0] } @sections );
	foreach my $root (@uniq) {
		next unless ($root);
		push( @{$tree}, { text => $root } );
		my ( @children, $start );
		for (@sections) {
			if ( $_ =~ /^\Q$root\E$/ ) {
				$start = 1;
			} elsif ( $start && $_ =~ /^\t(.*)$/ ) {
				push( @children, $1 );
			} elsif ( $start && $_ =~ /^[^\t]+/ ) {
				last;
			}
		}
		unless (@children) {
			$tree->[-1]->{leaf} = \1;
			next;
		}
		$tree->[-1]->{children} = [];
		$tree->[-1]->{children} =
		  _toc_to_json( $tree->[-1]->{children}, @children );
	}
	return $tree;
}



__PACKAGE__->meta->make_immutable;