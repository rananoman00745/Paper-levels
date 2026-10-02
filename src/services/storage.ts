import {
  ExamPaper,
  ExamSubmission,
  User,
  AuditLog,
  PaperStatus,
  Batch,
  StudentAdmission,
  AttendanceSession,
  FeeRecord,
  PaymentReceipt,
  GoethePruefungFile,
  TrashItem,
  CEFRLevel,
  UserRole,
} from '../types/exam';
import { hashPassword } from '../utils/crypto';
import { examGenerator } from './examGenerator';

const STORAGE_KEYS = {
  USERS: 'deutschkurs_users_v3',
  PAPERS: 'deutschkurs_papers_v3',
  SUBMISSIONS: 'deutschkurs_submissions_v3',
  BATCHES: 'deutschkurs_batches_v3',
  ADMISSIONS: 'deutschkurs_admissions_v3',
  ATTENDANCE: 'deutschkurs_attendance_v3',
  FEES: 'deutschkurs_fees_v3',
  GOETHE_FILES: 'deutschkurs_goethe_files_v3',
  TRASH: 'deutschkurs_trash_v3',
  LOGS: 'deutschkurs_logs_v3',
  ACTIVE_SESSION: 'deutschkurs_session_v3',
};

// Initial default paper with key #1234
const INITIAL_PAPERS: ExamPaper[] = [
  {
    id: 'paper-b1-1234',
    title: 'Goethe-Zertifikat B1: Grammatik & Sprachbausteine',
    description: 'Offizielle B1 Modulprüfung zur Überprüfung von Nebensätzen, Präpositionen mit Kasus, Modalverben und Konjunktiv II.',
    key: '#1234',
    level: 'B1',
    status: 'live',
    durationMinutes: 25,
    passPercentage: 60,
    category: 'Goethe-Modelltest',
    authorName: 'Prof. Dr. Anna Lindemann',
    createdAt: '2026-09-28T09:00:00.000Z',
    updatedAt: '2026-10-01T08:00:00.000Z',
    questions: [
      {
        id: 'q-1',
        prompt: 'Er konnte gestern nicht zum Deutschunterricht kommen, _____ er krank im Bett lag.',
        contextNote: 'Kausale Satzverbindung & Nebensatzstellung (Verb am Ende)',
        optionCount: 4,
        options: [
          { id: 'opt-1-a', label: 'A', text: 'weil' },
          { id: 'opt-1-b', label: 'B', text: 'denn' },
          { id: 'opt-1-c', label: 'C', text: 'deshalb' },
          { id: 'opt-1-d', label: 'D', text: 'nämlich' },
        ],
        correctOption: 'A',
        explanation: '„weil“ leitet einen Kausalsatz ein und verlangt das finite Verb am Satzende („lag“). „denn“ würde Position 0 erfordern.',
        points: 10,
      },
      {
        id: 'q-2',
        prompt: 'Ich fahre am Wochenende mit _____ Zug nach Frankfurt.',
        contextNote: 'Präposition mit Dativ (mit + Dativ)',
        optionCount: 4,
        options: [
          { id: 'opt-2-a', label: 'A', text: 'dem' },
          { id: 'opt-2-b', label: 'B', text: 'den' },
          { id: 'opt-2-c', label: 'C', text: 'der' },
          { id: 'opt-2-d', label: 'D', text: 'des' },
        ],
        correctOption: 'A',
        explanation: 'Die Präposition „mit“ verlangt immer den Dativ. „Der Zug“ (maskulin) wird im Dativ zu „dem Zug“.',
        points: 10,
      },
      {
        id: 'q-3',
        prompt: 'Wenn ich jetzt Urlaub hätte, _____ ich sofort in die Berge fahren.',
        contextNote: 'Konjunktiv II (Gegenwart / irreale Wünsche)',
        optionCount: 5,
        options: [
          { id: 'opt-3-a', label: 'A', text: 'würde' },
          { id: 'opt-3-b', label: 'B', text: 'werde' },
          { id: 'opt-3-c', label: 'C', text: 'hatte' },
          { id: 'opt-3-d', label: 'D', text: 'wäre' },
          { id: 'opt-3-e', label: 'E', text: 'könnte' },
        ],
        correctOption: 'A',
        explanation: 'Für irreale Bedingungen in der Gegenwart mit Verben wie „fahren“ benutzt man „würde + Infinitiv“: „...würde ich fahren.“',
        points: 10,
      },
      {
        id: 'q-4',
        prompt: 'Welcher bestimmte Artikel gehört grammatikalisch korrekt zum Nomen „Mädchen“?',
        contextNote: 'Genusregel für Diminutive auf -chen',
        optionCount: 3,
        options: [
          { id: 'opt-4-a', label: 'A', text: 'das' },
          { id: 'opt-4-b', label: 'B', text: 'die' },
          { id: 'opt-4-c', label: 'C', text: 'der' },
        ],
        correctOption: 'A',
        explanation: 'Alle deutschen Nomen mit der Verkleinerungsendung „-chen“ oder „-lein“ sind ausnahmslos neutral: „das Mädchen“.',
        points: 10,
      },
      {
        id: 'q-5',
        prompt: 'Frau Klein interessiert sich schon seit Jahren sehr _____ zeitgenössische Kunst.',
        contextNote: 'Feste Nomen-Verb-Präposition-Verbindung',
        optionCount: 5,
        options: [
          { id: 'opt-5-a', label: 'A', text: 'für' },
          { id: 'opt-5-b', label: 'B', text: 'über' },
          { id: 'opt-5-c', label: 'C', text: 'an' },
          { id: 'opt-5-d', label: 'D', text: 'auf' },
          { id: 'opt-5-e', label: 'E', text: 'nach' },
        ],
        correctOption: 'A',
        explanation: '„sich interessieren für + Akkusativ“ ist eine feste Verbindung: „für zeitgenössische Kunst“.',
        points: 10,
      },
      {
        id: 'q-6',
        prompt: 'Könnten Sie mir bitte sagen, _____ die Sprachschule am Samstag geöffnet ist?',
        contextNote: 'Indirekte Fragesätze mit ob (Entscheidungsfragen)',
        optionCount: 4,
        options: [
          { id: 'opt-6-a', label: 'A', text: 'ob' },
          { id: 'opt-6-b', label: 'B', text: 'dass' },
          { id: 'opt-6-c', label: 'C', text: 'wenn' },
          { id: 'opt-6-d', label: 'D', text: 'wann' },
        ],
        correctOption: 'A',
        explanation: 'Indirekte Ja/Nein-Fragen (Entscheidungsfragen) werden mit der Konjunktion „ob“ eingeleitet.',
        points: 10,
      },
    ],
  },
];

