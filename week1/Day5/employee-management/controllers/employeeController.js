const fs = require('fs');
const path = require('path');
const employeeFile = path.join(__dirname , './employees.json');

function readEmployees(){
    if(!fs.existsSync(employeeFile)) return [];

    const data = fs.readFileSync(employeeFile,'utf-8');
    return data ? JSON.parse(data) :[];
}

function writeEmployee(data){
    fs.writeFileSync(employeeFile,JSON.stringify(data,null,2))
}

exports.getEmployees = (req,res) =>{
    const employees = readEmployees();
    res.json(employees);
}

exports.addEmployee = (req,res) =>{
    const {name, position , department, salary, status} = req.body;
    if(!name || !position || !department || !salary || !status){
        return res.status(404).json({error:'All feilds are required'})
    }

    const employees = readEmployees();
    const newEmployee = {
        id:employees.length ? employees[employees.length-1].id +1:1,
        name,
        position,
        department,
        salary,
        status,
    };

    employees.push(newEmployee);
    writeEmployee(employees);
    res.status(201).json(newEmployee)
};

exports.updateEmployee = (req,res) =>{
    const {id} = req.params;
    const{name , position,department,salary,status} = req.body;
    const employees = readEmployees;

    const employeeIndex = employees.findIndex((e) => e.id === parseInt(id));
    if(employeeIndex === -1) {
        return res.status(404).json({error:'Employee not found'});
    }

    employees[employeeIndex] ={
        ...employees[employeeIndex],
        name : name ?? employees[employeeIndex].name,
        position: position ?? employees[employeeIndex].position,
        department:department ?? employees[employeeIndex].department,
        salary:salary ?? employees[employeeIndex].salary,
        status:status ?? employees[employeeIndex].status,
    };

    writeEmployee(employees);
    res.json(employees[employeeIndex]);
};

exports.deleteEmployee = (req,res) =>{
    const {id} = req.params;
    let employees = readEmployees();

    const employeeIndex = employees.findIndex((e) => e.id === parseInt(id));
    if(employeeIndex === -1){
        return res.status(404).json({error:'Employee not found'})
    };

    const deleted = employees.splice(employeeIndex , 1);
    writeEmployee(employees);

    res.json({message:'Employee deleted' , employee: deleted[0]})
}