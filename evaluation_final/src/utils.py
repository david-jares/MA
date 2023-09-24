def write_output_to_file( output_file, *args):
    with open(output_file, 'w') as f:
        for arg in args:
            f.write(str(arg) + '\n')