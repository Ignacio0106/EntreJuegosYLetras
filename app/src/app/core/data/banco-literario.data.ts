import {
  Adivinanza, Afirmacion, Aventura, Autor, Dados, FraseConErrores, Historia, Leyenda, Libro,
  Lectura, LecturaConPreguntas, PalabraTica, Personaje, Pregunta, Refran, Rima, Sabia, Silaba,
  Trabalengua,
} from '../models/banco.model';

/**
 * BANCO LITERARIO - Literatura costarricense (datos dentro del código, sin base de datos).
 * Para agregar contenido basta con añadir objetos a estas listas.
 * Nivel: 'N' = niñas/niños · 'M' = personas adultas mayores · 'T' = para todos
 */
/* ============================================================
   BANCO LITERARIO - Literatura costarricense
   Nivel: 'N' = niñas/niños · 'M' = personas adultas mayores · 'T' = para todos
   ============================================================ */

export const LIBROS: Libro[] = [
  { t: "Los Cuentos de mi Tía Panchita", a: "Carmen Lyra", y: 1920, n: "N",
    s: "La tía Panchita reúne a la familia para contar cuentos de animales: un conejito muy astuto, un coyote hambriento y otras aventuras del campo." },
  { t: "Cocorí", a: "Joaquín Gutiérrez", y: 1947, n: "N",
    s: "Un niño del Caribe costarricense persigue a una reina de las tortugas para pedirle que el tiempo no pase tan rápido." },
  { t: "Marcos Ramírez", a: "Carlos Luis Fallas (Calufa)", y: 1952, n: "T",
    s: "Un muchacho pobre y travieso cuenta sus aventuras en la Costa Rica de hace un siglo." },
  { t: "Mamita Yunai", a: "Carlos Luis Fallas (Calufa)", y: 1941, n: "M",
    s: "La historia de los trabajadores de la compañía bananera en el sur del país." },
  { t: "Concherías", a: "Aquileo J. Echeverría", y: 1909, n: "T",
    s: "Versos llenos de gracia que retratan al campesino costarricense con su manera sabrosa de hablar." },
  { t: "El sitio de las abras", a: "Fabián Dobles", y: 1950, n: "M",
    s: "Campesinos que pelean por la tierra en un valle de Costa Rica." },
  { t: "El infierno verde", a: "José Marín Cañas", y: 1935, n: "M",
    s: "La cruda historia de una guerra en la selva del Chaco, entre Bolivia y Paraguay." },
  { t: "Juan Varela", a: "Adela Ferreto", y: 1965, n: "N",
    s: "Un niño soldado acompaña a los héroes de la Campaña Nacional de 1856 contra los filibusteros." },
  { t: "La Loca de Gandoca", a: "Anacristina Rossi", y: 1991, n: "M",
    s: "Una mujer lee cuentos a los niños y lucha por defender un refugio de tortugas en el Caribe." },
  { t: "Las cosas que guardo en mi corazón", a: "Lara Ríos", y: 1994, n: "N",
    s: "Una niña guarda los recuerdos bien bonitos en su corazón, igual que muchas abuelitas guardan sus cajitas." },
  { t: "La ruta de su evasión", a: "Yolanda Oreamuno", y: 1949, n: "M",
    s: "Una novela valiente sobre la vida interior de una mujer. Una obra maestra de nuestras letras." },
  { t: "El moto", a: "Joaquín García Monge", y: 1900, n: "N",
    s: "Un muchacho huérfano y su caballo recorren la Costa Rica de hace más de un siglo. Es la primera novela tica." },
  { t: "La propia y otras estampas", a: "Manuel González Zeledón (Magón)", y: 1890, n: "M",
    s: "Cuadros llenos de humor y cariño que retratan la vida diaria del pueblo costarricense de antaño." },
  { t: "Cuentos ticos", a: "Ricardo Fernández Guardia", y: 1901, n: "M",
    s: "Relatos que mezclan el misterio, la tradición y el paisaje de nuestro país." },
  { t: "La isla de los hombres solos", a: "José León Sánchez", y: 1964, n: "M",
    s: "La dura vida de los presos en la isla del penal de San Lucas, contada por alguien que la vivió." },
  { t: "Única mirando al mar", a: "Fernando Contreras Castro", y: 1994, n: "M",
    s: "Una mujer que recoge lo que otros botan en el basurero nos enseña a mirar el mundo con otros ojos." },
  { t: "Diario de una multitud", a: "Carmen Naranjo", y: 1974, n: "M",
    s: "Muchas voces que, juntas, forman una sola ciudad: San José." },
  { t: "Asalto al paraíso", a: "Tatiana Lobo", y: 1992, n: "M",
    s: "Novela histórica sobre la colonia, el comercio y la gente que vivió en Costa Rica en el siglo XVIII." },
  { t: "Cuentos viejos", a: "Adela Ferreto", y: 1942, n: "N",
    s: "Cuentos sencillos y llenos de imaginación, escritos con cariño para las niñas y los niños." }
];

export const PERSONAJES: Personaje[] = [
  { n: "El Tío Conejo", l: "Cuentos de mi tía Panchita", nivel: "T",
    p: [
      "Es un animalito pequeño con orejas largas.",
      "Vive en los cuentos que la tía Panchita les contaba a las sobrinas y sobrinos.",
      "Siempre se las ingenia para ganarle las apuestas a otro animal mucho más grande.",
      "Compite contra el Tío Coyote y gana con pura astucia."
    ] },
  { n: "El Tío Coyote", l: "Cuentos de mi tía Panchita", nivel: "T",
    p: [
      "Es grande, peludo y siempre anda con hambre.",
      "Es el rival de un conejito muy mañoso.",
      "Aúlla a la luna durante la noche.",
      "A pesar de ser más fuerte, siempre termina engañado por el Tío Conejo."
    ] },
  { n: "Cocorí", l: "Cocorí", nivel: "T",
    p: [
      "Es un niño con mucha curiosidad.",
      "Vive cerca del mar, en la provincia de Limón.",
      "Quiere que el tiempo no pase tan rápido.",
      "Es el protagonista de la novela de Joaquín Gutiérrez."
    ] },
  { n: "Doña Modorra", l: "Cocorí", nivel: "T",
    p: [
      "No es una persona: es viejísima y muy grande.",
      "Es la reina de su especie.",
      "Vive en el mar y se lleva a Cocorí de paseo.",
      "Es la tortuga gigante de la novela Cocorí."
    ] },
  { n: "Marcos Ramírez", l: "Marcos Ramírez", nivel: "T",
    p: [
      "Es un muchacho pobre y bien travieso.",
      "Su historia pasa en Costa Rica hace unos cien años.",
      "Cuenta sus aventuras en primera persona, como si fuera una novela.",
      "El autor de su novela es conocido como Calufa."
    ] },
  { n: "Leguizamo", l: "Marcos Ramírez", nivel: "T",
    p: [
      "Es un abuelito muy sabio que aparece en una novela.",
      "Cuenta muchos cuentos y consejos.",
      "El muchacho protagonista lo quiere mucho.",
      "Es el abuelo sabio de Marcos Ramírez."
    ] },
  { n: "Juan Varela", l: "Juan Varela", nivel: "N",
    p: [
      "Es un niño que sueña con ser soldado.",
      "Parte a la guerra muy joven.",
      "Pelea en la Campaña Nacional de 1856.",
      "Es el héroe de la novela de Adela Ferreto."
    ] },
  { n: "La abuela de los cuentos", l: "Los Cuentos de mi Tía Panchita", nivel: "T",
    p: [
      "Es una señora mayor que adora contar historias.",
      "Se reúne con su familia para contarlas.",
      "Conoce los cuentos de los animalitos del monte.",
      "Nadie sabe su nombre completo, pero a ella le dicen Tía..."
    ] },
  { n: "La Cucarachita Mandinga", l: "Cuentos de mi tía Panchita", nivel: "T",
    p: [
      "Es un insecto pequeñito y muy limpio.",
      "Barría y cocinaba con mucho esmero.",
      "Se arregló bonito para buscar con quién casarse.",
      "Es la cucarachita de un cuento de Carmen Lyra."
    ] },
  { n: "El Moto", l: "El moto", nivel: "T",
    p: [
      "Es un muchacho huérfano de la Costa Rica de 1900.",
      "Es pobre y anda de un lugar a otro buscando trabajo.",
      "Su mejor compañía es un caballo.",
      "Es el protagonista de la primera novela costarricense."
    ] }
];

export const LEYENDAS: Leyenda[] = [
  { n: "La Segua", nivel: "N",
    p: [
      "Aparece de noche, en los caminos.",
      "Asusta a los hombres que andan de parranda.",
      "Lleva un chal negro y tiene cara de caballo.",
      "Es una de las leyendas más famosas de Cartago."
    ] },
  { n: "El Cadejos", nivel: "N",
    p: [
      "Es un animal grande y peludo.",
      "Camina de noche por los caminos solos.",
      "Tiene ojos que brillan de noche.",
      "Según la leyenda, unos lo ven como protector del caminante."
    ] },
  { n: "El Padre sin Cabeza", nivel: "T",
    p: [
      "Viste de negro, como un sacerdote.",
      "Aparece siempre de noche.",
      "Se le ve caminando cerca de las iglesias.",
      "Le falta la cabeza por un descuido... por eso se llama así."
    ] },
  { n: "La Llorona", nivel: "T",
    p: [
      "Llora durante toda la noche.",
      "Anda buscando a su hijo.",
      "Se le ve cerca de los ríos y quebradas.",
      "Su llanto le dio el nombre con que todos la conocen."
    ] },
  { n: "La Carreta sin Bueyes", nivel: "T",
    p: [
      "Se escuchan cadenas y quejidos de noche.",
      "Es un vehículo que anda solo.",
      "Pasa por los caminos de tierra de Cartago.",
      "Dicen que la maneja un hombre que hizo maldades en vida."
    ] },
  { n: "El Mico Malo", nivel: "N",
    p: [
      "Vive en los árboles del monte.",
      "Asusta a los que se duermen solos en el campo.",
      "Le gusta hacer ruido entre las ramas.",
      "Es un mono travieso de las leyendas de los campesinos."
    ] },
  { n: "El Duende", nivel: "N",
    p: [
      "Es pequeñito y usa un sombrerote enorme.",
      "Vive entre los cafetales y el monte.",
      "Le gusta esconder objetos y trenzar las crines de los caballos.",
      "Es el travieso duende de las leyendas campesinas."
    ] },
  { n: "La Tule Vieja", nivel: "M",
    p: [
      "Es una mujer muy, muy vieja.",
      "Se aparece cerca de los ríos y las quebradas.",
      "Lleva una batea y una piedra de moler.",
      "Según la leyenda, se lleva a los niños desobedientes."
    ] },
  { n: "El Pisuicas", nivel: "M",
    p: [
      "Tiene cuernos, cola y patas de chivo.",
      "Aparece a quien le vende su alma.",
      "Ofrece dinero y favores a cambio de pactos.",
      "Es la manera en que los campesinos nombran al diablo."
    ] }
];

