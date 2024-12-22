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

document.getElementById('filter-button').addEventListener('click', () => {
    const income = parseFloat(document.getElementById('income').value.replace(/[$,]/g, ''));
    const risk = document.getElementById('risk').value;

    if (isNaN(income)) {
        alert("Please enter a valid income.");
        return;
    }

    fetch('Final3.csv')
        .then(response => response.text())
        .then(csv => {
            const stateData = [];

            Papa.parse(csv, {
                header: true, // Ensure the first row is treated as headers
                skipEmptyLines: true, // Ignore empty lines in the CSV
                complete: function (results) {
                    console.log("Raw Parsed Data:", results.data); // Log raw data

                    const stateData = results.data.map(row => ({
                        state: row.State,
                        homePrice: parseFloat(row.HomeValue),
                        risk: parseFloat(row['Disaster Rate']),

                        //disaster breakdown data
                        drought: parseFloat(row.drought),
                        flooding: parseFloat(row.flooding),
                        freeze: parseFloat(row.freeze),
                        severeStorm: parseFloat(row['severe storm']),
                        tropCyclone: parseFloat(row['tropical cyclone']),
                        wildfire: parseFloat(row.wildfire),
                        winterStorm: parseFloat(row['winter storm']),

                    }));

                    console.log("Processed Data:", stateData); // Log processed data

                    const riskMapping = {
                        "low": [0, 25],
                        "moderate": [26, 50],
                        "high": [51, 75]
                    };

                    const riskRange = riskMapping[risk.toLowerCase()];
                    if (!riskRange) {
                        console.error("Invalid risk level selected:", risk);
                        return;
                    }

                    const recommendations = stateData.filter(item => {
                        const isAffordable = (item.homePrice * 0.8) / (30 * 12) <= income * 0.28 / 12;
                        const isRiskMatch = item.risk >= riskRange[0] && item.risk <= riskRange[1];

                        console.log(`State: ${item.state}, HomePrice: ${item.homePrice}, Risk: ${item.risk}`);
                        console.log(`Affordable: ${isAffordable}, RiskMatch: ${isRiskMatch}`);

                        return isAffordable && isRiskMatch;
                    });

                    console.log("Filtered Recommendations:", recommendations);

                    const recommendationsDiv = document.getElementById('recommendations');
                    if (recommendations.length > 0) {
                        recommendationsDiv.innerHTML = recommendations
                            .map(rec => `<p><strong>${rec.state}</strong>: Home Value $${rec.homePrice.toLocaleString()}, Risk: ${rec.risk}</p>`)
                            .join('');
                    } else {
                        recommendationsDiv.innerHTML = '<p>No recommendations found. Try adjusting your input.</p>';
                    }

                    //making the charts!!

                    const disasterContainer = document.getElementById('disaster-charts');
                    disasterContainer.innerHTML = ''; // Clear previous charts

                    recommendations.forEach((state, index) => {
                        // Add state name as a heading

                        const stateTitle = document.createElement('h3');
                        stateTitle.textContent = state.state;
                        disasterContainer.appendChild(stateTitle);

                        // Add a canvas element for the pie chart
                        const canvas = document.createElement('canvas');
                        canvas.id = `disaster-chart-${index}`;
                        disasterContainer.appendChild(canvas);

                        // Prepare data for the pie chart
                        const data = {
                            labels: ['drought', 'flooding', 'freeze', 'severe storm', 'tropical cyclone', 'wildfire', 'winter storm'],
                            datasets: [{
                                data: [state.drought, state.flooding, state.freeze, state.severeStorm, state.tropCyclone, state.wildfire, state.winterStorm],
                                backgroundColor: ['#0074D9', '#FF4136', '#2ECC40', '#FF851B', '#7FDBFF', '#B10DC9', '#FFDC00'], //FIXME Need different colors
                                hoverOffset: 7
                            }]
                        };

                        console.log("Recommendations for Charts:", data);


                        // Render the chart
                        new Chart(canvas, {
                            type: 'pie',
                            data: data,
                            options: {
                                responsive: true,
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            label: function (context) {
                                                const label = context.label || '';
                                                const value = context.raw || 0;
                                                return `${label}: ${value}%`;
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    });

                    //end of charts

                }
            });
        });


        
});