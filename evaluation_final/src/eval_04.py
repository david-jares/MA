import pandas as pd
from scipy.spatial import distance
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

from utils import write_output_to_file


real_data_filepath = 'real_data.csv'
simulated_data_filepath = 'simulated_data.csv'




print("--------- Temporal Analyis: 2 - analysis on the time intervals between consecutive sensor hits  -----------")
import pandas as pd
import matplotlib.pyplot as plt

# Assuming the data has columns: ['id', 'timestamp', 'sensor_id']
real_data = pd.read_csv(real_data_filepath, parse_dates=['timestamp'])
simulated_data = pd.read_csv(simulated_data_filepath, parse_dates=['timestamp'])

def process_data(df):
    df.sort_values(by=['id', 'timestamp'], inplace=True)
    df['next_id'] = df['id'].shift(-1)
    df['next_sensor_id'] = df['sensor-id'].shift(-1)
    df['interval'] = df['timestamp'].shift(-1) - df['timestamp']
    
    # Filter out rows where the id changes and where consecutive hits have the same sensor-id
    df = df[(df['id'] == df['next_id']) & (df['sensor-id'] != df['next_sensor_id'])]
    return df

def convert_to_timedelta(df):
    try:
        df['interval'] = pd.to_timedelta(df['interval'])
    except Exception as e:
        print("Conversion Error: ", e)
        print("Non-convertible value: ", df.loc[df['interval'].apply(lambda x: type(x) != pd.Timedelta), 'interval'])
    return df

real_data = process_data(real_data)
simulated_data = process_data(simulated_data)

real_data = convert_to_timedelta(real_data)
simulated_data = convert_to_timedelta(simulated_data)

write_output_to_file('results/result_eval_04.txt','real_data',real_data,'simulated_data',simulated_data)

plt.figure(figsize=(12, 6))
plt.hist(real_data['interval'].dt.total_seconds() / 60, bins=30, alpha=0.5, label='Real Data')
plt.hist(simulated_data['interval'].dt.total_seconds() / 60, bins=30, alpha=0.5, label='Simulated Data')
plt.xlabel('Interval (minutes)')
plt.ylabel('Frequency')
plt.legend(loc='upper right')
plt.title('Distribution of Time Intervals Between Consecutive Sensor Hits')
plt.savefig('results/result_graphic_eval_04.png')

# This script is designed to conduct a comprehensive analysis on the time intervals between consecutive sensor hits for both real and simulated datasets. The main objective is to assess and compare the distributions of time intervals in both datasets, shedding light on the movement speeds and dwell times of the moving objects within the sensor network.

# Data Loading and Preparation:

# The real and simulated datasets are loaded, ensuring that the ‘timestamp’ column is recognized as datetime objects.
# The datasets are preprocessed by sorting the rows based on 'id' and 'timestamp' to align consecutive sensor hits correctly.
# Subsequent columns are created to hold the ‘id’ and ‘sensor_id’ of the next sensor hit, along with the ‘interval’ representing the time difference between consecutive hits.
# Data Processing:

# Filtering is applied to discard rows where the ‘id’ changes, signifying a different moving object, and where consecutive sensor hits pertain to the same ‘sensor_id’, reflecting static positioning.
# The ‘interval’ column is converted to timedelta objects to facilitate further analysis and visualization.
# Any errors or non-convertible values during conversion are logged for troubleshooting.
# Histogram Visualization:

# A histogram is constructed to visualize the distribution of time intervals between consecutive sensor hits in minutes.
# The X-axis represents the intervals in minutes, and the Y-axis represents the frequency of each interval.
# Separate histograms for real and simulated data are plotted in the same graph, each with a different color and opacity, for comparative analysis.
# Output:

# The histogram is saved as ‘interval_histogram.png’, providing a visual representation of how closely the simulated data replicates the time intervals between consecutive sensor hits observed in the real data.
# This analysis is pivotal in understanding whether the simulated data replicates the dwell times and movement speeds exhibited in the real data, allowing for identification of any significant deviations or patterns.