export const AUTORES: Autor[] = [
  { n: "Carmen Lyra", nivel: "N", o: ["Los Cuentos de mi Tía Panchita"],
    p: [
      "Fue maestra de escuela.",
      "Se llamaba María Isabel Carvajal.",
      "Fundó el programa de niños y niñas 'La Granja Escuela'.",
      "Escribió los cuentos de la Tía Panchita."
    ] },
  { n: "Joaquín Gutiérrez", nivel: "N", o: ["Cocorí"],
    p: [
      "Se dedicó a la literatura infantil.",
      "Su obra más famosa pasa en el Caribe.",
      "También fue ajedrecista.",
      "Escribió 'Cocorí'."
    ] },
  { n: "Carlos Luis Fallas (Calufa)", nivel: "T", o: ["Marcos Ramírez", "Mamita Yunai"],
    p: [
      "Fue zapatero y trabajador.",
      "Su novela más conocida cuenta la vida de un muchacho travieso.",
      "Se le conoce por su apodo cortito.",
      "Escribió 'Marcos Ramírez' y 'Mamita Yunai'."
    ] },
  { n: "Aquileo J. Echeverría", nivel: "T", o: ["Concherías"],
    p: [
      "Fue periodista y poeta.",
      "Le gustaba escribir como hablaba el campesino.",
      "Sus poemas tienen mucha gracia y malicia.",
      "Escribió 'Concherías'."
    ] },
  { n: "Fabián Dobles", nivel: "M", o: ["El sitio de las abras"],
    p: [
      "Nació en la provincia de Alajuela.",
      "Defendió al campesino en sus libros.",
      "Sus historias hablan de la tierra.",
      "Escribió 'El sitio de las abras'."
    ] },
  { n: "Adela Ferreto", nivel: "N", o: ["Juan Varela"],
    p: [
      "Era maestra y es muy querida.",
      "Escribió cuentos para niñas y niños.",
      "Su novela habla de un soldadito de 1856.",
      "Escribió 'Juan Varela'."
    ] },
  { n: "Lara Ríos", nivel: "N", o: ["Las cosas que guardo en mi corazón"],
    p: [
      "Cuenta historias de abuelas y nietos.",
      "Le gusta escribir para la niñez.",
      "Sus cuentos calientan el corazón.",
      "Escribió 'Las cosas que guardo en mi corazón'."
    ] },
  { n: "Yolanda Oreamuno", nivel: "M", o: ["La ruta de su evasión"],
    p: [
      "Es una gran escritora costarricense.",
      "Su pluma fue valiente y muy moderna para su época.",
      "Escribió sobre la vida interior de las mujeres.",
      "Su obra maestra es 'La ruta de su evasión'."
    ] },
  { n: "Anacristina Rossi", nivel: "M", o: ["La Loca de Gandoca"],
    p: [
      "Es una escritora costarricense muy leída.",
      "Le preocupa la naturaleza y el Caribe del país.",
      "Su novela defiende un refugio de tortugas.",
      "Escribió 'La Loca de Gandoca'."
    ] },
  { n: "José Marín Cañas", nivel: "M", o: ["El infierno verde"],
    p: [
      "Fue periodista y escritor.",
      "Escribió sobre una guerra lejana en la selva.",
      "Su novela más famosa es muy dura y realista.",
      "Escribió 'El infierno verde'."
    ] },
  { n: "Joaquín García Monge", nivel: "N", o: ["El moto"],
    p: [
      "Fue escritor y educador.",
      "Publicó la primera novela costarricense.",
      "También fundó una famosa revista literaria.",
      "Escribió 'El moto'."
    ] },
  { n: "Manuel González Zeledón (Magón)", nivel: "M", o: ["La propia y otras estampas"],
    p: [
      "Firmaba sus escritos con un apodo cortito.",
      "Retrató con humor la vida del pueblo.",
      "Sus relatos son cuadros de costumbres.",
      "Se le conoce como Magón."
    ] },
  { n: "Ricardo Fernández Guardia", nivel: "M", o: ["Cuentos ticos"],
    p: [
      "Fue historiador y diplomático.",
      "Reunió relatos de misterio y tradición.",
      "Sus cuentos muestran el paisaje nacional.",
      "Escribió 'Cuentos ticos'."
    ] },
  { n: "José León Sánchez", nivel: "M", o: ["La isla de los hombres solos"],
    p: [
      "Nació en Costa Rica y vivió en un penal.",
      "Contó esa dura experiencia en un libro.",
      "Su novela se hizo famosa en todo el mundo.",
      "Escribió 'La isla de los hombres solos'."
    ] },
  { n: "Fernando Contreras Castro", nivel: "M", o: ["Única mirando al mar"],
    p: [
      "Es un escritor costarricense contemporáneo.",
      "Sus historias hablan de gente olvidada.",
      "Su novela pasa en un basurero.",
      "Escribió 'Única mirando al mar'."
    ] },
  { n: "Carmen Naranjo", nivel: "M", o: ["Diario de una multitud"],
    p: [
      "Fue escritora y también diplomática.",
      "Le interesaba la vida de la ciudad y su gente.",
      "Escribió novelas con muchas voces.",
      "Escribió 'Diario de una multitud'."
    ] },
  { n: "Tatiana Lobo", nivel: "M", o: ["Asalto al paraíso"],
    p: [
      "Nació en Chile y vivió en Costa Rica.",
      "Escribe novelas históricas.",
      "Sus libros rescatan el pasado colonial.",
      "Escribió 'Asalto al paraíso'."
    ] }
];