// Initial pre-seeded batches
const INITIAL_BATCHES: Batch[] = [
  {
    id: 'batch-a1-morn',
    name: 'Morgenkurs A1 - Grundstufe Intensiv',
    level: 'A1',
    teacherId: 'usr-teacher-1',
    teacherName: 'Prof. Dr. Anna Lindemann',
    schedule: 'Mo–Do 09:00 – 11:30 Uhr',
    roomOrLink: 'Präsenz Raum 101 / Zoom Live',
    capacity: 20,
    enrolledCount: 14,
    startDate: '2026-09-01',
    endDate: '2026-11-15',
    status: 'active',
    notes: 'Schwerpunkt: Phonetik, Alltagssprache, Alphabet & Goethe A1 Prüfungsvorbereitung.',
  },
  {
    id: 'batch-b1-eve',
    name: 'Abendkurs B1 - Goethe Zertifikat',
    level: 'B1',
    teacherId: 'usr-teacher-1',
    teacherName: 'Prof. Dr. Anna Lindemann',
    schedule: 'Mo/Mi/Fr 18:00 – 20:30 Uhr',
    roomOrLink: 'Präsenz Raum 204 / Hybrid',
    capacity: 25,
    enrolledCount: 18,
    startDate: '2026-08-15',
    endDate: '2026-11-30',
    status: 'active',
    notes: 'Fokus auf B1 Sprachbausteine Teil 1 & 2, Briefe, Konjunktiv II und Nebensätze.',
  },
  {
    id: 'batch-b2-pro',
    name: 'B2 Mittelstufe - Beruf & Akademisch',
    level: 'B2',
    teacherId: 'usr-teacher-2',
    teacherName: 'Stefan Meier, M.A.',
    schedule: 'Di & Do 17:30 – 20:45 Uhr',
    roomOrLink: 'Hörsaal 3 / Online Studio',
    capacity: 22,
    enrolledCount: 16,
    startDate: '2026-09-10',
    endDate: '2026-12-20',
    status: 'active',
    notes: 'Goethe B2 und TELC B2 Vorbereitung, Passivvarianten, Nomen-Verb-Verbindungen.',
  },
  {
    id: 'batch-c1-ober',
    name: 'C1 Oberstufe - Fachsprache & Hochschule',
    level: 'C1',
    teacherId: 'usr-teacher-2',
    teacherName: 'Stefan Meier, M.A.',
    schedule: 'Samstags 10:00 – 15:00 Uhr (Wochenend-Kompakt)',
    roomOrLink: 'Seminarraum C / Zoom',
    capacity: 15,
    enrolledCount: 11,
    startDate: '2026-09-05',
    endDate: '2026-12-15',
    status: 'active',
    notes: 'Akademisches Deutsch, erweiterte Partizipien, Textanalysen.',
  },
];

// Initial student admissions
const INITIAL_ADMISSIONS: StudentAdmission[] = [
  {
    id: 'adm-001',
    studentId: 'DK-2026-001',
    username: 'student',
    name: 'Max Mustermann',
    email: 'student@deutschkurs-noman.de',
    phone: '+49 170 1234567',
    cnicOrPassport: 'P94821034',
    dob: '2001-05-14',
    currentLevel: 'B1',
    targetLevel: 'B2',
    batchId: 'batch-b1-eve',
    batchName: 'Abendkurs B1 - Goethe Zertifikat',
    admissionDate: '2026-08-10',
    feeAgreed: 350,
    status: 'active',
    notes: 'Bereits A2 erfolgreich abgeschlossen mit 88%. Fleißiger Teilnehmer.',
    promotionHistory: [
      {
        id: 'promo-1',
        fromLevel: 'A2',
        toLevel: 'B1',
        promotedAt: '2026-08-10T10:00:00.000Z',
        promotedBy: 'admin',
        examScore: 88,
        remarks: 'Erfolgreich nach A2 Abschlussprüfung in B1 befördert.',
      },
    ],
  },
  {
    id: 'adm-002',
    studentId: 'DK-2026-002',
    username: 'hannah',
    name: 'Hannah Schmidt',
    email: 'hannah.s@campus-deutsch.de',
    phone: '+49 152 9876543',
    cnicOrPassport: 'P81239401',
    dob: '1999-11-20',
    currentLevel: 'B2',
    targetLevel: 'C1',
    batchId: 'batch-b2-pro',
    batchName: 'B2 Mittelstufe - Beruf & Akademisch',
    admissionDate: '2026-09-05',
    feeAgreed: 420,
    status: 'active',
    notes: 'Medizinstudentin, benötigt Goethe B2/C1 für Approbation.',
    promotionHistory: [],
  },
  {
    id: 'adm-003',
    studentId: 'DK-2026-003',
    username: 'ali',
    name: 'Ali Khan',
    email: 'ali.khan@deutschkurs-noman.de',
    phone: '+92 300 1234567',
    cnicOrPassport: 'PK-42101-839210-3',
    dob: '2003-02-18',
    currentLevel: 'A1',
    targetLevel: 'B1',
    batchId: 'batch-a1-morn',
    batchName: 'Morgenkurs A1 - Grundstufe Intensiv',
    admissionDate: '2026-09-01',
    feeAgreed: 300,
    status: 'active',
    notes: 'Neu eingeschrieben für Studienkolleg in Deutschland.',
    promotionHistory: [],
  },
];

