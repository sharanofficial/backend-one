import express from 'express';
import {
  registerUser,
  deleteUserById,
  getAllUser,
  getUserById,
  loginUser,
  updateUserById,
  resendOtp,
  verifyEmail,
} from '../controllers/user';
import { checkValidUser } from '../middlewares/user';
export const router = express.Router();

router.post('/signup', registerUser);
router.get('/get-all-user', checkValidUser, getAllUser);
router.get('/get-user/:id', checkValidUser, getUserById);
router.put('/update-user/:id', checkValidUser, updateUserById);
router.delete('/delete-user/:id', checkValidUser, deleteUserById);
router.post('/login', loginUser);
router.post('/resend-otp', resendOtp);
router.post('/verify-email', verifyEmail);
