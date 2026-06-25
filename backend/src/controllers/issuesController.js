import Issue from '../models/Issue.js';

const sortPriority = {
  High: 1,
  Medium: 2,
  Low: 3,
};

export async function getAllIssues(req, res) {
  try {
    const { projects } = req.query;
    const filter = {};

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
    const issue = await Issue.findById(req.params.id);

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

    const newIssue = new Issue({
      title,
      description,
      project,
      type,
      status,
      priority,
    });

    await newIssue.save();
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

    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      { title, description, project, type, status, priority },
      { new: true }
    );

    if (!updatedIssue)
      return res.status(404).json({ message: 'Issue not found' });

    res.status(200).json(updatedIssue);
  } catch (error) {
    console.error('Error when updating issue', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteIssue(req, res) {
  try {
    const deletedIssue = await Issue.findByIdAndDelete(req.params.id);

    if (!deletedIssue)
      return res.status(404).json({ message: 'Issue not found' });

    res.status(200).json({ message: 'Issue deleted successfully' });
  } catch (error) {
    console.error('Error when deleting issue', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
