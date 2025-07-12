import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatNumber } from "@/utils/formatting";

interface TokenUsageChartProps {
  promptTokens: number;
  responseTokens: number;
  //contextLength: number;
}

const TokenUsageChart: React.FC<TokenUsageChartProps> = ({
  promptTokens,
  responseTokens,
  //contextLength,
}) => {
  const contextLength = 2048; // TODO: make this dynamic
  const usedTokens = promptTokens + responseTokens;
  const remainingTokens = Math.max(0, contextLength - usedTokens); 

  const data = [
    {
      name: "Prompt Tokens",
      value: promptTokens,
      color: "#3B82F6", // Blue
    },
    {
      name: "Response Tokens",
      value: responseTokens,
      color: "#10B981", // Green
    },
    {
      name: "Unused Context",
      value: remainingTokens,
      color: "#E5E7EB", // Light Gray
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {formatNumber(data.value)} tokens
          </p>
          <p className="text-xs text-gray-500">
            {((data.value / contextLength) * 100).toFixed(1)}% of context
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-sm font-medium text-gray-700">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TokenUsageChart; 