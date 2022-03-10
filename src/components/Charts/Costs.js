import React from 'react';
//import ReactApexChart from 'react-apexcharts';
import PieChart from 'react-minimal-pie-chart';

class CostsChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        labels: ['Parking', 'Service', 'Insurance', 'Energy'],
        colors: ['#3fb997', '#33797b', '#255557', '#762f83'],

        plotOptions: {
          pie: { height: '350px' }
        },
        legend: {
          show: false
        }
      },
      series: [40, 25, 20, 15]
    };
  }

  render() {
    return (
      <div className='chart'>
        <h3 className='chartheading'>Cost Breakdown</h3>
        <div className='insidechart'>
          <PieChart
            animate={false}
            animationDuration={500}
            animationEasing='ease-out'
            cx={50}
            cy={50}
            data={[
              {
                color: '#3fb997',
                title: 'Parking',
                value: 40
              },
              {
                color: '#33797b',
                title: 'Service',
                value: 25
              },
              {
                color: '#255557',
                title: 'Insurance',
                value: 20
              },
              {
                color: '#762f83',
                title: 'Energy',
                value: 15
              }
            ]}
            label={({ data, dataIndex }) => {
              return (
                data[dataIndex].title +
                ' ' +
                Math.round(data[dataIndex].percentage) +
                '%'
              );
            }}
            labelPosition={112}
            labelStyle={{
              fontFamily: 'sans-serif',
              fontSize: '5px'
            }}
            lengthAngle={360}
            lineWidth={100}
            onClick={undefined}
            onMouseOut={undefined}
            onMouseOver={undefined}
            paddingAngle={0}
            radius={32}
            rounded={false}
            startAngle={0}
            viewBoxSize={[100, 100]}
            style={{
              height: '405px'
            }}
          />
          {/* <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type='pie'
          /> */}
        </div>
      </div>
    );
  }
}

export default CostsChart;
