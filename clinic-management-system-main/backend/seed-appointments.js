/**
 * =============================================================================
 * SEED APPOINTMENTS DATA
 * =============================================================================
 * 
 * PURPOSE:
 * Populates the database with sample appointments for testing receptionist
 * functionality (queue management, appointment status updates, etc.)
 * 
 * RUN WITH:
 * node backend/seed-appointments.js
 * 
 * =============================================================================
 */

require('dotenv').config();
const connectToDatabase = require('./config/database');
const Appointment = require('./models/Appointment');
const Patient = require('./models/Patient');
const Staff = require('./models/Staff');

async function seedAppointments() {
  try {
    const db = await connectToDatabase();
    
    // Clear existing appointments first
    await Appointment.deleteMany({});
    console.log('✅ Cleared existing appointments');
    
    // Fetch existing doctors - filter out invalid entries
    const doctors = await Staff.find({ role: "Doctor", status: "Active" }).limit(3);
    
    if (doctors.length < 3) {
      console.error(`❌ Need at least 3 doctors. Found ${doctors.length}. Please reseed staff: node seed-staff.js`);
      process.exit(1);
    }
    
    console.log(`✅ Found ${doctors.length} doctors`);
    
    // Check for existing patients, create if needed
    let appointmentPatients = await Patient.find().limit(3);
    
    // If no patients exist, create some with Arabic names
    if (appointmentPatients.length === 0) {
      console.log('📝 Creating patients with Arabic names...');
      
      const patientsData = [
        {
          firstName: "محمد",
          lastName: "علي",
          phone: "0555-100-101",
          dateOfBirth: "1990-03-15",
          allergies: "لا يوجد",
          chronicConditions: "ارتفاع ضغط الدم",
          medicalHistory: "عملية زائدة في 2019"
        },
        {
          firstName: "فاطمة",
          lastName: "احمد",
          phone: "0555-200-202",
          dateOfBirth: "1985-07-22",
          allergies: "الصويا",
          chronicConditions: "السكري",
          medicalHistory: "لا توجد عمليات سابقة"
        },
        {
          firstName: "علي",
          lastName: "حسن",
          phone: "0555-300-303",
          dateOfBirth: "1992-11-08",
          allergies: "الفول السوداني",
          chronicConditions: "لا يوجد",
          medicalHistory: "كسر في اليد اليمنى 2021"
        }
      ];
      
      appointmentPatients = await Patient.insertMany(patientsData);
      console.log(`✅ Created ${appointmentPatients.length} patients with Arabic names`);
    }
    
    // Get today's date and create appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const appointmentsData = [
      {
        patient: appointmentPatients[0]._id,
        patientName: `${appointmentPatients[0].firstName} ${appointmentPatients[0].lastName}`,
        doctor: doctors[0]._id,  // Dr. Nouar
        doctorName: doctors[0].name,
        date: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 09:00 today
        duration: 30,
        reason: "فحص عام / General Checkup",
        notes: "المريض يشتكي من آلام في الرأس",
        status: "Pending"
      },
      {
        patient: appointmentPatients[1]._id,
        patientName: `${appointmentPatients[1].firstName} ${appointmentPatients[1].lastName}`,
        doctor: doctors[1]._id,  // Dr. Bensalem
        doctorName: doctors[1].name,
        date: new Date(today.getTime() + 10 * 60 * 60 * 1000), // 10:00 today
        duration: 30,
        reason: "متابعة مرض السكري / Diabetes Followup",
        notes: "فحص شامل ومراجعة الأدوية",
        status: "Pending"
      },
      {
        patient: appointmentPatients[2]._id,
        patientName: `${appointmentPatients[2].firstName} ${appointmentPatients[2].lastName}`,
        doctor: doctors[2]._id,  // Dr. Khelifi
        doctorName: doctors[2].name,
        date: new Date(today.getTime() + 14 * 60 * 60 * 1000), // 14:00 today
        duration: 30,
        reason: "الفحص الدوري / Routine Examination",
        notes: "متابعة الحالة الصحية العامة",
        status: "Confirmed"  // One appointment already confirmed
      }
    ];
    
    // Clear existing appointments (optional)
    await Appointment.deleteMany({});
    console.log('✅ Cleared existing appointments');
    
    // Insert new appointments
    const result = await Appointment.insertMany(appointmentsData);
    console.log(`\n✅ Seeded ${result.length} appointments successfully!\n`);
    
    // Display what was added
    result.forEach((apt, idx) => {
      const aptDate = new Date(apt.date);
      const timeStr = aptDate.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
      console.log(`   ${idx + 1}. ${apt.patientName}`);
      console.log(`      Doctor: ${apt.doctorName}`);
      console.log(`      Time: ${timeStr} | Status: ${apt.status}`);
      console.log(`      Reason: ${apt.reason}\n`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding appointments:', err.message);
    process.exit(1);
  }
}

seedAppointments();
