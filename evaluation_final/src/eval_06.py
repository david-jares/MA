import pandas as pd
from scipy.spatial import distance
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
from scipy.stats import describe

from utils import write_output_to_file


real_data_filepath = 'real_data.csv'
simulated_data_filepath = 'simulated_data.csv'


print("---------- Frequency Analysis ----------")


# Load the real and simulated data
real_data = pd.read_csv(real_data_filepath)
simulated_data = pd.read_csv(simulated_data_filepath)

# Function to analyze frequency of sensor hits
def analyze_frequency(data):
    return data.groupby('sensor-id').size().reset_index(name='frequency')

# Analyzing the frequency of sensor hits in both datasets
real_frequency = analyze_frequency(real_data)
simulated_frequency = analyze_frequency(simulated_data)

# Merge the frequency dataframes for comparison
merged_frequency = pd.merge(real_frequency, simulated_frequency, on='sensor-id', how='outer', suffixes=('_real', '_simulated')).fillna(0)

# Descriptive Statistics
real_describe = describe(merged_frequency['frequency_real'])
simulated_describe = describe(merged_frequency['frequency_simulated'])

print(f"Real Data Descriptive Statistics: {real_describe}")
print(f"Simulated Data Descriptive Statistics: {simulated_describe}")

write_output_to_file('results/result_eval_06.txt',f"Real Data Descriptive Statistics: {real_describe}",f"Simulated Data Descriptive Statistics: {simulated_describe}")


# Visualizing the frequency distribution
plt.figure(figsize=(10,6))
sns.histplot(merged_frequency['frequency_real'], bins=30, kde=True, color='blue', label='Real Data')
sns.histplot(merged_frequency['frequency_simulated'], bins=30, kde=True, color='red', label='Simulated Data')
plt.xlabel('Frequency of Sensor Hits')
plt.ylabel('Count')
plt.title('Distribution of Sensor Hit Frequencies: Real vs Simulated')
plt.legend()
plt.savefig('frequency_analysis.png')
# plt.show()
plt.savefig('results/result_graphic_eval_06.png')


# Explanation for the Thesis:
# This script conducts a Frequency Analysis to scrutinize and compare the number of sensor hits between real and simulated datasets, focusing on pinpointing the variations in the frequency with which each sensor is triggered.

# Methodology:
# Data Loading:
# The datasets are loaded into pandas DataFrames, enabling ease of manipulation and analysis.

# Frequency Analysis:
# The script examines the frequency of hits per sensor, and a histogram plot is generated to visually contrast these frequencies between the real and simulated data.

# Descriptive Statistics:
# The script computes and prints descriptive statistics for the frequencies in both datasets, providing insights into the distribution's central tendency, spread, and shape.

# Comparison:
# The frequencies of sensor hits from both datasets are juxtaposed to discern commonalities and discrepancies. This comparison sheds light on whether some sensors are triggered more recurrently in one dataset compared to the other.

# Visualization:
# The histograms generated in this script elucidate the distribution and density of the sensor hit frequencies in both datasets, allowing for an immediate visual assessment of similarities and disparities in the frequency distributions.

# Conclusion:
# By evaluating the frequency distribution of sensor hits and comparing the variances between the real and simulated datasets, this analysis aids in understanding the fidelity of the simulator in replicating real-world sensor hit patterns and frequencies.

# Remember to tailor this explanation to fit the context and results of your specific study and to enhance the clarity and coherence of your evaluation chapter.