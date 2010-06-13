package Pad::Web::Controller::Module;
use Moose;
BEGIN { extends 'Catalyst::Controller'; }
with 'CatalystX::Controller::ExtJS::Direct';

__PACKAGE__->config(
    actions => {
        module => { Chained => '/', PathPart => 'module', CaptureArgs => 1 },
        search => { Chained => 'module', PathPart => '', Args => 0, Direct => undef },
        pod => { Chained => 'module', PathPart => 'pod', Args => 0, Direct => undef },
        code => { Chained => 'module', PathPart => 'code', Args => 0, Direct => undef },
        end => { Private => undef }
    }
);

sub module {
    my ($self, $c, $module) = @_;
    $c->stash->{module} = $c->model('DBIC::Module')->find_latest_by_name($module);
    
}

sub search {
    my ($self, $c) = @_;
    my $search = $c->req->captures->[0];
    
}

sub pod {
    my ($self, $c) = @_;
    my $module = $c->stash->{module};
    $c->stash->{json} = { html => $module->pod_html, toc => $module->toc };
    $c->forward($c->view('JSON'));
}

sub code {
    my ($self, $c) = @_;
    my $module = $c->stash->{module};
    $c->stash->{json} = { 
        html => $module->file->source_html, 
        sloc => $module->sloc, 
        size => $module->file->size, 
        pod_lines => $module->pod_lines
    };
    $c->forward($c->view('JSON'));
}

sub end {
    my ($self, $c) = @_;
    if($c->req->looks_like_browser) {
        $c->res->body($c->stash->{json}->{html});
        $c->res->content_type('text/html');
    } else { 
        $c->forward($c->view('JSON'));
    }
}

__PACKAGE__->meta->make_immutable;