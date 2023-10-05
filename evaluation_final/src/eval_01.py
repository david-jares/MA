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


# # Extract coordinates
# real_coordinates = real_data[['x', 'y']].values
# simulated_coordinates = simulated_data[['x', 'y']].values

# # Calculate Euclidean distances for real and simulated data
# real_distances = [euclidean(real_coordinates[i], real_coordinates[i + 1]) for i in range(len(real_coordinates) - 1)]
# simulated_distances = [euclidean(simulated_coordinates[i], simulated_coordinates[i + 1]) for i in range(len(simulated_coordinates) - 1)]

# # Plotting the distances
# plt.figure(figsize=(10,5))
# plt.hist(real_distances, bins=20, color='b', alpha=0.5, label='Real Distances')
# plt.hist(simulated_distances, bins=20, color='r', alpha=0.5, label='Simulated Distances')
# plt.title('Comparison of Euclidean Distances')
# plt.xlabel('Distance')
# plt.ylabel('Frequency')
# plt.legend(loc='upper right')

# # Show the plot
# plt.show()


# # Define a projection centered around the average coordinates of Allmersbach im Tal
# proj = pyproj.Proj(proj='tmerc', lat_0=48.9167, lon_0=9.4333)  # Transverse Mercator projection

# def convert_to_meters(df):
#     x, y = proj(df['x'].values, df['y'].values)
#     return pd.DataFrame({'x': x, 'y': y})

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


# \subsection{Spatial Analysis Visualization}
# A crucial part of our spatial analysis was comparing the Euclidean distances between consecutive points in both real and simulated datasets. 
# The idea is to study the spread and frequency of distances to see how well the simulated data replicate the real-world movements.

# The Python script utilized for this analysis first loads the datasets and extracts the coordinates of points in each trajectory. 
# Subsequently, it calculates the Euclidean distances between every pair of consecutive points in both real and simulated datasets.

# To visualize the comparison, we have opted for a histogram, which enables a clear observation of the frequency distribution of distances in both datasets. 
# In this histogram, each bin has two bars side by side; the left bar (in blue) represents the real dataset, while the right bar (in red) represents the simulated dataset. 
# This side-by-side arrangement of bars facilitates an immediate and intuitive comparison between the two datasets.




# This approach aids in discerning the discrepancies and similarities between the datasets,
# offering insights into the plausibility of the simulated trajectories in mimicking the real-world movements.
# The result of this analysis is illustrated in Figure XX, where the X-axis represents the distances
# and the Y-axis represents the frequencies of those distances in the datasets.