// Initial Fee Records
const INITIAL_FEES: FeeRecord[] = [
  {
    id: 'fee-001',
    studentId: 'DK-2026-001',
    studentName: 'Max Mustermann',
    studentEmail: 'student@deutschkurs-noman.de',
    batchId: 'batch-b1-eve',
    batchName: 'Abendkurs B1 - Goethe Zertifikat',
    level: 'B1',
    totalFee: 350,
    discount: 50,
    netFee: 300,
    paidAmount: 300,
    balanceDue: 0,
    dueDate: '2026-09-01',
    status: 'paid',
    updatedAt: '2026-09-02T11:00:00.000Z',
    transactions: [
      {
        id: 'tx-001',
        receiptNumber: 'REC-2026-B1-001',
        date: '2026-08-12',
        amount: 300,
        paymentMethod: 'Bank Transfer',
        recordedBy: 'admin',
        notes: 'Vollständige Kursgebühr B1 Intensiv bezahlt.',
      },
    ],
  },
  {
    id: 'fee-002',
    studentId: 'DK-2026-002',
    studentName: 'Hannah Schmidt',
    studentEmail: 'hannah.s@campus-deutsch.de',
    batchId: 'batch-b2-pro',
    batchName: 'B2 Mittelstufe - Beruf & Akademisch',
    level: 'B2',
    totalFee: 420,
    discount: 20,
    netFee: 400,
    paidAmount: 250,
    balanceDue: 150,
    dueDate: '2026-10-15',
    status: 'partial',
    updatedAt: '2026-09-06T14:30:00.000Z',
    transactions: [
      {
        id: 'tx-002',
        receiptNumber: 'REC-2026-B2-002',
        date: '2026-09-06',
        amount: 250,
        paymentMethod: 'Card',
        recordedBy: 'admin',
        notes: '1. Rate bezahlt. Restfälligkeit 15. Oktober.',
      },
    ],
  },
  {
    id: 'fee-003',
    studentId: 'DK-2026-003',
    studentName: 'Ali Khan',
    studentEmail: 'ali.khan@deutschkurs-noman.de',
    batchId: 'batch-a1-morn',
    batchName: 'Morgenkurs A1 - Grundstufe Intensiv',
    level: 'A1',
    totalFee: 300,
    discount: 0,
    netFee: 300,
    paidAmount: 300,
    balanceDue: 0,
    dueDate: '2026-09-05',
    status: 'paid',
    updatedAt: '2026-09-01T09:15:00.000Z',
    transactions: [
      {
        id: 'tx-003',
        receiptNumber: 'REC-2026-A1-003',
        date: '2026-09-01',
        amount: 300,
        paymentMethod: 'Cash',
        recordedBy: 'admin',
        notes: 'Barzahlung bei Einschreibung im Büro.',
      },
    ],
  },
];

// Initial Attendance Sessions
const INITIAL_ATTENDANCE: AttendanceSession[] = [
  {
    id: 'att-b1-1',
    batchId: 'batch-b1-eve',
    batchName: 'Abendkurs B1 - Goethe Zertifikat',
    date: '2026-09-28',
    markedBy: 'Prof. Dr. Anna Lindemann',
    markedByRole: 'teacher',
    topicCovered: 'Nebensätze mit obwohl, während und da; Konjunktiv II Ratschläge',
    createdAt: '2026-09-28T20:30:00.000Z',
    entries: [
      { studentId: 'DK-2026-001', studentName: 'Max Mustermann', status: 'present', note: 'Aktiv beteiligt' },
      { studentId: 'DK-2026-002', studentName: 'Hannah Schmidt', status: 'present' },
    ],
  },
  {
    id: 'att-b1-2',
    batchId: 'batch-b1-eve',
    batchName: 'Abendkurs B1 - Goethe Zertifikat',
    date: '2026-09-30',
    markedBy: 'Prof. Dr. Anna Lindemann',
    markedByRole: 'teacher',
    topicCovered: 'Goethe B1 Sprachbausteine Teil 1 & 2 Modelltest Übung',
    createdAt: '2026-09-30T20:30:00.000Z',
    entries: [
      { studentId: 'DK-2026-001', studentName: 'Max Mustermann', status: 'present' },
      { studentId: 'DK-2026-002', studentName: 'Hannah Schmidt', status: 'late', note: '15 min Verspätung (Stau)' },
    ],
  },
];

