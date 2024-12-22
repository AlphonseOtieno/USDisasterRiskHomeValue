document.getElementById('income').addEventListener('input', function (event) {
    const input = event.target;
    
    // Remove any formatting (commas) and dollar sign before parsing
    const rawValue = input.value.replace(/[$,]/g, '');
    
    // Check if the input is a valid number
    if (!isNaN(rawValue) && rawValue !== '') {
      const number = parseFloat(rawValue);
  
      // Format the number with commas for display
      input.value = number.toLocaleString('en-US');
    } else {
      // If invalid, clear the field
      input.value = '';
    }
  });
  
  document.getElementById('income').addEventListener('blur', function (event) {
    const input = event.target;
  
    // Store the raw value for calculations (e.g., remove commas)
    const rawValue = input.value.replace(/[$,]/g, '');
  
    // Store or use the raw value as needed
    console.log('Stored Value:', rawValue); // Example: Use this for calculations
  });
  

  // Add event listener for the "Get Recommendations" button
document.getElementById('filter-button').addEventListener('click', () => {
    // Get the value from the income input
    const income = parseFloat(document.getElementById('income').value.replace(/[$,]/g, ''));

    // Get the selected value from the dropdown
    const risk = document.getElementById('risk').value;

    // Log the selected values (for testing)
    console.log(`Income: ${income}`);
    console.log(`Selected Risk: ${risk}`);

    // Example logic to filter and generate recommendations!!!
    
    //CSV  format:
    // state,homeValue,riskRate --parsing using JS's fetch API, PapaParse library

    fetch('Final2.csv')
    .then(response => response.text())
    .then(csv => {
    const stateData = []; // Object to hold data

    // Parse CSV
    Papa.parse(csv, {
        header: true, // Use the first row as column names
        skipEmptyLines: true,
        complete: function(results) {
        results.data.forEach(row => {
            // Populate the data structure
            stateData.push( {
            state:row.state,
            homePrice: parseFloat(row.homePrice), // Convert to number
            risk: parseFloat(row.risk) //convert to number (risk is a float ranging from 0-100)
            });
        });

        console.log(stateData); // Check the data structure
        }
    });
    });

    const riskMapping = { //risk matching logic
        "Low": [0, 25],
        "Moderate": [26, 50],
        "High": [51, 75],
        "Very High": [76, 100]
    };
    
    const riskRange = riskMapping[risk.toLowerCase()];
      const recommendations = stateData.filter(item => {
      const affordable = isAffordable(item.homeValue, income); // affordability logic based on HAI concept and 28/36 rule
      const isRiskMatch = item.risk >= riskRange[0] && item.risk <= riskRange[1];
      return affordable && isRiskMatch;
    });

    const isAffordable = (homeValue, annualIncome) => {
        const monthlyIncome = annualIncome / 12;
        const loanAmount = homeValue * 0.8; // Assuming 20% down payment, and no interest rate for simplicity's sake
        const loanTermMonths = 30 * 12; // 30-year term
        
        const monthlyPayment = loanAmount / loanTermMonths;
        
        const canAfford = 0.28 * monthlyIncome >= monthlyPayment;
        
        return canAfford;
      };

    // Display recommendations dynamically
    const recommendationsDiv = document.getElementById('recommendations');
    if (recommendations.length > 0) {
        recommendationsDiv.innerHTML = recommendations
            .map(
                rec =>
                    `<p><strong>${rec.state}</strong>: Home Value $${rec.homeValue.toLocaleString()}, Risk: ${rec.risk}</p>`
            )
            .join('');
    } else {
        recommendationsDiv.innerHTML = '<p>No recommendations found. Try adjusting your input.</p>';
    }
});
