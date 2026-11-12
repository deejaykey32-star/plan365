import { ChapterData, ChapterCommentary, CommentaryBlock, LinguisticTerm, VerseItem } from '../types';
import { BOOK_MAP } from './bibleBooks';

export function buildCommentaryBlocks(
  bookName: string,
  chapterNumber: number,
  c: Omit<ChapterCommentary, 'blocks'>
): CommentaryBlock[] {
  const linguisticsText = c.linguistics
    .map(
      (l) =>
        `Termin ${l.language}: ${l.transliteration} (${l.original}) oznacza „${l.meaning}”. ${l.theologicalContext}`
    )
    .join(' ');

  return [
    {
      id: 'exegesis',
      label: 'Egzegeza i Teologia',
      title: `Wprowadzenie egzegetyczne do ${bookName} ${chapterNumber}`,
      content: `${c.summary} ${c.exegesis}`,
    },
    {
      id: 'linguistics',
      label: 'Słownictwo: Hebrajski, Aramejski, Greka, Łacina',
      title: 'Filologia biblijna i pojęcia źródłowe',
      content: linguisticsText,
    },
    {
      id: 'geopolitics',
      label: 'Geopolityka Starożytna',
      title: `Mocarstwa i układ sił: ${c.geopolitics.powers}`,
      content: c.geopolitics.historicalBackground,
    },
    {
      id: 'history',
      label: 'Historia i Archeologia',
      title: `Chronologia (${c.history.chronology}) i świadectwa materialne`,
      content: c.history.eventsAndArcheology,
    },
    {
      id: 'geography',
      label: 'Geografia i Topografia',
      title: `Kluczowe lokalizacje: ${c.geography.locations.join(', ')}`,
      content: c.geography.description,
    },
    {
      id: 'faunaFlora',
      label: 'Fauna i Flora Biblijna',
      title: `Przyroda i ekosystem: ${c.faunaFlora.species.join(', ')}`,
      content: c.faunaFlora.significance,
    },
    {
      id: 'culture',
      label: 'Kultura, Obyczaje i Prawo',
      title: `Instytucje społeczne: ${c.cultureAndCustoms.topics.join(', ')}`,
      content: c.cultureAndCustoms.description,
    },
    {
      id: 'apocrypha',
      label: 'Apokryfy i Tradycja Wczesnochrześcijańska',
      title: 'Kontekst międzytestamentalny i patrystyczny',
      content: c.apocryphaLinks,
    },
  ];
}

const CURATED_CHAPTERS: Record<
  string,
  {
    title: string;
    verses: VerseItem[];
    commentary: Omit<ChapterCommentary, 'blocks'>;
  }
