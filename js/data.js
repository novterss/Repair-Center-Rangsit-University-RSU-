/* ==========================================================================
   ระบบแจ้งซ่อมและบำรุงรักษา มหาวิทยาลัยรังสิต (RSU Repair & Maintenance System)
   สำนักงานอาคารและสิ่งแวดล้อม (ตึก 13) - มหาวิทยาลัยรังสิต (Rangsit University)
   Data Layer - ERD based storage & LocalStorage Mock DB
   ========================================================================== */

const STORAGE_KEY_PREFIX = 'rsu_repair_v7_';

// Initial Mock Database based on ERD and Rangsit University Student Team
const DEFAULT_USERS = [
  {
    user_id: 1,
    student_id: "6800401",
    email: "naphatcharakan.p68@rsu.ac.th",
    password: "admin123",
    full_name: "ณพัชรกัณฑ์ พัชญ์ชัยพงศา",
    display_title: "ณพัชรกัณฑ์ พัชญ์ชัยพงศา (6800401)",
    phone: "ต่อ 1302",
    department: "วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี",
    role: "ผู้ดูแลระบบ",
    avatar: "ณพ"
  },
  {
    user_id: 2,
    student_id: "6803317",
    email: "thanakorn.y68@rsu.ac.th",
    password: "password123",
    full_name: "ธนากร ยั่งยืน",
    display_title: "ธนากร ยั่งยืน (6803317)",
    phone: "ต่อ 1206",
    department: "สำนักงานอาคารและสิ่งแวดล้อม (ตึก 13)",
    role: "ช่างเทคนิค",
    title_role: "ช่างระบบปรับอากาศ (ประจำตึก 1-5)",
    avatar: "ธน"
  },
  {
    user_id: 3,
    student_id: "6803162",
    email: "sorawit.t68@rsu.ac.th",
    password: "password123",
    full_name: "สรวิชญ์ ทองพลับ",
    display_title: "สรวิชญ์ ทองพลับ (6803162)",
    phone: "ต่อ 1305",
    department: "วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี",
    role: "เจ้าหน้าที่",
    avatar: "สร"
  },
  {
    user_id: 4,
    student_id: "6803498",
    email: "naphat.s68@rsu.ac.th",
    password: "password123",
    full_name: "ณภัทร สาระคำ",
    display_title: "ณภัทร สาระคำ (6803498)",
    phone: "ต่อ 1208",
    department: "สำนักงานอาคารและสิ่งแวดล้อม (ตึก 13)",
    role: "ช่างเทคนิค",
    title_role: "ช่างระบบไฟฟ้าและประปา (ประจำตึก 6-12)",
    avatar: "ณภ"
  },
  {
    user_id: 5,
    student_id: "6804265",
    email: "chartwut.t68@rsu.ac.th",
    password: "password123",
    full_name: "ชาติวุฒิ ทองจีน",
    display_title: "ชาติวุฒิ ทองจีน (6804265)",
    phone: "ต่อ 1201",
    department: "สำนักงานอาคารและสิ่งแวดล้อม (ตึก 13)",
    role: "ผู้ดูแลระบบ",
    avatar: "ชา"
  },
  {
    user_id: 6,
    student_id: null,
    email: "prasert.j@rsu.ac.th",
    password: "password123",
    full_name: "ประเสริฐ ใจดี",
    display_title: "ประเสริฐ ใจดี (บัญชีตัวอย่าง)",
    phone: "ต่อ 1210",
    department: "สำนักงานอาคารและสิ่งแวดล้อม (ตึก 13)",
    role: "ช่างเทคนิค",
    title_role: "ช่างคอมพิวเตอร์และอุปกรณ์สำนักงาน (ทุกอาคาร)",
    avatar: "ปส"
  },
  {
    user_id: 7,
    student_id: null,
    email: "somsak.k@rsu.ac.th",
    password: "password123",
    full_name: "สมศักดิ์ แก้วมณี",
    display_title: "สมศักดิ์ แก้วมณี (บัญชีตัวอย่าง)",
    phone: "ต่อ 1212",
    department: "สำนักงานอาคารและสิ่งแวดล้อม (ตึก 13)",
    role: "ช่างเทคนิค",
    title_role: "ช่างอาคารและสถานที่ (ทุกอาคาร)",
    avatar: "สศ"
  }
];

// Work categories (ประเภทงาน) — equipment belongs to one, technicians are qualified for some
const DEFAULT_CATEGORIES = [
  { category_id: 1, category_name: "ระบบปรับอากาศ" },
  { category_id: 2, category_name: "อุปกรณ์สำนักงาน" },
  { category_id: 3, category_name: "ระบบไฟฟ้า" },
  { category_id: 4, category_name: "ระบบประปา" },
  { category_id: 5, category_name: "คอมพิวเตอร์" },
  { category_id: 6, category_name: "อาคารและสถานที่" }
];

// Which technician may take which category (M:N between users and categories)
const DEFAULT_TECHNICIAN_SPECIALTIES = [
  { technician_id: 2, category_id: 1 },  // ธนากร — ระบบปรับอากาศ
  { technician_id: 4, category_id: 3 },  // ณภัทร — ระบบไฟฟ้า
  { technician_id: 4, category_id: 4 },  // ณภัทร — ระบบประปา
  { technician_id: 6, category_id: 2 },  // ประเสริฐ — อุปกรณ์สำนักงาน
  { technician_id: 6, category_id: 5 },  // ประเสริฐ — คอมพิวเตอร์
  { technician_id: 7, category_id: 6 }   // สมศักดิ์ — อาคารและสถานที่
];

