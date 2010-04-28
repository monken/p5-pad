package Pad::Web::Controller::Module;
use Moose;
extends 'Catalyst::Controller';

__PACKAGE__->config(
    actions => {
        index => { Path => '' }
    }
);

sub index {
    my ($self, $c, $module) = @_;
    $module = $c->model('DBIC::Module')->find_latest_by_name($module);
    $c->res->body($module->pod_html);
}

__PACKAGE__->meta->make_immutable;