> = {
  'MAT-1': {
    title: 'Rodowód Jezusa Chrystusa, Syna Dawida, i narodziny Emmanuela',
    verses: [
      {
        number: 1,
        text: "Rodowód Jezusa Chrystusa, syna Dawida, syna Abrahama. Abraham był ojcem Izaaka; Izaak ojcem Jakuba; Jakub ojcem Judy i jego braci; Juda zaś był ojcem Faresa i Zary, których matką była Tamar. Fares był ojcem Ezrona; Ezron ojcem Arama; Aram ojcem Aminadaba; Aminadab ojcem Naassona; Naasson ojcem Salmona; Salmon ojcem Booza, a matką była Rachab. Booz był ojcem Obeda, a matką była Rut. Obed był ojcem Jessego, a Jesse ojcem króla Dawida. Dawid był ojcem Salomona, a matką była dawna żona Uriasza. Salomon był ojcem Roboama; Roboam ojcem Abiasza; Abiasz ojcem Asy; Asa ojcem Jozafata; Jozafat ojcem Jorama; Joram ojcem Ozjasza; Ozjasz ojcem Joatama; Joatam ojcem Achaza; Achaz ojcem Ezechiasza; Ezechiasz ojcem Manassesa; Manasses ojcem Amosa; Amos ojcem Jozjasza; Jozjasz ojcem Jechoniasza i jego braci w czasie przesiedlenia babilońskiego. Po przesiedleniu babilońskim Jechoniasz był ojcem Salatiela; Salatiel ojcem Zorobabela; Zorobabel ojcem Abiuda; Abiud ojcem Eliakima; Eliakim ojcem Azora; Azor ojcem Sadoka; Sadok ojcem Achima; Achim ojcem Eliuda; Eliud ojcem Eleazara; Eleazar ojcem Mattana; Mattan ojcem Jakuba; Jakub ojcem Józefa, męża Maryi, z której narodził się Jezus, zwany Chrystusem. Tak więc w całości od Abrahama do Dawida jest czternaście pokoleń; od Dawida do przesiedlenia babilońskiego czternaście pokoleń; od przesiedlenia babilońskiego do Chrystusa czternaście pokoleń. Z narodzeniem Jezusa Chrystusa było tak. Po zaślubinach Matki Jego, Maryi, z Józefem, wpierw nim zamieszkali razem, znalazła się brzemienną za sprawą Ducha Świętego. Mąż Jej, Józef, który był człowiekiem sprawiedliwym i nie chciał narazić Jej na zniesławienie, zamierzał oddalić Ją potajemnie. Gdy powziął tę myśl, oto anioł Pański ukazał mu się we śnie i rzekł: «Józefie, synu Dawida, nie bój się wziąć do siebie Maryi, twej Małżonki; albowiem z Ducha Świętego jest to, co się w Niej poczęło. Porodzi Syna, któremu nadasz imię Jezus, On bowiem zbawi swój lud od jego grzechów». A stało się to wszystko, aby się wypełniło słowo Pańskie powiedziane przez Proroka: Oto Dziewica pocznie i porodzi Syna, któremu nadadzą imię Emmanuel, to znaczy: \"Bóg z nami\". Zbudziwszy się ze snu, Józef uczynił tak, jak mu polecił anioł Pański: wziął swoją Małżonkę do siebie, lecz nie zbliżał się do Niej, aż porodziła Syna, któremu nadał imię Jezus.",
        keyTerm: "Biblos geneseos Iesou Christou (Pokolenia 1–14: od Abrahama do Dawida) · Dauid ton basilea (Pokolenia 15–28: Królowie Judy do wygnania babilońskiego) · Ho legomenos Christos (Pokolenia 29–42: od wygnania do Chrystusa) · Geneai dekatessares (3 x 14 = Gematria imienia Dawid) · Ek Pneumatos Hagiou / Dikaios (Caddik) · Jeszua (JHWH zbawia) · Parthenos / Alma / Immanuel",
      },
    ],
    commentary: {
      summary:
        'Pierwszy rozdział Ewangelii wg św. Mateusza inauguruje nasz plan czytania Biblii 365. Mateusz otwiera Nowy Testament słowami „Biblos geneseos” („Księga Rodzaju / Księga początków”), ogłaszając, że w Jezusie z Nazaretu rozpoczyna się Nowe Stworzenie oraz wypełniają się obietnice dane Abrahamowi (ojcu narodów) i Dawidowi (królowi wiecznego przymierza).',
      exegesis:
        'Genealogia Mateuszowa została skonstruowana w trzech częściach po 14 pokoleń. W gematrii hebrajskiej liczba 14 stanowi wartość liczbową imienia Dawid (דוד: Dalet=4 + Waw=6 + Dalet=4 = 14), co trzykrotnie pieczętuje królewsko-mesjańską godność Jezusa. Niezwykłym rysem tej genealogii jest włączenie czterech kobiet ze Starego Testamentu o obcym, nieżydowskim pochodzeniu lub dramatycznej historii: Tamar (Kananejka), Rachab z Jerycha, Rut (Moabitka) i Batszeba (żona Hetyty Uriasza) – zapowiadających uniwersalizm zbawienia i przygotowujących czytelnika na tajemnicę Dziewicy Maryi (w. 16: tu Mateusz porzuca schemat „zrodził” na rzecz formy biernej teologicznej: „z której został zrodzony Jezus”).',
      linguistics: [
        {
          original: 'Βίβλος γενέσεως Ἰησοῦ Χριστοῦ',
          transliteration: 'Biblos geneseos Iesou Christou',
          language: 'grecki',
          meaning: 'Księga Rodzaju (Genezy / Pochodzenia) Jezusa Chrystusa',
          theologicalContext:
            'Dokładny cytat z greckiej Septuaginty z Rdz 2,4 i Rdz 5,1 (hebr. Sefer Toledot). Ewangelista świadomie otwiera Nowy Testament tytułem pierwszej księgi Tory.',
        },
        {
          original: 'יֵשׁוּעַ / יְהוֹשֻׁעַ',
          transliteration: 'Jeszua / Jehoszua',
          language: 'hebrajski',
          meaning: 'JHWH jest zbawieniem / Pan zbawia',
          theologicalContext:
            'Anioł wyjaśnia Józefowi etymologię hebrajskiego imienia Jeszua (Mt 1,21): „On bowiem zbawi (hebr. joszia) swój lud od jego grzechów” – gra słów bezpośrednio czytelna w języku hebrajskim i aramejskim.',
        },
        {
          original: 'עִמָּנוּ אֵל',
          transliteration: 'Immanu-El',
          language: 'hebrajski',
          meaning: 'Z nami Bóg (Iz 7,14)',
          theologicalContext:
            'Klamra kompozycyjna całej Ewangelii Mateusza: w Mt 1,23 Jezus zostaje nazwany „Bóg z nami” (Emmanuel), a w ostatnim wersecie Ewangelii (Mt 28,20) Zmartwychwstały obiecuje: „Oto Ja jestem z wami przez wszystkie dni aż do skończenia świata”.',
        },
        {
          original: 'גַּבְרָא צַדִּיקָא / בְּתוּלְתָּא',
          transliteration: 'Gawra caddika / Betulta',
          language: 'aramejski',
          meaning: 'Mąż sprawiedliwy / Dziewica (Peszitta Mt 1,19.23)',
          theologicalContext:
            'Nazwanie Józefa „sprawiedliwym” (hebr. caddik, aram. caddika, gr. dikaios) oznacza człowieka wiernego Torze i zarazem pełnego miłosierdzia, który nie chce wydać Maryi na publiczny sąd.',
        },
        {
          original: 'Liber generationis Iesu Christi',
          transliteration: 'Liber generationis Iesu Christi',
          language: 'łaciński',
          meaning: 'Księga rodowodu Jezusa Chrystusa (Wulgata św. Hieronima)',
          theologicalContext:
            'Uroczysty incipit otwierający cały Nowy Testament w rękopisach łacińskich (np. w Kodeksie z Durrow i Księdze z Kells).',
        },
      ],
      geopolitics: {
        powers:
          'Cesarstwo Rzymskie (Pryncypat Oktawiana Augusta) i klientelne Królestwo Judei pod rządami Heroda Wielkiego (ok. 37–4 p.n.e.)',
        historicalBackground:
          'Herod Wielki, z pochodzenia Idumejczyk narzucony Żydom przez senat rzymski w 40 r. p.n.e., nie pochodził z dynastii Dawida i panicznie bał się prawowitego potomka rodu Dawidowego. Dlatego przywołanie przez Mateusza tytułu „Jezus Chrystus, syn Dawida” oraz „Józefie, synu Dawida” ma ogromny ciężar polityczno-mesjański: prawdziwym Królem Izraela nie jest uzurpator Herod na zamku w Jerozolimie, lecz Dziecię powierzone skromnemu cieśli z rodu Dawida.',
      },
      history: {
        chronology:
          'Narodziny Jezusa ok. 6–4 r. p.n.e. (przed śmiercią Heroda Wielkiego wiosną 4 r. p.n.e.); trzy wielkie epoki historii Izraela w genealogii (Abraham ok. 1850 p.n.e., Dawid ok. 1000 p.n.e., Wygnanie Babilońskie 586 p.n.e.)',
        eventsAndArcheology:
          'Wykopaliska w Nazarecie odsłoniły domostwa z I wieku n.e. wykute w wapiennych grotach pod bazyliką Zwiastowania i kościołem św. Józefa. Z kolei odkrycie steli z Tel Dan z IX w. p.n.e. z aramejską inskrypcją „Bejt Dawid” (Dom Dawida) potwierdziło historyczność dynastii Dawidowej.',
      },
      geography: {
        locations: [
          'Nazaret w Dolnej Galilei',
          'Betlejem Judzkie (Miasto Dawida)',
          'Babilon (miejsce wygnania z w. 11–17)',
        ],
        description:
          'Nazaret leżał w cichej kotlinie wzgórz Dolnej Galilei, zaledwie 6 km na południe od Seforis – stolicy administracyjnej regionu, gdzie Józef jako tekton (cieśla i budowniczy) mógł pracować przy kamieniu i drewnie.',
      },
      faunaFlora: {
        species: [
          'Różdżka z pnia Jessego (pęd winorośli i drzewa oliwnego)',
          'Drewno cedrowe, cyprysowe i sykomorowe w warsztacie cieśli',
        ],
        significance:
          'Nazwa miejscowości Nazaret (hebr. Naceret) wiąże się etymologicznie z hebrajskim słowem „necer” (נֵצֶר) oznaczającym „zieloną odrośl, pęd” z proroctwa Izajasza 11,1: „I wyrośnie różdżka z pnia Jessego, a pęd (necer) z jego korzeni wyda owoc”.',
      },
      cultureAndCustoms: {
        topics: [
          'Dwuetapowe zaślubiny żydowskie: Erusin (Kidduszin) i Nissuin',
          'Prawo ojcostwa prawnego poprzez nadanie imienia Synowi (Mt 1,21.25)',
        ],
        description:
          'W prawie żydowskim okresu Drugiej Świątyni małżeństwo zawierano w dwóch etapach: pierwszym były uroczyste zaślubiny „Erusin” (trwające ok. roku, podczas których małżonkowie byli już prawnie mężem i żoną, choć mieszkali jeszcze osobno w domach rodziców), a drugim „Nissuin” – uroczyste wprowadzenie oblubienicy do domu męża (w. 24: „wziął swoją Małżonkę do siebie”). Ponadto w prawie semickim nadanie dziecku imienia przez Józefa (w. 25) stanowiło formalny akt adopcji prawnej włączający Jezusa w królewską linię dziedziczenia po Dawidzie.',
      },
      apocryphaLinks:
        'Wczesnochrześcijańska Protoewangelia Jakuba (ok. 150 r. n.e.) szeroko rozbudowuje narrację o rodzicach Maryi (świętych Joachimie i Annie), zaślubinach z Józefem oraz rozterkach Józefa opisanych z niezwykłą powściągliwością w Mt 1,18–25.',
    },
  },
  'ACT-1': {
    title: 'Wniebowstąpienie Chrystusa i oczekiwanie w Wieczerniku na Ducha Świętego',
    verses: [
      {
        number: 1,
        text: "Pierwszą Księgę napisałem, Teofilu, o wszystkim, co Jezus czynił i czego nauczał od początku aż do dnia, w którym udzielił przez Ducha Świętego poleceń Apostołom, których sobie wybrał, a potem został wzięty do nieba. Im też po swojej męce dał wiele dowodów, że żyje: ukazywał się im przez czterdzieści dni i mówił o królestwie Bożym. A podczas wspólnego posiłku kazał im nie odchodzić z Jerozolimy, ale oczekiwać obietnicy Ojca: «Słyszeliście o niej ode Mnie - mówił - Jan chrzcił wodą, ale wy wkrótce zostaniecie ochrzczeni Duchem Świętym». Zapytywali Go zebrani: «Panie, czy w tym czasie przywrócisz królestwo Izraela?» Odpowiedział im: «Nie wasza to rzecz znać czasy i chwile, które Ojciec ustalił swoją władzą, ale gdy Duch Święty zstąpi na was, otrzymacie Jego moc i będziecie moimi świadkami w Jerozolimie i w całej Judei, i w Samarii, i aż po krańce ziemi». Po tych słowach uniósł się w ich obecności w górę i obłok zabrał Go im sprzed oczu. Kiedy uporczywie wpatrywali się w Niego, jak wstępował do nieba, przystąpili do nich dwaj mężowie w białych szatach. I rzekli: «Mężowie z Galilei, dlaczego stoicie i wpatrujecie się w niebo? Ten Jezus, wzięty od was do nieba, przyjdzie tak samo, jak widzieliście Go wstępującego do nieba». Wtedy wrócili do Jerozolimy z góry, zwanej Oliwną, która leży blisko Jerozolimy, w odległości drogi szabatowej. Przybywszy tam weszli do sali na górze i przebywali w niej: Piotr i Jan, Jakub i Andrzej, Filip i Tomasz, Bartłomiej i Mateusz, Jakub, syn Alfeusza, i Szymon Gorliwy, i Juda, brat Jakuba. Wszyscy oni trwali jednomyślnie na modlitwie razem z niewiastami, Maryją, Matką Jezusa, i braćmi Jego. Wtedy Piotr w obecności braci, a zebrało się razem około stu dwudziestu osób, tak przemówił: «Bracia, musiało wypełnić się słowo Pisma, które Duch Święty zapowiedział przez usta Dawida o Judaszu. On to wskazał drogę tym, którzy pojmali Jezusa, bo on zaliczał się do nas i miał udział w naszym posługiwaniu. Za pieniądze, niegodziwie zdobyte, nabył ziemię i spadłszy głową na dół, pękł na pół i wypłynęły wszystkie jego wnętrzności. Rozniosło się to wśród wszystkich mieszkańców Jerozolimy, tak że nazwano ową rolę w ich języku Hakeldamach, to znaczy: Pole Krwi. Napisano bowiem w Księdze Psalmów: Niech opustoszeje dom jego i niech nikt w nim nie mieszka! A urząd jego niech inny obejmie! Trzeba więc, aby jeden z tych, którzy towarzyszyli nam przez cały czas, kiedy Pan Jezus przebywał z nami, począwszy od chrztu Janowego aż do dnia, w którym został wzięty od nas do nieba, stał się razem z nami świadkiem Jego zmartwychwstania». Postawiono dwóch: Józefa, zwanego Barsabą, z przydomkiem Justus, i Macieja. I tak się pomodlili: «Ty, Panie, znasz serca wszystkich, wskaż z tych dwóch jednego, którego wybrałeś, by zajął miejsce w tym posługiwaniu i w apostolstwie, któremu sprzeniewierzył się Judasz, aby pójść swoją drogą». I dali im losy, a los padł na Macieja. I został dołączony do jedenastu apostołów.",
        keyTerm: "Ton men proton logon / Theophile · En pollois tekmeriois · Dynamis / Martyres mou · Nephele (Obłok Szechina) · Sabbatou echon hodon · Homothymadon · Kleros / Matthias",
      },
    ],
    commentary: {
      summary:
        'Pierwszy rozdział Dziejów Apostolskich otwiera drugi etap naszego planu czytania: od ziemskiej posługi Jezusa przechodzimy do czasu Kościoła prowadzonego przez Ducha Świętego. Rozdział ten łączy Wniebowstąpienie na Górze Oliwnej z dziewięciodniową modlitwą w Wieczerniku (pierwszą nowenną) oraz uzupełnieniem kolegium Dwunastu przez wybór św. Macieja.',
      exegesis:
        'Werset Dz 1,8 („Będziecie Moimi świadkami w Jerozolimie, w całej Judei, w Samarii i aż po krańce ziemi”) stanowi geograficzny i teologiczny spis treści całych Dziejów Apostolskich (rozdz. 1–7: Jerozolima; rozdz. 8–12: Judea i Samaria; rozdz. 13–28: misja aż do Rzymu). Wybór dwunastego Apostoła w miejsce Judasza nie jest kwestią administracyjną, lecz odbudową symbolicznego fundamentu Dwunastu Pokoleń odnowionego Izraela przed zesłaniem Ducha w dniu Pięćdziesiątnicy.',
      linguistics: [
        {
          original: 'Λήμψεσθε δύναμιν... καὶ ἔσεσθέ μου μάρτυρες',
          transliteration: 'Lempsesthe dynamin... kai esesthe mou martyres',
          language: 'grecki',
          meaning: 'Otrzymacie moc (siłę Ducha) i będziecie Moimi świadkami',
          theologicalContext:
            'Od greckiego „martys” (świadek) pochodzi chrześcijańskie słowo „męczennik” – ten, kto potwierdza prawdę o Zmartwychwstaniu całym swoim życiem.',
        },
        {
          original: 'ὁμοθυμαδόν',
          transliteration: 'Homothymadon',
          language: 'grecki',
          meaning: 'Jednomyślnie / Jednym sercem i jednym tchnieniem',
          theologicalContext:
            'Ulubione słowo św. Łukasza (występuje 10 razy w Dziejach Apostolskich) opisujące duchową harmonię wspólnoty zgromadzonej wokół Maryi i Apostołów.',
        },
        {
          original: 'חֲקַל דְּמָא',
          transliteration: 'Chakal Dema (gr. Hakeldamach)',
          language: 'aramejski',
          meaning: 'Pole Krwi (Dz 1,19)',
          theologicalContext:
            'Zachowana w tekście greckim oryginalna aramejska nazwa pola garncarza w Dolinie Hinnoma pod Jerozolimą.',
        },
        {
          original: 'Viri Galilaei, quid statis aspicientes in caelum?',
          transliteration: 'Viri Galilaei, quid statis aspicientes in caelum?',
          language: 'łaciński',
          meaning: 'Mężowie z Galilei, dlaczego stoicie, wpatrując się w niebo? (Wulgata Dz 1,11)',
          theologicalContext:
            'Introit mszalny Uroczystości Wniebowstąpienia Pańskiego od najstarszych sakramentarzy rzymskich.',
        },
      ],
      geopolitics: {
        powers:
          'Rzymska prefektura Judei (Poncjusz Piłat), Sanhedryn Jerozolimski, rodzący się ruch uniwersalny wewnątrz Imperium Rzymskiego',
        historicalBackground:
          'Uczniowie pytają Zmartwychwstałego w Dz 1,6: „Panie, czy w tym czasie przywrócisz królestwo Izraela?” – wciąż myśląc kategoriami politycznego wyzwolenia spod okupacji rzymskiej. Jezus przekierowuje ich wzrok z nacjonalistycznego przewrotu na misję obejmującą całą ekumenę („aż po krańce ziemi”).',
      },
      history: {
        chronology: 'Wiosna 30 lub 33 r. n.e. (40 dni po Paschy Zmartwychwstania)',
        eventsAndArcheology:
          'Na południowo-zachodnim wzgórzu Jerozolimy (Syjon chrześcijański) pod salą Wieczernika krzyżowców archeolodzy zbadali mury synagogi judeochrześcijańskiej z I–II w. n.e. Z kolei w Dolinie Hinnoma zachowały się starożytne grobowce wykute w skale w rejonie tradycyjnego Pola Krwi (Akeldama).',
      },
      geography: {
        locations: [
          'Góra Oliwna (ok. 1 km na wschód od murów Jerozolimy)',
          'Górna Izba (Wieczernik na Syjonie)',
          'Akeldama (Pole Krwi w Dolinie Hinnoma)',
        ],
        description:
          'Odległość z Góry Oliwnej do Jerozolimy określona jest jako „droga szabatowa” (Dz 1,12) – w halasze żydowskiej wynosiła ona 2000 łokci (ok. 900–1100 metrów), czyli dystans dzielący obóz Izraelitów od Arki Przymierza w Joz 3,4.',
      },
      faunaFlora: {
        species: ['Gaje oliwne na stokach Góry Oliwnej (Olea europaea)', 'Obłok świetlisty'],
        significance:
          'Góra Oliwna (Har ha-Zejtim) wzięła nazwę od sadów oliwnych i tłoczni oliwy (Getsemani znaczy po aramejsku „Gat Szemanim” – Tłocznia Oliwy). Z tego samego wzniesienia, u stóp którego Jezus rozpoczął Mękę, wstępuje teraz do chwały Ojca.',
      },
      cultureAndCustoms: {
        topics: [
          'Górna izba (Hyperoon / Alijja) w architekturze jerozolimskiej',
          'Ciągnięcie świętych losów (Kleros / Goral)',
        ],
        description:
          'Zamożniejsze domy w Jerozolimie posiadały przestronną salę na piętrze („hyperoon”), używaną do uczt paschalnych, modlitwy i studiowania Pism. Wybór Macieja poprzez modlitwę i rzucenie losów („kleros” – stąd pochodzi słowo „kler” / duchowieństwo!) nawiązywał do starotestamentalnej tradycji Urim i Tummim.',
      },
      apocryphaLinks:
        'W Zwojach z Qumran (Reguła Zrzeszenia 1QS) wspólnota Jachad była zarządzana przez radę dwunastu mężów i trzech kapłanów, a przyjmowanie nowych członków również odbywało się poprzez zgromadzenie, modlitwę i wyznaczenie „losu” (goral).',
    },
  },
  'GEN-1': {
    title: 'Hymn o stworzeniu świata i człowieka na obraz Boży',
    verses: [
      {
        number: 1,
        text: "Na początku Bóg stworzył niebo i ziemię. Ziemia zaś była bezładem i pustkowiem: ciemność była nad powierzchnią bezmiaru wód, a Duch Boży unosił się nad wodami. Wtedy Bóg rzekł: «Niechaj się stanie światłość!» I stała się światłość. Bóg widząc, że światłość jest dobra, oddzielił ją od ciemności. I nazwał Bóg światłość dniem, a ciemność nazwał nocą. I tak upłynął wieczór i poranek - dzień pierwszy. A potem Bóg rzekł: «Niechaj powstanie sklepienie w środku wód i niechaj ono oddzieli jedne wody od drugich!» Uczyniwszy to sklepienie, Bóg oddzielił wody pod sklepieniem od wód ponad sklepieniem; a gdy tak się stało, Bóg nazwał to sklepienie niebem. I tak upłynął wieczór i poranek - dzień drugi. A potem Bóg rzekł: «Niechaj zbiorą się wody spod nieba w jedno miejsce i niech się ukaże powierzchnia sucha!» A gdy tak się stało, Bóg nazwał tę suchą powierzchnię ziemią, a zbiorowisko wód nazwał morzem. Bóg widząc, że były dobre, rzekł: «Niechaj ziemia wyda rośliny zielone: trawy dające nasiona, drzewa owocowe rodzące na ziemi według swego gatunku owoce, w których są nasiona». I stało się tak. Ziemia wydała rośliny zielone: trawę dającą nasienie według swego gatunku i drzewa rodzące owoce, w których było nasienie według ich gatunków. A Bóg widział, że były dobre. I tak upłynął wieczór i poranek - dzień trzeci. A potem Bóg rzekł: «Niechaj powstaną ciała niebieskie, świecące na sklepieniu nieba, aby oddzielały dzień od nocy, aby wyznaczały pory roku, dni i lata; aby były ciałami jaśniejącymi na sklepieniu nieba i aby świeciły nad ziemią». I stało się tak. Bóg uczynił dwa duże ciała jaśniejące: większe, aby rządziło dniem, i mniejsze, aby rządziło nocą, oraz gwiazdy. I umieścił je Bóg na sklepieniu nieba, aby świeciły nad ziemią; aby rządziły dniem i nocą i oddzielały światłość od ciemności. A widział Bóg, że były dobre. I tak upłynął wieczór i poranek - dzień czwarty. Potem Bóg rzekł: «Niechaj się zaroją wody od roju istot żywych, a ptactwo niechaj lata nad ziemią, pod sklepieniem nieba!» Tak stworzył Bóg wielkie potwory morskie i wszelkiego rodzaju pływające istoty żywe, którymi zaroiły się wody, oraz wszelkie ptactwo skrzydlate różnego rodzaju. Bóg widząc, że były dobre, pobłogosławił je tymi słowami: «Bądźcie płodne i mnóżcie się, abyście zapełniały wody morskie, a ptactwo niechaj się rozmnaża na ziemi». I tak upłynął wieczór i poranek - dzień piąty. Potem Bóg rzekł: «Niechaj ziemia wyda istoty żywe różnego rodzaju: bydło, zwierzęta pełzające i dzikie zwierzęta według ich rodzajów!» I stało się tak. Bóg uczynił różne rodzaje dzikich zwierząt, bydła i wszelkich zwierząt pełzających po ziemi. I widział Bóg, że były dobre. A wreszcie rzekł Bóg: «Uczyńmy człowieka na Nasz obraz, podobnego Nam. Niech panuje nad rybami morskimi, nad ptactwem powietrznym, nad bydłem, nad ziemią i nad wszystkimi zwierzętami pełzającymi po ziemi!» Stworzył więc Bóg człowieka na swój obraz, na obraz Boży go stworzył: stworzył mężczyznę i niewiastę. Po czym Bóg im błogosławił, mówiąc do nich: «Bądźcie płodni i rozmnażajcie się, abyście zaludnili ziemię i uczynili ją sobie poddaną; abyście panowali nad rybami morskimi, nad ptactwem powietrznym i nad wszystkimi zwierzętami pełzającymi po ziemi». I rzekł Bóg: «Oto wam daję wszelką roślinę przynoszącą ziarno po całej ziemi i wszelkie drzewo, którego owoc ma w sobie nasienie: dla was będą one pokarmem. A dla wszelkiego zwierzęcia polnego i dla wszelkiego ptactwa w powietrzu, i dla wszystkiego, co się porusza po ziemi i ma w sobie pierwiastek życia, będzie pokarmem wszelka trawa zielona». I stało się tak. A Bóg widział, że wszystko, co uczynił, było bardzo dobre. I tak upłynął wieczór i poranek - dzień szósty.",
        keyTerm: "Bereshit bara Elohim · Tohu wa-bohu / Ruach Elohim · Yehi Or / Fiat lux · Ki-tow · Jom echad · Rakia · Jabasza / Jamim · Desze / Ec pri · Meorot / Moadim · Nefesz chajja · Be-calmenu ki-demutenu · Zachar u-nekewa · Peru u-rewu · Tow meod",
      },
    ],
    commentary: {
      summary: 'Pierwszy rozdział Księgi Rodzaju (Bereshit) stanowi majestatyczny poemat liturgiczno-kosmologiczny zredagowany w tradycji kapłańskiej (P). Nie jest on świeckim traktatem fizykalnym, lecz teologiczną deklaracją suwerenności Jedynego Boga nad całym kosmosem.',
      exegesis: 'Struktura heksameronu (sześciu dni stworzenia) dzieli się symetrycznie na dwie triady: dni 1–3 to akt separacji i formowania przestrzeni (światło/ciemność, wody górne/dolne, ląd/morze i roślinność), natomiast dni 4–6 to akt napełniania i ustanawiania włodarzy tych sfer (ciała niebieskie, ryby i ptaki, zwierzęta lądowe i człowiek). Słońce i Księżyc nie są tu bóstwami (Szamasz, Sin), lecz zwykłymi „lampami” (meorot) wyznaczającymi kalendarz liturgiczny (moadim). Szczytem stworzenia jest człowiek jako żywa ikona (celem) Boga w świątyni kosmosu.',
      linguistics: [
        {
          original: 'בְּרֵאשִׁית בָּרָא',
          transliteration: 'Bereshit bara',
          language: 'hebrajski',
          meaning: 'Na początku stworzył (z niczego / całkowicie nowatorsko)',
          theologicalContext: 'Czasownik „bara” (בָּרָא) w Biblii Hebrajskiej ma wyłącznie Boga jako podmiot; nigdy nie opisuje ludzkiego rzemiosła, lecz suwerenny akt boski bez oporu materii.',
        },
        {
          original: 'תֹהוּ וָבֹהוּ / רוּחַ אֱלֹהִים',
          transliteration: 'Tohu wa-bohu / Ruach Elohim',
          language: 'hebrajski',
          meaning: 'Bezład i pustkowie / Tchnienie (Duch) Boga',
          theologicalContext: 'Oznacza nieuformowaną pustynię przed kosmicznym porządkiem, nad którą Ruach unosi się niczym orzeł nad gniazdem (por. Pwt 32,11).',
        },
        {
          original: 'מֵימְרָא דַיְיָ',
          transliteration: 'Memra da-Adonai',
          language: 'aramejski',
          meaning: 'Słowo Pana (Targum Neofiti i Onkelosa)',
          theologicalContext: 'W aramejskich Targumach synagogalnych akt stworzenia przez „Bóg rzekł” oddawany jest przez hipostazę „Memra” (Słowo Stwórcze), co stanowi bezpośrednie tło dla Prologu św. Jana (Logos).',
        },
        {
          original: 'Ἐν ἀρχῇ ἐποίησεν ὁ Θεός',
          transliteration: 'En arche epoiesen ho Theos',
          language: 'grecki',
          meaning: 'Na początku uczynił Bóg (Septuaginta LXX)',
          theologicalContext: 'Zwrot „En arche” z greckiego przekładu Siedemdziesięciu w Aleksandrii zostaje dosłownie podjęty w J 1,1 („En arche en ho Logos”).',
        },
        {
          original: 'Fiat lux / Imago Dei',
          transliteration: 'Fiat lux / Imago Dei',
          language: 'łaciński',
          meaning: 'Niech się stanie światłość / Obraz Boży (Wulgata św. Hieronima)',
          theologicalContext: 'Fundament zachodniej antropologii: godność każdej istoty ludzkiej (mężczyzny i kobiety) wynika z bycia „Imago Dei”, a nie ze statusu społecznego.',
        },
      ],
      geopolitics: {
        powers: 'Imperium Nowobabilońskie i wczesna epoka perska Achemenidów (ok. VI w. p.n.e.) na tle starszych kosmogonii Mezopotamii i Egiptu',
        historicalBackground: 'Tekst stanowi świadomą polemikę teologiczną z babilońskim eposem „Enuma Elisz”, recytowanym w Babilonie podczas święta Nowego Roku (Akitu). W micie babilońskim świat powstaje z krwawej walki boga Marduka z potworem chaosu Tiamat, a ludzie są ulepieni z krwi zabitego bóstwa Kingu jako niewolnicy bogów. Rdz 1 demitologizuje mocarstwa Mezopotamii: morze (tehom) nie jest boginią Tiamat, gwiazdy nie rządzą losem człowieka (astrologia chaldejska), a każdy człowiek – nie tylko król czy faraon – nosi królewski „obraz i podobieństwo” Boga.',
      },
      history: {
        chronology: 'Tradycja ustna epoki patriarchów i Mojżesza; ostateczna redakcja kapłańska w VI w. p.n.e.',
        eventsAndArcheology: 'Odkrycie siedmiu tabliczek „Enuma Elisz” w bibliotece Aszurbanipala w Niniwie oraz tekstów z Ugarit i memfickiej teologii Ptaha pozwoliło biblistom dostrzec, jak radykalnie monoteistyczny Izrael przekształcił starożytne motywy kosmologiczne.',
      },
      geography: {
        locations: ['Mezopotamia (Międzyrzecze)', 'Kanaan', 'Wielkie Morze (Śródziemne)', 'Wody podziemne Tehom'],
        description: 'Kosmografia Rdz 1 odzwierciedla starożytny bliskowschodni obraz świata: płaski ląd („jabasza”) otoczony wodami oceanu, nad którym rozciąga się kopuła sklepienia („rakia”) powstrzymująca wody górne.',
      },
      faunaFlora: {
        species: ['Trawy nasienne (Desze)', 'Drzewa owocowe (Ec pri): figowiec, oliwka, granat', 'Potwory morskie (Tanninim)', 'Ptactwo skrzydlate i bydło domowe (Behema)'],
        significance: 'Autor biblijny wprowadza taksonomię funkcjonalną: flora dzieli się na roślinność zieloną, zboża dające ziarno i drzewa owocowe („według swego gatunku” – le-minehu). Wielkie istoty morskie („tanninim” w w. 21), które w Kanaanie czczono jako kosmiczne bóstwa chaosu (Lewiatan), tutaj są jedynie pierwszymi ze stworzeń powołanych przez Boga do istnienia.',
      },
      cultureAndCustoms: {
        topics: ['Rachuba czasu od wieczora do poranku', 'Kalendarz świąteczny (Moadim)', 'Królewski posąg władcy (Celem)', 'Pierwotny wegetarianizm (w. 29)'],
        description: 'Sformulowanie „I upłynął wieczór i poranek” wyznacza żydowską dobę liturgiczną zaczynającą się wraz z zachodem słońca. Pojęcie „obraz Boży” (celem Elohim) nawiązuje do zwyczaju władców Wschodu, którzy na granicach imperium stawiali swoje posągi (salmu) jako znak zwierzchności – w świecie Boga żywym posągiem Stwórcy jest sam człowiek.',
      },
      apocryphaLinks: 'W apokryficznej Księdze Jubileuszy (rozdz. 2) anioł Oblicza dyktuje Mojżeszowi szczegółowy wykaz 22 dzieł stworzenia podzielonych na 6 dni, podkreślając, że Szabat jest obchodzony przez aniołów w niebie. Z kolei w 1 Księdze Henocha (72–82, Księga Astronomiczna) rozwinięty zostaje wątek ciał niebieskich wyznaczających święte pory roku (moadim).',
    },
  },
  'GEN-2': {
    title: 'Ogród w Edenie, tchnienie życia i przymierze małżeńskie',
    verses: [
      {
        number: 1,
        text: "W ten sposób zostały ukończone niebo i ziemia oraz wszystkie jej zastępy stworzeń. A gdy Bóg ukończył w dniu szóstym swe dzieło, nad którym pracował, odpoczął dnia siódmego po całym swym trudzie, jaki podjął. Wtedy Bóg pobłogosławił ów siódmy dzień i uczynił go świętym; w tym bowiem dniu odpoczął po całej swej pracy, którą wykonał stwarzając. Oto są dzieje początków po stworzeniu nieba i ziemi. Gdy Pan Bóg uczynił ziemię i niebo, nie było jeszcze żadnego krzewu polnego na ziemi, ani żadna trawa polna jeszcze nie wzeszła - bo Pan Bóg nie zsyłał deszczu na ziemię i nie było człowieka, który by uprawiał ziemię i rów kopał w ziemi, aby w ten sposób nawadniać całą powierzchnię gleby - wtedy to Pan Bóg ulepił człowieka z prochu ziemi i tchnął w jego nozdrza tchnienie życia, wskutek czego stał się człowiek istotą żywą. A zasadziwszy ogród w Eden na wschodzie, Pan Bóg umieścił tam człowieka, którego ulepił. Na rozkaz Pana Boga wyrosły z gleby wszelkie drzewa miłe z wyglądu i smaczny owoc rodzące oraz drzewo życia w środku tego ogrodu i drzewo poznania dobra i zła. Z Edenu zaś wypływała rzeka, aby nawadniać ów ogród, i stamtąd się rozdzielała, dając początek czterem rzekom. Nazwa pierwszej - Piszon; jest to ta, która okrąża cały kraj Chawila, gdzie się znajduje złoto. A złoto owej krainy jest znakomite; tam jest także wonna żywica i kamień czerwony. Nazwa drugiej rzeki - Gichon; okrąża ona cały kraj - Kusz. Nazwa rzeki trzeciej - Chiddekel; płynie ona na wschód od Aszszuru. Rzeka czwarta - to Perat. Pan Bóg wziął zatem człowieka i umieścił go w ogrodzie Eden, aby uprawiał go i doglądał. A przy tym Pan Bóg dał człowiekowi taki rozkaz: «Z wszelkiego drzewa tego ogrodu możesz spożywać według upodobania; ale z drzewa poznania dobra i zła nie wolno ci jeść, bo gdy z niego spożyjesz, niechybnie umrzesz». Potem Pan Bóg rzekł: «Nie jest dobrze, żeby mężczyzna był sam, uczynię mu zatem odpowiednią dla niego pomoc». Ulepiwszy z gleby wszelkie zwierzęta lądowe i wszelkie ptaki powietrzne, Pan Bóg przyprowadził je do mężczyzny, aby przekonać się, jaką on da im nazwę. Każde jednak zwierzę, które określił mężczyzna, otrzymało nazwę \"istota żywa\". I tak mężczyzna dał nazwy wszelkiemu bydłu, ptakom powietrznym i wszelkiemu zwierzęciu polnemu, ale nie znalazła się pomoc odpowiednia dla mężczyzny. Wtedy to Pan sprawił, że mężczyzna pogrążył się w głębokim śnie, i gdy spał wyjął jedno z jego żeber, a miejsce to zapełnił ciałem. Po czym Pan Bóg z żebra, które wyjął z mężczyzny, zbudował niewiastę. A gdy ją przyprowadził do mężczyzny, mężczyzna powiedział: «Ta dopiero jest kością z moich kości i ciałem z mego ciała! Ta będzie się zwała niewiastą, bo ta z mężczyzny została wzięta». Dlatego to mężczyzna opuszcza ojca swego i matkę swoją i łączy się ze swą żoną tak ściśle, że stają się jednym ciałem. Chociaż mężczyzna i jego żona byli nadzy, nie odczuwali wobec siebie wstydu.",
        keyTerm: "Cewaam · Wajiszbot · Wajekaddesz oto · Adam min ha-adama / Niszmat chajjim · Gan-be-Eden · Ec ha-chajjim · Le-owdah u-le-szomrah · Ezer ke-negdo · Isza / Isz · Basar echad",
      },
    ],
    commentary: {
      summary: 'Drugi rozdział Księgi Rodzaju rozpoczyna się konsekracją Szabatu (w. 1–3), po czym przechodzi do starszej, niezwykle plastycznej tradycji jahwistycznej (J), ukazującej Boga jako Garncarza (Jocer) i Ogrodnika sadzącego rajskie sanktuarium w Edenie.',
      exegesis: 'Podczas gdy w Rdz 1 Bóg nosi uniwersalne imię Elohim, w Rdz 2,4 pojawia się święty Tetragram JHWH Elohim (Pan Bóg) – Bóg bliski, wchodzący w intymną relację przymierza z człowiekiem. Zadanie człowieka w Edenie określane jest dwoma czasownikami: „awad” (uprawiać/służyć) i „szamar” (strzec) – dokładnie tymi samymi słowami, które w Księdze Liczb opisują posługę kapłanów i lewitów w Świątyni Jerozolimskiej!',
      linguistics: [
        {
          original: 'אָדָם מִן־הָאֲדָמָה',
          transliteration: 'Adam min ha-adama',
          language: 'hebrajski',
          meaning: 'Człowiek z czerwonej, uprawnej gleby',
          theologicalContext: 'Gra słów ukazująca pokorę kondycji ludzkiej (w łacinie analogicznie: homo od humus). Dopiero Boże tchnienie (niszmat chajjim) czyni z prochu istotę duchowo-cielesną.',
        },
        {
          original: 'עֵזֶר כְּנֶגְדּוֹ',
          transliteration: 'Ezer ke-negdo',
          language: 'hebrajski',
          meaning: 'Pomoc / Ocalenie stojące naprzeciw (równorzędny partner)',
          theologicalContext: 'Słowo „ezer” nie oznacza pomocnika niższego rzędu! W Psalmach najczęściej określa samego Boga jako „Pomoc i Wybawcę” w bitwie (np. Ps 121,2).',
        },
        {
          original: 'גִּינְתָא דְעֵדֶן',
          transliteration: 'Ginta de-Eden',
          language: 'aramejski',
          meaning: 'Ogród rozkoszy (Targum)',
          theologicalContext: 'W tradycji aramejskiej i syryjskiej Gan Eden staje się synonimem eschatologicznego Raju.',
        },
        {
          original: 'Παράδεισος',
          transliteration: 'Paradeisos',
          language: 'grecki',
          meaning: 'Królewski ogród ogrodzony murem (z staroperskiego pairi-daeza)',
          theologicalContext: 'Tłumacze Septuaginty użyli perskiego określenia na królewskie parki władców Achemenidów, skąd wywodzi się europejskie słowo „Raj” (Paradisus w Wulgacie).',
        },
      ],
      geopolitics: {
        powers: 'Złoty Półksiężyc: Sumer, Akad, Asyria, Kusz (Nubia)',
        historicalBackground: 'Cztery rzeki Edenu wyznaczają horyzont geopolityczny całego starożytnego świata widzianego z perspektywy Syropalestyny: Tygrys (Chiddekel) i Eufrat (Perat) reprezentują mocarstwa Mezopotamii, a Piszon i Gichon symbolizują bogactwa Południa i Wschodu.',
      },
      history: {
        chronology: 'X–IX w. p.n.e. (redakcja wczesnomonarchiczna)',
        eventsAndArcheology: 'W sumeryjskim micie o Enki i Ninhursag występuje kraina Dilmun, gdzie bogini Nin-ti („Pani Żebra” i jednocześnie „Pani Życia”) uzdrawia bok boga Enki.',
      },
      geography: {
        locations: ['Eden', 'Kraina Chawila', 'Kraina Kusz', 'Rzeki: Piszon, Gichon, Tygrys, Eufrat'],
        description: 'Geografia Edenu łączy realną topografię dorzecza Tygrysu i Eufratu z teologiczną symboliką źródła wypływającego z Góry Bożej na cztery strony świata.',
      },
      faunaFlora: {
        species: ['Drzewo Życia (Ec ha-chajjim)', 'Drzewo poznania dobra i zła', 'Żywica bdellium (Bedolach)', 'Zwierzęta polne i ptactwo'],
        significance: 'Akt nadawania imion zwierzętom przez człowieka (w. 19–20) w kulturze semickiej wyraża poznanie istoty danej rzeczy oraz sprawowanie nad nią rozumnej opieki.',
      },
      cultureAndCustoms: {
        topics: ['Formuła pokrewieństwa „Kość z moich kości i ciało z mego ciała”', 'Monogamiczne przymierze małżeńskie', 'Praca jako powołanie jeszcze przed upadkiem'],
        description: 'Zwrot „kość z moich kości i ciało z mego ciała” to w prawie starożytnego Wschodu uroczysta przysięga przymierza oznaczająca nierozerwalną solidarność.',
      },
      apocryphaLinks: 'W Księdze Jubileuszy (3,27) kiedy Adam opuszcza ogród Eden, składa Bogu ofiarę kadzielną, ponieważ ogród Eden jest postrzegany jako Miejsce Najświętsze na ziemi.',
    },
  },
  'EXO-12': {
    title: 'Ustanowienie Paschy i wyjście Izraelitów z Egiptu',
    verses: [
      {
        number: 1,
        text: "Pan powiedział do Mojżesza i Aarona w ziemi egipskiej: «Miesiąc ten będzie dla was początkiem miesięcy, będzie pierwszym miesiącem roku! Powiedzcie całemu zgromadzeniu Izraela tak: Dziesiątego dnia tego miesiąca niech się każdy postara o baranka dla rodziny, o baranka dla domu. Jeśliby zaś rodzina była za mała do spożycia baranka, to niech się postara o niego razem ze swym sąsiadem, który mieszka najbliżej jego domu, aby była odpowiednia liczba osób. Liczyć je zaś będziecie dla spożycia baranka według tego, co każdy może spożyć. Baranek będzie bez skazy, samiec, jednoroczny; wziąć możecie jagnię albo koźlę. Będziecie go strzec aż do czternastego dnia tego miesiąca, a wtedy zabije go całe zgromadzenie Izraela o zmierzchu. I wezmą krew baranka, i pokropią nią odrzwia i progi domu, w którym będą go spożywać. I tej samej nocy spożyją mięso pieczone w ogniu, spożyją je z chlebem niekwaszonym i gorzkimi ziołami. Nie będziecie spożywać z niego nic surowego ani ugotowanego w wodzie, lecz upieczone na ogniu, z głową, nogami i wnętrznościami. Nie może nic pozostać z niego na dzień następny. Cokolwiek zostanie z niego na następny dzień, w ogniu spalicie. Tak zaś spożywać go będziecie: Biodra wasze będą przepasane, sandały na waszych nogach i laska w waszym ręku. Spożywać będziecie pośpiesznie, gdyż jest to Pascha na cześć Pana. Tej nocy przejdę przez Egipt, zabiję wszystko pierworodne w ziemi egipskiej od człowieka aż do bydła i odbędę sąd nad wszystkimi bogami Egiptu - Ja, Pan. Krew będzie wam służyła do oznaczenia domów, w których będziecie przebywać. Gdy ujrzę krew, przejdę obok i nie będzie pośród was plagi niszczycielskiej, gdy będę karał ziemię egipską. Dzień ten będzie dla was dniem pamiętnym i obchodzić go będziecie jako święto dla uczczenia Pana. Po wszystkie pokolenia - na zawsze w tym dniu świętować będziecie. Przez siedem dni spożywać będziecie chleb niekwaszony. Już w pierwszym dniu usuniecie wszelki kwas z domów waszych, bo kto by jadł kwaszone potrawy od dnia pierwszego do siódmego, wyłączony będzie z Izraela. W pierwszym dniu będziecie mieli zwołanie święte, tak samo w dniu siódmym. Nie będziecie wtedy wykonywać żadnej pracy. Będzie wam tylko wolno przygotować pożywienie. Przestrzegać będziecie Święta Przaśników, gdyż w tym dniu wyprowadziłem wasze zastępy z ziemi egipskiej. Przestrzegajcie tego dnia jako ustanowionego na zawsze we wszystkich waszych pokoleniach. Czternastego dnia miesiąca pierwszego od wieczora winniście spożywać chleb niekwaszony aż do wieczora dwudziestego pierwszego dnia tego miesiąca. Przez siedem dni nie znajdzie się w domach waszych żaden kwas, bo kto by spożył coś kwaszonego, winien być wyłączony ze zgromadzenia Izraela, tak przybysz, jak i urodzony w kraju. Nie wolno wam jeść nic kwaszonego; we wszystkich domach waszych winniście jeść chleb niekwaszony». Mojżesz zwołał wszystkich starszych Izraela i rzekł do nich: «Odłączcie i weźcie baranka dla waszych rodzin i zabijcie jako paschę. Weźcie gałązkę hizopu i zanurzcie ją we krwi, która jest w naczyniu, i krwią z naczynia skropcie próg i oba odrzwia. Aż do rana nie powinien nikt z was wychodzić przed drzwi swego domu. A gdy Pan będzie przechodził, aby porazić Egipcjan, a zobaczy krew na progu i na odrzwiach, to ominie Pan takie drzwi i nie pozwoli Niszczycielowi wejść do tych domów, aby was zabijał. Przestrzegajcie tego przykazania jako prawa na wieki ważnego dla ciebie i dla twych dzieci! Gdy zaś wejdziecie do ziemi, którą da wam Pan, jak obiecał, przestrzegajcie tego obyczaju. Gdy się was zapytają dzieci: cóż to za święty zwyczaj? - tak im odpowiecie: \"To jest ofiara Paschy na cześć Pana, który w Egipcie ominął domy Izraelitów. Poraził Egipcjan, a domy nasze ocalił\"». Lud wtedy ukląkł i oddał pokłon. Izraelici poszli i wypełnili przepis. Jak nakazał Pan Mojżeszowi i Aaronowi, tak uczynili. O północy Pan pozabijał wszystko pierworodne Egiptu: od pierworodnego syna faraona, który siedzi na swym tronie, aż do pierworodnego tego, który był zamknięty w więzieniu, a także wszelkie pierworodne z bydła. I wstał faraon jeszcze w nocy, a z nim wszyscy jego dworzanie i wszyscy Egipcjanie. I podniósł się wielki krzyk w Egipcie, gdyż nie było domu, w którym nie byłoby umarłego. I jeszcze w nocy kazał faraon wezwać Mojżesza i Aarona, i powiedział: «Wstańcie, wyruszajcie z pośrodka mojego ludu, tak wy, jak Izraelici! Idźcie i oddajcie cześć Panu według waszego pragnienia. Weźcie ze sobą owce wasze i woły, jak pragnęliście, i idźcie. Proście także o łaskę dla mnie». I nalegali Egipcjanie na lud, aby jak najprędzej wyszli z kraju, gdyż mówili: «Wszyscy pomrzemy». I wziął lud ciasto, zanim się zakwasiło w dzieżach owiniętych płaszczami, i niósł je na barkach. Synowie Izraela uczynili według tego, jak im nakazał Mojżesz, i wypożyczali od Egipcjan przedmioty srebrne i złote oraz szaty. Pan wzbudził życzliwość Egipcjan dla Izraelitów, i pożyczyli im. I w ten sposób Izraelici złupili Egipcjan. I wyruszyli Izraelici z Ramses ku Sukkot w liczbie około sześciuset tysięcy mężów pieszych, prócz dzieci. Także wielkie mnóstwo cudzoziemców wyruszyło z nimi, nadto owce i woły, i olbrzymi dobytek. Z ciasta, które wynieśli z Egiptu, wypiekli niekwaszone placki, ponieważ się nie zakwasiło. Wypędzeni z Egiptu bez najmniejszej zwłoki, nie zdołali przygotować nawet zapasów na drogę. A czas pobytu Izraelitów w Egipcie trwał czterysta trzydzieści lat. I oto tego samego dnia, po upływie czterystu trzydziestu lat, wyszły wszystkie zastępy Pana z ziemi egipskiej. Tej nocy czuwał Pan nad wyjściem synów Izraela z ziemi egipskiej. Dlatego noc ta winna być czuwaniem na cześć Pana dla wszystkich Izraelitów po wszystkie pokolenia. Pan powiedział do Mojżesza i Aarona: «Takie będzie prawo dotyczące Paschy: Żaden cudzoziemiec nie może jej spożywać. Jednak niewolnik, nabyty za pieniądze, któregoś poddał obrzezaniu, może ją spożywać. Obcokrajowiec i najemnik nie mogą jej spożywać. W jednym i tym samym domu winna być spożyta. Nie można wynieść z tego domu żadnego kawałka mięsa na zewnątrz. Kości z niego łamać nie będziecie. Całe zgromadzenie Izraela będzie to zachowywało. Jeśliby cudzoziemiec przebywający u ciebie chciał obchodzić Paschę ku czci Pana, to musisz obrzezać wpierw wszystkich potomków jego domu, i wtedy dopiero dopuścić go możesz do obchodzenia Paschy, gdyż wówczas będzie miał prawa tubylców. Żaden jednak nieobrzezany nie może spożywać Paschy. Takie samo prawo będzie dla tubylców i dla cudzoziemców przebywających pośród was». Wszyscy Izraelici uczynili tak, jak nakazał Pan Mojżeszowi i Aaronowi. Tego samego dnia wywiódł Pan synów Izraela z ziemi egipskiej według ich zastępów.",
        keyTerm: "Rosz chodaszim (Abib/Nisan) · Seh le-wejt-awot · Tamim zachar ben-szana · Dam / Mezuza · Pesach la-JHWH · Pasachti alejchem · Zikkaron / Chukka olam",
      },
    ],
    commentary: {
      summary: 'Dwunasty rozdział Księgi Wyjścia to serce Starego Testamentu: ustanowienie liturgii Paschy (Pesach), Święta Przaśników (Macot) oraz noc wyzwolenia ludu z domu niewoli faraona.',
      exegesis: 'Krew baranka bez skazy na odrzwiach domów chroni pierworodnych przed Niszczycielem (Maszchit), a pośpieszna uczta w stroju podróżnym staje się sakramentalnym wzorem Eucharystii i ofiary Chrystusa – „naszej Paschy, która została ofiarowana” (1 Kor 5,7).',
      linguistics: [
        {
          original: 'פֶּסַח / פָּסַחְתִּי',
          transliteration: 'Pesach / Pasachti',
          language: 'hebrajski',
          meaning: 'Przejście obok / Ominięcie, Osłonięcie w locie',
          theologicalContext: 'Czasownik „pasach” oznacza zarówno „przeskoczyć, ominąć”, jak i „osłonić skrzydłami” (por. Iz 31,5).',
        },
        {
          original: 'פִּסְחָא',
          transliteration: 'Pischa',
          language: 'aramejski',
          meaning: 'Pascha (forma aramejska)',
          theologicalContext: 'Z aramejskiego „Pischa” pochodzi greckie „Pascha” (Πάσχα) i łacińskie/polskie „Pascha”.',
        },
        {
          original: 'Ἀμνὸς ἄμωμος',
          transliteration: 'Amnos amomos',
          language: 'grecki',
          meaning: 'Baranek nieskalany (bez zmazy)',
          theologicalContext: 'Termin użyty przez św. Piotra (1 P 1,19).',
        },
        {
          original: 'Transitus Domini / Agnus Dei',
          transliteration: 'Transitus Domini',
          language: 'łaciński',
          meaning: 'Przejście Pana',
          theologicalContext: 'Św. Hieronim i św. Augustyn tłumaczą Paschę jako „Transitus” – przejście ze śmierci do życia.',
        },
      ],
      geopolitics: {
        powers: 'Imperium Egipskie Nowego Państwa (XIX Dynastia – czasy Ramzesa II / Merenptaha), Delta Nilu (Ziemia Goszen)',
        historicalBackground: 'Dziesięć plag egipskich to bezpośredni sąd nad panteonem bóstw Egiptu (Wj 12,12: „nad wszystkimi bogami Egiptu dokonam sądu”).',
      },
      history: {
        chronology: 'ok. XIII w. p.n.e.',
        eventsAndArcheology: 'Wyjście z miasta Ramzes (Pi-Ramzes we wschodniej Delcie Nilu) do Sukkot. Stela Merenptaha (ok. 1208 p.n.e.) zawiera najstarszą pozabiblijną wzmiankę o Izraelu.',
      },
      geography: {
        locations: ['Ziemia Goszen', 'Pi-Ramzes (Awaris)', 'Sukkot'],
        description: 'Trasa Exodusu rozpoczyna się we wschodniej Delcie Nilu i kieruje się w stronę jezior Gorzkich i półwyspu Synaj.',
      },
      faunaFlora: {
        species: ['Jednoroczny baranek lub koźlę (Seh)', 'Wiązka hizopu (Ezow - Origanum syriacum)', 'Gorzkie zioła (Merorim)'],
        significance: 'Hizop syryjski ma włochate liście doskonale utrzymujące płyn, dlatego służył jako kropidło do nakładania krwi na odrzwia.',
      },
      cultureAndCustoms: {
        topics: ['Zikkaron (Pamiątka uobecniająca)', 'Zakaz łamania kości baranka (Wj 12,46)'],
        description: 'W rozumieniu hebrajskim „Zikkaron” to liturgiczne uobecnienie: każde pokolenie podczas Sederu paschalnego ma postrzegać siebie tak, jakby osobiście wychodziło z Egiptu.',
      },
      apocryphaLinks: 'Księga Jubileuszy (rozdz. 49) poświęca obszerny traktat przepisom Paschy, wyjaśniając, że siły Mastemy zostały związane przed domami oznaczonymi krwią.',
    },
  },
  'PSA-23': {
    title: 'Pan jest moim Pasterzem – Psalm ufności Dawidowej',
    verses: [
      {
        number: 1,
        text: "Psalm. Dawidowy. Pan jest moim pasterzem, nie brak mi niczego. Pozwala mi leżeć na zielonych pastwiskach. Prowadzi mnie nad wody, gdzie mogę odpocząć: orzeźwia moją duszę. Wiedzie mnie po właściwych ścieżkach przez wzgląd na swoje imię. Chociażbym chodził ciemną doliną, zła się nie ulęknę, bo Ty jesteś ze mną. Twój kij i Twoja laska są tym, co mnie pociesza. Stół dla mnie zastawiasz wobec mych przeciwników; namaszczasz mi głowę olejkiem; mój kielich jest przeobfity. Tak, dobroć i łaska pójdą w ślad za mną przez wszystkie dni mego życia i zamieszkam w domu Pańskim po najdłuższe czasy. PROLOG",
        keyTerm: "JHWH Roi · Neot desze / Mej menuchot · Nafszi jeszowew · Gej calmawet / Sziwtecha u-miszantecha · Szulchan / Kos rewajja · Tow wa-chesed",
      },
    ],
    commentary: {
      summary: 'Psalm 23 łączy dwa wielkie obrazy kultury starożytnego Wschodu: troskliwego Pasterza prowadzącego owce przez spiekotę Pustyni Judzkiej (w. 1–4) oraz Królewskiego Gospodarza przyjmującego wędrowca pod ochronę swojego namiotu i świątyni (w. 5–6).',
      exegesis: 'W chwili wejścia w „ciemną dolinę” (gej calmawet – dolinę cienia śmierci) psalmista przechodzi z mówienia o Bogu w 3. osobie na intymne „Ty”: „bo Ty jesteś ze mną!”.',
      linguistics: [
        {
          original: 'יְהוָה רֹעִי',
          transliteration: 'JHWH Roi',
          language: 'hebrajski',
          meaning: 'Pan Pasterzem moim',
          theologicalContext: 'Tytuł „Roe” (Pasterz) na starożytnym Wschodzie przysługiwał królom. Dawid wyznaje, że jego prawdziwym Królem-Pasterzem jest sam Jahwe.',
        },
        {
          original: 'גֵּיא צַלְמָוֶת',
          transliteration: 'Gej calmawet',
          language: 'hebrajski',
          meaning: 'Dolina głębokiej ciemności / Dolina cienia śmierci',
          theologicalContext: 'Opisuje wąskie, głębokie kaniony (wadi) Pustyni Judzkiej.',
        },
        {
          original: 'Κύριος ποιμαίνει με',
          transliteration: 'Kyrios poimainei me',
          language: 'grecki',
          meaning: 'Pan mnie pasie (Septuaginta Ps 22 LXX)',
          theologicalContext: 'Bezpośrednie tło dla słów Jezusa w J 10,11: „Ja jestem Dobrym Pasterzem”.',
        },
        {
          original: 'Dominus regit me',
          transliteration: 'Dominus regit me',
          language: 'łaciński',
          meaning: 'Pan rządzi mną (prowadzi mnie)',
          theologicalContext: 'W liturgii chrzcielnej Kościoła starożytnego Psalm 23 był śpiewany przez neofitów idących od chrzcielnicy do ołtarza Eucharystii.',
        },
      ],
      geopolitics: {
        powers: 'Zjednoczone Królestwo Izraela i Judy (X w. p.n.e.)',
        historicalBackground: 'W Mezopotamii i w Egipcie władca prezentował się jako pasterz ludu. Biblia przenosi ten tytuł na Boga, rozliczając ziemskich władców z troski o słabych (Ez 34).',
      },
      history: {
        chronology: 'Okres monarchii Dawidowej',
        eventsAndArcheology: 'Gdy Dawid uciekał w czasie buntu Absaloma do Machanaim, wierni przyjaciele zastawili przed nim i jego spragnionym ludem obfity stół na pustyni (2 Sm 17,27–29).',
      },
      geography: {
        locations: ['Pustynia Judzka', 'Wąwozy Wadi Qelt', 'Wzgórza wokół Betlejem'],
        description: 'Pomiędzy żyznymi polami Betlejem a Morzem Martwym rozciąga się surowa Pustynia Judzka pocięta głębokimi kanionami (wadi).',
      },
      faunaFlora: {
        species: ['Owca syryjska (Ovis aries)', 'Oliwka europejska (oliwa do namaszczenia)'],
        significance: 'Oliwa z oliwek zmieszana z wonnościami chłodziła głowę strudzonego gościa i leczyła rany owiec.',
      },
      cultureAndCustoms: {
        topics: ['Kij (Szewet) i laska pasterska (Miszenet)', 'Beduńskie prawo azylu w namiocie'],
        description: 'Zastawienie stołu „wobec przeciwników” to nienaruszalne prawo pustynnego azylu: dopóki gość jadł pod namiotem gospodarza, wrogowie nie mieli prawa go tknąć.',
      },
      apocryphaLinks: 'W Pasterzu Hermasa oraz w Odach Salomona obraz Pasterza i kielicha przeobfitego zostaje rozwinięty jako mistyczny symbol Chrystusa.',
    },
  },
  'MAT-5': {
    title: 'Kazanie na Górze: Osiem Błogosławieństw i wypełnienie Prawa',
    verses: [
      {
        number: 1,
        text: "Jezus, widząc tłumy, wyszedł na górę. A gdy usiadł, przystąpili do Niego Jego uczniowie. Wtedy otworzył swoje usta i nauczał ich tymi słowami: «Błogosławieni ubodzy w duchu, albowiem do nich należy królestwo niebieskie. Błogosławieni, którzy się smucą, albowiem oni będą pocieszeni. Błogosławieni cisi, albowiem oni na własność posiądą ziemię. Błogosławieni, którzy łakną i pragną sprawiedliwości, albowiem oni będą nasyceni. Błogosławieni miłosierni, albowiem oni miłosierdzia dostąpią. Błogosławieni czystego serca, albowiem oni Boga oglądać będą. Błogosławieni, którzy wprowadzają pokój, albowiem oni będą nazwani synami Bożymi. Błogosławieni, którzy cierpią prześladowanie dla sprawiedliwości, albowiem do nich należy królestwo niebieskie. Błogosławieni jesteście, gdy ludzie wam urągają i prześladują was, i gdy z mego powodu mówią kłamliwie wszystko złe na was. Cieszcie się i radujcie, albowiem wasza nagroda wielka jest w niebie. Tak bowiem prześladowali proroków, którzy byli przed wami. Wy jesteście solą dla ziemi. Lecz jeśli sól utraci swój smak, czymże ją posolić? Na nic się już nie przyda, chyba na wyrzucenie i podeptanie przez ludzi. Wy jesteście światłem świata. Nie może się ukryć miasto położone na górze. Nie zapala się też światła i nie stawia pod korcem, ale na świeczniku, aby świeciło wszystkim, którzy są w domu. Tak niech świeci wasze światło przed ludźmi, aby widzieli wasze dobre uczynki i chwalili Ojca waszego, który jest w niebie. Nie sądźcie, że przyszedłem znieść Prawo albo Proroków. Nie przyszedłem znieść, ale wypełnić. Zaprawdę. bowiem powiadam wam: Dopóki niebo i ziemia nie przeminą, ani jedna jota, ani jedna kreska nie zmieni się w Prawie, aż się wszystko spełni. Ktokolwiek więc zniósłby jedno z tych przykazań, choćby najmniejszych, i uczyłby tak ludzi, ten będzie najmniejszy w królestwie niebieskim. A kto je wypełnia i uczy wypełniać, ten będzie wielki w królestwie niebieskim. Bo powiadam wam: Jeśli wasza sprawiedliwość nie będzie większa niż uczonych w Piśmie i faryzeuszów, nie wejdziecie do królestwa niebieskiego. Słyszeliście, że powiedziano przodkom: Nie zabijaj!; a kto by się dopuścił zabójstwa, podlega sądowi. A Ja wam powiadam: Każdy, kto się gniewa na swego brata, podlega sądowi. A kto by rzekł swemu bratu: Raka, podlega Wysokiej Radzie. A kto by mu rzekł: \"Bezbożniku\", podlega karze piekła ognistego. Jeśli więc przyniesiesz dar swój przed ołtarz i tam wspomnisz, że brat twój ma coś przeciw tobie, zostaw tam dar swój przez ołtarzem, a najpierw idź i pojednaj się z bratem swoim! Potem przyjdź i dar swój ofiaruj! Pogódź się ze swoim przeciwnikiem szybko, dopóki jesteś z nim w drodze, by cię przeciwnik nie podał sędziemu, a sędzia dozorcy, i aby nie wtrącono cię do więzienia. Zaprawdę, powiadam ci: nie wyjdziesz stamtąd, aż zwrócisz ostatni grosz. Słyszeliście, że powiedziano: Nie cudzołóż! A Ja wam powiadam: Każdy, kto pożądliwie patrzy na kobietę, już się w swoim sercu dopuścił z nią cudzołóstwa. Jeśli więc prawe twoje oko jest ci powodem do grzechu, wyłup je i odrzuć od siebie. Lepiej bowiem jest dla ciebie, gdy zginie jeden z twoich członków, niż żeby całe twoje ciało miało być wrzucone do piekła. I jeśli prawa twoja ręka jest ci powodem do grzechu, odetnij ją i odrzuć od siebie. Lepiej bowiem jest dla ciebie, gdy zginie jeden z twoich członków, niż żeby całe twoje ciało miało iść do piekła. Powiedziano też: Jeśli kto chce oddalić swoją żonę, niech jej da list rozwodowy. A ja wam powiadam: Każdy, kto oddala swoją żonę - poza wypadkiem nierządu - naraża ją na cudzołóstwo; a kto by oddaloną wziął za żonę, dopuszcza się cudzołóstwa. Słyszeliście również, że powiedziano przodkom: Nie będziesz fałszywie przysięgał, lecz dotrzymasz Panu swej przysięgi. A Ja wam powiadam: Wcale nie przysięgajcie, ani na niebo, bo jest tronem Bożym; ani na ziemię, bo jest podnóżkiem stóp Jego; ani na Jerozolimę, bo jest miastem wielkiego Króla. Ani na swoją głowę nie przysięgaj, bo nie możesz nawet jednego włosa uczynić białym albo czarnym. Niech wasza mowa będzie: Tak, tak; nie, nie. A co nadto jest, od Złego pochodzi. Słyszeliście, że powiedziano: Oko za oko i ząb za ząb! A Ja wam powiadam: Nie stawiajcie oporu złemu. Lecz jeśli cię kto uderzy w prawy policzek, nadstaw mu i drugi! Temu, kto chce prawować się z tobą i wziąć twoją szatę, odstąp i płaszcz! Zmusza cię kto, żeby iść z nim tysiąc kroków, idź dwa tysiące! Daj temu, kto cię prosi, i nie odwracaj się od tego, kto chce pożyczyć od ciebie. Słyszeliście, że powiedziano: Będziesz miłował swego bliźniego, a nieprzyjaciela swego będziesz nienawidził. A Ja wam powiadam: Miłujcie waszych nieprzyjaciół i módlcie się za tych, którzy was prześladują; tak będziecie synami Ojca waszego, który jest w niebie; ponieważ On sprawia, że słońce Jego wschodzi nad złymi i nad dobrymi, i On zsyła deszcz na sprawiedliwych i niesprawiedliwych. Jeśli bowiem miłujecie tych, którzy was miłują, cóż za nagrodę mieć będziecie? Czyż i celnicy tego nie czynią? I jeśli pozdrawiacie tylko swych braci, cóż szczególnego czynicie? Czyż i poganie tego nie czynią? Bądźcie więc wy doskonali, jak doskonały jest Ojciec wasz niebieski.",
        keyTerm: "Kathesantos autou · Makarioi hoi ptochoi to pneumati · Penthountes · Praeis / Anawim · Dikaiosyne · Eleemones · Katharoi te kardia · Eirenopoioi · Halas tes ges · Phos tou kosmou · Plerosai",
      },
    ],
    commentary: {
      summary: 'Piąty rozdział Ewangelii wg św. Mateusza otwiera Kazanie na Górze (Mt 5–7) – Wielką Kartę Królestwa Niebieskiego. Jezus jako Nowy Mojżesz wstępuje na górę i ogłasza Osiem Błogosławieństw.',
      exegesis: 'Fakt, że Jezus „usiadł” (w. 1), oznacza zajęcie oficjalnej postawy nauczycielskiej rabina i Króla-Sędziego. W antytezach („Słyszeliście, że powiedziano... A Ja wam powiadam”) Jezus przenosi Prawo z zewnętrznego przepisu prawnego do samego źródła w sercu człowieka.',
      linguistics: [
        {
          original: 'Μακάριοι οἱ πτωχοὶ τῷ πνεύματι',
          transliteration: 'Makarioi hoi ptochoi to pneumati',
          language: 'grecki',
          meaning: 'Szczęśliwi (Błogosławieni) żebracy w duchu',
          theologicalContext: '„Ptochoi to pneumati” to ludzie całkowicie polegający na Bogu.',
        },
        {
          original: 'טוֹבֵיהוֹן דְּמִסְכֵּנֵא בְרוּחָא',
          transliteration: 'Towehon de-miskene be-rucha / Aszrej anawim',
          language: 'aramejski',
          meaning: 'Szczęśliwi pokorni (ubodzy) duchem',
          theologicalContext: 'Jezus nauczał po aramejsku i hebrajsku, używając wykrzyknika „Aszrej!” (O, jakże szczęśliwi!).',
        },
        {
          original: 'ἰῶτα ἓν ἢ μία κεραία',
          transliteration: 'Iota hen e mia keraia',
          language: 'grecki',
          meaning: 'Jedna jota (hebr. literka Jod י) lub jedna kreska',
          theologicalContext: 'Najmniejsza litera alfabetu hebrajskiego (Jod) oraz drobna wypustka kaligraficzna.',
        },
        {
          original: 'Beati pauperes spiritu',
          transliteration: 'Beati pauperes spiritu',
          language: 'łaciński',
          meaning: 'Błogosławieni ubodzy w duchu (Wulgata)',
          theologicalContext: 'Od pierwszego słowa „Beati” pochodzi nazwa „Beatitudines”.',
        },
      ],
      geopolitics: {
        powers: 'Cesarstwo Rzymskie (Tyberiusz), tetrarchia Galilei Heroda Antypasa, rzymski przymus wojskowy (angaria)',
        historicalBackground: 'Werset Mt 5,41 („Zmusza cię ktoś, żebyś szedł z nim tysiąc kroków, idź dwa”) odnosi się bezpośrednio do prawa okupacyjnego („angaria”), gdzie rzymski legionista miał prawo przymusić mieszkańca prowincji do niesienia ekwipunku przez jedną milę rzymską.',
      },
      history: {
        chronology: 'Ok. 28–29 r. n.e. w Galilei',
        eventsAndArcheology: 'Wykopaliska w Kafarnaum i na Górze Błogosławieństw potwierdzają wczesnochrześcijańską pamięć o miejscu nauczania Jezusa.',
      },
      geography: {
        locations: ['Góra Błogosławieństw nad Jeziorem Genezaret', 'Kafarnaum', 'Jerozolima'],
        description: 'Naturalny amfiteatr z czarnego bazaltu opadający ku brzegom Jeziora Galilejskiego w pobliżu Tabgha zapewnia doskonałą akustykę.',
      },
      faunaFlora: {
        species: ['Sól z Morza Martwego', 'Oliwa do lamp glinianych'],
        significance: 'Sól z Morza Martwego po wypłukaniu chlorku sodu pod wpływem wilgoci traciła słoność i była wysypywana na ścieżki.',
      },
      cultureAndCustoms: {
        topics: ['Lex talionis (Oko za oko)', 'Uderzenie grzbietem dłoni w prawy policzek'],
        description: 'Nadstawienie drugiego policzka zmuszało przeciwnika do traktowania uderzonego jak równego sobie.',
      },
      apocryphaLinks: 'W Zwojach z Qumran (4Q525) odkryto hebrajską kompozycję pięciu „Aszrej”, a Didache (rozdz. 1) otwiera naukę o „Drodze Życia” słowami z Kazania na Górze.',
    },
  },
  'JOH-1': {
    title: 'Prolog o przedwiecznym Logosie i świadectwo Jana Chrzciciela',
    verses: [
      {
        number: 1,
        text: "Na początku było Słowo, a Słowo było u Boga, i Bogiem było Słowo. Ono było na początku u Boga. Wszystko przez Nie się stało, a bez Niego nic się nie stało, co się stało. W Nim było życie, a życie było światłością ludzi, a światłość w ciemności świeci i ciemność jej nie ogarnęła. Pojawił się człowiek posłany przez Boga - Jan mu było na imię. Przyszedł on na świadectwo, aby zaświadczyć o światłości, by wszyscy uwierzyli przez niego. Nie był on światłością, lecz posłanym, aby zaświadczyć o światłości. Była światłość prawdziwa, która oświeca każdego człowieka, gdy na świat przychodzi. Na świecie było Słowo, a świat stał się przez Nie, lecz świat Go nie poznał. Przyszło do swojej własności, a swoi Go nie przyjęli. Wszystkim tym jednak, którzy Je przyjęli, dało moc, aby się stali dziećmi Bożymi, tym, którzy wierzą w imię Jego - którzy ani z krwi, ani z żądzy ciała, ani z woli męża, ale z Boga się narodzili. A Słowo stało się ciałem i zamieszkało wśród nas. I oglądaliśmy Jego chwałę, chwałę, jaką Jednorodzony otrzymuje od Ojca, pełen łaski i prawdy. Jan daje o Nim świadectwo i głośno woła w słowach: «Ten był, o którym powiedziałem: Ten, który po mnie idzie, przewyższył mnie godnością, gdyż był wcześniej ode mnie». Z Jego pełności wszyscyśmy otrzymali - łaskę po łasce. Podczas gdy Prawo zostało nadane przez Mojżesza, łaska i prawda przyszły przez Jezusa Chrystusa. Boga nikt nigdy nie widział, Ten Jednorodzony Bóg, który jest w łonie Ojca, o Nim pouczył. Takie jest świadectwo Jana. Gdy Żydzi wysłali do niego z Jerozolimy kapłanów i lewitów z zapytaniem: «Kto ty jesteś?», on wyznał, a nie zaprzeczył, oświadczając: «Ja nie jestem Mesjaszem». Zapytali go: «Cóż zatem? Czy jesteś Eliaszem?» Odrzekł: «Nie jestem». «Czy ty jesteś prorokiem?» Odparł: «Nie!» Powiedzieli mu więc: «Kim jesteś, abyśmy mogli dać odpowiedź tym, którzy nas wysłali? Co mówisz sam o sobie?» Odpowiedział: «Jam głos wołającego na pustyni: Prostujcie drogę Pańską, jak powiedział prorok Izajasz». A wysłannicy byli spośród faryzeuszów. I zadawali mu pytania, mówiąc do niego: «Czemu zatem chrzcisz, skoro nie jesteś ani Mesjaszem, ani Eliaszem, ani prorokiem?» Jan im tak odpowiedział: «Ja chrzczę wodą. Pośród was stoi Ten, którego wy nie znacie, który po mnie idzie, a któremu ja nie jestem godzien odwiązać rzemyka u Jego sandała». Działo się to w Betanii, po drugiej stronie Jordanu, gdzie Jan udzielał chrztu. Nazajutrz zobaczył Jezusa, nadchodzącego ku niemu, i rzekł: «Oto Baranek Boży, który gładzi grzech świata. To jest Ten, o którym powiedziałem: Po mnie przyjdzie Mąż, który mnie przewyższył godnością, gdyż był wcześniej ode mnie. Ja Go przedtem nie znałem, ale przyszedłem chrzcić wodą w tym celu, aby On się objawił Izraelowi». Jan dał takie świadectwo: «Ujrzałem Ducha, który jak gołębica zstępował z nieba i spoczął na Nim. Ja Go przedtem nie znałem, ale Ten, który mnie posłał, abym chrzcił wodą, powiedział do mnie: \"Ten, nad którym ujrzysz Ducha zstępującego i spoczywającego nad Nim, jest Tym, który chrzci Duchem Świętym\". Ja to ujrzałem i daję świadectwo, że On jest Synem Bożym». Nazajutrz Jan znowu stał w tym miejscu wraz z dwoma swoimi uczniami i gdy zobaczył przechodzącego Jezusa, rzekł: «Oto Baranek Boży». Dwaj uczniowie usłyszeli, jak mówił, i poszli za Jezusem. Jezus zaś odwróciwszy się i ujrzawszy, że oni idą za Nim, rzekł do nich: «Czego szukacie?» Oni powiedzieli do Niego: «Rabbi! - to znaczy: Nauczycielu - gdzie mieszkasz?» Odpowiedział im: «Chodźcie, a zobaczycie». Poszli więc i zobaczyli, gdzie mieszka, i tego dnia pozostali u Niego. Było to około godziny dziesiątej. Jednym z dwóch, którzy to usłyszeli od Jana i poszli za Nim, był Andrzej, brat Szymona Piotra. Ten spotkał najpierw swego brata i rzekł do niego: «Znaleźliśmy Mesjasza» - to znaczy: Chrystusa. I przyprowadził go do Jezusa. A Jezus wejrzawszy na niego rzekł: «Ty jesteś Szymon, syn Jana, ty będziesz nazywał się Kefas» - to znaczy: Piotr. Nazajutrz Jezus postanowił udać się do Galilei. I spotkał Filipa. Jezus powiedział do niego: «Pójdź za Mną!». Filip zaś pochodził z Betsaidy, z miasta Andrzeja i Piotra. Filip spotkał Natanaela i powiedział do niego: «Znaleźliśmy Tego, o którym pisał Mojżesz w Prawie i Prorocy - Jezusa, syna Józefa z Nazaretu». Rzekł do niego Natanael: «Czyż może być co dobrego z Nazaretu?» Odpowiedział mu Filip: «Chodź i zobacz!» Jezus ujrzał, jak Natanael zbliżał się do Niego, i powiedział o nim: «Patrz, to prawdziwy Izraelita, w którym nie ma podstępu». Powiedział do Niego Natanael: «Skąd mnie znasz?» Odrzekł mu Jezus: «Widziałem cię, zanim cię zawołał Filip, gdy byłeś pod drzewem figowym». Odpowiedział Mu Natanael: «Rabbi, Ty jesteś Synem Bożym, Ty jesteś Królem Izraela!» Odparł mu Jezus: «Czy dlatego wierzysz, że powiedziałem ci: Widziałem cię pod drzewem figowym? Zobaczysz jeszcze więcej niż to». Potem powiedział do niego: «Zaprawdę, zaprawdę, powiadam wam: Ujrzycie niebiosa otwarte i aniołów Bożych wstępujących i zstępujących na Syna Człowieczego».",
        keyTerm: "En arche en ho Logos · Panta di autou egeneto · Zoe / Phos / Skotia · Ho Logos sarx egeneto kai eskenosen · Exegesato · Ide ho Amnos tou Theou · Messias / Christos · Kefas / Petros",
      },
    ],
    commentary: {
      summary: 'Pierwszy rozdział Ewangelii wg św. Jana otwiera 10. etap planu czytania: hymniczny Prolog (w. 1–18) sięga w głąb przedwiecznego bytu Trójcy Świętej, a następnie przechodzi do świadectwa Jana Chrzciciela nad Jordanem.',
      exegesis: 'Kulminacją Prologu jest werset 14: „A Słowo stało się ciałem i rozbiło swój namiot (eskenosen) wśród nas”. Czasownik „skenoo” przywołuje Namiot Spotkania (Miszkan) na pustyni i obecność Chwały Bożej (Szechina).',
      linguistics: [
        {
          original: 'Ὁ Λόγος σὰρξ ἐγένετο καὶ ἐσκήνωσεν',
          transliteration: 'Ho Logos sarx egeneto kai eskenosen',
          language: 'grecki',
          meaning: 'Słowo ciałem się stało i rozbiło namiot',
          theologicalContext: 'Greckie „skēnē” ma te same spółgłoski S-K-N co hebrajskie „Szakan” i „Szechina”.',
        },
        {
          original: 'כֵּיפָא / מְשִׁיחָא / רַבִּי',
          transliteration: 'Kefa / Meszicha / Rabbi',
          language: 'aramejski',
          meaning: 'Skała (Piotr) / Namaszczony (Mesjasz) / Mój Mistrz',
          theologicalContext: 'Rozdział 1 Ewangelii Jana zachowuje oryginalne aramejskie tytuły z tłumaczeniem na grekę.',
        },
        {
          original: 'חֶסֶד וֶאֱמֶת',
          transliteration: 'Chesed we-emet',
          language: 'hebrajski',
          meaning: 'Łaska i prawda (Wj 34,6)',
          theologicalContext: 'Wyrażenie „pełen łaski i prawdy” (J 1,14) to grecki przekład pary pojęć z teofanii na Synaju.',
        },
        {
          original: 'Et Verbum caro factum est',
          transliteration: 'Et Verbum caro factum est',
          language: 'łaciński',
          meaning: 'A Słowo ciałem się stało (Wulgata)',
          theologicalContext: 'Kulminacyjne zdanie modlitwy Anioł Pański i Prologu Janowego.',
        },
      ],
      geopolitics: {
        powers: 'Judea i Perea za Heroda Antypasa; Efez w prowincji Azja za Domicjana',
        historicalBackground: 'Ewangelia Jana powstaje w Efezie, prowadząc dialog z filozofią grecką, judaizmem synagogalnym oraz przeciwstawiając się doketyzmowi.',
      },
      history: {
        chronology: 'Wiosna 28 r. n.e. nad Jordanem; spisanie Ewangelii ok. 90–98 r. n.e.',
        eventsAndArcheology: 'Papirus Rylandsa P52 (ok. 125 r. n.e.) zawiera fragmenty Ewangelii Jana, stanowiąc najstarszy zachowany rękopis Nowego Testamentu.',
      },
      geography: {
        locations: ['Betania za Jordanem (Wadi el-Kharrar)', 'Betsaida', 'Nazaret'],
        description: 'Wykopaliska w Wadi el-Kharrar po wschodniej stronie Jordanu odsłoniły starożytne baseny chrzcielne Betanii za Jordanem.',
      },
      faunaFlora: {
        species: ['Gołębica (Peristera)', 'Baranek ofiarny (Amnos)', 'Drzewo figowe Natanaela'],
        significance: 'Siedzenie „pod drzewem figowym” (J 1,48) było rabinicznym idiomem oznaczającym medytację nad Torą.',
      },
      cultureAndCustoms: {
        topics: ['Rzemień sandała niewolnika', 'Drabina Jakubowa (J 1,51)'],
        description: 'Rozwiązywanie rzemienia sandałów należało do posług niewolnika; Jan Chrzciciel wyznaje swoją pokorę wobec nadchodzącego Oblubieńca.',
      },
      apocryphaLinks: 'W pismach z Qumran (Reguła Zrzeszenia 1QS) występuje silny dualizm światłości i ciemności, który św. Jan przeobraża chrystocentrycznie.',
    },
  },
  'REV-21': {
    title: 'Nowe Niebo i Nowa Ziemia – Święte Miasto Nowe Jeruzalem',
    verses: [
      {
        number: 1,
        text: "I ujrzałem niebo nowe i ziemię nową, bo pierwsze niebo i pierwsza ziemia przeminęły, i morza już nie ma. I Miasto Święte - Jeruzalem Nowe ujrzałem zstępujące z nieba od Boga, przystrojone jak oblubienica zdobna w klejnoty dla swego męża. I usłyszałem donośny głos mówiący od tronu: «Oto przybytek Boga z ludźmi: i zamieszka wraz z nimi, i będą oni Jego ludem, a On będzie \"BOGIEM Z NIMI\". I otrze z ich oczu wszelką łzę, a śmierci już odtąd nie będzie. Ani żałoby, ni krzyku, ni trudu już odtąd nie będzie, bo pierwsze rzeczy przeminęły». I rzekł Zasiadający na tronie: «Oto czynię wszystko nowe». I mówi: «Napisz: Słowa te wiarygodne są i prawdziwe». I rzekł mi: «Stało się. Jam Alfa i Omega, Początek i Koniec. Ja pragnącemu dam darmo pić ze źródła wody życia. Zwycięzca to odziedziczy i będę Bogiem dla niego, a on dla mnie będzie synem. A dla tchórzów, niewiernych, obmierzłych, zabójców, rozpustników, guślarzy, bałwochwalców i wszelkich kłamców: udział w jeziorze gorejącym ogniem i siarką. To jest śmierć druga». I przyszedł jeden z siedmiu aniołów, co trzymają siedem czasz pełnych siedmiu plag ostatecznych, i tak się do mnie odezwał: «Chodź, ukażę ci Oblubienicę, Małżonkę Baranka». I uniósł mnie w zachwyceniu na górę wielką i wyniosłą, i ukazał mi Miasto Święte - Jeruzalem, zstępujące z nieba od Boga, mające chwałę Boga. Źródło jego światła podobne do kamienia drogocennego, jakby do jaspisu o przejrzystości kryształu: Miało ono mur wielki a wysoki, miało dwanaście bram, a na bramach - dwunastu aniołów i wypisane imiona, które są imionami dwunastu pokoleń synów Izraela. Od wschodu trzy bramy i od północy trzy bramy, i od południa trzy bramy, i od zachodu trzy bramy. A mur Miasta ma dwanaście warstw fundamentu, a na nich dwanaście imion dwunastu Apostołów Baranka. A ten, który mówił ze mną, miał złotą trzcinę jako miarę, by zmierzyć Miasto i jego bramy, i jego mur. A Miasto układa się w czworobok i długość jego tak wielka jest, jak i szerokość. I zmierzył Miasto trzciną poprzez dwanaście tysięcy stadiów: długość, szerokość i wysokość jego są równe. I zmierzył jego mur - sto czterdzieści cztery łokcie: miara, którą ma anioł, jest miarą człowieka. A mur jego jest zbudowany z jaspisu, a Miasto - to czyste złoto do szkła czystego podobne. A warstwy fundamentu pod murem Miasta zdobne są wszelakim drogim kamieniem. Warstwa pierwsza - jaspis, druga - szafir, trzecia - chalcedon, czwarta - szmaragd, piąta - sardoniks, szósta - krwawnik, siódma - chryzolit, ósma - beryl, dziewiąta - topaz, dziesiąta - chryzopraz, jedenasta - hiacynt, dwunasta - ametyst. A dwanaście bram to dwanaście pereł: każda z bram była z jednej perły. I rynek Miasta to czyste złoto jak szkło przeźroczyste. A świątyni w nim nie dojrzałem: bo jego świątynią jest Pan Bóg wszechmogący oraz Baranek. I Miastu nie trzeba słońca ni księżyca, by mu świeciły, bo chwała Boga je oświetliła, a jego lampą - Baranek. I w jego świetle będą chodziły narody, i wniosą do niego królowie ziemi swój przepych. I za dnia bramy jego nie będą zamknięte: bo już nie będzie tam nocy. I wniosą do niego przepych i skarby narodów. A nic nieczystego do niego nie wejdzie ani ten, co popełnia ohydę i kłamstwo, lecz tylko zapisani w księdze życia Baranka.",
        keyTerm: "Ouranon kainon kai gen kainen · Ierousalem kainen / Nymphen · Skene tou Theou meta ton anthropon · Thanatos ouk estai eti · Idou kaina poio panta · To Alpha kai to Omega",
      },
    ],
    commentary: {
      summary: 'Dwudziesty pierwszy rozdział Apokalipsy św. Jana ukazuje Nowe Jeruzalem zstępujące z nieba jako Oblubienica Baranka i doskonałe Miejsce Najświętsze.',
      exegesis: 'Miasto ma kształt idealnego sześcianu (w. 16: długość, szerokość i wysokość są równe), co odpowiada wymiarom Miejsca Najświętszego (Debir) w Świątyni Salomona (1 Krl 6,20).',
      linguistics: [
        {
          original: 'Ἰδού, καινὰ ποιῶ πάντα',
          transliteration: 'Idou, kaina poio panta',
          language: 'grecki',
          meaning: 'Oto czynię wszystko nowe (odnowione)',
          theologicalContext: 'Przymiotnik „kainos” oznacza nowość jakościową i nieskażoność.',
        },
        {
          original: 'יְרוּשְׁלֶם חֲדַתָּא',
          transliteration: 'Jeruszlem chadatta',
          language: 'aramejski',
          meaning: 'Nowe Jeruzalem (Zwoje z Qumran: 4Q554, 5Q15)',
          theologicalContext: 'Aramejski opis pomiaru Nowego Jeruzalem przez anioła z Qumran stanowi bezpośrednie tło literackie dla Ap 21,15.',
        },
        {
          original: 'Τὸ Ἄλφα καὶ τὸ Ὦ',
          transliteration: 'To Alpha kai to Omega',
          language: 'grecki',
          meaning: 'Alfa i Omega',
          theologicalContext: 'Odpowiednik hebrajskiego „Alef we-Taw” (א ת).',
        },
        {
          original: 'Ecce tabernaculum Dei cum hominibus',
          transliteration: 'Ecce tabernaculum Dei cum hominibus',
          language: 'łaciński',
          meaning: 'Oto przybytek Boga z ludźmi (Wulgata)',
          theologicalContext: 'Główna antyfona liturgii poświęcenia kościoła.',
        },
      ],
      geopolitics: {
        powers: 'Imperium Rzymskie za cesarza Domicjana (81–96 r. n.e.)',
        historicalBackground: 'Św. Jan przeciwstawia pysznej stolicy imperium (Babilonowi) Nowe Jeruzalem – czyste Miasto-Oblubienicę.',
      },
      history: {
        chronology: 'Ok. 95 r. n.e. na wyspie Patmos',
        eventsAndArcheology: 'Dwanaście warstw fundamentu Nowego Jeruzalem zdobionych 12 szlachetnymi kamieniami odpowiada 12 kamieniom na pektorale arcykapłana Izraela (Wj 28,17–20).',
      },
      geography: {
        locations: ['Wyspa Patmos', 'Nowe Jeruzalem', 'Siedem Kościołów Azji Mniejszej'],
        description: 'Brak „morza” w Ap 21,1 oznacza kres chaosu i oddzielenia.',
      },
      faunaFlora: {
        species: ['Baranek (Arnieon)', 'Źródło wody życia', '12 bram z pereł'],
        significance: 'Ojcowie Kościoła widzieli w 12 perłowych bramach symbol ran Chrystusa otwierających wejście do nieba.',
      },
      cultureAndCustoms: {
        topics: ['Zaślubiny żydowskie (Nissuin)', 'Wiecznie otwarte bramy miasta'],
        description: 'Wiecznie otwarte bramy oznaczają absolutny pokój (Szalom) i bezpieczeństwo zbawionych.',
      },
      apocryphaLinks: 'W Zwojach z Qumran odkryto sześć rękopisów aramejskiego dzieła „Nowe Jeruzalem” (4Q554, 5Q15).',
    },
  },
  '1EN-1': {
    title: 'Błogosławieństwo Henocha i Teofania Świętego i Wielkiego na Górze Synaj',
    verses: [
      {
        number: 1,
        text: "Słowo błogosławieństwa Henocha, którym pobłogosławił wybranych i sprawiedliwych obecnych w dniu ucisku, podczas którego wszyscy źli i niegodziwi zostaną usunięci. Henoch, człowiek błogosławiony i sprawiedliwy, któremu Pan otworzył oczy i obdarzył świętym widzeniem w niebiosach, zabrał głos i powiedział: To, co pokazali mi aniołowie! Usłyszałem od nich wszystko i zrozumiałem to, co zobaczyłem, choć przeznaczone to jest nie temu pokoleniu, lecz pokoleniom dalekim, które dopiero nadejdą. Mówiłem na temat wybranych i o nich ułożyłem przypowieść: Święty (Kaddosz) i Wielki (Eljon) wyjdzie ze swego mieszkania, a odwieczny Bóg (Elohim) zstąpi na Górę Synaj i ukaże się ze swoim zastępem i objawi się w mocy swej niebiańskiej potęgi. Wszyscy ulegną przerażeniu, a Czuwający zadrżą i strach oraz wielkie drżenie zapanuje aż po krańce ziemi. Wysokie góry zostaną poruszone, a wyniosłe wzgórza zmaleją i topnieć będą jak wosk przed ogniem. Ziemia pogrąży się, a wszystko, co się na niej znajduje, ulegnie zniszczeniu. Na wszystko zostanie wydany wyrok, również na wszystkich sprawiedliwych. Sprawiedliwych zaś Bóg obdarzy pokojem, swoich wybranych zachowa i zmiłuje się nad nimi. Wszyscy będą należeli do Boga, będzie im się powodzić i będą błogosławieni, a światło Boże nad nimi będzie świecić. Bo oto przychodzi z dziesięcioma tysiącami świętych, aby dokonać sądu nad nimi i aby zniszczyć grzeszników, i aby złajać każdego za to wszystko, co przeciwko Niemu uczynili grzesznicy i niegodziwcy.",
        keyTerm: "Milin de-birchata de-Chanok · Gawra kuszta (Mąż prawdy) · Kadisza we-Rabba · Szelama / Behirin · Cytat w Liście św. Judy w. 14-15!",
      },
    ],
    commentary: {
      summary:
        'Pierwszy rozdział 1 Księgi Henocha (Etiopskiej) otwiera 11. etap naszego planu czytania (Apokryfy). Jest to jeden z najważniejszych tekstów literatury międzytestamentalnej, a werset 1 Hen 1,9 został dosłownie zacytowany w Nowym Testamencie w Liście św. Judy (w. 14–15)!',
      exegesis:
        'Księga Henocha rozpoczyna się majestatyczną teofanią wzorowaną na błogosławieństwie Mojżesza z Pwt 33,2. Bóg nosi tu aramejski tytuł „Święty i Wielki” (Kadisza we-Rabba). Tekst wprowadza kluczowe pojęcia apokaliptyki żydowskiej i wczesnochrześcijańskiej: „Wybrani i Sprawiedliwi”, „Dzień Sądu” oraz eschatologiczny pokój i światłość dla wiernych.',
      linguistics: [
        {
          original: 'קַדִּישָׁא וְרַבָּא',
          transliteration: 'Kadisza we-Rabba',
          language: 'aramejski',
          meaning: 'Święty i Wielki (Zwoje aramejskie z Qumran: 4Q201 / 4QEn-a)',
          theologicalContext:
            'Odkryte w grocie 4 w Qumran aramejskie rękopisy Księgi Henocha z II w. p.n.e. potwierdziły oryginalne aramejskie brzmienie tego tytułu Boga.',
        },
        {
          original: 'Ἰδοὺ ἦλθεν Κύριος ἐν ἁγίαις μυριάσιν αὐτοῦ',
          transliteration: 'Idou elthen Kyrios en hagiais myriasin autou',
          language: 'grecki',
          meaning: 'Oto przyszedł Pan z świętymi miriadami (dziesiątkami tysięcy) swoimi',
          theologicalContext:
            'Grecki tekst z Papirusu Akhmim (Panopolis) oraz dosłowny cytat w Liście św. Judy 1,14.',
        },
        {
          original: 'חֲנוֹךְ הִתְהַלֵּךְ אֶת־הָאֱלֹהִים',
          transliteration: 'Chanok hithallek et-ha-Elohim',
          language: 'hebrajski',
          meaning: 'Henoch chodził z Bogiem (Rdz 5,24)',
          theologicalContext:
            'Imię Henoch (Chanok) oznacza „Poświęcony / Wtajemniczony”. Krótka wzmianka z Rdz 5,24 stała się fundamentem ogromnej literatury henochicznej.',
        },
        {
          original: 'Ecce venit Dominus in sanctis milibus suis',
          transliteration: 'Ecce venit Dominus in sanctis milibus suis',
          language: 'łaciński',
          meaning: 'Oto przyszedł Pan w świętych tysiącach swoich (Wulgata Jud 1,14)',
          theologicalContext:
            'Św. Hieronim i Tertulian komentowali wysoką rangę Księgi Henocha w pierwotnym Kościele.',
        },
      ],
      geopolitics: {
        powers:
          'Epoka hellenistyczna w Palestynie: rządy Ptolemeuszów i Seleucydów (III–II w. p.n.e.)',
        historicalBackground:
          'W obliczu agresywnej hellenizacji i korupcji części elit w Jerozolimie kręgi pobożnych uczonych (chasydim) odnajdywały w proroctwach Henocha pewność, że Bóg osobiście wkroczy w historię i osądzi niesprawiedliwych władców.',
      },
      history: {
        chronology:
          'Księga Czuwających (1 Hen 1–36) powstała w III w. p.n.e.; pełny tekst zachował się w języku staroetiopskim (Ge’ez), fragmenty greckie w Egipcie, a oryginały aramejskie w Qumran',
        eventsAndArcheology:
          'W 1952 r. w Grocie 4 w Qumran odnaleziono aż 11 aramejskich zwojów Księgi Henocha (4Q201–212), z których najstarszy (4Q201) datowany jest paleograficznie na ok. 200–150 r. p.n.e.',
      },
      geography: {
        locations: ['Góra Synaj', 'Góra Hermon (miejsce zstąpienia Czuwających w 1 Hen 6)', 'Dan i Abel-Bet-Maaka'],
        description:
          'Geografia Księgi Henocha łączy południową teofanię na Górze Synaj z północną scenerią ośnieżonego masywu Góry Hermon u źródeł Jordanu.',
      },
      faunaFlora: {
        species: ['Drzewa wiecznie zielone (1 Hen 3)', 'Wonne drzewo życia (1 Hen 24–25)'],
        significance:
          'W rozdziałach 2–5 Henoch wzywa czytelnika do kontemplacji ładu przyrody: drzew, pór roku, deszczu i gwiazd, które wiernie wypełniają przykazanie Stwórcy.',
      },
      cultureAndCustoms: {
        topics: ['Gatunek literacki „Testamentu i Błogosławieństwa”', 'Pisarze-mędrcy (Soferim)'],
        description:
          'Henoch jest w tradycji żydowskiej przedstawiany jako „Pisarz Sprawiedliwości” (Sofer Kuszta), patron nauki pisma, kalendarza słonecznego i astronomii.',
      },
      apocryphaLinks:
        '1 Księga Henocha należy do kanonu Biblii Etiopskiego Kościoła Ortodoksyjnego Tewahedo i wywarła ogromny wpływ na Księgę Jubileuszy, Zwoje z Qumran oraz księgi Nowego Testamentu.',
    },
  },
  'DID-1': {
    title: 'Dwie Drogi: Droga Życia i Droga Śmierci (Najstarszy katechizm Kościoła)',
    verses: [
      {
        number: 1,
        text: "Drogi są dwie: jedna droga życia, a druga droga śmierci, a wielka jest różnica między tymi dwiema drogami. Droga życia jest taka: Po pierwsze, będziesz miłował Boga, który cię stworzył; po drugie, twego bliźniego jak siebie samego. A wszystkiego, czego byś nie chciał, by tobie czyniono, i ty nie czyń drugiemu. Błogosławcie tych, którzy was przeklinają, i módlcie się za waszych nieprzyjaciół. „Drogi są dwie: jedna droga życia, a druga droga śmierci, a wielka jest różnica między tymi dwiema drogami” (w. 1). „Droga życia jest taka: Po pierwsze, będziesz miłował Boga, który cię stworzył; po drugie, twego bliźniego jak siebie samego” (w. 2). „A wszystkiego, czego byś nie chciał, by tobie czyniono, i ty nie czyń drugiemu. Błogosławcie tych, którzy was przeklinają, i módlcie się za waszych nieprzyjaciół” (w. 3). W pełnym tekście rozdziału Didache dodaje też: „pośćcie za tych, którzy was prześladują”, „każdemu, kto cię prosi, dawaj i nie żądaj zwrotu” oraz słynną przestrogę: „Niech jałmużna twoja spoci się w twoich rękach, aż poznasz, komu dajesz”.",
        keyTerm: "Hodoi dyo eisi · Złota Reguła · Eulogeite tous kataromenous · Teleios ese · Idion charismaton",
      },
    ],
    commentary: {
      summary: 'Pierwszy rozdział Didache („Nauka Pana przekazana poganom przez Dwunastu Apostołów”) otwiera 13. etap planu czytania (Inne starożytne dzieła). Jest to najstarszy pozabiblijny katechizm chrześcijański z I wieku n.e.',
      exegesis: 'Didache rozpoczyna się od biblijnego schematu „Dwóch Dróg” (Pwt 30,15, Ps 1, Mt 7,13–14), łącząc przykazanie miłości Boga i bliźniego ze Złotą Regułą oraz Kazaniem na Górze.',
      linguistics: [
        {
          original: 'Διδαχὴ Κυρίου διὰ τῶν δώδεκα ἀποστόλων',
          transliteration: 'Didache Kyriou dia ton dodeka apostolon',
          language: 'grecki',
          meaning: 'Nauka Pana przez Dwunastu Apostołów',
          theologicalContext: 'Pełny nagłówek rękopisu odkrytego w 1873 r. w Konstantynopolu przez Filoteosa Bryenniosa.',
        },
        {
          original: 'מָרַן אֲתָא',
          transliteration: 'Maran atha',
          language: 'aramejski',
          meaning: 'Nasz Panie, przyjdź! (Didache 10,6)',
          theologicalContext: 'Didache zachowuje w modlitwach eucharystycznych oryginalne aramejskie zawołanie „Maran atha!”.',
        },
        {
          original: 'Ὁδοὶ δύο εἰσί',
          transliteration: 'Hodoi dyo eisi',
          language: 'grecki',
          meaning: 'Dwie są drogi',
          theologicalContext: 'Fundamentalna kategoria katechetyczna pierwotnego Kościoła.',
        },
        {
          original: 'Doctrina Duodecim Apostolorum',
          transliteration: 'Doctrina Duodecim Apostolorum',
          language: 'łaciński',
          meaning: 'Nauka Dwunastu Apostołów',
          theologicalContext: 'Starożytny łaciński przekład pierwszej części Didache.',
        },
      ],
      geopolitics: {
        powers: 'Rzymska prowincja Syria ze stolicą w Antiochii nad Orontesem (I w. n.e.)',
        historicalBackground: 'Antiochia Syryjska była miejscem, gdzie uczniów po raz pierwszy nazwano chrześcijanami (Dz 11,26).',
      },
      history: {
        chronology: 'Ok. 50–90 r. n.e.',
        eventsAndArcheology: 'Odkrycie Kodeksu Jerozolimskiego w 1873 r. oraz fragmentów na papirusach z Oxyrynchos zrewolucjonizowało wiedzę o liturgii I wieku.',
      },
      geography: {
        locations: ['Antiochia Syryjska', 'Jerozolima', 'Górzysta Syropalestyna'],
        description: 'Wzmianka o „chlebie rozsianym po wzgórzach” wskazuje na górzysty krajobraz Galilei i Syrii.',
      },
      faunaFlora: {
        species: ['Pszenica górska na chleb eucharystyczny', 'Winorośl Dawida', 'Woda żywa (źródlana)'],
        significance: 'Didache nakazuje chrzest w „wodzie żywej” (bieżącej), a w razie jej braku – przez trzykrotne polanie głowy.',
      },
      cultureAndCustoms: {
        topics: ['Jałmużna', 'Wędrowni apostołowie i prorocy', 'Post w środy i piątki'],
        description: 'Chrześcijanie pierwszego wieku pościli w środy i piątki oraz gromadzili się w Dzień Pański (Kyriake) na łamanie chleba.',
      },
      apocryphaLinks: 'Motyw Dwóch Dróg występuje w Regule Zrzeszenia z Qumran (1QS 3–4) oraz w Liście Barnaby.',
    },
  },
  'MAT-2': {
    title: 'Pokłon Mędrców ze Wschodu w Betlejem, ucieczka do Egiptu i powrót do Nazaretu',
    verses: [
      {
        number: 1,
        text: "Gdy zaś Jezus narodził się w Betlejem w Judei za panowania króla Heroda, oto Mędrcy ze Wschodu przybyli do Jerozolimy i pytali: «Gdzie jest nowo narodzony król żydowski? Ujrzeliśmy bowiem jego gwiazdę na Wschodzie i przybyliśmy oddać mu pokłon». Skoro to usłyszał król Herod, przeraził się, a z nim cała Jerozolima. Zebrał więc wszystkich arcykapłanów i uczonych ludu i wypytywał ich, gdzie ma się narodzić Mesjasz. Ci mu odpowiedzieli: «W Betlejem judzkim, bo tak napisał Prorok: A ty, Betlejem, ziemio Judy, nie jesteś zgoła najlichsze spośród głównych miast Judy, albowiem z ciebie wyjdzie władca, który będzie pasterzem ludu mego, Izraela». Wtedy Herod przywołał potajemnie Mędrców i wypytał ich dokładnie o czas ukazania się gwiazdy. A kierując ich do Betlejem, rzekł: «Udajcie się tam i wypytujcie starannie o Dziecię, a gdy Je znajdziecie, donieście mi, abym i ja mógł pójść i oddać Mu pokłon». Oni zaś wysłuchawszy króla, ruszyli w drogę. A oto gwiazda, którą widzieli na Wschodzie, szła przed nimi, aż przyszła i zatrzymała się nad miejscem, gdzie było Dziecię. Gdy ujrzeli gwiazdę, bardzo się uradowali. Weszli do domu i zobaczyli Dziecię z Matką Jego, Maryją; upadli na twarz i oddali Mu pokłon. I otworzywszy swe skarby, ofiarowali Mu dary: złoto, kadzidło i mirrę. A otrzymawszy we śnie nakaz, żeby nie wracali do Heroda, inną drogą udali się do swojej ojczyzny. Gdy oni odjechali, oto anioł Pański ukazał się Józefowi we śnie i rzekł: «Wstań, weź Dziecię i Jego Matkę i uchodź do Egiptu; pozostań tam, aż ci powiem; bo Herod będzie szukał Dziecięcia, aby Je zgładzić». On wstał, wziął w nocy Dziecię i Jego Matkę i udał się do Egiptu; tam pozostał aż do śmierci Heroda. Tak miało się spełnić słowo, które Pan powiedział przez Proroka: Z Egiptu wezwałem Syna mego. Wtedy Herod widząc, że go Mędrcy zawiedli, wpadł w straszny gniew. Posłał oprawców do Betlejem i całej okolicy i kazał pozabijać wszystkich chłopców w wieku do lat dwóch, stosownie do czasu, o którym się dowiedział od Mędrców. Wtedy spełniły się słowa proroka Jeremiasza: Krzyk usłyszano w Rama, płacz i jęk wielki. Rachel opłakuje swe dzieci i nie chce utulić się w żalu, bo ich już nie ma. A gdy Herod umarł, oto Józefowi w Egipcie ukazał się anioł Pański we śnie, i rzekł: «Wstań, weź Dziecię i Jego Matkę i idź do ziemi Izraela, bo już umarli ci, którzy czyhali na życie Dziecięcia». On więc wstał, wziął Dziecię i Jego Matkę i wrócił do ziemi Izraela. Lecz gdy posłyszał, że w Judei panuje Archelaos w miejsce ojca swego, Heroda, bał się tam iść. Otrzymawszy zaś we śnie nakaz, udał się w strony Galilei. Przybył do miasta, zwanego Nazaret, i tam osiadł. Tak miało się spełnić słowo Proroków: Nazwany będzie Nazarejczykiem.",
        keyTerm: "Magoi apo anatolon / Betlejem Efrata (Mi 5,1) · Prosekynesan auto / Chrysos, Libanos, Smyrna · Ex Aigyptou ekalesa ton huion mou (Oz 11,1) · Nazoraios klethesetai (Necer - Odrośl z Iz 11,1)",
      },
    ],
    commentary: {
      summary:
        'Drugi rozdział Ewangelii wg św. Mateusza ukazuje dramatyczne zderzenie dwóch królestw: pogańscy Mędrcy ze Wschodu (Magoi) rozpoznają gwiazdę Mesjasza i składają Mu królewski hołd w Betlejem, podczas gdy król Herod Wielki w lęku o tron dopuszcza się rzezi niewiniątek. Jezus jako Nowy Mojżesz przechodzi przez Egipt i wraca do Ziemi Izraela, osiadając w Nazarecie.',
      exegesis:
        'Rozdział zbudowany jest wokół czterech cytatów skrypturystycznych powiązanych z nazwami geograficznymi: Betlejem (Mi 5,1), Egipt (Oz 11,1), Rama (Jr 31,15) oraz Nazaret (Iz 11,1). Mateusz przedstawia Jezusa jako prawdziwego Izraela (Syna Bożego wezwanego z Egiptu) oraz Nowego Mojżesza, który zostaje cudownie ocalony przed dekretem okrutnego władcy mordującego niemowlęta płci męskiej (por. Wj 1–2).',
      linguistics: [
        {
          original: 'Μάγοι ἀπὸ ἀνατολῶν',
          transliteration: 'Magoi apo anatolon',
          language: 'grecki',
          meaning: 'Mędrcy (kapłani-astronomowie) ze Wschodu',
          theologicalContext:
            'Termin „Magoi” (z staroperskiego magusz) określał persko-babilońskich uczonych i astronomów. Ich pokłon w Betlejem wypełnia proroctwo Iz 60,6 oraz Lb 24,17 („Wschodzi Gwiazda z Jakuba”).',
        },
        {
          original: 'בֵּית לֶחֶם אֶפְרָתָה',
          transliteration: 'Bejt Lechem Efrata',
          language: 'hebrajski',
          meaning: 'Dom Chleba w krainie Owocnej (Mi 5,1)',
          theologicalContext:
            'Hebrajska nazwa Betlejem oznacza „Dom Chleba” (w aramejskim Bejt Lachma) – miejsce narodzin Tego, który nazwie siebie Chlebem Życia.',
        },
        {
          original: 'דַּהֲבָא וּלְבוֹנְתָא וּמוֹרָא',
          transliteration: 'Dahawa u-lewonta u-mora',
          language: 'aramejski',
          meaning: 'Złoto, kadzidło i mirra (Peszitta Mt 2,11)',
          theologicalContext:
            'W egzegezie Ojców Kościoła (Ireneusz, Orygenes) złoto symbolizuje królewską godność Chrystusa, kadzidło (lebona) Jego Bóstwo, a mirra Jego zbawczą Mękę i pogrzeb.',
        },
        {
          original: 'Nazoraios vocabitur',
          transliteration: 'Nazoraios vocabitur',
          language: 'łaciński',
          meaning: 'Nazwany będzie Nazarejczykiem (Wulgata Mt 2,23)',
          theologicalContext:
            'Św. Hieronim w komentarzu do Mateusza wyjaśnia, że „Nazoraios” opiera się na hebrajskim „necer” (odrośl z pnia Jessego w Iz 11,1) oraz „nazir” (poświęcony Bogu).',
        },
      ],
      geopolitics: {
        powers:
          'Schyłek rządów Heroda Wielkiego (zm. 4 r. p.n.e.), Imperium Partów na Wschodzie oraz podział królestwa Heroda między jego synów (etnarcha Archelaos w Judei, tetrarcha Herod Antypas w Galilei)',
        historicalBackground:
          'W ostatnich latach życia Herod Wielki popadł w skrajną paranoję polityczną: kazał stracić własną żonę Mariamme oraz trzech własnych synów (Aleksandra, Arystobula i Antypatra). Po śmierci Heroda w 4 r. p.n.e. cesarz August podzielił jego państwo: okrutny Archelaos otrzymał Judeę i Samarię (w 6 r. n.e. został zdetronizowany przez Rzym), dlatego Józef ominął Judeę i osiadł w spokojniejszej Galilei pod rządami Antypasa.',
      },
      history: {
        chronology: 'Ok. 6–4 r. p.n.e. (koniunkcja Jowisza i Saturna w gwiazdozbiorze Ryb w 7 r. p.n.e.; śmierć Heroda Wielkiego przed Paschą 4 r. p.n.e.)',
        eventsAndArcheology:
          'W 2007 r. prof. Ehud Netzer odkrył grobowiec Heroda Wielkiego w twierdzy Herodium, widocznej gołym okiem z Betlejem (zaledwie 5 km na południowy wschód). Kontrast między monumentalnym pałacem-mauzoleum Heroda w Herodium a skromną grotą w Betlejem rzuca niezwykłe światło na narrację Mt 2.',
      },
      geography: {
        locations: [
          'Betlejem Judzkie (8 km na południe od Jerozolimy)',
          'Rama (na północ od Jerozolimy, miejsce grobu Racheli i deportacji z 586 p.n.e.)',
          'Szlak Via Maris prowadzący przez Gazę do Egiptu',
          'Nazaret w Galilei',
        ],
        description:
          'Podróż Świętej Rodziny z Betlejem do Egiptu wiodła szlakiem nadmorskim przez Szefelę i Synaj Północny ku Delcie Nilu, gdzie w I w. p.n.e. mieszkała blisko milionowa społeczność żydowska.',
      },
      faunaFlora: {
        species: [
          'Kadzidłowce (Boswellia sacra – żywica olibanum)',
          'Mirra (Commiphora myrrha – wonna żywica z Arabii Południowej)',
        ],
        significance:
          'Kadzidło (libanos) i mirra (smyrna) pochodziły z krzewów żywicznych rosnących w południowej Arabii (Saba/Jemen) i były transportowane Szlakiem Kadzidlanym przez Petrę Nabatejską.',
      },
      cultureAndCustoms: {
        topics: [
          'Proskynesis (upadnięcie na twarz przed Królem Wschodu)',
          'Otwieranie skarbców darów dyplomatycznych',
        ],
        description:
          'Gest „proskynesis” (oddanie pokłonu aż do ziemi) był na Wschodzie zarezerwowany dla królów i bóstw; złożenie go ubogiemu Dziecięciu w Betlejem zapowiada wejście narodów pogańskich do Kościoła.',
      },
      apocryphaLinks:
        'Protoewangelia Jakuba (rozdz. 21–22) oraz Ewangelia Pseudo-Mateusza rozwijają opowieść o grocie betlejemskiej i ucieczce do Egiptu, a tradycja koptyjska do dziś pielęgnuje szlak Świętej Rodziny wzdłuż Nilu.',
    },
  },
  'MAT-3': {
    title: 'Wołanie Jana Chrzciciela na Pustyni Judzkiej i Chrzest Jezusa w Jordanie',
    verses: [
      {
        number: 1,
        text: "W owym czasie wystąpił Jan Chrzciciel i głosił na Pustyni Judzkiej te słowa: «Nawróćcie się, bo bliskie jest królestwo niebieskie». Do niego to odnosi się słowo proroka Izajasza, gdy mówi: Głos wołającego na pustyni: Przygotujcie drogę Panu, Dla Niego prostujcie ścieżki! Sam zaś Jan nosił odzienie z sierści wielbłądziej i pas skórzany około bioder, a jego pokarmem była szarańcza i miód leśny. Wówczas ciągnęły do niego Jerozolima oraz cała Judea i cała okolica nad Jordanem. Przyjmowano od niego chrzest w rzece Jordan, wyznając przy tym swe grzechy. A gdy widział, że przychodzi do chrztu wielu spośród faryzeuszów i saduceuszów, mówił im: «Plemię żmijowe, kto wam pokazał, jak uciec przed nadchodzącym gniewem? Wydajcie więc godny owoc nawrócenia, a nie myślcie, że możecie sobie mówić: \"Abrahama mamy za ojca\", bo powiadam wam, że z tych kamieni może Bóg wzbudzić dzieci Abrahamowi. Już siekiera do korzenia drzew jest przyłożona. Każde więc drzewo, które nie wydaje dobrego owocu, będzie wycięte i w ogień wrzucone. Ja was chrzczę wodą dla nawrócenia; lecz Ten, który idzie za mną, mocniejszy jest ode mnie; ja nie jestem godzien nosić Mu sandałów. On was chrzcić będzie Duchem Świętym i ogniem. Ma On wiejadło w ręku i oczyści swój omłot: pszenicę zbierze do spichlerza, a plewy spali w ogniu nieugaszonym». Wtedy przyszedł Jezus z Galilei nad Jordan do Jana, żeby przyjąć chrzest od niego. Lecz Jan powstrzymywał Go, mówiąc: «To ja potrzebuję chrztu od Ciebie, a Ty przychodzisz do mnie?» Jezus mu odpowiedział: «Pozwól teraz, bo tak godzi się nam wypełnić wszystko, co sprawiedliwe». Wtedy Mu ustąpił. A gdy Jezus został ochrzczony, natychmiast wyszedł z wody. A oto otworzyły Mu się niebiosa i ujrzał Ducha Bożego zstępującego jak gołębicę i przychodzącego na Niego. A głos z nieba mówił: «Ten jest mój Syn umiłowany, w którym mam upodobanie».",
        keyTerm: "Metanoeite / Basileia ton ouranon (Iz 40,3) · En Pneumati Hagio kai pyri (Chrzest w Duchu Świętym i ogniu) · Houtos estin ho Huios mou ho agapetos (Objawienie Trójcy Świętej nad Jordanem)",
      },
    ],
    commentary: {
      summary:
        'Trzeci rozdział Ewangelii wg św. Mateusza przenosi nas o około trzydzieści lat naprzód nad dolny bieg Jordanu. Jan Chrzciciel jako nowy Eliasz wzywa Izrael do radykalnego nawrócenia (Teszuba / Metanoia), a Jezus, solidarny z grzesznikami, wchodzi w wody Jordanu, gdzie następuje uroczysta epifania Trójcy Świętej.',
      exegesis:
        'Słowa Jezusa skierowane do Jana („Tak godzi się nam wypełnić wszystko, co sprawiedliwe” – pasan dikaiosynen w w. 15) są pierwszymi wypowiedzianymi przez Jezusa słowami w Ewangelii Mateusza. „Sprawiedliwość” oznacza tu pełną realizację zbawczej woli Ojca: Syn Boży zstępuje na samo dno ludzkiej historii (Jordan jest najniżej położoną rzeką na Ziemi, ok. 400 m poniżej poziomu morza). Głos Ojca z nieba łączy dwa teksty Starego Testamentu: Psalm królewski 2,7 („Tyś Synem moim”) oraz pierwszą Pieśń o Słudze Pańskim z Iz 42,1 („w którym mam upodobanie”).',
      linguistics: [
        {
          original: 'Μετανοεῖτε· ἤγγικεν γὰρ ἡ βασιλεία τῶν οὐρανῶν',
          transliteration: 'Metanoeite; engiken gar he basileia ton ouranon',
          language: 'grecki',
          meaning: 'Przemieńcie umysł i serce (nawracajcie się), przybliżyło się bowiem Królestwo Niebios',
          theologicalContext:
            'Greckie „metanoia” odpowiada hebrajskiemu „teszuba” (powrót z błędnej drogi ku Bogu). Mateusz jako jedyny ewangelista używa semickiego zwrotu „Królestwo Niebios” (Malchut Szamajim).',
        },
        {
          original: 'מִן־הָאֲבָנִים הָאֵלֶּה יָקִים אֱלֹהִים בָּנִים לְאַבְרָהָם',
          transliteration: 'Abnajja / Bnajja (Gra słów: kamienie – dzieci)',
          language: 'aramejski',
          meaning: 'Z tych kamieni (abnajja) Bóg może wzbudzić synów (bnajja) Abrahamowi (Mt 3,9)',
          theologicalContext:
            'W języku aramejskim i hebrajskim słowa „kamienie” (hebr. awanim, aram. abnajja) oraz „synowie/dzieci” (hebr. banim, aram. bnajja) brzmią niemal identycznie! Ta błyskotliwa gra słów Jana Chrzciciela nad kamienistym brzegiem Jordanu dowodzi semickiego podłoża jego kazania.',
        },
        {
          original: 'πτύον / ἅλων',
          transliteration: 'Ptyon / Halon',
          language: 'grecki',
          meaning: 'Wiejadło (drewniane widły do odwiewania ziarna) / Klepisko',
          theologicalContext:
            'Obraz rolniczego odwiewania pszenicy od plew na wietrze symbolizuje eschatologiczny sąd Mesjasza.',
        },
        {
          original: 'Hic est Filius meus dilectus',
          transliteration: 'Hic est Filius meus dilectus',
          language: 'łaciński',
          meaning: 'Ten jest Syn mój umiłowany (Wulgata Mt 3,17)',
          theologicalContext:
            'Uroczyste wyznanie Ojca w Święto Chrztu Pańskiego i Epifanii.',
        },
      ],
      geopolitics: {
        powers:
          'Podział religijno-polityczny Judei: Faryzeusze (stronnictwo ludowo-synagogalne), Saduceusze (arystokracja kapłańska Świątyni) oraz wspólnota esseńska nad Morzem Martwym',
        historicalBackground:
          'W Mt 3,7 po raz pierwszy pojawiają się faryzeusze i saduceusze. Przekroczenie Jordanu od wschodu ku zachodowi w pobliżu Jerycha miało ogromny ładunek symboliczny: dokładnie w tym miejscu Jozue przeprowadził Izraela do Ziemi Obiecanej (Joz 3), a prorok Eliasz uderzył płaszczem w wody Jordanu (2 Krl 2,8).',
      },
      history: {
        chronology: 'Ok. 27–28 r. n.e. (15. rok panowania cesarza Tyberiusza wg Łk 3,1)',
        eventsAndArcheology:
          'Zaledwie 12 km na południe od brodu Kasr el-Jahud / Betanii za Jordanem znajduje się osiedle Qumran, gdzie wspólnota esseńczyków również stosowała codzienne obmycia rytualne i powoływała się na ten sam werset Iz 40,3 („Na pustyni przygotujcie drogę Panu” w Regule Zrzeszenia 1QS 8,14)!',
      },
      geography: {
        locations: [
          'Pustynia Judzka (Jeszimon)',
          'Dolny bieg rzeki Jordan naprzeciw Jerycha (ok. 400 m p.p.m.)',
        ],
        description:
          'Rzeka Jordan w dolnym biegu wije się wśród marglowych klifów i gęstych zarośli tamaryszku oraz wierzb, uchodząc do Morza Martwego.',
      },
      faunaFlora: {
        species: [
          'Szarańcza pustynna (Schistocerca gregaria – koszerny owad z Kpł 11,22)',
          'Miód dzikich pszczół skalnych',
          'Żmija pustynna i gołębica (Columba livia)',
        ],
        significance:
          'Szarańcza i dziki miód były czystym rytualnie pokarmem pustynnych ascetów, niezależnym od handlu miejskiego (Józef Flawiusz wspomina o podobnej diecie swego nauczyciela Bannusa na pustyni).',
      },
      cultureAndCustoms: {
        topics: [
          'Płaszcz prorocki z sierści wielbłądziej i skórzany pas Eliasza (2 Krl 1,8)',
          'Rolnicze klepisko (Goren) i wiejadło do oddzielania ziarna od plew',
        ],
        description:
          'Po młóceniu zboża na wzniesieniu gospodarz podrzucił ziarno drewnianą łopatą (wiejadłem) pod wieczorny wiatr od Morza Śródziemnego: ciężkie ziarno pszenicy opadało na klepisko, a lekkie plewy zdmuchiwał wiatr.',
      },
      apocryphaLinks:
        'W Sybillinach Chrześcijańskich oraz w pismach z Qumran (1QS) chrzest wodą powiązany jest z oczyszczeniem przez Ducha Świętego i prawdę Bożą.',
    },
  },
  'MAT-4': {
    title: 'Kuszenie na pustyni, światłość w Galilei i powołanie pierwszych Apostołów',
    verses: [
      {
        number: 1,
        text: "Wtedy Duch wyprowadził Jezusa na pustynię, aby był kuszony przez diabła. A gdy przepościł czterdzieści dni i czterdzieści nocy, odczuł w końcu głód. Wtedy przystąpił kusiciel i rzekł do Niego: «Jeśli jesteś Synem Bożym, powiedz, żeby te kamienie stały się chlebem». Lecz On mu odparł: «Napisane jest: Nie samym chlebem żyje człowiek, lecz każdym słowem, które pochodzi z ust Bożych». Wtedy wziął Go diabeł do Miasta Świętego, postawił na narożniku świątyni i rzekł Mu: «Jeśli jesteś Synem Bożym, rzuć się w dół, jest przecież napisane: Aniołom swoim rozkaże o tobie, a na rękach nosić cię będą, byś przypadkiem nie uraził swej nogi o kamień». Odrzekł mu Jezus: «Ale jest napisane także: Nie będziesz wystawiał na próbę Pana, Boga swego». Jeszcze raz wziął Go diabeł na bardzo wysoką górę, pokazał Mu wszystkie królestwa świata oraz ich przepych i rzekł do Niego: «Dam Ci to wszystko, jeśli upadniesz i oddasz mi pokłon». Na to odrzekł mu Jezus: «Idź precz, szatanie! Jest bowiem napisane: Panu, Bogu swemu, będziesz oddawał pokłon i Jemu samemu służyć będziesz». Wtedy opuścił Go diabeł, a oto aniołowie przystąpili i usługiwali Mu. Gdy Jezus posłyszał, że Jan został uwięziony, usunął się do Galilei. Opuścił jednak Nazaret, przyszedł i osiadł w Kafarnaum nad jeziorem, na pograniczu Zabulona i Neftalego. Tak miało się spełnić słowo proroka Izajasza: Ziemia Zabulona i ziemia Neftalego. Droga morska, Zajordanie, Galilea pogan! Lud, który siedział w ciemności, ujrzał światło wielkie, i mieszkańcom cienistej krainy śmierci światło wzeszło. Odtąd począł Jezus nauczać i mówić: «Nawracajcie się, albowiem bliskie jest królestwo niebieskie». Gdy Jezus przechodził obok Jeziora Galilejskiego, ujrzał dwóch braci: Szymona, zwanego Piotrem, i brata jego, Andrzeja, jak zarzucali sieć w jezioro; byli bowiem rybakami. I rzekł do nich: «Pójdźcie za Mną, a uczynię was rybakami ludzi». Oni natychmiast zostawili sieci i poszli za Nim. A gdy poszedł stamtąd dalej, ujrzał innych dwóch braci: Jakuba, syna Zebedeusza, i brata jego, Jana, jak z ojcem swym Zebedeuszem naprawiali w łodzi swe sieci. Ich też powołał. A oni natychmiast zostawili łódź i ojca i poszli za Nim. I obchodził Jezus całą Galileę, nauczając w tamtejszych synagogach, głosząc Ewangelię o królestwie i lecząc wszystkie choroby i wszelkie słabości wśród ludu. A wieść o Nim rozeszła się po całej Syrii. Przynoszono więc do Niego wszystkich cierpiących, których dręczyły rozmaite choroby i dolegliwości, opętanych, epileptyków i paralityków, a On ich uzdrawiał. I szły za Nim liczne tłumy z Galilei i z Dekapolu, z Jerozolimy, z Judei i z Zajordania.",
        keyTerm: "Gegraptai (Napisano: Pwt 8,3; 6,16; 6,13) · Galilaia ton ethnon / Phos mega (Iz 8,23–9,1) · Deute opiso mou / Halieis anthropon (Rybacy ludzi) · To euangelion tes basileias (Ewangelia o Królestwie)",
      },
    ],
    commentary: {
      summary:
        'Czwarty rozdział Ewangelii wg św. Mateusza ukazuje zwycięstwo Jezusa nad trzema pokusami szatana na Pustyni Judzkiej, przeprowadzkę z Nazaretu do Kafarnaum nad Jeziorem Galilejskim oraz powołanie pierwszych czterech rybaków (Piotra, Andrzeja, Jakuba i Jana).',
      exegesis:
        'Podczas gdy starożytny Izrael przez 40 lat na pustyni ulegał pokusie szemrania o chleb, wystawiania Boga na próbę w Massa i Meriba oraz bałwochwalstwa złotego cielca, Jezus jako wierny Syn Boży przez 40 dni postu zwycięża te same trzy próby, odpowiadając wyłącznie słowami Księgi Powtórzonego Prawa (Pwt 8,3; 6,16; 6,13). Przeniesienie centrum misji do Kafarnaum („Galilea pogan”) wypełnia proroctwo Izajasza 9,1 o wielkiej światłości wschodzącej nad dawnymi ziemiami Zabulona i Neftalego.',
      linguistics: [
        {
          original: 'Γέγραπται· Οὐκ ἐπ’ ἄρτῳ μόνῳ ζήσεται ὁ ἄνθρωπος',
          transliteration: 'Gegraptai: Ouk ep arto mono zesetai ho anthropos',
          language: 'grecki',
          meaning: 'Napisano: Nie samym chlebem żyje człowiek (Mt 4,4 / Pwt 8,3)',
          theologicalContext:
            'Forma perfektywna „Gegraptai” („Zostało napisane i pozostaje w mocy”) podkreśla niezmienny autorytet Słowa Bożego.',
        },
        {
          original: 'גְּלִיל הַגּוֹיִם / כְּפַר נַחוּם',
          transliteration: 'Gelil ha-gojim / Kefar Nachum',
          language: 'hebrajski',
          meaning: 'Okręg (Galilea) narodów / Wioska Pocieszenia (Kafarnaum)',
          theologicalContext:
            'Hebrajska nazwa Kafarnaum („Kefar Nachum”) oznacza dosłownie „Wioskę Nahuma / Wioskę Pocieszenia” – to tutaj Jezus zamieszkał we własnym domu (Mt 4,13; 9,1).',
        },
        {
          original: 'צַיָּדֵי בְּנֵי אֲנָשָׁא',
          transliteration: 'Cajjade bnej anasza',
          language: 'aramejski',
          meaning: 'Łowcy (rybacy) synów ludzkich (Peszitta Mt 4,19)',
          theologicalContext:
            'Powołanie uczniów („Pójdźcie za Mną”) odwraca zwyczaj rabinacki, w którym to uczeń sam wybierał sobie mistrza; tutaj Mistrz suwerennie powołuje uczniów.',
        },
        {
          original: 'Vade Satana! Dominum Deum tuum adorabis',
          transliteration: 'Vade Satana! Dominum Deum tuum adorabis',
          language: 'łaciński',
          meaning: 'Idź precz, szatanie! Panu Bogu swemu będziesz oddawał pokłon (Wulgata Mt 4,10)',
          theologicalContext:
            'Tekst czytany w I Niedzielę Wielkiego Postu we wszystkich liturgiach chrześcijańskich.',
        },
      ],
      geopolitics: {
        powers:
          'Tetrarchia Galilei i Perei (Herod Antypas, który uwięził Jana Chrzciciela w twierdzy Macheront), rzymska prowincja Syria oraz związek dziesięciu miast greckich (Dekapol)',
        historicalBackground:
          'Kafarnaum leżało przy międzynarodowym szlaku handlowym „Via Maris” („Droga Nadmorska” w Mt 4,15) łączącym Egipt z Damaszkiem i Mezopotamią, co umożliwiało błyskawiczne rozchodzenie się wieści o Jezusie po całej Syrii i Dekapolu.',
      },
      history: {
        chronology: 'Ok. 28 r. n.e. (początek publicznej działalności w Galilei po uwięzieniu Jana Chrzciciela)',
        eventsAndArcheology:
          'W 1986 r. podczas suszy nad Jeziorem Galilejskim w pobliżu Ginosar odkryto „Łódź z czasów Jezusa” (datowaną metodą C-14 na I w. p.n.e. – I w. n.e.), długą na 8,2 m, zbudowaną z drewna cedrowego i dębowego – dokładnie taką, jakiej używali Piotr, Andrzej i synowie Zebedeusza.',
      },
      geography: {
        locations: [
          'Góra Kuszenia (Dżebel Karantal) nad Jerychem',
          'Narożnik Świątyni Jerozolimskiej (Pterygion – południowo-wschodnie zwieńczenie muru nad Doliną Cedronu)',
          'Kafarnaum nad północno-zachodnim brzegiem Jeziora Galilejskiego',
        ],
        description:
          'Południowo-wschodni narożnik muru Wzgórza Świątynnego wznosił się na ogromną wysokość nad urwiskiem Doliny Cedronu (wg Józefa Flawiusza spojrzenie w dół przyprawiało o zawrót głowy).',
      },
      faunaFlora: {
        species: [
          'Ryby Jeziora Galilejskiego (Tilapia galilejska – tzw. ryba św. Piotra, brzana)',
          'Len na sieci rybackie',
        ],
        significance:
          'Werset Mt 4,18 używa precyzyjnego greckiego terminu rybackiego „amphiblestron” (okrągła sieć rzutka z ciężarkami ołowianymi zarzucana z brzegu przez Piotra i Andrzeja), a w w. 21 terminu „diktya” (wielkie sieci pławne naprawiane w łodzi przez Zebedeusza).',
      },
      cultureAndCustoms: {
        topics: [
          'Rzemiosło rybackie nad Jeziorem Genezaret',
          'Synagogi galilejskie I wieku',
        ],
        description:
          'Rybacy pracowali w spółkach rodzinnych (Piotr i Andrzej ze spółką Zebedeusza); po nocnym połowie rano płukali i suszyli lniane sieci na kamienistym brzegu Kafarnaum.',
      },
      apocryphaLinks:
        'W Testamentach Dwunastu Patriarchów (Testament Neftalego i Zabulona) ziemie tych dwóch pokoleń nad morzem są miejscem przyszłego objawienia zbawienia Bożego dla Izraela i pogan.',
    },
  },
  'MAR-1': {
    title: 'Początek Ewangelii Jezusa Chrystusa, Syna Bożego, i dzień w Kafarnaum',
    verses: [
      {
        number: 1,
        text: "Początek Ewangelii o Jezusie Chrystusie, Synu Bożym. Jak jest napisane u proroka Izajasza: Oto Ja posyłam wysłańca mego przed Tobą; on przygotuje drogę Twoją. Głos wołającego na pustyni: Przygotujcie drogę Panu, Dla Niego prostujcie ścieżki! Wystąpił Jan Chrzciciel na pustyni i głosił chrzest nawrócenia na odpuszczenie grzechów. Ciągnęła do niego cała judzka kraina oraz wszyscy mieszkańcy Jerozolimy i przyjmowali od niego chrzest w rzece Jordan, wyznając przy tym swe grzechy. Jan nosił odzienie z sierści wielbłądziej i pas skórzany około bioder, a żywił się szarańczą i miodem leśnym. I tak głosił: «Idzie za mną mocniejszy ode mnie, a ja nie jestem godzien, aby się schylić i rozwiązać rzemyk u Jego sandałów. Ja chrzciłem was wodą, On zaś chrzcić was będzie Duchem Świętym». W owym czasie przyszedł Jezus z Nazaretu w Galilei i przyjął od Jana chrzest w Jordanie. W chwili gdy wychodził z wody, ujrzał rozwierające się niebo i Ducha jak gołębicę zstępującego na siebie. A z nieba odezwał się głos: «Tyś jest mój Syn umiłowany, w Tobie mam upodobanie». Zaraz też Duch wyprowadził Go na pustynię. Czterdzieści dni przebył na pustyni, kuszony przez szatana. Żył tam wśród zwierząt, aniołowie zaś usługiwali Mu. Gdy Jan został uwięziony, Jezus przyszedł do Galilei i głosił Ewangelię Bożą. Mówił: «Czas się wypełnił i bliskie jest królestwo Boże. Nawracajcie się i wierzcie w Ewangelię!» Przechodząc obok Jeziora Galilejskiego, ujrzał Szymona i brata Szymonowego, Andrzeja, jak zarzucali sieć w jezioro; byli bowiem rybakami. Jezus rzekł do nich: «Pójdźcie za Mną, a sprawię, że się staniecie rybakami ludzi». I natychmiast zostawili sieci i poszli za Nim. Idąc dalej, ujrzał Jakuba, syna Zebedeusza, i brata jego Jana, którzy też byli w łodzi i naprawiali sieci. Zaraz ich powołał, a oni zostawili ojca swego, Zebedeusza, razem z najemnikami w łodzi i poszli za Nim. Przyszli do Kafarnaum. Zaraz w szabat wszedł do synagogi i nauczał. Zdumiewali się Jego nauką: uczył ich bowiem jak ten, który ma władzę, a nie jak uczeni w Piśmie. Był właśnie w synagodze człowiek opętany przez ducha nieczystego. Zaczął on wołać: «Czego chcesz od nas, Jezusie Nazarejczyku? Przyszedłeś nas zgubić. Wiem, kto jesteś: Święty Boży». Lecz Jezus rozkazał mu surowo: «Milcz i wyjdź z niego!». Wtedy duch nieczysty zaczął go targać i z głośnym krzykiem wyszedł z niego. A wszyscy się zdumieli, tak że jeden drugiego pytał: «Co to jest? Nowa jakaś nauka z mocą. Nawet duchom nieczystym rozkazuje i są Mu posłuszne». I wnet rozeszła się wieść o Nim wszędzie po całej okolicznej krainie galilejskiej. Zaraz po wyjściu z synagogi przyszedł z Jakubem i Janem do domu Szymona i Andrzeja. Teściowa zaś Szymona leżała w gorączce. Zaraz powiedzieli Mu o niej. On podszedł do niej i podniósł ją ująwszy za rękę, gorączka ją opuściła. A ona im usługiwała. Z nastaniem wieczora, gdy słońce zaszło, przynosili do Niego wszystkich chorych i opętanych; i całe miasto było zebrane u drzwi. Uzdrowił wielu dotkniętych rozmaitymi chorobami i wiele złych duchów wyrzucił, lecz nie pozwalał złym duchom mówić, ponieważ wiedziały, kim On jest. Nad ranem, gdy jeszcze było ciemno, wstał, wyszedł i udał się na miejsce pustynne, i tam się modlił. Pospieszył za Nim Szymon z towarzyszami, a gdy Go znaleźli, powiedzieli Mu: «Wszyscy Cię szukają». Lecz On rzekł do nich: «Pójdźmy gdzie indziej, do sąsiednich miejscowości, abym i tam mógł nauczać, bo na to wyszedłem». I chodził po całej Galilei, nauczając w ich synagogach i wyrzucając złe duchy. Wtedy przyszedł do Niego trędowaty i upadając na kolana, prosił Go: «Jeśli chcesz, możesz mnie oczyścić». Zdjęty litością, wyciągnął rękę, dotknął go i rzekł do niego: «Chcę, bądź oczyszczony!». Natychmiast trąd go opuścił i został oczyszczony. Jezus surowo mu przykazał i zaraz go odprawił, mówiąc mu: «Uważaj, nikomu nic nie mów, ale idź pokaż się kapłanowi i złóż za swe oczyszczenie ofiarę, którą przepisał Mojżesz, na świadectwo dla nich». Lecz on po wyjściu zaczął wiele opowiadać i rozgłaszać to, co zaszło, tak że Jezus nie mógł już jawnie wejść do miasta, lecz przebywał w miejscach pustynnych. A ludzie zewsząd schodzili się do Niego.",
        keyTerm: "Arche tou euangeliou Iesou Christou Huiou Theou · Schizomenous tous ouranous (Rozdzierające się niebiosa – Iz 63,19) · Peplerotai ho kairos / Pisteuete en to euangelio · Hos exousian echon (Jak mający władzę Bożą)",
      },
    ],
    commentary: {
      summary:
        'Pierwszy rozdział Ewangelii wg św. Marka otwiera 4. etap naszego planu czytania. Marek wprowadza nas w niezwykle dynamiczny rytm posługi Jezusa (ulubione słowo „euthys” – „natychmiast”), ukazując Go jako Syna Bożego działającego z boską mocą (exousia) nad duchami nieczystymi, chorobą i trądem.',
      exegesis:
        'Pierwsze zdanie („Początek Ewangelii Jezusa Chrystusa, Syna Bożego”) nawiązuje celowo zarówno do Rdz 1,1 („Na początku”), jak i do rzymskich inskrypcji cesarskich (np. Inskrypcji z Priene z 9 r. p.n.e., nazywającej urodziny Augusta „początkiem dobrej nowiny – euangelia – dla świata”). Marek ogłasza obywatelom Rzymu, że prawdziwym Synem Bożym i dawcą pokoju jest Jezus Chrystus.',
      linguistics: [
        {
          original: 'Ἀρχὴ τοῦ εὐαγγελίου Ἰησοῦ Χριστοῦ Υἱοῦ Θεοῦ',
          transliteration: 'Arche tou euangeliou Iesou Christou Huiou Theou',
          language: 'grecki',
          meaning: 'Początek Dobrej Nowiny Jezusa Chrystusa, Syna Bożego (Mk 1,1)',
          theologicalContext: 'Klamra chrystologiczna całej Ewangelii Marka: w Mk 1,1 wyznaje to narrator, a w Mk 15,39 pod krzyżem wyznaje to rzymski setnik!',
        },
        {
          original: 'בְּשׂוֹרָה / מַלְכוּת אֱלָהָא',
          transliteration: 'Besora / Malchut Elaha',
          language: 'hebrajski',
          meaning: 'Dobra Nowina o zwycięstwie Króla (Iz 52,7) / Królestwo Boże',
          theologicalContext: 'U proroka Izajasza „mebasser” to zwiastun biegnący z pola bitwy do Syjonu z okrzykiem: „Twój Bóg króluje!”.',
        },
        {
          original: 'שַׁבְּתָא / כְּנִישְׁתָּא',
          transliteration: 'Szabbata / Keniszta',
          language: 'aramejski',
          meaning: 'Szabat / Zgromadzenie synagogalne',
          theologicalContext: 'W Mk 1,32 mieszkańcy Kafarnaum czekają aż „zajdzie słońce”, ponieważ dopiero po zachodzie słońca kończył się Szabat i wolno było nieść chorych na noszach.',
        },
        {
          original: 'Initium Evangelii Iesu Christi Filii Dei',
          transliteration: 'Initium Evangelii Iesu Christi Filii Dei',
          language: 'łaciński',
          meaning: 'Początek Ewangelii Jezusa Chrystusa Syna Bożego (Wulgata)',
          theologicalContext: 'Tytuł całego gatunku literackiego „Ewangelia” wywodzi się właśnie z tego pierwszego wersetu św. Marka.',
        },
      ],
      geopolitics: {
        powers: 'Cesarstwo Rzymskie (Rzym za Nerona ok. 64–67 r. n.e., gdzie Marek spisuje kazania św. Piotra) oraz Galilea pod rządami Heroda Antypasa',
        historicalBackground: 'Ewangelia Marka zachowuje żywe wspomnienia naocznego świadka – Szymona Piotra (opis domu Piotra i Andrzeja w Kafarnaum, uzdrowienie teściowej Piotra, poszukiwanie Jezusa o świcie przez „Szymona i tych, którzy z nim byli” w Mk 1,36).',
      },
      history: {
        chronology: 'Posługa w 28 r. n.e.; spisanie Ewangelii w Rzymie ok. 60–68 r. n.e.',
        eventsAndArcheology: 'W Kafarnaum, zaledwie 30 metrów na południe od synagogi, archeolodzy franciszkańscy (Virgilio Corbo i Stanislaus Loffreda) odkopali ośmiokątny kościół bizantyjski zbudowany dokładnie nad parterowym domem rybackim z I wieku n.e. z czarnymi bazaltowymi ścianami, na których pielgrzymi już w I–II wieku wydrapali greckie, aramejskie i łacińskie inskrypcje z imieniem Jezusa i Piotra („Dom św. Piotra” z Mk 1,29)!',
      },
      geography: {
        locations: ['Dolina Jordanu', 'Jezioro Galilejskie', 'Synagoga i Dom Piotra w Kafarnaum'],
        description: 'Odległość od drzwi synagogi w Kafarnaum do progu domu Szymona Piotra wynosi w terenie niespełna 30 metrów, co idealnie wyjaśnia słowa Mk 1,29: „Zaraz po wyjściu z synagogi przyszedł do domu Szymona i Andrzeja”.',
      },
      faunaFlora: {
        species: ['Dzikie zwierzęta Pustyni Judzkiej (Mk 1,13)', 'Gołębica', 'Ryby jeziorne'],
        significance: 'Wzmianka Marka, że Jezus na pustyni „był ze zwierzętami” (Mk 1,13), ukazuje Chrystusa jako Nowego Adama przywracającego rajski pokój między człowiekiem a przyrodą (por. Iz 11,6–9).',
      },
      cultureAndCustoms: {
        topics: ['Przepis kapłański o oczyszczeniu z trądu (Kpł 14)', 'Granica czasu Szabatu przy zachodzie słońca'],
        description: 'Po uzdrowieniu trędowatego (Mk 1,44) Jezus nakazuje mu pokazać się kapłanowi w Świątyni i złożyć ofiarę oczyszczenia przepisaną przez Mojżesza, co pozwalało uzdrowionemu legalnie wrócić do rodziny i społeczności.',
      },
      apocryphaLinks: 'Papiasz z Hierapolis (cytowany przez Euzebiusza z Cezarei w Historii Kościelnej III,39) zaświadcza, że „Marek, będąc tłumaczem Piotra, spisał dokładnie wszystko, co zapamiętał z czynów i słów Chrystusa”.',
    },
  },
  'ROM-1': {
    title: 'Ewangelia jako moc Boża ku zbawieniu i usprawiedliwienie z wiary',
    verses: [
      {
        number: 1,
        text: "Paweł, sługa Chrystusa Jezusa, z powołania apostoł, przeznaczony do głoszenia Ewangelii Bożej, którą Bóg przedtem zapowiedział przez swoich proroków w Pismach świętych. Jest to Ewangelia o Jego Synu - pochodzącym według ciała z rodu Dawida, a ustanowionym według Ducha Świętości przez powstanie z martwych pełnym mocy Synem Bożym - o Jezusie Chrystusie, Panu naszym. Przez Niego otrzymaliśmy łaskę i urząd apostolski, aby ku chwale Jego imienia pozyskiwać wszystkich pogan dla posłuszeństwa wierze. Wśród nich jesteście i wy powołani przez Jezusa Chrystusa. Do wszystkich przez Boga umiłowanych, powołanych świętych, którzy mieszkają w Rzymie: Łaska wam i pokój od Boga, Ojca naszego, i Pana Jezusa Chrystusa! Na samym początku składam dzięki Bogu mojemu przez Jezusa Chrystusa za was wszystkich; ponieważ o wierze waszej mówi się po całym świecie. Bóg bowiem, któremu służę w głębi mego ducha, głosząc Ewangelię Jego Syna, jest mi świadkiem, jak nieustannie was wspominam, prosząc we wszystkich modlitwach moich, by kiedyś wreszcie za wolą Bożą nadarzyła mi się dogodna sposobność przybycia do was. Gorąco bowiem pragnę was zobaczyć, aby wam użyczyć nieco daru duchowego dla waszego umocnienia, to jest abyśmy się u was nawzajem pokrzepili wspólną wiarą - waszą i moją. Nie chcę też, byście nie wiedzieli, bracia, że wiele razy miałem zamiar przybyć do was - ale aż dotąd doznawałem przeszkód - aby zebrać nieco owocu także wśród was, podobnie jak wśród innych pogan. Jestem przecież dłużnikiem tak Greków, jak i barbarzyńców, tak uczonych, jak i niewykształconych. Przeto, co do mnie, gotów jestem głosić Ewangelię i wam, mieszkańcom Rzymu. Bo ja nie wstydzę się Ewangelii, jest bowiem ona mocą Bożą ku zbawieniu dla każdego wierzącego, najpierw dla Żyda, potem dla Greka. W niej bowiem objawia się sprawiedliwość Boża, która od wiary wychodzi i ku wierze prowadzi, jak jest napisane: a sprawiedliwy z wiary żyć będzie. Albowiem gniew Boży ujawnia się z nieba na wszelką bezbożność i nieprawość tych ludzi, którzy przez nieprawość nakładają prawdzie pęta. To bowiem, co o Bogu można poznać, jawne jest wśród nich, gdyż Bóg im to ujawnił. Albowiem od stworzenia świata niewidzialne Jego przymioty - wiekuista Jego potęga oraz bóstwo - stają się widzialne dla umysłu przez Jego dzieła, tak że nie mogą się wymówić od winy. Ponieważ, choć Boga poznali, nie oddali Mu czci jako Bogu ani Mu nie dziękowali, lecz znikczemnieli w swoich myślach i zaćmione zostało bezrozumne ich serce. Podając się za mądrych stali się głupimi. I zamienili chwałę niezniszczalnego Boga na podobizny i obrazy śmiertelnego człowieka, ptaków, czworonożnych zwierząt i płazów. Dlatego wydał ich Bóg poprzez pożądania ich serc na łup nieczystości, tak iż dopuszczali się bezczeszczenia własnych ciał. Prawdę Bożą przemienili oni w kłamstwo i stworzeniu oddawali cześć, i służyli jemu, zamiast służyć Stwórcy, który jest błogosławiony na wieki. Amen. Dlatego to wydał ich Bóg na pastwę bezecnych namiętności: mianowicie kobiety ich przemieniły pożycie zgodne z naturą na przeciwne naturze. Podobnie też i mężczyźni, porzuciwszy normalne współżycie z kobietą, zapałali nawzajem żądzą ku sobie, mężczyźni z mężczyznami uprawiając bezwstyd i na samych sobie ponosząc zapłatę należną za zboczenie. A ponieważ nie uznali za słuszne zachować prawdziwe poznanie Boga, wydał ich Bóg na pastwę na nic niezdatnego rozumu, tak że czynili to, co się nie godzi. Pełni są też wszelakiej nieprawości, przewrotności, chciwości, niegodziwości. Oddani zazdrości, zabójstwu, waśniom, podstępowi, złośliwości; potwarcy, oszczercy, nienawidzący Boga, zuchwali, pyszni, chełpliwi, w tym, co złe - pomysłowi, rodzicom nieposłuszni, bezrozumni, niestali, bez serca, bez litości. Oni to, mimo że dobrze znają wyrok Boży, iż ci, którzy się takich czynów dopuszczają, winni są śmierci, nie tylko je popełniają, ale nadto chwalą tych, którzy to czynią.",
        keyTerm: "Paulos doulos Christou Iesou / Hypakoe pisteos · Hellenin te kai Barbarois · Dynamis Theou / Ho de dikaios ek pisteos zesetai (Ha 2,4) · Ta aorata autou apo ktiseos kosmou",
      },
    ],
    commentary: {
      summary:
        'Pierwszy rozdział Listu do Rzymian otwiera 5. etap naszego planu czytania (Listy Apostolskie). Św. Paweł, pisząc z Koryntu do wspólnoty chrześcijan w stolicy Imperium, formułuje programową tezę całego listu (Rz 1,16–17): Ewangelia jest zbawczą mocą Bożą dla każdego wierzącego, a człowiek dostępuje usprawiedliwienia przez wiarę.',
      exegesis:
        'W uroczystym preskrypcie (w. 1–7) Paweł włącza wczesnochrześcijańskie wyznanie wiary o dwóch etapach egzystencji Chrystusa: ziemskim pochodzeniu z rodu Dawida („według ciała”) oraz wywyższeniu w Zmartwychwstaniu jako Syna Bożego w mocy („według Ducha Świętości”). Z kolei wersety 16–17 przywołują proroctwo Habakuka 2,4 („Sprawiedliwy z wiary żyć będzie”), a wersety 18–32 ukazują dramat świata pogańskiego, który odrzucając poznanie Stwórcy z piękna kosmosu, popadł w bałwochwalstwo i rozkład moralny.',
      linguistics: [
        {
          original: 'Δύναμις γὰρ Θεοῦ ἐστιν εἰς σωτηρίαν... Δικαιοσύνη Θεοῦ',
          transliteration: 'Dynamis Theou... Dikaiosyne Theou',
          language: 'grecki',
          meaning: 'Moc Boża ku zbawieniu... Sprawiedliwość Boża (Rz 1,16–17)',
          theologicalContext: '„Dikaiosyne Theou” nie oznacza tu karzącej surowości sędziego, lecz zbawczą wierność Boga, który usprawiedliwia i uzdrawia grzesznika przez wiarę w Chrystusa.',
        },
        {
          original: 'וְצַדִּיק בֶּאֱמוּנָתוֹ יִחְיֶה',
          transliteration: 'We-caddik be-emunato jichje',
          language: 'hebrajski',
          meaning: 'A sprawiedliwy dzięki swej wierności/wierze żyć będzie (Ha 2,4)',
          theologicalContext: 'Kluczowy werset proroka Habakuka, komentowany w Qumran (Peszer Habakuka 1QpHab) oraz wybrany przez św. Pawła na fundament teologii usprawiedliwienia.',
        },
        {
          original: 'חֶסְדָּא וּשְׁלָמָא',
          transliteration: 'Chisda u-szlama (gr. Charis kai Eirene)',
          language: 'aramejski',
          meaning: 'Łaska i pokój (Rz 1,7)',
          theologicalContext: 'Paweł łączy w każdym liście greckie pozdrowienie „Chairein” (przekształcone w „Charis” – Łaska) z semickim „Szalom / Szelama” (Pokój).',
        },
        {
          original: 'Iustus autem ex fide vivit',
          transliteration: 'Iustus autem ex fide vivit',
          language: 'łaciński',
          meaning: 'Sprawiedliwy zaś z wiary żyje (Wulgata Rz 1,17)',
          theologicalContext: 'Jeden z najbardziej wpływowych wersetów w historii teologii chrześcijańskiej (od św. Augustyna po czasy nowożytne).',
        },
      ],
      geopolitics: {
        powers: 'Stolica Imperium Rzymskiego we wczesnych latach pryncypatu Nerona (ok. 57–58 r. n.e.), po powrocie Żydów do Rzymu po wygaśnięciu edyktu Klaudiusza z 49 r. n.e.',
        historicalBackground: 'Kościół w Rzymie składał się z judeochrześcijan (którzy wrócili po śmierci cesarza Klaudiusza w 54 r.) oraz rosnącej większości chrześcijan pochodzenia pogańskiego. Paweł pisze swój list w domu Gajusa w Koryncie, przygotowując bazę w Rzymie pod planowaną wyprawę misyjną aż do Hiszpanii (Rz 15,24).',
      },
      history: {
        chronology: 'Zima 57/58 r. n.e. w Koryncie (trzecia podróż misyjna św. Pawła)',
        eventsAndArcheology: 'W Koryncie w 1929 r. odkryto słynną łacińską inskrypcję brukarską edyla Erasta („ERASTUS PRO AEDILITATE S.P. STRAVIT”), wspomnianego przez Pawła w zakończeniu Listu do Rzymian (Rz 16,23: „Pozdrawia was Erast, skarbnik miasta”).',
      },
      geography: {
        locations: ['Korynt (port Kenchry, skąd diakonisa Febe zawiozła list)', 'Rzym (dzielnica Zatybrze – Trastevere i Via Appia)'],
        description: 'Podróż morska i lądowa z portu Kenchry pod Koryntem przez Morze Jońskie i Via Appia do Rzymu zajmowała kurierowi w starożytności ok. 2–3 tygodni.',
      },
      faunaFlora: {
        species: ['Stworzenia czczone w kultach pogańskich Egiptu i Rzymu: ptaki, czworonogi i płazy (Rz 1,23)'],
        significance: 'Paweł nawiązuje w Rz 1,23 do kultów zoomorficznych (np. egipskiego kultu byka Apisa, ibisa i krokodyla oraz rzymskich posągów), przeciwstawiając im chwałę niezniszczalnego Stwórcy.',
      },
      cultureAndCustoms: {
        topics: ['Antyczna epistolografia grecko-rzymska', 'Podział świata na Greków (Hellenes) i Barbarzyńców (Barbaroi)'],
        description: 'W kulturze greckiej cały świat dzielono na wykształconych Hellenów i „Barbarzyńców” (tych, którzy nie mówią po grecku). Paweł przekracza ten podział: wobec Ewangelii jest dłużnikiem każdego człowieka bez wyjątku (Rz 1,14).',
      },
      apocryphaLinks: 'Argumentacja Pawła o poznawalności Boga ze świata widzialnego i bezsensie idolatrii w Rz 1,18–32 wykazuje ścisłe pokrewieństwo z Księgą Mądrości (Mdr 13–14) oraz z 1 Księgą Henocha.',
    },
  },
  'JOS-1': {
    title: 'Powołanie Jozuego po śmierci Mojżesza i nakaz odwagi w obliczu Jordanu',
    verses: [
      {
        number: 1,
        text: "Po śmierci Mojżesza, sługi Pana, rzekł Pan do Jozuego, syna Nuna, pomocnika Mojżesza: «Mojżesz, sługa mój, umarł; teraz więc wstań, przepraw się przez ten oto Jordan, ty i cały ten lud, do ziemi, którą Ja daję Izraelitom. Każde miejsce, na które zstąpi wasza noga, Ja wam daję, jak zapowiedziałem Mojżeszowi. Od pustyni i od Libanu aż do Wielkiej Rzeki, rzeki Eufrat, cała ziemia Chetytów aż do Wielkiego Morza, w stronę zachodzącego słońca, będzie waszą krainą. Nikt się nie ostoi przed tobą przez wszystkie dni twego życia. Jak byłem z Mojżeszem, tak będę z tobą, nie opuszczę cię ani porzucę. Bądź mężny i mocny, ponieważ ty rozdasz temu ludowi w posiadanie ziemię, którą poprzysiągłem dać ich przodkom. Tylko bądź mężny i mocny, przestrzegając wypełniania całego Prawa, które nakazał ci Mojżesz, sługa mój. Nie odstępuj od niego ani w prawo, ani w lewo, aby się okazała twoja roztropność we wszystkich przedsięwzięciach. Niech ta Księga Prawa będzie zawsze na twych ustach: rozważaj ją w dzień i w nocy, abyś ściśle spełniał wszystko, co w niej jest napisane, bo tylko wtedy powiedzie ci się i okaże się twoja roztropność. Czyż ci nie rozkazałem: Bądź mężny i mocny? Nie bój się i nie lękaj, ponieważ z tobą jest Pan, Bóg twój, wszędzie, gdziekolwiek pójdziesz». Jozue rozkazał wówczas zwierzchnikom ludu, mówiąc: «Przejdźcie przez obóz i nakażcie ludowi: Przygotujcie sobie żywność, gdyż po trzech dniach przeprawicie się przez ten Jordan, abyście zajęli ziemię, którą Pan, Bóg wasz, daje wam w posiadanie». Następnie Jozue przemówił do Rubenitów, Gadytów i połowy pokolenia Manassesa: «Przypomnijcie sobie rozkaz, jaki dał wam Mojżesz, sługa Pana, gdy rzekł: Pan, Bóg wasz, strzeże waszego pokoju i oddaje wam tę ziemię. Wasze żony, dzieci i trzody mogą pozostać w kraju, który dał wam Mojżesz za Jordanem. Wy jednak musicie wyruszyć uzbrojeni na czele swych braci, wszyscy zdolni do boju mężczyźni, i musicie im pomóc, aż Pan użyczy pokoju braciom waszym, jak i wam, i aż oni również posiądą ziemię, którą da im Pan, Bóg wasz. Wtedy możecie wrócić do kraju, który do was należy i który dał wam Mojżesz, sługa Pana, po drugiej stronie Jordanu, ku wschodowi słońca». Odpowiedzieli więc Jozuemu tymi słowami: «Wszystko, coś nam rozkazał, uczynimy i gdziekolwiek nas poślesz, pójdziemy. Jak posłuszni byliśmy we wszystkim Mojżeszowi, tak będziemy posłuszni i tobie. Oby tylko Pan, Bóg twój, był z tobą, jak był z Mojżeszem. Ktokolwiek sprzeciwi się twojemu głosowi i nie będzie posłuszny twemu słowu we wszystkim, co mu rozkażesz, musi umrzeć. Tylko ty bądź mężny i mocny».",
        keyTerm: "Chazak we-emac (Bądź mężny i mocny!) · Sefer ha-Tora ha-ze / We-hagita bo jomam wa-lajla · Kol aszer ciwwitanu naase (Solidarność dwunastu pokoleń)",
      },
    ],
    commentary: {
      summary:
        'Pierwszy rozdział Księgi Jozuego otwiera 6. etap naszego planu czytania (Księgi Historyczne). Po śmierci Mojżesza na stepach Moabu wodzem Izraela zostaje Jozue (hebr. Jehoszua – dokładny odpowiednik imienia Jezus!), któremu Bóg trzykrotnie powtarza wezwanie: „Bądź mężny i mocny!” (Chazak we-emac).',
      exegesis:
        'Kluczem do sukcesu misji Jozuego nie jest siła militarna, lecz nieustanna medytacja nad Księgą Prawa (Sefer ha-Tora) „we dnie i w nocy” (w. 8). W tradycji patrystycznej (Orygenes, Cyryl Jerozolimski) postać Jozuego wprowadzającego lud przez wody Jordanu do Ziemi Obiecanej po śmierci Mojżesza jest doskonałym typem Jezusa Chrystusa, który po wypełnieniu Prawa Mojżeszowego wprowadza lud Boży przez chrzest do Królestwa Niebieskiego.',
      linguistics: [
        {
          original: 'חֲזַק וֶאֱמָץ',
          transliteration: 'Chazak we-emac',
          language: 'hebrajski',
          meaning: 'Bądź mocny i odważny! (Joz 1,6.7.9.18)',
          theologicalContext: 'Czterokrotny refren pierwszego rozdziału Księgi Jozuego, będący starotestamentalną formułą inwestytury przywódcy powołanego przez Boga.',
        },
        {
          original: 'וְהָגִיתָ בּוֹ יוֹמָם וָלַיְלָה',
          transliteration: 'We-hagita bo jomam wa-lajla',
          language: 'hebrajski',
          meaning: 'I będziesz rozważać ją (półgłosem recytować) dniem i nocą (Joz 1,8)',
          theologicalContext: 'Czasownik „haga” (ten sam co w Ps 1,2) oznacza ciche, rytmiczne wypowiadanie słów Pisma Świętego, by zapadły w pamięć i serce.',
        },
        {
          original: 'Ἰησοῦς υἱὸς Ναυή',
          transliteration: 'Iesous huios Naue',
          language: 'grecki',
          meaning: 'Jezus (Jozue), syn Nuna (Septuaginta Joz 1,1)',
          theologicalContext: 'W greckiej Septuagincie Księga Jozuego nosi tytuł „Iesous Naue” – w języku greckim imię Jozue i Jezus brzmią i piszą się identycznie (Ἰησοῦς)!',
        },
        {
          original: 'Confortare et esto robustus',
          transliteration: 'Confortare et esto robustus',
          language: 'łaciński',
          meaning: 'Umacniaj się i bądź mężny (Wulgata Joz 1,6)',
          theologicalContext: 'Słowa używane w chrześcijańskim obrzędzie błogosławieństwa i posłania misyjnego.',
        },
      ],
      geopolitics: {
        powers: 'Rozdrobnione miasta-państwa Kanaanu w późnej epoce brązu / wczesnej epoce żelaza, osłabione wpływy Egiptu i wspomniane w w. 4 dawne ziemie Hetytów na północy',
        historicalBackground: 'Kanaan w przededniu wejścia Izraelitów nie był jednym zjednoczonym państwem, lecz siecią obwarowanych miast-państw (Jerycho, Aj, Chacor, Lakisz) rządzonych przez lokalnych królów, co potwierdzają gliniane tabliczki z Tell el-Amarna.',
      },
      history: {
        chronology: 'Ok. XIII/XII w. p.n.e. (przełom późnej epoki brązu i epoki żelaza I)',
        eventsAndArcheology: 'Listy z Tell el-Amarna (XIV w. p.n.e.) pisane pismem klinowym przez kananejskich książąt do faraona opisują niestabilność regionu i pojawienie się grup „Habiru”. Z kolei w wyżynach Kanaanu w XII w. p.n.e. archeolodzy odnotowali gwałtowny wzrost liczby nowych, nieobwarowanych osad izraelskich z charakterystycznymi domami czteroprzestrzeniowymi.',
      },
      geography: {
        locations: ['Szittim na stepach Moabu (wschodnie wybrzeże Jordanu)', 'Rzeka Jordan', 'Granice idealne: od Pustyni przez Liban i Eufrat po Morze Śródziemne'],
        description: 'Obóz Izraelitów w Szittim leżał w szerokiej Dolinie Jordanu naprzeciw oazy Jerycha, tuż przed wiosennym wezbraniem wód rzeki z topniejących śniegów Hermonu.',
      },
      faunaFlora: {
        species: ['Akacje (Szittim) w Dolinie Jordanu', 'Cedry Libanu'],
        significance: 'Nazwa ostatniego obozu „Szittim” pochodzi od drzew akacjowych rosnących w gorącym klimacie dolnego Jordanu.',
      },
      cultureAndCustoms: {
        topics: ['Prawo posiadania ziemi przez postawienie stopy (Joz 1,3)', 'Zbrojna awangarda pokoleń zajordańskich (chalucim)'],
        description: 'W prawie starożytnego Wschodu fizyczne przejście i postawienie stopy władcy na ziemi stanowiło akt prawnego objęcia jej w posiadanie.',
      },
      apocryphaLinks: 'W Zwojach z Qumran odkryto „Apokryf Jozuego” (4Q378–379), rozbudowujący mowę pożegnalną Mojżesza i wejście Jozuego przez Jordan.',
    },
  },
  'LUK-1': {
    title: 'Zwiastowanie narodzin Jana Chrzciciela i Jezusa, Nawiedzenie oraz hymny Magnificat i Benedictus',
    verses: [
      {
        number: 1,
        text: "Wielu już starało się ułożyć opowiadanie o zdarzeniach, które się dokonały pośród nas, tak jak nam je przekazali ci, którzy od początku byli naocznymi świadkami i sługami słowa. Postanowiłem więc i ja zbadać dokładnie wszystko od pierwszych chwil i opisać ci po kolei, dostojny Teofilu, abyś się mógł przekonać o całkowitej pewności nauk, których ci udzielono. Za czasów Heroda, króla Judei, żył pewien kapłan, imieniem Zachariasz, z oddziału Abiasza. Miał on żonę z rodu Aarona, a na imię było jej Elżbieta. Oboje byli sprawiedliwi wobec Boga i postępowali nienagannie według wszystkich przykazań i przepisów Pańskich. Nie mieli jednak dziecka, ponieważ Elżbieta była niepłodna; oboje zaś byli już posunięci w latach. Kiedy w wyznaczonej dla swego oddziału kolei pełnił służbę kapłańską przed Bogiem, jemu zgodnie ze zwyczajem kapłańskim przypadł los, żeby wejść do przybytku Pańskiego i złożyć ofiarę kadzenia. A cały lud modlił się na zewnątrz w czasie kadzenia. Naraz ukazał mu się anioł Pański, stojący po prawej stronie ołtarza kadzenia. Przeraził się na ten widok Zachariasz i strach padł na niego. Lecz anioł rzekł do niego: «Nie bój się Zachariaszu! Twoja prośba została wysłuchana: żona twoja Elżbieta urodzi ci syna, któremu nadasz imię Jan. Będzie to dla ciebie radość i wesele; i wielu z jego narodzenia cieszyć się będzie. Będzie bowiem wielki w oczach Pana; wina i sycery pić nie będzie i już w łonie matki napełniony będzie Duchem Świętym. Wielu spośród synów Izraela nawróci do Pana, Boga ich; on sam pójdzie przed Nim w duchu i mocy Eliasza, żeby serca ojców nakłonić ku dzieciom, a nieposłusznych - do usposobienia sprawiedliwych, by przygotować Panu lud doskonały». Na to rzekł Zachariasz do anioła: «Po czym to poznam? Bo ja jestem już stary i moja żona jest w podeszłym wieku». Odpowiedział mu anioł: «Ja jestem Gabriel, który stoję przed Bogiem. A zostałem posłany, aby mówić z tobą i oznajmić ci tę wieść radosną. A oto będziesz niemy i nie będziesz mógł mówić aż do dnia, w którym się to stanie, bo nie uwierzyłeś moim słowom, które się spełnią w swoim czasie». Lud tymczasem czekał na Zachariasza i dziwił się, że tak długo zatrzymuje się w przybytku. Kiedy wyszedł, nie mógł do nich mówić, i zrozumieli, że miał widzenie w przybytku. On zaś dawał im znaki i pozostał niemy. A gdy upłynęły dni jego posługi kapłańskiej, powrócił do swego domu. Potem żona jego, Elżbieta, poczęła i pozostawała w ukryciu przez pięć miesięcy. «Tak uczynił mi Pan - mówiła - wówczas, kiedy wejrzał łaskawie i zdjął ze mnie hańbę w oczach ludzi». W szóstym miesiącu posłał Bóg anioła Gabriela do miasta w Galilei, zwanego Nazaret, do Dziewicy poślubionej mężowi, imieniem Józef, z rodu Dawida; a Dziewicy było na imię Maryja. Anioł wszedł do Niej i rzekł: «Bądź pozdrowiona, pełna łaski, Pan z Tobą, ». Ona zmieszała się na te słowa i rozważała, co miałoby znaczyć to pozdrowienie. Lecz anioł rzekł do Niej: «Nie bój się, Maryjo, znalazłaś bowiem łaskę u Boga. Oto poczniesz i porodzisz Syna, któremu nadasz imię Jezus. Będzie On wielki i będzie nazwany Synem Najwyższego, a Pan Bóg da Mu tron Jego praojca, Dawida. Będzie panował nad domem Jakuba na wieki, a Jego panowaniu nie będzie końca». Na to Maryja rzekła do anioła: «Jakże się to stanie, skoro nie znam męża?» Anioł Jej odpowiedział: «Duch Święty zstąpi na Ciebie i moc Najwyższego osłoni Cię. Dlatego też Święte, które się narodzi, będzie nazwane Synem Bożym. A oto również krewna Twoja, Elżbieta, poczęła w swej starości syna i jest już w szóstym miesiącu ta, która uchodzi za niepłodną. Dla Boga bowiem nie ma nic niemożliwego». Na to rzekła Maryja: «Oto Ja służebnica Pańska, niech Mi się stanie według twego słowa!» Wtedy odszedł od Niej anioł. W tym czasie Maryja wybrała się i poszła z pośpiechem w góry do pewnego miasta w pokoleniu Judy. Weszła do domu Zachariasza i pozdrowiła Elżbietę. Gdy Elżbieta usłyszała pozdrowienie Maryi, poruszyło się dzieciątko w jej łonie, a Duch Święty napełnił Elżbietę. Wydała ona okrzyk i powiedziała: «Błogosławiona jesteś między niewiastami i błogosławiony jest owoc Twojego łona. A skądże mi to, że Matka mojego Pana przychodzi do mnie? Oto, skoro głos Twego pozdrowienia zabrzmiał w moich uszach, poruszyło się z radości dzieciątko w moim łonie. Błogosławiona jesteś, któraś uwierzyła, że spełnią się słowa powiedziane Ci od Pana». Wtedy Maryja rzekła: «Wielbi dusza moja Pana, i raduje się duch mój w Bogu, moim Zbawcy. Bo wejrzał na uniżenie Służebnicy swojej. Oto bowiem błogosławić mnie będą odtąd wszystkie pokolenia, gdyż wielkie rzeczy uczynił mi Wszechmocny. Święte jest Jego imię - a swoje miłosierdzie na pokolenia i pokolenia zachowuje dla tych, co się Go boją. On przejawia moc ramienia swego, rozprasza ludzi pyszniących się zamysłami serc swoich. Strąca władców z tronu, a wywyższa pokornych. Głodnych nasyca dobrami, a bogatych z niczym odprawia. Ujął się za sługą swoim, Izraelem, pomny na miłosierdzie swoje - jak przyobiecał naszym ojcom - na rzecz Abrahama i jego potomstwa na wieki». Maryja pozostała u niej około trzech miesięcy; potem wróciła do domu. Dla Elżbiety zaś nadszedł czas rozwiązania i urodziła syna. Gdy jej sąsiedzi i krewni usłyszeli, że Pan okazał tak wielkie miłosierdzie nad nią, cieszyli się z nią razem. Ósmego dnia przyszli, aby obrzezać dziecię, i chcieli mu dać imię ojca jego, Zachariasza. Jednakże matka jego odpowiedziała: «Nie, lecz ma otrzymać imię Jan». Odrzekli jej: «Nie ma nikogo w twoim rodzie, kto by nosił to imię». Pytali więc znakami jego ojca, jak by go chciał nazwać. On zażądał tabliczki i napisał: «Jan będzie mu na imię». I wszyscy się dziwili. A natychmiast otworzyły się jego usta, język się rozwiązał i mówił wielbiąc Boga. I padł strach na wszystkich ich sąsiadów. W całej górskiej krainie Judei rozpowiadano o tym wszystkim, co się zdarzyło. A wszyscy, którzy o tym słyszeli, brali to sobie do serca i pytali: «Kimże będzie to dziecię?» Bo istotnie ręka Pańska była z nim. Wtedy ojciec jego, Zachariasz, został napełniony Duchem Świętym i prorokował, mówiąc: «Niech będzie uwielbiony Pan, Bóg Izraela, że nawiedził lud swój i wyzwolił go, i moc zbawczą nam wzbudził w domu sługi swego, Dawida: jak zapowiedział to z dawien dawna przez usta swych świętych proroków, że nas wybawi od nieprzyjaciół i z ręki wszystkich, którzy nas nienawidzą; że miłosierdzie okaże ojcom naszym i wspomni na swoje święte Przymierze - na przysięgę, którą złożył ojcu naszemu, Abrahamowi, że nam użyczy tego, iż z mocy nieprzyjaciół wyrwani bez lęku służyć Mu będziemy w pobożności i sprawiedliwości przed Nim po wszystkie dni nasze. A i ty, dziecię, prorokiem Najwyższego zwać się będziesz, bo pójdziesz przed Panem torując Mu drogi; Jego ludowi dasz poznać zbawienie co się dokona przez odpuszczenie mu grzechów, dzięki litości serdecznej Boga naszego. Przez nią z wysoka Wschodzące Słońce nas nawiedzi, by zajaśnieć tym, co w mroku i cieniu śmierci mieszkają, aby nasze kroki zwrócić na drogę pokoju». Chłopiec zaś rósł i wzmacniał się duchem, a żył na pustkowiu aż do dnia ukazania się przed Izraelem.",
        keyTerm: "Autoptai kai hyperetai tou logou / Kratiste Theophile · Chaire kecharitomene / Episkiasei soi / Genoito moi · Megalynei he psyche mou ton Kyrion (Magnificat) · Eulogetos Kyrios ho Theos tou Israel (Benedictus / Anatole ex hypsous)",
      },
    ],
    commentary: {
      summary:
        'Pierwszy rozdział Ewangelii wg św. Łukasza otwiera 7. etap naszego planu czytania. Po klasycznym prologu historycznym dedykowanym Teofilowi (w. 1–4) Łukasz przechodzi w biblijny styl Septuaginty, splatając dyptyk Zwiastowania w Świątyni Jerozolimskiej (Zachariasz) i w Nazarecie (Maryja) z dwoma wielkimi kantykami liturgicznymi: Magnificat i Benedictus.',
      exegesis:
        'Słowa anioła Gabriela w Łk 1,35 („Moc Najwyższego osłoni Cię cieniem” – episkiasei soi) używają tego samego greckiego czasownika „episkiazo”, który w Wj 40,35 LXX opisuje obłok Chwały Bożej (Szechina) osłaniający Arkę Przymierza w Namiocie Spotkania. Dlatego w scenie Nawiedzenia (Łk 1,39–45) Maryja jest przedstawiona jako Nowa Arka Przymierza wędrująca w góry Judy: podobnie jak Dawid zawołał przed Arką „Jakże wejdzie do mnie Arka Pana?” (2 Sm 6,9), tak Elżbieta woła „Skądże mi to, że Matka mojego Pana przychodzi do mnie?”.',
      linguistics: [
        {
          original: 'Χαῖρε, κεχαριτωμένη, ὁ Κύριος μετὰ σοῦ',
          transliteration: 'Chaire, kecharitomene, ho Kyrios meta sou',
          language: 'grecki',
          meaning: 'Raduj się, Przepełniona łaską (Obdarowana łaską na trwałe), Pan z Tobą (Łk 1,28)',
          theologicalContext: 'Imiesłów perfektywny „kecharitomene” (od charitoo) użyty jest przez Gabriela zamiast imienia własnego: oznacza osobę od wewnątrz przemienioną i trwale napełnioną łaską Bożą.',
        },
        {
          original: 'גַּבְרִיאֵל / יוֹחָנָן',
          transliteration: 'Gawri-El / Jochanan',
          language: 'hebrajski',
          meaning: 'Mąż (Moc) Boża / JHWH okazał łaskę',
          theologicalContext: 'Archanioł Gabriel z Księgi Daniela (Dn 8,16; 9,21) zwiastuje przyjście Mesjasza, a imię Jan (Jochanan) zapowiada erę łaski i miłosierdzia.',
        },
        {
          original: 'מְרוֹמְמָא נַפְשִׁי לְמָרְיָא',
          transliteration: 'Meromema nafszi le-Marja',
          language: 'aramejski',
          meaning: 'Wielbi dusza moja Pana (Peszitta Łk 1,46)',
          theologicalContext: 'Hymn Magnificat jest utkany z paralelizmów semickich i aluzji do pieśni Anny, matki Samuela (1 Sm 2,1–10).',
        },
        {
          original: 'Magnificat anima mea Dominum / Benedictus Dominus Deus Israel',
          transliteration: 'Magnificat / Benedictus',
          language: 'łaciński',
          meaning: 'Wielbi dusza moja Pana / Błogosławiony Pan Bóg Izraela (Wulgata)',
          theologicalContext: 'Dwa codzienne kantyki ewangeliczne Liturgii Godzin Kościoła: Benedictus śpiewany o wschodzie słońca w Jutrzni, a Magnificat o zachodzie słońca w Nieszporach.',
        },
      ],
      geopolitics: {
        powers: 'Królestwo Judei za Heroda Wielkiego; podział kapłaństwa na 24 zmiany (oddział Abiasza – ósma zmiana wg 1 Krn 24,10)',
        historicalBackground: 'Każdy z 24 oddziałów kapłańskich służył w Świątyni Jerozolimskiej przez dwa tygodnie w roku. Ponieważ kapłanów było kilkanaście tysięcy, przywilej wejścia do Miejsca Świętego, by położyć wonne kadzidło na złotym ołtarzu (Łk 1,9), przypadał kapłanowi w drodze losowania tylko jeden jedyny raz w całym życiu!',
      },
      history: {
        chronology: 'Ok. 7–5 r. p.n.e.; spisanie Ewangelii Łukasza ok. 60–80 r. n.e.',
        eventsAndArcheology: 'W Cezarei Nadmorskiej odkryto hebrajską inskrypcję synagogalną wymieniającą 24 zmiany kapłańskie (m.in. zmianę Abiasza). Z kolei w Ain Karem w górach Judy wykopaliska potwierdziły istnienie osady z okresu Drugiej Świątyni wokół źródła Maryi.',
      },
      geography: {
        locations: ['Świątynia Jerozolimska (Miejsce Święte z ołtarzem kadzenia)', 'Nazaret w Galilei', 'Ain Karem w górach Judy (ok. 7 km na zachód od Jerozolimy)'],
        description: 'Droga Maryi z Nazaretu w góry Judy liczyła ok. 140 km i prowadziła przez równinę Ezdrelon oraz wzgórza wokół Jerozolimy.',
      },
      faunaFlora: {
        species: ['Kadzidło świątynne (składające się z 11 wonnych żywic i ziół)', 'Oliwa i winorośl w górach Judy'],
        significance: 'Dym kadzidła wznoszący się ze złotego ołtarza przed zasłoną Miejsca Najświętszego symbolizował modlitwę całego ludu wznoszącą się ku Bogu (Ps 141,2).',
      },
      cultureAndCustoms: {
        topics: ['Losowanie służby kadzenia (Tamid)', 'Obrzezanie i nadanie imienia ósmego dnia (Brit Mila)', 'Drewniana tabliczka do pisania pokryta woskiem (Pinakidion w Łk 1,63)'],
        description: 'W zwyczaju żydowskim imię nadawano chłopcu podczas obrzędu obrzezania ósmego dnia po urodzeniu; niemy Zachariasz zapisuje imię „Jan” rylcem na woskowanej tabliczce („pinakidion”).',
      },
      apocryphaLinks: 'Hymny Łk 1–2 (Magnificat, Benedictus, Nunc dimittis) posiadają tę samą strukturę poetycką co Hymny Dziękczynne (Hodajot – 1QH) z Qumran oraz Psalmy Salomona.',
    },
  },
  'REV-1': {
    title: 'Objawienie Jezusa Chrystusa na wyspie Patmos i wizja Syna Człowieczego pośród siedmiu świeczników',
    verses: [
      {
        number: 1,
        text: "Objawienie Jezusa Chrystusa, które dał Mu Bóg, aby ukazać swym sługom, co musi stać się niebawem, a On wysławszy swojego anioła oznajmił przez niego za pomocą znaków słudze swojemu Janowi. Ten poświadcza, że słowem Bożym i świadectwem Jezusa Chrystusa jest wszystko, co widział. Błogosławiony, który odczytuje, i którzy słuchają słów Proroctwa, a strzegą tego, co w nim napisane, bo chwila jest bliska. Jan do siedmiu Kościołów, które są w Azji: Łaska wam i pokój od Tego, Który jest, i Który był i Który przychodzi, i od Siedmiu Duchów, które są przed Jego tronem, i od Jezusa Chrystusa, Świadka Wiernego, Pierworodnego umarłych i Władcy królów ziemi. Temu, który nas miłuje i który przez swą krew uwolnił nas od naszych grzechów, i uczynił nas królestwem - kapłanami dla Boga i Ojca swojego, Jemu chwała i moc na wieki wieków! Amen. Oto nadchodzi z obłokami, i ujrzy Go wszelkie oko i wszyscy, którzy Go przebili. I będą Go opłakiwać wszystkie pokolenia ziemi. Tak: Amen. Jam jest Alfa i Omega, mówi Pan Bóg, Który jest, Który był i Który przychodzi, Wszechmogący. Ja, Jan, wasz brat i współuczestnik w ucisku i królestwie, i wytrwałości w Jezusie, byłem na wyspie, zwanej Patmos, z powodu słowa Bożego i świadectwa Jezusa. Doznałem zachwycenia w dzień Pański i posłyszałem za sobą potężny głos jak gdyby trąby mówiącej: «Co widzisz, napisz w księdze i poślij siedmiu Kościołom: do Efezu, Smyrny, Pergamonu, Tiatyry, Sardów, Filadelfii i Laodycei». I obróciłem się, by widzieć, co za głos do mnie mówił; a obróciwszy się, ujrzałem siedem złotych świeczników, i pośród świeczników kogoś podobnego do Syna Człowieczego, obleczonego w szatę do stóp i przepasanego na piersiach złotym pasem. Głowa Jego i włosy - białe jak biała wełna, jak śnieg, a oczy Jego jak płomień ognia. Stopy Jego podobne do drogocennego metalu, jak gdyby w piecu rozżarzonego, a głos Jego jak głos wielu wód. W prawej swej ręce miał siedem gwiazd i z Jego ust wychodził miecz obosieczny, ostry. A Jego wygląd - jak słońce, kiedy jaśnieje w swej mocy. Kiedym Go ujrzał, do stóp Jego upadłem jak martwy, a On położył na mnie prawą rękę, mówiąc: «Przestań się lękać! Jam jest Pierwszy i Ostatni i żyjący. Byłem umarły, a oto jestem żyjący na wieki wieków i mam klucze śmierci i Otchłani. Napisz więc to, co widziałeś, i to, co jest, i to, co potem musi się stać. Co do tajemnicy siedmiu gwiazd, które ujrzałeś w mojej prawej ręce, i co do siedmiu złotych świeczników: siedem gwiazd - to są Aniołowie siedmiu Kościołów, a siedem świeczników - to jest siedem Kościołów.",
        keyTerm: "Apokalypsis Iesou Christou / Ho On kai ho En kai ho Erchomenos · En te Kyriake hemera / Homoion Huion anthropou · Ho Protos kai ho Eschatos kai ho Zon / Kleis tou thanatou kai tou Hadou",
      },
    ],
    commentary: {
      summary:
        'Pierwszy rozdział Apokalipsy św. Jana otwiera 8. etap naszego planu czytania. Zesłany na skalistą wyspę Patmos Apostoł Jan w „Dzień Pański” (niedzielę Zmartwychwstania) ogląda chwalebną teofanię Zmartwychwstałego Chrystusa jako Arcykapłana i Przedwiecznego kroczącego pośród siedmiu złotych świeczników (Kościołów).',
      exegesis:
        'Opis Zmartwychwstałego w Ap 1,13–16 łączy cechy Syna Człowieczego z Dn 7,13 oraz samego „Przedwiecznego” (Boga Ojca z Dn 7,9: włosy białe jak śnieg), co stanowi jedno z najpotężniejszych wyznań bóstwa Chrystusa w Nowym Testamencie. Chrystus trzyma w prawicy siedem gwiazd (władzę nad kosmosem, którą przypisywali sobie cesarze rzymscy na monetach) oraz klucze śmierci i Otchłani (Hadesu/Szeolu).',
      linguistics: [
        {
          original: 'Ἀποκάλυψις Ἰησοῦ Χριστοῦ',
          transliteration: 'Apokalypsis Iesou Christou',
          language: 'grecki',
          meaning: 'Odsłonięcie zasłony (Objawienie) Jezusa Chrystusa (Ap 1,1)',
          theologicalContext: 'Słowo „apokalypsis” nie oznacza katastrofy, lecz „zdjęcie zasłony” z oczu wierzących (jak zasłony oblubienicy lub zasłony Świątyni), by ujrzeli Chrystusa królującego nad historią.',
        },
        {
          original: 'Ἐν τῇ Κυριακῇ ἡμέρᾳ',
          transliteration: 'En te Kyriake hemera',
          language: 'grecki',
          meaning: 'W Dzień Pański (Ap 1,10)',
          theologicalContext: 'Najstarsze w Nowym Testamencie użycie nazwy „Dzień Pański” (Kyriake hemera – stąd łac. Dominica, wł. Domenica, fr. Dimanche) na określenie chrześcijańskiej niedzieli w opozycji do „dnia cesarza” (Sebaste).',
        },
        {
          original: 'בר אנש / עתיק יומין',
          transliteration: 'Bar Enasz / Attik Jomin',
          language: 'aramejski',
          meaning: 'Syn Człowieczy / Przedwieczny (Dn 7,9.13)',
          theologicalContext: 'Wizja Jana na Patmos czerpie bezpośrednio z aramejskich rozdziałów Księgi Daniela.',
        },
        {
          original: 'Noli timere! Ego sum Primus et Novissimus et Vivens',
          transliteration: 'Noli timere! Ego sum Primus et Novissimus et Vivens',
          language: 'łaciński',
          meaning: 'Nie lękaj się! Jam jest Pierwszy i Ostatni, i Żyjący (Wulgata Ap 1,17–18)',
          theologicalContext: 'Tytuł „Pierwszy i Ostatni” (hebr. Riszon we-Acharon) w Iz 44,6 należy wyłącznie do Boga JHWH.',
        },
      ],
      geopolitics: {
        powers: 'Imperium Rzymskie za cesarza Domicjana (81–96 r. n.e.), który domagał się tytułu „Dominus et Deus noster” (Pan i Bóg nasz) w prowincji Azja',
        historicalBackground: 'Siedem miast (Efez, Smyrna, Pergamon, Tiatyra, Sardes, Filadelfia, Laodycea) tworzyło rzymski okręg pocztowo-sądowy wzdłuż głównej drogi prokonsularnej w zachodniej Azji Mniejszej, będącej centrum kultu cesarskiego.',
      },
      history: {
        chronology: 'Ok. 95 r. n.e. pod koniec panowania Domicjana',
        eventsAndArcheology: 'Zachowały się rzymskie denary cesarza Domicjana przedstawiające jego zmarłego synka siedzącego na globie ziemskim pośród siedmiu gwiazd z napisem „DIVUS CAESAR” – św. Jan w Ap 1,16 ukazuje, że to nie cesarz, lecz Zmartwychwstały Jezus trzyma siedem gwiazd w swojej prawicy!',
      },
      geography: {
        locations: ['Wyspa Patmos na Morzu Egejskim (archipelag Sporad Południowych)', 'Siedem miast prowincji Azja (dzisiejsza zachodnia Turcja)'],
        description: 'Patmos to wulkaniczna, skalista wyspa o długości ok. 12 km, oddalona o ok. 60 km na południowy zachód od Miletu i Efezu, służąca w I wieku za miejsce rzymskiego zesłania („relegatio in insulam”).',
      },
      faunaFlora: {
        species: ['Biała wełna owcza z Laodycei', 'Oliwa do siedmiu złotych świeczników (Menora)'],
        significance: 'Porównanie włosów Syna Człowieczego do „białej wełny” (Ap 1,14) nawiązuje zarówno do Dn 7,9, jak i do Iz 1,18.',
      },
      cultureAndCustoms: {
        topics: ['Szata arcykapłańska do stóp (Podere) i złoty pas na piersiach', 'Publiczne odczytywanie listu w zgromadzeniu liturgicznym (Ap 1,3)'],
        description: 'Błogosławieństwo w Ap 1,3 („Błogosławiony, który odczytuje – w liczbie pojedynczej: lektor – i ci, którzy słuchają – w liczbie mnogiej: zgromadzenie”) opisuje żywą liturgię niedzielną pierwotnego Kościoła.',
      },
      apocryphaLinks: 'Motyw siedmiu aniołów stojących przed tronem Bożym koresponduje z Księgą Tobiasza (Tb 12,15) oraz 1 Księgą Henocha (rozdz. 20).',
    },
  },
  'JOB-1': {
    title: 'Prawość Hioba w ziemi Uc, narada w niebie i próba wierności w cierpieniu',
    verses: [
      {
        number: 1,
        text: "Żył w ziemi Us człowiek imieniem Hiob. Był to mąż sprawiedliwy, prawy, bogobojny i unikający zła. Miał siedmiu synów i trzy córki. Majętność jego stanowiło siedem tysięcy owiec, trzy tysiące wielbłądów, pięćset jarzm wołów, pięćset oślic oraz wielka liczba służby. Był najwybitniejszym człowiekiem spośród wszystkich ludzi Wschodu. Synowie jego mieli zwyczaj udawania się na ucztę, którą każdy z nich urządzał po kolei we własnym domu w dniu oznaczonym. Zapraszali też swoje trzy siostry, by jadły i piły z nimi. Gdy przeminął czas ucztowania, Hiob dbał o to, by dokonywać ich oczyszczenia. Wstawał wczesnym rankiem i składał całopalenie stosownie do ich liczby. Bo mówił Hiob do siebie: «Może moi synowie zgrzeszyli i złorzeczyli Bogu w swym sercu?» Hiob zawsze tak postępował. Zdarzyło się pewnego dnia, gdy synowie Boży udawali się, by stanąć przed Panem, że i szatan też poszedł z nimi. I rzekł Bóg do szatana: «Skąd przychodzisz?» Szatan odrzekł Panu: «Przemierzałem ziemię i wędrowałem po niej». Mówi Pan do szatana: «A zwróciłeś uwagę na sługę mego, Hioba? Bo nie ma na całej ziemi drugiego, kto by tak był prawy, sprawiedliwy, bogobojny i unikający grzechu jak on». Szatan na to do Pana: «Czyż za darmo Hiob czci Boga? Czyż Ty nie ogrodziłeś zewsząd jego samego, jego domu i całej majętności? Pracy jego rąk pobłogosławiłeś, jego dobytek na ziemi się mnoży. Wyciągnij, proszę, rękę i dotknij jego majątku! Na pewno Ci w twarz będzie złorzeczył». Rzekł Pan do szatana: «Oto cały majątek jego w twej mocy. Tylko na niego samego nie wyciągaj ręki». I odszedł szatan sprzed oblicza Pańskiego. Pewnego dnia, gdy synowie i córki jedli i pili w domu najstarszego brata, przyszedł posłaniec do Hioba i rzekł: «Woły orały, a oślice pasły się tuż obok. Wtem napadli Sabejczycy, porwali je, a sługi mieczem pozabijali, ja sam uszedłem, by ci o tym donieść». Gdy ten jeszcze mówił, przyszedł inny i rzekł: «Ogień Boży spadł z nieba, zapłonął wśród owiec oraz sług i pochłonął ich. Ja sam uszedłem, by ci o tym donieść». Gdy ten jeszcze mówił, przyszedł inny i rzekł: «Chaldejczycy zstąpili z trzema oddziałami, napadli na wielbłądy, a sługi ostrzem miecza zabili. Ja sam uszedłem, by ci o tym donieść». Gdy ten jeszcze mówił, przyszedł inny i rzekł: «Twoi synowie i córki jedli i pili wino w domu najstarszego brata. Wtem powiał szalony wicher z pustyni, poruszył czterema węgłami domu, zawalił go na dzieci, tak iż poumierały. Ja sam uszedłem, by ci o tym donieść». Hiob wstał, rozdarł swe szaty, ogolił głowę, upadł na ziemię, oddał pokłon i rzekł: «Nagi wyszedłem z łona matki i nagi tam wrócę. Dał Pan i zabrał Pan. Niech będzie imię Pańskie błogosławione!» W tym wszystkim Hiob nie zgrzeszył i nie przypisał Bogu nieprawości.",
        keyTerm: "Tam we-jaszar we-jere Elohim (Nienaganny, prawy i bogobojny) · Ha-chinnam jare Ijjow Elohim? (Czy za darmo Hiob czci Boga?) · Czterech zwiastunów nieszczęścia · JHWH natan we-JHWH lakach, jehi szem JHWH meworach!",
      },
    ],
    commentary: {
      summary:
        'Pierwszy rozdział Księgi Hioba otwiera 9. etap naszego planu czytania (Księgi Mądrościowe). Narracyjny prolog wprowadza nas w samo sedno ludzkiej wiary: „Czy za darmo Hiob czci Boga?” (Hi 1,9) – czy człowiek kocha Boga tylko dla Jego darów i pomyślności, czy też trwa w zaufaniu także pośród niezawinionego cierpienia?',
      exegesis:
        'W niebiańskiej radzie występuje postać określona z rodzajnikiem jako „ha-satan” („oskarżyciel / prokurator”), który kwestionuje bezinteresowność ludzkiej pobożności. Odpowiedź Hioba po utracie całego dobytku i dziesięciorga dzieci w jednym dniu (Hi 1,21: „Dał Pan i zabrał Pan. Niech będzie imię Pańskie błogosławione!”) należy do najbardziej heroicznych wyznań wiary w dziejach ludzkości.',
      linguistics: [
        {
          original: 'תָּם וְיָשָׁר וִירֵא אֱלֹהִים',
          transliteration: 'Tam we-jaszar we-jere Elohim',
          language: 'hebrajski',
          meaning: 'Całkowity (integralny wewnętrznie), prawy i bojący się Boga (Hi 1,1)',
          theologicalContext: 'Słowo „tam” oznacza człowieka o niepodzielnym sercu, wolnego od dwulicowości.',
        },
        {
          original: 'יְהוָה נָתַן וִיהוָה לָקָח יְהִי שֵׁם יְהוָה מְבֹרָךְ',
          transliteration: 'JHWH natan we-JHWH lakach, jehi szem JHWH meworach',
          language: 'hebrajski',
          meaning: 'Pan dał i Pan wziął, niech będzie imię Pana błogosławione! (Hi 1,21)',
          theologicalContext: 'Autor księgi wkłada w usta nieizraelskiego patriarchy z ziemi Uc najświętsze Imię Boga Izraela (JHWH).',
        },
        {
          original: 'הַשָּׂטָן / בְּנֵי הָאֱלֹהִים',
          transliteration: 'Ha-Satan / Bnej ha-Elohim',
          language: 'hebrajski',
          meaning: 'Oskarżyciel (Przeciwnik) / Synowie Boży (Aniołowie w radzie niebieskiej)',
          theologicalContext: 'Z hebrajskiego „satan” wywodzi się aramejskie „satana” i greckie „diabolos” (oszczerca).',
        },
        {
          original: 'Dominus dedit, Dominus abstulit; sit nomen Domini benedictum',
          transliteration: 'Dominus dedit, Dominus abstulit; sit nomen Domini benedictum',
          language: 'łaciński',
          meaning: 'Pan dał, Pan zabrał; niech będzie imię Pańskie błogosławione (Wulgata Hi 1,21)',
          theologicalContext: 'Kluczowy responsoryjny werset chrześcijańskiej liturgii za zmarłych.',
        },
      ],
      geopolitics: {
        powers: 'Kraina Uc na pograniczu Edomu i Północnej Arabii, koczownicze plemiona Sabejczyków (z Południa) i Chaldejczyków (z Mezopotamii)',
        historicalBackground: 'Sceneria Księgi Hioba nawiązuje do epoki patriarchalnej na wschodnich rubieżach Żyznego Półksiężyca (ludzie Wschodu – Bnej Kedem), gdzie bogactwo mierzono liczbą stad i wielbłądów.',
      },
      history: {
        chronology: 'Tło patriarchalne; kompozycja literacka ok. VI–V w. p.n.e.',
        eventsAndArcheology: 'W Grocie 11 w Qumran odkryto niezwykle cenny aramejski Targum Księgi Hioba (11QtgJob) z II/I w. p.n.e. oraz fragmenty Księgi Hioba pisane starożytnym pismem paleohebrajskim (4QpaleoJob).',
      },
      geography: {
        locations: ['Ziemia Uc (wschodni Edom / Hauran)', 'Pustynia Syryjsko-Arabska'],
        description: 'Gwałtowny wiatr pustynny (szaraw / chamsin) z w. 19 to niszczycielska trąba powietrzna znad Pustyni Arabskiej.',
      },
      faunaFlora: {
        species: ['Owce (7000)', 'Wielbłądy jednogarbne (3000)', 'Woły orne (500 par)', 'Oślice (500)'],
        significance: 'Zestawienie zwierząt odzwierciedla gospodarkę osiadło-pasterską: woły orały pola uprawne, a wielbłądy służyły do dalekosiężnych karawan handlowych.',
      },
      cultureAndCustoms: {
        topics: ['Ojciec rodziny jako kapłan składający całopalenia (Olot) o świcie', 'Rytuał żałoby: rozdarcie płaszcza (Keria) i ogolenie głowy'],
        description: 'Rozdarcie szaty i ogolenie głowy było na starożytnym Wschodzie zewnętrznym znakiem najgłębszej żałoby; Hiob łączy ten ból z pełnym czci pokłonem oddanym Bogu.',
      },
      apocryphaLinks: 'Apokryficzny „Testament Hioba” (I w. p.n.e. / I w. n.e.) oraz List św. Jakuba (Jk 5,11: „Słyszeliście o wytrwałości Hioba”) sławią niezłomną cierpliwość patriarchy.',
    },
  },
  'ISA-1': {
    title: 'Wielka skarga Pana nad niewiernym miastem i wezwanie do prawdziwego nawrócenia',
    verses: [
      {
        number: 1,
        text: "Widzenie Izajasza, syna Amosa, które miał w sprawie Judy i Jerozolimy, w czasach królów judzkich: Ozjasza, Jotama, Achaza i Ezechiasza. Niebiosa, słuchajcie, ziemio, nadstaw uszu, bo Pan przemawia: «Wykarmiłem i wychowałem synów, lecz oni wystąpili przeciw Mnie. Wół rozpoznaje swego pana i osioł żłób swego właściciela, Izrael na niczym się nie zna, lud mój niczego nie rozumie». Biada ci, narodzie grzeszny, ludu obciążony nieprawością, plemię zbójeckie, dzieci wyrodne! Opuścili Pana, wzgardzili Świętym Izraela, odwrócili się wstecz. Gdzie was jeszcze uderzyć, skoro mnożycie przestępstwa? Cała głowa chora, całe serce osłabłe; od stopy nogi do szczytu głowy nie ma w nim części nietkniętej: rany i sińce i opuchnięte pręgi, nie opatrzone ani przewiązane, ni złagodzone oliwą. Kraj wasz spustoszony, wasze miasta ogniem spalone, cudzoziemcy tratują wam niwy na waszych oczach: spustoszenie jak po zagładzie Sodomy. Córa Syjonu ostała się jak chatka w winnicy, jak szałas w ogrodzie warzywnym, jak miasto oblężone. Gdyby nam Pan Zastępów nie zostawił Reszty, stalibyśmy się jak Sodoma, podobni bylibyśmy Gomorze. Słuchajcie słowa Pańskiego, wodzowie sodomscy, daj posłuch prawu naszego Boga, ludu Gomory! «Co mi po mnóstwie waszych ofiar? - mówi Pan. Syt jestem całopalenia kozłów i łoju tłustych cielców. Krew wołów i baranów, i kozłów mi obrzydła. Gdy przychodzicie, by stanąć przede Mną, kto tego żądał od was, żebyście wydeptywali me dziedzińce? Przestańcie składania czczych ofiar! Obrzydłe Mi jest wznoszenie dymu; święta nowiu, szabaty, zwoływanie świętych zebrań... Nie mogę ścierpieć świąt i uroczystości. Nienawidzę całą duszą waszych świąt nowiu i obchodów; stały Mi się ciężarem; sprzykrzyło Mi się je znosić! Gdy wyciągniecie ręce, odwrócę od was me oczy. Choćbyście nawet mnożyli modlitwy, Ja nie wysłucham. Ręce wasze pełne są krwi. Obmyjcie się, czyści bądźcie! Usuńcie zło uczynków waszych sprzed moich oczu! Przestańcie czynić zło! Zaprawiajcie się w dobrem! Troszczcie się o sprawiedliwość, wspomagajcie uciśnionego, oddajcie słuszność sierocie, w obronie wdowy stawajcie! Chodźcie i spór ze Mną wiedźcie! - mówi Pan. Choćby wasze grzechy były jak szkarłat, jak śnieg wybieleją; choćby czerwone jak purpura, staną się jak wełna. Jeżeli będziecie ulegli i posłuszni, dóbr ziemskich będziecie zażywać. Ale jeśli się zatniecie w oporze, miecz was wytępi». Albowiem usta Pańskie to wyrzekły. Jakżeż to miasto wierne stało się nierządnicą? Syjon był pełen rozsądku, sprawiedliwość w nim mieszkała, a teraz zabójcy! Twe srebro żużlem się stało, wino twoje z wodą zmieszane. Twoi książęta zbuntowani, wspólnicy złodziei; wszyscy lubią podarki, gonią za wynagrodzeniem. Nie oddają sprawiedliwości sierocie, sprawa wdowy nie dociera do nich. Przeto taka jest wyrocznia Pana, Boga Zastępów, Wszechwładcy Izraela; «Ach! uraduję się kosztem moich wrogów, pomszczę się na mych nieprzyjaciołach. Obrócę rękę moją na ciebie, wypalę do czysta twą rudę i usunę cały twój ołów. Przywrócę twoich sędziów jak dawniej, i twoich radnych jak na początku. Wówczas cię nazwą: Miastem Sprawiedliwości, Grodem Wiernym». Syjon okupi się poszanowaniem prawa, a jego nawróceni sprawiedliwością. Buntownicy zaś i grzesznicy razem będą starci, a odstępujący od Pana wyginą. Zaiste, wstyd wam będzie z powodu terebintów, któreście umiłowali, zarumienicie się wobec gajów, któreście obrali sobie. Bo będziecie jak terebint ze zwiędłym listowiem i jak ogród, w którym nie ma wody. I stanie się mocarz podpałką, a dzieło jego iskrą. Zapłoną razem oboje, a nikt nie ugasi.",
        keyTerm: "Chazon Jeszajahu / Kedosz Jisrael (Święty Izraela) · Lama-li row-ziwchejchem (Krytyka formalizmu kultycznego bez miłosierdzia) · Im-jihju chataejchem ka-szanim ka-szeleg jalbinu (Choćby grzechy były jak szkarłat, nad śnieg wybieleją)",
      },
    ],
    commentary: {
      summary:
        'Pierwszy rozdział Księgi Izajasza otwiera 12. etap naszego planu czytania (Księgi Prorockie). Stanowi on wielką uwerturę do wszystkich 66 rozdziałów Izajasza: Bóg wytacza proces przymierza (hebr. Riw) przeciwko powierzchownej religijności pozbawionej troski o wdowy, sieroty i uciśnionych, obiecując jednocześnie cud przebaczenia: „Choćby wasze grzechy były jak szkarłat, nad śnieg wybieleją” (Iz 1,18).',
      exegesis:
        'Rozdział otwiera kosmiczne wezwanie świadków przymierza – niebios i ziemi (nawiązanie do Pieśni Mojżesza z Pwt 32,1). Werset Iz 1,3 („Wół rozpoznaje swego pana i osioł żłób swego właściciela”) stał się w tradycji chrześcijańskiej inspiracją do umieszczania wołu i osła przy żłóbku Jezusa w Betlejem! Bóg odrzuca kult świątynny oderwany od sprawiedliwości społecznej (w. 11–17), wzywając do obmycia serca i obrony najsłabszych.',
      linguistics: [
        {
          original: 'קְדוֹשׁ יִשְׂרָאֵל / יְהוָה צְבָאוֹת',
          transliteration: 'Kedosz Jisrael / JHWH Cewaot',
          language: 'hebrajski',
          meaning: 'Święty Izraela / Pan Zastępów (Iz 1,4.9)',
          theologicalContext: 'Tytuł „Święty Izraela” (Kedosz Jisrael), wynikający z wizji powołania Izajasza w Świątyni (Iz 6,3: „Święty, Święty, Święty”), jest znakiem rozpoznawczym całej Księgi Izajasza.',
        },
        {
          original: 'אִם־יִהְיוּ חֲטָאֵיכֶם כַּשָּׁנִים כַּשֶּׁלֶג יַלְבִּינוּ',
          transliteration: 'Im-jihju chataejchem ka-szanim ka-szeleg jalbinu',
          language: 'hebrajski',
          meaning: 'Choćby grzechy wasze były jak szkarłat, jak śnieg wybieleją (Iz 1,18)',
          theologicalContext: 'Szkarłat („szani”) i karmazyn („tola”) były najtrwalszymi starożytnymi barwnikami tkanin, których żaden ług nie potrafił sprać; tylko łaska Boża potrafi przemienić je w nieskazitelną biel śniegu.',
        },
        {
          original: 'שְׁאַר / שָׂרִיד',
          transliteration: 'Szear / Sarid',
          language: 'hebrajski',
          meaning: 'Ocalała Reszta (Iz 1,9)',
          theologicalContext: 'Wprowadzenie fundamentalnej dla Izajasza teologii „Świętej Reszty” (cytowanej przez św. Pawła w Rz 9,29).',
        },
        {
          original: 'Cognovit bos possessorem suum, et asinus praesepe domini sui',
          transliteration: 'Cognovit bos possessorem suum, et asinus praesepe domini sui',
          language: 'łaciński',
          meaning: 'Poznał wół pana swego i osioł żłób właściciela swego (Wulgata Iz 1,3)',
          theologicalContext: 'Tekst czytany w liturgii Bożego Narodzenia, ukazujący, że w żłóbku betlejemskim stworzenie rozpoznało swego Stwórcę.',
        },
      ],
      geopolitics: {
        powers: 'Imperium Nowoasyryjskie (Tiglath-Pileser III, Sargon II, Sennacheryb w 701 r. p.n.e.) oraz Królestwo Judy za czterech królów: Ozjasza, Joatama, Achaza i Ezechiasza',
        historicalBackground: 'Werset Iz 1,7–8 („Kraj wasz opustoszał, miasta wasze spalone ogniem, a córa Syjonu pozostała jak szałas w winnicy”) opisuje dramatyczny moment najazdu króla Asyrii Sennacheryba w 701 r. p.n.e., kiedy wojska asyryjskie zdobyły 46 obwarowanych miast Judy (w tym Lakisz), a ocalała jedynie oblężona Jerozolima.',
      },
      history: {
        chronology: 'Posługa Izajasza w Jerozolimie w latach 740–700 p.n.e.',
        eventsAndArcheology: 'W 1947 r. w Grocie 1 w Qumran odkryto Wielki Zwój Izajasza (1QIsa-a) z II w. p.n.e., zachowany w całości od rozdziału 1 do 66 na długości 7,34 metra! Ponadto w 2018 r. na wzgórzu Ofel w Jerozolimie archeolodzy pod kierunkiem dr Eilat Mazar odkryli glinianą bullę (odcisk pieczęci) z napisem „Należąca do Izajasza proroka” tuż obok bulli króla Ezechiasza!',
      },
      geography: {
        locations: ['Jerozolima (Córa Syjonu)', 'Winnice i ogrody wokół Jerozolimy', 'Dolina Dolnego Miasta'],
        description: 'Obraz „szałasu strażnika w winnicy” (sukka be-cherem w Iz 1,8) odnosi się do samotnych kamiennych wieżyczek strażniczych wznoszących się pośród opustoszałych wzgórz judzkich po przejściu armii asyryjskiej.',
      },
      faunaFlora: {
        species: ['Wół i osioł domowy', 'Czerwiec kermesowy (Tolaat szani – źródło barwnika szkarłatnego)', 'Winorośl i pole ogórków (Miksza)'],
        significance: 'Barwnik szkarłatny pozyskiwano z wysuszonych samic owada kermesowego żyjącego na dębach skalnych w Lewancie.',
      },
      cultureAndCustoms: {
        topics: ['Sądowy proces przymierza (Riw)', 'Ochrona prawna triady: sierota (Jatom), wdowa (Almana) i uciśniony'],
        description: 'W prawodawstwie biblijnym miarą autentyczności kultu Bożego jest sprawiedliwe traktowanie osób pozbawionych męskiego opiekuna prawnego – wdów i sierot.',
      },
      apocryphaLinks: 'Apokryficzne „Wniebowstąpienie i Męczeństwo Izajasza” oraz List św. Klemensa Rzymskiego (1 Klem 8,4) obficie cytują wezwanie do pokuty z Iz 1,16–20.',
    },
  },
};

