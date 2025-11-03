import express from "express";
import authenticatedToken from "../middleware/isAuthenticated.js";
import {
  getAllCompanies,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controllers/company.controller.js";

const router = express.Router();

router.route("/register").post(authenticatedToken, registerCompany);
router.route("/get").get(authenticatedToken, getAllCompanies);
router.route("/get/:id").get(authenticatedToken, getCompanyById);
router.route("/update/:id").put(authenticatedToken, updateCompany);

export default router;