// Goethe Prüfungen folder archive files (A1 to C2)
const INITIAL_GOETHE_FILES: GoethePruefungFile[] = [
  {
    id: 'g-file-a1',
    title: 'Goethe-Zertifikat A1: Start Deutsch 1 (Modellsatz 01)',
    level: 'A1',
    type: 'Modelltest',
    description: 'Offizieller Übungssatz mit Hören, Lesen, Schreiben und Sprechen sowie Transkriptionen und Antwortbogen.',
    filename: 'Goethe_Zertifikat_A1_Modellsatz_01.pdf',
    filesize: '2.4 MB',
    uploadDate: '2026-09-15',
    uploadedBy: 'Deutschkurs By Noman',
    isAuthorized: true,
    contentSnippet: 'Teil 1: Hören kurzer Gespräche. Teil 2: Ansagen am Bahnhof. Teil 3: Lesetexte und Notizen im Alltag.',
    answerKeyAvailable: true,
    audioGuideAvailable: true,
  },
  {
    id: 'g-file-a2',
    title: 'Goethe-Zertifikat A2: Modellsatz Prüfungstraining',
    level: 'A2',
    type: 'Modelltest',
    description: 'Vollständiger Modellprüfungsbogen A2 für Erwachsene mit integriertem Bewertungsraster.',
    filename: 'Goethe_Zertifikat_A2_Modellsatz.pdf',
    filesize: '3.1 MB',
    uploadDate: '2026-09-18',
    uploadedBy: 'Deutschkurs By Noman',
    isAuthorized: true,
    contentSnippet: 'Lesen: Zeitungsmeldungen, Werbungen, E-Mails. Schreiben: Persönliche Antwort-E-Mail (ca. 40 Wörter).',
    answerKeyAvailable: true,
    audioGuideAvailable: true,
  },
  {
    id: 'g-file-b1',
    title: 'Goethe-Zertifikat B1: Gesamt-Prüfungssatz (4 Module)',
    level: 'B1',
    type: 'Modelltest',
    description: 'Offizielles B1 Prüfungstraining: Lesen (Teile 1-5), Hören (Teile 1-4), Schreiben (Aufgaben 1-3) & Sprechen.',
    filename: 'Goethe_Zertifikat_B1_Vollstaendig.pdf',
    filesize: '4.8 MB',
    uploadDate: '2026-09-20',
    uploadedBy: 'Prof. Dr. Anna Lindemann',
    isAuthorized: true,
    contentSnippet: 'Modul Lesen: Blogbeiträge, Pressemitteilungen, Hausordnungen. Sprachbausteine und detaillierte Lösungen.',
    answerKeyAvailable: true,
    audioGuideAvailable: true,
  },
  {
    id: 'g-file-b2',
    title: 'Goethe-Zertifikat B2: Modellsatz & Wortschatzregister',
    level: 'B2',
    type: 'Modelltest',
    description: 'B2 Prüfungsmodell mit Fokus auf argumentative Texte, Forumsbeiträge und Geschäftskorrespondenz.',
    filename: 'Goethe_Zertifikat_B2_Modellsatz.pdf',
    filesize: '5.2 MB',
    uploadDate: '2026-09-22',
    uploadedBy: 'Stefan Meier, M.A.',
    isAuthorized: true,
    contentSnippet: 'Leseverstehen: Sachartikel & Kommentare. Schreiben: Diskussionsbeitrag zu aktuellen gesellschaftlichen Themen.',
    answerKeyAvailable: true,
    audioGuideAvailable: true,
  },
  {
    id: 'g-file-c1',
    title: 'Goethe-Zertifikat C1: Prüfungssatz für Studium und Beruf',
    level: 'C1',
    type: 'Modelltest',
    description: 'Akademischer C1 Modellsatz: Anspruchsvolle Lese- und Hörtexte, strukturierte Textproduktion.',
    filename: 'Goethe_Zertifikat_C1_Akademisch.pdf',
    filesize: '6.1 MB',
    uploadDate: '2026-09-25',
    uploadedBy: 'Deutschkurs By Noman',
    isAuthorized: true,
    contentSnippet: 'Lesen Teil 1: Wissenschaftlicher Fachtext. Teil 2: Textrekonstruktion. Schreiben: Stellungnahme anhand einer Grafik.',
    answerKeyAvailable: true,
    audioGuideAvailable: true,
  },
  {
    id: 'g-file-c2',
    title: 'Goethe-Zertifikat C2: Großes Deutsches Sprachdiplom (GDS)',
    level: 'C2',
    type: 'Modelltest',
    description: 'Höchste Sprachstufe: Feinsinnige Stilistik, literarische Textanalyse, nuancierter mündlicher Diskurs.',
    filename: 'Goethe_Zertifikat_C2_GDS_Modellsatz.pdf',
    filesize: '7.5 MB',
    uploadDate: '2026-09-26',
    uploadedBy: 'Deutschkurs By Noman',
    isAuthorized: true,
    contentSnippet: 'Lesen: Literarischer Essay. Sprachstrukturen: Stilistische Umformungen. Schreiben: Ausführliche Abhandlung.',
    answerKeyAvailable: true,
    audioGuideAvailable: true,
  },
];

