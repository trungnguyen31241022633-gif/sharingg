export interface SubLink {
  label: string;
  url: string;
}

export interface Course {
  id: string;
  title: string;
  hashtags: string[];
  link: string;
  type: 'external' | 'modal' | 'form';
  subLinks?: SubLink[];
  category: 'Môn học' | 'Chứng chỉ' | 'Kỹ năng' | 'Khác';
  description?: string;
}

export const COURSES: Course[] = [
  {
    id: 'nlkt',
    title: 'Môn Nguyên lý kế toán',
    hashtags: ['NLKT', 'Môn học'],
    link: 'https://drive.google.com/drive/folders/1b9BtHWrP2rn41XD3oWjgLx3OYkJK54Q1?usp=drive_link',
    type: 'external',
    category: 'Môn học',
  },
  {
    id: 'ktvm-micro',
    title: 'Môn Kinh tế vi mô',
    hashtags: ['Kinh tế vi mô', 'Môn học'],
    link: 'https://drive.google.com/drive/folders/1GpFxCBjDc1HOzvPbs8pMWoJp2GOrgo1o?usp=drive_link',
    type: 'external',
    category: 'Môn học',
  },
  {
    id: 'lsd',
    title: 'Lịch sử đảng',
    hashtags: ['LSĐ', 'Môn học'],
    link: 'https://drive.google.com/drive/folders/1whOA1q4vt6KxDlv3HeeVivmVU5mTCjTX?usp=drive_link',
    type: 'external',
    category: 'Môn học',
  },
  {
    id: 'cob1',
    title: 'COB1',
    hashtags: ['COB1', 'Môn học'],
    link: 'https://drive.google.com/drive/folders/1x5kCfZqXylaotPj_qYsaxoG2u7LRs3jI?usp=drive_link',
    type: 'external',
    category: 'Môn học',
  },
  {
    id: 'cob2',
    title: 'COB2',
    hashtags: ['COB2', 'Môn học'],
    link: 'https://drive.google.com/drive/folders/14aUhB5YmcRT0YGKd9ldI9WPMKeu6pp0N?usp=drive_link',
    type: 'external',
    category: 'Môn học',
  },
  {
    id: 'lkd',
    title: 'Luật Kinh Doanh',
    hashtags: ['LKD', 'Môn học'],
    link: 'https://drive.google.com/drive/folders/1J9lc3ztlEjor6F7nHnbCAWrF2UVh-3mU?usp=drive_link',
    type: 'external',
    category: 'Môn học',
  },
  {
    id: 'ptdl',
    title: 'Phân Tích Định Lượng',
    hashtags: ['PTĐL', 'Môn học'],
    link: 'https://drive.google.com/drive/folders/1t4TYN8rOSvBBA8oCDjlyKIwW3uERtqwR?usp=drive_link',
    type: 'external',
    category: 'Môn học',
  },
  {
    id: 'ptbv',
    title: 'Phát Triển Bền Vững',
    hashtags: ['PTBV', 'Môn học'],
    link: 'https://drive.google.com/drive/folders/1ip2H6gky8Qx94__VVJLv2xI5ATJnn4YT?usp=drive_link',
    type: 'external',
    category: 'Môn học',
  },
  {
    id: 'mos2019',
    title: 'MOS 2019',
    hashtags: ['MOS', '2019', 'Chứng chỉ'],
    link: 'https://drive.google.com/drive/folders/1oAhQ3kD9ELKRk0XoUfZb5fx6o7XE4Rjv?usp=drive_link',
    type: 'external',
    category: 'Chứng chỉ',
  },
  {
    id: 'combo-tlh-tdtk-ktvm',
    title: 'Tâm Lý Học, Tư Duy Thiết Kế, Kinh Tế Vĩ Mô',
    hashtags: ['TLH', 'TDTK', 'KTVM'],
    link: 'https://drive.google.com/drive/folders/1NRzel2H7RMmNGV5oqP3XrzuDR5zEesb3?usp=drive_link',
    type: 'external',
    category: 'Môn học',
  },
  {
    id: 'hsk',
    title: 'Tiếng Trung (HSK 1-3)',
    hashtags: ['HSK', 'Chứng chỉ'],
    link: 'https://drive.google.com/drive/folders/1gizzNg1SsJVyzHpjEsgnRNbprzXiQLVp?usp=drive_link',
    type: 'external',
    category: 'Chứng chỉ',
  },
  {
    id: 'ktct',
    title: 'Kinh Tế Chính Trị',
    hashtags: ['KTCT', 'Môn học'],
    link: 'https://drive.google.com/drive/folders/1IwG_iPzOcFuoA8tajE1pFGeYFdRL5IBX?usp=drive_link',
    type: 'external',
    category: 'Môn học',
  },
  {
    id: 'tud',
    title: 'Toán Ứng Dụng (Toán Cao Cấp Cũ)',
    hashtags: ['TUD', 'TCC', 'Môn học'],
    link: 'https://drive.google.com/drive/folders/10jnT2CKT8nLlHWSHojfhYmMFYZ-hMEYq?usp=drive_link',
    type: 'external',
    category: 'Môn học',
  },
  {
    id: 'triet',
    title: 'Triết Học Mác - Lênin',
    hashtags: ['Triết', 'Môn học'],
    link: 'https://drive.google.com/drive/folders/1Q_GjzVeuSJty60ZCVgh8NudbBRyJkQrQ?usp=drive_link',
    type: 'external',
    category: 'Môn học',
  },
  {
    id: 'tdtk-full',
    title: 'Tư duy thiết kế (full quy trình, thiết kế)',
    hashtags: ['TDTK', 'empathy'],
    link: '#',
    type: 'modal',
    category: 'Kỹ năng',
    subLinks: [
      { label: 'Link phân công report', url: 'https://docs.google.com/spreadsheets/d/1z-iSJGTxwKwghq83xRtzkAvk98Gzzk0v74dNdOboYcs/edit?usp=sharing' },
      { label: 'Link report (khi đã pass gallerywalk)', url: 'https://docs.google.com/document/d/1WsyvlrEaKtame81zSwFYMYNHUHuAqRKvN4RTbSW3_k0/edit?usp=sharing' },
      { label: 'Link survey để ra được empathize & persona', url: 'https://docs.google.com/spreadsheets/d/1spD7-qbC4MXUeNd-cmw5ugg_zbcZHrC5/edit?usp=sharing&ouid=112157331897132436186&rtpof=true&sd=true' },
      { label: 'Link des của từng phần', url: 'https://docs.google.com/document/d/1dK0s6QKJbwLcOEzWOj75tfnPOx-fHFzryeannE7RuAQ/edit?usp=sharing' },
    ],
  },
  {
    id: 'google-site',
    title: 'Khóa kỹ năng: Tạo website với Google Site',
    hashtags: ['web', 'Google Site'],
    link: 'https://drive.google.com/file/d/1TJrUVpdfgueSh5-zKfo8bXr_-8CGZ1ER/view?usp=sharing',
    type: 'external',
    category: 'Kỹ năng',
  },
  {
    id: 'canva-pro',
    title: 'Khóa kỹ năng: Tài khoản Canva Pro',
    hashtags: ['Canva', 'Thiết kế'],
    link: 'https://forms.gle/b7N5DPU88PUpH4ey9',
    type: 'form',
    category: 'Kỹ năng',
    description: 'Bạn vui lòng điền form qua link bên dưới để nhận tài khoản.',
  },
  {
    id: 'marketing-cmo',
    title: 'Khóa: Case Marketing CMO (3 case)',
    hashtags: ['Case', 'Marketing'],
    link: 'https://drive.google.com/drive/folders/1nHVkYKzkYEL6WHS4qoAOcMknh18jzgzT?usp=sharing',
    type: 'external',
    category: 'Khác',
  },
  {
    id: 'marketing-diverse',
    title: 'Khóa: Case Marketing (đa dạng case)',
    hashtags: ['Case', 'Marketing'],
    link: 'https://drive.google.com/drive/folders/17A-CJNNZiWejR7NVbrae7MUH1gbEdAIj?usp=sharing',
    type: 'external',
    category: 'Khác',
  },
  {
    id: 'aptitude-test',
    title: 'Khóa: Aptitude test',
    hashtags: ['test', 'aptitude'],
    link: 'https://drive.google.com/drive/folders/1ngFYWbnExUfZDMtcu4YJZWwUS0MX5xyn?usp=drive_link',
    type: 'external',
    category: 'Khác',
  },
  {
    id: 'shopee-sales',
    title: 'Khóa: Bán hàng Shopee',
    hashtags: ['Shopee', 'vận hành'],
    link: 'https://drive.google.com/drive/folders/15fBjr3VyhljC7y7w5eK7vbJOcOveVeji?usp=sharing',
    type: 'external',
    category: 'Khác',
  },
  {
    id: 'voltria-startup',
    title: 'Khóa: Tài liệu cuộc thi start-up Seeds of Change (dự án Voltria)',
    hashtags: ['Voltria', 'startup', 'SOC'],
    link: 'https://drive.google.com/drive/folders/1tfMLxjXCE1NY0Uw9ncPx6hw0HTg2HOuV?usp=sharing',
    type: 'external',
    category: 'Khác',
  },
];
