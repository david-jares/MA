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


print("----------  location transitions ----------")




#  Load the real and simulated data
real_data = pd.read_csv(real_data_filepath)
simulated_data = pd.read_csv(simulated_data_filepath)

# Function to calculate transitions between spaces
def calculate_transitions(data):
    data.sort_values(by=['id', 'timestamp'], inplace=True)
    transitions = data.groupby(['id'])['sensor-id'].apply(lambda x: x.shift(-1) != x).sum()
    return int(transitions)

# Calculate transitions for real and simulated data
transitions_real = calculate_transitions(real_data)
transitions_simulated = calculate_transitions(simulated_data)

# Printing the results
print(f"Real Data: Total Transitions - {transitions_real}")
print(f"Simulated Data: Total Transitions - {transitions_simulated}")

# Plotting the results with real data first
labels = ['Simulated Data', 'Real Data']  # Swapping the order of the labels
transitions = [transitions_simulated, transitions_real]  # Swapping the order of the transitions

plt.figure(figsize=(10,3))  # Adjusting the figure size
plt.barh(labels, transitions, height=0.5, color=['red', 'blue'])  # Adjusting the bar height and color
plt.xlabel('Number of Transitions')
plt.title('Total Number of Transitions between Spaces: Real vs Simulated')

# Adding labels showing the numerical value of each bar
for i, v in enumerate(transitions):
    plt.text(v + 0.1, i - 0.15, str(v), color='black', fontweight='bold', fontsize=12)  # Adjusting the font size and weight

plt.tight_layout()
plt.savefig('results/result_graphic_eval_09_location_transitions.png')