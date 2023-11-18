// Welcome!
console.log("You are in Jiahui's Module 14 Project!");

// Use the D3 library to read in samples.json from the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);

// Fetch the JSON data and console log it
function initialize(){
    
    var selector = d3.select("#selDataset");

    d3.json(url).then(function(data) {

        let namedata = data.names;

        // Append the selector with the corresponding IDs
        namedata.forEach(function(sample) {
            selector.append("option")
            .text(sample)
            .property("value", sample)
        });

        let final_data = namedata[0];

        console.log("The starting sample name is", final_data);

        console.log(data);

        // Call functions 
        metadata_finder(final_data);
        bar_chart_builder(final_data);
        bubble_chart_builder(final_data);
    });
}


// Find the key-value pair from the metadata
function metadata_finder(sample){
    d3.json(url).then(function(data) {

        let metdata = data.metadata;

        // Find the data whose ID equals to sample
        let filterdata = metdata.filter(filter_data => filter_data.id == sample);
        let finaldata = filterdata[0];
        
        // Select the id equals to sample-metadata of an HTML element
        d3.select("#sample-metadata").html("");

        // Return an array of a given object's own enumerable string-keyed property key-value pairs
        Object.entries(finaldata).forEach(function([key,value]){
            // Append each key-value
            d3.select("#sample-metadata").append("p").text(`${key}:${value}`);
        });
    });
}


// Create a horizontal bar chart
function bar_chart_builder(sample){

    d3.json(url).then(function(data) {

        let sampledata = data.samples;

        // Find the data whose ID equals to sample
        let filterdata = sampledata.filter(filter_data => filter_data.id == sample);
        let finaldata = filterdata[0];
        
        // Find the sample_values, otu_ids, otu_labels
        let sample_values = finaldata.sample_values;
        let otu_ids = finaldata.otu_ids;
        let otu_labels = finaldata.otu_labels;
    
        // Set up the Y ticks
        let yticks = otu_ids.slice(0,10).map(function(id){
            return `OTU ${id}`
        });

        // Set up the values in the X axis
        let xvalues = sample_values.slice(0,10).reverse();

        // Set up the labels
        let labels = otu_labels.slice(0,10).reverse();

        // Set up the bar chart
        let bar_chart={
            y:yticks.reverse(),
            x:xvalues,
            text:labels,
            type:"bar",
            orientation:"h"
        };

        let bar_layout={
            margin: {t: 30, l: 150}
        };

        // Plot the data
        Plotly.newPlot("bar", [bar_chart], bar_layout);

    });
}


// Create a bubble chart
function bubble_chart_builder(sample){

    d3.json("data/samples.json").then(function(data) {

        let sampledata = data.samples;

        // Find the data whose ID equals to sample
        let filterdata = sampledata.filter(filter_data => filter_data.id == sample);
        let finaldata = filterdata[0];
        
        // Find the sample_values, otu_ids, otu_labels
        let sample_values = finaldata.sample_values;
        let otu_ids = finaldata.otu_ids;
        let otu_labels = finaldata.otu_labels;
        
        // Set up the bubble chart
        let bubble_chart={
            y:sample_values,
            x:otu_ids,
            text:otu_labels,
            mode:"markers",
            marker: {
                size: sample_values,
                color: otu_ids
            }
        };

        let bubble_layout={
            xaxis:{title:"OTU ID"}
        };

        // Plot the data
        Plotly.newPlot("bubble", [bubble_chart], bubble_layout);

    });
}


// Dashboard updating
function optionChanged(newid) {
    console.log(`A new sample is selected (${newid})`);
    bar_chart_builder(newid);
    bubble_chart_builder(newid);
    metadata_finder(newid);
}


// Run all the codes
initialize();




