import fs from 'fs';
import path from 'path';
import { B as y1 } from '../.data/wnr365/yr1.js';
import { B as y2 } from '../.data/wnr365/yr2.js';
import { B as y3 } from '../.data/wnr365/yr3.js';
import { B as y4 } from '../.data/wnr365/yr4.js';

const missingBt5 = JSON.parse(
  fs.readFileSync(path.resolve('.data/wnr365/missing_bt5.json'), 'utf8')
);

const BOOK_TITLE_TO_ID = {
  'Ewangelia wg św. Mateusza': 'MAT',
  'Dzieje Apostolskie': 'ACT',
  'Księga Rodzaju': 'GEN',
  'Księga Wyjścia': 'EXO',
  'Księga Kapłańska': 'LEV',
  'Księga Liczb': 'NUM',
  'Księga Powtórzonego Prawa': 'DEU',
  'Ewangelia wg św. Marka': 'MAR',
  'List do Rzymian': 'ROM',
  '1 List do Koryntian': '1CO',
  '2 List do Koryntian': '2CO',
  'List do Galatów': 'GAL',
  'List do Efezjan': 'EPH',
  'List do Filipian': 'PHP',
  'List do Kolosan': 'COL',
  '1 List do Tesaloniczan': '1TH',
  '2 List do Tesaloniczan': '2TH',
  '1 List do Tymoteusza': '1TI',
  '2 List do Tymoteusza': '2TI',
  'List do Tytusa': 'TIT',
  'List do Filemona': 'PHM',
  'List do Hebrajczyków': 'HEB',
  'List św. Jakuba': 'JAS',
  '1 List św. Piotra': '1PE',
  '2 List św. Piotra': '2PE',
  '1 List św. Jana': '1JO',
  '2 List św. Jana': '2JO',
  '3 List św. Jana': '3JO',
  'List św. Judy': 'JUD',
  'Księga Jozuego': 'JOS',
  'Księga Sędziów': 'JDG',
  'Księga Rut': 'RUT',
  '1 Księga Samuela': '1SA',
  '2 Księga Samuela': '2SA',
  '1 Księga Królewska': '1KI',
  '2 Księga Królewska': '2KI',
  '1 Księga Kronik': '1CH',
  '2 Księga Kronik': '2CH',
  'Księga Ezdrasza': 'EZR',
  'Księga Nehemiasza': 'NEH',
  'Księga Tobiasza': 'TOB',
  'Księga Judyty': 'JDT',
  'Ewangelia wg św. Łukasza': 'LUK',
  'Apokalipsa św. Jana': 'REV',
  'Księga Hioba': 'JOB',
  'Księga Psalmów': 'PSA',
  'Księga Przysłów': 'PRO',
  'Księga Koheleta': 'ECC',
  'Pieśń nad Pieśniami': 'SNG',
  'Księga Mądrości': 'WIS',
  'Mądrość Syracha': 'SIR',
  'Ewangelia wg św. Jana': 'JOH',
  '1 Księga Henocha': '1EN',
  'Księga Jubileuszy': 'JUB',
  'Testamenty 12 Patriarchów': 'TES_12',
  'Psalmy Salomona': 'PS_SOL',
  '4 Księga Ezdrasza': '4EZR',
  'Apokalipsa Barucha': '2BAR',
  'Protoewangelia Jakuba': 'PJAC',
  'Ewangelia Tomasza': 'GTH',
  'Ewangelia Filipa': 'GPH',
  'Ewangelia Dzieciństwa Tomasza': 'ITH',
  'Księga Izajasza': 'ISA',
  'Księga Jeremiasza': 'JER',
  'Lamentacje Jeremiasza': 'LAM',
  'Księga Barucha': 'BAR',
  'Księga Ezechiela': 'EZE',
  'Księga Daniela': 'DAN',
  'Księga Ozeasza': 'HOS',
  'Księga Joela': 'JOL',
  'Księga Amosa': 'AMO',
  'Księga Abdiasza': 'OBA',
  'Księga Jonasza': 'JON',
  'Księga Micheasza': 'MIC',
  'Księga Nahuma': 'NAH',
  'Księga Habakuka': 'HAB',
  'Księga Sofoniasza': 'ZEP',
  'Księga Aggeusza': 'HAG',
  'Księga Zachariasza': 'ZEC',
  'Księga Malachiasza': 'MAL',
  'Didache - Nauka Dwunastu Apostołów': 'DID',
  '1 List Klemensa do Koryntian': '1CL',
  '2 List Klemensa do Koryntian': '2CL',
  'Listy św. Ignacego Antiocheńskiego': 'IGN',
  'List św. Polikarpa': 'POL',
  'List Barnaby': 'BAR_EP',
  'Pasterz Hermasa': 'HER',
  'List do Diogneta': 'DIOG',
};

