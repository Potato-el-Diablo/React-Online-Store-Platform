import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BarChart from './BarChart';

jest.mock('react-chartjs-2', () => ({
  Bar: () => null, // Add display name for easier debugging
}));

const chartData = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
    },
  ],
};

describe('BarChart', () => {
  it('renders correctly', () => {
    render(<BarChart chartData={chartData} />);
    expect(screen.getByTestId('mock-Bar')).toBeInTheDocument();
  });

  it('passes correct data to Bar component', () => {
    const { Bar } = require('react-chartjs-2');
    render(<BarChart chartData={chartData} />);
    expect(Bar).toHaveBeenCalledWith({ data: chartData }, {});
  });

  it('renders alternative UI when data is empty', () => {
    render(<BarChart chartData={{ labels: [], datasets: [] }} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders alternative UI when data is null', () => {
    render(<BarChart chartData={null} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders correctly with different chart data', () => {
    const differentChartData = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          label: '# of Votes',
          data: [10, 5, 8],
          backgroundColor: ['rgba(255, 0, 0, 0.2)', 'rgba(0, 255, 0, 0.2)', 'rgba(0, 0, 255, 0.2)'],
        },
      ],
    };
    render(<BarChart chartData={differentChartData} />);
    expect(screen.getByTestId('mock-Bar')).toBeInTheDocument();
  });

  it('handles errors gracefully when invalid chart data is provided', () => {
    const invalidChartData = {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [
        {
          label: '# of Votes',
          // Missing data values, which is invalid
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
        },
      ],
    };
    render(<BarChart chartData={invalidChartData} />);
    // Add assertions for how the component handles the error, such as displaying an error message
    expect(screen.getByText('Invalid chart data')).toBeInTheDocument();
  });

  it('renders correctly at different screen sizes', () => {
    // Set the initial window.innerWidth to a specific value
    global.innerWidth = 800;
    render(<BarChart chartData={chartData} />);
    expect(screen.getByTestId('mock-Bar')).toBeInTheDocument();

    // Resize the window to another size
    global.innerWidth = 1200;
    // Dispatch a resize event to trigger the re-render
    global.dispatchEvent(new Event('resize'));
    render(<BarChart chartData={chartData} />);
    expect(screen.getByTestId('mock-Bar')).toBeInTheDocument();
  });

  // Add more test cases to cover other scenarios or edge cases

});
