export type UserRole = 'admin' | 'teacher' | 'student';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type ExamModule =
  | 'Grammatik'
  | 'Lesen'
  | 'Hören'
  | 'Schreiben'
  | 'Sprechen'
  | 'Wortschatz'
  | 'Goethe-Modelltest'
  | 'Gesamtprüfung';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  salt: string;
  isDefaultPassword?: boolean;
  studentId?: string;
  teacherId?: string;
  targetLevel?: CEFRLevel;
  currentLevel?: CEFRLevel;
  assignedBatchIds?: string[];
  phone?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export type OptionLetter = 'A' | 'B' | 'C' | 'D' | 'E';

export interface QuestionOption {
  id: string;
  label: OptionLetter;
  text: string;
}

export interface Question {
  id: string;
  prompt: string;
  contextNote?: string;
  optionCount: 3 | 4 | 5;
  options: QuestionOption[];
  correctOption: OptionLetter;
  explanation: string;
  points: number;
}

export type PaperStatus = 'live' | 'draft' | 'saved' | 'paused' | 'closed';

export interface ExamPaper {
  id: string;
  title: string;
  description: string;
  key: string; // e.g. "#1234", "#A1-102"
  level: CEFRLevel;
  status: PaperStatus;
  durationMinutes: number;
  passPercentage: number;
  category: ExamModule;
  questions: Question[];
  authorName: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
  answerKeyNotes?: string;
  pdfExportAvailable?: boolean;
}

export interface StudentResponse {
  questionId: string;
  selectedOption: OptionLetter;
  isCorrect: boolean;
  pointsEarned: number;
  answeredAt: string;
}

export interface ExamSubmission {
  id: string;
  paperId: string;
  paperTitle: string;
  paperLevel: CEFRLevel;
  paperKey: string;
  studentId: string;
  studentUsername: string;
  studentName: string;
  studentEmail: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  submittedAt: string;
  timeSpentSeconds: number;
  responses: StudentResponse[];
  verifiedByAdmin: boolean;
  adminNotes?: string;
}

// ----------------------------------------------------------------------
// INSTITUTE / ACADEMY MANAGEMENT SCHEMAS
// ----------------------------------------------------------------------

export interface Batch {
  id: string;
  name: string;
  level: CEFRLevel;
  teacherId: string;
  teacherName: string;
  schedule: string;
  roomOrLink: string;
  capacity: number;
  enrolledCount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed' | 'archived';
  notes?: string;
  isDeleted?: boolean;
}

export interface PromotionRecord {
  id: string;
  fromLevel: CEFRLevel;
  toLevel: CEFRLevel;
  promotedAt: string;
  promotedBy: string;
  examScore?: number;
  remarks: string;
}

export interface StudentAdmission {
  id: string;
  studentId: string; // e.g. "DK-2026-001"
  userId?: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  cnicOrPassport: string;
  dob: string;
  currentLevel: CEFRLevel;
  targetLevel: CEFRLevel;
  batchId: string;
  batchName: string;
  admissionDate: string;
  feeAgreed: number;
  status: 'active' | 'on_hold' | 'promoted' | 'graduated';
  notes?: string;
  promotionHistory: PromotionRecord[];
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceEntry {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  note?: string;
}

export interface AttendanceSession {
  id: string;
  batchId: string;
  batchName: string;
  date: string; // YYYY-MM-DD
  markedBy: string;
  markedByRole: UserRole;
  topicCovered?: string;
  entries: AttendanceEntry[];
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  receiptNumber: string;
  date: string;
  amount: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Card' | 'EasyPaisa/JazzCash';
  recordedBy: string;
  notes?: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  batchId: string;
  batchName: string;
  level: CEFRLevel;
  totalFee: number;
  discount: number;
  netFee: number;
  paidAmount: number;
  balanceDue: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  transactions: PaymentTransaction[];
  updatedAt: string;
}

export interface PaymentReceipt {
  receiptNumber: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  batchName: string;
  level: CEFRLevel;
  transactionDate: string;
  amountPaid: number;
  totalFee: number;
  balanceRemaining: number;
  paymentMethod: string;
  recordedBy: string;
  instituteTitle: string;
  note?: string;
}

export interface GoethePruefungFile {
  id: string;
  title: string;
  level: CEFRLevel;
  type: 'Modelltest' | 'Leseverstehen' | 'Hörverstehen' | 'Schreiben' | 'Sprechen' | 'Grammatik & Wortschatz';
  description: string;
  filename: string;
  filesize: string;
  uploadDate: string;
  uploadedBy: string;
  isAuthorized: boolean;
  contentSnippet: string;
  answerKeyAvailable: boolean;
  audioGuideAvailable?: boolean;
}

export interface TrashItem {
  id: string;
  itemType: 'paper' | 'batch' | 'student' | 'file';
  itemTitle: string;
  itemLevel?: CEFRLevel;
  deletedAt: string;
  deletedBy: string;
  originalData: any;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'fee' | 'attendance' | 'exam';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorUsername: string;
  actorRole: UserRole;
  action: string;
  details: string;
  severity: 'info' | 'warning' | 'security';
}
