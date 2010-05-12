package Pad::Schema::Module;

use MooseX::DBIC;
use version;
use PPI;
use Pod::POM;
use Pod::POM::View::TOC;
use Pod::POM::View::Pad;
use Syntax::Highlight::Engine::Kate;
use List::MoreUtils qw(uniq);


has_column name => ( required => 1 );
has_column 'version';
has_column version_numified => ( isa => 'Num', lazy_build => 1, required => 1 );

belongs_to 'release';
belongs_to file => ( isa => 'Pad::Schema::File' );

has [qw(pod pod_html code code_html)] => ( is => 'ro', isa => 'Str', lazy_build => 1 );
has sloc => ( is => 'ro', isa => 'Int', lazy_build => 1 );
has toc => ( is => 'rw', isa => 'ArrayRef', lazy_build => 1 );
has pod_lines => ( is => 'rw', isa => 'ArrayRef', lazy_build => 1 );
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

sub _build_code {
    my $ppi = shift->ppi->clone;
    $ppi->prune('PPI::Token::Pod');
    return $ppi->serialize;
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

sub _build_code_html {
    my $self = shift;
    my $code = ${$self->file->content};
    my $i = 1;
    my $lines = join("", map { '<div>' . $i++ . '</div>' } split(/\n/, $code));
    my $kate = Syntax::Highlight::Engine::Kate->new( language => 'Perl',
    substitutions => {
           "<" => "&lt;",
           ">" => "&gt;",
           "&" => "&amp;",
           " " => "&nbsp;",
           "\t" => "&nbsp;&nbsp;&nbsp;",
           "\n" => "</div><div>",
        },
        format_table => { 
            Normal => ['',''],
            map {$_ => [ '<span class="pad-browser-source-highlight-' . lc($_) . '">', '</span>' ]}
           qw(Alert BaseN BString Char Comment DataType DecVal Error 
           Float Function IString Keyword Operator Others 
           RegionMarker Reserved String Variable Warning) },
        
      );
    my $highlight = $kate->highlightText($code);
    $highlight =~ s/<div>$//sm;
    return qq(<table cellpadding="0" cellspacing="0" class="pad-reader-source-table">
              <tbody><tr>
                <td>
                  <pre class="x-toolbar line-numbers">$lines</pre>
                </td>
                <td width="100%">

                    <div class="highlight"><pre><div>$highlight</pre></div>

                </td>
              </tr>
            </tbody></table>);
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