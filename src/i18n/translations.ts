export type Language = 'de' | 'en' | 'ur';

export interface Translations {
  // Brand & Nav
  brandTitle: string;
  brandSubtitle: string;
  studentPortal: string;
  adminPortal: string;
  changePassword: string;
  logout: string;
  login: string;
  secureCenter: string;
  languageLabel: string;
  teacherPortal: string;
  tabTeacher: string;
  signInAsTeacher: string;
  batches: string;
  admissions: string;
  attendance: string;
  fees: string;
  goetheFolder: string;
  trashBin: string;
  aiGenerator: string;
  themeLabel: string;
  promotion: string;

  // Auth View
  loginTitle: string;
  loginSubtitle: string;
  tabStudent: string;
  tabAdmin: string;
  tabRegister: string;
  username: string;
  password: string;
  enterUsername: string;
  enterPassword: string;
  signInAsStudent: string;
  signInAsAdmin: string;
  registerStudentAccount: string;
  fullName: string;
  fullNamePlaceholder: string;
  emailAddress: string;
  emailPlaceholder: string;
  targetLevel: string;
  registerSuccess: string;
  loginErrorUserNotFound: string;
  loginErrorNoAdmin: string;
  loginErrorInvalidPassword: string;
  minPasswordLength: string;
  usernameTaken: string;
  securityDisclaimer: string;

  // Student Portal
  welcome: string;
  studentIdLabel: string;
  enterExamKeyTitle: string;
  enterExamKeyDesc: string;
  examKeyPlaceholder: string;
  openExamButton: string;
  keyNotFoundOrInvalid: string;
  paperNotLiveYet: string;
  testKeysLabel: string;
  instantFeedbackFeature: string;
  timerFeature: string;
  cefrEvaluationFeature: string;
  examHistoryTitle: string;
  examHistorySubtitle: string;
  noPastExams: string;
  detailsAndResults: string;
  score: string;
  points: string;
  passed: string;
  failed: string;

  // Exam Taking Session
  question: string;
  of: string;
  worthPoints: string;
  pointsLabel: string;
  optionsLabel: string;
  submitAndVerify: string;
  nextQuestion: string;
  finishExamAndSeeResults: string;
  exitExam: string;
  correctAnswerBanner: string;
  wrongAnswerBanner: string;
  explanationTitle: string;
  yourChoice: string;
  correctSolution: string;
  timeRemaining: string;

  // Exam Result View
  congratulations: string;
  examFailedTitle: string;
  passedDesc: string;
  failedDesc: string;
  candidate: string;
  examPaper: string;
  duration: string;
  detailedReviewTitle: string;
  printDocument: string;
  retakeExam: string;
  backToOverview: string;

  // Admin Portal
  adminLeitstand: string;
  adminHeaderTitle: string;
  newPaperButton: string;
  tabOverview: string;
  tabPapers: string;
  tabSubmissions: string;
  tabSecurity: string;
  submittedExamsStat: string;
  passRateStat: string;
  avgScoreStat: string;
  livePapersStat: string;
  concurrencyTitle: string;
  concurrencyDesc: string;
  systemNominal: string;
  concurrentCapacity: string;
  activeClients: string;
  cryptoHashing: string;
  gradingThroughput: string;
  activePapersShowcase: string;
  activePapersDesc: string;
  manageAllPapers: string;
  recentSubmissions: string;
  fullList: string;
  makeLive: string;
  closePaper: string;
  statusLive: string;
  statusDraft: string;
  statusClosed: string;
  exportCsv: string;
  searchPlaceholder: string;
  allPapers: string;
  verifyResults: string;
  verificationOfficial: string;
  verificationPending: string;
  verifiedNotesLabel: string;
  saveVerification: string;
  verifiedSuccess: string;
  close: string;
  printScoreSheet: string;
  passwordChangePromptTitle: string;
  passwordChangePromptDesc: string;
  changePasswordNow: string;

  // Paper Editor
  editPaperTitle: string;
  createPaperTitle: string;
  editorSubtitle: string;
  cancel: string;
  savePaper: string;
  paperParameters: string;
  paperTitleInput: string;
  examKeyInput: string;
  keyHelp: string;
  paperDescriptionInput: string;
  cefrLevel: string;
  paperStatus: string;
  durationMinutes: string;
  passPercentage: string;
  questionCatalog: string;
  questionCatalogSubtitle: string;
  addQuestion: string;
  deleteQuestion: string;
  questionPromptInput: string;
  contextNoteInput: string;
  questionPointsInput: string;
  chooseOptionCount: string;
  optionCountHelp: string;
  correctOptionMark: string;
  grammarExplanationInput: string;

  // Password Modal
  changePasswordTitle: string;
  currentPasswordLabel: string;
  newPasswordLabel: string;
  confirmPasswordLabel: string;
  updatePasswordButton: string;
  passwordStrengthLabel: string;
  passwordChangedSuccess: string;
  passwordsDoNotMatch: string;
  currentPasswordIncorrect: string;

  // PDF Upload & Auto-Conversion
  uploadPdfTitle: string;
  uploadPdfSubtitle: string;
  dropPdfHere: string;
  convertingPdf: string;
  pdfConvertedSuccess: string;
  loadSamplePdf: string;
  pdfQuestionsExtracted: string;

  // Forgot Password / Secret Recovery
  forgotPassword: string;
  adminRecoveryTitle: string;
  adminRecoverySubtitle: string;
  enterYourName: string;
  enterYourNamePlaceholder: string;
  writeYourSecretCode: string;
  secretCodePlaceholder: string;
  resetPasswordButton: string;
  resetSuccessMessage: string;
  invalidSecretCode: string;
  backToLogin: string;

  // Remove Papers & Submissions
  removePaper: string;
  removePastSubmission: string;
  confirmRemovePaper: string;
  clearAllPastExams: string;
  confirmClearPastExams: string;
}

