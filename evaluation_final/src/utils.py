import pyproj
import pandas as pd


def write_output_to_file( output_file, *args):
    with open(output_file, 'w') as f:
        for arg in args:
            f.write(str(arg) + '\n')




# Define a projection centered around the average coordinates of Allmersbach im Tal
proj = pyproj.Proj(proj='tmerc', lat_0=48.9167, lon_0=9.4333)  # Transverse Mercator projection

def convert_to_meters(df):
    x, y = proj(df['x'].values, df['y'].values)
    return pd.DataFrame({'x': x, 'y': y})