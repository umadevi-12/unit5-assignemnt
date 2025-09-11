const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  startLocation: { type: String, required: [true, 'startLocation required'] },
  endLocation: { type: String, required: [true, 'endLocation required'] },
  distance: {
    type: Number,
    required: [true, 'distance required'],
    min: [0.000001, 'distance must be greater than 0'] 
  },
  startTime: { type: Date, required: [true, 'startTime required'] },
  endTime: {
    type: Date,
    required: [true, 'endTime required'],
    validate: {
      validator: function (value) {
    
        return this.startTime && value > this.startTime;
      },
      message: 'endTime must be after startTime'
    }
  }
}, { timestamps: true });

const VehicleSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: [true, 'registrationNumber required'],
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: {
      values: ['car', 'truck', 'bike'],
      message: 'type must be car, truck or bike'
    },
    required: [true, 'type required']
  },
  model: { type: String, required: [true, 'model required'] },
  isActive: { type: Boolean, default: true },
  trips: [TripSchema]
}, { timestamps: true });


VehicleSchema.index({ registrationNumber: 1 }, { unique: true });


VehicleSchema.methods.totalDistance = function () {

  return (this.trips || []).reduce((sum, t) => sum + (t.distance || 0), 0);
};

const Vehicle = mongoose.model('Vehicle', VehicleSchema);

module.exports = Vehicle;