export const translations: Record<Language, Translations> = {
  de: {
    brandTitle: 'Deutschkurs By Noman',
    brandSubtitle: 'Sprachinstitut & Prüfungszentrum · A1 bis C2',
    studentPortal: 'Studentenportal',
    adminPortal: 'Institutsleitung & Admin',
    teacherPortal: 'Dozenten- & Lehrerportal',
    tabTeacher: 'Dozenten & Lehrer',
    signInAsTeacher: 'Als Lehrer / Dozent anmelden',
    batches: 'Kurse & Batches',
    admissions: 'Studenten & Aufnahme',
    attendance: 'Anwesenheitsregister',
    fees: 'Kursgebühren & Quittungen',
    goetheFolder: 'Goethe-Prüfungen (A1–C2)',
    trashBin: 'Papierkorb',
    aiGenerator: 'KI-Prüfungsgenerator',
    themeLabel: 'Design',
    promotion: 'Studenten-Promotion (Level-Aufstieg)',
    changePassword: 'Passwort',
    logout: 'Abmelden',
    login: 'Anmelden',
    secureCenter: 'Offizielles Zentrum · Deutschkurs By Noman 🇩🇪',
    languageLabel: 'Sprache',

    loginTitle: 'Deutschkurs By Noman',
    loginSubtitle: 'Offizielles Portal für Deutschkurse, Prüfungen und Zertifikate (GER A1–C2).',
    tabStudent: 'Studenten',
    tabAdmin: 'Dozenten & Admin',
    tabRegister: 'Registrieren',
    username: 'Benutzername',
    password: 'Passwort',
    enterUsername: 'Benutzername eingeben',
    enterPassword: 'Passwort eingeben',
    signInAsStudent: 'Als Student anmelden',
    signInAsAdmin: 'Als Dozent / Admin anmelden',
    registerStudentAccount: 'Studentenkonto registrieren',
    fullName: 'Vollständiger Name',
    fullNamePlaceholder: 'z. B. Maximilian Bauer',
    emailAddress: 'E-Mail-Adresse',
    emailPlaceholder: 'student@universitaet.de',
    targetLevel: 'Zielniveau GER',
    registerSuccess: 'Konto erfolgreich erstellt! Sie werden weitergeleitet...',
    loginErrorUserNotFound: 'Benutzername nicht gefunden. Bitte Zugangsdaten prüfen.',
    loginErrorNoAdmin: 'Dieser Account besitzt keine Administrator-/Dozentenrechte.',
    loginErrorInvalidPassword: 'Ungültiges Passwort. Bitte überprüfen Sie Ihre Eingabe.',
    minPasswordLength: 'Das Passwort muss mindestens 6 Zeichen lang sein.',
    usernameTaken: 'Dieser Benutzername ist bereits vergeben.',
    securityDisclaimer: 'Client-seitiges SHA-256 Salted Hashing · Rollenbasierte Zugriffskontrolle (RBAC)',

    welcome: 'Willkommen',
    studentIdLabel: 'Matrikelnummer',
    enterExamKeyTitle: 'Prüfungsschlüssel eingeben',
    enterExamKeyDesc: 'Jede Prüfung ist durch einen individuellen Schlüssel geschützt (z. B. #1234). Durch die Schlüsseleingabe wird gezielt nur Ihre zugewiesene Prüfung geladen.',
    examKeyPlaceholder: 'Schlüssel z. B. #1234',
    openExamButton: 'Prüfung öffnen',
    keyNotFoundOrInvalid: 'Kein Prüfungsbogen für diesen Schlüssel gefunden. Bitte Dozenten fragen.',
    paperNotLiveYet: 'Dieser Prüfungsbogen ist derzeit noch nicht freigeschaltet (Status: Entwurf).',
    testKeysLabel: 'Verfügbare Prüfungs-Schlüssel:',
    instantFeedbackFeature: 'Automatische sofortige Rückmeldung nach jeder Frage',
    timerFeature: 'Offizieller Countdown-Timer mit Zeitüberwachung',
    cefrEvaluationFeature: 'GER-Zertifikatsbewertung & Dozentenverifikation',
    examHistoryTitle: 'Ihre bisherigen Prüfungsergebnisse',
    examHistorySubtitle: 'Einsehen Ihrer abgeschlossenen Tests, Punktzahlen und Dozenten-Notizen.',
    noPastExams: 'Sie haben bisher noch keine Prüfungen abgelegt. Geben Sie oben den Schlüssel ein, um zu beginnen!',
    detailsAndResults: 'Details & Auswertung',
    score: 'Punkte',
    points: 'Pkt.',
    passed: 'Bestanden',
    failed: 'Nicht bestanden',

    question: 'Frage',
    of: 'von',
    worthPoints: 'Wert',
    pointsLabel: 'Punkte',
    optionsLabel: 'Optionen',
    submitAndVerify: 'Antwort prüfen & einreichen',
    nextQuestion: 'Nächste Frage',
    finishExamAndSeeResults: 'Prüfung abschließen & Ergebnis anzeigen',
    exitExam: 'Prüfung abbrechen & verlassen',
    correctAnswerBanner: 'Richtig beantwortet!',
    wrongAnswerBanner: 'Leider falsch. Die richtige Antwort ist:',
    explanationTitle: 'Grammatikalische Erklärung & Regel:',
    yourChoice: 'Ihre Wahl',
    correctSolution: 'Richtige Lösung',
    timeRemaining: 'Verbleibende Zeit',

    congratulations: 'Herzlichen Glückwunsch!',
    examFailedTitle: 'Prüfung leider nicht bestanden',
    passedDesc: 'Sie haben das offizielle Anforderungsniveau erfolgreich nachgewiesen.',
    failedDesc: 'Die Bestehensgrenze wurde knapp verfehlt. Bitte wiederholen Sie die Prüfung.',
    candidate: 'Prüfling',
    examPaper: 'Prüfungsbogen',
    duration: 'Dauer',
    detailedReviewTitle: 'Detaillierte Übersicht Ihrer Antworten & Erklärungen',
    printDocument: 'Ergebnisdokument drucken',
    retakeExam: 'Nochmal versuchen',
    backToOverview: 'Zurück zur Übersicht',

    adminLeitstand: 'Institutsleitstand By Noman',
    adminHeaderTitle: 'Deutschkurs By Noman · Instituts- & Prüfungsverwaltung',
    newPaperButton: 'Prüfungsbogen erstellen',
    tabOverview: 'Echtzeit-Dashboard & 5K-Skalierung',
    tabPapers: 'Prüfungsbögen',
    tabSubmissions: 'Eingereichte Ergebnisse',
    tabSecurity: 'Sicherheit & Audit-Protokoll',
    submittedExamsStat: 'Eingereichte Prüfungen',
    passRateStat: 'Bestehens-Quote (Standard 60%)',
    avgScoreStat: 'Durchschnittliches Ergebnis',
    livePapersStat: 'Prüfungsbögen LIVE',
    concurrencyTitle: 'Architektur für 5.000+ gleichzeitige Prüfungsteilnehmer',
    concurrencyDesc: 'Gepuffertes Sitzungsmanagement, atomare Ergebnis-Synchronisation & verschlüsselte Persistenz.',
    systemNominal: 'SYSTEM STATUS: NOMINAL',
    concurrentCapacity: 'Gleichzeitige Kapazität',
    activeClients: 'Aktive Prüfungsclients',
    cryptoHashing: 'Krypto-Authentifizierung',
    gradingThroughput: 'Auto-Grading Durchsatz',
    activePapersShowcase: 'Aktive Prüfungsbögen & Freigabe-Schlüssel',
    activePapersDesc: 'Studenten öffnen Prüfungen über den jeweiligen Schlüssel.',
    manageAllPapers: 'Alle Bögen verwalten →',
    recentSubmissions: 'Letzte studentische Prüfungsabgaben',
    fullList: 'Vollständige Ergebnisliste →',
    makeLive: 'Live schalten',
    closePaper: 'Schließen',
    statusLive: 'LIVE',
    statusDraft: 'ENTWURF',
    statusClosed: 'GESCHLOSSEN',
    exportCsv: 'Als CSV exportieren',
    searchPlaceholder: 'Nach Name, Prüfungsbogen oder Schlüssel suchen...',
    allPapers: 'Alle Prüfungsbögen',
    verifyResults: 'Details & Noten',
    verificationOfficial: 'Offiziell bestätigt',
    verificationPending: 'Ausstehend',
    verifiedNotesLabel: 'Dozenten-Kommentar / Gutachten für den Prüfling',
    saveVerification: 'Ergebnis verifizieren',
    verifiedSuccess: 'Bestätigt & Gespeichert!',
    close: 'Schließen',
    printScoreSheet: 'Ergebnisbogen drucken',
    passwordChangePromptTitle: 'Sicherheitswarnung: Initiales Dozenten-Kennwort aktiv',
    passwordChangePromptDesc: 'Sie sind mit dem vorkonfigurierten Startpasswort angemeldet. Bitte vergeben Sie ein sicheres Kennwort.',
    changePasswordNow: 'Passwort jetzt ändern',

    editPaperTitle: 'Prüfungsbogen bearbeiten',
    createPaperTitle: 'Neuen Prüfungsbogen erstellen',
    editorSubtitle: 'Konfigurieren Sie Fragen, Antwortoptionen (3, 4 oder 5), Prüfungsschlüssel und Freigabestatus.',
    cancel: 'Abbrechen',
    savePaper: 'Prüfungsbogen speichern',
    paperParameters: 'Prüfungsparameter & Freigabestatus',
    paperTitleInput: 'Titel des Prüfungsbogens *',
    examKeyInput: 'Prüfungsschlüssel (Key) *',
    keyHelp: 'Studenten geben diesen Schlüssel ein, um genau diese Prüfung zu öffnen.',
    paperDescriptionInput: 'Beschreibung & Anweisungen für Prüfungskandidaten',
    cefrLevel: 'GER Niveau',
    paperStatus: 'Prüfungsstatus (Live-Schaltung)',
    durationMinutes: 'Bearbeitungszeit (Minuten)',
    passPercentage: 'Bestehensgrenze (%)',
    questionCatalog: 'Fragenkatalog',
    questionCatalogSubtitle: 'Wählen Sie pro Frage 3, 4 oder 5 Antwortoptionen und markieren Sie die korrekte Lösung.',
    addQuestion: 'Frage hinzufügen',
    deleteQuestion: 'Diese Frage löschen',
    questionPromptInput: 'Fragetext / Lückentext (Deutsch) *',
    contextNoteInput: 'Grammatikthema / Kontextnotiz (optional)',
    questionPointsInput: 'Erreichbare Punkte für diese Frage',
    chooseOptionCount: 'Anzahl Antwortoptionen auswählen (3, 4 oder 5)',
    optionCountHelp: 'Geben Sie die Antwortoptionen ein und markieren Sie mit dem grünen Radio-Button die richtige Option.',
    correctOptionMark: 'Richtige Option',
    grammarExplanationInput: 'Grammatikalische Erklärung (wird dem Studenten nach Beantwortung angezeigt) *',

    changePasswordTitle: 'Passwort ändern',
    currentPasswordLabel: 'Aktuelles Passwort',
    newPasswordLabel: 'Neues Passwort',
    confirmPasswordLabel: 'Neues Passwort bestätigen',
    updatePasswordButton: 'Passwort aktualisieren',
    passwordStrengthLabel: 'Stärke',
    passwordChangedSuccess: 'Passwort erfolgreich geändert! Wird gespeichert...',
    passwordsDoNotMatch: 'Die neuen Passwörter stimmen nicht überein.',
    currentPasswordIncorrect: 'Das aktuelle Passwort ist nicht korrekt.',

    uploadPdfTitle: 'PDF hochladen & automatisch umwandeln',
    uploadPdfSubtitle: 'Laden Sie ein Prüfungs-PDF hoch. Unser System wandelt es automatisch in einen fertigen Online-Prüfungsbogen mit Optionen und Erklärungen um.',
    dropPdfHere: 'PDF-Prüfungsdatei hier ablegen oder durchsuchen (z. B. B1-Grammatik.pdf)',
    convertingPdf: 'PDF wird analysiert und automatisch in Fragen umgewandelt...',
    pdfConvertedSuccess: 'PDF erfolgreich in Prüfungsfragen umgewandelt!',
    loadSamplePdf: 'Beispiel-PDF verwenden (Goethe B1)',
    pdfQuestionsExtracted: 'Fragen aus PDF extrahiert',

    forgotPassword: 'Passwort vergessen?',
    adminRecoveryTitle: 'Administrator-Passwort zurücksetzen',
    adminRecoverySubtitle: 'Geben Sie Ihren Namen und den autorisierten Geheimcode ein, um das Admin-Passwort zurückzusetzen.',
    enterYourName: 'Geben Sie Ihren Namen ein',
    enterYourNamePlaceholder: 'z. B. Prof. Dr. Anna Lindemann',
    writeYourSecretCode: 'Geheimcode eingeben',
    secretCodePlaceholder: 'Geheimcode eingeben (z. B. admin1234$)',
    resetPasswordButton: 'Passwort zurücksetzen',
    resetSuccessMessage: 'Passwort wurde erfolgreich auf adminadmin zurückgesetzt! Sie können sich jetzt anmelden.',
    invalidSecretCode: 'Ungültiger Geheimcode. Bitte überprüfen Sie Ihre Eingabe.',
    backToLogin: 'Zurück zur Anmeldung',

    removePaper: 'Prüfungsbogen entfernen',
    removePastSubmission: 'Ergebnis entfernen',
    confirmRemovePaper: 'Möchten Sie diesen Prüfungsbogen wirklich unwiderruflich entfernen?',
    clearAllPastExams: 'Verlauf leeren',
    confirmClearPastExams: 'Möchten Sie Ihren gesamten Prüfungsverlauf wirklich löschen?',
  },

  en: {
    brandTitle: 'Deutschkurs By Noman',
    brandSubtitle: 'German Language Institute & Exam Center · A1 to C2',
    studentPortal: 'Student Portal',
    adminPortal: 'Institute Admin',
    teacherPortal: 'Teacher Portal',
    tabTeacher: 'Teachers',
    signInAsTeacher: 'Log in as Teacher',
    batches: 'Courses & Batches',
    admissions: 'Student Admissions',
    attendance: 'Attendance Register',
    fees: 'Course Fees & Receipts',
    goetheFolder: 'Goethe Exam Archive (A1–C2)',
    trashBin: 'Trash Bin',
    aiGenerator: 'AI Paper Generator',
    themeLabel: 'Theme',
    promotion: 'Student Promotion (Level Upgrade)',
    changePassword: 'Password',
    logout: 'Log Out',
    login: 'Log In',
    secureCenter: 'Official Language Center · Deutschkurs By Noman 🇩🇪',
    languageLabel: 'Language',

    loginTitle: 'Deutschkurs By Noman',
    loginSubtitle: 'Official German language portal for courses, exams, and CEFR certification (A1–C2).',
    tabStudent: 'Students',
    tabAdmin: 'Faculty & Admin',
    tabRegister: 'Register',
    username: 'Username',
    password: 'Password',
    enterUsername: 'Enter username',
    enterPassword: 'Enter password',
    signInAsStudent: 'Log in as Student',
    signInAsAdmin: 'Log in as Faculty / Admin',
    registerStudentAccount: 'Register Student Account',
    fullName: 'Full Name',
    fullNamePlaceholder: 'e.g. John Doe',
    emailAddress: 'Email Address',
    emailPlaceholder: 'student@university.edu',
    targetLevel: 'Target CEFR Level',
    registerSuccess: 'Account created successfully! Redirecting...',
    loginErrorUserNotFound: 'Username not found. Please verify your credentials.',
    loginErrorNoAdmin: 'This account does not have administrator/faculty privileges.',
    loginErrorInvalidPassword: 'Invalid password. Please check your input.',
    minPasswordLength: 'Password must be at least 6 characters.',
    usernameTaken: 'This username is already taken.',
    securityDisclaimer: 'Client-side SHA-256 Salted Hashing · Role-Based Access Control (RBAC)',

    welcome: 'Welcome',
    studentIdLabel: 'Student ID',
    enterExamKeyTitle: 'Enter Examination Key',
    enterExamKeyDesc: 'Each test paper is secured by an individual access key (e.g. #1234). Entering the key opens specifically your assigned exam paper.',
    examKeyPlaceholder: 'Key e.g. #1234',
    openExamButton: 'Open Examination',
    keyNotFoundOrInvalid: 'No exam paper found for this key. Please ask your instructor.',
    paperNotLiveYet: 'This exam paper is not published yet (Status: Draft).',
    testKeysLabel: 'Available Exam Keys:',
    instantFeedbackFeature: 'Automatic instant feedback after answering each question',
    timerFeature: 'Official countdown timer with continuous session tracking',
    cefrEvaluationFeature: 'CEFR score certification & faculty verification',
    examHistoryTitle: 'Your Previous Examination Results',
    examHistorySubtitle: 'View your completed tests, scores, and faculty verification notes.',
    noPastExams: 'You have not taken any exams yet. Enter your exam key above to get started!',
    detailsAndResults: 'Details & Evaluation',
    score: 'Score',
    points: 'pts',
    passed: 'Passed',
    failed: 'Failed',

    question: 'Question',
    of: 'of',
    worthPoints: 'Worth',
    pointsLabel: 'Points',
    optionsLabel: 'Options',
    submitAndVerify: 'Submit & Verify Answer',
    nextQuestion: 'Next Question',
    finishExamAndSeeResults: 'Finish Exam & View Results',
    exitExam: 'Cancel & Exit Exam',
    correctAnswerBanner: 'Correct answer!',
    wrongAnswerBanner: 'Incorrect. The correct answer is:',
    explanationTitle: 'Grammar Explanation & Rule:',
    yourChoice: 'Your Selection',
    correctSolution: 'Correct Solution',
    timeRemaining: 'Time Remaining',

    congratulations: 'Congratulations!',
    examFailedTitle: 'Examination Not Passed',
    passedDesc: 'You have successfully satisfied the official CEFR proficiency standard.',
    failedDesc: 'The required passing threshold was not met. Please retake the examination.',
    candidate: 'Candidate',
    examPaper: 'Exam Paper',
    duration: 'Duration',
    detailedReviewTitle: 'Detailed Review of Your Answers & Explanations',
    printDocument: 'Print Result Certificate',
    retakeExam: 'Try Again',
    backToOverview: 'Back to Dashboard',

    adminLeitstand: 'Faculty Dashboard By Noman',
    adminHeaderTitle: 'Deutschkurs By Noman · Course & Exam Administration',
    newPaperButton: 'Create Exam Paper',
    tabOverview: 'Real-Time Dashboard & 5K Scale',
    tabPapers: 'Exam Papers',
    tabSubmissions: 'Student Submissions',
    tabSecurity: 'Security & Audit Logs',
    submittedExamsStat: 'Submitted Exams',
    passRateStat: 'Exam Passing Ratio (Standard 60%)',
    avgScoreStat: 'Average Score',
    livePapersStat: 'Live Papers',
    concurrencyTitle: 'Architecture for 5,000+ Concurrent Test Takers',
    concurrencyDesc: 'Buffered session queue, atomic result dispatching, and encrypted persistence.',
    systemNominal: 'SYSTEM STATUS: NOMINAL',
    concurrentCapacity: 'Concurrent Capacity',
    activeClients: 'Active Exam Clients',
    cryptoHashing: 'Cryptographic Hashing',
    gradingThroughput: 'Auto-Grading Throughput',
    activePapersShowcase: 'Active Exam Papers & Keys',
    activePapersDesc: 'Students unlock examinations using their assigned key.',
    manageAllPapers: 'Manage All Papers →',
    recentSubmissions: 'Recent Student Submissions',
    fullList: 'Complete Submissions List →',
    makeLive: 'Publish Live',
    closePaper: 'Close',
    statusLive: 'LIVE',
    statusDraft: 'DRAFT',
    statusClosed: 'CLOSED',
    exportCsv: 'Export to CSV',
    searchPlaceholder: 'Search by student name, paper, or key...',
    allPapers: 'All Exam Papers',
    verifyResults: 'Details & Grade',
    verificationOfficial: 'Officially Verified',
    verificationPending: 'Pending',
    verifiedNotesLabel: 'Instructor Notes / Official Evaluation',
    saveVerification: 'Verify Result',
    verifiedSuccess: 'Verified & Saved!',
    close: 'Close',
    printScoreSheet: 'Print Score Report',
    passwordChangePromptTitle: 'Security Notice: Default Administrator Password Active',
    passwordChangePromptDesc: 'You are signed in with the default startup credentials. Please set a secure password.',
    changePasswordNow: 'Change Password Now',

    editPaperTitle: 'Edit Exam Paper',
    createPaperTitle: 'Create New Exam Paper',
    editorSubtitle: 'Configure questions, options (3, 4, or 5), exam key, and publish status.',
    cancel: 'Cancel',
    savePaper: 'Save Exam Paper',
    paperParameters: 'Exam Parameters & Publishing',
    paperTitleInput: 'Exam Paper Title *',
    examKeyInput: 'Exam Access Key *',
    keyHelp: 'Students will enter this key to access only this specific paper.',
    paperDescriptionInput: 'Description & Candidate Instructions',
    cefrLevel: 'CEFR Level',
    paperStatus: 'Paper Status (Publishing)',
    durationMinutes: 'Time Limit (Minutes)',
    passPercentage: 'Passing Threshold (%)',
    questionCatalog: 'Question Catalog',
    questionCatalogSubtitle: 'Choose 3, 4, or 5 options per question and select the correct option.',
    addQuestion: 'Add Question',
    deleteQuestion: 'Delete Question',
    questionPromptInput: 'Question / German Fill-in-the-Blank *',
    contextNoteInput: 'Grammar Topic / Context Note (optional)',
    questionPointsInput: 'Points Awarded for Question',
    chooseOptionCount: 'Select Number of Options (3, 4, or 5)',
    optionCountHelp: 'Enter option text and use the green radio button to select which option is correct.',
    correctOptionMark: 'Correct Option',
    grammarExplanationInput: 'Grammar Explanation (shown to student after answering) *',

    changePasswordTitle: 'Change Password',
    currentPasswordLabel: 'Current Password',
    newPasswordLabel: 'New Password',
    confirmPasswordLabel: 'Confirm New Password',
    updatePasswordButton: 'Update Password',
    passwordStrengthLabel: 'Strength',
    passwordChangedSuccess: 'Password changed successfully! Saving...',
    passwordsDoNotMatch: 'The new passwords do not match.',
    currentPasswordIncorrect: 'Current password is incorrect.',

    uploadPdfTitle: 'Upload PDF & Auto-Convert to Exam',
    uploadPdfSubtitle: 'Upload an exam PDF document. It will be automatically parsed into complete online exam questions with options and explanations.',
    dropPdfHere: 'Drop exam PDF here or click to browse (e.g. B1-Grammar.pdf)',
    convertingPdf: 'Analyzing PDF and converting into exam questions...',
    pdfConvertedSuccess: 'PDF successfully converted into exam questions!',
    loadSamplePdf: 'Use Sample Exam PDF (Goethe B1)',
    pdfQuestionsExtracted: 'Questions extracted from PDF',

    forgotPassword: 'Forgot Password?',
    adminRecoveryTitle: 'Admin Password Recovery',
    adminRecoverySubtitle: 'Enter your name and your secret authorized recovery code to reset the administrator password.',
    enterYourName: 'Enter your name',
    enterYourNamePlaceholder: 'e.g. Prof. Dr. Anna Lindemann',
    writeYourSecretCode: 'Write your secret code',
    secretCodePlaceholder: 'Write your secret code (e.g. admin1234$)',
    resetPasswordButton: 'Reset Password',
    resetSuccessMessage: 'Password has been successfully reset to adminadmin! You can now log in.',
    invalidSecretCode: 'Invalid secret code. Please verify your input.',
    backToLogin: 'Back to Login',

    removePaper: 'Remove Paper',
    removePastSubmission: 'Remove Result',
    confirmRemovePaper: 'Are you sure you want to permanently delete this exam paper?',
    clearAllPastExams: 'Clear History',
    confirmClearPastExams: 'Are you sure you want to clear your entire examination history?',
  },

  ur: {
    brandTitle: 'Deutschkurs By Noman',
    brandSubtitle: 'جرمن لینگویج انسٹیٹیوٹ و امتحانی مرکز · A1 تا C2',
    studentPortal: 'طلباء پورٹل',
    adminPortal: 'انتظامیہ اور ایڈمن',
    teacherPortal: 'اساتذہ پورٹل',
    tabTeacher: 'اساتذہ',
    signInAsTeacher: 'بطور استاد لاگ ان کریں',
    batches: 'کلاسیں اور بیجز',
    admissions: 'طلباء داخلہ و ریکارڈ',
    attendance: 'حاضری رجسٹر',
    fees: 'کورس فیس و رسیدات',
    goetheFolder: 'گوئٹے امتحانات (A1 تا C2)',
    trashBin: 'ری سائیکل بن',
    aiGenerator: 'اے آئی پیپر جنریٹر',
    themeLabel: 'تھیم',
    promotion: 'طالب علم پروموشن (اگلا لیول)',
    changePassword: 'پاس ورڈ',
    logout: 'لاگ آؤٹ',
    login: 'لاگ ان',
    secureCenter: 'باضابطہ مرکز · Deutschkurs By Noman 🇩🇪',
    languageLabel: 'زبان',

    loginTitle: 'Deutschkurs By Noman',
    loginSubtitle: 'جرمن زبان کورسز، امتحانات اور سرٹیفیکیشن (A1 تا C2) کا باضابطہ پورٹل۔',
    tabStudent: 'طلباء',
    tabAdmin: 'اساتذہ اور ایڈمن',
    tabRegister: 'رجسٹریشن',
    username: 'صارف کا نام (یوزر نیم)',
    password: 'پاس ورڈ',
    enterUsername: 'اپنا یوزر نیم درج کریں',
    enterPassword: 'اپنا پاس ورڈ درج کریں',
    signInAsStudent: 'بطور طالب علم لاگ ان کریں',
    signInAsAdmin: 'بطور ایڈمن لاگ ان کریں',
    registerStudentAccount: 'طالب علم کا نیا اکاؤنٹ بنائیں',
    fullName: 'مکمل نام',
    fullNamePlaceholder: 'مثلاً: احمد خان',
    emailAddress: 'ای میل ایڈریس',
    emailPlaceholder: 'student@university.edu',
    targetLevel: 'مطلوبہ جرمن لیول (GER)',
    registerSuccess: 'اکاؤنٹ کامیابی سے بن گیا! آپ کو داخل کیا جا رہا ہے...',
    loginErrorUserNotFound: 'یوزر نیم نہیں ملا۔ برائے مہربانی معلومات چیک کریں۔',
    loginErrorNoAdmin: 'اس اکاؤنٹ کے پاس ایڈمن کے اختیارات نہیں ہیں۔',
    loginErrorInvalidPassword: 'غلط پاس ورڈ۔ برائے مہربانی دوبارہ کوشش کریں۔',
    minPasswordLength: 'پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے۔',
    usernameTaken: 'یہ یوزر نیم پہلے سے موجود ہے۔',
    securityDisclaimer: 'محفوظ شدہ پاس ورڈ ہیشنگ (SHA-256) · کردار پر مبنی رسائی',

    welcome: 'خوش آمدید',
    studentIdLabel: 'طالب علم شناختی نمبر',
    enterExamKeyTitle: 'امتحانی خفیہ کوڈ (Key) درج کریں',
    enterExamKeyDesc: 'ہر امتحانی پرچے کے لیے مخصوص کوڈ (جیسے #1234) ہوتا ہے۔ کوڈ درج کرنے پر صرف متعلقہ پرچہ کھلے گا۔',
    examKeyPlaceholder: 'کوڈ درج کریں جیسے #1234',
    openExamButton: 'امتحان شروع کریں',
    keyNotFoundOrInvalid: 'اس کوڈ کا کوئی پرچہ دستیاب نہیں۔ استاد سے درست کوڈ لیں۔',
    paperNotLiveYet: 'یہ پرچہ ابھی تک لائیو نہیں کیا گیا ہے۔',
    testKeysLabel: 'دستیاب امتحانی کوڈز:',
    instantFeedbackFeature: 'ہر سوال کے جواب کے فوراً بعد خودکار تصدیق اور وضاحت',
    timerFeature: 'امتحان کے وقت کی مسلسل نگرانی',
    cefrEvaluationFeature: 'باضابطہ نتیجہ اور استاد کی طرف سے تصدیق',
    examHistoryTitle: 'آپ کے پچھلے امتحانی نتائج',
    examHistorySubtitle: 'اپنے مکمل شدہ ٹیسٹ، نمبرات اور اساتذہ کے نوٹس دیکھیں۔',
    noPastExams: 'آپ نے ابھی تک کوئی امتحان نہیں دیا۔ اوپر کوڈ درج کر کے شروعات کریں!',
    detailsAndResults: 'تفصیلات اور نتیجہ',
    score: 'حاصل کردہ نمبر',
    points: 'نمبر',
    passed: 'کامیاب (Passed)',
    failed: 'ناکام (Failed)',

    question: 'سوال',
    of: 'از',
    worthPoints: 'کل نمبر',
    pointsLabel: 'نمبر',
    optionsLabel: 'انتخابات',
    submitAndVerify: 'جواب جمع کرائیں اور جانچیں',
    nextQuestion: 'اگلا سوال',
    finishExamAndSeeResults: 'امتحان مکمل کریں اور نتیجہ دیکھیں',
    exitExam: 'امتحان ختم کر کے باہر جائیں',
    correctAnswerBanner: 'بالکل درست جواب!',
    wrongAnswerBanner: 'غلط جواب۔ درست آپشن یہ ہے:',
    explanationTitle: 'گرائمر کی وضاحت اور قاعدہ:',
    yourChoice: 'آپ کا انتخاب',
    correctSolution: 'درست جواب',
    timeRemaining: 'باقی وقت',

    congratulations: 'مبارک ہو!',
    examFailedTitle: 'امتحان میں کامیابی نہیں ہوئی',
    passedDesc: 'آپ نے مطلوبہ جرمن زبان کا معیار کامیابی سے پاس کر لیا ہے۔',
    failedDesc: 'کامیابی کے لیے درکار کم از کم نمبر حاصل نہیں ہو سکے۔ دوبارہ کوشش کریں۔',
    candidate: 'امیدوار',
    examPaper: 'امتحانی پرچہ',
    duration: 'دورانیہ',
    detailedReviewTitle: 'آپ کے جوابات اور گرائمر کی تفصیلی جانچ',
    printDocument: 'نتیجہ پرنٹ کریں',
    retakeExam: 'دوبارہ کوشش کریں',
    backToOverview: 'ڈیش بورڈ پر واپس جائیں',

    adminLeitstand: 'امتحانی کنٹرول روم By Noman',
    adminHeaderTitle: 'Deutschkurs By Noman · امتحانی و تدریسی انتظام',
    newPaperButton: 'نیا پرچہ بنائیں',
    tabOverview: 'ریئل ٹائم ڈیش بورڈ (5000 طلباء کی گنجائش)',
    tabPapers: 'امتحانی پرچے',
    tabSubmissions: 'جمع شدہ نتائج',
    tabSecurity: 'سیکیورٹی لاگز',
    submittedExamsStat: 'جمع شدہ امتحانات',
    passRateStat: 'امتحانی کامیابی کا تناسب (معیار 60%)',
    avgScoreStat: 'اوسط نمبرات',
    livePapersStat: 'لائیو پرچے',
    concurrencyTitle: '5000 سے زائد طلباء کے بیک وقت امتحان کی صلاحیت',
    concurrencyDesc: 'محفوظ سیشنز، خودکار فوری گریڈنگ اور خفیہ کاری۔',
    systemNominal: 'سسٹم بالکل درست کام کر رہا ہے',
    concurrentCapacity: 'بیک وقت گنجائش',
    activeClients: 'آن لائن طلباء',
    cryptoHashing: 'خفیہ کاری ہیشنگ',
    gradingThroughput: 'گریڈنگ کی رفتار',
    activePapersShowcase: 'فعال پرچے اور ان کے کوڈز',
    activePapersDesc: 'طلباء دیے گئے کوڈ کے ذریعے پرچہ شروع کرتے ہیں۔',
    manageAllPapers: 'تمام پرچے دیکھیں →',
    recentSubmissions: 'حالیہ جمع شدہ نتائج',
    fullList: 'مکمل فہرست دیکھیں →',
    makeLive: 'لائیو کریں',
    closePaper: 'بند کریں',
    statusLive: 'لائیو',
    statusDraft: 'ڈرافٹ',
    statusClosed: 'بند',
    exportCsv: 'CSV میں ڈاؤن لوڈ کریں',
    searchPlaceholder: 'نام، پرچہ یا کوڈ تلاش کریں...',
    allPapers: 'تمام پرچے',
    verifyResults: 'جانچ اور نمبرات',
    verificationOfficial: 'باضابطہ تصدیق شدہ',
    verificationPending: 'زیر التواء',
    verifiedNotesLabel: 'استاد کا تبصرہ / باضابطہ نوٹس',
    saveVerification: 'نتیجہ تصدیق کریں',
    verifiedSuccess: 'تصدیق محفوظ ہو گئی!',
    close: 'بند کریں',
    printScoreSheet: 'رزلٹ شیٹ پرنٹ کریں',
    passwordChangePromptTitle: 'حفاظتی نوٹس: ایڈمن کا ڈیفالٹ پاس ورڈ فعال ہے',
    passwordChangePromptDesc: 'آپ ابتدائی ایڈمن پاس ورڈ کے ساتھ لاگ ان ہیں۔ برائے مہربانی اپنا نیا پاس ورڈ سیٹ کریں۔',
    changePasswordNow: 'ابھی پاس ورڈ تبدیل کریں',

    editPaperTitle: 'پرچے میں ترمیم کریں',
    createPaperTitle: 'نیا پرچہ بنائیں',
    editorSubtitle: 'سوالات، آپشنز (3، 4 یا 5)، امتحانی کوڈ اور لائیو اسٹیٹس سیٹ کریں۔',
    cancel: 'منسوخ کریں',
    savePaper: 'پرچہ محفوظ کریں',
    paperParameters: 'پرچے کے اصول اور سیٹنگز',
    paperTitleInput: 'پرچے کا عنوان *',
    examKeyInput: 'امتحانی کوڈ (Key) *',
    keyHelp: 'طلباء یہ کوڈ داخل کر کے اس پرچے کو کھولیں گے۔',
    paperDescriptionInput: 'ہدایات برائے امیدواران',
    cefrLevel: 'جرمن لیول (GER)',
    paperStatus: 'پرچے کی حالت (لائیو / ڈرافٹ)',
    durationMinutes: 'وقت (منٹ)',
    passPercentage: 'پاس ہونے کے لیے فیصد (%)',
    questionCatalog: 'سوالات کی فہرست',
    questionCatalogSubtitle: 'ہر سوال کے لیے 3، 4 یا 5 آپشنز منتخب کریں اور درست آپشن پر نشان لگائیں۔',
    addQuestion: 'نیا سوال شامل کریں',
    deleteQuestion: 'یہ سوال حذف کریں',
    questionPromptInput: 'جرمن سوال یا خالی جگہ *',
    contextNoteInput: 'گرائمر کا عنوان / نوٹ (اختیاری)',
    questionPointsInput: 'اس سوال کے نمبر',
    chooseOptionCount: 'آپشنز کی تعداد منتخب کریں (3، 4 یا 5)',
    optionCountHelp: 'آپشنز درج کریں اور سبز ریڈیو بٹن سے درست جواب کا انتخاب کریں۔',
    correctOptionMark: 'درست آپشن',
    grammarExplanationInput: 'گرائمر کی وضاحت (طالب علم کو جواب کے بعد دکھائی جائے گی) *',

    changePasswordTitle: 'پاس ورڈ تبدیل کریں',
    currentPasswordLabel: 'موجودہ پاس ورڈ',
    newPasswordLabel: 'نیا پاس ورڈ',
    confirmPasswordLabel: 'نئے پاس ورڈ کی تصدیق کریں',
    updatePasswordButton: 'پاس ورڈ تبدیل کریں',
    passwordStrengthLabel: 'مضبوطی',
    passwordChangedSuccess: 'پاس ورڈ کامیابی سے تبدیل ہو گیا!',
    passwordsDoNotMatch: 'نئے پاس ورڈ آپس میں مماثلت نہیں رکھتے۔',
    currentPasswordIncorrect: 'موجودہ پاس ورڈ غلط ہے۔',

    uploadPdfTitle: 'پی ڈی ایف اپ لوڈ کریں اور خودکار پرچہ بنائیں',
    uploadPdfSubtitle: 'امتحانی پی ڈی ایف اپ لوڈ کریں۔ سسٹم خودکار طور پر تمام سوالات، آپشنز اور گرائمر وضاحتوں کے ساتھ مکمل آن لائن پرچہ بنا دے گا۔',
    dropPdfHere: 'امتحانی پی ڈی ایف فائل یہاں ڈراپ کریں یا منتخب کریں',
    convertingPdf: 'پی ڈی ایف کا تجزیہ اور سوالات میں تبدیلی جاری ہے...',
    pdfConvertedSuccess: 'پی ڈی ایف کامیابی سے امتحانی پرچے میں تبدیل ہو گئی!',
    loadSamplePdf: 'نمونہ پی ڈی ایف آزمائیں (جرمن B1)',
    pdfQuestionsExtracted: 'پی ڈی ایف سے سوالات تیار ہو گئے',

    forgotPassword: 'پاس ورڈ بھول گئے؟',
    adminRecoveryTitle: 'ایڈمن پاس ورڈ کی بحالی',
    adminRecoverySubtitle: 'ایڈمن پاس ورڈ کو دوبارہ ترتیب دینے کے لیے اپنا نام اور مخصوص خفیہ کوڈ درج کریں۔',
    enterYourName: 'اپنا نام درج کریں',
    enterYourNamePlaceholder: 'مثلاً: پروفیسر ڈاکٹر احمد',
    writeYourSecretCode: 'اپنا خفیہ کوڈ درج کریں',
    secretCodePlaceholder: 'خفیہ کوڈ درج کریں (جیسے admin1234$)',
    resetPasswordButton: 'پاس ورڈ ری سیٹ کریں',
    resetSuccessMessage: 'پاس ورڈ کامیابی سے adminadmin پر ری سیٹ ہو گیا ہے! اب آپ لاگ ان کر سکتے ہیں۔',
    invalidSecretCode: 'خفیہ کوڈ درست نہیں ہے۔ برائے مہربانی دوبارہ چیک کریں۔',
    backToLogin: 'لاگ ان پر واپس جائیں',

    removePaper: 'پرچہ حذف کریں',
    removePastSubmission: 'نتیجہ حذف کریں',
    confirmRemovePaper: 'کیا آپ واقعی اس امتحانی پرچے کو مستقل طور پر حذف کرنا چاہتے ہیں؟',
    clearAllPastExams: 'سابقہ ریکارڈ صاف کریں',
    confirmClearPastExams: 'کیا آپ واقعی اپنے تمام امتحانی نتائج کا ریکارڈ ختم کرنا چاہتے ہیں؟',
  },
};
