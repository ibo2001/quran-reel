import React,{useRef} from 'react';
import {useVideoRenderer} from '../../hooks/useVideoRenderer';

const VideoPreview = ({audioUrl,data}) => {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  const {isPlaying,togglePlay,currentTime} = useVideoRenderer(canvasRef,audioRef,data);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative border-4 border-gray-800 rounded-lg overflow-hidden shadow-2xl">
        {/* 9:16 Aspect Ratio Container - 360x640 */}
        <canvas
          ref={canvasRef}
          width={360}
          height={640}
          className="bg-black"
        />

        {/* Overlay Controls (optional) */}
        {!isPlaying && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer"
            onClick={togglePlay}
          >
            <svg className="w-16 h-16 text-white opacity-80 hover:opacity-100 transition" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>

      {/* Audio Element (Hidden) */}
      <audio
        ref={audioRef}
        src={audioUrl}
        className="hidden"
        controls
      />

      {/* Controls */}
      <div className="w-full max-w-sm flex justify-between items-center text-sm px-4">
        <button
          onClick={togglePlay}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-full font-bold text-white transition"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <div className="text-gray-400 font-mono">
          {currentTime.toFixed(1)}s
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
