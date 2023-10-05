import pandas as pd
import numpy as np
from scipy.spatial import distance
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import scipy.stats as stats

from utils import write_output_to_file


real_data_filepath = 'real_data.csv'
simulated_data_filepath = 'simulated_data.csv'


print("---------- Amount of Distinct Locations Visited ----------")



# Load the real and simulated data
real_data = pd.read_csv(real_data_filepath)
simulated_data = pd.read_csv(simulated_data_filepath)

# Function to calculate the total and average number of distinct locations visited
def calculate_locations(data):
    total_locations = len(data['sensor-id'].unique())
    avg_locations_per_cow = data.groupby('id')['sensor-id'].nunique().mean()
    return total_locations, avg_locations_per_cow

# Calculate the metrics for real and simulated data
total_real, avg_real = calculate_locations(real_data)
total_simulated, avg_simulated = calculate_locations(simulated_data)

#  Plotting the results
labels = ['Simulated Data', 'Real Data' ]
total_real, avg_real = calculate_locations(real_data)
total_simulated, avg_simulated = calculate_locations(simulated_data)
total_locations = [total_simulated, total_real]
avg_locations = [avg_simulated, avg_real]

y = np.arange(len(labels))
height = 0.2  # set the height of the bars

fig, ax = plt.subplots(figsize=(10,6))
rects1 = ax.barh(y - height/2, total_locations, height, label='Total Locations visited', color=['#222222', '#222222'])
rects2 = ax.barh(y + height/2, avg_locations, height, label='Average Locations visited per Cow', color=['#999999', '#999999'])

# Add some text for labels, title and custom y-axis tick labels, etc.
ax.set_xlabel('Number of Locations')
ax.set_title('Total and Average Number of Distinct Locations Visited')
ax.set_yticks(y)
ax.set_yticklabels(labels)
ax.legend()

# Add value labels to the bars
def autolabel(rects):
    for rect in rects:
        width = rect.get_width()
        ax.annotate('{}'.format(width),
                    xy=(width, rect.get_y() + rect.get_height() / 2),
                    xytext=(3, 0),  # 3 points horizontal offset
                    textcoords="offset points",
                    ha='left', va='center')

autolabel(rects1)
autolabel(rects2)

fig.tight_layout()
plt.savefig('results/result_graphic_eval_08_locations_visited.png')

plt.show()
