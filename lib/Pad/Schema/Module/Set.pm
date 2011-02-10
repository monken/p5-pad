package Pad::Schema::Module::Set;
use Moose;
extends 'DBIx::Class::ResultSet';

sub find_latest_by_name {
    my ($self, $name) = @_;
    return $self->search(
        { 'me.name' => $name }, 
        { 
            join => 'release', 
            order_by => { -desc => 'release.version_numified'}
        }
    )->first;
}

sub search_latest_by_name {
    my ($self, $name) = @_;
    $name =~ s/([_%])/\\$1/g;
    $name =~ s/^::?/%::/;
    return $self->search(
        { 'me.name' => { 'LIKE' => $name . '%' } }, 
        { 
            columns => ['name', 'release.name', 'file.name'],
            join => [ 'release', 'file' ],
            order_by => [ { -asc => 'me.name' }, { -desc => 'release.version_numified' } ],
            rows => 50,
            result_class => 'DBIx::Class::ResultClass::HashRefInflator'
        }
    );
}

1;