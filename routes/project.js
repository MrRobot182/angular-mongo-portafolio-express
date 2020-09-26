'use strict'

var express = require('express');
var projectController = require('../controllers/project');

var router = express.Router();

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({uploadDir: "./uploads"});

router.get('/home',projectController.home);
router.get('/test',projectController.test);
router.post('/save-project',projectController.saveProject);
router.get('/project/:id',projectController.getProject);
router.get('/projects',projectController.getProjects);
router.put('/project/:id',projectController.updateProject);
router.delete('/project/:id',projectController.deleteProject);
router.post('/upload-image/:id', multipartyMiddleware, projectController.uploadImage);
router.get('/get-image/:file', projectController.getImage);

module.exports = router;