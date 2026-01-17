import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  CalendarOutlined,
  FileDoneOutlined,
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
  ReadOutlined,
  VideoCameraOutlined,
  BellOutlined,
  CarOutlined,
  HomeOutlined,
  BankOutlined,
  MessageOutlined,
} from "@ant-design/icons";

/* ========================= SCHOOL ERP MENU ========================= */
export const superAdminNav = [
    { key: "dashboard", label: "Dashboard", href: "/admin", icon: <DashboardOutlined /> },
    { key: "schools", label: "Schools", href: "/admin/schools", icon: <BankOutlined /> },
    { key: "coaching", label: "Coaching", href: "/admin/coaching", icon: <ReadOutlined /> },
    { key: "users", label: "Users", href: "/admin/users", icon: <TeamOutlined /> },
];

export const schoolNav = [
  { key: "dashboard", label: "Dashboard", href: "/admin", icon: <DashboardOutlined /> },

  {
    key: "leads",
    label: "Leads",
    icon: <UserOutlined />,
    children: [
      { key: "setup", label: "Setup", href: "/admin/leads/setup" },
      { key: "enquiries", label: "Enquiry", href: "/admin/leads/enquiries" },

    ],
  },
  {
    key: "classes",
    label: "Classes",
    icon: <UserOutlined />,
    children: [
      { key: "setup", label: "Setup", href: "/admin/classes/setup" },
      { key: "batches", label: "Batches", href: "/admin/classes/batches" },

    ],
  },
  {
    key: "students",
    label: "Students",
    icon: <UserOutlined />,
    children: [
      // { key: "new-admission", label: "Onboard Admission", href: "/admin/students/admission" },
      { key: "students-all", label: "All Students", href: "/admin/students" },
      { key: "students-promote", label: "Promote / Transfer", href: "/admin/students/promote" },

    ],
  },

  // {
  //   key: "academics",
  //   label: "Academics",
  //   icon: <BookOutlined />,
  //   children: [
  //     { key: "classes", label: "Classes & Sections", href: "/admin/classes" },
  //     { key: "subjects", label: "Subjects", href: "/admin/subjects" },
  //     { key: "attendance", label: "Attendance", href: "/admin/attendance" },
  //     { key: "timetable", label: "Timetable", href: "/admin/timetable" },
  //     { key: "homework", label: "Homework", href: "/admin/homework" },
  //     { key: "lesson-plan", label: "Lesson Planning", href: "/admin/lesson-plan" },
  //   ],
  // },

  // {
  //   key: "exams",
  //   label: "Examinations",
  //   icon: <FileDoneOutlined />,
  //   children: [
  //     { key: "exam-schedule", label: "Exam Schedule", href: "/admin/exams" },
  //     { key: "marks-entry", label: "Marks Entry", href: "/admin/exams/marks" },
  //     { key: "results", label: "Results", href: "/admin/results" },
  //     { key: "report-cards", label: "Report Cards", href: "/admin/report-cards" },
  //   ],
  // },

  {
    key: "finance",
    label: "Income/Expense",
    icon: <DollarOutlined />,
    children: [
      { key: "setup", label: "Setup", href: "/admin/finance/setup" },
      { key: "manage-income", label: "Manage Income", href: "/admin/finance/manage-income" },
      { key: "manage-expense", label: "Manage Expense", href: "/admin/finance/manage-expense" },
    ],
  },
  {
    key: "assets",
    label: "Assets",
    icon: <DollarOutlined />,
    children: [
      { key: "setup", label: "Assets Inventory", href: "/admin/assets/setup" },
      { key: "supplier-master", label: "Supplier Master", href: "/admin/assets/supplier-master" },
      { key: "purchase-assets", label: "Purchase Assets", href: "/admin/assets/purchase-assets" },
      { key: "assets-assignment", label: "Assets Assignment", href: "/admin/assets/assets-assignment" },
    ],
  },

  {
    key: "fees",
    label: "Fees & Accounts",
    icon: <DollarOutlined />,
    children: [
      { key: "fee-structure", label: "Fee Structure", href: "/admin/fees/structure" },
      { key: "fee-assign", label: "Assign", href: "/admin/fees/assign" },
      { key: "fee-collection", label: "Fee Collection", href: "/admin/fees/collection" },
      { key: "payments-pending", label: "Payments", href: "/admin/fees/pending-payments" },
      // { key: "fee-dues", label: "Due Fees", href: "/admin/fees/dues" },
      // { key: "expenses", label: "Expenses", href: "/admin/fees/expenses" },
    ],
  },

  {
    key: "staff",
    label: "Staff Management",
    icon: <TeamOutlined />,
    children: [
      { key: "staff-list", label: "Staff List", href: "/admin/staff" },
      // { key: "attendance", label: "Staff Attendance", href: "/admin/staff/attendance" },
      // { key: "payroll", label: "Payroll", href: "/admin/staff/payroll" },
      // { key: "salary-templates", label: "Salary Templates", href: "/admin/staff/salary-templates" },
    ],
  },

  {
    key: "transport",
    label: "Transport",
    icon: <CarOutlined />,
    children: [
      { key: "routes", label: "Routes", href: "/admin/transport/routes" },
      { key: "vehicles", label: "Vehicles", href: "/admin/transport/vehicles" },
      { key: "assign", label: "Student Transport", href: "/admin/transport/assign" },
    ],
  },

  // {
  //   key: "hostel",
  //   label: "Hostel",
  //   icon: <HomeOutlined />,
  //   children: [
  //     { key: "rooms", label: "Rooms", href: "/admin/hostel/rooms" },
  //     { key: "allocation", label: "Room Allocation", href: "/admin/hostel/allocation" },
  //     { key: "hostel-fees", label: "Hostel Fees", href: "/admin/hostel/fees" },
  //   ],
  // },

  // {
  //   key: "library",
  //   label: "Library",
  //   icon: <BankOutlined />,
  //   children: [
  //     { key: "books", label: "Books", href: "/admin/library/books" },
  //     { key: "issue", label: "Issue / Return", href: "/admin/library/issue" },
  //     { key: "fines", label: "Fines", href: "/admin/library/fines" },
  //   ],
  // },

  // {
  //   key: "communication",
  //   label: "Communication",
  //   icon: <MessageOutlined />,
  //   children: [
  //     { key: "notice", label: "Notices", href: "/admin/communication/notices" },
  //     { key: "sms", label: "SMS / WhatsApp", href: "/admin/communication/sms" },
  //   ],
  // },

  // {
  //   key: "notifications",
  //   label: "Notifications",
  //   icon: <BellOutlined />,
  //   href: "/admin/notifications",
  // },

  // {
  //   key: "reports",
  //   label: "Reports",
  //   icon: <BarChartOutlined />,
  //   children: [
  //     { key: "attendance-report", label: "Attendance", href: "/admin/reports/attendance" },
  //     { key: "fee-report", label: "Fees", href: "/admin/reports/fees" },
  //     { key: "exam-report", label: "Academics", href: "/admin/reports/exams" },
  //   ],
  // },

  // {
  //   key: "settings",
  //   label: "Settings",
  //   icon: <SettingOutlined />,
  //   children: [
  //     { key: "school-profile", label: "School Profile", href: "/admin/settings/school" },
  //     { key: "roles", label: "Roles & Permissions", href: "/admin/settings/roles" },
  //     { key: "backup", label: "Backup & Security", href: "/admin/settings/backup" },
  //   ],
  // },

  {
    key: "inventory",
    label: "Inventory",
    icon: <SettingOutlined />,
    children: [
      { key: "items", label: "Items", href: "/admin/inventory/items" },
      { key: "suppliers", label: "Suppliers", href: "/admin/inventory/suppliers" },
      { key: "purchase", label: "Purchases", href: "/admin/inventory/purchase" },
      { key: "sale-allocation", label: "Sale/Allocation", href: "/admin/inventory/sale-allocation" },
    ],
  },
  {
    key: "leave",
    label: "Leave",
    icon: <SettingOutlined />,
    children: [
      { key: "leave-category", label: "Leave Category", href: "/admin/leave/leave-category" },
      { key: "leave-permission", label: "Leave Permission", href: "/admin/leave/leave-permission" },
    ],
  },
];

