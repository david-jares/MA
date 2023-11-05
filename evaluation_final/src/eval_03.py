import pandas as pd
from scipy.spatial import distance
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

from utils import write_output_to_file


real_data_filepath = 'real_data.csv'
simulated_data_filepath = 'simulated_data.csv'




print("--------- Temporal Analyis: 1  - comparing the distribution of sensor hits over the course of the day-----------")
def process_data(df):
    df.sort_values(by=['id', 'timestamp'], inplace=True)
    df['next_id'] = df['id'].shift(-1)
    df['next_sensor_id'] = df['sensor-id'].shift(-1)
    
    # Filter out rows where the id changes and where consecutive hits have the same sensor-id
    return df[(df['id'] == df['next_id']) & (df['sensor-id'] != df['next_sensor_id'])]

# Load the real and simulated data
real_data = pd.read_csv(real_data_filepath, parse_dates=['timestamp'])
simulated_data = pd.read_csv(simulated_data_filepath, parse_dates=['timestamp'])

# Process the data to filter out consecutive hits with the same sensor-id
real_data = process_data(real_data)
simulated_data = process_data(simulated_data)

# Extracting Hour from timestamps
real_data['hour'] = real_data['timestamp'].dt.hour
simulated_data['hour'] = simulated_data['timestamp'].dt.hour

# Group by hour and count the occurrences
real_grouped = real_data.groupby('hour').size().reset_index(name='real_count')
simulated_grouped = simulated_data.groupby('hour').size().reset_index(name='simulated_count')

# Merging the dataframes on hour for comparison
merged_df = pd.merge(real_grouped, simulated_grouped, on='hour', how='outer').fillna(0)

merged_df.to_csv('results/result_eval_03.csv', index=False)


# Plotting
plt.figure(figsize=(10, 6))
sns.lineplot(data=merged_df, x='hour', y='real_count', label='Real Data', marker='o')
sns.lineplot(data=merged_df, x='hour', y='simulated_count', label='Simulated Data', marker='o')
plt.title('Temporal Distribution of Sensor Hits: Real vs Simulated')
plt.xlabel('Hour of Day')
plt.ylabel('Count of Sensor Hits')
plt.legend()
plt.xticks(range(24))
plt.savefig('results/result_graphic_eval_03.png')
plt.show()
