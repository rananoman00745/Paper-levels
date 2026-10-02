import { ExamPaper, Question, CEFRLevel, PaperStatus, ExamModule } from '../types/exam';

export interface GeneratedPaperOptions {
  level: CEFRLevel;
  patternType: 'goethe' | 'grammatik';
  authorName?: string;
}

// Question Banks curated strictly according to Goethe-Institut exam patterns & CEFR Grammar
const QUESTION_BANK: Record<CEFRLevel, {
  goethe: Question[];
  grammatik: Question[];
}> = {
  A1: {
    goethe: [
      {
        id: 'q-a1-g1',
        prompt: 'Guten Tag! Mein Name _____ Thomas Weber. Und wie heißen Sie?',
        contextNote: 'Goethe A1 Sprachbausteine: Sich vorstellen & Verbkonjugation sein',
        optionCount: 4,
        options: [
          { id: 'opt-a1-1a', label: 'A', text: 'ist' },
          { id: 'opt-a1-1b', label: 'B', text: 'sind' },
          { id: 'opt-a1-1c', label: 'C', text: 'bin' },
          { id: 'opt-a1-1d', label: 'D', text: 'heißt' },
        ],
        correctOption: 'A',
        explanation: '„Mein Name“ steht in der 3. Person Singular (er/es/sie). Die korrekte Form von sein ist „ist“.',
        points: 10,
      },
      {
        id: 'q-a1-g2',
        prompt: 'Entschuldigung, wo _____ hier die nächste Apotheke?',
        contextNote: 'Goethe A1 Alltagssituationen: Nach dem Weg fragen',
        optionCount: 4,
        options: [
          { id: 'opt-a1-2a', label: 'A', text: 'ist' },
          { id: 'opt-a1-2b', label: 'B', text: 'hat' },
          { id: 'opt-a1-2c', label: 'C', text: 'wohnt' },
          { id: 'opt-a1-2d', label: 'D', text: 'liegt' },
        ],
        correctOption: 'A',
        explanation: '„Wo ist hier...?“ ist die gebräuchliche Frage nach einem Ort oder Gebäude.',
        points: 10,
      },
      {
        id: 'q-a1-g3',
        prompt: 'Ich möchte gerne _____ Kaffee trinken, bitte.',
        contextNote: 'Goethe A1 Restaurant & Bestellen: Akkusativ männlicher Artikel',
        optionCount: 4,
        options: [
          { id: 'opt-a1-3a', label: 'A', text: 'einen' },
          { id: 'opt-a1-3b', label: 'B', text: 'ein' },
          { id: 'opt-a1-3c', label: 'C', text: 'eine' },
          { id: 'opt-a1-3d', label: 'D', text: 'einem' },
        ],
        correctOption: 'A',
        explanation: '„der Kaffee“ (maskulin) steht nach „möchte/trinken“ im Akkusativ: „einen Kaffee“.',
        points: 10,
      },
      {
        id: 'q-a1-g4',
        prompt: 'Können Sie mir bitte helfen? Ich spreche noch nicht _____ Deutsch.',
        contextNote: 'Goethe A1 Sprachbausteine: Adverbien des Könnens',
        optionCount: 4,
        options: [
          { id: 'opt-a1-4a', label: 'A', text: 'gut' },
          { id: 'opt-a1-4b', label: 'B', text: 'gute' },
          { id: 'opt-a1-4c', label: 'C', text: 'guten' },
          { id: 'opt-a1-4d', label: 'D', text: 'besser' },
        ],
        correctOption: 'A',
        explanation: 'Als Adverb zur Beschreibung des Sprechens steht die unveränderte Form „gut“: „nicht gut Deutsch“.',
        points: 10,
      },
      {
        id: 'q-a1-g5',
        prompt: 'Der Deutschkurs beginnt morgen um 9:00 Uhr _____ Raum 204.',
        contextNote: 'Goethe A1 Orientierung: Lokale Präposition in + Dativ',
        optionCount: 4,
        options: [
          { id: 'opt-a1-5a', label: 'A', text: 'im' },
          { id: 'opt-a1-5b', label: 'B', text: 'am' },
          { id: 'opt-a1-5c', label: 'C', text: 'zum' },
          { id: 'opt-a1-5d', label: 'D', text: 'beim' },
        ],
        correctOption: 'A',
        explanation: '„in dem Raum“ verschmilzt zu „im Raum“ (Dativ Ortsangabe: Wo?).',
        points: 10,
      },
      {
        id: 'q-a1-g6',
        prompt: 'Was machst du am Wochenende? – Ich _____ meine Familie in Köln.',
        contextNote: 'Goethe A1 Freizeit: Verbkonjugation besuchen',
        optionCount: 4,
        options: [
          { id: 'opt-a1-6a', label: 'A', text: 'besuche' },
          { id: 'opt-a1-6b', label: 'B', text: 'besuchst' },
          { id: 'opt-a1-6c', label: 'C', text: 'besucht' },
          { id: 'opt-a1-6d', label: 'D', text: 'besuchen' },
        ],
        correctOption: 'A',
        explanation: 'Subjekt „ich“ verlangt die Endung -e: „ich besuche“.',
        points: 10,
      },
    ],
    grammatik: [
      {
        id: 'q-a1-k1',
        prompt: 'Das ist Herr Müller. _____ kommt aus der Schweiz.',
        contextNote: 'Personalpronomen Nominativ Singular',
        optionCount: 4,
        options: [
          { id: 'opt-a1k-1a', label: 'A', text: 'Er' },
          { id: 'opt-a1k-1b', label: 'B', text: 'Sie' },
          { id: 'opt-a1k-1c', label: 'C', text: 'Es' },
          { id: 'opt-a1k-1d', label: 'D', text: 'Ihm' },
        ],
        correctOption: 'A',
        explanation: 'Herr Müller ist maskulin Singular, das passende Pronomen im Nominativ lautet „Er“.',
        points: 10,
      },
      {
        id: 'q-a1-k2',
        prompt: 'Hast du _____ Kugelschreiber für mich?',
        contextNote: 'Akkusativ des unbestimmten Artikels (der Kugelschreiber)',
        optionCount: 4,
        options: [
          { id: 'opt-a1k-2a', label: 'A', text: 'einen' },
          { id: 'opt-a1k-2b', label: 'B', text: 'ein' },
          { id: 'opt-a1k-2c', label: 'C', text: 'eine' },
          { id: 'opt-a1k-2d', label: 'D', text: 'eines' },
        ],
        correctOption: 'A',
        explanation: '„der Kugelschreiber“ ist maskulin. Das Verb „haben“ verlangt den Akkusativ: „einen Kugelschreiber“.',
        points: 10,
      },
      {
        id: 'q-a1-k3',
        prompt: 'Wir _____ heute leider keine Zeit, ins Kino zu gehen.',
        contextNote: 'Konjugation Hilfsverb haben (Präsens 1. Person Plural)',
        optionCount: 4,
        options: [
          { id: 'opt-a1k-3a', label: 'A', text: 'haben' },
          { id: 'opt-a1k-3b', label: 'B', text: 'hat' },
          { id: 'opt-a1k-3c', label: 'C', text: 'habt' },
          { id: 'opt-a1k-3d', label: 'D', text: 'hast' },
        ],
        correctOption: 'A',
        explanation: 'Subjekt „wir“ verlangt die regelmäßige Endung: „wir haben“.',
        points: 10,
      },
      {
        id: 'q-a1-k4',
        prompt: 'Mein Bruder steht jeden Tag schon um 6 Uhr _____.',
        contextNote: 'Trennbare Verben: aufstehen',
        optionCount: 4,
        options: [
          { id: 'opt-a1k-4a', label: 'A', text: 'auf' },
          { id: 'opt-a1k-4b', label: 'B', text: 'an' },
          { id: 'opt-a1k-4c', label: 'C', text: 'aus' },
          { id: 'opt-a1k-4d', label: 'D', text: 'ab' },
        ],
        correctOption: 'A',
        explanation: 'Das Verb lautet „aufstehen“. Die Vorsilbe „auf“ wandert im Hauptsatz ans Satzende.',
        points: 10,
      },
      {
        id: 'q-a1-k5',
        prompt: 'Hier darf man nicht rauchen! Das Rauchen ist hier streng _____.',
        contextNote: 'Modalverben & Passivbedeutung im Alltag',
        optionCount: 4,
        options: [
          { id: 'opt-a1k-5a', label: 'A', text: 'verboten' },
          { id: 'opt-a1k-5b', label: 'B', text: 'erlaubt' },
          { id: 'opt-a1k-5c', label: 'C', text: 'geöffnet' },
          { id: 'opt-a1k-5d', label: 'D', text: 'geschlossen' },
        ],
        correctOption: 'A',
        explanation: '„nicht dürfen“ bedeutet Verbot: „Das Rauchen ist hier streng verboten.“',
        points: 10,
      },
      {
        id: 'q-a1-k6',
        prompt: 'Ich fahre _____ dem Bus zur Sprachschule.',
        contextNote: 'Feste Präposition mit Dativ (mit + Dativ)',
        optionCount: 4,
        options: [
          { id: 'opt-a1k-6a', label: 'A', text: 'mit' },
          { id: 'opt-a1k-6b', label: 'B', text: 'bei' },
          { id: 'opt-a1k-6c', label: 'C', text: 'nach' },
          { id: 'opt-a1k-6d', label: 'D', text: 'zu' },
        ],
        correctOption: 'A',
        explanation: 'Verkehrsmittel werden im Deutschen mit „mit + Dativ“ angegeben: „mit dem Bus / mit der Bahn“.',
        points: 10,
      },
    ],
  },

  A2: {
    goethe: [
      {
        id: 'q-a2-g1',
        prompt: 'Sehr geehrte Damen und Herren, ich schreibe Ihnen, _____ ich mich für Ihren Deutschkurs interessiere.',
        contextNote: 'Goethe A2 Brief/E-Mail: Kausale Subjunktion weil (Verb am Ende)',
        optionCount: 4,
        options: [
          { id: 'opt-a2-1a', label: 'A', text: 'weil' },
          { id: 'opt-a2-1b', label: 'B', text: 'denn' },
          { id: 'opt-a2-1c', label: 'C', text: 'deshalb' },
          { id: 'opt-a2-1d', label: 'D', text: 'trotzdem' },
        ],
        correctOption: 'A',
        explanation: '„weil“ leitet einen Nebensatz ein und stellt das konjugierte Verb („interessiere“) an das Satzende.',
        points: 10,
      },
      {
        id: 'q-a2-g2',
        prompt: 'Gestern bin ich den ganzen Tag zu Hause _____ und habe ein Buch gelesen.',
        contextNote: 'Goethe A2 Perfekt mit sein (Ortsveränderung / Verharren)',
        optionCount: 4,
        options: [
          { id: 'opt-a2-2a', label: 'A', text: 'geblieben' },
          { id: 'opt-a2-2b', label: 'B', text: 'gebleibt' },
          { id: 'opt-a2-2c', label: 'C', text: 'bleiben' },
          { id: 'opt-a2-2d', label: 'D', text: 'gebliebt' },
        ],
        correctOption: 'A',
        explanation: 'Das Perfekt von „bleiben“ wird mit dem Hilfsverb „sein“ gebildet und hat das unregelmäßige Partizip II „geblieben“.',
        points: 10,
      },
      {
        id: 'q-a2-g3',
        prompt: 'Könntest du mir bitte helfen? Ich kann _____ Schlüssel nicht finden.',
        contextNote: 'Goethe A2 Possessivartikel im Akkusativ (der Schlüssel)',
        optionCount: 4,
        options: [
          { id: 'opt-a2-3a', label: 'A', text: 'meinen' },
          { id: 'opt-a2-3b', label: 'B', text: 'mein' },
          { id: 'opt-a2-3c', label: 'C', text: 'meinem' },
          { id: 'opt-a2-3d', label: 'D', text: 'meiner' },
        ],
        correctOption: 'A',
        explanation: '„der Schlüssel“ (maskulin) steht als direktes Objekt im Akkusativ: „meinen Schlüssel“.',
        points: 10,
      },
      {
        id: 'q-a2-g4',
        prompt: 'Herr Becker, wir treffen uns morgen direkt _____ Bahnhof.',
        contextNote: 'Goethe A2 Lokale Wechselpräposition an + Dativ',
        optionCount: 4,
        options: [
          { id: 'opt-a2-4a', label: 'A', text: 'am' },
          { id: 'opt-a2-4b', label: 'B', text: 'im' },
          { id: 'opt-a2-4c', label: 'C', text: 'ans' },
          { id: 'opt-a2-4d', label: 'D', text: 'zum' },
        ],
        correctOption: 'A',
        explanation: 'Ortsangabe „an dem Bahnhof“ zieht sich zu „am Bahnhof“ zusammen (Wo? -> Dativ).',
        points: 10,
      },
      {
        id: 'q-a2-g5',
        prompt: 'Ich freue mich schon sehr _____ die Sommerferien nächste Woche.',
        contextNote: 'Goethe A2 Präpositionale Verben: sich freuen auf + Akk (Zukunft)',
        optionCount: 4,
        options: [
          { id: 'opt-a2-5a', label: 'A', text: 'auf' },
          { id: 'opt-a2-5b', label: 'B', text: 'über' },
          { id: 'opt-a2-5c', label: 'C', text: 'für' },
          { id: 'opt-a2-5d', label: 'D', text: 'an' },
        ],
        correctOption: 'A',
        explanation: '„sich freuen auf + Akkusativ“ bezieht sich auf ein zukünftiges Ereignis.',
        points: 10,
      },
      {
        id: 'q-a2-g6',
        prompt: 'Hast du schon gehört, _____ unser Deutschlehrer heute krank ist?',
        contextNote: 'Goethe A2 Indirekte Rede / Dass-Satz',
        optionCount: 4,
        options: [
          { id: 'opt-a2-6a', label: 'A', text: 'dass' },
          { id: 'opt-a2-6b', label: 'B', text: 'ob' },
          { id: 'opt-a2-6c', label: 'C', text: 'das' },
          { id: 'opt-a2-6d', label: 'D', text: 'wann' },
        ],
        correctOption: 'A',
        explanation: 'Die Konjunktion „dass“ verbindet die Information mit dem Hauptsatz (Verb am Ende).',
        points: 10,
      },
    ],
    grammatik: [
      {
        id: 'q-a2-k1',
        prompt: 'Der Zug nach Berlin ist schnell, aber das Flugzeug ist noch _____.',
        contextNote: 'Komparativbildung von Adjektiven mit Umlaut (schnell -> schneller)',
        optionCount: 4,
        options: [
          { id: 'opt-a2k-1a', label: 'A', text: 'schneller' },
          { id: 'opt-a2k-1b', label: 'B', text: 'am schnellsten' },
          { id: 'opt-a2k-1c', label: 'C', text: 'mehr schnell' },
          { id: 'opt-a2k-1d', label: 'D', text: 'schnellste' },
        ],
        correctOption: 'A',
        explanation: 'Der Komparativ von „schnell“ lautet „schneller“. Mit „noch“ wird der Vergleich verstärkt.',
        points: 10,
      },
      {
        id: 'q-a2-k2',
        prompt: 'Wir haben uns gestern sehr lange mit _____ Nachbarn unterhalten.',
        contextNote: 'Präposition mit Dativ Plural (mit + den Nachbarn)',
        optionCount: 4,
        options: [
          { id: 'opt-a2k-2a', label: 'A', text: 'den' },
          { id: 'opt-a2k-2b', label: 'B', text: 'dem' },
          { id: 'opt-a2k-2c', label: 'C', text: 'die' },
          { id: 'opt-a2k-2d', label: 'D', text: 'der' },
        ],
        correctOption: 'A',
        explanation: '„mit“ fordert den Dativ. Der Dativ Plural lautet „den Nachbarn“ (mit Plural-n).',
        points: 10,
      },
      {
        id: 'q-a2-k3',
        prompt: 'Klaus hat _____ neue Wohnung schon komplett renoviert.',
        contextNote: 'Possessivartikel weiblich im Akkusativ (die Wohnung)',
        optionCount: 4,
        options: [
          { id: 'opt-a2k-3a', label: 'A', text: 'seine' },
          { id: 'opt-a2k-3b', label: 'B', text: 'sein' },
          { id: 'opt-a2k-3c', label: 'C', text: 'seinem' },
          { id: 'opt-a2k-3d', label: 'D', text: 'seinen' },
        ],
        correctOption: 'A',
        explanation: '„die Wohnung“ ist feminin. Der Akkusativ für Klaus (er) lautet „seine Wohnung“.',
        points: 10,
      },
      {
        id: 'q-a2-k4',
        prompt: 'Obwohl es den ganzen Nachmittag geregnet hat, _____ wir spazieren gegangen.',
        contextNote: 'Konzessivsatz mit obwohl: Hauptsatzstellung nach Nebensatz',
        optionCount: 4,
        options: [
          { id: 'opt-a2k-4a', label: 'A', text: 'sind' },
          { id: 'opt-a2k-4b', label: 'B', text: 'haben' },
          { id: 'opt-a2k-4c', label: 'C', text: 'wurden' },
          { id: 'opt-a2k-4d', label: 'D', text: 'waren' },
        ],
        correctOption: 'A',
        explanation: 'Wenn der Nebensatz vorangeht, beginnt der Hauptsatz sofort mit dem konjugierten Verb („sind wir spazieren gegangen“).',
        points: 10,
      },
      {
        id: 'q-a2-k5',
        prompt: 'Ich wohne schon _____ drei Jahren in München.',
        contextNote: 'Temporale Präposition seit + Dativ (Gegenwartsbezug)',
        optionCount: 4,
        options: [
          { id: 'opt-a2k-5a', label: 'A', text: 'seit' },
          { id: 'opt-a2k-5b', label: 'B', text: 'vor' },
          { id: 'opt-a2k-5c', label: 'C', text: 'in' },
          { id: 'opt-a2k-5d', label: 'D', text: 'für' },
        ],
        correctOption: 'A',
        explanation: 'Eine Handlung, die in der Vergangenheit begann und heute andauert, steht mit „seit + Dativ“.',
        points: 10,
      },
      {
        id: 'q-a2-k6',
        prompt: 'Zieh bitte deine warme Jacke an, _____ du dich nicht erkältest!',
        contextNote: 'Finaler Nebensatz mit damit',
        optionCount: 4,
        options: [
          { id: 'opt-a2k-6a', label: 'A', text: 'damit' },
          { id: 'opt-a2k-6b', label: 'B', text: 'weil' },
          { id: 'opt-a2k-6c', label: 'C', text: 'obwohl' },
          { id: 'opt-a2k-6d', label: 'D', text: 'denn' },
        ],
        correctOption: 'A',
        explanation: '„damit“ drückt einen Zweck oder ein Ziel aus (damit du dich nicht erkältest).',
        points: 10,
      },
    ],
  },

  B1: {
    goethe: [
      {
        id: 'q-b1-g1',
        prompt: 'Sehr geehrte Frau Dr. Wagner, bezugnehmend auf Ihre E-Mail _____ ich Ihnen mitteilen, dass der Termin bestätigt ist.',
        contextNote: 'Goethe B1 Sprachbausteine Teil 1: Höfliche Geschäftskorrespondenz',
        optionCount: 4,
        options: [
          { id: 'opt-b1-1a', label: 'A', text: 'möchte' },
          { id: 'opt-b1-1b', label: 'B', text: 'muss' },
          { id: 'opt-b1-1c', label: 'C', text: 'sollte' },
          { id: 'opt-b1-1d', label: 'D', text: 'werde' },
        ],
        correctOption: 'A',
        explanation: '„...möchte ich Ihnen mitteilen“ ist die standardisierte, höfliche Formulierung im Goethe B1 Briefmuster.',
        points: 10,
      },
      {
        id: 'q-b1-g2',
        prompt: 'Er hat die B1-Prüfung auf Anhieb bestanden, _____ er fleißig gelernt hatte.',
        contextNote: 'Goethe B1 Sprachbausteine: Kausale Verknüpfung im Präteritum/Plusquamperfekt',
        optionCount: 4,
        options: [
          { id: 'opt-b1-2a', label: 'A', text: 'weil' },
          { id: 'opt-b1-2b', label: 'B', text: 'obwohl' },
          { id: 'opt-b1-2c', label: 'C', text: 'trotzdem' },
          { id: 'opt-b1-2d', label: 'D', text: 'deshalb' },
        ],
        correctOption: 'A',
        explanation: '„weil“ drückt die logische Ursache aus und verlangt das finite Verb am Nebensatzende.',
        points: 10,
      },
      {
        id: 'q-b1-g3',
        prompt: 'Das ist genau der Kollege, mit _____ ich das Projekt zusammen ausgearbeitet habe.',
        contextNote: 'Goethe B1 Sprachbausteine Teil 2: Relativsatz mit Präposition + Dativ',
        optionCount: 4,
        options: [
          { id: 'opt-b1-3a', label: 'A', text: 'dem' },
          { id: 'opt-b1-3b', label: 'B', text: 'den' },
          { id: 'opt-b1-3c', label: 'C', text: 'der' },
          { id: 'opt-b1-3d', label: 'D', text: 'dessen' },
        ],
        correctOption: 'A',
        explanation: '„der Kollege“ ist maskulin. Nach der Präposition „mit“ steht der Dativ: „mit dem“.',
        points: 10,
      },
      {
        id: 'q-b1-g4',
        prompt: 'Wenn ich doch nur mehr Zeit hätte, _____ ich mich sofort für den C1-Kurs anmelden.',
        contextNote: 'Goethe B1 Konjunktiv II: Irreale Wünsche (würde + Infinitiv)',
        optionCount: 4,
        options: [
          { id: 'opt-b1-4a', label: 'A', text: 'würde' },
          { id: 'opt-b1-4b', label: 'B', text: 'werde' },
          { id: 'opt-b1-4c', label: 'C', text: 'könnte' },
          { id: 'opt-b1-4d', label: 'D', text: 'wollte' },
        ],
        correctOption: 'A',
        explanation: 'Konjunktiv II der Gegenwart: „würde ich mich anmelden“.',
        points: 10,
      },
      {
        id: 'q-b1-g5',
        prompt: 'Die neuen Richtlinien zur Sprachprüfung _____ ab dem nächsten Monat eingeführt.',
        contextNote: 'Goethe B1 Passiv Präsens (werden + Partizip II)',
        optionCount: 4,
        options: [
          { id: 'opt-b1-5a', label: 'A', text: 'werden' },
          { id: 'opt-b1-5b', label: 'B', text: 'wurden' },
          { id: 'opt-b1-5c', label: 'C', text: 'worden' },
          { id: 'opt-b1-5d', label: 'D', text: 'sind' },
        ],
        correctOption: 'A',
        explanation: 'Vorgangspassiv im Präsens Plural: „Die Richtlinien werden eingeführt“.',
        points: 10,
      },
      {
        id: 'q-b1-g6',
        prompt: 'Ich bitte Sie um Verständnis dafür, dass ich erst heute auf Ihre Anfrage _____ kann.',
        contextNote: 'Goethe B1 Sprachbausteine: Infinitiv nach Modalverb im Nebensatz',
        optionCount: 4,
        options: [
          { id: 'opt-b1-6a', label: 'A', text: 'antworten' },
          { id: 'opt-b1-6b', label: 'B', text: 'geantwortet' },
          { id: 'opt-b1-6c', label: 'C', text: 'antworte' },
          { id: 'opt-b1-6d', label: 'D', text: 'zu antworten' },
        ],
        correctOption: 'A',
        explanation: 'Nach dem Modalverb „kann“ am Nebensatzende steht der reine Infinitiv ohne zu: „antworten kann“.',
        points: 10,
      },
    ],
    grammatik: [
      {
        id: 'q-b1-k1',
        prompt: 'Trotz _____ schlechten Wetters unternahm die Reisegruppe eine ausgiebige Wanderung.',
        contextNote: 'Präposition mit Genitiv (trotz + Genitiv)',
        optionCount: 4,
        options: [
          { id: 'opt-b1k-1a', label: 'A', text: 'des' },
          { id: 'opt-b1k-1b', label: 'B', text: 'dem' },
          { id: 'opt-b1k-1c', label: 'C', text: 'das' },
          { id: 'opt-b1k-1d', label: 'D', text: 'den' },
        ],
        correctOption: 'A',
        explanation: '„trotz“ verlangt im Standarddeutschen den Genitiv. „Das Wetter“ (neutral) wird im Genitiv zu „des Wetters“.',
        points: 10,
      },
      {
        id: 'q-b1-k2',
        prompt: 'Er bat den Polizisten höflich, _____ den Weg zum Bahnhof zu erklären.',
        contextNote: 'Infinitivkonstruktion mit um / Infinitiv mit zu und Dativobjekt',
        optionCount: 4,
        options: [
          { id: 'opt-b1k-2a', label: 'A', text: 'ihm' },
          { id: 'opt-b1k-2b', label: 'B', text: 'ihn' },
          { id: 'opt-b1k-2c', label: 'C', text: 'sich' },
          { id: 'opt-b1k-2d', label: 'D', text: 'seiner' },
        ],
        correctOption: 'A',
        explanation: '„jemandem (Dativ) etwas erklären“: „...ihm den Weg zu erklären“.',
        points: 10,
      },
      {
        id: 'q-b1-k3',
        prompt: 'Die Studentin freut sich über ihren Erfolg, _____ sie die schwierige Prüfung bestanden hat.',
        contextNote: 'Kausal-/Temporalsatzverbindung: da / weil',
        optionCount: 4,
        options: [
          { id: 'opt-b1k-3a', label: 'A', text: 'da' },
          { id: 'opt-b1k-3b', label: 'B', text: 'denn' },
          { id: 'opt-b1k-3c', label: 'C', text: 'trotzdem' },
          { id: 'opt-b1k-3d', label: 'D', text: 'deshalb' },
        ],
        correctOption: 'A',
        explanation: '„da“ leitet einen Kausalsatz mit Verb am Ende ein und betont eine bekannte Begründung.',
        points: 10,
      },
      {
        id: 'q-b1-k4',
        prompt: 'Könnten Sie mir bitte sagen, _____ die nächste U-Bahn abfährt?',
        contextNote: 'Indirekte Frage mit Fragewort (Verb am Satzende)',
        optionCount: 4,
        options: [
          { id: 'opt-b1k-4a', label: 'A', text: 'wann' },
          { id: 'opt-b1k-4b', label: 'B', text: 'wenn' },
          { id: 'opt-b1k-4c', label: 'C', text: 'als' },
          { id: 'opt-b1k-4d', label: 'D', text: 'obwohl' },
        ],
        correctOption: 'A',
        explanation: 'Als Frage nach dem Zeitpunkt („Wann fährt die Bahn ab?“) lautet das Einleitungswort im indirekten Fragesatz „wann“.',
        points: 10,
      },
      {
        id: 'q-b1-k5',
        prompt: 'Wir haben uns entschlossen, dieses Jahr im Sommer nach Italien _____.',
        contextNote: 'Infinitivgruppe mit zu (entschließen zu + Infinitiv)',
        optionCount: 4,
        options: [
          { id: 'opt-b1k-5a', label: 'A', text: 'zu reisen' },
          { id: 'opt-b1k-5b', label: 'B', text: 'reisen' },
          { id: 'opt-b1k-5c', label: 'C', text: 'gereist' },
          { id: 'opt-b1k-5d', label: 'D', text: 'reisen zu' },
        ],
        correctOption: 'A',
        explanation: 'Nach „sich entschließen“ folgt eine Infinitivkonstruktion mit „zu + Infinitiv“: „zu reisen“.',
        points: 10,
      },
      {
        id: 'q-b1-k6',
        prompt: 'Der alte Mann, _____ Hut im Wind wegflog, lief hinterher.',
        contextNote: 'Relativpronomen im Genitiv maskulin (dessen)',
        optionCount: 4,
        options: [
          { id: 'opt-b1k-6a', label: 'A', text: 'dessen' },
          { id: 'opt-b1k-6b', label: 'B', text: 'dem' },
          { id: 'opt-b1k-6c', label: 'C', text: 'den' },
          { id: 'opt-b1k-6d', label: 'D', text: 'deren' },
        ],
        correctOption: 'A',
        explanation: 'Genitiv des maskulinen Relativpronomens für „der Mann“ ist „dessen“ (sein Hut).',
        points: 10,
      },
    ],
  },

  B2: {
    goethe: [
      {
        id: 'q-b2-g1',
        prompt: 'In Bezug auf Ihre Stellenausschreibung möchte ich betonen, dass ich _____ fundierte Fachkenntnisse als auch mehrjährige Berufserfahrung mitbringe.',
        contextNote: 'Goethe B2 Sprachbausteine: Zweiteiliger Konnektor sowohl... als auch',
        optionCount: 4,
        options: [
          { id: 'opt-b2-1a', label: 'A', text: 'sowohl' },
          { id: 'opt-b2-1b', label: 'B', text: 'nicht nur' },
          { id: 'opt-b2-1c', label: 'C', text: 'weder' },
          { id: 'opt-b2-1d', label: 'D', text: 'entweder' },
        ],
        correctOption: 'A',
        explanation: 'Der zweiteilige Konnektor lautet paarweise: „sowohl ... als auch“.',
        points: 10,
      },
      {
        id: 'q-b2-g2',
        prompt: 'Für weitere Rückfragen stehe ich Ihnen selbstverständlich jederzeit gern zur _____.',
        contextNote: 'Goethe B2 Sprachbausteine: Nomen-Verb-Verbindung zur Verfügung stehen',
        optionCount: 4,
        options: [
          { id: 'opt-b2-2a', label: 'A', text: 'Verfügung' },
          { id: 'opt-b2-2b', label: 'B', text: 'Auskunft' },
          { id: 'opt-b2-2c', label: 'C', text: 'Bereitschaft' },
          { id: 'opt-b2-2d', label: 'D', text: 'Diskussion' },
        ],
        correctOption: 'A',
        explanation: 'Die feste Nomen-Verb-Verbindung lautet „jemandem zur Verfügung stehen“.',
        points: 10,
      },
      {
        id: 'q-b2-g3',
        prompt: 'Es steht außer _____, dass erneuerbare Energien für die Zukunft unseres Planeten unverzichtbar sind.',
        contextNote: 'Goethe B2 Sprachbausteine: Feste Wendung außer Zweifel / Frage stehen',
        optionCount: 4,
        options: [
          { id: 'opt-b2-3a', label: 'A', text: 'Zweifel' },
          { id: 'opt-b2-3b', label: 'B', text: 'Problem' },
          { id: 'opt-b2-3c', label: 'C', text: 'Sorge' },
          { id: 'opt-b2-3d', label: 'D', text: 'Gedanken' },
        ],
        correctOption: 'A',
        explanation: '„außer Zweifel stehen“ bedeutet, dass etwas völlig sicher und unbestritten ist.',
        points: 10,
      },
      {
        id: 'q-b2-g4',
        prompt: 'Die vom Ministerium _____ Maßnahmen traten bereits zu Beginn des Quartals in Kraft.',
        contextNote: 'Goethe B2 Partizipialattribut: Partizip II mit Passivbedeutung',
        optionCount: 4,
        options: [
          { id: 'opt-b2-4a', label: 'A', text: 'beschlossenen' },
          { id: 'opt-b2-4b', label: 'B', text: 'beschließend' },
          { id: 'opt-b2-4c', label: 'C', text: 'beschlossene' },
          { id: 'opt-b2-4d', label: 'D', text: 'beschlossen' },
        ],
        correctOption: 'A',
        explanation: 'Attributives Partizip II im Akkusativ/Dativ Plural mit bestimmtem Artikel verlangt die Endung -en: „die beschlossenen Maßnahmen“.',
        points: 10,
      },
      {
        id: 'q-b2-g5',
        prompt: 'Das komplexe IT-System lässt sich nur durch geschultes Fachpersonal _____.',
        contextNote: 'Goethe B2 Passiversatzform: sich lassen + Infinitiv (kann bedient werden)',
        optionCount: 4,
        options: [
          { id: 'opt-b2-5a', label: 'A', text: 'bedienen' },
          { id: 'opt-b2-5b', label: 'B', text: 'bedient' },
          { id: 'opt-b2-5c', label: 'C', text: 'zu bedienen' },
          { id: 'opt-b2-5d', label: 'D', text: 'bedienend' },
        ],
        correctOption: 'A',
        explanation: '„lässt sich + Infinitiv“ ist eine Passiversatzform mit modaler Bedeutung (kann bedient werden).',
        points: 10,
      },
      {
        id: 'q-b2-g6',
        prompt: 'Je intensiver Sie sich auf die Prüfung vorbereiten, _____ souveräner werden Sie in der mündlichen Prüfung agieren.',
        contextNote: 'Goethe B2 Zweiteiliger Komparativ: je ... desto / umso',
        optionCount: 4,
        options: [
          { id: 'opt-b2-6a', label: 'A', text: 'desto' },
          { id: 'opt-b2-6b', label: 'B', text: 'wie' },
          { id: 'opt-b2-6c', label: 'C', text: 'als' },
          { id: 'opt-b2-6d', label: 'D', text: 'so' },
        ],
        correctOption: 'A',
        explanation: 'Der proportionale Konnektor lautet: „je + Komparativ ..., desto / umso + Komparativ ...“',
        points: 10,
      },
    ],
    grammatik: [
      {
        id: 'q-b2-k1',
        prompt: 'Hätte der Prüfling die Aufgabenstellung sorgfältiger gelesen, _____ ihm dieser gravierende Fehler nicht unterlaufen.',
        contextNote: 'Konjunktiv II der Vergangenheit (irreale Bedingung in der Vergangenheit)',
        optionCount: 4,
        options: [
          { id: 'opt-b2k-1a', label: 'A', text: 'wäre' },
          { id: 'opt-b2k-1b', label: 'B', text: 'hätte' },
          { id: 'opt-b2k-1c', label: 'C', text: 'würde' },
          { id: 'opt-b2k-1d', label: 'D', text: 'sei' },
        ],
        correctOption: 'A',
        explanation: 'Das Verb „unterlaufen“ bildet das Perfekt und den Konjunktiv II der Vergangenheit mit sein: „...wäre ihm der Fehler nicht unterlaufen.“',
        points: 10,
      },
      {
        id: 'q-b2-k2',
        prompt: 'Der Antrag wurde abgelehnt, _____ alle notwendigen Unterlagen fristgerecht eingereicht worden waren.',
        contextNote: 'Konzessive Subjunktion: obwohl / obgleich',
        optionCount: 4,
        options: [
          { id: 'opt-b2k-2a', label: 'A', text: 'obwohl' },
          { id: 'opt-b2k-2b', label: 'B', text: 'weil' },
          { id: 'opt-b2k-2c', label: 'C', text: 'infolgedessen' },
          { id: 'opt-b2k-2d', label: 'D', text: 'damit' },
        ],
        correctOption: 'A',
        explanation: '„obwohl“ drückt einen Gegengrund aus, der die Ablehnung überraschend erscheinen lässt.',
        points: 10,
      },
      {
        id: 'q-b2-k3',
        prompt: 'Die Geschäftsführung zog die Verlegung des Standorts ernsthaft in _____.',
        contextNote: 'Nomen-Verb-Verbindung: in Erwägung / Betracht ziehen',
        optionCount: 4,
        options: [
          { id: 'opt-b2k-3a', label: 'A', text: 'Betracht' },
          { id: 'opt-b2k-3b', label: 'B', text: 'Aussicht' },
          { id: 'opt-b2k-3c', label: 'C', text: 'Anspruch' },
          { id: 'opt-b2k-3d', label: 'D', text: 'Frage' },
        ],
        correctOption: 'A',
        explanation: '„etwas in Betracht ziehen“ bedeutet „über etwas nachdenken / etwas erwägen“.',
        points: 10,
      },
      {
        id: 'q-b2-k4',
        prompt: 'Aufgrund der _____ Sicherheitsvorkehrungen konnte der Vorfall verhindert werden.',
        contextNote: 'Adjektivdeklination im Genitiv Plural nach bestimmtem Artikel',
        optionCount: 4,
        options: [
          { id: 'opt-b2k-4a', label: 'A', text: 'strengen' },
          { id: 'opt-b2k-4b', label: 'B', text: 'strenge' },
          { id: 'opt-b2k-4c', label: 'C', text: 'strengem' },
          { id: 'opt-b2k-4d', label: 'D', text: 'strenger' },
        ],
        correctOption: 'A',
        explanation: 'Nach „aufgrund der“ (Genitiv Plural) endet das Adjektiv schwach auf „-en“: „der strengen Sicherheitsvorkehrungen“.',
        points: 10,
      },
      {
        id: 'q-b2-k5',
        prompt: 'Anstatt lange zu zögern, _____ sie umgehend die Initiative.',
        contextNote: 'Satzstruktur mit anstatt ... zu + Infinitiv',
        optionCount: 4,
        options: [
          { id: 'opt-b2k-5a', label: 'A', text: 'ergriff' },
          { id: 'opt-b2k-5b', label: 'B', text: 'ergreift' },
          { id: 'opt-b2k-5c', label: 'C', text: 'hat ergreifen' },
          { id: 'opt-b2k-5d', label: 'D', text: 'ergreife' },
        ],
        correctOption: 'A',
        explanation: 'Die feste Nomen-Verb-Verbindung lautet „die Initiative ergreifen“ (Präteritum: „ergriff“).',
        points: 10,
      },
      {
        id: 'q-b2-k6',
        prompt: 'Das Thema bedarf noch einer gründlichen _____ durch das Expertenkomitee.',
        contextNote: 'Verben mit Genitiv: bedürfen + Genitiv',
        optionCount: 4,
        options: [
          { id: 'opt-b2k-6a', label: 'A', text: 'Untersuchung' },
          { id: 'opt-b2k-6b', label: 'B', text: 'Untersuchungen' },
          { id: 'opt-b2k-6c', label: 'C', text: 'Untersuchen' },
          { id: 'opt-b2k-6d', label: 'D', text: 'Untersuchungs' },
        ],
        correctOption: 'A',
        explanation: '„bedürfen“ regiert den Genitiv: „einer gründlichen Untersuchung“ (feminin Genitiv).',
        points: 10,
      },
    ],
  },

  C1: {
    goethe: [
      {
        id: 'q-c1-g1',
        prompt: 'Angesichts der rasanten technologischen Transformation gilt es, die digitale Bildung nachhaltig _____ .',
        contextNote: 'Goethe C1 Sprachbausteine: Modale Fügung es gilt + zu + Infinitiv (muss getan werden)',
        optionCount: 4,
        options: [
          { id: 'opt-c1-1a', label: 'A', text: 'zu fördern' },
          { id: 'opt-c1-1b', label: 'B', text: 'fördern' },
          { id: 'opt-c1-1c', label: 'C', text: 'gefördert' },
          { id: 'opt-c1-1d', label: 'D', text: 'fördernd' },
        ],
        correctOption: 'A',
        explanation: 'Die gehobene Konstruktion „es gilt, etwas zu tun“ drückt eine Notwendigkeit im akademischen Register aus.',
        points: 10,
      },
      {
        id: 'q-c1-g2',
        prompt: 'Der Regierungssprecher erklärte, die wirtschaftliche Lage _____ stabiler als von vielen Experten prognostiziert.',
        contextNote: 'Goethe C1 Sprachbausteine: Konjunktiv I in der indirekten Rede (sein)',
        optionCount: 4,
        options: [
          { id: 'opt-c1-1a', label: 'A', text: 'sei' },
          { id: 'opt-c1-1b', label: 'B', text: 'wäre' },
          { id: 'opt-c1-1c', label: 'C', text: 'ist' },
          { id: 'opt-c1-1d', label: 'D', text: 'gewesen' },
        ],
        correctOption: 'A',
        explanation: 'In der formellen Berichterstattung und im Goethe C1 Modus fordert die indirekte Rede Konjunktiv I: 3. Person Singular „sei“.',
        points: 10,
      },
      {
        id: 'q-c1-g3',
        prompt: 'Die von der Universität neu _____ Forschungsergebnisse stießen international auf überwältigende Resonanz.',
        contextNote: 'Goethe C1 Sprachbausteine: Erweitertes Partizipialattribut (Partizip II)',
        optionCount: 4,
        options: [
          { id: 'opt-c1-3a', label: 'A', text: 'veröffentlichten' },
          { id: 'opt-c1-3b', label: 'B', text: 'veröffentlichenden' },
          { id: 'opt-c1-3c', label: 'C', text: 'veröffentlichte' },
          { id: 'opt-c1-3d', label: 'D', text: 'veröffentlicht' },
        ],
        correctOption: 'A',
        explanation: 'Erweitertes Partizip II im Akkusativ/Nominativ Plural nach bestimmtem Artikel: „die neu veröffentlichten Forschungsergebnisse“.',
        points: 10,
      },
      {
        id: 'q-c1-g4',
        prompt: 'Das Manuskript ist so stark beschädigt, dass es sich kaum noch entziffern _____ .',
        contextNote: 'Goethe C1 Passiversatzform: sich lassen + Infinitiv',
        optionCount: 4,
        options: [
          { id: 'opt-c1-4a', label: 'A', text: 'lässt' },
          { id: 'opt-c1-4b', label: 'B', text: 'kann' },
          { id: 'opt-c1-4c', label: 'C', text: 'muss' },
          { id: 'opt-c1-4d', label: 'D', text: 'scheint' },
        ],
        correctOption: 'A',
        explanation: '„lässt sich + Infinitiv“ bedeutet „kann entziffert werden“.',
        points: 10,
      },
      {
        id: 'q-c1-g5',
        prompt: 'Ungeachtet aller vehementen Einsprüche hielt das Gremium an seinem Beschluss unerschütterlich _____ .',
        contextNote: 'Goethe C1 Feste Präpositionalverbindung festhalten an + Dativ',
        optionCount: 4,
        options: [
          { id: 'opt-c1-5a', label: 'A', text: 'fest' },
          { id: 'opt-c1-5b', label: 'B', text: 'auf' },
          { id: 'opt-c1-5c', label: 'C', text: 'aus' },
          { id: 'opt-c1-5d', label: 'D', text: 'an' },
        ],
        correctOption: 'A',
        explanation: 'Das trennbare Verb lautet „festhalten an + Dativ“ (hielt ... fest).',
        points: 10,
      },
      {
        id: 'q-c1-g6',
        prompt: 'Die vorliegenden Befunde sind keineswegs als endgültig _____ , sondern erfordern weitere empirische Untersuchungen.',
        contextNote: 'Goethe C1 Sprachbausteine: sein + zu + Infinitiv (Passiversatzform mit müssen/können)',
        optionCount: 4,
        options: [
          { id: 'opt-c1-6a', label: 'A', text: 'anzusehen' },
          { id: 'opt-c1-6b', label: 'B', text: 'ansehen' },
          { id: 'opt-c1-6c', label: 'C', text: 'angesehen' },
          { id: 'opt-c1-6d', label: 'D', text: 'anzusehende' },
        ],
        correctOption: 'A',
        explanation: '„sein + zu + Infinitiv“ drückt im Passiv eine Notwendigkeit oder Möglichkeit aus: „sind anzusehen“ = dürfen/können angesehen werden.',
        points: 10,
      },
    ],
    grammatik: [
      {
        id: 'q-c1-k1',
        prompt: 'Es bedurfte _____ unermüdlichen Einsatzes aller Beteiligten, um das Projekt fristgerecht abzuschließen.',
        contextNote: 'Verben mit Genitivobjekt im gehobenen Sprachregister (bedürfen + Genitiv)',
        optionCount: 4,
        options: [
          { id: 'opt-c1k-1a', label: 'A', text: 'eines' },
          { id: 'opt-c1k-1b', label: 'B', text: 'einem' },
          { id: 'opt-c1k-1c', label: 'C', text: 'einen' },
          { id: 'opt-c1k-1d', label: 'D', text: 'einer' },
        ],
        correctOption: 'A',
        explanation: '„bedürfen“ verlangt den Genitiv: „der Einsatz“ (maskulin) wird im Genitiv zu „eines unermüdlichen Einsatzes“.',
        points: 10,
      },
      {
        id: 'q-c1-k2',
        prompt: '_____ der Zeuge unter Eid stand, verweigerte er die Aussage bezüglich der verdächtigen Transaktionen.',
        contextNote: 'Gehobene temporale/konzessive Satzverbindung: Obgleich / Während',
        optionCount: 4,
        options: [
          { id: 'opt-c1k-2a', label: 'A', text: 'Wiewohl' },
          { id: 'opt-c1k-2b', label: 'B', text: 'Insofern' },
          { id: 'opt-c1k-2c', label: 'C', text: 'Demzufolge' },
          { id: 'opt-c1k-2d', label: 'D', text: 'Infolgedessen' },
        ],
        correctOption: 'A',
        explanation: '„Wiewohl“ ist eine stilistisch gehobene Variante von „obwohl/obgleich“ und leitet einen konzessiven Nebensatz ein.',
        points: 10,
      },
      {
        id: 'q-c1-k3',
        prompt: 'Die Konferenzteilnehmer verständigten sich darauf, derartigen Vorfällen in Zukunft konsequent _____ .',
        contextNote: 'Gehobene Nomen-Verb-Kollokation: Einhalt gebieten (Dativ)',
        optionCount: 4,
        options: [
          { id: 'opt-c1k-3a', label: 'A', text: 'Einhalt zu gebieten' },
          { id: 'opt-c1k-3b', label: 'B', text: 'Widerstand zu leisten' },
          { id: 'opt-c1k-3c', label: 'C', text: 'Grenzen zu setzen' },
          { id: 'opt-c1k-3d', label: 'D', text: 'Aufmerksamkeit zu schenken' },
        ],
        correctOption: 'A',
        explanation: '„etwas (Dativ) Einhalt gebieten“ ist eine gehobene Redewendung für „etwas stoppen / beenden“.',
        points: 10,
      },
      {
        id: 'q-c1-k4',
        prompt: 'Die Maßnahme wurde beschlossen, _____ die öffentliche Sicherheit vollumfänglich zu gewährleisten.',
        contextNote: 'Infinitivkonstruktion mit um ... zu (Finalität)',
        optionCount: 4,
        options: [
          { id: 'opt-c1k-4a', label: 'A', text: 'um' },
          { id: 'opt-c1k-4b', label: 'B', text: 'ohne' },
          { id: 'opt-c1k-4c', label: 'C', text: 'anstatt' },
          { id: 'opt-c1k-4d', label: 'D', text: 'damit' },
        ],
        correctOption: 'A',
        explanation: '„um ... zu + Infinitiv“ bringt die finale Absicht zum Ausdruck: „um die Sicherheit zu gewährleisten“.',
        points: 10,
      },
      {
        id: 'q-c1-k5',
        prompt: 'Er tat so, als _____ er von den Vorfällen überhaupt nichts gewusst.',
        contextNote: 'Irreale Vergleichssätze mit als ob / als (Konjunktiv II)',
        optionCount: 4,
        options: [
          { id: 'opt-c1k-5a', label: 'A', text: 'hätte' },
          { id: 'opt-c1k-5b', label: 'B', text: 'habe' },
          { id: 'opt-c1k-5c', label: 'C', text: 'hatte' },
          { id: 'opt-c1k-5d', label: 'D', text: 'würde' },
        ],
        correctOption: 'A',
        explanation: 'Nach „als“ (ohne ob) im irrealen Vergleichssatz steht das finite Verb im Konjunktiv II direkt an Position 2: „als hätte er gewusst“.',
        points: 10,
      },
      {
        id: 'q-c1-k6',
        prompt: 'Die Ministerin lehnte es kategorisch ab, zu den Gerüchten Stellung zu _____ .',
        contextNote: 'Gehobene Nomen-Verb-Verbindung: Stellung nehmen zu + Dativ',
        optionCount: 4,
        options: [
          { id: 'opt-c1k-6a', label: 'A', text: 'nehmen' },
          { id: 'opt-c1k-6b', label: 'B', text: 'geben' },
          { id: 'opt-c1k-6c', label: 'C', text: 'bringen' },
          { id: 'opt-c1k-6d', label: 'D', text: 'stellen' },
        ],
        correctOption: 'A',
        explanation: 'Die feste Kollokation lautet „Stellung nehmen zu etwas“ (seine Meinung äußern).',
        points: 10,
      },
    ],
  },

  C2: {
    goethe: [
      {
        id: 'q-c2-g1',
        prompt: 'In Anbetracht der verfahrenen Verhandlungen steht zu _____ , dass der Gipfel ohne verbindliches Abkommen endet.',
        contextNote: 'Goethe C2 GDS: Modale Passivfügung stehen zu + Infinitiv (ist zu befürchten)',
        optionCount: 4,
        options: [
          { id: 'opt-c2-1a', label: 'A', text: 'befürchten' },
          { id: 'opt-c2-1b', label: 'B', text: 'befürchtet' },
          { id: 'opt-c2-1c', label: 'C', text: 'befürchtend' },
          { id: 'opt-c2-1d', label: 'D', text: 'befürchten zu' },
        ],
        correctOption: 'A',
        explanation: '„es steht zu + Infinitiv“ drückt im gehobenen Duktus eine unausweichliche Aussicht aus: „steht zu befürchten“ (muss befürchtet werden).',
        points: 10,
      },
      {
        id: 'q-c2-g2',
        prompt: 'Sein literarisches Werk zeichnet sich durch eine _____ stilistische Brillanz aus, die ihresgleichen sucht.',
        contextNote: 'Goethe C2 Sprachniveau: Idiomatische Adjektivkollokationen',
        optionCount: 4,
        options: [
          { id: 'opt-c2-2a', label: 'A', text: 'beispiellose' },
          { id: 'opt-c2-2b', label: 'B', text: 'beispielhafte' },
          { id: 'opt-c2-2c', label: 'C', text: 'beispieldurchsetzte' },
          { id: 'opt-c2-2d', label: 'D', text: 'beispielen' },
        ],
        correctOption: 'A',
        explanation: '„beispiellos“ bedeutet im feinen stilistischen Sprachgebrauch „einzigartig, ohne Vorbild“.',
        points: 10,
      },
      {
        id: 'q-c2-g3',
        prompt: 'Das Vorhaben droht an der schieren Ignoranz der Bürokratie zu _____ .',
        contextNote: 'Goethe C2: Feste Präpositionalverbindung scheitern an + Dativ',
        optionCount: 4,
        options: [
          { id: 'opt-c2-3a', label: 'A', text: 'scheitern' },
          { id: 'opt-c2-3b', label: 'B', text: 'misslingen' },
          { id: 'opt-c2-3c', label: 'C', text: 'zerbrechen' },
          { id: 'opt-c2-3d', label: 'D', text: 'untergehen' },
        ],
        correctOption: 'A',
        explanation: 'Die adäquate Wendung lautet „drohen an etwas (Dativ) zu scheitern“.',
        points: 10,
      },
      {
        id: 'q-c2-g4',
        prompt: 'Man mag von seinen Thesen halten, _____ man will, doch seine rhetorische Schärfe bleibt unbestritten.',
        contextNote: 'Goethe C2: Relativische Konzessivfügung mit Indefinitpronomen',
        optionCount: 4,
        options: [
          { id: 'opt-c2-4a', label: 'A', text: 'was' },
          { id: 'opt-c2-4b', label: 'B', text: 'das' },
          { id: 'opt-c2-4c', label: 'C', text: 'wie' },
          { id: 'opt-c2-4d', label: 'D', text: 'worüber' },
        ],
        correctOption: 'A',
        explanation: '„halten von ... was man will“ ist die idiomatische Wendung zur Einleitung eines subjektiven Urteils.',
        points: 10,
      },
      {
        id: 'q-c2-g5',
        prompt: 'Der Autor verstand es meisterhaft, die feinsten Seelenregungen seiner Protagonisten zur Geltung zu _____ .',
        contextNote: 'Goethe C2: Gehobene Kollokation zur Geltung bringen',
        optionCount: 4,
        options: [
          { id: 'opt-c2-5a', label: 'A', text: 'bringen' },
          { id: 'opt-c2-5b', label: 'B', text: 'führen' },
          { id: 'opt-c2-5c', label: 'C', text: 'stellen' },
          { id: 'opt-c2-5d', label: 'D', text: 'legen' },
        ],
        correctOption: 'A',
        explanation: 'Die feste Nomen-Verb-Verbindung lautet „etwas zur Geltung bringen“ (etwas wirksam werden lassen).',
        points: 10,
      },
      {
        id: 'q-c2-g6',
        prompt: 'Dem Gesetzentwurf wurde trotz energischer Vorbehalte der Opposition im Plenum _____ .',
        contextNote: 'Goethe C2: Feste juristische Wendung stattgeben (Dativ)',
        optionCount: 4,
        options: [
          { id: 'opt-c2-6a', label: 'A', text: 'stattgegeben' },
          { id: 'opt-c2-6b', label: 'B', text: 'zugestimmt' },
          { id: 'opt-c2-6c', label: 'C', text: 'bewilligt' },
          { id: 'opt-c2-6d', label: 'D', text: 'folgen geleistet' },
        ],
        correctOption: 'A',
        explanation: '„einer Sache (Dativ) stattgeben“ ist der juristische Fachterminus für die Annahme bzw. Bewilligung eines Antrags.',
        points: 10,
      },
    ],
    grammatik: [
      {
        id: 'q-c2-k1',
        prompt: 'Kraft seines Amtes erließ der Richter eine einstweilige Verfügung, _____ der Beklagte das Land nicht verlassen darf.',
        contextNote: 'C2 Grammatik: Genitivpräpositionen & Relativadverb kraft + Genitiv / wonach',
        optionCount: 4,
        options: [
          { id: 'opt-c2k-1a', label: 'A', text: 'wonach' },
          { id: 'opt-c2k-1b', label: 'B', text: 'wobei' },
          { id: 'opt-c2k-1c', label: 'C', text: 'woran' },
          { id: 'opt-c2k-1d', label: 'D', text: 'worüber' },
        ],
        correctOption: 'A',
        explanation: '„wonach“ bezieht sich auf den Inhalt einer Verfügung oder eines Beschlusses („eine Verfügung, der zufolge / wonach...“).',
        points: 10,
      },
      {
        id: 'q-c2-k2',
        prompt: 'Der Verdächtige stritt beharrlich ab, an jener folgenschweren Verschwörung beteiligt _____ .',
        contextNote: 'C2 Grammatik: Perfekt-Infinitiv Passiv (gewesen zu sein)',
        optionCount: 4,
        options: [
          { id: 'opt-c2k-2a', label: 'A', text: 'gewesen zu sein' },
          { id: 'opt-c2k-2b', label: 'B', text: 'zu sein' },
          { id: 'opt-c2k-2c', label: 'C', text: 'worden zu sein' },
          { id: 'opt-c2k-2d', label: 'D', text: 'gewesen sein' },
        ],
        correctOption: 'A',
        explanation: '„abstreiten, beteiligt gewesen zu sein“ (Zustandspassiv in der Vorzeitigkeit mit Infinitiv zu).',
        points: 10,
      },
      {
        id: 'q-c2-k3',
        prompt: 'Hätten die Beteiligten von vornherein mit offenen Karten gespielt, so _____ diese fatale Krise abgewendet werden können.',
        contextNote: 'C2 Grammatik: Doppelter Infinitiv im Konjunktiv II der Vergangenheit Passiv (hätte ... können)',
        optionCount: 4,
        options: [
          { id: 'opt-c2k-3a', label: 'A', text: 'hätte' },
          { id: 'opt-c2k-3b', label: 'B', text: 'wäre' },
          { id: 'opt-c2k-3c', label: 'C', text: 'würde' },
          { id: 'opt-c2k-3d', label: 'D', text: 'sei' },
        ],
        correctOption: 'A',
        explanation: 'Bei Modalverben mit Ersatzinfinitiv wird das Hilfsverb „haben“ im Konjunktiv II vorangestellt: „hätte abgewendet werden können“.',
        points: 10,
      },
      {
        id: 'q-c2-k4',
        prompt: 'Es erübrigt sich _____ , auf derartige Polemik im Detail einzugehen.',
        contextNote: 'C2 Grammatik: Pronominaladverb es erübrigt sich, ... zu + Infinitiv',
        optionCount: 4,
        options: [
          { id: 'opt-c2k-4a', label: 'A', text: 'somit' },
          { id: 'opt-c2k-4b', label: 'B', text: 'darum' },
          { id: 'opt-c2k-4c', label: 'C', text: 'demnach' },
          { id: 'opt-c2k-4d', label: 'D', text: 'daher' },
        ],
        correctOption: 'A',
        explanation: '„Es erübrigt sich somit“ schließt die logische Konsequenz im akademischen Stil elegant ab.',
        points: 10,
      },
      {
        id: 'q-c2-k5',
        prompt: 'Nichts deutete darauf hin, dass der Zeuge unter erheblichem Druck der Ankläger _____ .',
        contextNote: 'C2 Grammatik: Konjunktiv I / II in abhängigen Nebensätzen',
        optionCount: 4,
        options: [
          { id: 'opt-c2k-5a', label: 'A', text: 'stände' },
          { id: 'opt-c2k-5b', label: 'B', text: 'stand' },
          { id: 'opt-c2k-5c', label: 'C', text: 'stehe' },
          { id: 'opt-c2k-5d', label: 'D', text: 'gestanden habe' },
        ],
        correctOption: 'A',
        explanation: '„stände“ (Konjunktiv II von stehen) signalisiert im stilistisch anspruchsvollen Deutsch die hypothetische Distanzierung.',
        points: 10,
      },
      {
        id: 'q-c2-k6',
        prompt: 'Nicht nur versäumte der Angeklagte die Frist, _____ er verhöhnte auch die Richter.',
        contextNote: 'C2 Grammatik: Zweiteilige Satzverbindung nicht nur ... sondern (Inversion im Vordersatz)',
        optionCount: 4,
        options: [
          { id: 'opt-c2k-6a', label: 'A', text: 'sondern' },
          { id: 'opt-c2k-6b', label: 'B', text: 'aber' },
          { id: 'opt-c2k-6c', label: 'C', text: 'auch' },
          { id: 'opt-c2k-6d', label: 'D', text: 'jedoch' },
        ],
        correctOption: 'A',
        explanation: 'Das korrespondierende Konnektorenpärchen lautet fest: „Nicht nur [Inversion] ..., sondern [Hauptsatz/auch] ...“.',
        points: 10,
      },
    ],
  },
};

