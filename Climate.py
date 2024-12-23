import pandas as pd

file_path = "ClimateData.csv"
df = pd.read_csv(file_path)

states_list = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
      "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
]

label_mapping = {
    'Not Applicable' : 0,
    'No Expected Annual Losses': 0,
    'Very Low': 1,
    'Relatively Low': 2,
    'Relatively Moderate': 3,
    'Relatively High': 4,
    'Very High': 5
}



myDf = df[df['STATEABBRV'].isin(states_list)]

climate_df = myDf['STATEABBRV']

#print(climate_df)

columns_to_add = [col for col in myDf.columns if 'EALR' in col]

#print(columns_to_add)

latest_values = myDf[['STATEABBRV', columns_to_add[0], columns_to_add[1], columns_to_add[2], columns_to_add[3], columns_to_add[4], 
                      columns_to_add[5], columns_to_add[6], columns_to_add[7], columns_to_add[8], columns_to_add[9], columns_to_add[10], 
                      columns_to_add[11], columns_to_add[12], columns_to_add[13], columns_to_add[14], columns_to_add[15], columns_to_add[16], columns_to_add[17]]]


ealr_columns = [col for col in latest_values.columns if 'EALR' in col]
print(ealr_columns)

for col in ealr_columns:
    #print(latest_values[col])
    latest_values[col] = latest_values[col].map(label_mapping)
    #print(latest_values[col])


print(latest_values)

latest_values.columns = ['State', 'Avalance EALR', 'Coastal Flooding EALR', 'Cold Wave EALR', 'Drought EALR', 'Earthquake EALR', 'Hail EALR', 'Heatwave EALR', 'Hurricane EALR', 'Ice Storm EALR', 'Landslide EALR', 'Lightning EALR', 'River Floods EALR', 'Strong Wind EALR', 'Tornado EALR', 'Tsunami EALR', 'Volcanic EALR', 'Wildfire EALR', 'Winter Weather EALR']

latest_values.to_csv('states_vs_EALR.csv', index=False)


