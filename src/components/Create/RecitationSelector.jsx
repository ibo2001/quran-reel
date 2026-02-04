import React from 'react';

const RecitationSelector = ({recitations,selectedRecitation,onSelect}) => {
  if (!recitations || recitations.length === 0) return null;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">Select Recitation Style</label>
      <select
        className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
        onChange={(e) => {
          const recitation = recitations.find(r => r.id === parseInt(e.target.value));
          onSelect(recitation);
        }}
        value={selectedRecitation?.id || ''}
      >
        <option value="">Choose Recitation</option>
        {recitations.map(recitation => (
          <option key={recitation.id} value={recitation.id}>
            {recitation.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RecitationSelector;
