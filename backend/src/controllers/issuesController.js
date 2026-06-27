import mongoose from 'mongoose';
import Issue from '../models/Issue.js';
import User from '../models/User.js';

const sortPriority = {
  High: 1,
  Medium: 2,
  Low: 3,
};

function estimateIssueSize({ title, description, project, type, status, priority }) {
  const rawString = `${title || ''}${description || ''}${project || ''}${type || ''}${status || ''}${priority || ''}`;
  const bytes = Buffer.byteLength(rawString, 'utf8');
  return Math.max(bytes, 5 * 1024);
}

export async function getAllIssues(req, res) {
  try {
    const { projects } = req.query;
    const filter = { user: new mongoose.Types.ObjectId(req.userId) };

    if (projects) {
      const selectedProjects = projects
        .split(',')
        .map((project) => project.trim())
        .filter(Boolean);
      if (selectedProjects.length > 0) {
        filter.project = { $in: selectedProjects };
      }
    }

    const issues = await Issue.aggregate([
      { $match: filter },
      {
        $addFields: {
          priorityOrder: {
            $switch: {
              branches: [
                { case: { $eq: ['$priority', 'High'] }, then: 1 },
                { case: { $eq: ['$priority', 'Medium'] }, then: 2 },
                { case: { $eq: ['$priority', 'Low'] }, then: 3 },
              ],
              default: 4,
            },
          },
        },
      },
      { $sort: { priorityOrder: 1, updatedAt: -1, createdAt: -1 } },
      { $project: { priorityOrder: 0 } },
    ]);

    res.status(200).json(issues);
  } catch (error) {
    console.error('Error when getting all issues', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getIssue(req, res) {
  try {
    const issue = await Issue.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    res.status(200).json(issue);
  } catch (error) {
    console.error('Error when getting issue', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function createIssue(req, res) {
  try {
    const { title, description, project, type, status, priority } = req.body;
    const issueSize = estimateIssueSize({ title, description, project, type, status, priority });
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: 'User not found' });

    if (user.storageUsed + issueSize > user.storageLimit) {
      return res.status(403).json({
        message: 'Issue storage quota exceeded. Delete existing issues before creating more.',
      });
    }

    const newIssue = new Issue({
      title,
      description,
      project,
      type,
      status,
      priority,
      user: userId,
      estimatedSize: issueSize,
    });

    await newIssue.save();
    user.storageUsed += issueSize;
    await user.save();

    res.status(201).json(newIssue);
  } catch (error) {
    console.error('Error when creating issue', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res
        .status(400)
        .json({ message: 'Validation failed', errors: validationErrors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateIssue(req, res) {
  try {
    const { title, description, project, type, status, priority } = req.body;
    const id = req.params.id;

    const issue = await Issue.findOne({ _id: id, user: req.userId });
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const newSize = estimateIssueSize({ title, description, project, type, status, priority });
    const sizeDelta = newSize - (issue.estimatedSize || 0);

    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ message: 'User not found' });

    if (sizeDelta > 0 && user.storageUsed + sizeDelta > user.storageLimit) {
      return res.status(403).json({
        message: 'Issue update would exceed your storage quota.',
      });
    }

    issue.title = title;
    issue.description = description;
    issue.project = project;
    issue.type = type;
    issue.status = status;
    issue.priority = priority;
    issue.estimatedSize = newSize;
    await issue.save();

    user.storageUsed = Math.max(0, user.storageUsed + sizeDelta);
    await user.save();

    res.status(200).json(issue);
  } catch (error) {
    console.error('Error when updating issue', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteIssue(req, res) {
  try {
    const issue = await Issue.findOne({ _id: req.params.id, user: req.userId });
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ message: 'User not found' });

    await issue.deleteOne();
    user.storageUsed = Math.max(0, user.storageUsed - (issue.estimatedSize || 0));
    await user.save();

    res.status(200).json({ message: 'Issue deleted successfully' });
  } catch (error) {
    console.error('Error when deleting issue', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
