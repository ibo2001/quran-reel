import React,{useState} from 'react';
import {BACKGROUND_PRESETS} from '../../constants';

const BackgroundSelector = ({selectedBackground,onSelect}) => {
  const [customBackgrounds,setCustomBackgrounds] = useState([]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newBg = {
          id: `custom-${Date.now()}`,
          type: file.type.startsWith('video') ? 'video' : 'image',
          name: file.name,
          url: reader.result
        };

        // Add to list and select it
        const updated = [newBg,...customBackgrounds];
        setCustomBackgrounds(updated);
        onSelect(newBg);
      };
      reader.readAsDataURL(file);
    }
  };

  const allBackgrounds = [...customBackgrounds,...BACKGROUND_PRESETS];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-300">Select Background</h3>

      {/* Upload Button */}
      <label
        className="flex items-center justify-center border-2 border-dashed border-gray-600 rounded-md p-3 text-center cursor-pointer hover:border-emerald-500 hover:bg-gray-800 transition text-gray-400 text-xs gap-2"
      >
        <input
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleUpload}
        />
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>Upload Image/Video</span>
      </label>

      <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
        {allBackgrounds.map((bg) => (
          <div
            key={bg.id}
            className={`relative aspect-[9/16] w-full rounded-md overflow-hidden cursor-pointer border-2 transition ${selectedBackground?.id === bg.id ? 'border-emerald-500 ring-2 ring-emerald-500/50' : 'border-transparent hover:border-gray-500'}`}
            onClick={() => onSelect(bg)}
          >
            {bg.type === 'video' ? (
              <video src={bg.url} className="w-full h-full object-cover pointer-events-none" muted />
            ) : (
              <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
            )}

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <p className="text-[10px] text-center truncate text-white opacity-90">{bg.name}</p>
            </div>

            {/* Type Badge */}
            {bg.type === 'video' && (
              <div className="absolute top-1 right-1 bg-black/60 rounded px-1.5 py-0.5">
                <span className="text-[8px] uppercase font-bold text-white tracking-wider">Video</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundSelector;
