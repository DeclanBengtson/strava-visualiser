'use client'

import { useState, useEffect } from 'react'
import { Bar, Line, Pie } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
)

export default function GraphDashboard() {
    const [chartData, setChartData] = useState({
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: 'Sample Data',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    })

    useEffect(() => {
        // Simulate data fetching
        const fetchData = () => {
            const newData = chartData.datasets[0].data.map(() => Math.floor(Math.random() * 100))
            setChartData(prevState => ({
                ...prevState,
                datasets: [{...prevState.datasets[0], data: newData}]
            }))
        }

        fetchData()
        const interval = setInterval(fetchData, 5000) // Update every 5 seconds

        return () => clearInterval(interval)
    }, [])

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Chart.js Chart',
            },
        },
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Graph Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <Bar data={chartData} options={options} />
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <Line data={chartData} options={options} />
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <Pie data={chartData} options={options} />
                </div>
            </div>
        </div>
    )
}