package Pad::Web::Controller::Distribution;
use Moose;
extends 'Catalyst::Controller';
with 'CatalystX::Controller::ExtJS::Direct';

__PACKAGE__->config(
    actions => {
        distribution => { Chained => '/', PathPart => 'distribution', CaptureArgs => 1 },
        index => { Chained => 'distribution', PathPart => '', Args => 0 },
        files => { Chained => 'distribution', PathPart => 'files', Args => 0, Direct => undef  }
    }
);

sub distribution {
    my ($self, $c, $object) = @_;
    $c->stash->{object} = $c->model('DBIC::Distribution')->find_by_name($object);
}

sub index {}

sub files {
    my ($self, $c) = @_;
    my $dist = $c->stash->{object};
    $c->stash->{json} = [{ text => join('-',$dist->name,$dist->latest_release->version), expanded => \1, children => $dist->latest_release->files->tree }];
    $c->forward($c->view('JSON'));
}

__PACKAGE__->meta->make_immutable;