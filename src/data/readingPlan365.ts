import { ReadingDayPlan } from '../types';
import { BIBLE_BOOKS } from './bibleBooks';

// Generates the 365-day reading plan strictly following the 13-stage sequence:
// 1. Ewangelia Mateusza -> 2. Dzieje Apostolskie -> 3. Tora -> 4. Ewangelia Marka ->
// 5. Listy Apostolskie -> 6. Księgi Historyczne -> 7. Ewangelia Łukasza ->
// 8. Apokalipsa -> 9. Księgi Mądrościowe -> 10. Ewangelia Jana ->
// 11. Apokryfy -> 12. Księgi Prorockie -> 13. Inne starożytne dzieła.
export function generate365DayPlan(): ReadingDayPlan[] {
  const plan: ReadingDayPlan[] = [];

  const allChaptersList: {
    bookId: string;
    bookShortcut: string;
    bookName: string;
    stageNumber: number;
    stageName: string;
    chapter: number;
  }[] = [];

  BIBLE_BOOKS.forEach((book) => {
    for (let c = 1; c <= book.totalChapters; c++) {
      allChaptersList.push({
        bookId: book.id,
        bookShortcut: book.shortcut,
        bookName: book.name,
        stageNumber: book.stageNumber,
        stageName: book.stageName,
        chapter: c,
      });
    }
  });

  const totalChapters = allChaptersList.length;
  const basePerDay = totalChapters / 365;

  let currentIndex = 0;

  for (let day = 1; day <= 365; day++) {
    const targetEndIndex = Math.round(day * basePerDay);
    const dayChapters = allChaptersList.slice(currentIndex, targetEndIndex);
    currentIndex = targetEndIndex;

    const groupedReadings: {
      bookId: string;
      bookShortcut: string;
      bookName: string;
      fromChapter: number;
      toChapter: number;
    }[] = [];

    dayChapters.forEach((ch) => {
      const last = groupedReadings[groupedReadings.length - 1];
      if (last && last.bookId === ch.bookId && last.toChapter === ch.chapter - 1) {
        last.toChapter = ch.chapter;
      } else {
        groupedReadings.push({
          bookId: ch.bookId,
          bookShortcut: ch.bookShortcut,
          bookName: ch.bookName,
          fromChapter: ch.chapter,
          toChapter: ch.chapter,
        });
      }
    });

    const readingSummary = groupedReadings
      .map((r) =>
        r.fromChapter === r.toChapter
          ? `${r.bookShortcut} ${r.fromChapter}`
          : `${r.bookShortcut} ${r.fromChapter}–${r.toChapter}`
      )
      .join(', ');

    const firstCh = dayChapters[0] || allChaptersList[0];
    const firstReading = groupedReadings[0];

    let title = firstReading
      ? `${firstReading.bookName} ${
          firstReading.fromChapter === firstReading.toChapter
            ? firstReading.fromChapter
            : `${firstReading.fromChapter}–${firstReading.toChapter}`
        }`
      : `Dzień ${day}`;

    let theme = `${firstCh.stageName} · Zakres czytań: ${readingSummary}. Komentarz filologiczny, historyczny i egzegetyczny.`;

    if (day === 1) {
      title = 'Inauguracja Planu: Ewangelia wg św. Mateusza (Rodowód i Narodziny Mesjasza)';
      theme =
        'Etap 1 (Ewangelia Mateusza): Od Abrahama i Dawida do narodzin Emmanuela w Betlejem oraz Kazania na Górze.';
    } else if (groupedReadings.some((r) => r.bookId === 'ACT' && r.fromChapter === 1)) {
      title = 'Etap 2: Dzieje Apostolskie – Zesłanie Ducha Świętego i Kościół Pierwotny';
      theme =
        'Od Wniebowstąpienia na Górze Oliwnej i Pięćdziesiątnicy w Jerozolimie do misji apostolskiej.';
    } else if (groupedReadings.some((r) => r.bookId === 'GEN' && r.fromChapter === 1)) {
      title = 'Etap 3: Tora (Pięcioksiąg) – Stworzenie Świata (Bereshit)';
      theme =
        'Wejście w Pięcioksiąg Mojżeszowy: Hymn o stworzeniu nieba i ziemi, Ogród w Edenie i przymierze.';
    } else if (groupedReadings.some((r) => r.bookId === 'MAR' && r.fromChapter === 1)) {
      title = 'Etap 4: Ewangelia wg św. Marka – Początek Ewangelii o Jezusie Chrystusie';
      theme =
        'Głos Jana Chrzciciela na pustyni, chrzest w Jordanie i dynamiczna posługa uzdrawiania w Galilei.';
    } else if (groupedReadings.some((r) => r.bookId === 'ROM' && r.fromChapter === 1)) {
      title = 'Etap 5: Listy Apostolskie – List św. Pawła do Rzymian';
      theme =
        'Ewangelia jako moc Boża ku zbawieniu każdego wierzącego: sprawiedliwość z wiary i życie w Duchu.';
    } else if (groupedReadings.some((r) => r.bookId === 'JOS' && r.fromChapter === 1)) {
      title = 'Etap 6: Księgi Historyczne – Księga Jozuego i wejście do Ziemi Obiecanej';
      theme =
        '«Bądź mężny i mocny!» Przejście przez Jordan i początek dziejów Izraela w Kanaanie.';
    } else if (groupedReadings.some((r) => r.bookId === 'LUK' && r.fromChapter === 1)) {
      title = 'Etap 7: Ewangelia wg św. Łukasza – Zwiastowanie i Hymny Magnificat oraz Benedictus';
      theme =
        'Dokładne spisanie dziejów zbawienia dla Teofila: czułe miłosierdzie Boga nawiedzającego swój lud.';
    } else if (groupedReadings.some((r) => r.bookId === 'REV' && r.fromChapter === 1)) {
      title = 'Etap 8: Apokalipsa św. Jana – Objawienie Jezusa Chrystusa na wyspie Patmos';
      theme =
        'Wizja Syna Człowieczego pośród siedmiu złotych świeczników i listy do siedmiu Kościołów Azji.';
    } else if (groupedReadings.some((r) => r.bookId === 'JOB' && r.fromChapter === 1)) {
      title = 'Etap 9: Księgi Mądrościowe – Księga Hioba i tajemnica niezłomnej wiary';
      theme =
        'Wejście w literaturę mądrościową i poetycką Starego Testamentu: Hiob, Psalmy, Przysłowia, Kohelet, Pieśń nad Pieśniami, Mądrość i Syrach.';
    } else if (groupedReadings.some((r) => r.bookId === 'JOH' && r.fromChapter === 1)) {
      title = 'Etap 10: Ewangelia wg św. Jana – Prolog o Przedwiecznym Logosie';
      theme =
        '«Na początku było Słowo... A Słowo stało się ciałem i rozbiło namiot wśród nas».';
    } else if (groupedReadings.some((r) => r.bookId === '1EN' && r.fromChapter === 1)) {
      title = 'Etap 11: Apokryfy – 1 Księga Henocha i literatura międzytestamentalna';
      theme =
        'Lektura apokryfów: Księga Henocha, Księga Jubileuszy, Psalmy Salomona, 4 Księga Ezdrasza i 3 Machabejska.';
    } else if (groupedReadings.some((r) => r.bookId === 'ISA' && r.fromChapter === 1)) {
      title = 'Etap 12: Księgi Prorockie – Wielka Wizja Izajasza, syna Amosa';
      theme =
        'Orędzia Proroków Większych i Mniejszych: wezwanie do nawrócenia, obietnica Emmanuela i Nowego Przymierza.';
    } else if (groupedReadings.some((r) => r.bookId === 'DID' && r.fromChapter === 1)) {
      title = 'Etap 13: Inne starożytne dzieła – Didache, Ojcowie Apostolscy, Qumran i Flawiusz';
      theme =
        'Zwieńczenie planu: najstarsze pisma wczesnochrześcijańskie, zwoje znad Morza Martwego i świadectwa historyczne.';
    }

    plan.push({
      dayNumber: day,
      stageNumber: firstCh.stageNumber,
      stageName: firstCh.stageName,
      title,
      readings: groupedReadings,
      theme,
      estimatedMinutes: Math.max(12, Math.min(28, dayChapters.length * 4)),
    });
  }

  return plan;
}

export const READING_PLAN_365 = generate365DayPlan();
