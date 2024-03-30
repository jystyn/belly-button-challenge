//1. Use the D3 library to read in samples.json from the URL 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json'.
const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';
const dataPromise = d3.json(url);
dataPromise.then((data => console.log(`object, are you sure the data came through? ${data}`)));

function init() {
    // #selDataset is id for dropdown button
    // This to practice on a random id from the data set
    d3.selectAll('#selDataset').on('change', optionChanged)
    getData();
    
}
// 2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.

function getData() {
    let dropdownMenu = d3.select('#selDataset');
    
    dataPromise.then((data)=> {
        let names = data.names;
        console.log(`Please object, you said that last time... ${names}`)
        names.forEach(name => { dropdownMenu.append('option')
                                            .text(name)
                                            .property('value', name);
            
        });

        let name = names[0];
        
        
        barChart(name);
        bubbleChart(name);
        displayData(name);
    });
}

function barChart(id) {
    dataPromise.then((data)=> {
        // Filter for the desired id and get the index.
        let samples = data.samples.filter(result => result.id == id)[0];

        // Use sample_values as the values(x) for the bar chart.
        let sample_values = samples.sample_values.slice(0,10).reverse();

        // Use otu_ids as the labels(y) for the bar chart.
        let otu_ids = samples.otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();

        // Use otu_labels as the hovertext(text) for the chart.
        let otu_labels = samples.otu_labels.slice(0,10).reverse();

        console.log(otu_ids, otu_labels, sample_values);

        let trace = [{
            x: sample_values,
            y: otu_ids,
            text: otu_labels,
            type: 'bar',
            orientation: 'h'
        }];

        let layout = {
            title: `Top 10 OTUs for ID No. ${id}`
        };
        
        Plotly.newPlot('bar', trace, layout);
    });
}
// 3. Create a bubble chart that displays each sample.
function bubbleChart(id) {
    dataPromise.then((data)=> {
        // Filter for the desired id and get the index.
        let samples = data.samples.filter(result => result.id == id)[0];

        // Use otu_ids for the x values.
        // Use sample_values for the y values.
        // Use sample_values for the marker size.
        // Use otu_ids for the marker colors.
        // Use otu_labels for the text values.
        let trace = [{
            x: samples.otu_ids,
            y: samples.sample_values,
            text: samples.otu_labels,
            mode: 'markers',
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            }
        }];

        let layout = {
            xaxis: {title: 'OTU ID'}
        };

        Plotly.newPlot('bubble', trace, layout);
    });

}

// 4. Display the sample metadata, i.e., an individual's demographic information.
// 5. Display each key-value pair from the metadata JSON object somewhere on the page.
function displayData(id) {
    let displaySample = d3.select('#sample-metadata');

    dataPromise.then((data)=> {
        let metaData = data.metadata.filter(result => result.id == id)[0];
        let entries = Object.entries(metaData);

        entries.forEach(([key, value]) => {
            displaySample.append('h6').text(`${key}: ${value}`);
        });
    });
}






// Bonus: 
// Adapt the Gauge Chart from 'https://plot.ly/javascript/gauge-charts/Links' to an external site. to plot the weekly washing frequency of the individual.
// You will need to modify the example gauge code to account for values ranging from 0 through 9.
// Update the chart whenever a new sample is selected.



// 6. Update all the plots when a new sample is selected. Additionally, you are welcome to create any layout that you would like for your dashboard.
function optionChanged(selected) {
    barChart(selected);
    bubbleChart(selected);
    displayData(selected);
}

// 7. Deploy your app to a free static page hosting service, such as GitHub Pages. Submit the links to your deployment and your GitHub repo. Ensure that your repository has regular commits and a thorough README.md file
init();