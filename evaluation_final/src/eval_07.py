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


print("---------- Statistical Comparison ----------")



# Load the real and simulated data
real_data = pd.read_csv(real_data_filepath, parse_dates=['timestamp'])
simulated_data = pd.read_csv(simulated_data_filepath, parse_dates=['timestamp'])

# Assuming the data has columns: ['id', 'timestamp', 'sensor_id', 'latitude', 'longitude']

# Variables to compare
variables = ['timestamp', 'sensor-id', 'y', 'x']  # Adjust with the actual column names in your dataset

# Convert datetime columns to Unix timestamps
real_data['timestamp'] = real_data['timestamp'].astype(np.int64) // 10**9
simulated_data['timestamp'] = simulated_data['timestamp'].astype(np.int64) // 10**9

# Initialize a results DataFrame
results = pd.DataFrame(columns=['Variable', 'Real_Mean', 'Simulated_Mean', 'T-Test_p-value', 'Real_Median', 'Simulated_Median', 'MannWhitneyU_p-value'])

# Loop through each variable and perform statistical tests
for var in variables:
    # Summary Statistics
    real_mean = real_data[var].mean()
    simulated_mean = simulated_data[var].mean()
    real_median = real_data[var].median()
    simulated_median = simulated_data[var].median()

    # T-Test for comparing means
    t_stat, t_p_value = stats.ttest_ind(real_data[var].dropna(), simulated_data[var].dropna(), equal_var=False)

    # Mann-Whitney U Test for comparing medians
    mw_stat, mw_p_value = stats.mannwhitneyu(real_data[var].dropna(), simulated_data[var].dropna(), alternative='two-sided')

    # Append the results to the results DataFrame
    results = results.append({
        'Variable': var,
        'Real_Mean': real_mean,
        'Simulated_Mean': simulated_mean,
        'T-Test_p-value': t_p_value,
        'Real_Median': real_median,
        'Simulated_Median': simulated_median,
        'MannWhitneyU_p-value': mw_p_value
    }, ignore_index=True)

# Print or Save the results
print(results)
results.to_csv('results/result_eval_07.csv', index=False)



# visualize the results
# Set the aesthetic style of the plots
sns.set(style="whitegrid")

# Loop through each variable and perform visualization
for var in variables:
    # Bar Plot for Comparing Means and Medians
    plt.figure(figsize=(10, 6))
    
    sns.barplot(x=['Real', 'Simulated'], y=[real_data[var].mean(), simulated_data[var].mean()])
    plt.title(f'Mean Comparison for {var}')
    plt.ylabel('Mean')
    plt.savefig(f'results/result_graphic_eval_07_mean_comparison_{var}.png')
    # plt.show()
    
    plt.figure(figsize=(10, 6))
    sns.barplot(x=['Real', 'Simulated'], y=[real_data[var].median(), simulated_data[var].median()])
    plt.title(f'Median Comparison for {var}')
    plt.ylabel('Median')
    plt.savefig(f'results/result_graphic_eval_07_median_comparison_{var}.png')
    # plt.show()

    # Distribution Plot for Visualizing Distributions
    plt.figure(figsize=(10, 6))
    
    sns.kdeplot(real_data[var].dropna(), label='Real', fill=True)
    sns.kdeplot(simulated_data[var].dropna(), label='Simulated', fill=True)
    plt.title(f'Distribution Comparison for {var}')
    plt.xlabel(var)
    plt.ylabel('Density')
    plt.legend()
    plt.savefig(f'results/result_graphic_eval_07_distribution_comparison_{var}.png')
    # plt.show()

# Combined Explanation:
# Statistical Comparison and Visualization:
# In the evaluation process, comprehensive statistical comparison and visual analysis are performed to discern the differences and similarities between the real and simulated datasets. Various metrics and variables are analyzed using both statistical tests and visualization methods to offer a holistic view of the data characteristics.

# Variables Analysis:

# Variables like sensor hits, time intervals, and spatial coordinates are scrutinized using summary statistics including means, medians, and standard deviations. These provide insights into the central tendencies and spreads of the distributions in both datasets.
# Appropriate statistical tests are employed to assess whether the observed differences in these variables are statistically significant. This involves comparing p-values to a significance level, often 0.05, to determine the likelihood of observing such differences if the datasets were identical.
# Visualization Techniques:

# Bar Plots: Mean and Median comparisons are visualized using bar plots, allowing for an immediate and clear understanding of the central tendencies in both datasets. This enables readers to quickly gauge differences in average values and middle points of the datasets.
# Kernel Density Estimate (KDE) Plots: These plots offer a smooth visualization of the data distributions. By overlaying the KDE plots of the real and simulated data, discrepancies and congruences in the distribution shapes, central values, and spreads become discernible.
# Objective:
# The combination of statistical comparison and visualization aims to ground visual observations with statistical rigor, providing a conclusive and comprehensive evaluation of the disparities and parallels between the real and simulated datasets. This approach ensures that the evaluation is not solely reliant on numerical metrics or visual cues but amalgamates both to furnish a more rounded and robust analysis.

# Insightful Interpretation:
# By employing both statistical and visual tools, the evaluation elucidates the nuances of the datasets, allowing readers to interpret the results intuitively while being backed by quantitative analysis. This synergy of methodologies offers an enriched perspective, essential for validating the reliability and relevance of the simulated dataset against its real counterpart.

# In essence, the intertwining of statistical analysis with visualization forms a symbiotic methodological approach, ensuring the evaluation's clarity, comprehensibility, and accuracy, crucial for substantiating the fidelity of the simulation model in replicating real-world scenarios.