import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    project: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Bug', 'Feature', 'Refactor'],
      default: 'Bug',
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Closed'],
      default: 'Open',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
  },
  { timestamps: true }
);

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;