// Initial submissions
const INITIAL_SUBMISSIONS: ExamSubmission[] = [
  {
    id: 'sub-sample-01',
    paperId: 'paper-b1-1234',
    paperTitle: 'Goethe-Zertifikat B1: Grammatik & Sprachbausteine',
    paperLevel: 'B1',
    paperKey: '#1234',
    studentId: 'DK-2026-001',
    studentUsername: 'student',
    studentName: 'Max Mustermann',
    studentEmail: 'student@deutschkurs-noman.de',
    score: 50,
    totalPoints: 60,
    percentage: 83,
    passed: true,
    startedAt: '2026-09-29T10:00:00.000Z',
    submittedAt: '2026-09-29T10:18:24.000Z',
    timeSpentSeconds: 1104,
    verifiedByAdmin: true,
    responses: [
      { questionId: 'q-1', selectedOption: 'A', isCorrect: true, pointsEarned: 10, answeredAt: '2026-09-29T10:03:00.000Z' },
      { questionId: 'q-2', selectedOption: 'A', isCorrect: true, pointsEarned: 10, answeredAt: '2026-09-29T10:06:00.000Z' },
      { questionId: 'q-3', selectedOption: 'A', isCorrect: true, pointsEarned: 10, answeredAt: '2026-09-29T10:09:00.000Z' },
      { questionId: 'q-4', selectedOption: 'A', isCorrect: true, pointsEarned: 10, answeredAt: '2026-09-29T10:12:00.000Z' },
      { questionId: 'q-5', selectedOption: 'A', isCorrect: true, pointsEarned: 10, answeredAt: '2026-09-29T10:15:00.000Z' },
      { questionId: 'q-6', selectedOption: 'B', isCorrect: false, pointsEarned: 0, answeredAt: '2026-09-29T10:18:00.000Z' },
    ],
  },
];

