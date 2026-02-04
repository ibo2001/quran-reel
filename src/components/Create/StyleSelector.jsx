import React from 'react';
import {COLORS,ANIMATIONS} from '../../constants';
import {useLanguage} from '../../context/LanguageContext';

const StyleSelector = ({
  selectedColor,onColorChange,
  selectedAnimation,onAnimationChange
}) => {
  const {t} = useLanguage();

  return (
    <div className="space-y-4 border-t border-gray-700 pt-4">
      <h3 className="text-sm font-semibold text-gray-300">Style & Animation</h3>

      {/* Color Selection */}
      <div className="space-y-1">
        <label className="text-xs text-gray-400">{t('textColor') || 'Text Color'}</label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(color => (
            <button
              key={color.id}
              onClick={() => onColorChange(color)}
              title={color.name}
              className={`w-8 h-8 rounded-full border-2 ${selectedColor.id === color.id ? 'border-white ring-2 ring-emerald-500' : 'border-gray-600'}`}
              style={{backgroundColor: color.value}}
            />
          ))}
        </div>
      </div>

      {/* Animation Selection */}
      <div className="space-y-1">
        <label className="text-xs text-gray-400">{t('animation') || 'Entry Animation'}</label>
        <select
          value={selectedAnimation?.id || 'none'}
          onChange={(e) => onAnimationChange(ANIMATIONS.find(a => a.id === e.target.value))}
          className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white text-sm"
        >
          {ANIMATIONS.map(anim => (
            <option key={anim.id} value={anim.id}>{anim.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default StyleSelector;
