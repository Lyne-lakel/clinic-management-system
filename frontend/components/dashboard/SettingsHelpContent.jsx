'use client';

import { useState } from 'react';

export default function SettingsHelpContent({ onNotify }) {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    email: 'sarah.anderson@email.com',
    phone: '+1 (555) 123-4567',
    emergency: '+1 (555) 987-6543',
    conditions: [
      { name: 'Hypertension', since: '2020', medications: 'Lisinopril 10mg daily' },
      { name: 'Asthma', since: '2018', medications: 'Albuterol inhaler as needed' },
    ],
    allergies: [
      { name: 'Penicillin', reaction: 'Rash', medications: 'Use alternative antibiotics' },
      { name: 'Shellfish', reaction: 'Itching', medications: 'Avoid shellfish' },
    ],
    hereditaryConditions: [
      { name: 'Diabetes', familyMember: 'Mother', note: 'Type 2 diabetes' },
    ],
  });

  const [formData, setFormData] = useState(profileData);
  const [newCondition, setNewCondition] = useState('');
  const [newConditionMeds, setNewConditionMeds] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newAllergyMeds, setNewAllergyMeds] = useState('');
  const [newHereditaryCondition, setNewHereditaryCondition] = useState('');
  const [newHereditaryNote, setNewHereditaryNote] = useState('');

  const [appointmentReminders, setAppointmentReminders] = useState({
    oneWeek: true,
    oneDay: true,
    oneHour: false,
    fifteenMin: false,
  });

  const faqs = [
    {
      id: 1,
      question: 'How do I book an appointment?',
      answer: 'Navigate to the "Book Appointment" section, select your preferred doctor, date, and time slot. Confirm your appointment and you will receive a confirmation.',
    },
    {
      id: 2,
      question: 'Can I reschedule my appointment?',
      answer: 'Yes, you can reschedule your appointment up to 24 hours before the scheduled time. Go to your upcoming appointments and click the "Reschedule" option.',
    },
    {
      id: 3,
      question: 'How can I access my medical records?',
      answer: 'All your medical records are available in the "Consultation History" and "Old Records" sections. You can download or view them directly.',
    },
    {
      id: 4,
      question: 'Is my health data secure?',
      answer: 'Yes, all health data is encrypted and stored securely. We comply with HIPAA and healthcare data protection regulations.',
    },
    {
      id: 5,
      question: 'Can I upload personal medical documents?',
      answer: 'Yes, you can upload personal medical documents through the "Old Records" section by clicking the "Add File" button. You can include lab reports, prescriptions, vaccination records, and imaging scans with relevant notes.',
    },
    {
      id: 6,
      question: 'How do I update my allergy and condition information?',
      answer: 'Visit the "Settings & Help" page and click the "Edit" button on your Profile Information card. You can update your contact information, add new allergies and chronic conditions, or modify your emergency contact number.',
    },
    {
      id: 7,
      question: 'How can I control appointment reminder notifications?',
      answer: 'In Settings & Help, navigate to "Appointment Reminders" and toggle your preferred reminder timing options. You can receive reminders 1 week before, 1 day before, 1 hour before, or 15 minutes before your appointment via email.',
    },
  ];

  const contactMethods = [
    { title: 'Email Support', info: 'support@clinic.com' },
    { title: 'Phone Support', info: '+1 (555) 123-4567' },
    { title: 'Clinic Location', info: '123 Medical Plaza, Health City, HC 12345' },
  ];

  const handleSaveProfile = () => {
    setProfileData(formData);
    setIsEditingProfile(false);
    if (onNotify) onNotify('Profile updated successfully');
  };

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setFormData((prev) => ({
        ...prev,
        conditions: [
          ...prev.conditions,
          { name: newCondition, since: new Date().getFullYear().toString(), medications: newConditionMeds },
        ],
      }));
      setNewCondition('');
      setNewConditionMeds('');
    }
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setFormData((prev) => ({
        ...prev,
        allergies: [
          ...prev.allergies,
          { name: newAllergy, reaction: '', medications: newAllergyMeds },
        ],
      }));
      setNewAllergy('');
      setNewAllergyMeds('');
    }
  };

  const handleAddHereditaryCondition = () => {
    if (newHereditaryCondition.trim()) {
      setFormData((prev) => ({
        ...prev,
        hereditaryConditions: [
          ...prev.hereditaryConditions,
          { name: newHereditaryCondition, familyMember: '', note: newHereditaryNote },
        ],
      }));
      setNewHereditaryCondition('');
      setNewHereditaryNote('');
      if (onNotify) onNotify('Hereditary condition added');
    }
  };

  const handleReminder = (key) => {
    setAppointmentReminders((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings & Help</h1>
        <p className="text-base text-gray-600 mt-1">Manage your profile and preferences</p>
      </div>

      {/* Profile Information */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-base">Profile Information</h2>
          <button
            onClick={() => {
              setIsEditingProfile(!isEditingProfile);
              setFormData(profileData);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#1d4ed8] hover:bg-[#1d4ed8] text-white rounded-md transition-colors text-base font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
        </div>

        {!isEditingProfile ? (
          // View Mode
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                SA
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-lg">Sarah Anderson</p>
                <p className="text-base text-gray-600">Patient ID: #PA-89234</p>
                <p className="text-sm text-gray-500 mt-1">{profileData.email}</p>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                <p className="font-semibold text-gray-900 text-base">January 15, 1990</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                <p className="font-semibold text-gray-900 text-base">{profileData.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Emergency Number</p>
                <p className="font-semibold text-gray-900 text-base">{profileData.emergency}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Member Since</p>
                <p className="font-semibold text-gray-900 text-base">March 2022</p>
              </div>
            </div>

            <hr className="border-gray-200 my-4" />

            {/* Chronic Conditions */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-base">Chronic Conditions</h3>
              <div className="space-y-2">
                {profileData.conditions.map((condition, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 text-base">{condition.name}</p>
                    <p className="text-sm text-gray-600 mt-1">Since {condition.since}</p>
                    <p className="text-sm text-gray-700 mt-1">Medications: {condition.medications}</p>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-200 my-4" />

            {/* Allergies */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-base">Allergies</h3>
              <div className="space-y-2">
                {profileData.allergies.map((allergy, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 text-base">{allergy.name}</p>
                    <p className="text-sm text-gray-600 mt-1">Reaction: {allergy.reaction}</p>
                    <p className="text-sm text-gray-700 mt-1">Management: {allergy.medications}</p>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-200 my-4" />

            {/* Hereditary Conditions */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-base">Hereditary Conditions</h3>
              <div className="space-y-2">
                {profileData.hereditaryConditions.map((condition, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 text-base">{condition.name}</p>
                    {condition.familyMember && <p className="text-sm text-gray-600 mt-1">Family: {condition.familyMember}</p>}
                    {condition.note && <p className="text-sm text-gray-700 mt-1">Note: {condition.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
          <div className="p-6 space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-base font-semibold text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] text-base"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-900 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] text-base"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-900 mb-2">Emergency Number</label>
                <input
                  type="tel"
                  value={formData.emergency}
                  onChange={(e) => setFormData({ ...formData, emergency: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] text-base"
                />
              </div>

              <hr className="border-gray-200 my-4" />

              {/* Add Chronic Condition */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base">Add Chronic Condition</h3>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="Condition name"
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] text-base"
                  />
                  <button
                    type="button"
                    onClick={handleAddCondition}
                    className="px-4 py-2.5 bg-[#1d4ed8] hover:bg-[#1d4ed8] text-white rounded-lg transition-colors font-medium text-base"
                  >
                    Add
                  </button>
                </div>
                <input
                  type="text"
                  value={newConditionMeds}
                  onChange={(e) => setNewConditionMeds(e.target.value)}
                  placeholder="Medications taken"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] mb-3 text-base"
                />
                <div className="space-y-2">
                  {formData.conditions.map((condition, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded">
                      <p className="text-base text-gray-900 font-medium">{condition.name}</p>
                      <p className="text-sm text-gray-600">{condition.medications}</p>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-gray-200 my-4" />

              {/* Add Allergy */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base">Add Allergy</h3>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Allergy name"
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] text-base"
                  />
                  <button
                    type="button"
                    onClick={handleAddAllergy}
                    className="px-4 py-2.5 bg-[#1d4ed8] hover:bg-[#1d4ed8] text-white rounded-lg transition-colors font-medium text-base"
                  >
                    Add
                  </button>
                </div>
                <input
                  type="text"
                  value={newAllergyMeds}
                  onChange={(e) => setNewAllergyMeds(e.target.value)}
                  placeholder="Management/Medications"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] mb-3 text-base"
                />
                <div className="space-y-2">
                  {formData.allergies.map((allergy, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded">
                      <p className="text-base text-gray-900 font-medium">{allergy.name}</p>
                      <p className="text-sm text-gray-600">{allergy.medications}</p>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-gray-200 my-4" />

              {/* Add Hereditary Condition */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base">Add Hereditary Condition</h3>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newHereditaryCondition}
                    onChange={(e) => setNewHereditaryCondition(e.target.value)}
                    placeholder="Condition name"
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] text-base"
                  />
                  <button
                    type="button"
                    onClick={handleAddHereditaryCondition}
                    className="px-4 py-2.5 bg-[#1d4ed8] hover:bg-[#1d4ed8] text-white rounded-lg transition-colors font-medium text-base"
                  >
                    Add
                  </button>
                </div>
                <textarea
                  value={newHereditaryNote}
                  onChange={(e) => setNewHereditaryNote(e.target.value)}
                  placeholder="Additional details (family member, notes)"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] resize-none h-16 mb-3 text-base"
                />
                <div className="space-y-2">
                  {formData.hereditaryConditions.map((condition, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded">
                      <p className="text-base text-gray-900 font-medium">{condition.name}</p>
                      {condition.note && <p className="text-sm text-gray-600">{condition.note}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-gray-200 my-4" />

              <div className="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 px-4 py-3 bg-[#1d4ed8] hover:bg-[#1d4ed8] text-white rounded-lg transition-colors font-semibold text-base"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors font-semibold text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <h2 className="font-semibold text-gray-900 text-base">Appointment Reminders</h2>
          <p className="text-sm text-gray-600 mt-1">Reminders are sent via email to {profileData.email}</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-base font-medium text-gray-900">1 Week Before</label>
            <button
              onClick={() => handleReminder('oneWeek')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                appointmentReminders.oneWeek ? 'bg-[#1d4ed8]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  appointmentReminders.oneWeek ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-base font-medium text-gray-900">1 Day Before</label>
            <button
              onClick={() => handleReminder('oneDay')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                appointmentReminders.oneDay ? 'bg-[#1d4ed8]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  appointmentReminders.oneDay ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-base font-medium text-gray-900">1 Hour Before</label>
            <button
              onClick={() => handleReminder('oneHour')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                appointmentReminders.oneHour ? 'bg-[#1d4ed8]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  appointmentReminders.oneHour ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-base font-medium text-gray-900">15 Minutes Before</label>
            <button
              onClick={() => handleReminder('fifteenMin')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                appointmentReminders.fifteenMin ? 'bg-[#1d4ed8]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  appointmentReminders.fifteenMin ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <h2 className="font-semibold text-gray-900 text-base">Frequently Asked Questions</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {faqs.map((faq) => (
            <div key={faq.id} className="border-none">
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="w-full p-4 hover:bg-gray-50 transition-colors text-left flex items-center justify-between"
              >
                <span className="font-medium text-gray-900 text-base">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    expandedFaq === faq.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {expandedFaq === faq.id && (
                <div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-base text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contactMethods.map((method, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-5"
          >
            <h3 className="font-semibold text-gray-900 text-base">{method.title}</h3>
            <p className="text-gray-600 text-base mt-2">{method.info}</p>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="flex justify-center pt-4">
        <button className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors text-base">
          Logout
        </button>
      </div>
    </div>
  );
}
