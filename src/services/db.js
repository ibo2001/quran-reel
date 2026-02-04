import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore';

const PROJECTS_COLLECTION = 'projects';

/**
 * Save a new project
 * @param {string} userId
 * @param {Object} projectData 
 * @returns {Promise<string>} Project ID
 */
export const saveProject = async (userId, projectData) => {
    try {
        const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
            userId,
            ...projectData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error saving project:", error);
        throw error;
    }
};

/**
 * Get user's projects
 * @param {string} userId 
 * @returns {Promise<Array>} List of projects
 */
export const getUserProjects = async (userId) => {
    try {
        const q = query(
            collection(db, PROJECTS_COLLECTION), 
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        // Index might be needed
        console.error("Error fetching projects:", error);
        throw error;
    }
};
