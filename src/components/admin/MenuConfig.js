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
    icon: <BookOutlined />,   // ✅ UPDATED
    children: [
      { key: "setup", label: "Setup", href: "/admin/classes/setup" },
      { key: "batches", label: "Batches", href: "/admin/classes/batches" },
      { key: "schedule", label: "Schedule", href: "/admin/classes/schedule" },
      { key: "attendance", label: "Attendance", href: "/admin/classes/attendance" },
    ],
  },

  {
    key: "staff",
    label: "Staff",
    icon: <TeamOutlined />,
    children: [
      { key: "role-manage", label: "Roles Management", href: "/admin/staff/role-manage" },
      { key: "staff-list", label: "Staff List", href: "/admin/staff" },
      { key: "attendance", label: "Staff Attendance", href: "/admin/staff/attendance" },
    ],
  },

  {
    key: "students",
    label: "Students",
    icon: <UserOutlined />,
    children: [
      { key: "students-all", label: "All Students", href: "/admin/students" },
    ],
  },

  {
    key: "fees",
    label: "Fees",
    icon: <DollarOutlined />,
    children: [
      { key: "fee-structure", label: "Setup", href: "/admin/fees/structure" },
      { key: "fee-assign", label: "Assign", href: "/admin/fees/assign" },
      { key: "fee-collection", label: "Fee Collection", href: "/admin/fees/collection" },
      { key: "payments-pending", label: "Pending Payments", href: "/admin/fees/pending-payments" },
      { key: "payments-refund", label: "Refund", href: "/admin/fees/refund" },
      { key: "payments-concession", label: "Concession", href: "/admin/fees/concession" },
    ],
  },

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
    icon: <HomeOutlined />,   // ✅ UPDATED
    children: [
      { key: "setup", label: "Assets Inventory", href: "/admin/assets/setup" },
      { key: "supplier-master", label: "Supplier Master", href: "/admin/assets/supplier-master" },
      { key: "purchase-assets", label: "Purchase Assets", href: "/admin/assets/purchase-assets" },
      { key: "assets-assignment", label: "Assets Assignment", href: "/admin/assets/assets-assignment" },
    ],
  },

  {
    key: "exam",
    label: "Exam",
    icon: <FileDoneOutlined />,   // ✅ UPDATED
    children: [
      { key: "setup", label: "Setup", href: "/admin/exam/setup" },
      { key: "schedule", label: "Schedule", href: "/admin/exam/schedule" },
      { key: "attendance", label: "Attendance", href: "/admin/exam/exam-attendance" },
      { key: "marks", label: "Marks", href: "/admin/exam/exam-marks" },
      { key: "exam-dashboard", label: "Exam-Dashboard", href: "/admin/exam/exam-dashboard" },
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

  {
    key: "live-class",
    label: "Live Classes",
    icon: <VideoCameraOutlined />,   // ✅ UPDATED
    children: [
      { key: "setup", label: "Settings", href: "/admin/live-class/setting" },
      { key: "zoom", label: "Zoom", href: "/admin/live-class/zoom" },
    ],
  },

  {
    key: "content-library",
    label: "Content Library",
    icon: <ReadOutlined />,   // ✅ UPDATED
    children: [
      { key: "study-materials", label: "Study Materials", href: "/admin/content-library/study-materials" },
      { key: "file-manager", label: "File Manager", href: "/admin/content-library/file-manager" },
    ],
  },

  { key: "assignments", label: "Assignments", href: "/admin/assignments", icon: <FileDoneOutlined /> }, // ✅ UPDATED

  {
    key: "inventory",
    label: "Inventory",
    icon: <HomeOutlined />,   // ✅ UPDATED
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
    icon: <CalendarOutlined />,   // ✅ UPDATED
    children: [
      { key: "leave-category", label: "Leave Category", href: "/admin/leave/leave-category" },
      { key: "leave-permission", label: "Leave Permission", href: "/admin/leave/leave-permission" },
    ],
  },

  {
    key: "payroll",
    label: "Payroll",
    icon: <DollarOutlined />,   // ✅ UPDATED
    children: [
      { key: "create-template", label: "Create Template", href: "/admin/payroll/create-template" },
      { key: "salary-manage", label: "Manage Salary", href: "/admin/payroll/salary-manage" },
      { key: "make-payment", label: "Make Payment", href: "/admin/payroll/make-payment" },
    ],
  },

  { key: "reports", label: "Reports", href: "/admin/reports", icon: <BarChartOutlined /> }, // ✅ UPDATED
];


// export const schoolNav = [
//   {
//     key: "staff",
//     label: "Staff",
//     icon: <TeamOutlined />,
//     children: [
//       { key: "role-manage", label: "Roles Management", href: "/admin/staff/role-manage" },
//       { key: "staff-list", label: "Staff List", href: "/admin/staff" },
//       { key: "attendance", label: "Staff Attendance", href: "/admin/staff/attendance" },
//       { key: "payroll", label: "Payroll", href: "/admin/staff/payroll" },
//       { key: "salary-templates", label: "Salary Templates", href: "/admin/staff/salary-templates" },
//       { key: "students-promote", label: "Promote / Transfer", href: "/admin/students/promote" },
//     ],
//   },

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
// ];


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
