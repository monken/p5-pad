package Pad::Schema::File::Set;
use Moose;
extends 'DBIx::Class::ResultSet';

sub tree {
    my ($self, $files) = @_;
    $files = {
        map { $_->name => $_ } 
        sort { $a->name cmp $b->name } 
        $self->search(undef, {prefetch => 'module' })->all
    } 
        unless($files);
    my %dirs;
    my $return;
    foreach my $file (keys %$files) {
        if($file =~ /(^.*?)\/(.*$)/) {
            $dirs{$1}->{$2} = $files->{$file};
        } else {
            my $module = $files->{$file}->module->name 
                if($files->{$file}->has_module );
            push(@$return, { text => $file, leaf => \1, module => $module, id => $files->{$file}->id });
        }
    }
    while(my($dir, $dirfiles) = each %dirs) {
        push(@$return, { text => $dir, children => $self->tree($dirfiles) });
    }
    return $return;
}

sub no_content {
    my $self = shift;
    return $self->search(undef, { columns => [
        grep { $_ ne 'content' } $self->result_source->columns
    ] } );
}

sub find_by_full_path {
    my ($self, $file) = @_;
    my ($release, @path) = split(/\//, $file);
    return $self->search({ 'release.name' => $release, 'me.name' => join("/", @path) }, { prefetch => 'release' })->first;
}

1;