import React,{useEffect,useState} from 'react';
import {useAuth} from '../../hooks/useAuth';
import {getUserProjects} from '../../services/db';
import Navbar from '../Layout/Navbar';
import {Link,useNavigate} from 'react-router-dom';

const Dashboard = () => {
  const {user,loading} = useAuth();
  const [projects,setProjects] = useState([]);
  const [isLoadingProjects,setIsLoadingProjects] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  },[user,loading,navigate]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        try {
          const data = await getUserProjects(user.uid);
          setProjects(data);
        } catch (error) {
          console.error("Error fetching projects:",error);
        } finally {
          setIsLoadingProjects(false);
        }
      }
    };
    fetchProjects();
  },[user]);

  if (loading || (user && isLoadingProjects)) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-400">My Creations</h1>
          <Link to="/" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition text-sm font-medium">
            + New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-xl text-gray-400 mb-4">You haven't created any projects yet.</p>
            <Link to="/" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Start creating now &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-emerald-500/50 transition shadow-lg">
                {/* Thumbnail logic (placeholder or background image) */}
                <div className="h-40 bg-gray-900 relative">
                  {project.background ? (
                    project.background.type === 'video' ? (
                      <video src={project.background.url} className="w-full h-full object-cover opacity-60" />
                    ) : (
                      <img src={project.background.url} alt="bg" className="w-full h-full object-cover opacity-60" />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">No Background</div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-2xl font-bold font-arabic">{project.surah.name}</span>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-emerald-600 text-xs px-2 py-1 rounded">
                    {project.reciter.name}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">Surah {project.surah.name}</h3>
                  <p className="text-xs text-gray-400 mb-3">
                    Verses {project.range.start} - {project.range.end || 'End'}
                  </p>
                  <div className="text-xs text-gray-500">
                    Created: {project.createdAt?.toDate().toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
