"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientController_1 = require("../controllers/clientController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.get('/', clientController_1.getAllClients);
router.get('/:id', clientController_1.getClientById);
// Protected routes (admin only)
router.post('/', auth_1.authenticateToken, clientController_1.upload.single('logo'), clientController_1.createClient);
router.put('/:id', auth_1.authenticateToken, clientController_1.upload.single('logo'), clientController_1.updateClient);
router.delete('/:id', auth_1.authenticateToken, clientController_1.deleteClient);
exports.default = router;
