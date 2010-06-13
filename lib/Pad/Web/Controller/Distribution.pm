package Pad::Web::Controller::Distribution;
use Moose;
BEGIN { extends 'Catalyst::Controller'; }
with 'CatalystX::Controller::ExtJS::Direct';

__PACKAGE__->config(
    actions => {
        distribution => { Chained => '/', PathPart => 'distribution', Args => undef },
    }
);

sub distribution {
    my ($self, $c, $object, @rest) = @_;
    my $dist = $c->model('DBIC::Distribution')->find_by_name($object);
    $c->stash->{release} = $dist->latest_release;
    $c->forward('/release/' . join('/', @rest));
}

sub files {
    my ($self, $c) = @_;
    my $dist = $c->stash->{object};
    $c->stash->{json} = [{ text => join('-',$dist->name,$dist->latest_release->version), expanded => \1, children => $dist->latest_release->files_tree }];
    $c->forward($c->view('JSON'));
}

__PACKAGE__->meta->make_immutable;