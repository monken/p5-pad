package Pad::Web::Controller::Root;
use Moose;
BEGIN { extends 'Catalyst::Controller'; }

__PACKAGE__->config(
    namespace => '',
    actions => {
        index => { Path => undef, Args => 0 },
        default => { Path => undef },
    }
);

sub index {
    my ($self, $c) = @_;
    $c->serve_static_file($c->path_to(qw(root src portal.html)));
}

sub default {
    my ($self, $c) = @_;
    $c->res->status(404);
}

__PACKAGE__->meta->make_immutable;