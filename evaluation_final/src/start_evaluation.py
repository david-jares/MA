import pandas as pd
from scipy.spatial import distance
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

import utils


# real_data_filepath = 'real_data.csv'
# simulated_data_filepath = 'simulated_data.csv'


# 2. Temporal Analysis
# Convert timestamps to a suitable time format and compare the temporal distribution of sensor hits between the real and simulated data.
# Analyze the time intervals between consecutive sensor hits for each moving object to understand the dwell times and movement speeds.
# Perform time-series analysis to understand periodicity, trends, and seasonality in the data and compare these between the real and simulated datasets.

# 3. Object Movement Analysis
# For each unique ID, compare the sequence of sensor hits between real and simulated data, focusing on the order of sensor hits, the time between hits, and the overall trajectory.
# Calculate metrics like total distance traveled, average speed, and trajectory directness for each moving object and compare these between the real and simulated datasets.
# Use similarity measures like Dynamic Time Warping to compare the trajectories of individual objects between the real and simulated data.

# 4. Frequency Analysis
# Analyze the frequency of sensor hits in both datasets. Are some sensors triggered more often in one dataset compared to the other? What are the commonalities and differences?
# Evaluate the distribution of the number of hits per sensor and compare the variances between the real and simulated datasets.

# 5. Statistical Comparison
# Use appropriate statistical tests to compare the distributions of spatial and temporal variables between the real and simulated datasets, evaluating whether observed differences are statistically significant.
# Calculate summary statistics like means, medians, and standard deviations for key variables and compare these between the real and simulated datasets.

# 6. Domain Expert Evaluation
# Involve domain experts to review the spatial-temporal patterns revealed by the data and assess the plausibility of the simulated data based on their domain-specific knowledge and experience.

# 7. Visualization
# Create intuitive visualizations to represent the comparison results, such as histograms for frequency distribution, line graphs for temporal trends, and heatmaps for spatial distribution.

# 8. Evaluation Summary and Recommendations
# Summarize the results of the evaluation, highlighting areas where the simulator performs well and areas where it diverges from real-world data.
# Provide recommendations for adjusting the simulator's parameters or logic to improve its plausibility and accuracy.

print("--------- EVALUATION START -----------")

# import eval_01
# import eval_02
# import eval_03
# import eval_04
# import eval_05
# import eval_06
# import eval_07
# import eval_08
# import eval_09
import eval_10
#
