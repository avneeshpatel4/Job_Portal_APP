import express from "express";
import authenticatedToken from "../middleware/isAuthenticated.js";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
} from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(authenticatedToken, postJob);
router.route("/get").get(authenticatedToken, getAllJobs);
router.route("/getadminJobs").get(authenticatedToken, getAdminJobs);
router.route("/get/:id").get(authenticatedToken, getJobById);

export default router;