/* Preguntas de 4 opciones: p = enunciado, o = opciones, r = índice de la correcta */
export const PREGS: Pregunta[] = [
  // ---- Niños ----
  { p: "¿Quién escribió los cuentos de la Tía Panchita?", o: ["Carmen Lyra", "Calufa", "Joaquín Gutiérrez", "Adela Ferreto"], r: 0, nivel: "N", c: "Libros" },
  { p: "En los cuentos de la Tía Panchita, el Tío Coyote siempre:", o: ["le gana al conejo", "termina engañado por el conejo", "no aparece", "vuela por el cielo"], r: 1, nivel: "N", c: "Personajes" },
  { p: "¿En qué provincia vive Cocorí?", o: ["San José", "Cartago", "Limón", "Guanacaste"], r: 2, nivel: "N", c: "Personajes" },
  { p: "¿Qué tipo de animal es Doña Modorra?", o: ["Una gallina", "Una tortuga", "Una iguana", "Una serpiente"], r: 1, nivel: "N", c: "Personajes" },
  { p: "¿Cómo se llama el escritor de 'Cocorí'?", o: ["Aquileo J. Echeverría", "Fabián Dobles", "José Marín Cañas", "Joaquín Gutiérrez"], r: 3, nivel: "N", c: "Autores" },
  { p: "En los cuentos de la Tía Panchita, ¿cuál animal es el más astuto?", o: ["El tigre", "El coyote", "El conejo", "El buey"], r: 2, nivel: "N", c: "Personajes" },
  { p: "'Marcos Ramírez' es un libro que cuenta:", o: ["las aventuras de un niño tico", "una receta de cocina", "la historia de un barco", "un viaje al espacio"], r: 0, nivel: "N", c: "Libros" },
  { p: "¿Quién escribió 'Marcos Ramírez' y 'Mamita Yunai'?", o: ["Calufa", "Carmen Naranjo", "Anacristina Rossi", "Lisímaco Chavarría"], r: 0, nivel: "N", c: "Autores" },
  { p: "'Mamita Yunai' da a conocer el trabajo de:", o: ["los bomberos", "los peones de la bananera", "los astronautas", "los músicos"], r: 1, nivel: "N", c: "Libros" },
  { p: "Las 'Concherías' de Aquileo J. Echeverría son:", o: ["recetas de cocina", "versos del campesino costarricense", "cuentos de navegantes", "novelas policiacas"], r: 1, nivel: "N", c: "Autores" },
  { p: "¿Qué pidió Cocorí para poder conservar su flor?", o: ["dinero", "que el tiempo no pasara tan rápido", "un nuevo sombrero", "que lloviera"], r: 1, nivel: "N", c: "Personajes" },
  { p: "En la novela 'Juan Varela', el niño soldado pelea en:", o: ["la Batalla de Rivas de 1856", "la guerra del 48", "la Segunda Guerra Mundial", "una pelea de escuela"], r: 0, nivel: "N", c: "Libros" },
  { p: "¿Quién escribió 'Juan Varela'?", o: ["Lara Ríos", "Carmen Lyra", "Adela Ferreto", "Yolanda Oreamuno"], r: 2, nivel: "N", c: "Autores" },
  { p: "En el libro de Lara Ríos, la niña guarda sus recuerdos:", o: ["en una caja fuerte", "en el corazón", "en el refrigerador", "en el bolsillo del pantalón"], r: 1, nivel: "N", c: "Libros" },
  { p: "¿Qué hace la Tía Panchita con su familia?", o: ["cocina y siembra", "les cuenta cuentos", "juega al escondite", "ve la televisión"], r: 1, nivel: "N", c: "Personajes" },
  { p: "La leyenda de la Carreta sin Bueyes se cuenta mucho en:", o: ["Cartago", "Puerto Limón", "Talamanca", "La Cruz"], r: 0, nivel: "T", c: "Leyendas" },
  // ---- Adultos mayores ----
  { p: "¿Cuál es el tema principal de 'Mamita Yunai' de Calufa?", o: ["La vida en la ciudad", "Las condiciones de trabajo en la bananera", "Una guerra entre países", "La pesca en el Pacífico"], r: 1, nivel: "M", c: "Libros" },
  { p: "'Yunai' se refiere a la compañía frutera conocida como:", o: ["Coca-Cola", "United Fruit Company", "Banana King", "La Estrella"], r: 1, nivel: "M", c: "Libros" },
  { p: "¿Qué guerra retrata 'El infierno verde' de José Marín Cañas?", o: ["La lucha por la independencia", "La guerra del Chaco entre Bolivia y Paraguay", "La Primera Guerra Mundial", "La guerra civil del 48"], r: 1, nivel: "M", c: "Libros" },
  { p: "'El sitio de las abras' trata sobre:", o: ["paraísos fiscales", "la lucha de los campesinos por la tierra", "una fiesta patronal", "un barco pirata"], r: 1, nivel: "M", c: "Libros" },
  { p: "¿Quién escribió 'El sitio de las abras'?", o: ["Fabián Dobles", "Carmen Lyra", "Adela Ferreto", "Anacristina Rossi"], r: 0, nivel: "M", c: "Autores" },
  { p: "¿De qué trata 'La Loca de Gandoca' de Anacristina Rossi?", o: ["La defensa de un refugio de tortugas", "Una carrera de autos", "Una familia de médicos", "La vida en el campo"], r: 0, nivel: "M", c: "Libros" },
  { p: "La escritora Yolanda Oreamuno es recordada por su novela:", o: ["Los perros no ladraron", "La ruta de su evasión", "Concherías", "Mamita Yunai"], r: 1, nivel: "M", c: "Autores" },
  { p: "'Cocorí' fue publicado en el año:", o: ["1920", "1947", "1915", "1965"], r: 1, nivel: "M", c: "Libros" },
  { p: "¿Cómo se llama la primera escritora costarricense de cuentos para niños, autora de la Tía Panchita?", o: ["Carmen Naranjo", "Carmen Lyra", "Lara Ríos", "Anacristina Rossi"], r: 1, nivel: "M", c: "Autores" },
  { p: "En 'Cocorí', la reina de las tortugas se llama:", o: ["Modorra", "Chelonia", "Carey", "Sofi"], r: 0, nivel: "T", c: "Personajes" },
  { p: "¿Por qué es importante la Campaña Nacional de 1856?", o: ["Expulsó a los filibusteros", "Creó el Banco Central", "Fundó la televisión", "Trajo los caballos"], r: 0, nivel: "M", c: "Historia" },
  { p: "La Segua suele aparecerse en los caminos de:", o: ["Cartago", "Puerto Viejo", "La Fortuna", "Parrita"], r: 0, nivel: "T", c: "Leyendas" },
  { p: "Las 'Concherías' son:", o: ["poemas costumbristas sobre el campesino", "novelas históricas", "cartas del presidente", "refranes de mar"], r: 0, nivel: "M", c: "Libros" },
  { p: "¿Quién era William Walker en la historia de Costa Rica?", o: ["Un botánico", "Un filibustero que invadió Centroamérica", "El primer presidente", "Un poeta nicaragüense"], r: 1, nivel: "M", c: "Historia" },
  { p: "El término 'concheros' en las Concherías se refiere a:", o: ["peones alegres y fiesteros", "marinos", "médicos", "vendedores"], r: 0, nivel: "M", c: "Libros" },
  { p: "¿Qué nos enseña principalmente la literatura costarricense?", o: ["el idioma japonés", "nuestra historia, costumbres y forma de ser", "matemática avanzada", "a navegar en barcos"], r: 1, nivel: "T", c: "Cultura" },
  // ---- Niños (nuevas) ----
  { p: "¿Quién escribió la novela 'El moto'?", o: ["Joaquín García Monge", "Calufa", "Carmen Naranjo", "Tatiana Lobo"], r: 0, nivel: "N", c: "Autores" },
  { p: "¿Cuál era la compañía inseparable de 'El Moto'?", o: ["un perro", "un caballo", "un loro", "una tortuga"], r: 1, nivel: "N", c: "Personajes" },
  { p: "'El moto' es considerada la primera:", o: ["novela costarricense", "receta tica", "obra de teatro", "canción del país"], r: 0, nivel: "N", c: "Libros" },
  { p: "¿En qué libro aparece La Cucarachita Mandinga?", o: ["Cocorí", "Cuentos de mi tía Panchita", "Mamita Yunai", "El infierno verde"], r: 1, nivel: "N", c: "Libros" },
  { p: "Según la leyenda, el Duende usa:", o: ["un sombrero enorme", "una capa roja", "un bastón de oro", "zapatos de cristal"], r: 0, nivel: "N", c: "Leyendas" },
  { p: "El Duende de las leyendas vive en:", o: ["el mar", "los cafetales y el monte", "las nubes", "la ciudad"], r: 1, nivel: "N", c: "Leyendas" },
  { p: "¿Quién escribió 'Cuentos viejos'?", o: ["Adela Ferreto", "Anacristina Rossi", "Yolanda Oreamuno", "Magón"], r: 0, nivel: "N", c: "Autores" },
  { p: "Manuel González Zeledón es conocido con el apodo de:", o: ["Magón", "Calufa", "Pisuicas", "Conejo"], r: 0, nivel: "N", c: "Autores" },
  { p: "Las historias de Magón hablan sobre todo de:", o: ["la vida diaria y las costumbres", "viajes al espacio", "piratas", "dinosaurios"], r: 0, nivel: "N", c: "Libros" },
  { p: "¿Qué animal protege la protagonista de 'La Loca de Gandoca'?", o: ["tortugas", "ballenas", "perezosos", "mariposas"], r: 0, nivel: "N", c: "Libros" },
  { p: "El refugio del que habla 'La Loca de Gandoca' queda en:", o: ["Limón", "Guanacaste", "Puntarenas", "Heredia"], r: 0, nivel: "N", c: "Libros" },
  { p: "El Tío Conejo le gana a los animales más grandes usando:", o: ["sus dientes", "su astucia", "su velocidad", "su fuerza"], r: 1, nivel: "N", c: "Personajes" },
  { p: "Las leyendas costarricenses sirven para:", o: ["divertir y dar consejos", "enseñar matemática", "vender productos", "hacer deporte"], r: 0, nivel: "N", c: "Leyendas" },
  // ---- Adultos mayores / todos (nuevas) ----
  { p: "'La isla de los hombres solos' trata sobre:", o: ["la vida en un penal en una isla", "una fiesta en la playa", "un viaje de vacaciones", "una escuela rural"], r: 0, nivel: "M", c: "Libros" },
  { p: "¿Quién escribió 'La isla de los hombres solos'?", o: ["José León Sánchez", "Fabián Dobles", "Joaquín Gutiérrez", "Lara Ríos"], r: 0, nivel: "M", c: "Autores" },
  { p: "'Única mirando al mar' se desarrolla principalmente en:", o: ["un basurero", "un palacio", "un aeropuerto", "un barco"], r: 0, nivel: "M", c: "Libros" },
  { p: "¿Quién escribió 'Única mirando al mar'?", o: ["Fernando Contreras Castro", "Carlos Luis Fallas", "Ricardo Fernández Guardia", "Adela Ferreto"], r: 0, nivel: "M", c: "Autores" },
  { p: "'Diario de una multitud' es una novela de:", o: ["Carmen Naranjo", "Anacristina Rossi", "Carmen Lyra", "Tatiana Lobo"], r: 0, nivel: "M", c: "Autores" },
  { p: "¿Qué autora escribió 'Asalto al paraíso'?", o: ["Tatiana Lobo", "Yolanda Oreamuno", "Carmen Lyra", "Adela Ferreto"], r: 0, nivel: "M", c: "Autores" },
  { p: "'Asalto al paraíso' es una novela de tipo:", o: ["histórica", "de ciencia ficción", "policiaca", "infantil"], r: 0, nivel: "M", c: "Libros" },
  { p: "'Cuentos ticos' fue escrito por:", o: ["Ricardo Fernández Guardia", "Joaquín García Monge", "Magón", "José León Sánchez"], r: 0, nivel: "M", c: "Autores" },
  { p: "¿Quién escribió 'El infierno verde'?", o: ["José Marín Cañas", "Fabián Dobles", "Ricardo Fernández Guardia", "Carmen Naranjo"], r: 0, nivel: "M", c: "Autores" },
  { p: "El 'costumbrismo' es un estilo que retrata:", o: ["las costumbres y la vida diaria", "los viajes espaciales", "la vida de los reyes", "los deportes extremos"], r: 0, nivel: "M", c: "Cultura" },
  { p: "La leyenda de la Tule Vieja se aparece cerca de:", o: ["los ríos y quebradas", "las montañas nevadas", "los aeropuertos", "las playas del Pacífico"], r: 0, nivel: "M", c: "Leyendas" },
  { p: "Según la leyenda, ¿qué lleva consigo la Tule Vieja?", o: ["una batea y una piedra de moler", "un paraguas", "una lámpara", "un espejo"], r: 0, nivel: "M", c: "Leyendas" },
  { p: "¿Cómo llaman los campesinos costarricenses al diablo en las leyendas?", o: ["El Pisuicas", "El Duende", "El Cadejos", "El Mico"], r: 0, nivel: "M", c: "Leyendas" },
  { p: "El Padre sin Cabeza se aparece principalmente:", o: ["de noche, cerca de las iglesias", "al mediodía en la playa", "en los mercados", "en el estadio"], r: 0, nivel: "M", c: "Leyendas" },
  { p: "La Campaña Nacional de 1856 fue contra:", o: ["los filibusteros de William Walker", "los piratas del Caribe", "el ejército español", "los bananeros"], r: 0, nivel: "M", c: "Historia" },
  { p: "El héroe costarricense que murió quemando el mesón en 1856 fue:", o: ["Juan Santamaría", "Juan Varela", "William Walker", "El Moto"], r: 0, nivel: "M", c: "Historia" },
  { p: "El 'concherío' en las Concherías representa al:", o: ["campesino alegre y fiestero", "soldado de la guerra", "estudiante de colegio", "comerciante de la capital"], r: 0, nivel: "M", c: "Cultura" },
  { p: "La letra del Himno Nacional de Costa Rica fue escrita por:", o: ["José María Zeledón", "Aquileo J. Echeverría", "Carmen Lyra", "Joaquín Gutiérrez"], r: 0, nivel: "M", c: "Cultura" },
  { p: "La música del Himno Nacional fue compuesta por:", o: ["Manuel María Gutiérrez", "Rafael Chaves", "Fabián Dobles", "Adela Ferreto"], r: 0, nivel: "M", c: "Cultura" },
  { p: "La marimba es un instrumento muy ligado a la música:", o: ["costarricense y centroamericana", "europea", "asiática", "africana del norte"], r: 0, nivel: "T", c: "Cultura" },
  { p: "El 'Corrido' y el 'Punto guanacasteco' son ejemplos de:", o: ["música y baile típicos", "comidas", "leyendas", "novelas"], r: 0, nivel: "M", c: "Cultura" },
  { p: "La 'Cimarrona' es la encargada de poner la música en:", o: ["las fiestas populares", "las iglesias", "las escuelas", "los hospitales"], r: 0, nivel: "M", c: "Cultura" }
];

export const ADIVINANZAS: Adivinanza[] = [
  { q: "Oro parece, plata no es, y el que no lo adivine es un burro de a tres.", a: "El plátano", nivel: "N" },
  { q: "Verde como el campo, campo no es; habla como el hombre, hombre no es.", a: "El loro", nivel: "N" },
  { q: "En lo alto vive, en lo alto mora, en lo alto teje la tejedora.", a: "La araña", nivel: "N" },
  { q: "Blanca por dentro, verde por fuera; si quieres que te lo diga, espera.", a: "La pera", nivel: "N" },
  { q: "Tiene barba y no es viejo, tiene dientes y no come.", a: "El elote (maíz)", nivel: "N" },
  { q: "Vuela sin alas, silba y no tiene boca; corre sin pies, y hasta la cara te toca.", a: "El viento", nivel: "N" },
  { q: "Todos me pisan a mí, pero yo no piso a nadie; todos preguntan por mí, y yo no pregunto por nadie.", a: "La calle", nivel: "M" },
  { q: "Blanca soy, del agua nací; si lloran por mí, llorando me ven consumir.", a: "La sal", nivel: "M" },
  { q: "Con palitos me golpean, con maderas me hacen sonar; me bailan en las fiestas y hago al tico alegrar.", a: "La marimba", nivel: "M" },
  { q: "Un viejito respingado, panza arriba y panza abajo, tiene un sombrerito y anda con bastón.", a: "El chayote", nivel: "M" },
  { q: "Chiquita como un ratón, cuida la casa como un león.", a: "La chapa (cerradura)", nivel: "M" },
  { q: "Soy redonda, soy de vidrio, y si te miras en mí, tu cara puedes repetir.", a: "El espejo", nivel: "N" },
  { q: "Agua pasa por mi casa, cate de mi corazón; el que no me lo adivine es un burro cabezón.", a: "El aguacate", nivel: "N" },
  { q: "Tiene ojos y no ve, tiene agua y no la bebe, tiene carne y no la come, tiene barba y no es hombre.", a: "El coco", nivel: "N" },
  { q: "Fui al mercado, compré un negrito; cuando llegué a la casa se puso coloradito.", a: "El carbón", nivel: "M" },
  { q: "Salta y salta por los caminos, y la colita le va siguiendo.", a: "La rana", nivel: "N" },
  { q: "Tengo cabeza redonda, sin nariz, ojos ni frente, y mi cuerpo se compone tan sólo de pan caliente.", a: "El pan", nivel: "N" },
  { q: "Entre más grande es, menos se ve. ¿Qué es?", a: "La oscuridad", nivel: "M" },
  { q: "Verde nací, verde crecí, y en la mesa terminé. ¿Qué soy?", a: "El aguacate / el chayote", nivel: "N" },
  { q: "¿Cuál es el animal que tiene su casa encima y camina con ella?", a: "El caracol / la tortuga", nivel: "N" },
  { q: "Por la mañana tiene cuatro patas, al mediodía dos y por la noche tres. ¿Quién es?", a: "El ser humano", nivel: "M" },
  { q: "Chiquito, redondo y negro; por dentro blanco y por fuera duro. ¿Qué es?", a: "El huevo", nivel: "N" },
  { q: "Redondo como un queso, sin puerta ni ventana, y adentro mucha gente. ¿Qué es?", a: "El teatro", nivel: "M" }
];

