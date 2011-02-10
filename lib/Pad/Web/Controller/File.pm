package Pad::Web::Controller::File;
use Moose;
BEGIN { extends 'Catalyst::Controller'; }
with 'CatalystX::Controller::ExtJS::Direct';

__PACKAGE__->config(
    actions => {
        file => { Chained => '/', PathPart => 'file', CaptureArgs => 1 },
        source => { Chained => 'file', PathPart => 'source', Args => 0, Direct => undef },
        related => { Chained => 'file', PathPart => 'related', Args => 0, Direct => undef },
        end => { Private => undef }
    }
);

sub file {
    my ($self, $c, $file) = @_;
    $c->stash->{file} = $c->model('DBIC::File')->find_by_full_path($file) || $c->detach;
    
}

sub source {
    my ($self, $c) = @_;
    my $file = $c->stash->{file};
    $c->stash->{json} = { 
        html => $file->source_html,
        size => $file->size,
        file => $file->full_path,
        release => $file->release->name,
    };
    $c->forward($c->view('JSON'));
}

sub related {
    my ($self, $c) = @_;
    my $file = $c->stash->{file};
    $file->name;
    my $release = $file->release;
    my $dependencies = $release->dependencies;
    
    $c->log->debug($file->release);
    my @data;
    while(my $dep = $dependencies->next) {
        push(@data, { name => $dep->module_name });
    }
    $c->stash->{json} = { data => \@data, file => $file->full_path };
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