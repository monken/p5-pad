package Pad::Schema::Distribution::Set;
use Moose;
extends 'DBIx::Class::ResultSet';

use Path::Class::File ();
use Archive::Extract  ();
use File::Temp        ();
use CPAN::Meta        ();
use DateTime          ();

sub import_tarball {
    my ($self, $tarball) = @_;
    $tarball = Path::Class::File->new($tarball);
    my $ae = Archive::Extract->new( archive => $tarball );
    my $dir = Path::Class::Dir->new(File::Temp::tempdir(CLEANUP => 1));
    $ae->extract( to => $dir );
    my ($basedir) = $dir->children;
    my @children = $basedir->children;
    my @files;
    my $meta_file;
    foreach my $child (@children) {
        if(!$child->is_dir) {
            my $relative = $child->relative($basedir);
            $meta_file = $child if($relative =~ /^META\./);
            push(@files, 
                { 
                  name => $relative->as_foreign('Unix')->stringify, 
                  binary => -B $child ? 1 : 0,
                  content => \1
                  #content => \(scalar $child->slurp)
                } );
        } elsif($child->is_dir) {
            push(@children, $child->children);
        }
    }
    
    my $meta = CPAN::Meta->load_file($meta_file);
    
    my $create = { map { $_ => $meta->$_ } qw(version name license abstract release_status) };
    $create->{files} = \@files;
    $create->{uploaded} = DateTime->now;
    $create->{author} = { name => $meta->author };
    
    $self->create($create);
}

1;