export const TRABALENGUAS: Trabalengua[] = [
  { t: "Tres tristes tigres comen trigo en un trigal.", nivel: "N" },
  { t: "Pablito clavó un clavito, qué clavito clavó Pablito.", nivel: "N" },
  { t: "Pepe Pecas pica papas con un pico, con un pico pica papas Pepe Pecas.", nivel: "N" },
  { t: "Compadre, cómprame un coco; compadre, coco no compro, porque el que poco coco come, poco coco compra.", nivel: "N" },
  { t: "Erre con erre cigarro, erre con erre barril; rápido corren los carros cargados de azúcar al ferrocarril.", nivel: "N" },
  { t: "El cielo está enladrillado, quien lo desenladrillará; el desenladrillador que lo desenladrille, buen desenladrillador será.", nivel: "M" },
  { t: "Pancha plancha con cuatro planchas, con cuatro planchas plancha Pancha.", nivel: "N" },
  { t: "Si sierra una sierra y otra sierra sierra, la sierra que sierra corta toda la sierra que sierra otra sierra.", nivel: "M" },
  { t: "El perro de San Roque no tiene rabo, porque Ramón Ramírez se lo ha cortado.", nivel: "N" },
  { t: "Cuando cuentes cuentos, cuenta cuántos cuentos cuentas, porque si no cuentas cuántos cuentos cuentas, nunca sabrás cuántos cuentos cuentas.", nivel: "M" },
  { t: "María Chucena techaba su choza, y un techador que por allí pasaba le dijo: María Chucena, ¿techas tu choza o techas la ajena?", nivel: "M" }
];

export const REFRANES: Refran[] = [
  { i: "Más vale tarde que...", f: "nunca", nivel: "N" },
  { i: "El que madruga...", f: "Dios lo ayuda", nivel: "N" },
  { i: "A caballo regalado no se le...", f: "mira el colmillo", nivel: "M" },
  { i: "Ojos que no ven...", f: "corazón que no siente", nivel: "M" },
  { i: "Más tonto que un...", f: "buey", nivel: "N" },
  { i: "Andar con pañito de...", f: "cocina", nivel: "M" },
  { i: "Donde manda capitán...", f: "no manda marinero", nivel: "M" },
  { i: "Camarón que se duerme...", f: "se lo lleva la corriente", nivel: "N" },
  { i: "Al mal tiempo...", f: "buena cara", nivel: "M" },
  { i: "Más vale pájaro en mano...", f: "que ciento volando", nivel: "N" },
  { i: "No dejes para mañana...", f: "lo que puedas hacer hoy", nivel: "M" },
  { i: "En boca cerrada...", f: "no entran moscas", nivel: "M" },
  { i: "A palabras necias...", f: "oídos sordos", nivel: "M" },
  { i: "El que mucho abarca...", f: "poco aprieta", nivel: "M" },
  { i: "No por mucho madrugar...", f: "amanece más temprano", nivel: "M" },
  { i: "Más sabe el diablo...", f: "por viejo que por diablo", nivel: "M" },
  { i: "Perro que ladra...", f: "no muerde", nivel: "N" },
  { i: "El que ríe de último...", f: "ríe mejor", nivel: "N" },
  { i: "No es oro todo...", f: "lo que reluce", nivel: "M" },
  { i: "Cría fama y...", f: "échate a dormir", nivel: "M" },
  { i: "A quien buen árbol se arrima...", f: "buena sombra lo cobija", nivel: "M" },
  { i: "Del dicho al hecho...", f: "hay mucho trecho", nivel: "M" },
  { i: "Cuando el río suena...", f: "piedras lleva", nivel: "M" }
];

/* Palabras para Cara y Señal (mímica): palabra + palabras prohibidas */
export const CARA: any[] = [
  { w: "Tío Conejo", proh: ["conejo", "orejas", "astuto"], p: "Cuentos de mi tía Panchita", nivel: "N" },
  { w: "Tío Coyote", proh: ["coyote", "aullar", "hambre"], p: "Cuentos de mi tía Panchita", nivel: "N" },
  { w: "Doña Modorra", proh: ["tortuga", "reina", "mar"], p: "Cocorí", nivel: "N" },
  { w: "Cocorí", proh: ["Limón", "niño", "Caribe"], p: "Cocorí", nivel: "N" },
  { w: "Marcos Ramírez", proh: ["Calufa", "novela", "travieso"], p: "Marcos Ramírez", nivel: "T" },
  { w: "Carmen Lyra", proh: ["maestra", "Tía Panchita", "escritora"], p: "Autores", nivel: "N" },
  { w: "Joaquín Gutiérrez", proh: ["Cocorí", "escritor", "mar"], p: "Autores", nivel: "N" },
  { w: "Calufa", proh: ["Marcos Ramírez", "zapatero", "Mamita Yunai"], p: "Autores", nivel: "T" },
  { w: "La Segua", proh: ["caballo", "noche", "Leyenda"], p: "Leyendas", nivel: "N" },
  { w: "El Cadejos", proh: ["perro", "noche", "cadenas"], p: "Leyendas", nivel: "N" },
  { w: "La Carreta sin Bueyes", proh: ["buey", "noche", "cadenas"], p: "Leyendas", nivel: "T" },
  { w: "La Llorona", proh: ["llorar", "río", "hijo"], p: "Leyendas", nivel: "T" },
  { w: "Cuentos de mi tía Panchita", proh: ["Carmen Lyra", "conejo", "cuentos"], p: "Libros", nivel: "N" },
  { w: "Cocorí", proh: ["tortuga", "Limón", "niño"], p: "Libros", nivel: "N" },
  { w: "Mamita Yunai", proh: ["banano", "Calufa", "compañía"], p: "Libros", nivel: "M" },
  { w: "Concherías", proh: ["poemas", "campesino", "Aquileo"], p: "Libros", nivel: "M" },
  { w: "Marimba", proh: ["madera", "música", "bailar"], p: "Tradición", nivel: "M" },
  { w: "El elote", proh: ["maíz", "barba", "comer"], p: "Adivinanzas", nivel: "N" },
  { w: "El loro", proh: ["hablar", "volar", "verde"], p: "Adivinanzas", nivel: "N" },
  { w: "El plátano", proh: ["amarillo", "comer", "mono"], p: "Adivinanzas", nivel: "N" },
  { w: "La Cucarachita Mandinga", proh: ["cucaracha", "casarse", "barrer"], p: "Cuentos de mi tía Panchita", nivel: "N" },
  { w: "El Moto", proh: ["niño", "caballo", "huérfano"], p: "El moto", nivel: "N" },
  { w: "El Duende", proh: ["sombrero", "esconder", "cafetal"], p: "Leyendas", nivel: "N" },
  { w: "La Tule Vieja", proh: ["vieja", "río", "batea"], p: "Leyendas", nivel: "M" },
  { w: "El Pisuicas", proh: ["diablo", "cuernos", "alma"], p: "Leyendas", nivel: "M" },
  { w: "Magón", proh: ["costumbres", "cuentos", "escritor"], p: "Autores", nivel: "M" },
  { w: "Anacristina Rossi", proh: ["Gandoca", "tortugas", "escritora"], p: "Autores", nivel: "M" },
  { w: "Única mirando al mar", proh: ["basurero", "mar", "novela"], p: "Libros", nivel: "M" },
  { w: "El infierno verde", proh: ["guerra", "selva", "Chaco"], p: "Libros", nivel: "M" },
  { w: "La marimba", proh: ["madera", "música", "baile"], p: "Tradición", nivel: "M" },
  { w: "Tortuga", proh: ["caparazón", "lenta", "mar"], p: "Animales", nivel: "N" },
  { w: "El río", proh: ["agua", "corre", "puente"], p: "Naturaleza", nivel: "T" }
];

