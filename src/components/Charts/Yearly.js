import React from "react";
import ReactApexChart from "react-apexcharts";
import { API_URL, APP_ID, MASTER_KEY } from "../../config";

function getMonthlyStats() {
  let monthlyStats = {};
  let token = localStorage.getItem("token");
  fetch("https://" + API_URL + "/functions/getmonthlystats", {
    method: "POST",
    headers: new Headers({
      "X-Parse-Application-Id": APP_ID,
      "X-Parse-REST-API-Key": MASTER_KEY,
      "Content-Type": "application/json",
      "X-Parse-Session-Token": token,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      monthlyStats.revenue = data.result.Revenue.data;
      monthlyStats.netProfit = data.result.NetProfit.data;
    })
    .catch((err) => console.log(err));
  return monthlyStats;
}

class YearlyChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        colors: ["#48baa0", "#375e57"],

        chart: {
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "flat",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          labels: {
            style: {
              colors: "#fff",
            },
          },
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
        },
        legend: {
          labels: {
            colors: ["#fff"],
          },
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return val + "€";
            },
            style: {
              color: "#fff",
            },
          },
          axisBorder: {
            show: true,
            color: "#fff",
          },
        },
        fill: {
          opacity: 1,
        },
        grid: {
          yaxis: {
            lines: {
              show: false,
            },
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + "€";
            },
          },
        },
      },
      series: [
        {
          name: "Net Profit",
          data: getMonthlyStats().netProfit,
        },
        {
          name: "Revenue",
          data: getMonthlyStats().revenue,
        },
      ],
    };
  }

  render() {
    return (
      <div className="chart">
        <h3 className="chartheading">My Yearly Trend</h3>
        <div className="insidechart">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="bar"
          />
        </div>
      </div>
    );
  }
}
export default YearlyChart;
