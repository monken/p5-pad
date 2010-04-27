package Pad::Schema;

use Moose;
extends 'MooseX::DBIC::Schema';

use DateTime::Format::SQLite;

use MooseX::Attribute::Deflator;

inflate 'DateTime', via { DateTime::Format::SQLite->parse_datetime( $_ ) };

no MooseX::Attribute::Deflator;

__PACKAGE__->load_classes(qw(Module Distribution Release Dependency Author File));

__PACKAGE__->meta->make_immutable;