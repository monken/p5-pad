package Pad::Web;
use Moose;
extends 'Catalyst';

__PACKAGE__->config(
    name => 'pad_web',
    #'Plugin::ConfigLoader' => { file => 'pad_web.json' }
);

__PACKAGE__->setup(qw(
    ConfigLoader
    Static::Simple
));

__PACKAGE__->meta->make_immutable;