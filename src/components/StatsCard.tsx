interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bgColor: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function StatsCard({ icon, label, value, bgColor, isActive = false, onClick }: StatsCardProps) {
  const ringColor = bgColor.replace('bg-', 'ring-');
  
  if (onClick) {
    return (
      <button
        id={`stat-card-${label.toLowerCase().replace(/\s+/g, '-')}`}
        onClick={onClick}
        className={`bg-white rounded-lg shadow p-6 text-left transition-all hover:shadow-lg hover:scale-105 ${isActive ? `ring-2 ${ringColor}` : ''}`}
      >
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${bgColor} rounded-md p-3`}>
            {icon}
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${bgColor} rounded-md p-3`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