export const examGenerator = {
  getLevels(): CEFRLevel[] {
    return ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  },

  getModules(): Array<{ key: ExamModule; label: string; desc: string }> {
    return [
      { key: 'Grammatik', label: 'Grammatik-Strukturtest', desc: 'Kasus, Satzbau, Zeiten, Passiv & Konjunktiv' },
      { key: 'Lesen', label: 'Leseverstehen', desc: 'Texte, Artikel, Zuordnungen & Lese-Aufgaben' },
      { key: 'Hören', label: 'Hörverstehen', desc: 'Audiodateien, Dialoge & Hörverständnisfragen' },
      { key: 'Schreiben', label: 'Schriftlicher Ausdruck', desc: 'E-Mails, Aufsätze, Argumentationen & Briefe' },
      { key: 'Sprechen', label: 'Mündliche Prüfung', desc: 'Präsentationen, Bildbeschreibungen & Diskussionen' },
      { key: 'Wortschatz', label: 'Wortschatz & Idiomatik', desc: 'Nomen-Verb-Verbindungen & Vokabelbausteine' },
      { key: 'Goethe-Modelltest', label: 'Goethe-Zertifikat Modelltest', desc: 'Authentischer Komplett-Modelltest nach Goethe-Muster' },
    ];
  },

  generateExamPaper(opts: {
    level: CEFRLevel;
    patternType?: 'goethe' | 'grammatik';
    module?: ExamModule;
    authorName?: string;
  }): ExamPaper {
    const {
      level,
      patternType = 'goethe',
      module = patternType === 'goethe' ? 'Goethe-Modelltest' : 'Grammatik',
      authorName = 'Deutschkurs By Noman',
    } = opts;

    const levelBank = QUESTION_BANK[level] || QUESTION_BANK.B1;
    const questions = patternType === 'goethe' ? levelBank.goethe : levelBank.grammatik;

    const durations: Record<CEFRLevel, number> = {
      A1: 15,
      A2: 20,
      B1: 25,
      B2: 30,
      C1: 35,
      C2: 45,
    };

    const isGoethe = patternType === 'goethe' || module === 'Goethe-Modelltest';
    const title = isGoethe
      ? `Goethe-Zertifikat ${level}: ${module} (Offizielles Muster)`
      : `Deutschkurs By Noman ${level}: ${module} Prüfung`;

    const description = `Offizieller Prüfungsbogen für GER ${level} (${module}) nach den Standards von Deutschkurs By Noman & Goethe-Institut. 60% Bestehensquote erforderlich.`;

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const key = `#${level}-${randomSuffix}`;

    return {
      id: `paper-${level.toLowerCase()}-${Date.now().toString(36)}`,
      title,
      description,
      key,
      level,
      status: 'live',
      durationMinutes: durations[level] || 25,
      passPercentage: 60, // Standard 60% passing requirement
      category: module,
      authorName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      questions: JSON.parse(JSON.stringify(questions)), // deep copy
      pdfExportAvailable: true,
      answerKeyNotes: `Offizieller Lösungsschlüssel für Prüfung ${key} (GER ${level}). Alle Fragen mit grammatikalischer Erläuterung.`,
    };
  },

  generateAnswerKeyText(paper: ExamPaper): string {
    const lines = [
      '========================================================================',
      `          OFFIZIELLER LÖSUNGSSCHLÜSSEL / ANSWER KEY`,
      `                 DEUTSCHKURS BY NOMAN 🇩🇪`,
      '========================================================================',
      `Prüfung:     ${paper.title}`,
      `Niveau:      GER ${paper.level} (${paper.category})`,
      `Schlüssel:   ${paper.key}`,
      `Dauer:       ${paper.durationMinutes} Minuten`,
      `Bestehen:    Min. ${paper.passPercentage}%`,
      `Erstellt:    ${new Date(paper.createdAt).toLocaleDateString('de-DE')}`,
      `Autor:       ${paper.authorName}`,
      '------------------------------------------------------------------------',
      'FRAGEN & KORREKTE ANTWORTEN:',
      '',
    ];

    paper.questions.forEach((q, idx) => {
      const correctOpt = q.options.find((o) => o.label === q.correctOption);
      lines.push(`FRAGE ${idx + 1}: ${q.prompt}`);
      if (q.contextNote) lines.push(`Thema:   ${q.contextNote}`);
      lines.push(`Lösung:  Option [${q.correctOption}] -> ${correctOpt ? correctOpt.text : ''}`);
      lines.push(`Grund:   ${q.explanation}`);
      lines.push(`Punkte:  ${q.points} Pkt.`);
      lines.push('');
    });

    lines.push('========================================================================');
    lines.push('Prüfungskommission: Deutschkurs By Noman · Offizielle Prüfungsabteilung');
    lines.push('========================================================================');

    return lines.join('\n');
  },

  downloadAnswerKey(paper: ExamPaper) {
    const text = this.generateAnswerKeyText(paper);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Loesungsschluessel_${paper.level}_${paper.key.replace('#', '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};

