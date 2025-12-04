'use client';

import { DogoSection } from '@/components/shared/dogo-ui';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type DashboardData = any;

export function DashboardCharts({ data }: { data?: DashboardData | null }) {
  const services = data?.today_reservations_per_service ?? [];

  const labels = services.map((s: any) => s.service?.name ?? 'Servicio');
  const values = services.map((s: any) => s.reservations_count ?? s.reservation_count ?? 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Reservas',
        data: values,
        backgroundColor: labels.map(
          (_: string, i: number) =>
            `rgba(${(i * 50) % 255}, ${(i * 80) % 255}, ${(i * 120) % 255}, 0.5)`,
        ),
        borderColor: labels.map(
          (_: string, i: number) =>
            `rgba(${(i * 50) % 255}, ${(i * 80) % 255}, ${(i * 120) % 255}, 1)`,
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white',
        },
      },
    },
    scales: {
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  return (
    <DogoSection className="col-span-1">
      <h2 className="text-xl font-serif text-[var(--gold)] mb-4">Reservas por servicio</h2>
      <Bar data={chartData} options={options} />
    </DogoSection>
  );
}
