package Pad::Web::Controller::Module;
use Moose;
extends 'Catalyst::Controller';
with 'CatalystX::Controller::ExtJS::Direct';

__PACKAGE__->config(
    actions => {
        module => { Chained => '/', PathPart => 'module', CaptureArgs => 1 },
        pod => { Chained => 'module', PathPart => 'pod', Args => 0, Direct => undef },
    }
);

sub module {
    my ($self, $c, $module) = @_;
    $c->stash->{module} = $c->model('DBIC::Module')->find_latest_by_name($module);
    
}

sub pod {
    my ($self, $c) = @_;
    my $module = $c->stash->{module};
    $c->stash->{json} = { html => $module->pod_html, toc => $module->toc };
    $c->forward($c->view('JSON'));
}

__PACKAGE__->meta->make_immutable;