// Restored 1:1 Polish translation (R. Rubinkiewicz) for 1 Księga Henocha 1-10 (fixing the clipped verse prefixes in yr4.js)
const RESTORED_1EN = {
  1: `Słowo błogosławieństwa Henocha, którym pobłogosławił wybranych i sprawiedliwych obecnych w dniu ucisku, podczas którego wszyscy źli i niegodziwi zostaną usunięci. Henoch, człowiek błogosławiony i sprawiedliwy, któremu Pan otworzył oczy i obdarzył świętym widzeniem w niebiosach, zabrał głos i powiedział: To, co pokazali mi aniołowie! Usłyszałem od nich wszystko i zrozumiałem to, co zobaczyłem, choć przeznaczone to jest nie temu pokoleniu, lecz pokoleniom dalekim, które dopiero nadejdą. Mówiłem na temat wybranych i o nich ułożyłem przypowieść: Święty (Kaddosz) i Wielki (Eljon) wyjdzie ze swego mieszkania, a odwieczny Bóg (Elohim) zstąpi na Górę Synaj i ukaże się ze swoim zastępem i objawi się w mocy swej niebiańskiej potęgi. Wszyscy ulegną przerażeniu, a Czuwający zadrżą i strach oraz wielkie drżenie zapanuje aż po krańce ziemi. Wysokie góry zostaną poruszone, a wyniosłe wzgórza zmaleją i topnieć będą jak wosk przed ogniem. Ziemia pogrąży się, a wszystko, co się na niej znajduje, ulegnie zniszczeniu. Na wszystko zostanie wydany wyrok, również na wszystkich sprawiedliwych. Sprawiedliwych zaś Bóg obdarzy pokojem, swoich wybranych zachowa i zmiłuje się nad nimi. Wszyscy będą należeli do Boga, będzie im się powodzić i będą błogosławieni, a światło Boże nad nimi będzie świecić. Bo oto przychodzi z dziesięcioma tysiącami świętych, aby dokonać sądu nad nimi i aby zniszczyć grzeszników, i aby złajać każdego za to wszystko, co przeciwko Niemu uczynili grzesznicy i niegodziwcy.`,
  2: `Rozważcie wszystko, co dzieje się na niebie, jak światła nie zmieniają swego biegu, jak każde wschodzi i zachodzi zgodnie z porządkiem, każde w swoim czasie, nie zmieniając swych reguł. Spójrzcie na ziemię i zrozumcie na podstawie dokonanych od początku do końca na niej dzieł, że jak to wyraźnie widać, żadne z dzieł Boga się nie zmienia. Popatrzcie na lato i zimę, jak cała ziemia pełna jest wody, a chmury, rosa i deszcz pozostają na niej.`,
  3: `Przyjrzyjcie się i zobaczcie, jak wszystkie drzewa usychają i jak wszystkie ich liście opadają z wyjątkiem czternastu drzew, których liście nie opadają, które pozostają ze starym listowiem, aż po dwóch lub trzech latach przychodzi nowe listowie.`,
  4: `Przyjrzyjcie się jeszcze letniej porze, gdy na początku lata słońce jest ponad ziemią. Wtedy z powodu żaru słońca szukacie cienia, a ziemia praży skwarem i nie możecie stąpać po ziemi lub po skale z powodu owego żaru.`,
  5: `Przyjrzyjcie się, jak drzewa pokryte są zielonymi liśćmi i rodzą owoc. Zrozumcie to wszystko i pojmijcie, jak Ten, który żyje na wieki, dokonał wszystkich tych spraw, jak Jego dzieła trwają przed Nim w każdym następnym roku, jak wszystkie Jego dzieła służą Mu i nie zmieniają się. Tak jak Bóg kazał, tak wszystko się dokonuje. Zauważcie, jak morza i rzeki wypełniają swe zadania. Wy zaś nie wytrwaliście ani nie zachowywaliście Prawa Pana, ale przekroczyliście je i swoimi nieczystymi ustami wypowiadaliście słowa pełne pychy i zatwardziałości przeciwko Jego majestatowi. O wy twardego serca! Nie zaznacie pokoju! Dlatego będziecie przeklinać dni wasze i zostaniecie pozbawieni lat waszego życia. Wieczne przekleństwo się wzmoże, a wy nie doznacie zmiłowania. W owych dniach przekażecie wasze imiona sprawiedliwym na wieczne przekleństwo, a sprawiedliwi, o przeklęci, będą wam grzesznikom i niegodziwcom złorzeczyć na wieki. Dla wybranych zaś nastaną światło, radość, pokój i odziedziczą ziemię, a wy niegodziwcy otrzymacie przekleństwo. Następnie sprawiedliwi posiądą mądrość. Będą oni wszyscy żyć i już więcej nie będą grzeszyć, czy to przez zapomnienie, czy z powodu pychy. Lecz ci, którzy posiadają mądrość, będą pokorni. Nie będą już popełniać zła, sąd ich nie dosięgnie przez wszystkie dni ich życia i nie umrą z powodu Boskiego gniewu i oburzenia, lecz dopełnią liczby dni swego życia i ich życie upłynie w pokoju, a lata swej radości spędzą w zadowoleniu i wiecznym pokoju po wszystkie dni swego życia.`,
  6: `I stało się, kiedy synowie ludzcy rozmnożyli się, że urodziły im się w owych dniach ładne i piękne córki. I ujrzeli je synowie nieba, aniołowie, i zapragnęli ich. Jeden drugiemu powiedział: «Chodźmy, wybierzmy sobie żony z córek ludzkich i spłodźmy sobie dzieci». A Szemihaza, który był ich dowódcą, powiedział do nich: «Obawiam się, że może nie zechcecie tego zrobić i że tylko ja sam poniosę karę za ten wielki grzech». Odpowiadając mu rzekli: «Przysięgnijmy wszyscy i zwiążmy się przekleństwami, że nie zmienimy tego planu, ale doprowadzimy zamiar do skutku». Następnie wszyscy razem przysięgli i związali się wzajemnie przekleństwami. Było ich wszystkich dwustu. Zstąpili na Ardis, szczyt góry Hermon. Nazwali ją górą Hermon, albowiem na niej przysięgali i związali się wzajemnie przekleństwami. Oto są imiona ich przywódców: Szemihaza, ich dowódca, Urakiba, Ramiel, Kokabiel, Tamiel, Ramiel, Daniel, Ezekiel, Barakiel, Asael, Armaros, Batriel, Ananiel, Zakiel, Samsiel, Sartael, Turiel, Jomiel, Araziel. Są to dowódcy dwustu aniołów i wszystkich innych z nimi.`,
  7: `Wzięli sobie żony, każdy po jednej. Zaczęli do nich chodzić i przestawać z nimi. Nauczyli je czarów i zaklęć i pokazali im, jak wycinać korzenie i drzewa. Zaszły one w ciążę i zrodziły wielkich gigantów, których wysokość wynosiła trzy tysiące łokci. Pożerali oni wszelki znój ludzki, a ludzie nie potrafili ich utrzymać. Wtedy giganci obrócili się przeciwko ludziom, aby ich pożreć. Zaczęli grzeszyć przeciwko ptakom, zwierzętom, gadom i rybom. Pożerali mięso jedni drugich i pili zeń krew. Wtedy ziemia poskarżyła się na nieprawych.`,
  8: `Azazel nauczył ludzi wyrabiać miecze, sztylety, tarcze i napierśniki. Pokazał im metale i sposób ich obróbki: bransolety i ozdoby, sztukę malowania oczu i upiększania powiek, bardzo cenne i wyszukane kamienie i wszelki rodzaj kolorowych barwników. I świat uległ zmianie. Nastała wielka niegodziwość i wielki nierząd. Pobłądzili, a wszystkie ich drogi stały się zepsute. Szemihaza wyuczył zaklinaczy i nacinaczy korzeni, Armaros nauczył odklinania, Barakiel wychował astrologów, Kokabiel złowieszczów, Tamiel wyuczył astronomii, Asradel nauczył dróg księżyca. Ludzie zaś ginąc wołali, a głos ich doszedł do nieba.`,
  9: `Wówczas Michał, Gabriel, Suriel i Uriel spojrzeli z nieba i ujrzeli wielką ilość rozlanej krwi na ziemi i wszelką niegodziwość, jakiej dokonano na ziemi. I rzekli jeden do drugiego: «Niech zniszczona ziemia zawoła głosem ich krzyków aż do bramy niebios. Oto wam to, o Święci niebios, skarżą się dusze ludzi mówiąc: Zanieście naszą skargę przed Najwyższego». I rzekli do Pana, Króla: «Panie panów, Boże bogów, Królu królów! Twój chwalebny tron trwa po wszystkie pokolenia świata, a Twoje imię jest święte i wychwalane przez wszystkie pokolenia świata, błogosławione i chwalebne! Tyś wszystko uczynił i władza nad wszystkim jest Twoja. Wszystko jest jawne i otwarte przed Tobą i widzisz wszystko i nie ma niczego, co mogłoby być przed Tobą ukryte. Widziałeś więc, co uczynił Azazel, jak nauczył wszelkiej niegodziwości na ziemi i odsłonił odwieczne tajemnice przechowywane w niebie. Szemihaza zaś nauczył zaklęć, ten, któremu dałeś władzę, aby panował nad tymi, którzy są z nim. Razem poszli do córek ludzkich i spali z tymi kobietami i stali się nieczyści i objawili im te grzechy. Kobiety zaś zrodziły gigantów (nefilimów) i przez to cała ziemia napełniła się krwią i niegodziwością. A teraz oto dusze zmarłych wołają i skarżą się. Aż do bram niebios skarga ich dotarła, bo nie mogą przemóc niegodziwości popełnionej na ziemi. Ty wiesz o wszystkim, zanim coś się stanie i znasz ich sprawę. Jednak nic nam nie mówisz. Co mamy z nimi począć?»`,
  10: `Wówczas Najwyższy, Wielki i Święty odezwał się. Posłał Arsialaiura do syna Lamecha mówiąc mu: «Powiedz mu w moim imieniu: Ukryj się! Wyjaw mu nadchodzący koniec, albowiem cała ziemia zostanie zniszczona. Na całej ziemi nastanie potop i to, co na niej się znajduje, ulegnie zniszczeniu. Poucz go, jak ma uciec i jak jego potomstwo ma przeżyć na ziemi». Następnie Pan powiedział do Rafaela (Rafała): «Zwiąż Azazela za ręce i nogi i wrzuć go do ciemności. Otwórz pustynię, która jest w Dudael, i wrzuć go tam. Rzuć na niego chropowate i ostre kamienie i przykryj go ciemnością. Niech tam przebywa na zawsze! Przykryj jego oblicze, żeby nie mógł widzieć światła, i żeby w wielki dzień sądu mógł być wrzucony do ognia. Ożyw ziemię, którą zniszczyli aniołowie, i zapowiedz uzdrowienie ziemi, albowiem Ja ożywię ziemię tak, że nie wszyscy synowie ludzcy wyginą z powodu wszelkiej tajemnicy, którą aniołowie dali poznać i nauczyli swych synów. Cała ziemia została zrujnowana nauką dzieł Azazela i jemu przypisz cały grzech!». I rzekł Pan do Gabriela: «Wystąp przeciwko bękartom i rozpustnikom i przeciwko synom nierządu i zgładź synów nierządu i synów Czuwających spośród ludzi. Odeślij ich, poślij ich jednego przeciwko drugiemu, niech się wygubią w bitwie, bo długość dni nie będzie im dana. Nic nie wskórają ci, którzy będą cię o nich prosić, bo spodziewają się życia wiecznego i że każdy z nich będzie żył pięćset lat». Do Michała Pan powiedział: «Idź, powiadom Szemihazę i innych, którzy są z nim, którzy połączyli się z kobietami i ulegli z nimi zepsuciu z wszelką ich nieczystością. Kiedy ich synowie się pozabijają i kiedy ujrzą zniszczenie swych umiłowanych, zwiąż ich na siedemdziesiąt pokoleń pod wzgórzami ziemi aż do dni sądu i ich spełnienia, aż dopełni się sąd przeznaczony na całą wieczność. Wówczas poprowadzą ich do otchłani ognia na męki i zostaną zamknięci w więzieniu na całą wieczność. Wówczas Szemihaza zostanie spalony i unicestwiony wraz z nimi. Zostaną razem związani aż do końca wszystkich pokoleń. Zniszcz wszystkie dusze rozpustne i synów Czuwających, bo zepsuli oni ludzi. Usuń wszelki ucisk z powierzchni ziemi, a wszelkie złe dzieło ustanie. Niech pojawi się roślina sprawiedliwości i prawdy, a czyny staną się błogosławieństwem. Sprawiedliwość i prawdę będą sadzić w radości na zawsze. Teraz wszyscy sprawiedliwi ocaleją i żyć będą tak długo, aż zrodzą tysiące. Wszystkie dni ich młodości i ich starości dopełnią się w pokoju. W owych dniach cała ziemia napełniona zostanie sprawiedliwością i cała zostanie zasadzona drzewami i napełni się błogosławieństwem. Zasadzą na niej wszelkie przyjemne drzewa, zasadzą na niej winorośle, a winorośl, która zostanie na niej zasadzona, wyda obfity owoc. Wszelkie nasienie, które na niej będzie posiane, każda miara wyda tysiąc, a każda miara oliwek wyda dziesięć bat oliwy. A ty oczyść ziemię z wszelkiego zła i z wszelkiej nieprawości, i z wszelkiej nieczystości, którą przyniesiono na ziemię. Usuńcie je z ziemi. Wszystkie dzieci ludzkie będą sprawiedliwe i wszystkie narody błogosławić i służyć Mi będą. Cała ziemia zostanie oczyszczona z wszelkiego zepsucia, z wszelkiego grzechu, z wszelkiego gniewu i z wszelkiej udręki. Nie ześlę więcej na nią potopu po wszystkie pokolenia na wieki».`,
};

