package Pad::Web::Controller::Release;
use Moose;
BEGIN { extends 'Catalyst::Controller'; }
with 'CatalystX::Controller::ExtJS::Direct';

__PACKAGE__->config(
    actions => {
        release => { Chained => '/', PathPart => 'release', CaptureArgs => 1 },
        files => { Chained => 'release', PathPart => 'files', Args => 0, Direct => undef  }
    }
);

sub release {
    my ($self, $c, $object) = @_;
    $c->stash->{release} ||= $c->model('DBIC::Distribution')->find_by_name($object);
}

sub files {
    my ($self, $c) = @_;
    my $release = $c->stash->{release};
    $c->stash->{json} = [{ text => $release->name, expanded => \1, children => $release->files_tree }];
    $c->forward($c->view('JSON'));
}

__PACKAGE__->meta->make_immutable;