/* Verdadero o Falso: t = afirmación, v = es verdadera, c = categoría */
export const VOF: Afirmacion[] = [
  // ---- Niños ----
  { t: "Carmen Lyra escribió los Cuentos de mi Tía Panchita.", v: true, nivel: "N", c: "Autores" },
  { t: "Cocorí vive en la provincia de Guanacaste.", v: false, nivel: "N", c: "Personajes" },
  { t: "Doña Modorra es una tortuga gigante.", v: true, nivel: "N", c: "Personajes" },
  { t: "El Tío Coyote es más astuto que el Tío Conejo.", v: false, nivel: "N", c: "Personajes" },
  { t: "Joaquín Gutiérrez escribió la novela 'Cocorí'.", v: true, nivel: "N", c: "Autores" },
  { t: "El Tío Conejo aparece en los cuentos que contaba la Tía Panchita.", v: true, nivel: "N", c: "Personajes" },
  { t: "La Cucarachita Mandinga es un personaje de Carmen Lyra.", v: true, nivel: "N", c: "Personajes" },
  { t: "El Moto es considerada la primera novela costarricense.", v: true, nivel: "N", c: "Libros" },
  { t: "Juan Varela peleó en la Campaña Nacional de 1856.", v: true, nivel: "N", c: "Libros" },
  { t: "El Duende de las leyendas usa un sombrero pequeñito.", v: false, nivel: "N", c: "Leyendas" },
  { t: "'El moto' fue escrito por Calufa.", v: false, nivel: "N", c: "Autores" },
  { t: "En 'Cuentos de mi tía Panchita' los animales hablan.", v: true, nivel: "N", c: "Libros" },
  // ---- Adultos mayores / todo el mundo ----
  { t: "Calufa escribió 'Mamita Yunai'.", v: true, nivel: "M", c: "Autores" },
  { t: "'Mamita Yunai' habla de los trabajadores de la bananera.", v: true, nivel: "M", c: "Libros" },
  { t: "'El infierno verde' trata sobre la Segunda Guerra Mundial.", v: false, nivel: "M", c: "Libros" },
  { t: "Anacristina Rossi escribió 'La Loca de Gandoca'.", v: true, nivel: "M", c: "Autores" },
  { t: "'La Loca de Gandoca' defiende un refugio de tortugas.", v: true, nivel: "M", c: "Libros" },
  { t: "Yolanda Oreamuno escribió 'La ruta de su evasión'.", v: true, nivel: "M", c: "Autores" },
  { t: "Fabián Dobles escribió 'El sitio de las abras'.", v: true, nivel: "M", c: "Autores" },
  { t: "'El sitio de las abras' trata de la lucha de los campesinos por la tierra.", v: true, nivel: "M", c: "Libros" },
  { t: "Aquileo J. Echeverría escribió las 'Concherías'.", v: true, nivel: "M", c: "Autores" },
  { t: "Las 'Concherías' son novelas de terror.", v: false, nivel: "M", c: "Libros" },
  { t: "La Segua se aparece de noche en los caminos.", v: true, nivel: "M", c: "Leyendas" },
  { t: "El Cadejos es un perro grande que asusta de noche.", v: true, nivel: "M", c: "Leyendas" },
  { t: "La Llorona anda buscando a su hijo por los ríos.", v: true, nivel: "M", c: "Leyendas" },
  { t: "La Carreta sin Bueyes se pasea sobre todo por Cartago.", v: true, nivel: "M", c: "Leyendas" },
  { t: "El 'Pisuicas' es como los campesinos nombran al diablo.", v: true, nivel: "M", c: "Leyendas" },
  { t: "La Tule Vieja se aparece en las playas turísticas.", v: false, nivel: "M", c: "Leyendas" },
  { t: "José León Sánchez escribió 'La isla de los hombres solos'.", v: true, nivel: "M", c: "Autores" },
  { t: "'Única mirando al mar' sucede en un basurero.", v: true, nivel: "M", c: "Libros" },
  { t: "Carmen Naranjo escribió 'Diario de una multitud'.", v: true, nivel: "M", c: "Autores" },
  { t: "Tatiana Lobo escribió 'Asalto al paraíso'.", v: true, nivel: "M", c: "Autores" },
  { t: "Ricardo Fernández Guardia escribió 'Cuentos ticos'.", v: true, nivel: "M", c: "Autores" },
  { t: "Magón es el apodo de Manuel González Zeledón.", v: true, nivel: "M", c: "Autores" },
  { t: "'Cuentos viejos' es un libro de Adela Ferreto.", v: true, nivel: "M", c: "Autores" },
  { t: "William Walker fue un gran benefactor de Costa Rica.", v: false, nivel: "M", c: "Historia" },
  { t: "Juan Santamaría murió quemando el mesón en 1856.", v: true, nivel: "M", c: "Historia" },
  { t: "La música del Himno Nacional la compuso Manuel María Gutiérrez.", v: true, nivel: "M", c: "Cultura" },
  { t: "La marimba es un instrumento típico de Centroamérica.", v: true, nivel: "M", c: "Cultura" },
  { t: "Cocorí quiere que el tiempo pase cada vez más rápido.", v: false, nivel: "T", c: "Personajes" }
];

/* Ordena la historia: t = título, pasos = secuencia correcta, nivel */
export const ORDEN: Historia[] = [
  { t: "La aventura de Cocorí", nivel: "N", pasos: [
    "Cocorí vive feliz cerca del mar, en Limón.",
    "Cocorí persigue a Doña Modorra, la reina de las tortugas.",
    "Doña Modorra lo lleva de paseo por el fondo del mar.",
    "Cocorí le pide que el tiempo no pase tan rápido."
  ] },
  { t: "La Campaña Nacional de 1856", nivel: "M", pasos: [
    "William Walker y sus filibusteros invaden Centroamérica.",
    "Costa Rica organiza su ejército y marcha a la guerra.",
    "Juan Santamaría quema el mesón donde se escondían los filibusteros.",
    "Los costarricenses ganan la batalla de Rivas."
  ] },
  { t: "La leyenda de la Segua", nivel: "N", pasos: [
    "Al anochecer, un hombre de parranda va solo por el camino.",
    "Ve a lo lejos a una mujer muy hermosa.",
    "Cuando se acerca, la mujer le muestra su cara de caballo.",
    "El hombre huye asustado: era la Segua."
  ] },
  { t: "La leyenda de La Llorona", nivel: "M", pasos: [
    "De noche se escucha un llanto junto al río.",
    "Una mujer camina triste por las orillas.",
    "Dicen que anda buscando a su hijo perdido.",
    "Por su llanto, la gente la llama La Llorona."
  ] },
  { t: "El Duende travieso", nivel: "N", pasos: [
    "En los cafetales vive un duende pequeñito.",
    "Le gusta esconder objetos de las casas.",
    "También trenza las crines de los caballos.",
    "Los campesinos dicen que es un gran travieso."
  ] },
  { t: "El Cadejos cuidador", nivel: "M", pasos: [
    "De noche, un perro grande y peludo sale a caminar.",
    "Sus ojos brillan en la oscuridad.",
    "Acompaña a los caminantes que andan solos.",
    "Los campesinos lo conocen como El Cadejos."
  ] },
  { t: "Para disfrutar un libro", nivel: "T", pasos: [
    "Elija un libro que le llame la atención.",
    "Lea con calma, sin ninguna prisa.",
    "Comente lo que leyó con alguien de confianza.",
    "Recomiende el libro a un amigo o familiar."
  ] }
];

/* ============================================================
   SABÍAS QUÉ - datos educativos breves (para todos los juegos)
   ============================================================ */
export const SABIAS: Sabia[] = [
  { x: "Leer en voz alta ayuda a perder el miedo a equivocarse y mejora la pronunciación.", nivel: "N" },
  { x: "En Costa Rica la lectura es un derecho: hay bibliotecas públicas gratuitas para todas las personas.", nivel: "T" },
  { x: "Carmen Lyra se llamaba en realidad María Isabel Carvajal y fue maestra de escuela.", nivel: "N" },
  { x: "«Cocorí» se ha traducido a más de diez idiomas y se lee en muchos países.", nivel: "N" },
  { x: "Los «Cuentos de mi Tía Panchita» se publicaron en 1920 y todavía se leen en las escuelas.", nivel: "N" },
  { x: "Joaquín García Monge escribió «El moto» en 1900, considerada la primera novela costarricense.", nivel: "T" },
  { x: "Leer aunque sea diez minutos al día ejercita la memoria y la imaginación.", nivel: "T" },
  { x: "Las leyendas como La Segua y El Cadejos pasaron de boca en boca mucho antes de escribirse.", nivel: "T" },
  { x: "Compartir un cuento en familia es una forma de mantener viva la cultura.", nivel: "M" },
  { x: "No hay edad para empezar a leer: siempre es un buen momento.", nivel: "M" },
  { x: "Los refranes guardan la sabiduría de nuestros abuelos y abuelas.", nivel: "M" },
  { x: "Aquileo J. Echeverría retrató al campesino costarricense en «Concherías».", nivel: "M" },
  { x: "Leer nos ayuda a entender mejor a las demás personas.", nivel: "T" },
  { x: "Quien lee nunca se aburre: siempre hay un libro esperando.", nivel: "N" },
  { x: "Regalar o prestar un libro es una manera de compartir el derecho a leer.", nivel: "T" },
  { x: "«Marcos Ramírez» está inspirada en la niñez de su autor, Carlos Luis Fallas.", nivel: "T" },
  { x: "Leer en voz alta a las personas adultas mayores despierta recuerdos y conversación.", nivel: "M" },
  { x: "Anacristina Rossi y Yolanda Oreamuno abrieron camino a muchas escritoras costarricenses.", nivel: "M" },
  { x: "Algunos personajes ticos nacieron en los libros: el Tío Conejo, Cocorí y Juan Varela.", nivel: "N" },
  { x: "Cuando leemos, viajamos a otros lugares sin movernos de la silla.", nivel: "T" },
  { x: "Escribir un cuento propio es otra forma de jugar con la lectura.", nivel: "N" },
  { x: "Las bibliotecas escolares son un tesoro: cuide los libros para que otros los disfruten.", nivel: "N" },
  { x: "Tatiana Lobo y Carmen Naranjo mostraron que nuestras historias también son literatura.", nivel: "M" },
  { x: "Cada libro leído deja una idea nueva: comente lo que leyó con alguien.", nivel: "T" }
];

/* ============================================================
   LECTURAS - comprensión lectora (texto con huecos)
   texto usa "{}" para cada espacio en blanco.
   opciones[i] son las alternativas del hueco i; correcta[i] su índice.
   ============================================================ */
export const LECTURAS: Lectura[] = [
  { t: "Cocorí", nivel: "N", fuente: "Joaquín Gutiérrez (1947)",
    texto: "Cocorí es un {} que vive en la provincia de {}. Un día conoce a Doña Modorra, la reina de las {}, y le pide que el tiempo no pase tan rápido.",
    opciones: [["niño", "señor", "perro"], ["Limón", "Cartago", "Puntarenas"], ["tortugas", "mariposas", "iguanas"]],
    correctas: [0, 0, 0],
    dato: "«Cocorí» es una de las obras costarricenses más traducidas del mundo." },

  { t: "Cuentos de mi Tía Panchita", nivel: "N", fuente: "Carmen Lyra (1920)",
    texto: "En estos cuentos, el Tío {} siempre gana con astucia a otro animal más {} y con mucha hambre llamado el Tío {}.",
    opciones: [["Conejo", "Coyote", "Cadejos"], ["pequeño", "grande", "viejo"], ["Coyote", "Conejo", "Pisuicas"]],
    correctas: [0, 0, 0],
    dato: "Carmen Lyra recogió estos cuentos de la tradición oral y los escribió para las niñas y los niños." },

  { t: "Marcos Ramírez", nivel: "T", fuente: "Carlos Luis Fallas (1952)",
    texto: "Marcos Ramírez es un muchacho {} y travieso que cuenta sus {} en la Costa Rica de hace un siglo.",
    opciones: [["pobre", "rico", "famoso"], ["aventuras", "aburrimientos", "vacaciones"]],
    correctas: [0, 0],
    dato: "Su autor, Carlos Luis Fallas, se inspiró en su propia niñez para escribirla." },

  { t: "El moto", nivel: "N", fuente: "Joaquín García Monge (1900)",
    texto: "Un muchacho {} y su caballo recorren juntos los {}. Es considerada la primera {} costarricense.",
    opciones: [["huérfano", "millonario", "maestro"], ["caminos", "mares", "edificios"], ["novela", "leyenda", "adivinanza"]],
    correctas: [0, 0, 0],
    dato: "«El moto» se publicó en 1900, cuando don Joaquín García Monge era muy joven." },

  { t: "La Segua", nivel: "N", fuente: "Leyenda costarricense",
    texto: "La Segua aparece de {} por los caminos. Lleva un chal {} y tiene cara de {}.",
    opciones: [["noche", "mañana", "tarde"], ["negro", "blanco", "rojo"], ["caballo", "gato", "lora"]],
    correctas: [0, 0, 0],
    dato: "La leyenda de La Segua es una de las más famosas de Cartago." },

  { t: "Concherías", nivel: "M", fuente: "Aquileo J. Echeverría (1909)",
    texto: "«Concherías» es un libro de {} llenos de gracia que retratan al {} costarricense con su manera sabrosa de {}.",
    opciones: [["versos", "mapas", "recetas"], ["campesino", "marinero", "turista"], ["hablar", "callar", "cantar"]],
    correctas: [0, 0, 0],
    dato: "Aquileo J. Echeverría fue también militar y político, pero se le recuerda por su poesía popular." },

  { t: "Mamita Yunai", nivel: "M", fuente: "Carlos Luis Fallas (1941)",
    texto: "«Mamita Yunai» narra la vida de los {} de la compañía {} en el sur del país.",
    opciones: [["trabajadores", "estudiantes", "artistas"], ["bananera", "telefónica", "aérea"]],
    correctas: [0, 0],
    dato: "La novela denuncia las duras condiciones de los trabajadores en las bananeras." },

  { t: "Única mirando al mar", nivel: "M", fuente: "Fernando Contreras (1994)",
    texto: "Única recoge lo que otros {} en el {} y nos enseña a mirar el mundo con otros {}.",
    opciones: [["botan", "compran", "venden"], ["basurero", "mercado", "parque"], ["ojos", "colores", "libros"]],
    correctas: [0, 0, 0],
    dato: "Esta novela invita a pensar en la dignidad de todas las personas." },

  { t: "El Cadejos", nivel: "T", fuente: "Leyenda costarricense",
    texto: "El Cadejos es un perro {} que {} a los caminantes que andan {} por la noche.",
    opciones: [["negro", "blanco", "moteado"], ["acompaña", "persigue", "saluda"], ["solos", "acompañados", "contentos"]],
    correctas: [0, 0, 0],
    dato: "Los campesinos cuentan que El Cadejos cuida o asusta a quien anda por malos caminos." },

  { t: "Juan Varela", nivel: "N", fuente: "Adela Ferreto (1965)",
    texto: "Juan Varela es un niño {} que acompaña a los héroes de la Campaña Nacional de {} contra los {}.",
    opciones: [["soldado", "maestro", "doctor"], ["1856", "1920", "1948"], ["filibusteros", "piratas", "gigantes"]],
    correctas: [0, 0, 0],
    dato: "La Campaña Nacional de 1856 es un episodio histórico que marcó a Costa Rica." }
];

