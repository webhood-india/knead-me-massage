// Run with: node utils/seedServices.js
// Populates the Service collection with the clinic's real treatments & pricing
// (from the client's supplied price list PDF).
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Service = require('../models/Service');

const services = [
  {
    name: 'Deep Tissue Massage',
    category: 'Deep Tissue',
    shortDescription: 'Targets chronic muscle tension and pain.',
    description:
      'Targets deeper layers of muscle tissue to relieve chronic tension and muscle pain using firm, focused pressure.',
    benefits: [
      'Releases chronic muscle knots and adhesions',
      'Reduces inflammation and scar tissue',
      'Improves posture and alignment',
      'Effective for chronic back and neck pain',
    ],
    durationOptions: [
      { duration: 30, price: 80 },
      { duration: 45, price: 100 },
      { duration: 60, price: 120 },
    ],
    order: 1,
  },
  {
    name: 'Swedish Massage',
    category: 'Swedish',
    shortDescription: 'Promotes relaxation and circulation.',
    description: 'Gentle flowing strokes that reduce muscle tension and improve circulation while promoting deep relaxation.',
    benefits: [
      'Reduces stress and anxiety levels',
      'Improves blood and lymph circulation',
      'Enhances overall sense of wellbeing',
      'Gentle yet effective therapeutic approach',
    ],
    durationOptions: [
      { duration: 45, price: 100 },
      { duration: 60, price: 120 },
    ],
    order: 2,
  },
  {
    name: 'Sports Massage',
    category: 'Sports',
    shortDescription: 'Optimises athletic performance and recovery.',
    description: 'Designed for athletes to prevent injuries and enhance performance and recovery.',
    benefits: [
      'Prevents and treats sports injuries',
      'Accelerates recovery between training sessions',
      'Enhances flexibility and performance',
      'Reduces muscle soreness and fatigue',
    ],
    durationOptions: [
      { duration: 30, price: 80 },
      { duration: 60, price: 120 },
    ],
    order: 3,
  },
  {
    name: 'Relaxation Massage',
    category: 'Relaxation',
    shortDescription: 'Deep relaxation and stress relief.',
    description: 'A calming, therapeutic massage designed to reduce stress and promote deep relaxation.',
    benefits: [
      'Calms nervous system and reduces anxiety',
      'Promotes mental clarity and focus',
      'Improves sleep quality and duration',
      'Balances emotional and physical wellbeing',
    ],
    durationOptions: [{ duration: 60, price: 120 }],
    order: 4,
  },
  {
    name: 'Anti-Migraine Massage',
    category: 'Specialist',
    shortDescription: 'Targeted relief for migraine and tension headaches.',
    description: 'Focused therapeutic technique to relieve tension patterns that contribute to migraines and headaches.',
    benefits: ['Reduces headache frequency', 'Relieves neck and shoulder tension', 'Improves circulation to the head and neck'],
    durationOptions: [{ duration: 30, price: 80 }],
    order: 5,
  },
  {
    name: 'Indian Head Massage',
    category: 'Specialist',
    shortDescription: 'Traditional massage for head, neck and shoulders.',
    description: 'A traditional therapeutic massage focusing on the head, neck and shoulders.',
    benefits: ['Relieves tension headaches', 'Improves scalp circulation', 'Deeply relaxing'],
    durationOptions: [{ duration: 30, price: 80 }],
    order: 6,
  },
  {
    name: 'Foot Massage',
    category: 'Specialist',
    shortDescription: 'Reflexology-inspired foot treatment.',
    description: 'A therapeutic foot massage to relieve tension and improve circulation.',
    benefits: ['Relieves foot and ankle tension', 'Improves circulation', 'Deeply relaxing'],
    durationOptions: [{ duration: 30, price: 80 }],
    order: 7,
  },
  {
    name: 'Sciatica Massage',
    category: 'Specialist',
    shortDescription: 'Targeted relief for sciatic nerve pain.',
    description: 'A targeted therapeutic massage to relieve sciatic nerve pain and lower back tension.',
    benefits: ['Reduces sciatic nerve pain', 'Relieves lower back tension', 'Improves mobility'],
    durationOptions: [
      { duration: 30, price: 80 },
      { duration: 45, price: 100 },
      { duration: 60, price: 120 },
    ],
    order: 8,
  },
  {
    name: 'Back & Shoulder Massage',
    category: 'Specialist',
    shortDescription: 'Focused relief for back and shoulder tension.',
    description: 'A focused therapeutic massage targeting back and shoulder tension.',
    benefits: ['Relieves back and shoulder tension', 'Improves posture', 'Reduces stiffness'],
    durationOptions: [
      { duration: 30, price: 80 },
      { duration: 45, price: 100 },
      { duration: 60, price: 120 },
    ],
    order: 9,
  },
  {
    name: 'Pre-Natal Massage',
    category: 'Specialist',
    shortDescription: 'Gentle, safe massage for expectant mothers.',
    description: 'A gentle, pregnancy-safe massage to relieve common discomforts of pregnancy.',
    benefits: ['Reduces pregnancy-related discomfort', 'Improves circulation', 'Promotes relaxation'],
    durationOptions: [
      { duration: 45, price: 100 },
      { duration: 60, price: 120 },
    ],
    order: 10,
  },
  {
    name: 'Anti-Cellulite Massage',
    category: 'Specialist',
    shortDescription: 'Targeted treatment to improve skin texture.',
    description: 'A targeted therapeutic massage technique designed to improve skin texture and circulation.',
    benefits: ['Improves circulation', 'Supports lymphatic drainage', 'Improves skin texture'],
    durationOptions: [{ duration: 60, price: 120 }],
    order: 11,
  },
  {
    name: 'Manual Lymphatic Drainage',
    category: 'Recovery',
    shortDescription: 'Gentle technique to support lymphatic flow.',
    description: 'A gentle, rhythmic technique that encourages the natural drainage of the lymph.',
    benefits: ['Reduces swelling', 'Supports immune function', 'Promotes detoxification'],
    durationOptions: [{ duration: 60, price: 120 }],
    order: 12,
  },
  {
    name: 'Anti-Stress Massage',
    category: 'Stress Relief',
    shortDescription: 'Comprehensive treatment for stress relief.',
    description: 'A comprehensive treatment to alleviate mental and physical stress symptoms.',
    benefits: ['Lowers cortisol levels', 'Promotes relaxation', 'Improves mental clarity'],
    durationOptions: [{ duration: 60, price: 120 }],
    order: 13,
  },
  {
    name: 'Back & Indian Head Massage',
    category: 'Specialist',
    shortDescription: 'Combination treatment for back, neck and head.',
    description: 'A combination treatment covering the back, neck and head.',
    benefits: ['Full upper-body tension relief', 'Deeply relaxing', 'Improves circulation'],
    durationOptions: [{ duration: 60, price: 120 }],
    order: 14,
  },
  {
    name: 'Back & Sciatica Massage',
    category: 'Specialist',
    shortDescription: 'Combined treatment for back pain and sciatica.',
    description: 'A combined therapeutic treatment addressing both general back tension and sciatic pain.',
    benefits: ['Relieves back tension', 'Reduces sciatic pain', 'Improves mobility'],
    durationOptions: [{ duration: 60, price: 120 }],
    order: 15,
  },
  {
    name: 'Combination Massage',
    category: 'Specialist',
    shortDescription: 'Fully customisable multi-technique treatment.',
    description: 'A fully customisable treatment combining multiple massage techniques to suit your needs.',
    benefits: ['Tailored to your needs', 'Combines multiple techniques', 'Comprehensive relief'],
    durationOptions: [
      { duration: 60, price: 120 },
      { duration: 75, price: 160 },
    ],
    order: 16,
  },
  {
    name: 'Knead Me Relax Massage',
    category: 'Relaxation',
    shortDescription: 'Our signature full relaxation experience.',
    description: 'Our signature relaxation treatment, combining the best of our therapeutic techniques.',
    benefits: ['Signature Knead Me technique', 'Full body relaxation', 'Deeply restorative'],
    durationOptions: [
      { duration: 60, price: 120 },
      { duration: 75, price: 160 },
    ],
    order: 17,
  },
];

const run = async () => {
  await connectDB();
  await Service.deleteMany({});
  await Service.insertMany(services);
  console.log(`Seeded ${services.length} treatments.`);
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
