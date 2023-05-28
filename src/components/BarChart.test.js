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

  it('displays the correct number of bars', () => {
    const { Bar } = require('react-chartjs-2');
    render(<BarChart chartData={mockChartData} />);
    expect(Bar).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          datasets: expect.arrayContaining([
            expect.objectContaining({
              data: expect.arrayContaining([12, 19, 3, 5, 2, 3]),
            }),
          ]),
        }),
      }),
      {}
    );
  });

  it('displays the correct labels on the x-axis', () => {
    const { Bar } = require('react-chartjs-2');
    render(<BarChart chartData={mockChartData} />);
    expect(Bar).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          labels: expect.arrayContaining(['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']),
        }),
      }),
      {}
    );
  });
});
