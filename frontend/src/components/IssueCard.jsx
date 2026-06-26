import React from 'react';
import { PenSquareIcon, Trash2Icon } from 'lucide-react';
import { Link } from 'react-router';
import { formatDate } from '../lib/utils';

const priorityColors = {
  High: 'badge-error text-error-content',
  Medium: 'badge-warning text-warning-content',
  Low: 'badge-success text-success-content',
};

const typeColors = {
  Bug: 'badge-outline badge-error',
  Feature: 'badge-outline badge-primary',
  Refactor: 'badge-outline badge-secondary',
};

const IssueCard = ({ issue, onDelete, onDragStart }) => {
  return (
    <Link
      to={`/issue/${issue._id}`}
      className="block cursor-pointer rounded-xl border border-base-content/20 bg-base-100 p-3.5 transition-all duration-200 hover:shadow-md hover:border-primary/40"
      draggable
      onDragStart={(e) => onDragStart(e, issue._id)}
    >
      <div className="flex flex-col gap-2">
        {/* Badges & Inline Delete Action */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            <span className="badge badge-sm font-bold badge-neutral">
              {issue.project}
            </span>
            <span
              className={`badge badge-sm font-bold ${typeColors[issue.type] || 'badge-ghost'}`}
            >
              {issue.type}
            </span>
            <span
              className={`badge badge-sm font-bold ${priorityColors[issue.priority] || 'badge-ghost'}`}
            >
              {issue.priority}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(issue._id);
            }}
            className="btn btn-ghost btn-circle btn-sm text-error/60 hover:text-error hover:bg-error/10"
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>

        {/* Title and Clipped Description */}
        <div>
          <h3 className="text-sm font-bold line-clamp-1 text-base-content leading-snug">
            {issue.title}
          </h3>
          {issue.description && (
            <p className="text-xs text-base-content/60 line-clamp-2 mt-1">
              {issue.description}
            </p>
          )}
        </div>

        {/* Divider & Metadata Footer */}
        <div className="mt-1 pt-2 border-t border-base-content/5 flex items-center justify-between text-[10px] text-base-content/50">
          <span>
            {formatDate(new Date(issue.updatedAt || issue.createdAt))}
          </span>
          <div className="flex items-center gap-1 hover:text-primary transition-colors">
            <PenSquareIcon className="size-3" />
            <span>Edit</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default IssueCard;
