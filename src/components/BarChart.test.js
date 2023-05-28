import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BarChart from './BarChart';

jest.mock('react-chartjs-2', () => ({
  Bar: () => null, // Add display name for easier debugging
}));

const mockChartData = {
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
    render(<BarChart chartData={mockChartData} />);
    expect(screen.getByTestId('mock-Bar')).toBeInTheDocument();
  });

  it('passes correct data to Bar component', () => {
    const { Bar } = require('react-chartjs-2');
    render(<BarChart chartData={mockChartData} />);
    expect(Bar).toHaveBeenCalledWith({ data: mockChartData }, {});
  });

  it('renders alternative UI when data is empty', () => {
    render(<BarChart chartData={{ labels: [], datasets: [] }} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders alternative UI when data is null', () => {
    render(<BarChart chartData={null} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  // New test cases for improved coverage

  it('renders the correct number of bars', () => {
    render(<BarChart chartData={mockChartData} />);
    const bars = screen.getAllByTestId('mock-bar');
    expect(bars.length).toBe(mockChartData.labels.length);
  });

  it('renders the labels correctly', () => {
    render(<BarChart chartData={mockChartData} />);
    const labels = screen.getAllByTestId('mock-label');
    expect(labels.length).toBe(mockChartData.labels.length);

    for (let i = 0; i < labels.length; i++) {
      expect(labels[i]).toHaveTextContent(mockChartData.labels[i]);
    }
  });

  it('renders alternative UI when no chart data is provided', () => {
    render(<BarChart />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders alternative UI when chart data has no datasets', () => {
    const chartData = { labels: mockChartData.labels, datasets: [] };
    render(<BarChart chartData={chartData} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});
