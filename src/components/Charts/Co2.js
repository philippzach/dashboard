import React from 'react';
import ReactApexChart from 'react-apexcharts';

class Co2Chart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        colors: ['#48baa0'],
        chart: {
          toolbar: {
            show: false
          }
        },
        grid: {
          yaxis: {
            lines: {
              show: false
            }
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          labels: {
            style: {
              colors: '#fff'
            }
          },
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
          ]
        },
        yaxis: {
          labels: {
            formatter: function(val) {
              return val + 'kg';
            },
            style: {
              color: '#fff'
            }
          },
          axisBorder: {
            show: true,
            color: '#fff'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return val + 'kg';
            }
          }
        }
      },
      series: [
        {
          name: 'CO2 Saved',
          data: [
            100,
            200,
            300,
            325,
            355,
            557,
            756,
            1061,
            1458,
            1563,
            1860,
            1966
          ]
        }
      ]
    };
  }

  render() {
    return (
      <div className='chart'>
        <h3 className='chartheading'>
          Saved CO<sub>2</sub>
        </h3>
        <div className='insidechart'>
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type='bar'
          />
        </div>
      </div>
    );
  }
}
export default Co2Chart;
