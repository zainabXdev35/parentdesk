# ParentDesk – Frontend (Admin + Teacher + Parent portals)

Stack (from the proposal): React + Vite · Tailwind CSS · React Router · Recharts.
(`lucide-react` is added for icons only.)

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```
Demo login: pick **Admin**, **Teacher** or **Parent**, any email + a 4+ character password.

## Routes
| Role | Path | Page |
|---|---|---|
| – | `/login` | Role-based sign in |
| Admin | `/admin` | Dashboard (KPIs, fee + attendance charts, flagged students) |
| Admin | `/admin/students` | Search, filter, add, CSV import |
| Admin | `/admin/fees` | Invoices, status tabs, mark paid |
| Admin | `/admin/reminders` | Approve / edit / reject AI-drafted reminders |
| Admin | `/admin/documents` | PDF upload for the RAG knowledge base |
| Admin | `/admin/tickets` | Escalated chatbot questions + reply |
| Admin | `/admin/audit` | Audit log |
| Teacher | `/teacher` | Dashboard (class averages, flagged students, today's attendance status) |
| Teacher | `/teacher/attendance` | Mark Present/Absent/Late per class, submit (triggers parent alerts) |
| Teacher | `/teacher/marks` | Edit Quiz 1 / Midterm, save, draft AI comments |
| Teacher | `/teacher/comments` | Review, edit, regenerate, approve or reject AI comments |
| Teacher | `/teacher/students` | Searchable roster, student detail modal |
| Parent | `/parent` | Child overview + alerts |
| Parent | `/parent/attendance` | Monthly calendar |
| Parent | `/parent/fees` | Invoices and status |
| Parent | `/parent/progress` | Marks chart, result sheet, teacher comments |
| Parent | `/parent/assistant` | RAG chatbot UI with sources + ticket fallback |
| Parent | `/parent/notifications` | WhatsApp/SMS/email history |

## Connecting the backend
All data lives in `src/data/mock.js`; every `// TODO(backend)` comment names the endpoint
to call (`POST /api/auth/login`, `/api/students`, `/api/fees`, `/api/reminders/:id/approve`,
`/api/documents`, `/api/tickets`, `/api/chat`). Route guards are in `src/App.jsx`
(`Protected`), auth state in `src/context/AuthContext.jsx`.

## How the three portals stay in sync
All three portals read/write ONE store: `src/context/SchoolContext.jsx` (saved to localStorage and
pushed live between browser tabs). Login is per-tab (sessionStorage), so you can keep a teacher tab,
an admin tab and a parent tab open side by side.

| Teacher does… | Admin sees | Parent sees |
|---|---|---|
| Submits attendance (absent) | Class marked, student flagged at 3+ absences, audit entry | Calendar updates, WhatsApp-style alert, banner |
| Approves an AI comment | Audit entry | Comment + "teacher approved" badge, notification |
| Edits & saves marks | Avg on Students page, audit entry | Progress chart + result sheet |

| Admin does… | Teacher sees | Parent sees |
|---|---|---|
| Adds / imports students | Student in class roster | (if linked) their child |
| Marks an invoice paid | – | Fee status changes |
| Approves a fee reminder | – | Notification with the message |
| Replies to a ticket | – | Notification with the reply |

Parents never see AI drafts. Only comments the teacher approved are shown.
Use **Reset demo data** on the login page to restore the original sample data.

Demo identities: Admin *Sana Rehman* · Teacher *Ayesha Khan* (Mathematics, Classes 8-A, 9-B, 10-A) ·
Parent *Tariq Malik* (children: Zoya, Class 8-A; Eman, Class 9-B).

## Backend mapping
Each action in `SchoolContext.jsx` becomes one API call (attendance → `POST /api/attendance`,
comment approval → `POST /api/comments/:id/approve`, etc.). The n8n workflows (absence alerts, fee
reminder drafts) are represented by the automation log and the reminder queue.
