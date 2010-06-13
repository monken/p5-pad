package Pad::Web::Controller::JavaScript;
use Moose;
BEGIN { extends 'Catalyst::Controller'; }

use File::Find::Rule;
use Path::Class::File;

__PACKAGE__->config(
    actions => {
        index => { Path => '' }
    }
);

sub index {
    my ($self, $c) = @_;
    my @files = 
        map { Path::Class::File->new($_) } 
        sort File::Find::Rule->new->file->name('*.js')->in($c->path_to(qw(jslib)));
    my $js = join("\n\n", map { scalar $_->slurp } @files);
    $c->stash->{js} = $js;
    $c->detach($c->view('JavaScript'));
}


__PACKAGE__->meta->make_immutable;