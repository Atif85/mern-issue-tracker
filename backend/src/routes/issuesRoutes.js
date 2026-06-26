import express from 'express';
import {
  getAllIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
} from '../controllers/issuesController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllIssues);

router.get('/:id', getIssue);

router.post('/', createIssue);

router.put('/:id', updateIssue);

router.delete('/:id', deleteIssue);

export default router;
