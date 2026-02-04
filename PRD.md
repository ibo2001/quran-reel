# Product Requirement Document (PRD): QuranReel

## 1. Project Overview
**QuranReel** is a modern web application designed to simplify the creation of Quranic short-form videos (Reels/Shorts). Users can generate high-quality videos by syncing specific Quranic verses with beautiful backgrounds and professional recitations, ready for social media sharing.

* **Product Name:** QuranReel
* **Vision:** To be the primary tool for creating aesthetic and spiritual Quranic content.
* **Tech Stack:** Vite, React.js, Tailwind CSS, Firebase (Auth, Hosting, Firestore).
* **Data Source:** [Itqan API](https://api.cms.itqan.dev/docs) for audio and verse synchronization.

---

## 2. User Features

### 2.1 Core Video Generator
* **Reciter Selection:** Browse and select from a list of world-renowned reciters.
* **Verse Range Picker:** Ability to select a starting Surah/Ayah and an ending Surah/Ayah.
* **Media Integration:**
    * **Preset Library:** A curated gallery of high-definition Islamic and nature-themed videos/images.
    * **User Upload:** Support for uploading personal MP4, JPG, or PNG files from the local device.
* **Dynamic Sync:** Real-time alignment of Arabic text with the audio duration using API timestamps.

### 2.2 User Accounts (Firebase)
* **Authentication:** Social login (Google) and Email/Password via Firebase Auth.
* **Guest Access:** Full access to the generator without mandatory login.
* **Personal Dashboard:** Registered users can save, rename, and manage their generated videos in a "My Creations" section.

---

## 3. Technical Requirements

### 3.1 Frontend
* **Framework:** React with **Vite** for optimized build speeds.
* **Styling:** **Tailwind CSS** for a utility-first, responsive, and modern UI.
* **State Management:** Context API or Redux Toolkit for handling video configuration states.

### 3.2 Backend & Services
* **Firebase Hosting:** Fast and secure global hosting.
* **Firebase Firestore:** Storing user metadata and saved project configurations.
* **Itqan API:** Used for fetching:
    * List of Reciters.
    * Surah and Ayah metadata.
    * Audio files and word-by-word synchronization data.

---

## 4. UI/UX Design Goals
* **Minimalist Interface:** Clean, clutter-free workspace focused on the video preview.
* **Responsive Design:** Optimized for mobile-first usage (9:16 aspect ratio focus).
* **Dark Mode Support:** A sleek aesthetic that aligns with spiritual and modern app trends.

---

## 5. Roadmap

### Phase 1: MVP (Minimum Viable Product)
* Integration with Itqan API.
* Basic video generator with preset backgrounds.
* Local video rendering/download functionality.

### Phase 2: Personalization & Auth
* Firebase Authentication setup.
* "My Creations" gallery for logged-in users.
* Custom font selection for the Quranic text.

### Phase 3: Advanced Features
* Multi-language translations (English, Urdu, French, etc.) as subtitles.
* Audio effects (reverb/echo) and background music (Nasheed/Ambiance) layering.
* In-app video trimming and basic filtering.

### Phase 4: Expansion & Social
* Direct API sharing to Instagram, TikTok, and YouTube.
* Community Feed: A place for users to showcase their generated Reels.

---

## 6. Success Metrics
* **Generation Time:** Users should be able to create a video in under 60 seconds.
* **User Growth:** Number of unique videos generated per month.
* **Retention:** Percentage of users who return to create a second video.