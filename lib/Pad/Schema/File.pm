package Pad::Schema::File;

use MooseX::DBIC;
with 'AutoUpdate';

use File::stat ();
use Syntax::Highlight::Engine::Kate ();

has_column name   => ( required => 1 );
has_column binary => ( isa => 'Bool', required => 1, default => 0 );
has_column content => ( isa => 'ScalarRef[Str]', required => 1 );
has_column stat => ( isa => 'File::stat', required => 1, handles => [qw(size)] );
has_column [qw(source_html)] => ( is => 'ro', isa => 'Str', lazy_build => 1 );

belongs_to 'release';
might_have module => ( isa => 'Pad::Schema::Module', predicate => 'has_module' );

my %ext_map = (
    t => 'Perl',
    pl => 'Perl',
    pm => 'Perl',
    sql => 'SQL',
    js => 'JavaScript',
);

sub full_path {
    my $self = shift;
    return join('/', $self->release->name, $self->name);
}

sub _build_source_html {
    my $self = shift;
    my $code = ${$self->content};
    my $i = 1;
    my $ext;
    if($self->name =~ /\.(\w+?)$/) {
        $ext = lc($1);
    }
    my $lines = join("", map { '<div>' . $i++ . '</div>' } split(/\n/, $code));
    my $kate = Syntax::Highlight::Engine::Kate->new( language => $ext_map{$ext} || 'M3U',
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

__PACKAGE__->meta->make_immutable;

__END__

=head1 TODO

=over 4

=item B<Enable TOAST on content column>

=item B<Full-text index only on non binary files>

=back