import pandas as pd
from scipy.spatial import distance
import matplotlib.pyplot as plt

print("--------- EVALUATION START -----------")
print("--------- Spatial Analyis: Euclidean Distance -----------")

# def read_file():
#     with open("test.txt", "r") as file:
#         content = file.read()
#         print(content)

# read_file()


# Replace these file paths with the actual paths to your data files
real_file_path = 'real_data.csv'
sim_file_path = 'simulated_data.csv'

# Loading datasets
real_df = pd.read_csv(real_file_path)
sim_df = pd.read_csv(sim_file_path)

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




print("--------- Spatial Analyis: Spatial Distribution -----------")
# 1. Spatial Analysis
# Use sensor IDs to analyze spatial distribution and movement patterns. For instance, compare the frequency of occurrences at each sensor location between real and simulated data."
# This script will load the data, calculate the counts and correlation, print the results, and finally, visualize the counts in a bar plot. Do note that this is just a basic script for analysis and visualization. Depending on the details of your data and your specific needs, you might need to refine it further.


# Load Data
real_file_path = 'real_data.csv'
sim_file_path = 'simulated_data.csv'

real_df = pd.read_csv(real_file_path, parse_dates=['timestamp'])
sim_df = pd.read_csv(sim_file_path, parse_dates=['timestamp'])

# Group by 'sensor-id' and count occurrences for real and simulated data
real_sensor_counts = real_df.groupby('sensor-id').size().reset_index(name='counts_real')
sim_sensor_counts = sim_df.groupby('sensor-id').size().reset_index(name='counts_sim')

# Merge the count dataframes on 'sensor-id'
sensor_counts = pd.merge(real_sensor_counts, sim_sensor_counts, on='sensor-id', how='outer').fillna(0)

# Print the counts
print(sensor_counts)

# Calculate the correlation between the real and simulated counts
correlation = sensor_counts['counts_real'].corr(sensor_counts['counts_sim'])
print('Correlation between real and simulated sensor counts:', correlation)

# Visualization
# Set up the plot
fig, ax = plt.subplots(figsize=(10, 6))

# Bar width
bar_width = 0.35

# Opacity
opacity = 0.7

# Bar plots
rects1 = plt.bar(sensor_counts['sensor-id'], sensor_counts['counts_real'], bar_width,
                 alpha=opacity, color='b', label='Real')

rects2 = plt.bar(sensor_counts['sensor-id'] + bar_width, sensor_counts['counts_sim'], bar_width,
                 alpha=opacity, color='r', label='Simulated')

plt.xlabel('Sensor ID')
plt.ylabel('Counts')
plt.title('Comparison of sensor counts between real and simulated data')
plt.xticks(sensor_counts['sensor-id'] + bar_width / 2, sensor_counts['sensor-id'])  # labels get centered
plt.legend()

plt.tight_layout()
plt.show()