/* ============================================================
   DADOS - elementos para inventar cuentos en grupo
   ============================================================ */
export const DADOS: Dados = {
  personajes: [
    { x: "un conejo muy astuto", nivel: "N" },
    { x: "una abuela contadora de cuentos", nivel: "M" },
    { x: "un caballo viejo y sabio", nivel: "N" },
    { x: "una niña curiosa", nivel: "N" },
    { x: "un coyote siempre hambriento", nivel: "N" },
    { x: "un aprendiz de escritor", nivel: "T" },
    { x: "una tortuga gigante", nivel: "N" },
    { x: "un cartero del pueblo", nivel: "T" },
    { x: "una maestra recién llegada", nivel: "T" },
    { x: "un perro negro y misterioso", nivel: "T" },
    { x: "una bibliotecaria valiente", nivel: "M" },
    { x: "un pescador de Puntarenas", nivel: "T" }
  ],
  lugares: [
    { x: "en un pueblo entre montañas", nivel: "N" },
    { x: "a la orilla del mar Caribe", nivel: "N" },
    { x: "en una biblioteca pequeñita", nivel: "T" },
    { x: "en un cafetal al amanecer", nivel: "T" },
    { x: "en un camino de tierra a medianoche", nivel: "T" },
    { x: "en el mercado de una ciudad", nivel: "T" },
    { x: "en una escuela de un solo salón", nivel: "N" },
    { x: "en un río rodeado de árboles", nivel: "N" },
    { x: "en una casa de la cultura", nivel: "M" },
    { x: "en el basurero de la ciudad", nivel: "M" },
    { x: "en una isla lejana", nivel: "T" },
    { x: "en un campo lleno de luciérnagas", nivel: "N" }
  ],
  problemas: [
    { x: "se perdió un libro muy importante", nivel: "T" },
    { x: "nadie quiere leer en el pueblo", nivel: "T" },
    { x: "aparece una sombra por las noches", nivel: "T" },
    { x: "se acabó el agua y hay que ayudar", nivel: "N" },
    { x: "un amigo necesita consuelo", nivel: "N" },
    { x: "una tormenta no deja salir de casa", nivel: "N" },
    { x: "se olvidaron todas las palabras", nivel: "N" },
    { x: "hay que rescatar un recuerdo", nivel: "M" },
    { x: "alguien no puede dormir de la preocupación", nivel: "M" },
    { x: "se cayó el puente hacia la escuela", nivel: "N" },
    { x: "una carta importante nunca llegó", nivel: "T" },
    { x: "el tiempo parece ir demasiado rápido", nivel: "N" }
  ],
  objetos: [
    { x: "un libro con dibujos que cobran vida", nivel: "N" },
    { x: "una lámpara de aceite", nivel: "T" },
    { x: "un cuaderno de tapas duras", nivel: "T" },
    { x: "un reloj detenido", nivel: "T" },
    { x: "una semilla mágica", nivel: "N" },
    { x: "una llave dorada", nivel: "N" },
    { x: "una taza de café calientito", nivel: "M" },
    { x: "una fotografía antigua", nivel: "M" },
    { x: "un caracol que guarda el mar", nivel: "T" },
    { x: "un sombrero de paja", nivel: "N" },
    { x: "una flauta de caña", nivel: "T" },
    { x: "un paraguas rojo", nivel: "N" }
  ]
};

/* ============================================================
   SÍLABAS - formar palabras ticas (sílabas ya separadas)
   ============================================================ */
export const SILABAS: Silaba[] = [
  { p: "conejo", sil: ["co", "ne", "jo"], pista: "Animalito astuto de los cuentos de la Tía Panchita.", nivel: "N" },
  { p: "tortuga", sil: ["tor", "tu", "ga"], pista: "Doña Modorra, la reina de las tortugas.", nivel: "N" },
  { p: "cuento", sil: ["cuen", "to"], pista: "Relato corto que se lee o se cuenta.", nivel: "N" },
  { p: "libro", sil: ["li", "bro"], pista: "Objeto lleno de páginas e historias.", nivel: "N" },
  { p: "escuela", sil: ["es", "cue", "la"], pista: "Lugar donde se aprende a leer.", nivel: "N" },
  { p: "camino", sil: ["ca", "mi", "no"], pista: "Por ahí anduvo el moto con su caballo.", nivel: "N" },
  { p: "montaña", sil: ["mon", "ta", "ña"], pista: "Gran elevación de terreno.", nivel: "N" },
  { p: "semilla", sil: ["se", "mi", "lla"], pista: "De ella nace una planta.", nivel: "N" },
  { p: "leyenda", sil: ["le", "yen", "da"], pista: "Relato antiguo como La Segua o El Cadejos.", nivel: "T" },
  { p: "novela", sil: ["no", "ve", "la"], pista: "Historia larga como «El moto» o «Cocorí».", nivel: "T" },
  { p: "palabra", sil: ["pa", "la", "bra"], pista: "Con muchas de ellas se forman los cuentos.", nivel: "T" },
  { p: "autor", sil: ["au", "tor"], pista: "Persona que escribe un libro.", nivel: "T" },
  { p: "refrán", sil: ["re", "frán"], pista: "Dicho popular con sabiduría.", nivel: "T" },
  { p: "poeta", sil: ["po", "e", "ta"], pista: "Escribe versos, como Aquileo J. Echeverría.", nivel: "M" },
  { p: "abuela", sil: ["a", "bue", "la"], pista: "Ella guarda los recuerdos y los cuentos.", nivel: "M" },
  { p: "valiente", sil: ["va", "lien", "te"], pista: "Quien no tiene miedo, como un héroe.", nivel: "T" },
  { p: "banano", sil: ["ba", "na", "no"], pista: "Fruto del sur, presente en «Mamita Yunai».", nivel: "N" },
  { p: "cultura", sil: ["cul", "tu", "ra"], pista: "Todo lo que un pueblo crea y comparte.", nivel: "M" }
];

