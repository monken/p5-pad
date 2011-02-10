package Pad::Web::Controller::Distribution;
use Moose;
BEGIN { extends 'Pad::Web::Controller::Release'; }
with 'CatalystX::Controller::ExtJS::Direct';

__PACKAGE__->config(
    actions => {
        distribution => { Chained => '/', PathPart => 'distribution', CaptureArgs => 1 },
        files => { Chained => 'distribution', Direct => undef },
    }
);

sub distribution {
    my ($self, $c, $object, @rest) = @_;
    my $dist = $c->model('DBIC::Distribution')->find_by_name($object);
    $c->stash->{release} = $dist->latest_release;
}

__PACKAGE__->meta->make_immutable;