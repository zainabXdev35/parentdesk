// ─────────────────────────────────────────────────────────────
// Shared demo data for ALL three portals (admin, teacher, parent).
// The teacher module's roster is the single source of truth; admin and
// parent views are derived from it, so every change stays in sync.
// Each collection maps to a future REST endpoint (see README).
// ─────────────────────────────────────────────────────────────
export const pkr = (n) => 'PKR ' + Number(n).toLocaleString('en-US');

export const SCHOOL = 'Bright Future School, Lahore';
export const TODAY = 23;                         // demo "today" (day of November 2026)
export const TODAY_LABEL = 'Monday, 23 November 2026';
export const TEACHER = { name: 'Ayesha Khan', subject: 'Mathematics' };
export const avgOf = (s) => Math.round((s.quiz1 + s.midterm) / 2);

const INITIAL_CLASSES_RAW = [
  {
    id: 'Class 8-A',
    room: 'Room 12',
    submittedToday: true,
    isEditing: false,
    students: [
      {
        id: '8A-1',
        roll: 1,
        initials: 'SA',
        avatarBg: 'bg-teal-500',
        name: 'Sara Ahmed',
        parent: 'Mr. Ahmed',
        phone: '+92 300 4128901',
        status: 'Present',
        absences: 0,
        quiz1: 88,
        midterm: 90,
        commentStatus: 'approved',
        commentText:
          'Sara demonstrates exceptional consistency in Mathematics (89% average) with 100% attendance. Her analytical clarity and leadership in class set a wonderful benchmark.'
      },
      {
        id: '8A-2',
        roll: 2,
        initials: 'ZM',
        avatarBg: 'bg-teal-600',
        name: 'Zoya Malik',
        parent: 'Mr. Tariq Malik',
        phone: '+92 321 8451209',
        status: 'Absent',
        absences: 3,
        quiz1: 60,
        midterm: 64,
        commentStatus: 'approved',
        commentText:
          'Zoya shows strong potential in algebra (62% average), though 3 recent absences have slowed her momentum. Regular attendance and short daily revision will lift her score quickly.'
      },
      {
        id: '8A-3',
        roll: 3,
        initials: 'HB',
        avatarBg: 'bg-sky-500',
        name: 'Hamza Butt',
        parent: 'Mr. Nadeem Butt',
        phone: '+92 333 4901122',
        status: 'Present',
        absences: 1,
        quiz1: 76,
        midterm: 78,
        commentStatus: 'none',
        commentText: ''
      },
      {
        id: '8A-4',
        roll: 4,
        initials: 'MA',
        avatarBg: 'bg-indigo-500',
        name: 'Minahil Ali',
        parent: 'Mrs. Rabia Ali',
        phone: '+92 301 7765432',
        status: 'Present',
        absences: 0,
        quiz1: 82,
        midterm: 84,
        commentStatus: 'none',
        commentText: ''
      },
      {
        id: '8A-5',
        roll: 5,
        initials: 'DS',
        avatarBg: 'bg-emerald-500',
        name: 'Daniyal Sheikh',
        parent: 'Mr. Imran Sheikh',
        phone: '+92 345 9981234',
        status: 'Present',
        absences: 1,
        quiz1: 71,
        midterm: 69,
        commentStatus: 'none',
        commentText: ''
      },
      {
        id: '8A-6',
        roll: 6,
        initials: 'UR',
        avatarBg: 'bg-indigo-400',
        name: 'Usman Raza',
        parent: 'Mr. Raza',
        phone: '+92 312 6543210',
        status: 'Absent',
        absences: 3,
        quiz1: 50,
        midterm: 48,
        commentStatus: 'review',
        commentText:
          "Usman's results (49% average) show gaps in a few key topics. A short daily practice routine at home would make a real difference. Usman has missed 3 recent classes; regular attendance will help keep progress steady."
      },
      {
        id: '8A-7',
        roll: 7,
        initials: 'HF',
        avatarBg: 'bg-cyan-600',
        name: 'Hira Farooq',
        parent: 'Dr. Farooq',
        phone: '+92 300 9876543',
        status: 'Present',
        absences: 0,
        quiz1: 85,
        midterm: 83,
        commentStatus: 'none',
        commentText: ''
      },
      {
        id: '8A-8',
        roll: 8,
        initials: 'BK',
        avatarBg: 'bg-teal-500',
        name: 'Bilal Kamran',
        parent: 'Mr. Kamran',
        phone: '+92 332 1122334',
        status: 'Present',
        absences: 1,
        quiz1: 72,
        midterm: 70,
        commentStatus: 'none',
        commentText: ''
      }
    ]
  },
  {
    id: 'Class 9-B',
    room: 'Room 7',
    submittedToday: false,
    isEditing: true,
    students: [
      {
        id: '9B-1',
        roll: 1,
        initials: 'AK',
        avatarBg: 'bg-indigo-400',
        name: 'Areeba Khan',
        parent: 'Mr. Faisal Khan',
        phone: '+92 300 5511223',
        status: 'Present',
        absences: 0,
        quiz1: 84,
        midterm: 82,
        commentStatus: 'review',
        commentText:
          'Areeba has maintained 100% attendance and achieved an 83% average across Quiz 1 and Midterm. Her structured problem-solving approach is commendable.'
      },
      {
        id: '9B-2',
        roll: 2,
        initials: 'FB',
        avatarBg: 'bg-teal-500',
        name: 'Fahad Butt',
        parent: 'Mr. Javed Butt',
        phone: '+92 321 6677889',
        status: 'Present',
        absences: 1,
        quiz1: 74,
        midterm: 72,
        commentStatus: 'none',
        commentText: ''
      },
      {
        id: '9B-3',
        roll: 3,
        initials: 'NF',
        avatarBg: 'bg-sky-500',
        name: 'Noor Fatima',
        parent: 'Mrs. Saima Fatima',
        phone: '+92 333 7788990',
        status: 'Present',
        absences: 0,
        quiz1: 89,
        midterm: 87,
        commentStatus: 'none',
        commentText: ''
      },
      {
        id: '9B-4',
        roll: 4,
        initials: 'IC',
        avatarBg: 'bg-sky-500',
        name: 'Ibrahim Chaudhry',
        parent: 'Mr. Tariq Chaudhry',
        phone: '+92 301 9988776',
        status: 'Absent',
        absences: 3,
        quiz1: 56,
        midterm: 54,
        commentStatus: 'none',
        commentText: ''
      },
      {
        id: '9B-5',
        roll: 5,
        initials: 'LN',
        avatarBg: 'bg-emerald-500',
        name: 'Laiba Nadeem',
        parent: 'Mr. Nadeem Akhtar',
        phone: '+92 345 1122998',
        status: 'Present',
        absences: 0,
        quiz1: 79,
        midterm: 77,
        commentStatus: 'none',
        commentText: ''
      },
      {
        id: '9B-6',
        roll: 6,
        initials: 'TM',
        avatarBg: 'bg-emerald-500',
        name: 'Talha Mehmood',
        parent: 'Mr. Khalid Mehmood',
        phone: '+92 312 3344556',
        status: 'Present',
        absences: 0,
        quiz1: 71,
        midterm: 69,
        commentStatus: 'none',
        commentText: ''
      },
      {
        id: '9B-7',
        roll: 7,
        initials: 'EZ',
        avatarBg: 'bg-teal-500',
        name: 'Eman Zafar',
        parent: 'Mr. Zafar Iqbal',
        phone: '+92 300 6655443',
        status: 'Present',
        absences: 1,
        quiz1: 68,
        midterm: 66,
        commentStatus: 'none',
        commentText: ''
      },
      {
        id: '9B-8',
        roll: 8,
        initials: 'RS',
        avatarBg: 'bg-cyan-600',
        name: 'Rayyan Siddiqui',
        parent: 'Mr. Asim Siddiqui',
        phone: '+92 332 8899001',
        status: 'Present',
        absences: 2,
        quiz1: 65,
        midterm: 67,
        commentStatus: 'none',
        commentText: ''
      }
    ]
  },
  {
    id: 'Class 10-A',
    room: 'Room 3',
    submittedToday: false,
    isEditing: true,
    students: [
      {
        id: '10A-1',
        roll: 1,
        initials: 'MA',
        avatarBg: 'bg-teal-500',
        name: 'Maryam Azhar',
        parent: 'Mr. Azhar Mahmood',
        phone: '+92 300 1239876',
        status: 'Present',
        absences: 0,
        quiz1: 91,
        midterm: 92,
        commentStatus: 'none',
        commentText: ''
      },
      {
        id: '10A-2',
        roll: 2,
        initials: 'HA',
        avatarBg: 'bg-indigo-500',
        name: 'Hamza Abbas',
        parent: 'Mr. Abbas Haider',
        phone: '+92 321 4561230',
        status: 'Present',
        absences: 1,
        quiz1: 75,
        midterm: 74,
        commentStatus: 'none',
        commentText: ''
      },
      {
        id: '10A-3',
        roll: 3,
        initials: 'ZK',
        avatarBg: 'bg-sky-500',
        name: 'Zainab Khalid',
        parent: 'Dr. Khalid Pervaiz',
        phone: '+92 333 7894561',
        status: 'Present',
        absences: 0,
        quiz1: 83,
        midterm: 85,
        commentStatus: 'none',
        commentText: ''
      },
      {
        id: '10A-4',
        roll: 4,
        initials: 'OA',
        avatarBg: 'bg-emerald-500',
        name: 'Omer Arshad',
        parent: 'Mr. Arshad Ali',
        phone: '+92 301 3216549',
        status: 'Present',
        absences: 2,
        quiz1: 64,
        midterm: 63,
        commentStatus: 'none',
        commentText: ''
      },
      {
        id: '10A-5',
        roll: 5,
        initials: 'AN',
        avatarBg: 'bg-cyan-600',
        name: 'Amina Nasir',
        parent: 'Mrs. Nasir',
        phone: '+92 345 6549873',
        status: 'Present',
        absences: 0,
        quiz1: 78,
        midterm: 79,
        commentStatus: 'none',
        commentText: ''
      },
      {
        id: '10A-6',
        roll: 6,
        initials: 'SH',
        avatarBg: 'bg-indigo-400',
        name: 'Saad Hussain',
        parent: 'Mr. Hussain Shah',
        phone: '+92 312 9873216',
        status: 'Present',
        absences: 1,
        quiz1: 69,
        midterm: 68,
        commentStatus: 'none',
        commentText: ''
      },
      {
        id: '10A-7',
        roll: 7,
        initials: 'FN',
        avatarBg: 'bg-teal-600',
        name: 'Fatima Nawaz',
        parent: 'Mr. Nawaz Sharif',
        phone: '+92 300 1472583',
        status: 'Present',
        absences: 0,
        quiz1: 66,
        midterm: 67,
        commentStatus: 'none',
        commentText: ''
      },
      {
        id: '10A-8',
        roll: 8,
        initials: 'TR',
        avatarBg: 'bg-sky-600',
        name: 'Taha Rehman',
        parent: 'Mr. Rehman',
        phone: '+92 332 3692581',
        status: 'Present',
        absences: 1,
        quiz1: 60,
        midterm: 61,
        commentStatus: 'none',
        commentText: ''
      }
    ]
  }
];

