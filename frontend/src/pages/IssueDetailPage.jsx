import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from 'lucide-react';

const typeOptions = ['Bug', 'Feature', 'Refactor'];
const statusOptions = ['Open', 'In Progress', 'Closed'];
const priorityOptions = ['High', 'Medium', 'Low'];

const IssueDetailPage = () => {
  const [issue, setIssue] = useState(null);
  const [projectOptions, setProjectOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [issueRes, projectsRes] = await Promise.all([
          api.get(`/issues/${id}`),
          api.get('/issues'),
        ]);

        setIssue(issueRes.data);
        setProjectOptions(
          Array.from(new Set(projectsRes.data.map((item) => item.project)))
        );
      } catch (error) {
        console.log('Error in fetching issue', error);
        toast.error('Failed to fetch the issue');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;

    try {
      await api.delete(`/issues/${id}`);
      toast.success('Issue deleted');
      navigate('/');
    } catch (error) {
      console.log('Error deleting the issue:', error);
      toast.error('Failed to delete issue');
    }
  };

  const handleSave = async () => {
    if (
      !issue.title.trim() ||
      !issue.project.trim()
    ) {
      toast.error('Title and project are required');
      return;
    }

    setSaving(true);

    try {
      await api.put(`/issues/${id}`, issue);
      toast.success('Issue updated successfully');
      navigate('/');
    } catch (error) {
      console.log('Error saving the issue:', error);
      toast.error('Failed to update issue');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to board
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-error btn-outline"
            >
              <Trash2Icon className="h-5 w-5" />
              Delete Issue
            </button>
          </div>

          <div className="card bg-base-100">
            <div className="card-body">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Issue title"
                  className="input input-bordered"
                  value={issue.title}
                  onChange={(e) =>
                    setIssue({ ...issue, title: e.target.value })
                  }
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  placeholder="Describe the issue or feature request"
                  className="textarea textarea-bordered h-32"
                  value={issue.description}
                  onChange={(e) =>
                    setIssue({ ...issue, description: e.target.value })
                  }
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
                  value={issue.project}
                  onChange={(e) =>
                    setIssue({ ...issue, project: e.target.value })
                  }
                />
                <datalist id="project-suggestions">
                  {projectOptions.map((option) => (
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
                    value={issue.type}
                    onChange={(e) =>
                      setIssue({ ...issue, type: e.target.value })
                    }
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
                    value={issue.status}
                    onChange={(e) =>
                      setIssue({ ...issue, status: e.target.value })
                    }
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
                    value={issue.priority}
                    onChange={(e) =>
                      setIssue({ ...issue, priority: e.target.value })
                    }
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
                  className="btn btn-primary"
                  disabled={saving}
                  onClick={handleSave}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default IssueDetailPage;
