import pandas as pd
import matplotlib.pyplot as plt
import pyproj
import numpy as np


real_data_filepath = 'real_data.csv'
simulated_data_filepath = 'simulated_data.csv'


print("----------  distance travelled ----------")

# Define a projection centered around the average coordinates of Allmersbach im Tal
proj = pyproj.Proj(proj='tmerc', lat_0=48.9167, lon_0=9.4333)  # Transverse Mercator projection

def convert_to_meters(df):
    x, y = proj(df['x'].values, df['y'].values)
    return pd.DataFrame({'id': df['id'], 'x': x, 'y': y})

# Load the real and simulated data
real_data_filepath = 'real_data.csv'
simulated_data_filepath = 'simulated_data.csv'

real_data = pd.read_csv(real_data_filepath)
simulated_data = pd.read_csv(simulated_data_filepath)

real_data_meters = convert_to_meters(real_data)
simulated_data_meters = convert_to_meters(simulated_data)
print(real_data_meters)

# Define a function to calculate the distance between two points
def distance(x1, y1, x2, y2):
    return np.sqrt((x2 - x1)**2 + (y2 - y1)**2)

# Define a function to calculate the accumulated distance travelled by an entity
def distance_travelled(df):
    # Calculate the distance between each consecutive pair of rows
    distances = [distance(x1, y1, x2, y2) for x1, y1, x2, y2 in zip(df['x'].values[:-1], df['y'].values[:-1], df['x'].values[1:], df['y'].values[1:])]
    # Accumulate the distances travelled
    return sum(distances)

# Group the data by entity ID and calculate the accumulated distance travelled by each entity
real_distances = real_data_meters.groupby('id').apply(distance_travelled)
simulated_distances = simulated_data_meters.groupby('id').apply(distance_travelled)

# Sum up the accumulated distances travelled by all entities in each dataset
total_real_distance = real_distances.sum()
total_simulated_distance = simulated_distances.sum()

# Print the results
print("Total accumulated distance travelled in real data: {:.2f} meters".format(total_real_distance))
print("Total accumulated distance travelled in simulated data: {:.2f} meters".format(total_simulated_distance))



# Plotting the results with real data first
labels = ['Simulated Data', 'Real Data']  # Swapping the order of the labels
distances = [total_simulated_distance, total_real_distance]  # Swapping the order of the distances

plt.figure(figsize=(10,3))  # Adjusting the figure size
plt.barh(labels, distances, height=0.5, color=['orange', 'blue'],left=0.2)  # Adjusting the bar height and color
plt.xlabel('distances')
plt.title('Total distances between Spaces: Real vs Simulated')

# Adding labels showing the numerical value of each bar
for i, v in enumerate(distances):
    plt.text(v + 0.1, i - 0.15, str(int(v)), color='black', fontweight='bold', fontsize=12)  # Adjusting the font size and weight

# plt.xticks(range(0, int(max(distances))+1, 2))  # Setting the x-axis tick marks to show every second label

plt.tight_layout()


plt.savefig('results/result_graphic_eval_10_distance_travelled.png')