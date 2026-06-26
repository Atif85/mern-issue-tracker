import React, { useEffect, useMemo, useState } from 'react';
import NavBar from '../components/NavBar';
import api from '../lib/axios';
import IssueCard from '../components/IssueCard';
import IssuesNotFound from '../components/IssuesNotFound';
import { FilterIcon, XIcon } from 'lucide-react';

const STATUS_COLUMNS = ['Open', 'In Progress', 'Closed'];
const PRIORITY_ORDER = { High: 1, Medium: 2, Low: 3 };

const HomePage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjects, setSelectedProjects] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await api.get('/issues');
        setIssues(res.data);
      } catch (error) {
        console.error('Error fetching issues', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const projectOptions = useMemo(
    () => Array.from(new Set(issues.map((issue) => issue.project))).sort(),
    [issues]
  );

  const filteredIssues = useMemo(() => {
    if (selectedProjects.length === 0) return issues;
    return issues.filter((issue) => selectedProjects.includes(issue.project));
  }, [issues, selectedProjects]);

  const issuesByStatus = useMemo(
    () =>
      STATUS_COLUMNS.reduce((acc, status) => {
        const columnIssues = filteredIssues
          .filter((issue) => issue.status === status)
          .sort((a, b) => {
            const priorityDiff =
              PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
            if (priorityDiff !== 0) return priorityDiff;
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          });

        return { ...acc, [status]: columnIssues };
      }, {}),
    [filteredIssues]
  );

  const handleToggleProject = (project) => {
    setSelectedProjects((prev) =>
      prev.includes(project)
        ? prev.filter((p) => p !== project)
        : [...prev, project]
    );
  };

  const handleClearFilter = () => {
    setSelectedProjects([]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this issue?')) return;
    try {
      await api.delete(`/issues/${id}`);
      setIssues((prev) => prev.filter((issue) => issue._id !== id));
    } catch (error) {
      console.error('Error deleting issue', error);
    }
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = async (e, status) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const issue = issues.find((item) => item._id === id);
    if (!issue || issue.status === status) return;

    try {
      const updatedIssue = { ...issue, status };
      await api.put(`/issues/${id}`, updatedIssue);
      setIssues((prev) =>
        prev.map((item) => (item._id === id ? updatedIssue : item))
      );
    } catch (error) {
      console.error('Error updating issue status', error);
    }
  };

  const renderBoard = () => {
    if (loading) {
      return (
        <div className="text-center text-primary py-10">
          <span className="loading loading-spinner loading-md"></span>
          <p className="mt-2 text-sm">Loading issues...</p>
        </div>
      );
    }

    if (filteredIssues.length === 0) {
      return <IssuesNotFound />;
    }

    return (
      <div className="grid gap-4 lg:grid-cols-3 items-start">
        {STATUS_COLUMNS.map((status) => (
          <div
            key={status}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, status)}
            className="rounded-xl border border-base-content/10 bg-base-200/50 p-4 shadow-sm min-h-[500px]"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-base-content/70">
                {status}
              </h2>
              <span className="badge badge-sm badge-neutral font-semibold">
                {issuesByStatus[status].length}
              </span>
            </div>
            <div className="space-y-3">
              {issuesByStatus[status].map((issue) => (
                <IssueCard
                  key={issue._id}
                  issue={issue}
                  onDelete={handleDelete}
                  onDragStart={handleDragStart}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Modern Dashboard Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-base-content/10 pb-5">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Your Board</h1>
            <p className="text-xs text-base-content/60">
              Drag tasks between columns or filter your view below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Multi-select Dropdown Filter */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-outline btn-sm gap-2"
              >
                <FilterIcon className="size-3.5" />
                <span>Filter Projects</span>
                {selectedProjects.length > 0 && (
                  <span className="badge badge-primary badge-sm">
                    {selectedProjects.length}
                  </span>
                )}
              </div>
              <div
                tabIndex={0}
                className="dropdown-content z-[40] card card-compact w-64 p-2 shadow-xl bg-base-200 mt-2 border border-base-content/10"
              >
                <div className="card-body">
                  <h3 className="card-title text-xs uppercase tracking-wider text-base-content/60">
                    Select Projects
                  </h3>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {projectOptions.map((project) => (
                      <label
                        key={project}
                        className="label cursor-pointer justify-start gap-3 p-1.5 hover:bg-base-300 rounded-lg transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-xs checkbox-primary"
                          checked={selectedProjects.includes(project)}
                          onChange={() => handleToggleProject(project)}
                        />
                        <span className="label-text text-sm">{project}</span>
                      </label>
                    ))}
                    {projectOptions.length === 0 && (
                      <span className="text-xs text-base-content/50 block p-1">
                        No projects active
                      </span>
                    )}
                  </div>
                  {selectedProjects.length > 0 && (
                    <div className="card-actions justify-end mt-2 pt-2 border-t border-base-content/10">
                      <button
                        className="btn btn-ghost btn-xs text-error font-semibold"
                        onClick={handleClearFilter}
                        type="button"
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Selected Project Tags */}
            <div className="flex flex-wrap gap-1">
              {selectedProjects.map((project) => (
                <span
                  key={project}
                  className="badge badge-md badge-secondary gap-1 pr-1 font-semibold"
                >
                  {project}
                  <button
                    onClick={() => handleToggleProject(project)}
                    className="hover:bg-base-content/20 rounded-full p-0.5"
                    type="button"
                  >
                    <XIcon className="size-2.5" />
                  </button>
                </span>
              ))}
              {selectedProjects.length > 0 && (
                <button
                  className="btn btn-ghost btn-xs text-xs"
                  onClick={handleClearFilter}
                  type="button"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {renderBoard()}
      </div>
    </div>
  );
};

export default HomePage;
