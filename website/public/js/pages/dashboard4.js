
$(function () {

  'use strict';

	
	var piedata = [
      { label: "By Email", data: [[1,10]], color: '#8950fc '},
      { label: "By Phone", data: [[1,30]], color: '#1bc5bd'},
      { label: "On Site", data: [[1,90]], color: '#6993ff'},
      { label: "By Agent", data: [[1,70]], color: '#ffa800'}
	 ];
    $.plot('#flotPie2', piedata, {
      series: {
        pie: {
          show: true,
          radius: 1,
          innerRadius: 0.5,
          label: {
            show: true,
            radius: 2/3,
            formatter: labelFormatter,
            threshold: 0.1
          },			
        },	  
      },
      grid: {
        hoverable: true,
        clickable: true
      }
    });

    function labelFormatter(label, series) {
		  return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + label + "<br/>" + Math.round(series.percent) + "%</div>";
	  }
	
	
	      var options = {
            chart: {
                height: 285,
                type: 'bar',foreColor: "#525e75",
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%'	
                },
            },
            dataLabels: {
                enabled: false
            },
			colors: ["#6993ff", '#8950fc'],
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            series: [{
                name: 'Inquery',
                data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
            }, {
                name: 'Conform',
                data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
            }],
            xaxis: {
                categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            },
            fill: {
                opacity: 1

            },
			  legend: {
				position: 'top',
				horizontalAlign: 'left'
			  },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return "$ " + val + " thousands"
                    }
                }
            }
        }

        var chart = new ApexCharts(
            document.querySelector("#bookingstatus"),
            options
        );

        chart.render();
	
	
	
	
	    var options = {
		  chart: {
			  foreColor: "#525e75",
			height: 285,
			type: 'line',
			zoom: {
			  enabled: false
			}
		  },
		  dataLabels: {
			enabled: false
		  },
	      colors: ["#6993ff"],
		  stroke: {
			curve: 'straight'
		  },
		  series: [{
			name: "Revenue",
			data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
		  }],
		  grid: {
			row: {
			  colors: ['#525e75', 'transparent'], // takes an array which will be repeated on columns
			  opacity: 0.5
			},
		  },
		  xaxis: {
			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
		  }
		}

		var chart = new ApexCharts(
		  document.querySelector("#revenue2"),
		  options
		);

		chart.render();
	
	
	
	$('#vmap').vectorMap({
		map: 'us_aea_en',
		showTooltip: true,
		backgroundColor: '#525e75',
		color: '#d1e6fa',
		regionStyle : {
			initial : {
				fill : '#1bc5bd'
			}
		},
		selectedColor: '#00cccc',
		enableZoom: false,
		borderWidth: 1,
		borderColor: '#525e75',
		hoverOpacity: .85
	  });
	
	
	var customerData = {
		labels: ['2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'],
		datasets: [{
			label: 'Revenue',
			data: [30, 55, 60, 50, 35, 45, 25, 60, 50, 40, 60, 55, 30, 55, 60, 50, 35, 45, 25],
			backgroundColor: [
				'#5A8DEE', '#5A8DEE', '#5A8DEE', '#5A8DEE', '#5A8DEE', '#e9e9e9', '#e9e9e9', '#5A8DEE', '#5A8DEE', '#5A8DEE', '#5A8DEE', '#5A8DEE','#e9e9e9', '#e9e9e9', '#5A8DEE', '#5A8DEE', '#5A8DEE', '#5A8DEE', '#5A8DEE',
			],
			borderColor: [
				'#5A8DEE', '#5A8DEE', '#5A8DEE', '#5A8DEE', '#5A8DEE', '#e9e9e9', '#e9e9e9', '#5A8DEE', '#5A8DEE', '#5A8DEE', '#5A8DEE', '#5A8DEE','#e9e9e9', '#e9e9e9', '#5A8DEE', '#5A8DEE', '#5A8DEE', '#5A8DEE', '#5A8DEE',
			],
			borderWidth: 1,
			fill: false
		}
		]
	};
	var customerOptions = {
		scales: {
			xAxes: [{
			barPercentage: 0.8,
			position: 'bottom',
			display: true,
			gridLines: {
				display: false,
				drawBorder: false,
			},
			ticks: {
				display: false, //this will remove only the label
				stepSize: 300,
			}
			}],
			yAxes: [{
				display: false,
				gridLines: {
					drawBorder: false,
					display: true,
					color: "#f0f3f6",
					borderDash: [8, 4],
				},
				ticks: {
					display: false,
					beginAtZero: true,
				},
			}]
		},
		legend: {
			display: false
		},
		tooltips: {
			enabled: true,
			backgroundColor: 'rgba(0, 0, 0, 1)',
		},
		plugins: {
			datalabels: {
				display: false,
				align: 'center',
				anchor: 'center'
			}
		}				
	};
	if ($("#customer").length) {
		var barChartCanvas = $("#customer").get(0).getContext("2d");
		// This will get the first returned node in the jQuery collection.
		if(screen.width>767) {
			var chartHeight = document.getElementById("customer");
			chartHeight.height = 60;
		}
		var barChart = new Chart(barChartCanvas, {
			type: 'bar',
			data: customerData,
			options: customerOptions
		});
	}
	

	
}); // End of use strict