const DEFAULT_EQUIPMENT = [
  {
    equipment_id: 1,
    asset_no: "AC-003",
    equipment_name: "เครื่องปรับอากาศ 24,000 บีทียู",
    category_id: 1,
    location: "ห้องประชุม 302 · ชั้น 3",
    location_full: "ตึก 1 อาคารอาทิตย์อุไรรัตน์ · ชั้น 3 · ห้องประชุม 302",
    building: "ตึก 1 อาคารอาทิตย์อุไรรัตน์",
    status: "อยู่ระหว่างซ่อม",
    next_due_date: "30 ต.ค. 2569"
  },
  {
    equipment_id: 2,
    asset_no: "PR-012",
    equipment_name: "เครื่องพิมพ์เลเซอร์",
    category_id: 2,
    location: "สำนักทะเบียน · ชั้น 1",
    location_full: "ตึก 11 อาคารรัตนคุณากร · ชั้น 1 · สำนักทะเบียน",
    building: "ตึก 11 อาคารรัตนคุณากร",
    status: "รอตรวจสอบ",
    next_due_date: "3 พ.ย. 2569"
  },
  {
    equipment_id: 3,
    asset_no: "EL-021",
    equipment_name: "ชุดโคมไฟทางเดิน LED",
    category_id: 3,
    location: "โถงทางเดิน · ชั้น 2",
    location_full: "ตึก 7 อาคารหอสมุด · ชั้น 2 · โถงทางเดินกลาง",
    building: "ตึก 7 อาคารหอสมุด",
    status: "อยู่ระหว่างซ่อม",
    next_due_date: "5 พ.ย. 2569"
  },
  {
    equipment_id: 4,
    asset_no: "PL-008",
    equipment_name: "ชุดก๊อกน้ำอ่างล้างมือ",
    category_id: 4,
    location: "ห้องน้ำ · ชั้น 1",
    location_full: "ตึก 6 โรงอาหารกลาง · ชั้น 1 · ห้องน้ำ",
    building: "ตึก 6 โรงอาหารกลาง",
    status: "ใช้งานปกติ",
    next_due_date: "10 พ.ย. 2569"
  },
  {
    equipment_id: 5,
    asset_no: "PC-045",
    equipment_name: "เครื่องคอมพิวเตอร์ตัดต่อ Studio Mac",
    category_id: 5,
    location: "ห้อง Lab ตัดต่อ · ชั้น 4",
    location_full: "ตึก 15 อาคาร Digital Multimedia Complex · ชั้น 4 · ห้องสตูดิโอ 401",
    building: "ตึก 15 อาคาร Digital Multimedia Complex",
    status: "อยู่ระหว่างซ่อม",
    next_due_date: "6 พ.ย. 2569"
  },
  {
    equipment_id: 6,
    asset_no: "DR-007",
    equipment_name: "ประตูโช้คอัพห้องประชุม",
    category_id: 6,
    location: "ห้องประชุม 201 · ชั้น 2",
    location_full: "ตึก 3 อาคารอุไรรัตน์ · ชั้น 2 · ห้องประชุม 201",
    building: "ตึก 3 อาคารอุไรรัตน์",
    status: "ใช้งานปกติ",
    next_due_date: "12 พ.ย. 2569"
  },
  {
    equipment_id: 7,
    asset_no: "AC-004",
    equipment_name: "เครื่องปรับอากาศ 18,000 บีทียู",
    category_id: 1,
    location: "ห้องแล็บวิศวกรรม · ชั้น 3",
    location_full: "ตึก 5 อาคารวิษณุรัตน์ · ชั้น 3 · ห้องทำงาน 305",
    building: "ตึก 5 อาคารวิษณุรัตน์",
    status: "รอตรวจสอบ",
    next_due_date: "30 ต.ค. 2569"
  },
  {
    equipment_id: 8,
    asset_no: "AC-001",
    equipment_name: "เครื่องปรับอากาศ 36,000 บีทียู",
    category_id: 1,
    location: "ห้องรับรองอธิการบดี · ชั้น 1",
    location_full: "ตึก 1 อาคารอาทิตย์อุไรรัตน์ · ชั้น 1 · ห้องรับรอง",
    building: "ตึก 1 อาคารอาทิตย์อุไรรัตน์",
    status: "ใช้งานปกติ",
    next_due_date: "27 ต.ค. 2569"
  }
];