function cleanScriptureText(raw) {
  return (raw || '')
    .split('\n')
    .filter((n) => !/^\s*#/.test(n))
    .join('\n')
    .replace(/^Tekst Biblijny\s*\(Biblia Tysiąclecia\s*[–-]\s*Wydanie V\)\s*/i, '')
    .replace(/^Tekst Święty i Tradycja Ojców\s*\([^)]*\)\s*/i, '')
    .replace(/<werset\s+nr="\s*(?:\*\*\s*\d+\s*\*\*\s*)?\d*"?\s*\/?>?/gi, ' ')
    .replace(/«««?[^»]{1,25}»»»?/g, ' ')
    .replace(/\*\*\s*\d+[a-z]?\s*\*\*/gi, ' ')
    .replace(new RegExp('^\\s*\\d+[a-z]?\\s+(?=\\p{Lu})', 'gmu'), '')
    .replace(/\(\s*\)|<\s*>|\[\s*\]/g, ' ')
    .replace(/[<>\[\]]/g, '')
    .replace(/^\s*-{3,}\s*$/gm, '')
    .replace(/[*_]/g, '')
    .replace(/\s+([.,!?;:])/g, '$1')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanCommentarySection(raw) {
  return (raw || '')
    .replace(/^[^\n]*\n+/, '') // strip the section header line after '## N. '
    .replace(/^\s*-{3,}\s*$/gm, '')
    .split('\n')
    .filter((n) => !/^\s*#{1,6}\s/.test(n))
    .map((n) => n.replace(/^\s*(?:\d+\.|[-•*])\s+/, '').replace(/^\s*>\s?/, ''))
    .join(' ')
    .replace(/-{3,}/g, ' ')
    .replace(/[*_]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseMarkdownSections(content) {
  const sections = {};
  const parts = (content || '').split(/\n##\s*(\d+)\.\s*/);
  const s1Match = (content || '').split(/\n##\s*2\.\s*/)[0] || '';
  sections[1] = s1Match;
  for (let i = 1; i < parts.length; i += 2) {
    const num = parseInt(parts[i], 10);
    const body = parts[i + 1] || '';
    sections[num] = body;
  }
  return sections;
}

const CANONICAL_PREFIX_FIXES = {
  'NUM-26': (t) => (t.startsWith('rzekł Pan') ? 'Po ustaniu plagi ' + t : t),
  'JOH-9': (t) => (t.startsWith('przechodząc obok') ? 'Jezus ' + t : t),
  'NEH-8': (t) => (t.startsWith('wtedy zgromadził') ? 'W' + t.slice(1) : t),
  'ISA-64': (t) =>
    t.startsWith('podobnie jak ogień')
      ? 'Obyś rozdarł niebiosa i zstąpił – przed Tobą skłębiłyby się góry – ' + t
      : t,
  'DAN-11': (t) =>
    t.startsWith('który stoi')
      ? 'Anioł Pański rzekł do Daniela: Stoję począwszy od pierwszego roku panowania Dariusza Meda jako wzmocnienie i obrona dla niego.' +
        t.replace(/^który stoi począwszy od pierwszego roku panowania Dariusza Meda jako wzmocnienie i obrona dla mnie\./, '')
      : t,
  'HOS-7': (t) => (t.startsWith('gdy Izraela uleczę') ? 'Gdy Izraela uleczę,' + t.slice(19) : t),
};

const allRaw = [
  ...Object.values(y1),
  ...Object.values(y2),
  ...Object.values(y3),
  ...Object.values(y4),
];

const db = {};

for (const item of allRaw) {
  const bookId = BOOK_TITLE_TO_ID[item.bookTitle];
  if (!bookId) continue;

  const ch = Number(item.chapter);
  const key = `${bookId}-${ch}`;
  const sections = parseMarkdownSections(item.content);

  const s2 = cleanCommentarySection(sections[2] || '');
  const s3 = cleanCommentarySection(sections[3] || '');
  const s4 = cleanCommentarySection(sections[4] || '');
  const s5 = cleanCommentarySection(sections[5] || '');
  const s6 = cleanCommentarySection(sections[6] || '');
  const s7 = cleanCommentarySection(sections[7] || '');

  let chapterText = '';

  if (bookId === '1EN' && RESTORED_1EN[ch]) {
    chapterText = RESTORED_1EN[ch];
  } else if (['PJAC', 'GTH', 'GPH', 'ITH'].includes(bookId)) {
    chapterText = cleanScriptureText(sections[1]);
  } else if (bookId === 'DID') {
    const baseDid = cleanScriptureText(sections[1]);
    chapterText = `${baseDid} ${s3}`.trim();
  } else if (
    ['JUB', 'TES_12', 'PS_SOL', '4EZR', '2BAR', '1CL', '2CL', 'IGN', 'POL', 'BAR_EP', 'HER', 'DIOG'].includes(
      bookId
    )
  ) {
    // Use the verified, unclipped chapter presentation and direct source quotations from sections 2 & 3
    chapterText = `${s2} ${s3}`.trim();
  } else {
    // Canonical Bible Book (Biblia Tysiąclecia - Wydanie V 1:1)
    chapterText = cleanScriptureText(sections[1]);
    if (CANONICAL_PREFIX_FIXES[key]) {
      chapterText = CANONICAL_PREFIX_FIXES[key](chapterText);
    }
  }

  // Extract a concise title from s2 (first sentence)
  const firstSentence = (s2.split(/\.\s+/)[0] || `${item.bookTitle}, rozdział ${ch}`).trim();
  const title = firstSentence.endsWith('.') ? firstSentence.slice(0, -1) : firstSentence;

  db[key] = {
    title,
    text: chapterText,
    s2,
    s3,
    s4,
    s5,
    s6,
    s7,
  };
}

// Now add the 47 canonical chapters from missing_bt5.json (JDT 11-16, EST 1-10, 1MA 1-16, 2MA 1-15)
const MISSING_BOOK_CONTEXT = {
  JDT: {
    name: 'Księga Judyty',
    s2Prefix: 'Rozdział należy do drugiej, kulminacyjnej części Księgi Judyty, ukazującej ocalenie oblężonej Betulii i Jerozolimy dzięki wierze, modlitwie i odwadze Judyty.',
    s4: 'Narracja osadzona jest w realiach starożytnych kampanii oblężniczych na pograniczu wyżyny samaryjskiej i judzkiej. Postać Judyty („Żydówki”) ucieleśnia wierność Prawu Mojżeszowemu (koszerność pokarmów, modlitwa w godzinie kadzenia w Świątyni Jerozolimskiej) wobec brutalnej potęgi militarnej imperium.',
    s5: 'Bóg wybawia swój lud nie przez potęgę oręża, lecz przez pokorną i nieustraszoną wiarę osoby całkowicie Mu oddanej. Pycha Holofernesa zostaje pokonana przez Bożą opatrzność.',
    s6: 'Judyta w tradycji patrystycznej i liturgicznej Kościoła jest figurą (typem) Maryi – Niewiasty miażdżącej głowę węża («Tyś chwałą Jeruzalem, tyś wielką dumą Izraela» – Jdt 15,9) oraz Kościoła zwyciężającego moce zła modlitwą.',
    s7: 'Księga Wyjścia 15 (Pieśń Miriam nad Morzem Czerwonym); Księga Sędziów 4–5 (Debora i Jael pokonująca Siserę); Łk 1,42.46–55 (Błogosławieństwo Elżbiety i Magnificat Maryi).',
  },
  EST: {
    name: 'Księga Estery',
    s2Prefix: 'Rozdział wchodzi w skład Księgi Estery (w pełnym wydaniu z dodatkami deuterokanonicznymi), opisującej dramatyczne ocalenie diaspory żydowskiej w Imperium Perskim za króla Kserksesa I (Aswerusa) i ustanowienie święta Purim.',
    s4: 'Akcja rozgrywa się w zimowej rezydencji królów perskich z dynastii Achemenidów na zamku w Suzie (Elam). Tekst niezwykle precyzyjnie oddaje topografię pałacu w Suzie, ceremoniał dworski, system poczty królewskiej oraz strukturę 127 satrapii od Indii po Etiopię.',
    s5: 'Nawet w pozornie świeckim biegu wydarzeń politycznych na obczyźnie ukryta Opatrzność Boża czuwa nad narodem przymierza. Wezwanie Mardocheusza: «Kto wie, czy nie ze względu na tę właśnie chwilę dostąpiłaś godności królewskiej?» (Est 4,14) ukazuje odpowiedzialność każdego wierzącego w godzinie próby.',
    s6: 'Estera wstawiająca się z narażeniem własnego życia przed obliczem Króla za swoim ludem skazanym na zagładę wskazuje na Chrystusa – jedynego Pośrednika i Orędownika, oraz na wstawiennictwo Matki Bożej Królowej.',
    s7: 'Księga Rodzaju 41 (Józef na dworze faraona); Księga Daniela 1–6 (wierność Bogu na dworze babilońskim i perskim); Łk 1,52 («Strąca władców z tronu, a wywyższa pokornych»).',
  },
  '1MA': {
    name: '1 Księga Machabejska',
    s2Prefix: 'Rozdział należy do Pierwszej Księgi Machabejskiej, stanowiącej bezcenne źródło historyczne i teologiczne do dziejów powstania żydowskiego przeciw przymusowej hellenizacji za Antiocha IV Epifanesa (175–134 p.n.e.).',
    s4: 'Kontekst obejmuje monarchię Seleucydów ze stolicą w Antiochii nad Orontesem, budowę syryjskiej twierdzy Akra w Jerozolimie, zbezczeszczenie ołtarza w 167 r. p.n.e., kampanie Judy Machabeusza, Jonatana i Szymona oraz traktaty dyplomatyczne z Republiką Rzymską i Spartą.',
    s5: 'Wierność przymierzu z Bogiem, świętości Szabatu i Torze wymaga duchowego męstwa wobec presji konformizmu kulturowego. Oczyszczenie i poświęcenie ołtarza Świątyni (święto Chanuka w 1 Mch 4) przypomina o odnowie wewnętrznej świątyni ludzkiego serca.',
    s6: 'Święto Poświęcenia Świątyni (Chanuka) zostaje bezpośrednio przywołane w Ewangelii św. Jana (J 10,22–30), gdy Jezus przechadza się w krużganku Salomona i objawia siebie jako prawdziwą Świątynię konsekrowaną przez Ojca.',
    s7: 'Księga Daniela 7–12 (proroctwa o «ohydzie spustoszenia» za Antiocha IV); 2 Księga Machabejska; J 10,22 (Uroczystość Poświęcenia Świątyni w Jerozolimie); Hbr 11,32–38 (pochwała bohaterów wiary).',
  },
  '2MA': {
    name: '2 Księga Machabejska',
    s2Prefix: 'Rozdział należy do Drugiej Księgi Machabejskiej (streszczenia pięcioksiężnego dzieła Jazona z Cyreny), koncentrującej się na teologii historii, świętości Świątyni Jerozolimskiej, męczeństwie za wiarę oraz nadziei zmartwychwstania.',
    s4: 'Dzieło powstało w języku greckim koine w kręgu diaspory aleksandryjskiej i palestyńskiej pod koniec II w. p.n.e. Ukazuje starcie pomiędzy greckim modelem polis (gimnazjon, efebia) a wiernością Prawu Bożemu w Jerozolimie za arcykapłana Oniasza III i Judy Machabeusza.',
    s5: 'Księga zawiera fundamentalne prawdy objawione: stworzenie świata z niczego («ex nihilo» – 2 Mch 7,28), wiarę w chwalebne zmartwychwstanie ciał męczenników (2 Mch 7), modlitwę i ofiarę przebłagalną za zmarłych (2 Mch 12,43–46) oraz wstawiennictwo świętych w niebie (wizja Oniasza i proroka Jeremiasza w 2 Mch 15).',
    s6: 'Męczeństwo starca Eleazara oraz siedmiu braci i ich matki (2 Mch 6–7) stanowi proroczy pierwowzór krzyżowej Ofiary Chrystusa i męczenników chrześcijańskich, którzy oddają życie w niezłomnej nadziei zmartwychwstania.',
    s7: 'Księga Daniela 12,2 (zmartwychwstanie do życia wiecznego); List do Hebrajczyków 11,35 («Inni zaś poddani byli torturom, nie przyjąwszy uwolnienia, aby otrzymać lepsze zmartwychwstanie»); Rz 4,17 (Bóg powołujący do istnienia to, co nie istnieje).',
  },
};

for (const [key, val] of Object.entries(missingBt5)) {
  const [bookId, chStr] = key.split('-');
  const ch = Number(chStr);
  const ctx = MISSING_BOOK_CONTEXT[bookId];
  const text = val.text.trim();
  const firstSentenceOfText = (text.split(/[.!?]\s+/)[0] || '').slice(0, 120);

  db[key] = {
    title: `${ctx.name} – Rozdział ${ch}: ${firstSentenceOfText}...`,
    text,
    s2: `${ctx.s2Prefix} W rozdziale ${ch} księgi ${ctx.name} czytamy pełny przekaz biblijny rozpoczynający się od słów: „${firstSentenceOfText}...”.`,
    s3: `Rozdział ${ch} (${ctx.name} ${ch}) prowadzi czytelnika przez kolejne wydarzenia historii zbawienia: ${text.slice(0, 480)}...`,
    s4: ctx.s4,
    s5: ctx.s5,
    s6: ctx.s6,
    s7: ctx.s7,
  };
}

const outPath = path.resolve('.data/chapters-1to1-db.json');
fs.writeFileSync(outPath, JSON.stringify(db));
console.log('Successfully generated .data/chapters-1to1-db.json!');
console.log('Total chapters in DB:', Object.keys(db).length);
