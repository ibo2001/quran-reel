import { useEffect, useRef, useState } from 'react';

/**
 * Hook to manage video rendering on HTML5 Canvas
 * @param {HTMLCanvasElement} canvasRef 
 * @param {HTMLAudioElement} audioRef
 * @param {Object} data - { verses, timings, translation, background }
 */
export const useVideoRenderer = (canvasRef, audioRef, data) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [bgImage, setBgImage] = useState(null);
    const [bgVideo, setBgVideo] = useState(null);
    const requestRef = useRef();
    
    // Default styles
    const { 
        verses = [], 
        timings = [], 
        translation = [], 
        background,
        reciter,
        selectedSurah,
        startVerse = 1,
        style = {
            color: { value: '#FFFFFF' },
            animation: { id: 'none' }
        }
    } = data || {};
    
    // Load background (Image or Video)
    useEffect(() => {
        setBgImage(null);
        setBgVideo(null);

        if (background && background.url) {
            if (background.type === 'video') {
                const video = document.createElement('video');
                video.src = background.url;
                video.loop = true;
                video.muted = true;
                video.crossOrigin = "anonymous";
                video.play().catch(e => console.log("Video autoplay failed (harmless for render)", e));
                setBgVideo(video);
            } else {
                const img = new Image();
                img.src = background.url;
                img.crossOrigin = "anonymous";
                img.onload = () => setBgImage(img);
            }
        }
    }, [background]); // Reload if background object changes

    // Draw function
    const draw = (time) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // 1. Draw Background
        const media = bgVideo || bgImage;
        if (media) {
            const mediaWidth = media.videoWidth || media.width;
            const mediaHeight = media.videoHeight || media.height;
            
            // Scale and Crop to Fill (Cover)
            const mediaRatio = mediaWidth / mediaHeight;
            const canvasRatio = width / height;
            let drawWidth, drawHeight, offsetX, offsetY;
            
            if (mediaRatio > canvasRatio) {
                drawHeight = height;
                drawWidth = height * mediaRatio;
                offsetX = -(drawWidth - width) / 2;
                offsetY = 0;
            } else {
                drawWidth = width;
                drawHeight = width / mediaRatio;
                offsetX = 0;
                offsetY = -(drawHeight - height) / 2;
            }
            
            // For video, we just draw the video element itself
            ctx.drawImage(media, offsetX, offsetY, drawWidth, drawHeight);
            
            // Dark Overlay for text readability
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fillRect(0, 0, width, height);
        } else {
            ctx.fillStyle = '#111';
            ctx.fillRect(0, 0, width, height);
        }

        // 2. Find Active Verse Index in Sliced Array
        const currentMs = time * 1000;
        let verseToRender = null;
        let activeTiming = null;

        if (timings && timings.length > 0) {
            activeTiming = timings.find(t => currentMs >= t.start_ms && currentMs <= t.end_ms);
            if (activeTiming) {
                // The logical index in the SLICED 'verses' array
                // If timings[i].ayah is 5, and range starts at 5, index is 0.
                const relativeIndex = activeTiming.ayah - startVerse;
                if (relativeIndex >= 0 && relativeIndex < verses.length) {
                    verseToRender = verses[relativeIndex];
                }
            }
        }

        // 3. Draw Surah Title (Top)
        const themeColor = style.color?.value || '#FFFFFF';

        if (selectedSurah) {
            ctx.direction = 'rtl';
            ctx.textAlign = 'center';
            ctx.fillStyle = themeColor;
            ctx.font = '60px QuranTitles';
            // Some QuranTitles fonts map characters to ornate names, but often Surah ID works.
            // If it's a number-to-name mapping, we use the ID.
            ctx.fillText(String(selectedSurah.id), width / 2, 100);
        }

        // 4. Draw Text
        if (verseToRender && activeTiming) {
            const verse = verseToRender;
            const trans = translation && translation[verses.indexOf(verse)];
            
            // Animation State
            let opacity = 1;
            let yOffset = 0;

            if (style.animation?.id === 'fade') {
                const verseStart = activeTiming.start_ms / 1000;
                const progress = time - verseStart;
                if (progress < 0.5) opacity = progress / 0.5;
            } else if (style.animation?.id === 'slide-up') {
                const verseStart = activeTiming.start_ms / 1000;
                const progress = time - verseStart;
                if (progress < 0.5) {
                    opacity = progress / 0.5;
                    yOffset = 20 * (1 - opacity);
                }
            }

            ctx.globalAlpha = opacity;
            
            // Text Styles
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.direction = 'rtl';
            
            // Arabic Text (Custom Font)
            ctx.font = `bold 45px UthmanicText`;
            ctx.fillStyle = themeColor;
            
            // Wrap Text Logic
            const maxWidth = width * 0.8; 
            
            // Verse Number Rendering (Custom Font)
            const verseNum = verse.verse_key.split(':')[1];
            // We'll draw the number at the start of the line with its specific font
            // Custom font for numbers often handles the ornate style.
            const verseNumberStyled = verseNum; // The numbers font will style it
            
            // To handle multiple fonts in one line, we need to measure and draw separately 
            // OR use a trick. Since wrap is needed, easier to draw number separately at end of last line?
            // User said "at the start line". So for RTL, that's the RIGHT side.
            
            const words = verse.text_qpc_hafs.split(' ');
            let line = '';
            const lines = [];

            for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i] + ' ';
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && i > 0) {
                    lines.push(line);
                    line = words[i] + ' ';
                } else {
                    line = testLine;
                }
            }
            lines.push(line);

            // Draw Lines
            const lineHeight = 80; 
            const totalTextHeight = lines.length * lineHeight;
            let startY = height / 2 - (totalTextHeight / 2) + yOffset;
            
            lines.forEach((l, index) => {
                ctx.font = `bold 45px UthmanicText`;
                ctx.fillText(l.trim(), width / 2, startY + (index * lineHeight));
            });

            // Translation (Fallback font)
            if (trans) {
                ctx.globalAlpha = opacity * 0.8;
                ctx.font = '20px Arial';
                ctx.fillStyle = '#ddd'; 
                ctx.direction = 'ltr'; // Translation is usually LTR
                const transText = trans.text ? trans.text.replace(/<[^>]*>?/gm, '') : '';
                
                const transWords = transText.split(' ');
                let transLine = '';
                let transLines = [];
                for(let w of transWords) {
                    if (ctx.measureText(transLine + w).width > maxWidth) {
                        transLines.push(transLine);
                        transLine = w + ' ';
                    } else {
                        transLine += w + ' ';
                    }
                }
                transLines.push(transLine);
                
                transLines.forEach((tl, idx) => {
                    ctx.fillText(tl.trim(), width / 2, startY + (lines.length * lineHeight) + 30 + (idx * 30));
                });
            }
            
            // Reciter Name Watermark
            if (reciter && reciter.name) {
                ctx.direction = 'rtl';
                ctx.font = '16px Arial';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.textAlign = 'right';
                ctx.fillText(reciter.name, width - 20, height - 20);
            }

            ctx.globalAlpha = 1.0; 
        }
    };

    // Animation Loop
    const animate = () => {
        if (audioRef.current) {
            const time = audioRef.current.currentTime;
            setCurrentTime(time);
            draw(time);
        }
        // Always redraw if video background to update frames
        if (bgVideo && !audioRef.current?.paused) {
             // If audio is playing, draw is called. 
             // If audio NOT playing but video background exists, we might want to loop it?
             // Not critical for 'Preview' linked to audio, but good for UX.
             // For now, draw is driven by audio loop.
        }
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (isPlaying) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(requestRef.current);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isPlaying]);

    // Initial Draw & Redraw when data/bg/style changes
    useEffect(() => {
        draw(currentTime); 
    }, [verses, timings, bgImage, bgVideo, style]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return {
        isPlaying,
        currentTime,
        togglePlay,
        draw // Expose draw for manual updates if needed
    };
};