/* ========================= COACHING ERP MENU ========================= */

export const coachingNav = [
  { key: "dashboard", label: "Dashboard", href: "/admin", icon: <DashboardOutlined /> },

  {
    key: "students",
    label: "Students",
    icon: <UserOutlined />,
    children: [
      { key: "students-all", label: "All Students", href: "/admin/students" },
      { key: "leads", label: "Leads / Inquiries", href: "/admin/leads" },
      { key: "admissions", label: "Admissions", href: "/admin/admissions" },
    ],
  },

  {
    key: "courses",
    label: "Courses & Batches",
    icon: <ReadOutlined />,
    children: [
      { key: "courses", label: "Courses", href: "/admin/courses" },
      { key: "batches", label: "Batches", href: "/admin/batches" },
      { key: "attendance", label: "Batch Attendance", href: "/admin/attendance" },
    ],
  },

  {
    key: "tests",
    label: "Tests & Results",
    icon: <FileDoneOutlined />,
    children: [
      { key: "test-series", label: "Test Series", href: "/admin/tests" },
      { key: "results", label: "Results", href: "/admin/results" },
      { key: "analytics", label: "Performance Analytics", href: "/admin/analytics" },
    ],
  },

  {
    key: "online",
    label: "Online Learning",
    icon: <VideoCameraOutlined />,
    children: [
      { key: "live", label: "Live Classes", href: "/admin/live-classes" },
      { key: "recordings", label: "Recorded Videos", href: "/admin/recordings" },
      { key: "materials", label: "Study Material", href: "/admin/materials" },
    ],
  },

  {
    key: "fees",
    label: "Fees & Payments",
    icon: <DollarOutlined />,
    children: [
      { key: "plans", label: "Fee Plans", href: "/admin/fees/plans" },
      { key: "collection", label: "Payments", href: "/admin/fees/collection" },
      { key: "dues", label: "Pending Dues", href: "/admin/fees/dues" },
    ],
  },

  {
    key: "communication",
    label: "Communication",
    icon: <MessageOutlined />,
    children: [
      { key: "announcements", label: "Announcements", href: "/admin/communication/announcements" },
      { key: "sms", label: "SMS / WhatsApp", href: "/admin/communication/sms" },
    ],
  },

  {
    key: "notifications",
    label: "Notifications",
    icon: <BellOutlined />,
    href: "/admin/notifications",
  },

  {
    key: "reports",
    label: "Reports",
    icon: <BarChartOutlined />,
    children: [
      { key: "student-report", label: "Student Reports", href: "/admin/reports/students" },
      { key: "revenue-report", label: "Revenue Reports", href: "/admin/reports/revenue" },
    ],
  },

  {
    key: "settings",
    label: "Settings",
    icon: <SettingOutlined />,
    children: [
      { key: "institute-profile", label: "Institute Profile", href: "/admin/settings/institute" },
      { key: "roles", label: "Roles & Permissions", href: "/admin/settings/roles" },
    ],
  },
];
