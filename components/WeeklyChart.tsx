import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const WeeklyDistanceChart = () => {
  // Generate sample data for the last 52 weeks
  const generateWeeklyData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 51; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - (i * 7));
      
      // Generate random distance between 5-15km for demonstration
      const distance = Math.random() * 10 + 5;
      
      data.push({
        week: `Week ${52-i}`,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        distance: Number(distance.toFixed(2))
      });
    }
    
    return data;
  };

  const data = generateWeeklyData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-800 p-2 rounded-lg shadow-lg">
          <p className="text-gray-400">{`${payload[0].payload.date}`}</p>
          <p className="text-white font-bold">{`${payload[0].value.toFixed(2)} km`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gray-900 text-white border-gray-800 hover:border-gray-700 transition-colors mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center space-x-2 text-lg font-medium">
          <TrendingUp className="h-5 w-5 text-orange-500"/>
          <span>Weekly Distance Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date"
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                tickFormatter={(value, index) => index % 4 === 0 ? value : ''}
              />
              <YAxis
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                unit=" km"
              />
              <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
              <Line
                type="monotone"
                dataKey="distance"
                stroke="#F97316"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#F97316' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyDistanceChart;