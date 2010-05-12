package Pad::Web::View::JSON;
use Moose;
extends 'Catalyst::View::JSON';

BEGIN { $ENV{JSON_ANY_ORDER} = 'DWIW'; }

__PACKAGE__->config( expose_stash => 'json' );
__PACKAGE__->meta->make_immutable(inline_constructor => 0);