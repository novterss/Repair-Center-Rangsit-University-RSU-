/* ==========================================================================
   ระบบแจ้งซ่อมและบำรุงรักษา มหาวิทยาลัยรังสิต (RSU Repair & Maintenance System)
   สำนักงานอาคารและสิ่งแวดล้อม (ตึก 13) - มหาวิทยาลัยรังสิต (Rangsit University)
   Data Layer - ERD based storage & LocalStorage Mock DB
   ========================================================================== */

const STORAGE_KEY_PREFIX = 'rsu_repair_v5_';

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
  }
];

const DEFAULT_EQUIPMENT = [
  {
    equipment_id: 1,
    asset_no: "AC-003",
    equipment_name: "เครื่องปรับอากาศ 24,000 บีทียู",
    category: "ระบบปรับอากาศ",
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
    category: "อุปกรณ์สำนักงาน",
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
    category: "ระบบไฟฟ้า",
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
    category: "ระบบประปา",
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
    category: "คอมพิวเตอร์",
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
    category: "อาคารและสถานที่",
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
    category: "ระบบปรับอากาศ",
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
    category: "ระบบปรับอากาศ",
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
    technician_id: 2,
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
        note: "มอบหมายให้ ธนากร ยั่งยืน",
        status: "done"
      },
      {
        step: 3,
        title: "กำลังดำเนินการ",
        user_info: "ธนากร ยั่งยืน · 28 ต.ค., 09:00 น.",
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
    technician_id: 2,
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
        note: "มอบหมายให้ ธนากร ยั่งยืน",
        status: "done"
      },
      {
        step: 3,
        title: "กำลังดำเนินการ",
        user_info: "ธนากร ยั่งยืน · 27 ต.ค., 10:30 น.",
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
    technician_id: 4,
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
        note: "มอบหมายให้ ณภัทร สาระคำ",
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
    technician_name: "ธนากร ยั่งยืน",
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
    technician_name: "ธนากร ยั่งยืน",
    status: "ใกล้ครบกำหนด"
  },
  {
    plan_id: 3,
    code: "PM-6910-022",
    equipment_id: 7,
    technician_id: 4,
    equipment_name: "AC-004 · เครื่องปรับอากาศ",
    location: "ตึก 5 อาคารวิษณุรัตน์ · ชั้น 3",
    task: "ล้างแผงกรอง / ตรวจน้ำยา",
    frequency: "ทุก 3 เดือน",
    next_due_date: "30 ต.ค. 2569",
    technician_name: "ณภัทร สาระคำ",
    status: "ใกล้ครบกำหนด"
  },
  {
    plan_id: 4,
    code: "PM-6911-001",
    equipment_id: 2,
    technician_id: 5,
    equipment_name: "PR-012 · เครื่องพิมพ์เลเซอร์",
    location: "ตึก 11 อาคารรัตนคุณากร · ชั้น 1",
    task: "ทำความสะอาด / ทดสอบพิมพ์",
    frequency: "ทุก 6 เดือน",
    next_due_date: "3 พ.ย. 2569",
    technician_name: "ชาติวุฒิ ทองจีน",
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
    technician_name: "ณภัทร สาระคำ",
    status: "รอดำเนินการ"
  },
  {
    plan_id: 6,
    code: "PM-6911-003",
    equipment_id: 5,
    technician_id: 5,
    equipment_name: "PC-045 · เครื่อง Mac ตัดต่อ",
    location: "ตึก 15 Digital Multimedia · ชั้น 4",
    task: "ทำความสะอาด / ตรวจระบบ",
    frequency: "ทุก 6 เดือน",
    next_due_date: "6 พ.ย. 2569",
    technician_name: "ชาติวุฒิ ทองจีน",
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
    technician_name: "ณภัทร สาระคำ",
    status: "รอดำเนินการ"
  }
];

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
      ['rsu_repair_sys_', 'rsu_repair_v2_', 'rsu_repair_v3_', 'rsu_repair_v4_'].forEach(p => {
        if (p !== STORAGE_KEY_PREFIX) {
          Object.keys(localStorage).filter(k => k.startsWith(p)).forEach(k => localStorage.removeItem(k));
        }
      });
    } catch(e) {}

    const existingUsers = this.get('users');
    const isOldData = !existingUsers || !Array.isArray(existingUsers) || !existingUsers.some(u => u.student_id === "6800401");
    if (isOldData) {
      this.set('users', DEFAULT_USERS);
      this.set('currentUser', DEFAULT_USERS[0]);
      this.set('repairs', DEFAULT_REPAIRS);
      this.set('equipment', DEFAULT_EQUIPMENT);
      this.set('plans', DEFAULT_MAINTENANCE_PLANS);
    } else {
      if (!this.get('equipment')) this.set('equipment', DEFAULT_EQUIPMENT);
      if (!this.get('repairs')) this.set('repairs', DEFAULT_REPAIRS);
      if (!this.get('plans')) this.set('plans', DEFAULT_MAINTENANCE_PLANS);
      if (!this.get('currentUser')) this.set('currentUser', DEFAULT_USERS[0]);
    }
  },
  isLoggedIn() {
    return localStorage.getItem(STORAGE_KEY_PREFIX + 'is_logged_in') === 'true';
  },
  setLoggedIn(status) {
    if (status) {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'is_logged_in', 'true');
    } else {
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'is_logged_in');
    }
  },
  logout() {
    this.setLoggedIn(false);
    window.location.href = 'login.html';
  },
  getCurrentUser() {
    return this.get('currentUser', DEFAULT_USERS[0]);
  },
  setCurrentUser(userId) {
    const users = this.get('users', DEFAULT_USERS);
    const user = users.find(u => u.user_id === Number(userId));
    if (user) {
      this.set('currentUser', user);
      return user;
    }
    return null;
  },
  getUsers() {
    return this.get('users', DEFAULT_USERS);
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
  resetPassword(email, newPassword) {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.password = newPassword;
      this.set('users', users);
      const current = this.getCurrentUser();
      if (current && current.email.toLowerCase() === email.toLowerCase()) {
        current.password = newPassword;
        this.set('currentUser', current);
      }
      return user;
    }
    return null;
  },
  getEquipment() {
    return this.get('equipment', DEFAULT_EQUIPMENT);
  },
  getRepairs() {
    return this.get('repairs', DEFAULT_REPAIRS);
  },
  getPlans() {
    return this.get('plans', DEFAULT_MAINTENANCE_PLANS);
  },
  addRepair(request) {
    const repairs = this.getRepairs();
    const newId = repairs.length > 0 ? Math.max(...repairs.map(r => r.request_id)) + 1 : 1;
    const ticketNo = `RQ-691028-${String(newId).padStart(3, '0')}`;
    
    const newRecord = {
      request_id: newId,
      ticket_no: ticketNo,
      ...request,
      request_date: "28 ต.ค. 2569",
      request_time: "11:30 น.",
      request_datetime: "28 ตุลาคม 2569 เวลา 11:30 น.",
      timeline: [
        {
          step: 1,
          title: "ส่งคำขอแจ้งซ่อม",
          user_info: `${request.requester_name || "ณพัชรกัณฑ์ พัชญ์ชัยพงศา"} · 28 ต.ค. 2569, 11:30 น.`,
          note: request.problem_title || request.problem_detail?.substring(0, 30),
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
  addPlan(plan) {
    const list = this.getPlans();
    const newId = list.length > 0 ? Math.max(...list.map(p => p.plan_id)) + 1 : 1;
    const newPlan = {
      plan_id: newId,
      ...plan
    };
    list.unshift(newPlan);
    this.set('plans', list);
    return newPlan;
  }
};

// Initialize DB immediately
DB.init();