const INITIAL_AUTOMATION_LOGS = [
  {
    id: 'log-1',
    type: 'alert',
    text: 'Absence alert sent to parent of Zoya Malik (WhatsApp)',
    time: '08:12'
  },
  {
    id: 'log-2',
    type: 'alert',
    text: 'Absence alert sent to parent of Usman Raza (WhatsApp)',
    time: '08:12'
  },
  {
    id: 'log-3',
    type: 'flag',
    text: 'Flagged to admin: Usman Raza and Zoya Malik reached 3 absences',
    time: '08:12'
  }
];

// ── Attendance history: day-of-month → 'A' (absent) | 'L' (late) | 'P' (present).
// Un-recorded past weekdays are treated as present. Teachers write today's entry.
const POOL = [3, 4, 5, 6, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20];
function seedHistory(s, submitted) {
  const h = {};
  const n = submitted && s.status === 'Absent' ? s.absences - 1 : s.absences;
  const off = (s.roll * 3 + s.id.length * 5) % POOL.length;
  for (let i = 0; i < n; i++) h[POOL[(off + i * 3) % POOL.length]] = 'A';
  if (submitted) h[TODAY] = s.status === 'Absent' ? 'A' : s.status === 'Late' ? 'L' : 'P';
  return h;
}

// Link students to parent accounts. Eman (9B-7) is re-labelled as Zoya's sibling so the
// demo parent login (Mr. Tariq Malik) has two children in two different classes.
const classesSeed = INITIAL_CLASSES_RAW.map((c) => ({
  ...c,
  students: c.students.map((s0) => {
    const s = s0.id === '9B-7'
      ? { ...s0, name: 'Eman Malik', initials: 'EM', parent: 'Mr. Tariq Malik', phone: '+92 321 8451209' }
      : s0;
    const parentId = s.id === '8A-2' || s.id === '9B-7' ? 'p-malik' : 'p-' + s.id;
    return { ...s, parentId, draftVariant: 0, history: seedHistory(s, c.submittedToday) };
  }),
}));

