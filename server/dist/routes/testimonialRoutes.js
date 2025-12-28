"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const testimonialController_1 = require("../controllers/testimonialController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.get('/', testimonialController_1.getAllTestimonials);
router.get('/:id', testimonialController_1.getTestimonialById);
// Protected routes (admin only)
router.post('/', auth_1.authenticateToken, testimonialController_1.upload.single('logo'), testimonialController_1.createTestimonial);
router.put('/:id', auth_1.authenticateToken, testimonialController_1.upload.single('logo'), testimonialController_1.updateTestimonial);
router.delete('/:id', auth_1.authenticateToken, testimonialController_1.deleteTestimonial);
exports.default = router;
