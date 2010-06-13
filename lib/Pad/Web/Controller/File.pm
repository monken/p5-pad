package Pad::Web::Controller::File;
use Moose;
BEGIN { extends 'Catalyst::Controller'; }
with 'CatalystX::Controller::ExtJS::Direct';

__PACKAGE__->config(
    actions => {
        file => { Chained => '/release/release', PathPart => 'file', CaptureArgs => 1 },
        source => { Chained => 'file', PathPart => 'source', Args => 0, Direct => undef },
        end => { Private => undef }
    }
);

sub file {
    my ($self, $c, $file) = @_;
    my ($distribution, @path) = split(/\//, $file);
    $c->stash->{file} = $c->model('DBIC::Distribution')->find_by_name($file);
    
}

sub source {
    my ($self, $c) = @_;
    my $module = $c->stash->{module};
    $c->stash->{json} = { 
        html => $module->file->source_html, 
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