const DEFAULT_REPAIRS = [
  {
    request_id: 1,
    ticket_no: "RQ-691028-014",
    requester_id: 3,
    technician_id: 2,
    equipment_id: 1,
    problem_title: "เครื่องปรับอากาศไม่เย็น",
    problem_detail: "เครื่องปรับอากาศไม่เย็น มีแต่ลมออก แม้ปรับอุณหภูมิลงแล้ว เริ่มพบปัญหาช่วงเช้าวันนี้ ห้องมีการประชุมคณะเวลา 13:00 น.",
    location_text: "ตึก 1 ห้องประชุม 302",
    location_detail: "ตึก 1 อาคารอาทิตย์อุไรรัตน์ · ชั้น 3 · ห้องประชุม 302",
    image: "แอร์ห้องประชุม302.jpg",
    image_size: "2.4 เมกะไบต์",
    priority: "เร่งด่วน",
    status: "กำลังดำเนินการ",
    request_date: "28 ต.ค. 2569",
    request_time: "08:45 น.",
    request_datetime: "28 ตุลาคม 2569 เวลา 08:45 น.",
    assigned_date: "28 ต.ค. 2569, 09:00 น.",
    assigned_by: "ชาติวุฒิ ทองจีน (6804265)",
    expected_date: "28 ต.ค. 2569",
    expected_time: "12:00 น.",
    completed_date: null,
    repair_note: "ตรวจพบสารทำความเย็นรั่วบริเวณข้อต่อ กำลังซ่อมจุดรั่วและเติมสารทำความเย็น จากนั้นจะทดสอบระบบอีกครั้ง",
    repair_image: "แอร์ห้องประชุม302.jpg",
    timeline: [
      {
        step: 1,
        title: "ส่งคำขอแจ้งซ่อม",
        user_info: "สรวิชญ์ ทองพลับ · 28 ต.ค. 2569, 08:45 น.",
        note: "แจ้งเครื่องปรับอากาศไม่เย็น",
        status: "done"
      },
      {
        step: 2,
        title: "รับเรื่องและมอบหมายช่าง",
        user_info: "ชาติวุฒิ ทองจีน · 28 ต.ค., 09:00 น.",
        note: "มอบหมายให้ ธนากร ยั่งยืน (ช่างประจำตึก 1-5)",
        status: "done"
      },
      {
        step: 3,
        title: "กำลังดำเนินการ",
        user_info: "ธนากร ยั่งยืน · 28 ต.ค., 10:15 น.",
        note: "ตรวจพบสารทำความเย็นรั่ว กำลังซ่อมจุดรั่ว",
        status: "active"
      },
      {
        step: 4,
        title: "ซ่อมเสร็จและตรวจรับ",
        user_info: "รอช่างดำเนินการและผู้แจ้งยืนยัน",
        note: "",
        status: "pending"
      }
    ]
  },
  {
    request_id: 2,
    ticket_no: "RQ-691028-013",
    requester_id: 1,
    technician_id: null,
    equipment_id: 2,
    problem_title: "เครื่องพิมพ์กระดาษติด",
    problem_detail: "เครื่องพิมพ์สำนักทะเบียนกระดาษติดบ่อย ดึงกระดาษซ้อน ไม่สามารถพิมพ์ใบรายงานผลการศึกษาด่วนได้",
    location_text: "ตึก 11 สำนักทะเบียน ชั้น 1",
    location_detail: "ตึก 11 อาคารรัตนคุณากร · ชั้น 1 · สำนักทะเบียน",
    image: null,
    image_size: null,
    priority: "ปกติ",
    status: "รอดำเนินการ",
    request_date: "28 ต.ค. 2569",
    request_time: "08:30 น.",
    request_datetime: "28 ตุลาคม 2569 เวลา 08:30 น.",
    assigned_date: null,
    assigned_by: null,
    expected_date: null,
    expected_time: null,
    completed_date: null,
    repair_note: "",
    repair_image: null,
    timeline: [
      {
        step: 1,
        title: "ส่งคำขอแจ้งซ่อม",
        user_info: "ณพัชรกัณฑ์ พัชญ์ชัยพงศา · 28 ต.ค. 2569, 08:30 น.",
        note: "เครื่องพิมพ์กระดาษติด",
        status: "done"
      },
      {
        step: 2,
        title: "รับเรื่องและมอบหมายช่าง",
        user_info: "รอมอบหมายเจ้าหน้าที่ฝ่ายอาคารฯ ตึก 13",
        note: "",
        status: "active"
      },
      {
        step: 3,
        title: "กำลังดำเนินการ",
        user_info: "รอเริ่มงาน",
        note: "",
        status: "pending"
      },
      {
        step: 4,
        title: "ซ่อมเสร็จและตรวจรับ",
        user_info: "รอตรวจรับ",
        note: "",
        status: "pending"
      }
    ]
  },
  {
    request_id: 3,
    ticket_no: "RQ-691028-012",
    requester_id: 3,
    technician_id: 4,
    equipment_id: 3,
    problem_title: "โคมไฟทางเดินดับ",
    problem_detail: "โคมไฟทางเดินตึกหอสมุดดับ 2 ชุด มืดมากในช่วงเย็น เสี่ยงต่ออุบัติเหตุของนักศึกษา",
    location_text: "ตึก 7 หอสมุด ชั้น 2",
    location_detail: "ตึก 7 อาคารหอสมุด · ชั้น 2 · โถงทางเดินกลาง",
    image: null,
    image_size: null,
    priority: "เร่งด่วน",
    status: "กำลังดำเนินการ",
    request_date: "28 ต.ค. 2569",
    request_time: "08:15 น.",
    request_datetime: "28 ตุลาคม 2569 เวลา 08:15 น.",
    assigned_date: "28 ต.ค. 2569, 08:40 น.",
    assigned_by: "ณพัชรกัณฑ์ พัชญ์ชัยพงศา",
    expected_date: "28 ต.ค. 2569",
    expected_time: "16:00 น.",
    completed_date: null,
    repair_note: "ตรวจเช็คหม้อแปลงไฟและเปลี่ยนชุดหลอด LED ใหม่",
    repair_image: null,
    timeline: [
      {
        step: 1,
        title: "ส่งคำขอแจ้งซ่อม",
        user_info: "สรวิชญ์ ทองพลับ · 28 ต.ค. 2569, 08:15 น.",
        note: "โคมไฟทางเดินดับ",
        status: "done"
      },
      {
        step: 2,
        title: "รับเรื่องและมอบหมายช่าง",
        user_info: "ณพัชรกัณฑ์ พัชญ์ชัยพงศา · 28 ต.ค., 08:40 น.",
        note: "มอบหมายให้ ณภัทร สาระคำ",
        status: "done"
      },
      {
        step: 3,
        title: "กำลังดำเนินการ",
        user_info: "ณภัทร สาระคำ · 28 ต.ค., 09:30 น.",
        note: "กำลังนำหลอดอะไหล่มาเปลี่ยน",
        status: "active"
      },
      {
        step: 4,
        title: "ซ่อมเสร็จและตรวจรับ",
        user_info: "รอช่างดำเนินการและผู้แจ้งยืนยัน",
        note: "",
        status: "pending"
      }
    ]
  },
  {
    request_id: 4,
    ticket_no: "RQ-691027-011",
    requester_id: 1,
    technician_id: 4,
    equipment_id: 4,
    problem_title: "ก๊อกน้ำรั่วซึม",
    problem_detail: "ก๊อกน้ำอ่างล้างมือปิดสนิทแล้วแต่น้ำยังหยดต่อเนื่อง สิ้นเปลืองน้ำ",
    location_text: "ตึก 6 โรงอาหารกลาง ชั้น 1",
    location_detail: "ตึก 6 โรงอาหารกลาง · ชั้น 1 · ห้องน้ำ",
    image: null,
    image_size: null,
    priority: "ปกติ",
    status: "เสร็จสิ้น",
    request_date: "27 ต.ค. 2569",
    request_time: "14:20 น.",
    request_datetime: "27 ตุลาคม 2569 เวลา 14:20 น.",
    assigned_date: "27 ต.ค. 2569, 14:40 น.",
    assigned_by: "ชาติวุฒิ ทองจีน",
    expected_date: "27 ต.ค. 2569",
    expected_time: "17:00 น.",
    completed_date: "27 ต.ค. 2569 16:30",
    repair_note: "เปลี่ยนลูกยางและวาล์วเปิด-ปิดใหม่ ทดสอบไม่รั่วซึมแล้ว",
    repair_image: null,
    timeline: [
      {
        step: 1,
        title: "ส่งคำขอแจ้งซ่อม",
        user_info: "ณพัชรกัณฑ์ พัชญ์ชัยพงศา · 27 ต.ค. 2569, 14:20 น.",
        note: "ก๊อกน้ำรั่วซึม",
        status: "done"
      },
      {
        step: 2,
        title: "รับเรื่องและมอบหมายช่าง",
        user_info: "ชาติวุฒิ ทองจีน · 27 ต.ค., 14:40 น.",
        note: "มอบหมายให้ ณภัทร สาระคำ",
        status: "done"
      },
      {
        step: 3,
        title: "กำลังดำเนินการ",
        user_info: "ณภัทร สาระคำ · 27 ต.ค., 15:10 น.",
        note: "เปลี่ยนอะไหล่วาล์วน้ำ",
        status: "done"
      },
      {
        step: 4,
        title: "ซ่อมเสร็จและตรวจรับ",
        user_info: "ณพัชรกัณฑ์ พัชญ์ชัยพงศา · 27 ต.ค., 16:30 น.",
        note: "ยืนยันตรวจรับงานเรียบร้อย",
        status: "done"
      }
    ]
  },
  {
    request_id: 5,
    ticket_no: "RQ-691027-010",
    requester_id: 3,
    technician_id: 6,
    equipment_id: 5,
    problem_title: "คอมพิวเตอร์ตัดต่อเปิดไม่ติด",
    problem_detail: "เปิดเครื่องสตูดิโอตัดต่อแล้วพัดลมหมุนแป๊บเดียวแล้วดับ ไฟกระพริบสีส้ม",
    location_text: "ตึก 15 Digital Multimedia ชั้น 4",
    location_detail: "ตึก 15 อาคาร Digital Multimedia Complex · ชั้น 4 · ห้องสตูดิโอ 401",
    image: null,
    image_size: null,
    priority: "ปกติ",
    status: "กำลังดำเนินการ",
    request_date: "27 ต.ค. 2569",
    request_time: "11:10 น.",
    request_datetime: "27 ตุลาคม 2569 เวลา 11:10 น.",
    assigned_date: "27 ต.ค. 2569, 13:00 น.",
    assigned_by: "ชาติวุฒิ ทองจีน",
    expected_date: "28 ต.ค. 2569",
    expected_time: "15:00 น.",
    completed_date: null,
    repair_note: "เพาเวอร์ซัพพลายเสื่อมสภาพ เบิกอะไหล่เปลี่ยนใหม่",
    repair_image: null,
    timeline: [
      {
        step: 1,
        title: "ส่งคำขอแจ้งซ่อม",
        user_info: "สรวิชญ์ ทองพลับ · 27 ต.ค. 2569, 11:10 น.",
        note: "คอมพิวเตอร์เปิดไม่ติด",
        status: "done"
      },
      {
        step: 2,
        title: "รับเรื่องและมอบหมายช่าง",
        user_info: "ชาติวุฒิ ทองจีน · 27 ต.ค., 13:00 น.",
        note: "มอบหมายให้ ประเสริฐ ใจดี",
        status: "done"
      },
      {
        step: 3,
        title: "กำลังดำเนินการ",
        user_info: "ประเสริฐ ใจดี · 28 ต.ค., 09:00 น.",
        note: "เปลี่ยนเพาเวอร์ซัพพลายและลงระบบทดสอบ",
        status: "active"
      },
      {
        step: 4,
        title: "ซ่อมเสร็จและตรวจรับ",
        user_info: "รอทดสอบและส่งมอบ",
        note: "",
        status: "pending"
      }
    ]
  },
  {
    request_id: 6,
    ticket_no: "RQ-691027-009",
    requester_id: 1,
    technician_id: 7,
    equipment_id: 6,
    problem_title: "ประตูห้องปิดไม่สนิท",
    problem_detail: "ประตูห้องประชุม 201 โช้คอัพหลวม ปิดเองไม่ได้และมีเสียงดัง",
    location_text: "ตึก 3 อาคารอุไรรัตน์ ห้องประชุม 201",
    location_detail: "ตึก 3 อาคารอุไรรัตน์ · ชั้น 2 · ห้องประชุม 201",
    image: null,
    image_size: null,
    priority: "ต่ำ",
    status: "เสร็จสิ้น",
    request_date: "27 ต.ค. 2569",
    request_time: "09:15 น.",
    request_datetime: "27 ตุลาคม 2569 เวลา 09:15 น.",
    assigned_date: "27 ต.ค. 2569, 09:45 น.",
    assigned_by: "ณพัชรกัณฑ์ พัชญ์ชัยพงศา",
    expected_date: "27 ต.ค. 2569",
    expected_time: "12:00 น.",
    completed_date: "27 ต.ค. 2569 11:45",
    repair_note: "ปรับตั้งสปีดโช้คประตูและหยอดน้ำมันหล่อลื่น ปิดสนิทเรียบร้อย",
    repair_image: null,
    timeline: [
      {
        step: 1,
        title: "ส่งคำขอแจ้งซ่อม",
        user_info: "ณพัชรกัณฑ์ พัชญ์ชัยพงศา · 27 ต.ค. 2569, 09:15 น.",
        note: "ประตูห้องปิดไม่สนิท",
        status: "done"
      },
      {
        step: 2,
        title: "รับเรื่องและมอบหมายช่าง",
        user_info: "ณพัชรกัณฑ์ พัชญ์ชัยพงศา · 27 ต.ค., 09:45 น.",
        note: "มอบหมายให้ สมศักดิ์ แก้วมณี",
        status: "done"
      },
      {
        step: 3,
        title: "กำลังดำเนินการ",
        user_info: "สมศักดิ์ แก้วมณี · 27 ต.ค., 10:30 น.",
        note: "ปรับตั้งและทดสอบการเปิด-ปิด",
        status: "done"
      },
      {
        step: 4,
        title: "ซ่อมเสร็จและตรวจรับ",
        user_info: "ณพัชรกัณฑ์ พัชญ์ชัยพงศา · 27 ต.ค., 11:45 น.",
        note: "ตรวจรับงานเรียบร้อย",
        status: "done"
      }
    ]
  },
  {
    request_id: 7,
    ticket_no: "RQ-691027-008",
    requester_id: 3,
    technician_id: 2,
    equipment_id: 7,
    problem_title: "เครื่องปรับอากาศมีน้ำหยด",
    problem_detail: "แอร์ห้องแล็บวิศวกรรมมีน้ำหยดลงบนโต๊ะเครื่องมือ ท่อน้ำทิ้งน่าจะอุดตัน",
    location_text: "ตึก 5 วิษณุรัตน์ ห้อง 305",
    location_detail: "ตึก 5 อาคารวิษณุรัตน์ · ชั้น 3 · ห้องทำงาน 305",
    image: null,
    image_size: null,
    priority: "ปกติ",
    status: "รอดำเนินการ",
    request_date: "27 ต.ค. 2569",
    request_time: "08:50 น.",
    request_datetime: "27 ตุลาคม 2569 เวลา 08:50 น.",
    assigned_date: "27 ต.ค. 2569, 09:15 น.",
    assigned_by: "ชาติวุฒิ ทองจีน",
    expected_date: "29 ต.ค. 2569",
    expected_time: "14:00 น.",
    completed_date: null,
    repair_note: "",
    repair_image: null,
    timeline: [
      {
        step: 1,
        title: "ส่งคำขอแจ้งซ่อม",
        user_info: "สรวิชญ์ ทองพลับ · 27 ต.ค. 2569, 08:50 น.",
        note: "เครื่องปรับอากาศมีน้ำหยด",
        status: "done"
      },
      {
        step: 2,
        title: "รับเรื่องและมอบหมายช่าง",
        user_info: "ชาติวุฒิ ทองจีน · 27 ต.ค., 09:15 น.",
        note: "มอบหมายให้ ธนากร ยั่งยืน",
        status: "done"
      },
      {
        step: 3,
        title: "กำลังดำเนินการ",
        user_info: "รอเริ่มดำเนินการ",
        note: "",
        status: "active"
      },
      {
        step: 4,
        title: "ซ่อมเสร็จและตรวจรับ",
        user_info: "รอช่างดำเนินการ",
        note: "",
        status: "pending"
      }
    ]
  }
];

