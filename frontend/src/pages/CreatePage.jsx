import { ArrowLeftIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';
import api from '../lib/axios';

const typeOptions = ['Bug', 'Feature', 'Refactor'];
const statusOptions = ['Open', 'In Progress', 'Closed'];
const priorityOptions = ['High', 'Medium', 'Low'];

const CreatePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('');
  const [type, setType] = useState('Bug');
  const [status, setStatus] = useState('Open');
  const [priority, setPriority] = useState('Medium');
  const [projectSuggestions, setProjectSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/issues');
        const uniqueProjects = Array.from(
          new Set(res.data.map((issue) => issue.project))
        );
        setProjectSuggestions(uniqueProjects);
      } catch (error) {
        console.error('Error fetching projects', error);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !project.trim()) {
      toast.error('Title and project are required');
      return;
    }

    setLoading(true);
    try {
      await api.post('/issues', {
        title,
        description,
        project,
        type,
        status,
        priority,
      });

      toast.success('Issue created successfully!');
      navigate('/');
    } catch (error) {
      console.log(
        'Error creating issue',
        error.response?.data || error.message || error
      );
      toast.error('Failed to create issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={'/'} className="btn mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to board
          </Link>

          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create New Issue</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Issue title"
                    className="input input-bordered"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    placeholder="Describe the issue or feature request"
                    className="textarea textarea-bordered h-32"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Project</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Project name"
                    list="project-suggestions"
                    className="input input-bordered"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                  />
                  <datalist id="project-suggestions">
                    {projectSuggestions.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                </div>

                <div className="grid gap-4 md:grid-cols-3 mb-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Type</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      {typeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Status</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Priority</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      {priorityOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Issue'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePage;