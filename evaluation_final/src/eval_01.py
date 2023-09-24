import pandas as pd
from scipy.spatial import distance
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

from utils import write_output_to_file


real_data_filepath = 'real_data.csv'
simulated_data_filepath = 'simulated_data.csv'


print("--------- Spatial Analyis: Euclidean Distance -----------")


# Loading datasets
real_df = pd.read_csv(real_data_filepath)
sim_df = pd.read_csv(simulated_data_filepath)

# Adjust the merging part if there are additional columns to consider
merged_df = pd.merge(real_df, sim_df, on=['id', 'timestamp'], suffixes=['_real', '_sim'])

def calculate_distance(row):
    coord_real = (row['x_real'], row['y_real'])
    coord_sim = (row['x_sim'], row['y_sim'])
    return distance.euclidean(coord_real, coord_sim)

# Applying the distance calculation for each row
merged_df['distance'] = merged_df.apply(calculate_distance, axis=1)


# Now, you can analyze the 'distance' column to evaluate the plausibility of the simulator
print(merged_df)
merged_df.to_csv('results/result_eval_01.csv', index=False)
