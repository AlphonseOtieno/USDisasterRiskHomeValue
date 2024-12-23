import pandas as pd

# Loading the large Zillow CSV file
file_path = "Metro_zhvi_uc_sfrcondo_tier_0.33_0.67_sm_sa_month.csv"
df = pd.read_csv(file_path)

# List of U.S. states
states_list = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
      "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
]

# Filter the data for state-level information
states_df = df[df['StateName'].isin(states_list)]


# Get the latest month column
latest_month = df.columns[-1]  # Assuming the last column is the latest month

# Select only the 'RegionName' (State) and the latest home value
latest_values = states_df[['StateName', latest_month]]


# Rename columns for clarity
latest_values.columns = ['State', 'HomeValue']

# Preview the filtered data
#print(latest_values.head())


# Export the filtered data to a CSV file for Tableau
latest_values.to_csv("filtered_home_values.csv", index=False)


#-------------correct repetitions in filtered states file by finding averages of home values for repeated states

# Load the CSV file with repeated states
file_path2 = "filtered_home_values.csv"
fl = pd.read_csv(file_path2)

# Inspect the data to check for repetitions
# print(fl.head())

# Group by 'State' and calculate the average 'HomeValue' for repeated states
grouped_fl = fl.groupby('State', as_index=False).mean()

# now i can overwrite the same file to correct it or just make new one

# grouped_fl.to_csv(file_path2, index=False)  --> overwrite method

grouped_fl.to_csv("cleaned_home_values.csv", index=False) # new file