const flat = classesSeed.flatMap((c) => c.students.map((s) => ({ ...s, classId: c.id })));
const FEE = { 'Class 8-A': 20000, 'Class 9-B': 21500, 'Class 10-A': 23000 };
const OVERDUE = ['8A-2', '8A-6', '9B-4', '10A-4'];
const PENDING = ['8A-3', '9B-2', '10A-6'];

const invoicesSeed = [
  ...flat.map((s, i) => {
    const status = OVERDUE.includes(s.id) ? 'overdue' : PENDING.includes(s.id) ? 'pending' : 'paid';
    return { id: 'INV-' + (1101 + i), studentId: s.id, term: 'November 2026', amount: FEE[s.classId],
      due: status === 'pending' ? '30 Nov 2026' : '10 Nov 2026', status,
      ...(status === 'paid' ? { paidOn: `0${(i % 8) + 1} Nov 2026` } : {}) };
  }),
  { id: 'INV-1050', studentId: '8A-2', term: 'October 2026', amount: 20000, due: '10 Oct 2026', status: 'paid', paidOn: '08 Oct 2026' },
  { id: 'INV-0988', studentId: '8A-2', term: 'Annual Charges 2026', amount: 12000, due: '15 Aug 2026', status: 'paid', paidOn: '12 Aug 2026' },
  { id: 'INV-1051', studentId: '9B-7', term: 'October 2026', amount: 21500, due: '10 Oct 2026', status: 'paid', paidOn: '10 Oct 2026' },
];

