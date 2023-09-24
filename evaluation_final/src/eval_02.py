import pandas as pd
from scipy.spatial import distance
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

from utils import write_output_to_file


real_data_filepath = 'real_data.csv'
simulated_data_filepath = 'simulated_data.csv'



print("--------- Spatial Analyis: Spatial Distribution -----------")
# 1. Spatial Analysis
# Use sensor IDs to analyze spatial distribution and movement patterns. For instance, compare the frequency of occurrences at each sensor location between real and simulated data."
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
plt.xticks(sensor_counts['sensor-id'] + bar_width / 2, sensor_counts['sensor-id'])  # labels get centered
plt.legend()

plt.tight_layout()
plt.savefig('results/result_graphic_eval_02.png')


# Explanation:
# Objective:
# The primary aim of this computation is to assess how closely the simulator is able to mimic real-world movement patterns of objects as they interact with various sensor locations. The spatial distribution of these interactions is crucial for understanding the validity and reliability of the simulation model.

# Data Representation:
# The data is represented in terms of sensor IDs and the frequency with which objects are recorded at each sensor, within given datasets. These datasets contain the interactions of moving objects with sensors, each interaction represented by an object ID, a timestamp, and a sensor ID.

# Frequency Comparison:
# The frequency of occurrences at each sensor location is computed for both real and simulated datasets. A frequency comparison is performed to identify the disparities and convergences in movement patterns between the real-world and simulated environments.

# Visualization:
# The bar graph plotted by the script visualizes the comparison between the frequency of occurrences at each sensor in real and simulated datasets. This graphical representation aids in quick and intuitive understanding and assessment of the simulation’s accuracy in replicating real-world spatial distribution and interaction patterns.

# Outcome:
# The outcome of this computation provides insights into the plausibility of the simulation. If the simulator’s frequency of occurrences closely aligns with the real-world data, it can be inferred that the simulation is plausible and accurately represents real-world movement patterns. Conversely, significant disparities in frequencies may indicate areas where the simulation model needs refinement.

# Implications for Simulation:
# Validation:
# This analysis serves as a basic validation of the simulation model. It helps in evaluating whether the model can genuinely reproduce real-world scenarios and interactions within the defined environment.

# Model Refinement:
# The identified disparities and inaccuracies can guide developers in refining the simulation model, tweaking parameters, and making necessary adjustments to improve its accuracy and reliability.

# Informed Decision-Making:
# The findings of this comparison enable stakeholders to make informed decisions about the utilization of the simulation model, its application in various scenarios, and its effectiveness in demonstrating and exploring concepts related to smart agriculture applications.

# Remember, the degree to which these frequencies need to match for the simulation to be considered “valid” or “plausible” depends on the specific requirements and acceptable error margins of your project or study.