export const storageService = {
  // --------------------------------------------------------------------
  // INITIALIZATION
  // --------------------------------------------------------------------
  async initialize(): Promise<void> {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      const adminCreds = await hashPassword('adminadmin');
      const teacherCreds = await hashPassword('teacher123');
      const studentCreds = await hashPassword('student123');

      const initialUsers: User[] = [
        {
          id: 'usr-admin-1',
          username: 'admin',
          name: 'Noman (Institutsleitung)',
          email: 'admin@deutschkurs-noman.de',
          role: 'admin',
          passwordHash: adminCreds.hash,
          salt: adminCreds.salt,
          isDefaultPassword: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'usr-teacher-1',
          username: 'teacher',
          name: 'Prof. Dr. Anna Lindemann',
          email: 'anna.lindemann@deutschkurs-noman.de',
          role: 'teacher',
          teacherId: 'TCH-001',
          passwordHash: teacherCreds.hash,
          salt: teacherCreds.salt,
          isDefaultPassword: false,
          assignedBatchIds: ['batch-a1-morn', 'batch-b1-eve'],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'usr-teacher-2',
          username: 'lehrer.stefan',
          name: 'Stefan Meier, M.A.',
          email: 'stefan.meier@deutschkurs-noman.de',
          role: 'teacher',
          teacherId: 'TCH-002',
          passwordHash: teacherCreds.hash,
          salt: teacherCreds.salt,
          isDefaultPassword: false,
          assignedBatchIds: ['batch-b2-pro', 'batch-c1-ober'],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'usr-student-1',
          username: 'student',
          name: 'Max Mustermann',
          email: 'student@deutschkurs-noman.de',
          role: 'student',
          studentId: 'DK-2026-001',
          targetLevel: 'B2',
          currentLevel: 'B1',
          assignedBatchIds: ['batch-b1-eve'],
          passwordHash: studentCreds.hash,
          salt: studentCreds.salt,
          isDefaultPassword: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'usr-student-2',
          username: 'hannah',
          name: 'Hannah Schmidt',
          email: 'hannah.s@campus-deutsch.de',
          role: 'student',
          studentId: 'DK-2026-002',
          targetLevel: 'C1',
          currentLevel: 'B2',
          assignedBatchIds: ['batch-b2-pro'],
          passwordHash: studentCreds.hash,
          salt: studentCreds.salt,
          isDefaultPassword: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'usr-student-3',
          username: 'ali',
          name: 'Ali Khan',
          email: 'ali.khan@deutschkurs-noman.de',
          role: 'student',
          studentId: 'DK-2026-003',
          targetLevel: 'B1',
          currentLevel: 'A1',
          assignedBatchIds: ['batch-a1-morn'],
          passwordHash: studentCreds.hash,
          salt: studentCreds.salt,
          isDefaultPassword: false,
          createdAt: new Date().toISOString(),
        },
      ];

      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    }

    // Initialize Papers (seed all levels A1 to C2)
    if (!localStorage.getItem(STORAGE_KEYS.PAPERS)) {
      const generatedA1 = examGenerator.generateExamPaper({ level: 'A1', module: 'Goethe-Modelltest' });
      const generatedA2 = examGenerator.generateExamPaper({ level: 'A2', module: 'Goethe-Modelltest' });
      const generatedB2 = examGenerator.generateExamPaper({ level: 'B2', module: 'Goethe-Modelltest' });
      const generatedC1 = examGenerator.generateExamPaper({ level: 'C1', module: 'Goethe-Modelltest' });
      const generatedC2 = examGenerator.generateExamPaper({ level: 'C2', module: 'Goethe-Modelltest' });

      const allInitialPapers = [
        ...INITIAL_PAPERS,
        generatedA1,
        generatedA2,
        generatedB2,
        generatedC1,
        generatedC2,
      ];
      localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(allInitialPapers));
    }

    if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
    }

    if (!localStorage.getItem(STORAGE_KEYS.BATCHES)) {
      localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(INITIAL_BATCHES));
    }

    if (!localStorage.getItem(STORAGE_KEYS.ADMISSIONS)) {
      localStorage.setItem(STORAGE_KEYS.ADMISSIONS, JSON.stringify(INITIAL_ADMISSIONS));
    }

    if (!localStorage.getItem(STORAGE_KEYS.FEES)) {
      localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(INITIAL_FEES));
    }

    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
    }

    if (!localStorage.getItem(STORAGE_KEYS.GOETHE_FILES)) {
      localStorage.setItem(STORAGE_KEYS.GOETHE_FILES, JSON.stringify(INITIAL_GOETHE_FILES));
    }

    if (!localStorage.getItem(STORAGE_KEYS.TRASH)) {
      localStorage.setItem(STORAGE_KEYS.TRASH, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.LOGS)) {
      const initialLogs: AuditLog[] = [
        {
          id: 'log-001',
          timestamp: new Date().toISOString(),
          actorUsername: 'system',
          actorRole: 'admin',
          action: 'INSTITUTE_ONLINE',
          details: 'Deutschkurs By Noman System initialisiert. Niveaus A1–C2, Rollen (Admin/Lehrer/Student) aktiv.',
          severity: 'info',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(initialLogs));
    }
  },

  // --------------------------------------------------------------------
  // USERS & AUTH
  // --------------------------------------------------------------------
  getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  },

  getUserByUsername(username: string): User | undefined {
    const users = this.getUsers();
    return users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
  },

  saveUser(user: User): void {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCurrentSession(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    return raw ? JSON.parse(raw) : null;
  },

  getActiveSession(): User | null {
    return this.getCurrentSession();
  },

  setCurrentSession(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    }
  },

  setActiveSession(user: User | null): void {
    this.setCurrentSession(user);
  },

  async updateUserPassword(userId: string, newPassword: string): Promise<void> {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    const { hash, salt } = await hashPassword(newPassword);
    user.passwordHash = hash;
    user.salt = salt;
    user.isDefaultPassword = false;
    this.saveUser(user);
    const active = this.getCurrentSession();
    if (active && active.id === userId) {
      active.passwordHash = hash;
      active.salt = salt;
      active.isDefaultPassword = false;
      this.setCurrentSession(active);
    }
    this.logAuditEvent(user.username, user.role, 'PASSWORD_UPDATE', 'Passwort erfolgreich geändert.', 'info');
  },

  async resetAdminPasswordWithSecretCode(username: string, secretCode: string): Promise<boolean> {
    if (secretCode.trim() !== 'admin1234$') return false;
    const admin = this.getUserByUsername(username.trim() || 'admin');
    if (!admin || admin.role !== 'admin') return false;

    const creds = await hashPassword('adminadmin');
    admin.passwordHash = creds.hash;
    admin.salt = creds.salt;
    admin.isDefaultPassword = true;
    this.saveUser(admin);
    this.logAuditEvent(admin.username, 'admin', 'PASSWORD_RESET_SECRET', 'Admin-Passwort mittels Generalschlüssel zurückgesetzt.', 'warning');
    return true;
  },

  // --------------------------------------------------------------------
  // STUDENT ADMISSIONS & LEVEL MANAGEMENT
  // --------------------------------------------------------------------
  getAdmissions(): StudentAdmission[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMISSIONS);
    return raw ? JSON.parse(raw) : [];
  },

  saveAdmission(adm: StudentAdmission): void {
    const list = this.getAdmissions();
    const idx = list.findIndex((a) => a.id === adm.id);
    if (idx >= 0) {
      list[idx] = adm;
    } else {
      list.unshift(adm);
    }
    localStorage.setItem(STORAGE_KEYS.ADMISSIONS, JSON.stringify(list));
    this.logAuditEvent('admin', 'admin', 'STUDENT_ADMISSION', `Student aufgenommen: ${adm.name} (${adm.studentId}) für GER ${adm.currentLevel}`, 'info');
  },

  promoteStudent(studentId: string, toLevel: CEFRLevel, promotedBy: string, remarks: string, examScore?: number): boolean {
    const list = this.getAdmissions();
    const student = list.find((s) => s.studentId === studentId || s.id === studentId);
    if (!student) return false;

    const fromLevel = student.currentLevel;
    student.currentLevel = toLevel;
    student.promotionHistory = student.promotionHistory || [];
    student.promotionHistory.push({
      id: 'promo-' + Date.now().toString(36),
      fromLevel,
      toLevel,
      promotedAt: new Date().toISOString(),
      promotedBy,
      examScore,
      remarks,
    });

    localStorage.setItem(STORAGE_KEYS.ADMISSIONS, JSON.stringify(list));

    // Also update matching User record if present
    const users = this.getUsers();
    const userMatch = users.find((u) => u.studentId === student.studentId || u.username === student.username);
    if (userMatch) {
      userMatch.currentLevel = toLevel;
      this.saveUser(userMatch);
    }

    this.logAuditEvent(promotedBy, 'admin', 'STUDENT_PROMOTION', `Student ${student.name} von ${fromLevel} auf ${toLevel} befördert.`, 'info');
    return true;
  },

  // --------------------------------------------------------------------
  // BATCHES / CLASSES
  // --------------------------------------------------------------------
  getBatches(): Batch[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BATCHES);
    const list: Batch[] = raw ? JSON.parse(raw) : [];
    return list.filter((b) => !b.isDeleted);
  },

  saveBatch(batch: Batch): void {
    const list = this.getBatches();
    const idx = list.findIndex((b) => b.id === batch.id);
    if (idx >= 0) {
      list[idx] = batch;
    } else {
      list.push(batch);
    }
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(list));
  },

  deleteBatch(batchId: string, deletedBy: string): void {
    const raw = localStorage.getItem(STORAGE_KEYS.BATCHES);
    const list: Batch[] = raw ? JSON.parse(raw) : [];
    const target = list.find((b) => b.id === batchId);
    if (target) {
      target.isDeleted = true;
      localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(list));
      this.moveToTrash('batch', target.name, target, deletedBy, target.level);
    }
  },

  // --------------------------------------------------------------------
  // ATTENDANCE
  // --------------------------------------------------------------------
  getAttendanceSessions(): AttendanceSession[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return raw ? JSON.parse(raw) : [];
  },

  saveAttendanceSession(session: AttendanceSession): void {
    const list = this.getAttendanceSessions();
    const idx = list.findIndex((s) => s.id === session.id);
    if (idx >= 0) {
      list[idx] = session;
    } else {
      list.unshift(session);
    }
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(list));
  },

  getStudentAttendanceStats(studentId: string): { total: number; present: number; percentage: number } {
    const sessions = this.getAttendanceSessions();
    let total = 0;
    let present = 0;

    sessions.forEach((sess) => {
      const entry = sess.entries.find((e) => e.studentId === studentId);
      if (entry) {
        total++;
        if (entry.status === 'present' || entry.status === 'late') {
          present++;
        }
      }
    });

    const percentage = total > 0 ? Math.round((present / total) * 100) : 100;
    return { total, present, percentage };
  },

  // --------------------------------------------------------------------
  // FEES & PAYMENTS & RECEIPTS
  // --------------------------------------------------------------------
  getFees(): FeeRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FEES);
    return raw ? JSON.parse(raw) : [];
  },

  saveFeeRecord(record: FeeRecord): void {
    const list = this.getFees();
    const idx = list.findIndex((f) => f.id === record.id);
    if (idx >= 0) {
      list[idx] = record;
    } else {
      list.push(record);
    }
    localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(list));
  },

  recordPayment(
    feeRecordId: string,
    amount: number,
    paymentMethod: 'Cash' | 'Bank Transfer' | 'Card' | 'EasyPaisa/JazzCash',
    recordedBy: string,
    notes?: string
  ): PaymentReceipt | null {
    const list = this.getFees();
    const fee = list.find((f) => f.id === feeRecordId);
    if (!fee) return null;

    const receiptNumber = `DK-REC-${Date.now().toString().slice(-6)}`;
    const tx = {
      id: 'tx-' + Date.now().toString(36),
      receiptNumber,
      date: new Date().toISOString().split('T')[0],
      amount,
      paymentMethod,
      recordedBy,
      notes,
    };

    fee.transactions = fee.transactions || [];
    fee.transactions.unshift(tx);
    fee.paidAmount += amount;
    fee.balanceDue = Math.max(0, fee.netFee - fee.paidAmount);
    fee.status = fee.balanceDue === 0 ? 'paid' : fee.paidAmount > 0 ? 'partial' : 'pending';
    fee.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(list));

    const receipt: PaymentReceipt = {
      receiptNumber,
      studentId: fee.studentId,
      studentName: fee.studentName,
      studentEmail: fee.studentEmail,
      batchName: fee.batchName,
      level: fee.level,
      transactionDate: tx.date,
      amountPaid: amount,
      totalFee: fee.netFee,
      balanceRemaining: fee.balanceDue,
      paymentMethod,
      recordedBy,
      instituteTitle: 'Deutschkurs By Noman',
      note: notes,
    };

    this.logAuditEvent(recordedBy, 'admin', 'FEE_PAYMENT', `Zahlung von €${amount} für ${fee.studentName} verbucht. Quittung: ${receiptNumber}`, 'info');
    return receipt;
  },

  // --------------------------------------------------------------------
  // GOETHE PRÜFUNGEN ARCHIVE FOLDER
  // --------------------------------------------------------------------
  getGoetheFiles(): GoethePruefungFile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.GOETHE_FILES);
    return raw ? JSON.parse(raw) : [];
  },

  saveGoetheFile(file: GoethePruefungFile): void {
    const list = this.getGoetheFiles();
    list.unshift(file);
    localStorage.setItem(STORAGE_KEYS.GOETHE_FILES, JSON.stringify(list));
  },

  // --------------------------------------------------------------------
  // TRASH BIN (PAPIERKORB)
  // --------------------------------------------------------------------
  getTrashItems(): TrashItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRASH);
    return raw ? JSON.parse(raw) : [];
  },

  moveToTrash(itemType: 'paper' | 'batch' | 'student' | 'file', itemTitle: string, originalData: any, deletedBy: string, itemLevel?: CEFRLevel): void {
    const trash = this.getTrashItems();
    const item: TrashItem = {
      id: 'trash-' + Date.now().toString(36),
      itemType,
      itemTitle,
      itemLevel,
      deletedAt: new Date().toISOString(),
      deletedBy,
      originalData,
    };
    trash.unshift(item);
    localStorage.setItem(STORAGE_KEYS.TRASH, JSON.stringify(trash));
    this.logAuditEvent(deletedBy, 'admin', 'TRASH_MOVE', `${itemType.toUpperCase()} „${itemTitle}“ in den Papierkorb verschoben.`, 'warning');
  },

  restoreFromTrash(trashId: string): boolean {
    const trash = this.getTrashItems();
    const item = trash.find((t) => t.id === trashId);
    if (!item) return false;

    if (item.itemType === 'paper') {
      const papers = this.getPapers(true);
      const target = papers.find((p) => p.id === item.originalData.id);
      if (target) {
        target.isDeleted = false;
        localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(papers));
      } else {
        item.originalData.isDeleted = false;
        papers.push(item.originalData);
        localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(papers));
      }
    } else if (item.itemType === 'batch') {
      const batches = this.getBatches();
      item.originalData.isDeleted = false;
      batches.push(item.originalData);
      localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
    }

    const updatedTrash = trash.filter((t) => t.id !== trashId);
    localStorage.setItem(STORAGE_KEYS.TRASH, JSON.stringify(updatedTrash));
    this.logAuditEvent('admin', 'admin', 'TRASH_RESTORE', `Element „${item.itemTitle}“ aus dem Papierkorb wiederhergestellt.`, 'info');
    return true;
  },

  permanentlyDeleteTrashItem(trashId: string): void {
    const trash = this.getTrashItems();
    const item = trash.find((t) => t.id === trashId);
    const updated = trash.filter((t) => t.id !== trashId);
    localStorage.setItem(STORAGE_KEYS.TRASH, JSON.stringify(updated));
    if (item) {
      this.logAuditEvent('admin', 'admin', 'TRASH_PERMANENT_DELETE', `Element „${item.itemTitle}“ endgültig gelöscht.`, 'warning');
    }
  },

  emptyTrash(): void {
    localStorage.setItem(STORAGE_KEYS.TRASH, JSON.stringify([]));
    this.logAuditEvent('admin', 'admin', 'TRASH_EMPTY', 'Papierkorb vollständig geleert.', 'warning');
  },

  // --------------------------------------------------------------------
  // EXAM PAPERS & SUBMISSIONS
  // --------------------------------------------------------------------
  getPapers(includeDeleted = false): ExamPaper[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PAPERS);
    const list: ExamPaper[] = raw ? JSON.parse(raw) : [];
    return includeDeleted ? list : list.filter((p) => !p.isDeleted);
  },

  getPaperByKey(key: string): ExamPaper | undefined {
    const formatted = key.trim().toLowerCase();
    const papers = this.getPapers(false);
    return papers.find((p) => p.key.toLowerCase() === formatted || p.key.toLowerCase() === `#${formatted}`);
  },

  getPaperById(paperId: string): ExamPaper | undefined {
    const papers = this.getPapers(true);
    return papers.find((p) => p.id === paperId);
  },

  savePaper(paper: ExamPaper): void {
    const papers = this.getPapers(true);
    const idx = papers.findIndex((p) => p.id === paper.id);
    if (idx >= 0) {
      papers[idx] = paper;
    } else {
      papers.unshift(paper);
    }
    localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(papers));
  },

  deletePaper(paperId: string, deletedBy = 'admin'): void {
    const papers = this.getPapers(true);
    const target = papers.find((p) => p.id === paperId);
    if (target) {
      target.isDeleted = true;
      target.deletedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(papers));
      this.moveToTrash('paper', target.title, target, deletedBy, target.level);
    }
  },

  updatePaperStatus(paperId: string, status: PaperStatus): void {
    const papers = this.getPapers(true);
    const paper = papers.find((p) => p.id === paperId);
    if (paper) {
      paper.status = status;
      paper.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(papers));
    }
  },

  getSubmissions(): ExamSubmission[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    return raw ? JSON.parse(raw) : [];
  },

  getSubmissionsForStudent(username: string): ExamSubmission[] {
    const all = this.getSubmissions();
    return all.filter((s) => s.studentUsername.toLowerCase() === username.toLowerCase());
  },

  saveSubmission(submission: ExamSubmission): void {
    const submissions = this.getSubmissions();
    submissions.unshift(submission);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  },

  deleteSubmission(submissionId: string): void {
    const submissions = this.getSubmissions();
    const filtered = submissions.filter((s) => s.id !== submissionId);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(filtered));
  },

  verifySubmission(submissionId: string, verifierName = 'Admin'): void {
    const submissions = this.getSubmissions();
    const sub = submissions.find((s) => s.id === submissionId);
    if (sub) {
      sub.verifiedByAdmin = true;
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
      this.logAuditEvent(verifierName, 'admin', 'SUBMISSION_VERIFIED', `Ergebnis von „${sub.studentName}“ (${sub.paperTitle}) offiziell verifiziert.`, 'info');
    }
  },

  clearStudentHistory(username: string): void {
    const submissions = this.getSubmissions();
    const filtered = submissions.filter((s) => s.studentUsername.toLowerCase() !== username.toLowerCase());
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(filtered));
  },

  clearSubmissionsForStudent(studentIdOrUsername: string): void {
    const submissions = this.getSubmissions();
    const target = studentIdOrUsername.toLowerCase();
    const filtered = submissions.filter(
      (s) =>
        s.studentUsername.toLowerCase() !== target &&
        (s.studentId ? s.studentId.toLowerCase() !== target : true)
    );
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(filtered));
  },

  getAnalyticsMetrics() {
    const submissions = this.getSubmissions();
    const totalSubmissions = submissions.length;
    const passedSubmissions = submissions.filter((s) => s.passed || s.percentage >= 60).length;
    const passRate = totalSubmissions > 0 ? Math.round((passedSubmissions / totalSubmissions) * 100) : 0;
    const totalPercentage = submissions.reduce((acc, curr) => acc + curr.percentage, 0);
    const averageScore = totalSubmissions > 0 ? Math.round(totalPercentage / totalSubmissions) : 0;
    const papers = this.getPapers(false);
    const livePapersCount = papers.filter((p) => p.status === 'live').length;

    return {
      totalSubmissions,
      passedCount: passedSubmissions,
      passRate,
      averageScore,
      avgScore: averageScore,
      livePapersCount,
      totalPapers: papers.length,
    };
  },

  // --------------------------------------------------------------------
  // AUDIT LOGS
  // --------------------------------------------------------------------
  getAuditLogs(): AuditLog[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    return raw ? JSON.parse(raw) : [];
  },

  logAuditEvent(
    actorUsername: string,
    actorRole: UserRole,
    action: string,
    details: string,
    severity: 'info' | 'warning' | 'security' = 'info'
  ): void {
    const logs = this.getAuditLogs();
    logs.unshift({
      id: 'log-' + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      actorUsername,
      actorRole,
      action,
      details,
      severity,
    });
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs.slice(0, 300)));
  },
};
