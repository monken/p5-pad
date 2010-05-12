package Pad::Web;
use Moose;
use CatalystX::RoleApplicator;
extends 'Catalyst';

__PACKAGE__->config(
    name => 'pad_web',
);

__PACKAGE__->setup(qw(
    ConfigLoader
    Static::Simple
));

__PACKAGE__->apply_request_class_roles(
      qw/Catalyst::TraitFor::Request::REST::ForBrowsers/
    );
__PACKAGE__->meta->make_immutable;