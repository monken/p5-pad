package Pad::Web::Controller::Module;
use Moose;
BEGIN { extends 'Catalyst::Controller'; }
with 'CatalystX::Controller::ExtJS::Direct';

__PACKAGE__->config(
    actions => {
        module => { Chained => '/', PathPart => 'module', CaptureArgs => 1 },
        search =>
          { Chained => '/', PathPart => 'module', Args => 0, Direct => undef, DirectArgs => 1 },
        pod => {
            Chained  => 'module',
            PathPart => 'pod',
            Args     => 0,
            Direct   => undef
        },
        code => {
            Chained  => 'module',
            PathPart => 'code',
            Args     => 0,
            Direct   => undef
        },
        related => {
            Chained  => 'module',
            PathPart => 'related',
            Args     => 0,
            Direct   => undef
        },
        files => {
            Chained  => 'module',
            PathPart => 'files',
            Args     => 0,
            Direct   => undef
        },
        not_found => { Action => undef },
        end => { Private => undef }
    }
);

sub module {
    my ( $self, $c, $module ) = @_;
    $c->stash->{module} =
      $c->model('DBIC::Module')->find_latest_by_name($module) || $c->detach('not_found');

}

sub search {
    my ( $self, $c ) = @_;
    my $query   = $c->req->params->{query};
    my $modules = $c->model('DBIC::Module')->search_latest_by_name($query);
    my @mods;
    while ( my $mod = $modules->next ) {
        push(
            @mods,
            {
                ( map { $_ => $mod->{$_} } qw(name) ),
                release => $mod->{release}->{name},
                file =>
                  join( '/', $mod->{release}->{name}, $mod->{file}->{name} )
            }
        );
        $c->stash->{json} = { data => \@mods };

    }
}

sub pod {
    my ( $self, $c ) = @_;
    my $module = $c->stash->{module};
    $c->stash->{json} = {
        html    => $module->pod_html,
        toc     => $module->toc,
        release => $module->release->name,
        file    => $module->file->full_path
    };
}

sub code {
    my ( $self, $c ) = @_;
    my $module = $c->stash->{module};
    $c->stash->{json} = {
        html      => $module->file->source_html,
        sloc      => $module->sloc,
        size      => $module->file->size,
        pod_lines => $module->pod_lines,
        release   => $module->release->name,
        file      => $module->file->full_path,
    };
}

sub related {
    my ( $self, $c ) = @_;
    $c->stash->{file} = $c->stash->{module}->file;
    $c->controller('File')->related($c);
}

sub files {
    my ( $self, $c ) = @_;
    $c->stash->{json} = { data => [] };
    $c->stash->{release} = $c->stash->{module}->release;
    $c->controller('Release')->files($c);
}

sub not_found {
    my ($self, $c) = @_;
    $c->res->status(404);
    $c->stash->{json} = {};
}

sub end {
    my ( $self, $c ) = @_;
    $c->stash->{json} ||= {};
    if ( $c->req->looks_like_browser ) {
        $c->res->body( $c->stash->{json}->{html} );
        $c->res->content_type('text/html');
    }
    else {
        $c->forward( $c->view('JSON') );
    }
}

__PACKAGE__->meta->make_immutable;