const remindersSeed = OVERDUE.map((id, i) => {
  const s = flat.find((x) => x.id === id);
  const amount = FEE[s.classId];
  return { id: 'r' + (i + 1), studentId: id, student: s.name, parent: s.parent, amount, days: 13,
    channel: ['WhatsApp', 'SMS', 'Email', 'WhatsApp'][i], status: 'pending',
    draft: `Assalam-o-Alaikum ${s.parent}, this is a gentle reminder that the November fee of ${pkr(amount)} for ${s.name} (${s.classId}) was due on 10 Nov. Kindly clear it at your earliest convenience. JazakAllah, Bright Future School.` };
});

const ticketsSeed = [
  { id: 'T-204', studentId: '8A-5', parent: 'Mr. Imran Sheikh', child: 'Daniyal Sheikh', channel: 'Chatbot', date: '22 Nov, 6:40 PM', status: 'open', question: 'Can my son move from Class 8-A to 8-B next term? His friends are in that section.', note: 'No matching document found.' },
  { id: 'T-203', studentId: '8A-4', parent: 'Mrs. Rabia Ali', child: 'Minahil Ali', channel: 'Chatbot', date: '22 Nov, 11:05 AM', status: 'open', question: 'Is there a sibling discount if my younger daughter joins in January?', note: 'Fee policy has no sibling clause.' },
  { id: 'T-201', studentId: '9B-6', parent: 'Mr. Khalid Mehmood', child: 'Talha Mehmood', channel: 'Chatbot', date: '21 Nov, 9:12 AM', status: 'open', question: 'My son needs a character certificate. What is the procedure?', note: 'Low retrieval confidence (0.41).' },
  { id: 'T-198', studentId: '8A-3', parent: 'Mr. Nadeem Butt', child: 'Hamza Butt', channel: 'Chatbot', date: '19 Nov, 4:30 PM', status: 'resolved', question: 'Is the school open on 9 November (Iqbal Day)?', note: 'Replied by Admin.', reply: 'The school is closed on 9 November for Iqbal Day.' },
];

const notificationsSeed = [
  { id: 'n1', type: 'absence', channel: 'WhatsApp', date: '23 Nov', title: 'Absence alert', body: 'Zoya was marked absent today. This is her 3rd absence; the school administration has been notified.', studentId: '8A-2', unread: true },
  { id: 'n2', type: 'fee', channel: 'WhatsApp', date: '18 Nov', title: 'Fee reminder', body: 'November fee of PKR 20,000 for Zoya is overdue.', studentId: '8A-2', unread: true },
  { id: 'n3', type: 'result', channel: 'Email', date: '20 Nov', title: 'Teacher comment', body: 'A new comment from Ayesha Khan about Zoya is available.', studentId: '8A-2', unread: false },
  { id: 'n4', type: 'notice', channel: 'Email', date: '03 Nov', title: 'Circular: Winter timetable', body: 'School timings change to 8:30 AM – 2:00 PM from Monday.', studentId: null, unread: false },
  { id: 'n5', type: 'notice', channel: 'WhatsApp', date: '18 Nov', title: 'Parent–teacher meeting', body: 'PTM is scheduled for Saturday 28 November, 10 AM.', studentId: null, unread: false },
];

