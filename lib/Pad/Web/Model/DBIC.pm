package Pad::Web::Model::DBIC;
use Moose;
extends 'Catalyst::Model::DBIC::Schema';
__PACKAGE__->config(
    schema_class => 'Pad::Schema'
);
__PACKAGE__->meta->make_immutable;