/* ---------- Lecturas con preguntas de comprensión ---------- */
export const LECTURAS_PREG: LecturaConPreguntas[] = [
  {
    t: "El conejo y la Tía Panchita", nivel: "N", fuente: "Cuentos de mi tía Panchita, Carmen Lyra",
    texto: "La Tía Panchita tenía un huerto con repollos y zanahorias. Todas las mañanas salía a regarlo. Un día vio que un conejo blanco se comía sus zanahorias. En vez de enojarse, le puso una trampa con dulce de tapa. El conejo, goloso, cayó en la trampa, pero le dio tanta risa que la señora lo dejó libre con una condición: ayudarle a cuidar el huerto.",
    preguntas: [
      { p: "¿Qué comía el conejo del huerto?", ops: ["Zanahorias", "Frijoles", "Papas"], r: 0 },
      { p: "¿Con qué hizo la trampa la Tía Panchita?", ops: ["Con una red", "Con dulce de tapa", "Con una cuerda"], r: 1 },
      { p: "¿Qué pasó al final con el conejo?", ops: ["Se lo comieron", "Se escapó para siempre", "Ayudó a cuidar el huerto"], r: 2 }
    ],
    dato: "«Cuentos de mi tía Panchita» de Carmen Lyra es el libro de cuentos ticos más querido por los niños desde 1920."
  },
  {
    t: "Cocorí en la ciudad", nivel: "N", fuente: "Cocorí, Joaquín Gutiérrez",
    texto: "Cocorí vivía en una aldea a la orilla de la selva. Un día su papá lo llevó a la ciudad para que estudiara. Cocorí no entendía las costumbres de la gente y se sentía solo. Una niña llamada Herminia le regaló una rosa para consolarlo. Cuando la rosa desapareció, Cocorí estuvo triste, hasta que comprendió que la amistad es más valiosa que cualquier regalo.",
    preguntas: [
      { p: "¿Dónde vivía Cocorí?", ops: ["En una ciudad grande", "A la orilla de la selva", "En una isla"], r: 1 },
      { p: "¿Quién le regaló una rosa?", ops: ["Herminia", "Su mamá", "La maestra"], r: 0 },
      { p: "¿Qué comprendió Cocorí al final?", ops: ["Que la ciudad es mejor", "Que las rosas son caras", "Que la amistad vale más que un regalo"], r: 2 }
    ],
    dato: "«Cocorí» de Joaquín Gutiérrez fue traducido a muchos idiomas y es un clásico de la literatura infantil costarricense."
  },
  {
    t: "El Cadejos", nivel: "N", fuente: "Leyenda costarricense",
    texto: "Cuenta la leyenda que en las noches oscuras aparece un perro negro con los ojos de fuego. Camina detrás de las personas que salen tarde y las sigue hasta su casa. Algunos dicen que cuida a los que fueron buenos y asusta a los que hicieron travesuras. Por eso, en los pueblos, los abuelos aconsejan no andar en la calle de madrugada.",
    preguntas: [
      { p: "¿Cómo son los ojos del Cadejos?", ops: ["Verdes", "De fuego", "Cerrados"], r: 1 },
      { p: "¿A quiénes asusta el Cadejos?", ops: ["A los que hicieron travesuras", "A los que leen mucho", "A los que madrugan"], r: 0 },
      { p: "¿Qué aconsejan los abuelos?", ops: ["Dormir temprano", "No andar en la calle de madrugada", "Cuidar a los perros"], r: 1 }
    ],
    dato: "El Cadejos es una de las leyendas más famosas de Costa Rica; se parece al perro negro de otras culturas."
  },
  {
    t: "La Segua", nivel: "N", fuente: "Leyenda costarricense",
    texto: "La Segua era una muchacha muy bonita. De día tenía el rostro de una joven, pero de noche mostraba una cara de caballo con dientes grandes. Los hombres que la seguían por su belleza se asustaban al verla de cerca y salían corriendo. La leyenda enseña que no hay que dejarse llevar solo por las apariencias.",
    preguntas: [
      { p: "¿Qué cara mostraba La Segua de noche?", ops: ["De caballo", "De joven", "De pájaro"], r: 0 },
      { p: "¿Qué hacían los hombres al verla de cerca?", ops: ["Se quedaban quietos", "Salían corriendo", "Le daban flores"], r: 1 },
      { p: "¿Qué enseña la leyenda?", ops: ["A cuidar los caballos", "A no salir de noche", "A no dejarse llevar por las apariencias"], r: 2 }
    ],
    dato: "La Segua es la leyenda tica de la mujer con cara de caballo; simboliza el peligro de fijarse solo en la belleza."
  },
  {
    t: "El moto y su caballo", nivel: "T", fuente: "El moto, Joaquín García Monge",
    texto: "El moto era un niño huérfano que trabajaba en una finca. Solo tenía un caballo flaco al que quería como a un amigo. Un día el caballo desapareció y el moto salió a buscarlo. En el camino aprendió que la libertad y la amistad valen más que cualquier pago. Al final, niño y caballo corrieron juntos hacia el horizonte.",
    preguntas: [
      { p: "¿Qué animal tenía el moto?", ops: ["Un perro", "Un caballo", "Una vaca"], r: 1 },
      { p: "¿Qué buscaba el moto?", ops: ["Su caballo", "Un tesoro", "A su familia"], r: 0 },
      { p: "¿Qué aprendió el moto?", ops: ["A trabajar en la finca", "Que la libertad y la amistad valen más", "A montar bien"], r: 1 }
    ],
    dato: "«El moto» (1932), de Joaquín García Monge, se considera la primera gran novela costarricense."
  },
  {
    t: "Marcos Ramírez", nivel: "M", fuente: "Marcos Ramírez, Carlos Luis Fallas",
    texto: "Marcos Ramírez vivía con su mamá en un barrio pobre de San José. Era un niño muy listo, pero no le gustaba la escuela. Poco a poco, con ayuda de su maestra, descubrió que leer le abría puertas y le daba fuerza para defender a los suyos. Así, el muchacho travieso se convirtió en un joven que usaba las palabras para luchar por la justicia.",
    preguntas: [
      { p: "¿Con quién vivía Marcos?", ops: ["Con su mamá", "Con sus tíos", "Solo"], r: 0 },
      { p: "¿Qué descubrió con ayuda de su maestra?", ops: ["Que leer le abría puertas", "Que la escuela era aburrida", "Que debía trabajar"], r: 0 },
      { p: "¿En qué se convirtió de grande?", ops: ["En un deportista", "En un defensor de la justicia", "En un agricultor"], r: 1 }
    ],
    dato: "«Marcos Ramírez» de Carlos Luis Fallas retrata la vida de los barrios obreros de Costa Rica."
  },
  {
    t: "Única mirando al mar", nivel: "M", fuente: "Única mirando al mar, Fernando Contreras Castro",
    texto: "Única vivía en el botadero de basura de Río Azul junto a su hijo y otros recicladores. Un día, mirando el mar imaginado entre los desechos, decidió escribir con las letras viejas que encontraba. Sus palabras contaban la dignidad de quienes nadie veía. Así, la mujer que buscaba comida entre la basura halló entre las letras un motivo para no perder la esperanza.",
    preguntas: [
      { p: "¿Dónde vivía Única?", ops: ["En una casa de la playa", "En el botadero de basura", "En un hotel"], r: 1 },
      { p: "¿Qué hacía con las letras viejas?", ops: ["Las vendía", "Las quemaba", "Escribía"], r: 2 },
      { p: "¿Qué encontró entre las letras?", ops: ["Esperanza", "Dinero", "Comida"], r: 0 }
    ],
    dato: "«Única mirando al mar» de Fernando Contreras Castro da voz a los recicladores de Costa Rica."
  },
  {
    t: "La casa de la cultura", nivel: "N", fuente: "Relato sobre la comunidad",
    texto: "En el centro del pueblo hay una casa antigua con puertas grandes y olor a madera. Allí funciona la casa de la cultura: tiene una biblioteca, un salón para talleres y un patio con un árbol enorme. Los vecinos llegan a leer, a pintar y a contar historias. Don Rafael, el bibliotecario, dice que la casa está viva porque cada libro que se abre le da un nuevo latido.",
    preguntas: [
      { p: "¿Qué tiene la casa de la cultura?", ops: ["Una biblioteca", "Una piscina", "Un cine"], r: 0 },
      { p: "¿Quién es Don Rafael?", ops: ["El alcalde", "El bibliotecario", "El maestro"], r: 1 },
      { p: "¿Por qué dice que la casa está viva?", ops: ["Porque hay plantas", "Porque cada libro que se abre le da un latido", "Porque hacen fiestas"], r: 1 }
    ],
    dato: "Las casas de la cultura y las bibliotecas públicas llevan libros y talleres gratuitos a las comunidades."
  }
];

/* ---------- Cazador de errores ortográficos ---------- */
export const ERRORES: FraseConErrores[] = [
  { texto: "Mi mamá me dijo que havía un tesoro escondido en el patio.", errores: [{ mal: "havía", bien: "había" }], nivel: "N", pista: "Las formas de «haber» se escriben con h y con b: había." },
  { texto: "Nosotros bamos a leer cuentos a la casa de la cultura.", errores: [{ mal: "bamos", bien: "vamos" }], nivel: "N", pista: "«Vamos» viene del verbo ir y se escribe con v." },
  { texto: "Ella tubo que contar el cuento otra vez.", errores: [{ mal: "tubo", bien: "tuvo" }], nivel: "N", pista: "«Tuvo» es del verbo tener; «tubo» es una cañería." },
  { texto: "Habian muchas leyendas en aquel libro.", errores: [{ mal: "Habian", bien: "Había" }], nivel: "N", pista: "Se dice «había» aunque sean muchas cosas." },
  { texto: "El año pasado yo ví una obra de teatro muy bonita.", errores: [{ mal: "ví", bien: "vi" }], nivel: "N", pista: "«Vi» (del verbo ver) no lleva tilde." },
  { texto: "Don José corria por el camino del cafetal.", errores: [{ mal: "corria", bien: "corría" }], nivel: "N", pista: "«Corría» lleva tilde por ser palabra grave terminada en vocal." },
  { texto: "Los estudiantes lelleron el poema con entusiasmo.", errores: [{ mal: "lelleron", bien: "leyeron" }], nivel: "T", pista: "«Leyeron» lleva y porque termina en «yeron»." },
  { texto: "Me gustaria leer todas las noches antes de dormir.", errores: [{ mal: "gustaria", bien: "gustaría" }], nivel: "N", pista: "El condicional siempre lleva tilde: gustaría." },
  { texto: "Aquileo Echeverría escribio muchas concherías.", errores: [{ mal: "escribio", bien: "escribió" }], nivel: "T", pista: "Los verbos en pasado terminados en «ió» llevan tilde." },
  { texto: "El cadejos andava solo por las calles de noche.", errores: [{ mal: "andava", bien: "andaba" }], nivel: "T", pista: "El imperfecto de andar es «andaba», con b." },
  { texto: "Yo oyí un ruido extraño en la montaña.", errores: [{ mal: "oyí", bien: "oí" }], nivel: "M", pista: "«Oí» se escribe sin y; «oyó» sí la lleva." },
  { texto: "Ahí un árbol muy grande en la plaza del pueblo.", errores: [{ mal: "Ahí", bien: "Hay" }], nivel: "M", pista: "«Ahí» indica lugar; «hay» viene del verbo haber." },
  { texto: "Él estubo leyendo toda la tarde sin parar.", errores: [{ mal: "estubo", bien: "estuvo" }], nivel: "N", pista: "«Estuvo» se escribe con v." },
  { texto: "Hacía mucho calor en la havitación pequeña.", errores: [{ mal: "havitación", bien: "habitación" }], nivel: "T", pista: "«Habitación» se escribe con h y con b." },
  { texto: "La abuela me enseño a leer con mucha paciencia.", errores: [{ mal: "enseño", bien: "enseñó" }], nivel: "T", pista: "«Enseñó» (pasado) lleva tilde; «enseño» es presente." }
];

/* ---------- Diccionario tico ---------- */
export const DICCIONARIO: PalabraTica[] = [
  { p: "chiva", ops: ["Bonito, bueno, genial", "Un animal de granja", "Alguien enojado"], r: 0, uso: "«¡Qué chiva tu dibujo!»", nivel: "N" },
  { p: "tuanis", ops: ["Muy bueno, agradable", "Muy caro", "Muy lejos"], r: 0, uso: "«Ese juego está tuanis.»", nivel: "N" },
  { p: "mae", ops: ["Amigo, compa", "Un tipo de comida", "Un baile"], r: 0, uso: "«Mae, ¿me prestás el libro?»", nivel: "N" },
  { p: "diay", ops: ["Expresa sorpresa o resignación", "Adiós para siempre", "Gracias"], r: 0, uso: "«Diay, ¿y ahora qué hacemos?»", nivel: "N" },
  { p: "pura vida", ops: ["Todo bien; saludo y despedida", "Muy triste", "De prisa"], r: 0, uso: "«—¿Cómo está? —Pura vida.»", nivel: "N" },
  { p: "güila", ops: ["Muchacho, chiquillo", "Un pájaro", "Una fruta"], r: 0, uso: "«Los güilas juegan en el patio.»", nivel: "N" },
  { p: "chunche", ops: ["Objeto o cosa cualquiera", "Un zapato", "Una montaña"], r: 0, uso: "«Pasame ese chunche, por favor.»", nivel: "N" },
  { p: "pachanga", ops: ["Fiesta", "Enfermedad", "Tarea"], r: 0, uso: "«Hicieron una pachanga en la escuela.»", nivel: "N" },
  { p: "cabanga", ops: ["Tristeza o nostalgia", "Alegría", "Hambre"], r: 0, uso: "«Me da cabanga recordar a mi abuela.»", nivel: "M" },
  { p: "birra", ops: ["Cerveza", "Pan dulce", "Camisa"], r: 0, uso: "«Se tomaron una birra bien fría.»", nivel: "M" },
  { p: "harina", ops: ["Dinero", "Miedo", "Sueño"], r: 0, uso: "«No hay harina para el viaje.»", nivel: "M" },
  { p: "bretear", ops: ["Trabajar", "Correr", "Cantar"], r: 0, uso: "«Mi tata bretea en la finca.»", nivel: "M" },
  { p: "regañar", ops: ["Reprender, reclamar", "Abrazar", "Compartir"], r: 0, uso: "«La profe regañó a los que no leyeron.»", nivel: "N" },
  { p: "choza", ops: ["Casa humilde", "Un río", "Un árbol"], r: 0, uso: "«Vivían en una choza a la orilla del camino.»", nivel: "N" },
  { p: "tuza", ops: ["Tonto, distraído", "Rápido", "Valiente"], r: 0, uso: "«No seas tuza, poné atención.»", nivel: "N" }
];

