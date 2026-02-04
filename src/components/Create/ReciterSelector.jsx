import React from 'react';

const ReciterSelector = ({reciters,selectedReciter,onSelect}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">Select Reciter</label>
      <select
        className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
        onChange={(e) => {
          const reciter = reciters.find(r => r.id === parseInt(e.target.value));
          onSelect(reciter);
        }}
        value={selectedReciter?.id || ''}
      >
        <option value="">Choose a Reciter</option>
        {reciters.map(reciter => (
          <option key={reciter.id} value={reciter.id}>
            {reciter.name} ({reciter.recitations_count} Recitations)
          </option>
        ))}
      </select>
    </div>
  );
};

export default ReciterSelector;
