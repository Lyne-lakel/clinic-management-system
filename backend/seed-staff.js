/**
 * =============================================================================
 * SEED STAFF DATA
 * =============================================================================
 * 
 * PURPOSE:
 * Populates the database with initial staff members (doctors and receptionist)
 * for development and testing.
 * 
 * RUN WITH:
 * node backend/seed-staff.js
 * 
 * =============================================================================
 */

require('dotenv').config();
const connectToDatabase = require('./config/database');
const Staff = require('./models/Staff');

const staffData = [
  {
    name: "Dr. Nouar",
    role: "Doctor",
    email: "dr.nouar@clinic.com",
    phone: "0555-111-111",
    dob: "1980-05-15",
    specialization: "General Practice",
    workingHours: "08:00 - 18:00",
    workingDays: "Mon, Tue, Wed, Thu, Fri",
    status: "Active",
    consultations: 5,
    hoursWorked: 40,
    schedule: {
      slotDuration: 30,
      restInterval: 5,
      availableSlots: [
        { startTime: "09:00", endTime: "09:30", status: "available" },
        { startTime: "09:35", endTime: "10:05", status: "available" },
        { startTime: "10:10", endTime: "10:40", status: "available" },
        { startTime: "10:45", endTime: "11:15", status: "available" },
        { startTime: "11:20", endTime: "11:50", status: "available" },
        { startTime: "14:00", endTime: "14:30", status: "available" },
        { startTime: "14:35", endTime: "15:05", status: "available" },
        { startTime: "15:10", endTime: "15:40", status: "available" }
      ]
    }
  },
  {
    name: "Dr. Bensalem",
    role: "Doctor",
    email: "dr.bensalem@clinic.com",
    phone: "0555-222-222",
    dob: "1985-03-20",
    specialization: "Internal Medicine",
    workingHours: "08:00 - 18:00",
    workingDays: "Mon, Tue, Wed, Thu, Fri",
    status: "Active",
    consultations: 4,
    hoursWorked: 40,
    schedule: {
      slotDuration: 30,
      restInterval: 5,
      availableSlots: [
        { startTime: "09:00", endTime: "09:30", status: "available" },
        { startTime: "09:35", endTime: "10:05", status: "available" },
        { startTime: "10:10", endTime: "10:40", status: "available" },
        { startTime: "10:45", endTime: "11:15", status: "available" },
        { startTime: "11:20", endTime: "11:50", status: "available" },
        { startTime: "14:00", endTime: "14:30", status: "available" },
        { startTime: "14:35", endTime: "15:05", status: "available" },
        { startTime: "15:10", endTime: "15:40", status: "available" }
      ]
    }
  },
  {
    name: "Dr. Khelifi",
    role: "Doctor",
    email: "dr.khelifi@clinic.com",
    phone: "0555-333-333",
    dob: "1982-07-10",
    specialization: "Pediatrics",
    workingHours: "08:00 - 18:00",
    workingDays: "Mon, Tue, Wed, Thu, Fri",
    status: "Active",
    consultations: 6,
    hoursWorked: 40,
    schedule: {
      slotDuration: 30,
      restInterval: 5,
      availableSlots: [
        { startTime: "09:00", endTime: "09:30", status: "available" },
        { startTime: "09:35", endTime: "10:05", status: "available" },
        { startTime: "10:10", endTime: "10:40", status: "available" },
        { startTime: "10:45", endTime: "11:15", status: "available" },
        { startTime: "11:20", endTime: "11:50", status: "available" },
        { startTime: "14:00", endTime: "14:30", status: "available" },
        { startTime: "14:35", endTime: "15:05", status: "available" },
        { startTime: "15:10", endTime: "15:40", status: "available" }
      ]
    }
  },
  {
    name: "Sarah Johnson",
    role: "Receptionist",
    email: "sarah.johnson@clinic.com",
    phone: "0555-987-654",
    dob: "1992-08-15",
    workingHours: "08:00 - 18:00",
    workingDays: "Mon, Tue, Wed, Thu, Fri",
    status: "Active",
    appointmentsManaged: 12,
    hoursWorked: 40
  }
];

async function seedStaff() {
  try {
    const db = await connectToDatabase();
    
    // Clear existing staff to avoid duplicates with new data structure
    await Staff.deleteMany({});
    console.log('✅ Cleared existing staff records');
    
    // Insert new staff
    const result = await Staff.insertMany(staffData);
    console.log(`✅ Seeded ${result.length} staff members successfully!`);
    
    // Show what was added
    result.forEach(staff => {
      console.log(`   - ${staff.name} (${staff.role})`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding staff:', err.message);
    process.exit(1);
  }
}

seedStaff();