export function isCuratedChapter(bookId: string, chapterNumber: number): boolean {
  return Boolean(CURATED_CHAPTERS[`${bookId}-${chapterNumber}`]);
}

export function getChapterData(bookId: string, chapterNumber: number): ChapterData {
  const key = `${bookId}-${chapterNumber}`;
  const book = BOOK_MAP[bookId] || BOOK_MAP['MAT'];

  if (CURATED_CHAPTERS[key]) {
    const curated = CURATED_CHAPTERS[key];
    return {
      bookId: book.id,
      bookName: book.name,
      chapterNumber,
      title: curated.title,
      verses: curated.verses,
      commentary: {
        ...curated.commentary,
        blocks: buildCommentaryBlocks(book.name, chapterNumber, curated.commentary),
      },
    };
  }

  const isOT = book.testament === 'ST';
  const isNT = book.testament === 'NT';

  const chapterThemesByCategory: Record<string, string[]> = {
    Ewangelie: [
      'Objawienie Królestwa Bożego w słowach i znakach Jezusa Mesjasza',
      'Wezwanie do uczniostwa, miłosierdzia i wiary uzdrawiającej',
      'Tajemnica Paschy Chrystusa: od nauczania w Galilei ku Jerozolimie',
      'Światłość Ewangelii przemieniająca ludzkie serca',
    ],
    Dzieje: [
      'Moc Ducha Świętego prowadząca Kościół aż po krańce ziemi',
      'Świadectwo Apostołów wobec synagogi i świata grecko-rzymskiego',
      'Wzrost wspólnoty wierzących w modlitwie i łamaniu chleba',
      'Podróże misyjne i otwarcie bram wiary dla narodów',
    ],
    Tora: [
      'Przymierze Boga z ludem i świętość prawa Bożego',
      'Boża opatrzność prowadząca patriarchów i lud przez pustynię',
      'Porządek kultyczny, czystość serca i sprawiedliwość społeczna',
      'Wierność obietnicy danej Abrahamowi, Izaakowi i Jakubowi',
    ],
    Listy: [
      'Teologia łaski, usprawiedliwienia i życia w Chrystusie',
      'Jedność Kościoła jako Mistycznego Ciała i świątyni Ducha',
      'Wytrwałość w wierze, nadziei i czynnej miłości (Agape)',
      'Mądrość pasterska i ład wspólnot chrześcijańskich',
    ],
    Historyczne: [
      'Dzieje zbawienia w obliczu wierności i prób narodu wybranego',
      'Powołanie przywódców i królów do strzeżenia przymierza',
      'Zmaganie o tożsamość duchową wobec mocarstw ościennych',
      'Ocalenie Boże w godzinie kryzysu narodowego',
    ],
    Apokalipsa: [
      'Liturgia niebieska przed tronem Boga i Baranka',
      'Duchowa walka Kościoła i nadzieja zwycięstwa nad mocami zła',
      'Sąd Boży nad historią i triumf Królestwa światłości',
      'Obietnica Nowego Stworzenia dla tych, którzy zwyciężają',
    ],
    Mądrościowe: [
      'Bojaźń Pańska jako początek prawdziwej mądrości (Chochma)',
      'Modlitwa uwielbienia, lamentacji i niezłomnej ufności',
      'Tajemnica cierpienia sprawiedliwego i ładu stworzenia',
      'Sztuka prawego życia w świetle wieczności',
    ],
    Apokryfy: [
      'Wizje apokaliptyczne, tajemnice niebios i oczekiwanie na Syna Człowieczego',
      'Kalendarz jubileuszowy, przymierze przodków i wierność Prawu',
      'Modlitwa o nadejście Mesjasza z rodu Dawida w dobie próby',
      'Rozważanie nad sprawiedliwością Bożą i losem sprawiedliwych',
    ],
    Prorockie: [
      'Głos proroka wzywający do nawrócenia (Teszuba) i sprawiedliwości',
      'Sąd nad pychą imperiów i ocalenie Reszty Izraela',
      'Zapowiedź Mesjasza i Nowego Przymierza wypisanego w sercach',
      'Wizja chwały Bożej i odnowienia Syjonu',
    ],
    'Starożytne Dzieła': [
      'Tradycja apostolska, porządek moralny i liturgia pierwotnego Kościoła',
      'Świadectwo Ojców Apostolskich, rękopisów z Qumran i kronik starożytnych',
      'Wezwanie do pokuty, jedności i budowania duchowej Wieży Kościoła',
      'Historyczny kontekst Judei, Galilei i rodzącego się chrześcijaństwa',
    ],
  };

  const categoryThemes =
    chapterThemesByCategory[book.category] || chapterThemesByCategory['Ewangelie'];
  const themeSubtitle = categoryThemes[(chapterNumber - 1) % categoryThemes.length];
  const title = `${book.name} – Rozdział ${chapterNumber}: ${themeSubtitle}`;

  const verses: VerseItem[] = [
    {
      number: 1,
      text: `Wczytywanie pełnego tekstu źródłowego 1:1 rozdziału ${chapterNumber} księgi „${book.name}” (${book.shortcut} ${chapterNumber})...`,
      keyTerm: isOT ? 'Dabar JHWH' : isNT ? 'Logos tou Theou' : 'Traditio',
    },
  ];

  const linguistics: LinguisticTerm[] = [
    {
      original: book.hebrewName || 'דְּבַר־יְהוָה וּבְרִיתוֹ',
      transliteration: 'Dabar JHWH / Berit',
      language: 'hebrajski',
      meaning: 'Słowo-Czyn Pana i Przymierze wierności',
      theologicalContext: `W kontekście ${book.name} ${chapterNumber} hebrajski rdzeń wyraża dynamiczną obecność Boga działającego w historii zbawienia.`,
    },
    {
      original: book.aramaicName || 'מַלְכוּתָא דִּשְׁמַיָּא / מֵימְרָא',
      transliteration: 'Malchuta di-szmajja / Memra',
      language: 'aramejski',
      meaning: 'Królestwo Niebios i Słowo Pana (Targum / Peszitta)',
      theologicalContext:
        'Aramejska tradycja synagogalna i wczesnochrześcijańska wydobywa z tego rozdziału żywy głos Boga przemawiającego pośród wspólnoty.',
    },
    {
      original: book.greekName || 'Λόγος καὶ Οἰκονομία',
      transliteration: 'Logos kai Oikonomia',
      language: 'grecki',
      meaning: `Słowo i Boży plan zbawienia w ${book.shortcut} ${chapterNumber}`,
      theologicalContext:
        'Grecka terminologia Koine (Septuaginta i Nowy Testament) łączy semickie dziedzictwo z precyzją pojęciową świata śródziemnomorskiego.',
    },
    {
      original: `${book.latinName} cap. ${chapterNumber} – Veritas et Gratia`,
      transliteration: 'Veritas et Gratia',
      language: 'łaciński',
      meaning: 'Prawda i Łaska w tradycji łacińskiej (Wulgata)',
      theologicalContext:
        'Łacińska egzegeza patrystyczna ukazuje w tym rozdziale jedność sensu historycznego (literalnego) oraz duchowego.',
    },
  ];

  const baseCommentary: Omit<ChapterCommentary, 'blocks'> = {
    summary: `Rozdział ${chapterNumber} księgi „${book.name}” (${book.shortcut} ${chapterNumber}, ${book.stageName}) stanowi ważne ogniwo planu czytania Biblia 365. Główny temat: „${themeSubtitle}”.`,
    exegesis: `W ujęciu egzegetycznym rozdział ${chapterNumber} rozwija przesłanie księgi ${book.name}. Tekst prowadzi czytelnika od opisu konkretnych wydarzeń i pouczeń do odkrycia Bożego zamysłu zbawczego. Kompozycja rozdziału uwypukla wierność Boga (chesed / pistis) oraz odpowiedź człowieka w posłuszeństwie wiary.`,
    linguistics,
    geopolitics: {
      powers: book.geopoliticsSummary,
      historicalBackground: `Tło geopolityczne ${book.shortcut} ${chapterNumber} obejmuje okres: ${book.period}. ${book.geopoliticsSummary} Analiza układu sił politycznych epoki pozwala głębiej zrozumieć wybory duchowe i społeczne przedstawione w tym rozdziale.`,
    },
    history: {
      chronology: book.period,
      eventsAndArcheology: `Świadectwa historyczne i archeologiczne z epoki (${book.period} — rękopisy, inskrypcje, monety, ostraka oraz badania wykopaliskowe w Ziemi Świętej i basenie Morza Śródziemnego) potwierdzają realia kulturowe i topograficzne ${book.shortcut} ${chapterNumber}.`,
    },
    geography: {
      locations: isNT
        ? ['Jerozolima', 'Galilea', 'Szlak Via Maris', 'Basen Morza Śródziemnego']
        : ['Jerozolima (Syjon)', 'Górzysta Judea i Samaria', 'Dolina Jordanu', 'Żyzny Półksiężyc'],
      description: `Topografia regionu (kontrast między żyznymi dolinami, wapiennymi wzgórzami Judei i Galilei a pustynią) nadaje obrazom z ${book.shortcut} ${chapterNumber} wyrazisty wymiar przestrzenny.`,
    },
    faunaFlora: {
      species: [
        'Oliwka europejska (Olea europaea)',
        'Winorośl właściwa (Vitis vinifera)',
        'Figowiec i cedr libański',
        'Owce i pasterstwo bliskowschodnie',
      ],
      significance: `Świat fauny i flory w ${book.shortcut} ${chapterNumber} pełni funkcję teologiczną i dydaktyczną: drzewo oliwne oznacza namaszczenie Ducha, winorośl – troskę Gospodarza o swój lud, a cykle przyrody wskazują na mądrość Stwórcy.`,
    },
    cultureAndCustoms: {
      topics: [
        'Prawo Przymierza i solidarność wspólnoty',
        'Liturgia, modlitwa i pamięć pokoleniowa',
        'Symbolika szat, bram miejskich i gościnności',
      ],
      description: `Zwyczaje starożytnego Bliskiego Wschodu i świata grecko-rzymskiego (świętość gościnności, przysięgi przymierza, rola starszych w bramie miasta i wspólny stół) pozwalają odczytać pełny sens słów i gestów opisanych w tym rozdziale.`,
    },
    apocryphaLinks: `Wątki z ${book.shortcut} ${chapterNumber} korespondują z literaturą międzytestamentalną (1 Księga Henocha, Księga Jubileuszy, Psalmy Salomona, Zwoje z Qumran) oraz z pismami Ojców Apostolskich (Didache, Klemens Rzymski, Ignacy Antiocheński, Pasterz Hermasa) i kronikami Józefa Flawiusza.`,
  };

  return {
    bookId: book.id,
    bookName: book.name,
    chapterNumber,
    title,
    verses,
    commentary: {
      ...baseCommentary,
      blocks: buildCommentaryBlocks(book.name, chapterNumber, baseCommentary),
    },
  };
}
