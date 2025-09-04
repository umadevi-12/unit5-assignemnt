const express = require('express');
const router = express.Router();

const {
    getEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
    
} = require('../controllers/employeeController');

const  roleCheck = require('../middlewares/roleCheckMiddleware');

router.get('/' , roleCheck(['admin' , 'hr']) ,getEmployees);
router.post('/' , roleCheck(['admin' , 'hr']) ,addEmployee);
router.put('/:id' , roleCheck(['admin' , 'hr']) ,updateEmployee);
router.delete('/:id' , roleCheck(['admin' , 'hr']) ,deleteEmployee);


module.exports = router;


