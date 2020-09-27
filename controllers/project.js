'use strict'

var projectModel = require('../models/project');
var fs = require('fs');
var path = require('path');

var controller = {
    home: (req,res)=>{
        return res.status(200).send({
            message: 'HTTP Status 200 /home'
        });
    },
    test: (req,res)=>{
        return res.status(200).send({
            message: 'HTTP Status 200 /test'
        });
    },
    saveProject: (req,res)=>{
        var project = new projectModel();
        var params = req.body;
        
        project.name = params.name;
        project.description = params.description;
        project.category = params.category;
        project.year = params.year;
        project.lang = params.lang;
        project.image = null;

        project.save((err,stored)=>{
            if(err)
                return res.status(500).send({
                    message: "Error al guardar"
                });
            if(!stored)
                return res.status(404).send({
                    message: "No se ha podido guardar el proyecto"
                });
            return res.status(201).send({project: stored});
        });
    },
    getProject: (req,res)=>{
        var projectId = req.params.id;
        if(projectId == null)
            return res.status(404).send({
                message: "El proyecto no existe"
            });

        projectModel.findById(projectId,(err,project)=>{
            if(err)
                return res.status(500).send({
                    message: "Error al devolver datos"
                });
            if(!project)
                return res.status(404).send({
                    message: "El proyecto no existe"
                });
            return res.status(200).send({
                project: project
            });
        });
    },
    getProjects: (req,res)=>{
        projectModel.find().sort('-year').exec((err,projects)=>{ //-year descendente +year ascendente
            if(err)
                return res.status(500).send({
                    message: "Error al devolver datos"
                });
            if(!projects)
                return res.status(404).send({
                    message: "No hay proyectos"
                });
            return res.status(200).send({
                projects: projects
            });
        })
    },
    updateProject: (req,res)=>{
        var projectId = req.params.id;
        var update = req.body;
        projectModel.findByIdAndUpdate(projectId, update, {new: true},(err,projectUpdated)=>{
            if(err) return res.status(500).send({message: "Error al actualizar"});
            if(!projectUpdated) return res.status(404).send({message: "No existe el proyecto"});
            return res.status(200).send({
                project: projectUpdated
            })
        })
    },
    deleteProject: (req,res)=>{
        var projectId = req.params.id;
        
        projectModel.findByIdAndDelete(projectId, (err, projectDeleted)=>{
            
            if(err) return res.status(500).send({message: "Error al borrar"});
            
            if(!projectDeleted) return res.status(404).send({message: "No existe el proyecto"});
            
            if(projectDeleted){
                
                let imagePath = './uploads/'+projectDeleted.image; 
                
                fs.unlink(imagePath, (err)=>{
                    if(err)
                        return res.status(500).send({
                            message: "Error al eliminar imagen",
                            project: projectDeleted
                        });
                    else
                        return res.status(200).send({
                            project: projectDeleted
                        });
                })                
            }
        })
    },
    //connect-multiparty
    uploadImage: (req,res)=>{
        var projectId = req.params.id;
        
        if(req.files){
            res.status(200).send({file: req.files})            
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('/');
            var fileName = fileSplit[1]; 
            var extSplit = fileName.split('.');

            if(extSplit[1]=="png"||extSplit[1]=="jpg"||extSplit[1]=="jpeg"||extSplit[1]=="gif")
            {
                projectModel.findByIdAndUpdate(projectId, {image: fileName}, {new: true},(err, projectUpdated)=>{
                    if(!projectUpdated) return res.status(404).send({message: "No existe el proyecto"});
                    if(err) return res.status(500).send({message: "Imagen no asignada"});
                    return res.status(200).send({project: projectUpdated});
                })
            }
            else{
                fs.unlink(filePath, (err)=>{
                    return res.status(200).send({
                        message: "Extension invalida"
                    })
                })
            }

            

            /*return res.status(200).send({
                fileName: fileName//fileName
            })*/
        }
        else{
            return res.status(200).send({
                message: 'Imagen no subida'
            })
        }
    },

    getImage: (req,res) => {
        var file = req.params.file;
        var pathFile = "./uploads/"+file;

        fs.exists(pathFile, (exists) => {
            if(exists)
                return res.sendFile(path.resolve(pathFile));
            else
                return res.status(404);
        });
    }
};

module.exports = controller;