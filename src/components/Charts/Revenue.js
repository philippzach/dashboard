import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { API_URL, APP_ID, MASTER_KEY } from '../../config';

const Month = new Date().getMonth();
const Year = new Date().getFullYear();
function getDaysInMonth(month, year) {
  var date = new Date(year, month, 1);
  var days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}
const DaysInMonth = getDaysInMonth(Month, Year).length;
const ArrayDays = () => {
  for (var i = 0; i < DaysInMonth; i++) {
    return i + 1;
  }
};

// const Profit = new Array(31);
// Profit.fill(180, 22);

function getDailyStats() {
  let dailyStats = {};
  let token = localStorage.getItem('token');
  fetch('https://' + API_URL + '/functions/getdailystats', {
    method: 'POST',
    headers: new Headers({
      'X-Parse-Application-Id': APP_ID,
      'X-Parse-REST-API-Key': MASTER_KEY,
      'Content-Type': 'application/json',
      'X-Parse-Session-Token': token,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      dailyStats.revenue = data.result.Revenue.data;
      dailyStats.netProfit = data.result.NetProfit.data;
      console.log(data.result.Revenue.data);
      console.log(data.result.NetProfit.data);
    })
    .catch((err) => console.log(err));
  return dailyStats;
}

class RevenueChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        colors: ['#592b65', '#48baa0'],
        annotations: {
          yaxis: [
            {
              y: 500,
              y2: 0,
              borderColor: '#48baa0',
              strokeDashArray: 2,
              fillColor: '#592b65',
              opacity: 0.3,
              label: {
                borderColor: '#592b65',
                position: 'left',
                offsetX: 60,
                style: {
                  color: '#fff',
                  background: '#592b65',
                },
                text: 'COST CAP',
              },
            },
          ],
        },
        chart: {
          stacked: true,
          toolbar: {
            show: false,
          },
        },
        legend: {
          labels: {
            colors: ['#fff'],
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return val + '€';
            },
            style: {
              color: '#fff',
            },
          },
          axisBorder: {
            show: true,
            color: '#fff',
          },
        },
        xaxis: {
          labels: {
            style: {
              colors: '#fff',
            },
          },
          categories: ArrayDays(),
        },
        grid: {
          yaxis: {
            lines: {
              show: false,
            },
          },
        },
        tooltip: {
          enabled: true,
          followCursor: true,
          x: {
            show: false,
          },
        },
      },
      series: [
        {
          name: 'REVENUE',
          // data: [
          //   31,
          //   40,
          //   28,
          //   51,
          //   42,
          //   109,
          //   100,
          //   120,
          //   130,
          //   140,
          //   160,
          //   170,
          //   180,
          //   210,
          //   220,
          //   240,
          //   250,
          //   260,
          //   290,
          //   300,
          //   305,
          //   500,
          //   500,
          //   500,
          //   500,
          //   500,
          //   500,
          //   500,
          //   500,
          //   500,
          //   500,
          // ],
          data: getDailyStats().revenue,
        },
        {
          name: 'PROFIT',
          data: getDailyStats().netProfit,
        },
      ],
    };
  }

  render() {
    return (
      <div className='chart'>
        <h3 className='chartheading'>My Monthly Revenue</h3>
        <div className='insidechart'>
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type='area'
          />
        </div>
      </div>
    );
  }
}

export default RevenueChart;
