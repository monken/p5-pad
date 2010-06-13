package Pad::Schema::Module;

use MooseX::DBIC;
with 'AutoUpdate';
use version;
use PPI;
use Pod::POM;
use Pod::POM::View::TOC;
use Pod::POM::View::Pad;
use List::MoreUtils qw(uniq);


has_column name => ( required => 1 );
has_column 'version';
has_column version_numified => ( isa => 'Num', lazy_build => 1, required => 1 );

belongs_to 'release';
belongs_to file => ( isa => 'Pad::Schema::File', required => 1 );

has_column [qw(pod pod_html)] => ( is => 'ro', isa => 'Str', lazy_build => 1 );
has_column sloc => ( is => 'ro', isa => 'Int', lazy_build => 1 );
has_column toc => ( is => 'rw', isa => 'ArrayRef', lazy_build => 1 );
has_column pod_lines => ( is => 'rw', isa => 'ArrayRef', lazy_build => 1 );
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

sub _build_pod_lines {
    my $self = shift;
    $self->ppi->index_locations(1);
    my $found = $self->ppi->find('PPI::Token::Pod');
    my @return;
    foreach my $pod (@{$found || []}) {
        my @lines = split(/\n/, $pod->content);
        push(@return, [$pod->line_number, int($#lines + 1)]);
    }
    return \@return;
    
}

sub _build_pod_html {
    my $self = shift;
    my $pod = $self->pod;
    my $view = Pod::POM::View::Pad->new;
    $view->module($self->name);
    $view->root('');
    return $view->print( Pod::POM->new( warn => 0 )->parse_text( $pod ) );
}

# Copied from Perl::Metrics2::Plugin::Core
sub _build_sloc {
    my $self = shift;
    my $document = $self->ppi->clone;
    $document->prune( sub {
		# Cull out the normal content
		! $_[1]->significant
		and
		# Cull out the high-volume whitespace tokens
		! $_[1]->isa('PPI::Token::Whitespace')
		and (
			$_[1]->isa('PPI::Token::Comment')
			or
			$_[1]->isa('PPI::Token::Pod')
			or
			$_[1]->isa('PPI::Token::End')
			or
			$_[1]->isa('PPI::Token::Data')
		)
	} );

	# Split the serialized for and find the number of non-blank lines
	return scalar grep { /\S/ } split /\n/, $document->serialize;
}

sub _build_toc {
	my $self = shift;
	my $view = Pod::POM::View::TOC->new;
	my $toc = $view->print( Pod::POM->new( warn => 0 )->parse_text( $self->pod ) );
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