const DEFAULT_MAINTENANCE_PLANS = [
  {
    plan_id: 1,
    code: "PM-6910-020",
    equipment_id: 8,
    technician_id: 2,
    equipment_name: "AC-001 · เครื่องปรับอากาศ",
    location: "ตึก 1 อาคารอาทิตย์อุไรรัตน์ · ชั้น 1",
    task: "ล้างแผงกรอง / ตรวจน้ำยา",
    frequency: "ทุก 3 เดือน",
    next_due_date: "27 ต.ค. 2569",
    status: "เกินกำหนด"
  },
  {
    plan_id: 2,
    code: "PM-6910-021",
    equipment_id: 1,
    technician_id: 2,
    equipment_name: "AC-003 · เครื่องปรับอากาศ",
    location: "ตึก 1 อาคารอาทิตย์อุไรรัตน์ · ชั้น 3",
    task: "ล้างแผงกรอง / ตรวจน้ำยา",
    frequency: "ทุก 3 เดือน",
    next_due_date: "30 ต.ค. 2569",
    status: "ใกล้ครบกำหนด"
  },
  {
    plan_id: 3,
    code: "PM-6910-022",
    equipment_id: 7,
    technician_id: 2,
    equipment_name: "AC-004 · เครื่องปรับอากาศ",
    location: "ตึก 5 อาคารวิษณุรัตน์ · ชั้น 3",
    task: "ล้างแผงกรอง / ตรวจน้ำยา",
    frequency: "ทุก 3 เดือน",
    next_due_date: "30 ต.ค. 2569",
    status: "ใกล้ครบกำหนด"
  },
  {
    plan_id: 4,
    code: "PM-6911-001",
    equipment_id: 2,
    technician_id: 6,
    equipment_name: "PR-012 · เครื่องพิมพ์เลเซอร์",
    location: "ตึก 11 อาคารรัตนคุณากร · ชั้น 1",
    task: "ทำความสะอาด / ทดสอบพิมพ์",
    frequency: "ทุก 6 เดือน",
    next_due_date: "3 พ.ย. 2569",
    status: "รอดำเนินการ"
  },
  {
    plan_id: 5,
    code: "PM-6911-002",
    equipment_id: 3,
    technician_id: 4,
    equipment_name: "EL-021 · ชุดโคมไฟทางเดิน",
    location: "ตึก 7 อาคารหอสมุด · ชั้น 2",
    task: "ตรวจสายไฟและจุดต่อ",
    frequency: "ทุก 6 เดือน",
    next_due_date: "5 พ.ย. 2569",
    status: "รอดำเนินการ"
  },
  {
    plan_id: 6,
    code: "PM-6911-003",
    equipment_id: 5,
    technician_id: 6,
    equipment_name: "PC-045 · เครื่อง Mac ตัดต่อ",
    location: "ตึก 15 Digital Multimedia · ชั้น 4",
    task: "ทำความสะอาด / ตรวจระบบ",
    frequency: "ทุก 6 เดือน",
    next_due_date: "6 พ.ย. 2569",
    status: "รอดำเนินการ"
  },
  {
    plan_id: 7,
    code: "PM-6911-004",
    equipment_id: 4,
    technician_id: 4,
    equipment_name: "PL-008 · ชุดก๊อกน้ำ",
    location: "ตึก 6 โรงอาหารกลาง · ชั้น 1",
    task: "ตรวจรอยรั่วและวาล์วน้ำ",
    frequency: "ทุก 3 เดือน",
    next_due_date: "10 พ.ย. 2569",
    status: "รอดำเนินการ"
  }
];

