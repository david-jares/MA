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


