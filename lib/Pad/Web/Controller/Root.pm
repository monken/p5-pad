package Pad::Web::Controller::Root;
use Moose;
BEGIN { extends 'Catalyst::Controller'; }

__PACKAGE__->config(
    namespace => '',
    actions => {
        index => { Path => '' }
    }
);

sub index {
    my ($self, $c) = @_;
    $c->serve_static_file($c->path_to(qw(root src portal.html)));
}

__PACKAGE__->meta->make_immutable;