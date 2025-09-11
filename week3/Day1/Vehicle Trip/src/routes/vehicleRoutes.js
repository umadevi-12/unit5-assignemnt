const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/vehicleController');

router.post('/', ctrl.createVehicle);
router.get('/', ctrl.getAllVehicles);
router.get('/:id', ctrl.getVehicleById);
router.put('/:id', ctrl.updateVehicle);
router.delete('/:id', ctrl.deleteVehicle);


router.post('/:id/trips', ctrl.addTrip);
router.put('/:id/trips/:tripId', ctrl.updateTrip);
router.delete('/:id/trips/:tripId', ctrl.deleteTrip);

router.get('/query/long-trips', ctrl.getVehiclesWithLongTrip);
router.get('/query/start-locations', ctrl.getVehiclesByStartLocations);
router.get('/query/after-date', ctrl.getVehiclesWithTripsStartingAfter);
router.get('/query/by-types', ctrl.getVehiclesByTypes);
router.get('/:id/total-distance', ctrl.getTotalDistance);

module.exports = router;
