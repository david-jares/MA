import pandas as pd
# from scipy.spatial import distance
from scipy.spatial.distance import euclidean
import pyproj

import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import numpy as np

from utils import write_output_to_file
from utils import convert_to_meters

real_data_filepath = 'real_data.csv'
simulated_data_filepath = 'simulated_data.csv'


print("--------- Spatial Analyis: Euclidean Distance -----------")



# Load the datasets
real_data = pd.read_csv(real_data_filepath)
simulated_data = pd.read_csv(simulated_data_filepath)



# Convert coordinates to meters
real_data_meters = convert_to_meters(real_data)
simulated_data_meters = convert_to_meters(simulated_data)
# with open('testoutput.txt', 'w') as f:
    # f.write(str(real_data_meters))
def calculate_distances(df):
    distances = np.sqrt(np.diff(df['x'])**2 + np.diff(df['y'])**2)
    return distances

# Calculate Euclidean distances
real_distances = calculate_distances(real_data_meters)
simulated_distances = calculate_distances(simulated_data_meters)

# Histogram
n_bins = 30  # or any other suitable number
real_hist, real_bins = np.histogram(real_distances, bins=n_bins)
simulated_hist, simulated_bins = np.histogram(simulated_distances, bins=n_bins)

# Define bar width
bar_width = 0.35 / 2  # half for each of real and simulated data

# Set up the plot
plt.figure(figsize=(10, 5))

# Plotting the distances
for i in range(n_bins):
    plt.bar(real_bins[i] - bar_width, real_hist[i], width=bar_width, color='b', label='Real' if i == 0 else "")
    plt.bar(simulated_bins[i], simulated_hist[i], width=bar_width, color='r', label='Simulated' if i == 0 else "")

plt.xlabel('Distance (meters)')
plt.ylabel('Frequency')
plt.legend()
plt.show()
plt.savefig('results/result_graphic_eval_01.png')


