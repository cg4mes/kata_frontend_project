interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div>
      <nav className="flex" aria-label="Tabs">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`tab-${tab.id}`}
              key={tab.id}
              onClick={() => onChange(tab.id)}
              style={
                isActive
                  ? { backgroundColor: '#3b82f6', color: 'white' }
                  : { backgroundColor: '#f3f4f6', color: '#374151' }
              }
              className="flex-1 whitespace-nowrap py-3 px-4 font-medium text-sm transition-colors hover:opacity-90"
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  style={
                    isActive
                      ? { backgroundColor: '#2563eb', color: 'white' }
                      : { backgroundColor: '#e5e7eb', color: '#374151' }
                  }
                  className="ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium"
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