// Roles
const ROLE_ADMIN = "ผู้ดูแลระบบ";
const ROLE_TECH = "ช่างเทคนิค";
const ROLE_STAFF = "เจ้าหน้าที่";

// Escape text before inserting it into innerHTML / HTML attributes
function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Thai date helpers (Buddhist Era, e.g. "28 ต.ค. 2569")
const THAI_MONTHS_SHORT = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const THAI_MONTHS_FULL = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

const ThaiDate = {
  format(d) {
    return `${d.getDate()} ${THAI_MONTHS_SHORT[d.getMonth()]} ${d.getFullYear() + 543}`;
  },
  formatTime(d) {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} น.`;
  },
  // All the date/time strings a record needs, for "now"
  now() {
    const d = new Date();
    const date = this.format(d);
    const time = this.formatTime(d);
    return {
      date,
      time,
      datetime: `${d.getDate()} ${THAI_MONTHS_FULL[d.getMonth()]} ${d.getFullYear() + 543} เวลา ${time}`,
      stamp: `${date}, ${time}`
    };
  },
  // "27 ต.ค. 2569" -> Date (local midnight); null if it cannot be parsed
  parse(text) {
    if (!text) return null;
    const m = String(text).trim().match(/^(\d{1,2})\s+(\S+)\s+(\d{4})/);
    if (!m) return null;
    const month = THAI_MONTHS_SHORT.indexOf(m[2]);
    if (month === -1) return null;
    return new Date(Number(m[3]) - 543, month, Number(m[1]));
  },
  // "27 ต.ค. 2569" + "14:20 น." (or a single "27 ต.ค. 2569, 14:20 น.") -> Date with time
  parseDateTime(dateText, timeText) {
    const d = this.parse(dateText);
    if (!d) return null;
    const m = String(timeText || dateText).match(/(\d{1,2}):(\d{2})/);
    if (m) d.setHours(Number(m[1]), Number(m[2]));
    return d;
  },
  formatDateTime(d) {
    return `${this.format(d)}, ${this.formatTime(d)}`;
  },
  // Date <-> "YYYY-MM-DD" for <input type="date">
  toISO(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },
  fromISO(iso) {
    const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
  },
  today() {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  },
  addMonths(d, months) {
    const r = new Date(d.getFullYear(), d.getMonth() + months, 1);
    const lastDay = new Date(r.getFullYear(), r.getMonth() + 1, 0).getDate();
    r.setDate(Math.min(d.getDate(), lastDay));
    return r;
  }
};

// Repairs without an ETA from the technician are due this many days after the request
const PRIORITY_DUE_DAYS = { "เร่งด่วน": 1, "ปกติ": 3, "ต่ำ": 7 };

// "ทุก 3 เดือน" -> 3, "ทุก 1 ปี" -> 12
function frequencyToMonths(freq) {
  const m = String(freq || '').match(/(\d+)\s*(เดือน|ปี)/);
  if (!m) return 3;
  return m[2] === 'ปี' ? Number(m[1]) * 12 : Number(m[1]);
}

// Database API helper object
const DB = {
  get(key, defaultValue) {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!raw) {
      if (defaultValue !== undefined) {
        this.set(key, defaultValue);
        return defaultValue;
      }
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch(e) {
      return defaultValue;
    }
  },
  set(key, value) {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  },
  init() {
    // Clean old caches if present
    try {
      ['rsu_repair_sys_', 'rsu_repair_v2_', 'rsu_repair_v3_', 'rsu_repair_v4_', 'rsu_repair_v5_', 'rsu_repair_v6_'].forEach(p => {
        if (p !== STORAGE_KEY_PREFIX) {
          Object.keys(localStorage).filter(k => k.startsWith(p)).forEach(k => localStorage.removeItem(k));
        }
      });
    } catch(e) {}

    const existingUsers = this.get('users');
    const isOldData = !existingUsers || !Array.isArray(existingUsers) || !existingUsers.some(u => u.student_id === "6800401");
    if (isOldData) {
      this.set('users', DEFAULT_USERS);
      this.set('categories', DEFAULT_CATEGORIES);
      this.set('technician_specialties', DEFAULT_TECHNICIAN_SPECIALTIES);
      this.set('repairs', DEFAULT_REPAIRS);
      this.set('equipment', DEFAULT_EQUIPMENT);
      this.set('plans', DEFAULT_MAINTENANCE_PLANS);
      this.set('notifications', []);
      this.seedAssignmentNotifications();
    } else {
      if (!this.get('categories')) this.set('categories', DEFAULT_CATEGORIES);
      if (!this.get('technician_specialties')) this.set('technician_specialties', DEFAULT_TECHNICIAN_SPECIALTIES);
      if (!this.get('equipment')) this.set('equipment', DEFAULT_EQUIPMENT);
      if (!this.get('repairs')) this.set('repairs', DEFAULT_REPAIRS);
      if (!this.get('plans')) this.set('plans', DEFAULT_MAINTENANCE_PLANS);
      if (!this.get('notifications')) this.set('notifications', []);
    }
  },
  isLoggedIn() {
    return localStorage.getItem(STORAGE_KEY_PREFIX + 'is_logged_in') === 'true' && !!this.getCurrentUser();
  },
  setLoggedIn(status) {
    if (status) {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'is_logged_in', 'true');
    } else {
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'is_logged_in');
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'currentUserId');
    }
  },
  logout() {
    this.setLoggedIn(false);
    window.location.href = 'login.html';
  },
  // Always read the user fresh from the users table so changes (e.g. password reset) are reflected
  getCurrentUser() {
    const id = Number(localStorage.getItem(STORAGE_KEY_PREFIX + 'currentUserId'));
    if (!id) return null;
    return this.getUsers().find(u => u.user_id === id) || null;
  },
  setCurrentUser(userId) {
    const user = this.getUsers().find(u => u.user_id === Number(userId));
    if (user) {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'currentUserId', String(user.user_id));
      return user;
    }
    return null;
  },
  hasRole(...roles) {
    const user = this.getCurrentUser();
    return !!user && roles.includes(user.role);
  },
  getUsers() {
    return this.get('users', DEFAULT_USERS);
  },
  getUserById(id) {
    return this.getUsers().find(u => u.user_id === Number(id)) || null;
  },
  getTechnicians() {
    return this.getUsers().filter(u => u.role === ROLE_TECH);
  },
  getAdmins() {
    return this.getUsers().filter(u => u.role === ROLE_ADMIN);
  },
  getCategories() {
    return this.get('categories', DEFAULT_CATEGORIES);
  },
  getCategoryName(categoryId) {
    const c = this.getCategories().find(c => c.category_id === Number(categoryId));
    return c ? c.category_name : '-';
  },
  getSpecialties() {
    return this.get('technician_specialties', DEFAULT_TECHNICIAN_SPECIALTIES);
  },
  getTechnicianCategoryIds(technicianId) {
    return this.getSpecialties().filter(s => s.technician_id === Number(technicianId)).map(s => s.category_id);
  },
  getTechnicianSpecialtyText(technicianId) {
    const names = this.getTechnicianCategoryIds(technicianId).map(id => this.getCategoryName(id));
    return names.length ? names.join(', ') : 'ยังไม่กำหนดประเภทงาน';
  },
  setTechnicianSpecialties(technicianId, categoryIds) {
    const others = this.getSpecialties().filter(s => s.technician_id !== Number(technicianId));
    const mine = [...new Set(categoryIds.map(Number))].map(category_id => ({ technician_id: Number(technicianId), category_id }));
    this.set('technician_specialties', [...others, ...mine]);
  },
  getEquipmentById(equipmentId) {
    return this.getEquipment().find(e => e.equipment_id === Number(equipmentId)) || null;
  },
  // A technician may only take work in a category they are qualified for
  canHandle(technicianId, categoryId) {
    const user = this.getUserById(technicianId);
    return !!user && user.role === ROLE_TECH && this.getTechnicianCategoryIds(technicianId).includes(Number(categoryId));
  },
  getQualifiedTechnicians(categoryId) {
    return this.getTechnicians().filter(t => this.canHandle(t.user_id, categoryId));
  },
  addUser(userData) {
    const users = this.getUsers();
    const newId = users.length > 0 ? Math.max(...users.map(u => u.user_id)) + 1 : 1;
    const avatar = userData.full_name ? userData.full_name.substring(0, 2) : "จน";
    const newUser = {
      user_id: newId,
      avatar: avatar,
      ...userData
    };
    users.push(newUser);
    this.set('users', users);
    return newUser;
  },
  // Reset requires the phone number on file as a second check, not only the email
  resetPassword(email, phone, newPassword) {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { ok: false, reason: 'not_found' };
    const normalize = v => String(v || '').replace(/[^0-9]/g, '');
    if (!normalize(phone) || normalize(user.phone) !== normalize(phone)) {
      return { ok: false, reason: 'phone_mismatch' };
    }
    user.password = newPassword;
    this.set('users', users);
    return { ok: true, user };
  },
  getEquipment() {
    return this.get('equipment', DEFAULT_EQUIPMENT);
  },
  getRepairs() {
    return this.get('repairs', DEFAULT_REPAIRS);
  },
  getRepairByTicket(ticketNo) {
    return this.getRepairs().find(r => r.ticket_no === ticketNo) || null;
  },
  getPlans() {
    return this.get('plans', DEFAULT_MAINTENANCE_PLANS);
  },
  // Ticket format: RQ-<BE year 2 digits><month><day>-<running number of that day>
  generateTicketNo(repairs) {
    const d = new Date();
    const prefix = `RQ-${String((d.getFullYear() + 543) % 100).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-`;
    const used = new Set(repairs.map(r => r.ticket_no));
    let seq = repairs
      .filter(r => r.ticket_no.startsWith(prefix))
      .reduce((max, r) => Math.max(max, Number(r.ticket_no.slice(prefix.length)) || 0), 0) + 1;
    while (used.has(prefix + String(seq).padStart(3, '0'))) seq++;
    return prefix + String(seq).padStart(3, '0');
  },
  addRepair(request) {
    const repairs = this.getRepairs();
    const newId = repairs.length > 0 ? Math.max(...repairs.map(r => r.request_id)) + 1 : 1;
    const ticketNo = this.generateTicketNo(repairs);
    const now = ThaiDate.now();

    const newRecord = {
      request_id: newId,
      ticket_no: ticketNo,
      technician_id: null,
      assigned_date: null,
      assigned_by: null,
      expected_date: null,
      expected_time: null,
      completed_date: null,
      repair_note: "",
      repair_image: null,
      ...request,
      request_date: now.date,
      request_time: now.time,
      request_datetime: now.datetime,
      updated_at: now.stamp,
      timeline: [
        {
          step: 1,
          title: "ส่งคำขอแจ้งซ่อม",
          user_info: `${request.requester_name || "ผู้แจ้ง"} · ${now.stamp}`,
          note: request.problem_title || (request.problem_detail || '').substring(0, 30),
          status: "done"
        },
        {
          step: 2,
          title: "รับเรื่องและมอบหมายช่าง",
          user_info: "รอมอบหมายเจ้าหน้าที่ฝ่ายอาคารฯ ตึก 13",
          note: "",
          status: "active"
        },
        {
          step: 3,
          title: "กำลังดำเนินการ",
          user_info: "รอเริ่มงาน",
          note: "",
          status: "pending"
        },
        {
          step: 4,
          title: "ซ่อมเสร็จและตรวจรับ",
          user_info: "รอตรวจรับ",
          note: "",
          status: "pending"
        }
      ]
    };

    repairs.unshift(newRecord);
    this.set('repairs', repairs);
    this.syncEquipmentStatus(newRecord.equipment_id);
    return newRecord;
  },
  updateRepair(ticketNo, updateData) {
    const repairs = this.getRepairs();
    const index = repairs.findIndex(r => r.ticket_no === ticketNo);
    if (index !== -1) {
      repairs[index] = { ...repairs[index], ...updateData };
      this.set('repairs', repairs);
      return repairs[index];
    }
    return null;
  },
  // Admin assigns (or reassigns) a technician to a request
  assignTechnician(ticketNo, technicianId, actorName) {
    const repair = this.getRepairByTicket(ticketNo);
    const tech = this.getUserById(technicianId);
    if (!repair || !tech || repair.status === 'เสร็จสิ้น') return null;
    const equipment = this.getEquipmentById(repair.equipment_id);
    if (!equipment || !this.canHandle(tech.user_id, equipment.category_id)) return null;
    const now = ThaiDate.now();
    const timeline = (repair.timeline || []).map(step => {
      if (step.step === 2) {
        return { ...step, status: 'done', user_info: `${actorName} · ${now.stamp}`, note: `มอบหมายให้ ${tech.full_name}${tech.title_role ? ` · ${tech.title_role}` : ''}` };
      }
      if (step.step === 3 && step.status === 'pending') {
        return { ...step, status: 'active', user_info: 'รอเริ่มดำเนินการ', note: '' };
      }
      return step;
    });
    const updated = this.updateRepair(ticketNo, {
      technician_id: tech.user_id,
      assigned_date: now.stamp,
      assigned_by: actorName,
      updated_at: now.stamp,
      timeline
    });
    if (updated && repair.technician_id !== tech.user_id) {
      this.addNotification({
        user_id: tech.user_id,
        type: 'assigned_repair',
        title: 'ได้รับมอบหมายงานซ่อม',
        message: `${updated.ticket_no} · ${updated.problem_title} · ${updated.location_text}`,
        request_id: updated.request_id,
        ref_key: `assigned_repair:${updated.request_id}:${tech.user_id}:${now.stamp}`
      });
    }
    return updated;
  },
  // Technician updates the work status; keeps timeline, completed_date and equipment status consistent
  updateRepairProgress(ticketNo, { status, note, expected_date, expected_time, repair_image }, actorName) {
    const repair = this.getRepairByTicket(ticketNo);
    if (!repair || !repair.technician_id) return null;
    const now = ThaiDate.now();
    const isDone = status === 'เสร็จสิ้น';
    const timeline = (repair.timeline || []).map(step => {
      if (step.step === 3) {
        if (status === 'รอดำเนินการ') return { ...step, status: 'active', user_info: 'รอเริ่มดำเนินการ', note: '' };
        if (status === 'กำลังดำเนินการ') return { ...step, status: 'active', user_info: `${actorName} · ${now.stamp}`, note: note };
        if (isDone) {
          return step.status === 'pending' || step.user_info === 'รอเริ่มดำเนินการ'
            ? { ...step, status: 'done', user_info: `${actorName} · ${now.stamp}`, note: note }
            : { ...step, status: 'done' };
        }
      }
      if (step.step === 4) {
        return isDone
          ? { ...step, status: 'done', user_info: `${actorName} · ${now.stamp}`, note: `ซ่อมเสร็จ: ${note}` }
          : { ...step, status: 'pending', user_info: 'รอช่างดำเนินการและผู้แจ้งยืนยัน', note: '' };
      }
      return step;
    });
    const updated = this.updateRepair(ticketNo, {
      status,
      repair_note: note,
      expected_date,
      expected_time,
      repair_image: repair_image !== undefined ? repair_image : repair.repair_image,
      completed_date: isDone ? `${now.date} ${now.time.replace(' น.', '')}` : null,
      updated_at: now.stamp,
      timeline
    });
    this.syncEquipmentStatus(repair.equipment_id);
    return updated;
  },
  // Equipment status follows its open repair requests
  syncEquipmentStatus(equipmentId) {
    if (!equipmentId) return;
    const open = this.getRepairs().filter(r => r.equipment_id === equipmentId && r.status !== 'เสร็จสิ้น');
    let status = 'ใช้งานปกติ';
    if (open.some(r => r.status === 'กำลังดำเนินการ')) status = 'อยู่ระหว่างซ่อม';
    else if (open.length > 0) status = 'รอตรวจสอบ';
    const list = this.getEquipment();
    const eq = list.find(e => e.equipment_id === equipmentId);
    if (eq && eq.status !== status) {
      eq.status = status;
      this.set('equipment', list);
    }
  },
  addEquipment(item) {
    const list = this.getEquipment();
    const newId = list.length > 0 ? Math.max(...list.map(e => e.equipment_id)) + 1 : 1;
    const newItem = {
      equipment_id: newId,
      ...item
    };
    list.unshift(newItem);
    this.set('equipment', list);
    return newItem;
  },
  // Nearest due date among the equipment's maintenance plans
  getNextDueDate(equipmentId) {
    const dates = this.getPlans()
      .filter(p => p.equipment_id === equipmentId)
      .map(p => ThaiDate.parse(p.next_due_date))
      .filter(Boolean)
      .sort((a, b) => a - b);
    return dates.length ? ThaiDate.format(dates[0]) : null;
  },
  addPlan(plan) {
    const equipment = this.getEquipmentById(plan.equipment_id);
    if (!equipment || !this.canHandle(plan.technician_id, equipment.category_id)) return null;
    const list = this.getPlans();
    const newId = list.length > 0 ? Math.max(...list.map(p => p.plan_id)) + 1 : 1;
    const newPlan = {
      plan_id: newId,
      ...plan
    };
    list.unshift(newPlan);
    this.set('plans', list);
    this.addNotification({
      user_id: newPlan.technician_id,
      type: 'assigned_plan',
      title: 'ได้รับมอบหมายแผนบำรุงรักษา',
      message: `${newPlan.code} · ${newPlan.task} · ${newPlan.equipment_name} · กำหนด ${newPlan.next_due_date}`,
      plan_id: newPlan.plan_id,
      ref_key: `assigned_plan:${newPlan.plan_id}`
    });
    return newPlan;
  },
  updatePlan(planId, data) {
    const list = this.getPlans();
    const index = list.findIndex(p => p.plan_id === Number(planId));
    if (index === -1) return null;
    list[index] = { ...list[index], ...data };
    this.set('plans', list);
    return list[index];
  },
  // Status derived from the due date: overdue / due within 7 days / scheduled
  getPlanStatus(plan) {
    const due = ThaiDate.parse(plan.next_due_date);
    if (!due) return plan.status || 'รอดำเนินการ';
    const days = Math.round((due - ThaiDate.today()) / 86400000);
    if (days < 0) return 'เกินกำหนด';
    if (days <= 7) return 'ใกล้ครบกำหนด';
    return 'รอดำเนินการ';
  },
  // ---------------------------------------------------------------- Notifications
  getNotifications() {
    return this.get('notifications', []);
  },
  getNotificationsFor(userId) {
    return this.getNotifications()
      .filter(n => n.user_id === Number(userId))
      .sort((a, b) => (b.created_at > a.created_at ? 1 : -1));
  },
  getUnreadCount(userId) {
    return this.getNotificationsFor(userId).filter(n => !n.is_read).length;
  },
  // ref_key makes each event notify a user only once (e.g. one overdue alert per deadline)
  addNotification({ user_id, type, title, message, request_id = null, plan_id = null, ref_key, created_at, is_read = false }) {
    const list = this.getNotifications();
    if (ref_key && list.some(n => n.user_id === user_id && n.ref_key === ref_key)) return null;
    const notification = {
      notification_id: list.length ? Math.max(...list.map(n => n.notification_id)) + 1 : 1,
      user_id, type, title, message, request_id, plan_id,
      ref_key: ref_key || null,
      is_read,
      created_at: created_at || new Date().toISOString()
    };
    list.push(notification);
    this.set('notifications', list);
    return notification;
  },
  markNotificationRead(notificationId) {
    const list = this.getNotifications();
    const n = list.find(n => n.notification_id === Number(notificationId));
    if (n && !n.is_read) {
      n.is_read = true;
      this.set('notifications', list);
    }
  },
  markAllNotificationsRead(userId) {
    const list = this.getNotifications();
    list.forEach(n => { if (n.user_id === Number(userId)) n.is_read = true; });
    this.set('notifications', list);
  },
  // Deadline = ETA from the technician, or request time + days by priority when no ETA yet
  getRepairDeadline(repair) {
    if (repair.expected_date) {
      const eta = ThaiDate.parseDateTime(repair.expected_date, repair.expected_time || '23:59');
      if (eta) return eta;
    }
    const requested = ThaiDate.parseDateTime(repair.request_date, repair.request_time);
    if (!requested) return null;
    requested.setDate(requested.getDate() + (PRIORITY_DUE_DAYS[repair.priority] || 3));
    return requested;
  },
  isRepairOverdue(repair) {
    if (repair.status === 'เสร็จสิ้น') return false;
    const deadline = this.getRepairDeadline(repair);
    return !!deadline && deadline < new Date();
  },
  // Create overdue alerts for the responsible technician and every admin (run on each page load)
  checkOverdue() {
    const admins = this.getAdmins();
    this.getRepairs().filter(r => this.isRepairOverdue(r)).forEach(r => {
      const deadline = this.getRepairDeadline(r);
      const tech = r.technician_id ? this.getUserById(r.technician_id) : null;
      const recipients = [...(tech ? [tech] : []), ...admins];
      recipients.forEach(u => this.addNotification({
        user_id: u.user_id,
        type: 'overdue_repair',
        title: 'งานซ่อมเกินกำหนด',
        message: `${r.ticket_no} · ${r.problem_title} · กำหนด ${ThaiDate.formatDateTime(deadline)}` +
          (u.role === ROLE_ADMIN ? ` · ${tech ? `ช่าง ${tech.full_name}` : 'ยังไม่ได้มอบหมายช่าง'}` : ''),
        request_id: r.request_id,
        ref_key: `overdue_repair:${r.request_id}:${deadline.toISOString()}`
      }));
    });
    this.getPlans().filter(p => this.getPlanStatus(p) === 'เกินกำหนด').forEach(p => {
      const tech = this.getUserById(p.technician_id);
      const recipients = [...(tech ? [tech] : []), ...admins];
      recipients.forEach(u => this.addNotification({
        user_id: u.user_id,
        type: 'overdue_plan',
        title: 'แผนบำรุงรักษาเกินกำหนด',
        message: `${p.code} · ${p.task} · ${p.equipment_name} · กำหนด ${p.next_due_date}` +
          (u.role === ROLE_ADMIN && tech ? ` · ผู้รับผิดชอบ ${tech.full_name}` : ''),
        plan_id: p.plan_id,
        ref_key: `overdue_plan:${p.plan_id}:${p.next_due_date}`
      }));
    });
  },
  // Sample data: technicians already have "assigned" notices for their open jobs
  seedAssignmentNotifications() {
    this.getRepairs().filter(r => r.technician_id && r.status !== 'เสร็จสิ้น').forEach(r => {
      const at = ThaiDate.parseDateTime(r.assigned_date) || new Date();
      this.addNotification({
        user_id: r.technician_id,
        type: 'assigned_repair',
        title: 'ได้รับมอบหมายงานซ่อม',
        message: `${r.ticket_no} · ${r.problem_title} · ${r.location_text}`,
        request_id: r.request_id,
        ref_key: `assigned_repair:${r.request_id}:${r.technician_id}:seed`,
        created_at: at.toISOString(),
        is_read: r.status !== 'รอดำเนินการ'
      });
    });
  },
  // Record that maintenance was done today; next due = today + plan frequency
  recordMaintenance(planId, actorName) {
    const plan = this.getPlans().find(p => p.plan_id === Number(planId));
    if (!plan) return null;
    const today = ThaiDate.today();
    const next = ThaiDate.addMonths(today, frequencyToMonths(plan.frequency));
    return this.updatePlan(planId, {
      last_done_date: ThaiDate.format(today),
      last_done_by: actorName,
      next_due_date: ThaiDate.format(next)
    });
  }
};

// Initialize DB immediately
DB.init();
