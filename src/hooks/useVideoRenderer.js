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
        verses, 
        timings, 
        translation, 
        background,
        reciter, // Need reciter for watermark
        style = {
            color: { value: '#FFFFFF' },
            animation: { id: 'none' }
        }
    } = data;
    
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

        // 2. Find Active Verse
        const currentMs = time * 1000;
        let activeIndex = -1;

        if (timings && timings.length > 0) {
            activeIndex = timings.findIndex(t => currentMs >= t.start_ms && currentMs <= t.end_ms);
        }

        // 3. Draw Text
        if (activeIndex !== -1 && verses && verses[activeIndex]) {
            const verse = verses[activeIndex];
            const trans = translation && translation[activeIndex];
            
            // Animation State
            let opacity = 1;
            let themeColor = style.color?.value || '#FFFFFF';
            let yOffset = 0;

            if (style.animation?.id === 'fade') {
                // Simple fade in based on how far we are into the verse? 
                // Or just global fade? For simple "karaoke", assume visible.
                // Let's do a quick fade-in at the start of the verse
                const verseStart = timings[activeIndex].start_ms / 1000;
                const progress = time - verseStart;
                if (progress < 0.5) { // 500ms fade
                    opacity = progress / 0.5;
                }
            } else if (style.animation?.id === 'slide-up') {
                const verseStart = timings[activeIndex].start_ms / 1000;
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
            
            // Arabic Text
            const fontFamily = "'Amiri Quran', serif"; 
            ctx.font = `bold 40px ${fontFamily}`;
            ctx.fillStyle = themeColor;
            ctx.direction = 'rtl'; // Critical for correct Bidi rendering
            
            // Wrap Text Logic
            const maxWidth = width * 0.8; 
            const words = verse.text_uthmani.split(' ');
            
            // Verse Number Rendering
            // User requested: "Render verse number at the start line".
            // In RTL, "Start" is Right.
            // Using Ornate Parenthesis: U+FD3E ﴾ (Left) and U+FD3F ﴿ (Right).
            // Logic: ﴾ 1 ﴿
            const verseNum = verse.verse_key.split(':')[1];
            const toArabic = (n) => n.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
            const verseSymbol = `﴾${toArabic(verseNum)}﴿`;
            
            // Appending symbol to the text ensures it flows correctly in RTL block.
            // Text ... Symbol.
            // If Text is Arabic, and Symbol is Arabic-like, they flow Right to Left.
            // [Text] [Symbol] -> Text is Rightmost? No. First char is Rightmost.
            // If I want Symbol on Right (Start):
            // I must PREPEND it. 
            // Symbol + Text.
            // First char of Symbol is ﴾.
            // So ﴾ ... ﴿ [Text].
            // Visual: ﴾ 1 ﴿ [Text].
            // This puts verse number on the RIGHT.
            
            const fullText = `${verseSymbol} ${verse.text_uthmani}`; 
            
            const wordsToDraw = fullText.split(' ');
            let line = '';
            const lines = [];

            for (let i = 0; i < wordsToDraw.length; i++) {
                const testLine = line + wordsToDraw[i] + ' ';
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && i > 0) {
                    lines.push(line);
                    line = wordsToDraw[i] + ' ';
                } else {
                    line = testLine;
                }
            }
            lines.push(line);

            // Draw Lines
            const lineHeight = 70; 
            const totalTextHeight = lines.length * lineHeight;
            let startY = height / 2 - (totalTextHeight / 2) + yOffset;
            
            lines.forEach((l, index) => {
                ctx.fillText(l.trim(), width / 2, startY + (index * lineHeight));
            });

            // Translation
            if (trans) {
                ctx.font = '20px Arial';
                ctx.fillStyle = '#ddd'; 
                const transText = trans.text ? trans.text.replace(/<[^>]*>?/gm, '') : '';
                // Split translation if too long?
                // Basic wrap for translation
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
                    ctx.fillText(tl.trim(), width / 2, startY + (lines.length * lineHeight) + 20 + (idx * 30));
                });
            }
            
            // Reciter Name Watermark
            if (reciter && reciter.name) {
                ctx.font = '16px Arial';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.textAlign = 'right';
                ctx.fillText(reciter.name, width - 20, height - 20); // Bottom trailing (Right)
            }

            ctx.globalAlpha = 1.0; // Reset
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
