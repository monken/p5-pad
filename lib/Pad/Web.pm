package Pad::Web;
use Moose;
extends 'Catalyst';

__PACKAGE__->config(
    name => 'pad_web',
);

__PACKAGE__->setup(qw(
    ConfigLoader
    Static::Simple
));

__PACKAGE__->meta->make_immutable;