/* ---------- Completa la rima ---------- */
export const RIMAS: Rima[] = [
  { verso: "Libro abierto en la ventana,\nyo lo sigo hasta…", ops: ["mañana", "el final", "tarde"], r: 0, nivel: "N", dato: "La rima es la repetición de sonidos al final de los versos." },
  { verso: "En la esquina de la escuela\nse escucha cantar a la…", ops: ["abuela", "cadena", "ventana"], r: 0, nivel: "N" },
  { verso: "Una nube en el cielo azul\nparecía un gran…", ops: ["baúl", "león", "papel"], r: 0, nivel: "N" },
  { verso: "El conejito saltarín\nse escondió en el…", ops: ["jardín", "sillón", "mañana"], r: 0, nivel: "N" },
  { verso: "Vuela, vuela mariposa,\nentre el jardín y las…", ops: ["rosas", "montañas", "cielo"], r: 0, nivel: "N" },
  { verso: "Cocorí, niñito bueno,\nva cantando muy…", ops: ["sereno", "contento", "temprano"], r: 0, nivel: "T" },
  { verso: "El arbolito del huerto\nsiempre se mantiene…", ops: ["despierto", "contento", "temprano"], r: 0, nivel: "T" },
  { verso: "En el mar Única mira\nuna lancha que…", ops: ["gira", "corre", "canta"], r: 0, nivel: "T" },
  { verso: "Con el moto por el camino\nva silbando muy…", ops: ["fino", "alegre", "bajito"], r: 0, nivel: "T" },
  { verso: "Mamita Yunai, bananal entero,\ntrabajo y sudor del pueblo…", ops: ["obrero", "sencillo", "valiente"], r: 0, nivel: "M" },
  { verso: "La luna en el firmamento\nalumbra cada…", ops: ["sentimiento", "rinconcito", "estrella"], r: 0, nivel: "M" },
  { verso: "En la montaña lejana\ncantaba una…", ops: ["campana", "paloma", "estrella"], r: 0, nivel: "T" }
];

/* ---------- Elige tu aventura (historias ramificadas) ----------
   Marcadores que el juego reemplaza según el personaje elegido:
   {nom} nombre · {el} la/el · {un} una/un · {o} a/o · {pron} ella/él  */
export const AVENTURAS: Aventura[] = [
  {
    t: "El pez de escamas doradas", nivel: "N", inicio: "n1",
    nodos: {
      n1: { texto: "{nom} caminaba junto al río cuando escuchó una vocecita: «¡Ayuda, soy un pez atrapado!». Entre las piedras brillaba algo dorado.", opciones: [
        { t: "Asomarse a ver qué brilla", va: "n2a" },
        { t: "Ir a buscar a alguien que ayude", va: "n2b" }
      ] },
      n2a: { texto: "Era un pez pequeñito con escamas de oro, atrapado entre dos piedras. Movía la cola con fuerza, pero no podía salir.", opciones: [
        { t: "Liberarlo con mucho cuidado", va: "n3a" },
        { t: "Preguntarle primero qué le pasó", va: "n3b" }
      ] },
      n2b: { texto: "{nom} corrió a buscar a doña Modorra, la tortuga más sabia del río. Ella le dijo: «Los peces dorados solo aparecen para quien se atreve a ayudar».", opciones: [
        { t: "Volver al río con la tortuga", va: "n2a" },
        { t: "Desistir y seguir el camino", va: "n3c" }
      ] },
      n3a: { texto: "{nom} movió las piedras con suavidad. El pez salió disparado, dio una vuelta en el aire y sonrió. «Te regalo una escama», dijo.", opciones: [
        { t: "Aceptar la escama dorada", va: "f1" },
        { t: "Decirle que no hace falta", va: "f2" }
      ] },
      n3b: { texto: "El pez contó que unos muchachos habían puesto trampas en el río. Si {nom} lo soltaba, le mostraría dónde estaban.", opciones: [
        { t: "Soltarlo y quitar las trampas", va: "f1" },
        { t: "Dejar las trampas y solo liberarlo", va: "f3" }
      ] },
      n3c: { texto: "{nom} siguió su camino, pero el canto del río se fue apagando. Esa noche no pudo dormir pensando en el pececito.", opciones: [
        { t: "Volver al amanecer", va: "n2a" },
        { t: "Olvidarlo del todo", va: "f3" }
      ] },
      f1: { final: true, texto: "El río entero brilló. Los peces saltaron contentos y, desde entonces, cada vez que {nom} pasa por la orilla, uno de ellos le hace una venia. La escama dorada nunca se apagó.", moraleja: "Ayudar sin esperar premio es lo que hace brillar de verdad." },
      f2: { final: true, texto: "El pez sonrió y se fue nadando. Al día siguiente, {nom} encontró el río lleno de pececitos que lo esperaban. Sin escamas ni tesoros, se ganó el más bonito: ser amig{o} del río.", moraleja: "La amistad vale más que cualquier tesoro." },
      f3: { final: true, texto: "El pez logró escapar, pero las trampas siguieron en el río y otros peces quedaron atrapados. {nom} aprendió que ayudar a medias no alcanza.", moraleja: "Cuando ayudamos, hay que hacerlo completo." }
    }
  },
  {
    t: "El mapa del abuelo", nivel: "T", inicio: "n1",
    nodos: {
      n1: { texto: "En el cajón de un ropero viejo, {nom} encontró un mapa dibujado a mano. Decía: «Donde termina el camino de tierra, empieza el verdadero tesoro». {pron} sintió un cosquilleo en las manos.", opciones: [
        { t: "Salir de una vez con el mapa", va: "n2a" },
        { t: "Mostrárselo primero a alguien de confianza", va: "n2b" }
      ] },
      n2a: { texto: "Salió con el mapa al atardecer. A pocos metros, el camino se partía en dos: uno se perdía entre los cafetales y el otro bajaba hacia la quebrada.", opciones: [
        { t: "Meterse entre los cafetales", va: "n3a" },
        { t: "Bajar hacia la quebrada", va: "n3b" }
      ] },
      n2b: { texto: "Le mostró el mapa a doña Marta, la vecina, que conocía todos los rincones del pueblo. Ella señaló una esquina: «Ese dibujo es del tiempo de los rieles del tren».", opciones: [
        { t: "Ir juntos a buscar los rieles", va: "n3c" },
        { t: "Convencerla de ir a la quebrada", va: "n3b" }
      ] },
      n3a: { texto: "Entre las matas de café encontró una caja de madera muy vieja. Al abrirla, había cartas y una foto de un joven con sombrero.", opciones: [
        { t: "Leer las cartas en voz alta", va: "f1" },
        { t: "Cerrar la caja y llevarla al pueblo", va: "f2" }
      ] },
      n3b: { texto: "En la quebrada, el agua había borrado el dibujo. Solo quedaba una piedra con una letra tallada: una M.", opciones: [
        { t: "Buscar más pistas río arriba", va: "f1" },
        { t: "Rendirse y volver a casa", va: "f3" }
      ] },
      n3c: { texto: "Siguiendo los rieles viejos llegaron a una estación abandonada. En la pared había un mapa igual al del abuelo, con una nota pegada.", opciones: [
        { t: "Leer la nota en voz alta", va: "f2" },
        { t: "Guardar silencio y mirar con atención", va: "f1" }
      ] },
      f1: { final: true, texto: "El tesoro era una historia: el abuelo, de joven, había escondido allí los recuerdos de su familia. {nom} los rescató y los contó en el pueblo. Desde entonces, nadie olvidó esas historias.", moraleja: "El tesoro más grande es la memoria de los que vinieron antes." },
      f2: { final: true, texto: "Al volver, el pueblo entero quiso ver la caja. Entre cartas y fotos armaron la historia del abuelo. {nom} entendió que un hallazgo se multiplica cuando se comparte.", moraleja: "Compartir lo que encontramos lo hace valer el doble." },
      f3: { final: true, texto: "Aunque no siguió buscando, {nom} se quedó pensando en la letra M y en la nota que no leyó. A veces el tesoro está a un paso más.", moraleja: "No rendirse a la primera es parte de toda aventura." }
    }
  },
  {
    t: "La libreta de don Aquileo", nivel: "M", inicio: "n1",
    nodos: {
      n1: { texto: "En la biblioteca del pueblo, {nom} encontró una libreta forrada en tela que nadie había abierto en años. En la primera página decía: «Aquí guardo las palabras que no quiero perder».", opciones: [
        { t: "Abrir la libreta y leer la primera página", va: "n2a" },
        { t: "Preguntar quién la escribió", va: "n2b" }
      ] },
      n2a: { texto: "La letra era antigua y hermosa. Hablaba de un pueblo de casas de adobe, de fiestas con cimarrona y de un río donde lavaban la ropa. Cada página tenía olor a tiempo.", opciones: [
        { t: "Copiar algunas palabras", va: "n3a" },
        { t: "Leerla completa de un tirón", va: "n3b" }
      ] },
      n2b: { texto: "La bibliotecaria revisó el registro: «Fue de don Aquileo, un maestro que enseñó aquí por cuarenta años». Guardaba la libreta por si alguien se interesaba.", opciones: [
        { t: "Pedir prestada la libreta", va: "n2a" },
        { t: "Dejarla donde está y leerla ahí mismo", va: "n3b" }
      ] },
      n3a: { texto: "Copió en su cuaderno las palabras más bonitas: «zaguán», «cocorí», «la madrugada huele a café». Al repartirlas, los vecinos empezaron a recordar sus propias palabras.", opciones: [
        { t: "Armar un mural de palabras del pueblo", va: "f1" },
        { t: "Guardar su cuaderno en secreto", va: "f3" }
      ] },
      n3b: { texto: "Leyó la libreta completa. Al final había una lista: «Palabras que me enseñó mi abuela». Muchas de esas palabras {nom} no las conocía, pero le sonaban al corazón.", opciones: [
        { t: "Buscar a alguien que las explique", va: "f1" },
        { t: "Anotarlas sin preguntar", va: "f2" }
      ] },
      f1: { final: true, texto: "El mural quedó lleno de palabras ticas. Los mayores explicaban y los jóvenes anotaban. {nom} logró que la libreta de don Aquileo volviera a hablar.", moraleja: "Las palabras se pierden si no hay quien las cuente." },
      f2: { final: true, texto: "Aunque nadie le explicó, {nom} guardó las palabras y las fue usando. Con el tiempo descubrió que la libreta había sido, en realidad, un regalo para quien se detuviera a leerla.", moraleja: "Leer despacio también es una forma de escuchar." },
      f3: { final: true, texto: "El cuaderno quedó guardado. Años después, {nom} lo encontró y lamentó no haber compartido aquellas palabras hermosas con nadie.", moraleja: "Lo bueno que no se comparte termina olvidándose." }
    }
  }
];

