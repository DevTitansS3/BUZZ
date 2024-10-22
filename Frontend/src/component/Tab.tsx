import React from 'react';

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  posts: any[];
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab,posts }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4 mt-6">
      <div className="flex justify-between border-b border-orange-200">
        <button
          className={`px-4 py-2 text-lg font-semibold ${
            activeTab === 'hot' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-orange-500'
          }`}
          onClick={() => setActiveTab('hot')}
        >
          🔥 Hot ({posts.length})
        </button>
        <button
          className={`px-4 py-2 text-lg font-semibold ${
            activeTab === 'new' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-orange-500'
          }`}
          onClick={() => setActiveTab('new')}
        >
          ✨ New ({posts.length}) 
        </button>
        <button
          className={`px-4 py-2 text-lg font-semibold ${
            activeTab === 'top' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-orange-500'
          }`}
          onClick={() => setActiveTab('theme')}
        >
          💡 Theme
        </button>
      </div>
    </div>
  );
}

export default Tabs;

