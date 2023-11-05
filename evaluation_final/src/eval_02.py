import pandas as pd
import numpy as np
from scipy.spatial import distance
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

from utils import write_output_to_file


real_data_filepath = 'real_data.csv'
simulated_data_filepath = 'simulated_data.csv'



print("--------- Spatial Analyis: Spatial Distribution -----------")
# This script will load the data, calculate the counts and correlation, print the results, and finally, visualize the counts in a bar plot. Do note that this is just a basic script for analysis and visualization. Depending on the details of your data and your specific needs, you might need to refine it further.

# Load Data

real_df = pd.read_csv(real_data_filepath, parse_dates=['timestamp'])
sim_df = pd.read_csv(simulated_data_filepath, parse_dates=['timestamp'])

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

write_output_to_file('results/result_eval_02.txt',sensor_counts,'Correlation between real and simulated sensor counts:', correlation)

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
labelinterval = 10
# plt.xticks(sensor_counts['sensor-id'][::labelinterval] + bar_width / 2, sensor_counts['sensor-id'][::labelinterval])  # labels get centered
plt.xticks(np.arange(0, len(sensor_counts), 10) + bar_width / 2, np.arange(0, len(sensor_counts), 10))
plt.legend()


#
plt.tight_layout()
plt.savefig('results/result_graphic_eval_02.png')

