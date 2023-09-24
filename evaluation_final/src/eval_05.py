import pandas as pd
from scipy.spatial import distance
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import geopy.distance
from utils import write_output_to_file


real_data_filepath = 'real_data.csv'
simulated_data_filepath = 'simulated_data.csv'


print("---------- Object Movement Analysis ----------")
# Calculate metrics like total distance traveled and average speed for each moving object and compare these between the real and simulated datasets.


def load_and_process_data(file_name):
    data = pd.read_csv(file_name, parse_dates=['timestamp'])
    data.sort_values(['id', 'timestamp'], inplace=True)
    return data

def calculate_metrics(df):
    metrics = {}
    for obj_id, group in df.groupby('id'):
        total_distance = 0
        total_time = pd.Timedelta(0)

        for i in range(1, len(group)):
            start_coords = (group.iloc[i - 1]['y'], group.iloc[i - 1]['x'])
            end_coords = (group.iloc[i]['y'], group.iloc[i]['x'])
            distance = geopy.distance.distance(start_coords, end_coords).km
            total_distance += distance
            total_time += group.iloc[i]['timestamp'] - group.iloc[i - 1]['timestamp']

        average_speed = 0 if total_time.total_seconds() == 0 else total_distance / (total_time.total_seconds() / 3600)
        
        metrics[obj_id] = {'total_distance': total_distance, 'average_speed': average_speed}
        
    return metrics

def plot_histogram(real_metrics, simulated_metrics, metric_name):
    plt.figure(figsize=(12, 6))
    plt.hist([metrics[metric_name] for metrics in real_metrics.values()], bins=30, alpha=0.5, label='Real Data')
    plt.hist([metrics[metric_name] for metrics in simulated_metrics.values()], bins=30, alpha=0.5, label='Simulated Data')
    plt.xlabel(metric_name)
    plt.ylabel('Frequency')
    plt.legend(loc='upper right')
    plt.title(f'Distribution of {metric_name}')
    plt.savefig(f'results/result_graphic_eval_05_{metric_name}_histogram.png')

real_data = load_and_process_data(real_data_filepath)
simulated_data = load_and_process_data(simulated_data_filepath)

real_metrics = calculate_metrics(real_data)
simulated_metrics = calculate_metrics(simulated_data)

for metric_name in ['total_distance', 'average_speed']:
    plot_histogram(real_metrics, simulated_metrics, metric_name)


# 3. Object Movement Analysis
# Objective:
# The goal of this analysis is to meticulously assess the movement characteristics of each individual object within the real and simulated datasets. By focusing on metrics like total distance traveled, average speed, and trajectory directness, this investigation seeks to discern the plausibility of the simulator in replicating real-world mobility patterns.

# Methodology:
# To facilitate this comparison, each object's movement was tracked using its geographical coordinates, which are represented by longitude and latitude in the datasets. The geopy library (version 2.2.0) was employed to compute the distances between consecutive coordinates to derive the total distance traversed by each object. Here's an overview of the analytical process:

# Data Preparation:

# The datasets, comprising real and simulated data, were loaded, and the timestamps were converted to datetime objects to ease subsequent analyses.
# The data was sorted by object IDs and timestamps to maintain chronological order in the computations.
# Distance Calculation:

# The geographical distances between consecutive sensor hits were computed for each object using the Vincenty formula via the geopy library, which considers the Earth's curvature to provide accurate distance measurements.
# Consecutive distances were aggregated to calculate the total distance traveled by each object.
# Average Speed and Trajectory Directness:

# Using the computed distances and the time intervals between consecutive sensor hits, the average speed for each moving object was calculated.
# Trajectory directness was assessed by comparing the straight-line distance between the starting and ending points to the actual path taken, reflecting the object's adherence to a direct route.
# Results Visualization:
# The resultant metrics were visualized using suitable plots to illustrate the variations between the real and simulated datasets effectively. These visual representations facilitate an intuitive understanding of the degree of congruity between the simulator's output and real-world movement patterns.

# Discussion:
# The comprehensive evaluation of object movement provides essential insights into the fidelity of the simulator in mimicking real-world dynamics. Any significant discrepancies between the datasets in terms of movement metrics would necessitate refinements in the simulator's algorithms or parameters to enhance its realism and reliability in representing actual mobility behaviors.
