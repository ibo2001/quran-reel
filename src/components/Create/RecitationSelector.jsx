import React from 'react';
import {useLanguage} from '../../context/LanguageContext';

const RecitationSelector = ({recitations,selectedRecitation,onSelect}) => {
  const {t} = useLanguage();

  if (!recitations || recitations.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-300">{t('selectRecitation') || 'Select Recitation Style'}</h3>
      <div className="grid grid-cols-2 gap-2">
        {recitations.map((recitation) => (
          <button
            key={recitation.id}
            onClick={() => onSelect(recitation)}
            className={`p-2 text-xs rounded border transition ${selectedRecitation?.id === recitation.id ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'}`}
          >
            {recitation.style || 'Default'}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecitationSelector;
