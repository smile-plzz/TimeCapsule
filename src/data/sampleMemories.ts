import type { Memory } from '../lib/types';

export const sampleMemories: Memory[] = [
  // August 5 across years (core UVP demo)
  { id: '1', date: '2009-08-05', year: 2009, month: 8, day: 5, type: 'photo', title: 'First digital camera photo', text: 'Just got my first digital camera!', location: 'Dhaka', mood: 'excited', tags: ['photo', 'camera'] },
  { id: '2', date: '2011-08-05', year: 2011, month: 8, day: 5, type: 'status', text: 'Exam results day... nervous!', mood: 'quiet', tags: ['exam'] },
  { id: '3', date: '2014-08-05', year: 2014, month: 8, day: 5, type: 'photo', title: 'Birthday celebration', text: 'Happy birthday to me! 🎂', location: 'Dhaka', people: ['Family'], mood: 'celebration', tags: ['birthday'] },
  { id: '4', date: '2017-08-05', year: 2017, month: 8, day: 5, type: 'checkin', title: "Trip to Cox's Bazar", text: 'Waves and sunshine ☀️', location: "Cox's Bazar", mood: 'happy', tags: ['travel', 'beach'] },
  { id: '5', date: '2020-08-05', year: 2020, month: 8, day: 5, type: 'status', text: 'Another day in lockdown. Missing everyone.', mood: 'sad', tags: ['covid', 'lockdown'] },
  { id: '6', date: '2023-08-05', year: 2023, month: 8, day: 5, type: 'photo', title: 'Concert night', text: 'Amazing live music!', location: 'Dhaka', people: ['Friends'], mood: 'excited', tags: ['music', 'concert'] },
  { id: '7', date: '2025-08-05', year: 2025, month: 8, day: 5, type: 'photo', title: 'Wedding day memories', text: 'The best day of our lives 💍', location: 'Dhaka', people: ['Spouse', 'Family'], mood: 'celebration', tags: ['wedding'] },

  // More birthdays
  { id: '8', date: '2015-08-05', year: 2015, month: 8, day: 5, type: 'photo', title: 'University birthday', text: 'Cake with friends on campus', location: 'University', mood: 'happy', tags: ['birthday', 'university'] },
  { id: '9', date: '2018-08-05', year: 2018, month: 8, day: 5, type: 'status', text: 'Another year wiser (hopefully)', mood: 'happy', tags: ['birthday'] },
  { id: '10', date: '2021-08-05', year: 2021, month: 8, day: 5, type: 'photo', title: 'Quiet birthday at home', text: 'Simple celebrations are the best', mood: 'quiet', tags: ['birthday'] },

  // Other dates for heatmap + search variety
  { id: '11', date: '2016-01-01', year: 2016, month: 1, day: 1, type: 'status', text: 'Happy New Year! Resolutions time.', mood: 'excited', tags: ['newyear'] },
  { id: '12', date: '2019-01-01', year: 2019, month: 1, day: 1, type: 'photo', title: 'New Year party', location: 'Dhaka', mood: 'celebration', tags: ['newyear'] },
  { id: '13', date: '2022-01-01', year: 2022, month: 1, day: 1, type: 'status', text: '2022, be kind to us.', mood: 'quiet', tags: ['newyear'] },
  { id: '14', date: '2017-06-15', year: 2017, month: 6, day: 15, type: 'checkin', title: 'Eid Mubarak', location: 'Home', mood: 'celebration', tags: ['eid'] },
  { id: '15', date: '2018-06-15', year: 2018, month: 6, day: 15, type: 'photo', title: 'Eid with family', location: 'Dhaka', people: ['Family'], mood: 'happy', tags: ['eid'] },
  { id: '16', date: '2019-12-25', year: 2019, month: 12, day: 25, type: 'status', text: 'Merry Christmas everyone!', mood: 'happy', tags: ['christmas'] },
  { id: '17', date: '2016-03-20', year: 2016, month: 3, day: 20, type: 'status', text: 'University admission results out!', mood: 'excited', tags: ['university', 'exam'] },
  { id: '18', date: '2018-07-10', year: 2018, month: 7, day: 10, type: 'photo', title: 'Graduation day', location: 'University', people: ['Friends', 'Family'], mood: 'celebration', tags: ['graduation', 'convocation'] },
  { id: '19', date: '2021-09-01', year: 2021, month: 9, day: 1, type: 'status', text: 'First day at the new job!', mood: 'excited', tags: ['job', 'career'] },
  { id: '20', date: '2019-04-12', year: 2019, month: 4, day: 12, type: 'photo', title: 'Japan trip - Tokyo', text: 'Cherry blossoms everywhere 🌸', location: 'Tokyo, Japan', mood: 'happy', tags: ['travel', 'japan'] },
  { id: '21', date: '2019-04-15', year: 2019, month: 4, day: 15, type: 'photo', title: 'Kyoto temples', location: 'Kyoto, Japan', mood: 'quiet', tags: ['travel', 'japan'] },
  { id: '22', date: '2024-02-14', year: 2024, month: 2, day: 14, type: 'status', text: "Happy Valentine's Day ❤️", mood: 'happy', tags: ['valentine'] },
  { id: '23', date: '2015-11-20', year: 2015, month: 11, day: 20, type: 'status', text: 'Rainy day and coffee ☕', location: 'Dhaka', mood: 'quiet', tags: ['rain', 'coffee'] },
  { id: '24', date: '2022-05-08', year: 2022, month: 5, day: 8, type: 'photo', title: 'Cat adopted!', text: 'Meet the newest family member 🐱', mood: 'happy', tags: ['cat', 'pet'] },
  { id: '25', date: '2017-08-20', year: 2017, month: 8, day: 20, type: 'status', text: 'University life is intense but amazing', mood: 'excited', tags: ['university'] },
];

export const COLLECTIONS = [
  { id: 'birthdays', name: 'My Birthdays', emoji: '🎂', filter: (m: Memory) => m.tags?.includes('birthday') || (m.month === 8 && m.day === 5) },
  { id: 'eids', name: 'My Eids', emoji: '🌙', filter: (m: Memory) => m.tags?.includes('eid') },
  { id: 'newyears', name: "My New Year's", emoji: '🎆', filter: (m: Memory) => m.tags?.includes('newyear') || (m.month === 1 && m.day === 1) },
  { id: 'valentines', name: "My Valentine's Days", emoji: '💝', filter: (m: Memory) => m.tags?.includes('valentine') || (m.month === 2 && m.day === 14) },
  { id: 'travels', name: 'My Vacations', emoji: '✈️', filter: (m: Memory) => m.tags?.includes('travel') || m.type === 'checkin' },
  { id: 'graduations', name: 'My Convocations', emoji: '🎓', filter: (m: Memory) => m.tags?.includes('graduation') || m.tags?.includes('convocation') },
];