const auditSeed = [
  { id: 'a1', time: '23 Nov, 08:12', user: 'n8n workflow', action: 'Sent 2 absence alerts', target: 'Class 8-A' },
  { id: 'a2', time: '23 Nov, 08:12', user: 'System', action: 'Flagged 3+ absences', target: 'Zoya Malik, Usman Raza' },
  { id: 'a3', time: '23 Nov, 08:00', user: 'n8n workflow', action: 'Drafted 4 fee reminders', target: 'Daily schedule' },
  { id: 'a4', time: '22 Nov, 17:45', user: 'Sana Rehman (Admin)', action: 'Uploaded document', target: 'Winter Timetable 2026.pdf' },
  { id: 'a5', time: '22 Nov, 14:20', user: 'Ayesha Khan (Teacher)', action: 'Approved AI comment', target: 'Sara Ahmed' },
  { id: 'a6', time: '21 Nov, 10:02', user: 'Sana Rehman (Admin)', action: 'Imported student CSV', target: '24 rows' },
  { id: 'a7', time: '20 Nov, 16:10', user: 'Sana Rehman (Admin)', action: 'Resolved ticket', target: 'T-198' },
  { id: 'a8', time: '20 Nov, 09:00', user: 'Tariq Malik (Parent)', action: 'Logged in', target: '—' },
];

// Fresh deep copy of everything the shared store manages.
export const makeInitialData = () => structuredClone({
  classes: classesSeed, invoices: invoicesSeed, reminders: remindersSeed, tickets: ticketsSeed,
  notifications: notificationsSeed, audit: auditSeed, automationLogs: INITIAL_AUTOMATION_LOGS,
});

// ── Static (not shared/mutated) demo content ──
export const feeTrend = [
  { m: 'Jun', collected: 3.1, pending: 0.6 }, { m: 'Jul', collected: 3.4, pending: 0.5 },
  { m: 'Aug', collected: 4.6, pending: 0.9 }, { m: 'Sep', collected: 3.6, pending: 0.5 },
  { m: 'Oct', collected: 3.7, pending: 0.4 }, { m: 'Nov', collected: 3.2, pending: 0.9 },
];
export const attTrend = [
  { w: 'Wk 1', pct: 94 }, { w: 'Wk 2', pct: 92 }, { w: 'Wk 3', pct: 95 }, { w: 'Wk 4', pct: 91 },
  { w: 'Wk 5', pct: 93 }, { w: 'Wk 6', pct: 90 }, { w: 'Wk 7', pct: 94 },
];

export const documents = [
  { id: 'd1', name: 'Student Handbook 2026.pdf', type: 'Handbook', size: '2.4 MB', date: '03 Aug 2026', status: 'Ready', chunks: 148 },
  { id: 'd2', name: 'Fee Policy & Late Charges.pdf', type: 'Policy', size: '420 KB', date: '03 Aug 2026', status: 'Ready', chunks: 22 },
  { id: 'd3', name: 'Winter Timetable 2026.pdf', type: 'Timetable', size: '310 KB', date: '28 Oct 2026', status: 'Ready', chunks: 18 },
  { id: 'd4', name: 'Annual Calendar 2026-27.pdf', type: 'Calendar', size: '1.1 MB', date: '15 Aug 2026', status: 'Ready', chunks: 41 },
];

// Very small stand-in for the RAG pipeline so the chat UI can be demoed.
export const knowledge = [
  { keys: ['fee', 'due', 'kab', 'paisay', 'tuition'], source: 'Fee Policy & Late Charges.pdf · p.2',
    answer: 'Monthly fee is due on or before the 10th of every month. A late charge of PKR 500 applies after the 15th. Fee can be paid at the school office or by bank transfer.' },
  { keys: ['timing', 'time', 'school open', 'start', 'waqt'], source: 'Winter Timetable 2026.pdf · p.1',
    answer: 'Winter timings are 8:30 AM to 2:00 PM, Monday to Friday.' },
  { keys: ['holiday', 'closed', 'off', 'chutti', 'vacation'], source: 'Annual Calendar 2026-27.pdf · p.4',
    answer: 'Winter vacations run from 21 December to 3 January. The school reopens on Monday, 4 January.' },
  { keys: ['uniform', 'dress'], source: 'Student Handbook 2026.pdf · p.12',
    answer: 'Students must wear the school uniform every day. In winter, a navy blue sweater or blazer is allowed.' },
  { keys: ['absent', 'leave', 'absence'], source: 'Student Handbook 2026.pdf · p.18',
    answer: 'Please submit a leave application through the class teacher. Three or more consecutive absences are flagged to the administration.' },
  { keys: ['exam', 'datesheet', 'paper', 'test'], source: 'Annual Calendar 2026-27.pdf · p.6',
    answer: 'Final term examinations begin on 7 December. The detailed datesheet is shared one week earlier.' },
];
