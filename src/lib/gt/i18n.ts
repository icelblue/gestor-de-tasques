import type { Lang, Priority } from "./types";

export const LANGS: Lang[] = ["ca", "es", "en"];

export type Dict = {
  appTitle: string;
  appSub: string;
  headerOutline: string;
  headerAccent: string;
  bannerText: string;
  bannerExport: string;

  // stats / filters
  total: string;
  pending: string;
  done: string;
  today: string;
  week: string;
  urgent: string;
  showAll: string;

  // toolbar
  newTask: string;
  importBtn: string;
  reportBtn: string;
  helpBtn: string;
  backupBtn: string;
  searchPH: string;

  // list
  emptyTitle: string;
  emptySub: string;
  noMatches: string;

  // priorities
  pri: Record<Priority, string>;
  priShort: Record<Priority, string>;
  priName: Record<Priority, string>;

  // statuses
  statusPendent: string;
  statusFeta: string;

  // urgency text
  urgToday: string;
  urgTomorrow: string;
  urgLeftFn: (n: number) => string;
  urgOverdueFn: (n: number) => string;

  // task modal
  modalNew: string;
  modalEdit: string;
  lblName: string;
  lblPriority: string;
  lblDate: string;
  lblStatus: string;
  lblTag: string;
  lblNotes: string;
  namePH: string;
  tagPH: string;
  notesPH: string;
  taskImgHint: string;
  taskImgPasted: string;
  taskImgError: string;
  btnSave: string;
  btnCancel: string;
  btnDelete: string;
  confirmDelete: string;

  // recurrence
  recLabel: string;
  recDaily: string;
  recWeekly: string;
  recBiweekly: string;
  recMonthly: string;
  recSelectDays: string;
  recEndLabel: string;
  recAfter: string;
  recOccurrences: string;
  recUntil: string;
  recNever: string;
  recPreviewDaily: string;
  recPreviewWeekly: string;
  recPreviewBiweekly: string;
  recPreviewMonthly: string;
  recAddedExtra: string;
  recReplaceSeries: string;
  recKeepOnly: string;
  recValidationDays: string;
  recValidationDate: string;

  dayNamesShort: string[];
  monthNames: string[];

  // notes panel
  notesTitle: string;
  notesPlaceholder: string;
  notesCopyFriendly: string;
  notesDownload: string;
  notesCreateTasks: string;
  notesInsert: string;
  notesPasteHint: string;
  notesNoTasks: string;
  notesCreated: (n: number) => string;

  // links
  linksTitle: string;
  linksUrlPH: string;
  linksTitlePH: string;
  linksCopy: string;

  // tags
  tagsLegendTitle: string;
  tagsManage: string;
  tagsManageDone: string;
  tagsConfirmDelete: (tag: string, n: number) => string;

  // calendar
  calTitle: string;
  calClearDay: string;
  calLegend: string;

  // import modal
  importTitle: string;
  importHelp: string;
  impFormatBox: string;
  pastePH: string;
  qsBig: string;
  qsSub: string;
  qsCardTitle: string;
  qsCardSub: string;
  qsOr: string;
  qsLinkNew: string;
  qsLinkImport: string;
  qsCreate: string;
  importedFn: (n: number) => string;
  noTasksFound: string;

  // report modal
  reportTitle: string;
  reportSub: string;
  reportMonth: string;
  reportYear: string;
  reportNoMonths: string;
  reportTotal: string;
  reportDone: string;
  reportPending: string;
  reportCopyFriendly: string;
  reportExportCsv: string;
  reportCopied: string;
  reportSection: (label: string) => string;

  // backup modal
  backupTitle: string;
  backupSub: string;
  backupExport: string;
  backupImport: string;
  backupClear: string;
  backupClearConfirm: string;
  backupRestoreConfirm: (n: number) => string;
  backupInvalid: string;
  backupExported: string;
  backupRestored: (n: number) => string;
  backupCleared: string;

  // help modal
  helpTitle: string;
  helpOk: string;
  helpBody: string;

  // generic
  ok: string;
  cancel: string;
  yes: string;
  no: string;
};

const dayNamesShortCa = ["Dg", "Dl", "Dm", "Dc", "Dj", "Dv", "Ds"];
const dayNamesShortEs = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];
const dayNamesShortEn = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const monthsCa = ["Gener","Febrer","Març","Abril","Maig","Juny","Juliol","Agost","Setembre","Octubre","Novembre","Desembre"];
const monthsEs = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const monthsEn = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const helpBodyCa = `
<div class="help-section">
  <h3>🚀 Inici ràpid</h3>
  <p>Crea tasques amb el botó <b>+ Nova</b>, importa-les en bloc o copia-les des de les notes de reunió. Marca-les com a <b>fetes</b> clicant el cercle. Filtra des de les estadístiques superiors, per <b>etiqueta</b>, per <b>dia del calendari</b> o amb el cercador.</p>
  <p>Tot es guarda automàticament al teu navegador (localStorage). Cap servidor, cap compte.</p>
</div>
<div class="help-section">
  <h3>📝 Editor de tasques</h3>
  <p>A cada tasca pots definir: <b>nom</b>, <b>prioritat</b> (1 urgent → 5 baixa), <b>data</b>, <b>estat</b>, <b>etiquetes</b> (separades per <code>;</code>) i una <b>descripció rica</b>.</p>
  <p>A la <b>descripció</b> pots <b>enganxar captures de pantalla</b> amb <code>Ctrl+V</code> i intercalar-les amb text: escriu, enganxa imatge, segueix escrivint sota — tot queda dins la mateixa nota.</p>
  <p>Snippet: <code>Ctrl+Enter</code> guarda la tasca.</p>
</div>
<div class="help-section">
  <h3>🔁 Repetició / Recurrència</h3>
  <p>Quan crees o edites una tasca <b>amb data</b>, pots activar la repetició:</p>
  <p>• <b>Diari</b> — cada dia després del dia base.<br>
     • <b>Setmanal</b> — selecciona els dies de la setmana (dl, dt…).<br>
     • <b>Quinzenal</b> — com el setmanal, però cada 2 setmanes.<br>
     • <b>Mensual</b> — el mateix dia del mes (es retalla a final de mes si cal: 31 gener → 28/29 febrer).</p>
  <p>El final es defineix per <b>nombre d'ocurrències addicionals</b> o per <b>data límit inclusiva</b>.</p>
  <p>En editar una tasca d'una sèrie, l'editor recupera els paràmetres aproximats. Marca <b>"Substituir tota la sèrie"</b> per esborrar les ocurrències antigues abans de regenerar-ne de noves.</p>
</div>
<div class="help-section">
  <h3>📋 Notes de reunió</h3>
  <p>Pren apunts ràpidament amb format <code>Nom | Prioritat | Data | Etiqueta</code>. Una línia per tasca. També pots <b>enganxar captures intercalades amb el text</b>.</p>
  <p>Botons: <b>📋 Copiar</b> (versió bonica amb vinyetes), <b>⬇ CSV</b> (descarrega el bloc de tasques) i <b>→ Convertir en tasques</b> (les afegeix a la llista).</p>
</div>
<div class="help-section">
  <h3>📅 Calendari</h3>
  <p>Vista mensual amb totes les tasques. <b>Clica un dia</b> per filtrar la llista. Els colors indiquen urgència: vermell = urgent/vençut, blau = pendent, verd = tot fet.</p>
</div>
<div class="help-section">
  <h3>🏷 Etiquetes</h3>
  <p>Les etiquetes es generen automàticament. Clica una per filtrar. Activa <b>⚙ gestionar</b> per eliminar-les a totes les tasques alhora.</p>
</div>
<div class="help-section">
  <h3>📊 Informe mensual</h3>
  <p>Resum del mes seleccionat (només apareixen mesos amb tasques) amb fetes/pendents per etiqueta. Botons <b>📋 Copiar friendly</b> i <b>⬇ Exportar CSV</b> (UTF-8 amb BOM, obre directe a Excel).</p>
</div>
<div class="help-section">
  <h3>↥ Importació en bloc</h3>
  <p>Enganxa una llista (text amb <code>|</code> o CSV amb <code>;</code> / <code>,</code>). Reconeix dates <code>dd/mm/aaaa</code>, <code>aaaa-mm-dd</code> i prioritats per paraula clau (urgent, alta, mitjana, baixa).</p>
</div>
<div class="help-section">
  <h3>🔗 Enllaços</h3>
  <p>Guarda enllaços útils al panell lateral. <b>📋 Copiar tots</b> els copia formatats al porta-retalls.</p>
</div>
<div class="help-section">
  <h3>💾 Còpia de seguretat</h3>
  <p>Tot es guarda al teu navegador. Exporta <b>JSON</b> per fer còpia, restaura quan vulguis. <b>🗑 Esborrar tot</b> elimina les dades (no es pot desfer).</p>
</div>
<div class="help-section">
  <h3>⌨ Dreceres</h3>
  <p><code>Ctrl+V</code> dins notes/descripció: enganxa text o captura.<br>
     <code>Ctrl+Enter</code> dins l'editor de tasques: guarda.<br>
     <code>Esc</code>: tanca el modal actiu.</p>
</div>`;

const helpBodyEs = `
<div class="help-section">
  <h3>🚀 Inicio rápido</h3>
  <p>Crea tareas con el botón <b>+ Nueva</b>, impórtalas en bloque o cópialas desde las notas de reunión. Márcalas como <b>hechas</b> haciendo clic en el círculo. Filtra desde las estadísticas superiores, por <b>etiqueta</b>, por <b>día del calendario</b> o con el buscador.</p>
  <p>Todo se guarda automáticamente en tu navegador (localStorage). Sin servidor, sin cuentas.</p>
</div>
<div class="help-section">
  <h3>📝 Editor de tareas</h3>
  <p>En cada tarea puedes definir: <b>nombre</b>, <b>prioridad</b> (1 urgente → 5 baja), <b>fecha</b>, <b>estado</b>, <b>etiquetas</b> (separadas por <code>;</code>) y una <b>descripción rica</b>.</p>
  <p>En la <b>descripción</b> puedes <b>pegar capturas de pantalla</b> con <code>Ctrl+V</code> e intercalarlas con texto: escribe, pega imagen, sigue escribiendo debajo — todo queda dentro de la misma nota.</p>
  <p>Atajo: <code>Ctrl+Enter</code> guarda la tarea.</p>
</div>
<div class="help-section">
  <h3>🔁 Repetición / Recurrencia</h3>
  <p>Al crear o editar una tarea <b>con fecha</b>, puedes activar la repetición:</p>
  <p>• <b>Diaria</b> — cada día después del día base.<br>
     • <b>Semanal</b> — selecciona los días de la semana (lu, ma…).<br>
     • <b>Quincenal</b> — como la semanal, pero cada 2 semanas.<br>
     • <b>Mensual</b> — el mismo día del mes (se ajusta a fin de mes si hace falta: 31 enero → 28/29 febrero).</p>
  <p>El final se define por <b>número de ocurrencias adicionales</b> o por <b>fecha límite inclusiva</b>.</p>
  <p>Al editar una tarea de una serie, el editor recupera los parámetros aproximados. Marca <b>"Reemplazar toda la serie"</b> para borrar las ocurrencias antiguas antes de regenerar nuevas.</p>
</div>
<div class="help-section">
  <h3>📋 Notas de reunión</h3>
  <p>Toma notas rápidas con formato <code>Nombre | Prioridad | Fecha | Etiqueta</code>. Una línea por tarea. También puedes <b>pegar capturas intercaladas con el texto</b>.</p>
  <p>Botones: <b>📋 Copiar</b> (versión bonita con viñetas), <b>⬇ CSV</b> (descarga el bloque de tareas) y <b>→ Convertir en tareas</b> (las añade a la lista).</p>
</div>
<div class="help-section">
  <h3>📅 Calendario</h3>
  <p>Vista mensual con todas las tareas. <b>Haz clic en un día</b> para filtrar la lista. Los colores indican urgencia: rojo = urgente/vencido, azul = pendiente, verde = todo hecho.</p>
</div>
<div class="help-section">
  <h3>🏷 Etiquetas</h3>
  <p>Las etiquetas se generan automáticamente. Haz clic en una para filtrar. Activa <b>⚙ gestionar</b> para eliminarlas en todas las tareas a la vez.</p>
</div>
<div class="help-section">
  <h3>📊 Informe mensual</h3>
  <p>Resumen del mes seleccionado (solo aparecen meses con tareas) con hechas/pendientes por etiqueta. Botones <b>📋 Copiar friendly</b> y <b>⬇ Exportar CSV</b> (UTF-8 con BOM, abre directo en Excel).</p>
</div>
<div class="help-section">
  <h3>↥ Importación en bloque</h3>
  <p>Pega una lista (texto con <code>|</code> o CSV con <code>;</code> / <code>,</code>). Reconoce fechas <code>dd/mm/aaaa</code>, <code>aaaa-mm-dd</code> y prioridades por palabra clave (urgente, alta, media, baja).</p>
</div>
<div class="help-section">
  <h3>🔗 Enlaces</h3>
  <p>Guarda enlaces útiles en el panel lateral. <b>📋 Copiar todos</b> los copia formateados al portapapeles.</p>
</div>
<div class="help-section">
  <h3>💾 Copia de seguridad</h3>
  <p>Todo se guarda en tu navegador. Exporta <b>JSON</b> para hacer copia, restaura cuando quieras. <b>🗑 Borrar todo</b> elimina los datos (no se puede deshacer).</p>
</div>
<div class="help-section">
  <h3>⌨ Atajos</h3>
  <p><code>Ctrl+V</code> dentro de notas/descripción: pega texto o captura.<br>
     <code>Ctrl+Enter</code> dentro del editor de tareas: guarda.<br>
     <code>Esc</code>: cierra el modal activo.</p>
</div>`;

const helpBodyEn = `
<div class="help-section">
  <h3>🚀 Quick start</h3>
  <p>Create tasks with the <b>+ New</b> button, import them in bulk, or copy them from the meeting notes. Mark them as <b>done</b> by clicking the circle. Filter from the top stats, by <b>tag</b>, by <b>calendar day</b>, or with the search box.</p>
  <p>Everything is saved automatically in your browser (localStorage). No server, no accounts.</p>
</div>
<div class="help-section">
  <h3>📝 Task editor</h3>
  <p>For each task you can set: <b>name</b>, <b>priority</b> (1 urgent → 5 low), <b>date</b>, <b>status</b>, <b>tags</b> (separated by <code>;</code>), and a <b>rich description</b>.</p>
  <p>In the <b>description</b> you can <b>paste screenshots</b> with <code>Ctrl+V</code> and interleave them with text: type, paste an image, keep typing below — everything stays in the same note.</p>
  <p>Shortcut: <code>Ctrl+Enter</code> saves the task.</p>
</div>
<div class="help-section">
  <h3>🔁 Recurrence</h3>
  <p>When creating or editing a task <b>with a date</b>, you can enable recurrence:</p>
  <p>• <b>Daily</b> — every day after the base date.<br>
     • <b>Weekly</b> — pick the days of the week (Mon, Tue…).<br>
     • <b>Biweekly</b> — like weekly, but every 2 weeks.<br>
     • <b>Monthly</b> — same day of the month (clamps to month-end when needed: Jan 31 → Feb 28/29).</p>
  <p>End it by <b>number of additional occurrences</b> or by <b>inclusive end date</b>.</p>
  <p>When editing a task of a series, the editor recovers the approximate parameters. Tick <b>"Replace the whole series"</b> to wipe old occurrences before regenerating new ones.</p>
</div>
<div class="help-section">
  <h3>📋 Meeting notes</h3>
  <p>Take quick notes with the format <code>Name | Priority | Date | Tag</code>. One line per task. You can also <b>paste screenshots interleaved with the text</b>.</p>
  <p>Buttons: <b>📋 Copy</b> (pretty version with bullets), <b>⬇ CSV</b> (downloads the task block), and <b>→ Convert to tasks</b> (adds them to the list).</p>
</div>
<div class="help-section">
  <h3>📅 Calendar</h3>
  <p>Monthly view with all tasks. <b>Click a day</b> to filter the list. Colors indicate urgency: red = urgent/overdue, blue = pending, green = all done.</p>
</div>
<div class="help-section">
  <h3>🏷 Tags</h3>
  <p>Tags are generated automatically. Click one to filter. Toggle <b>⚙ manage</b> to remove a tag from all tasks at once.</p>
</div>
<div class="help-section">
  <h3>📊 Monthly report</h3>
  <p>Summary of the selected month (only months with tasks appear) with done/pending by tag. Buttons <b>📋 Friendly copy</b> and <b>⬇ Export CSV</b> (UTF-8 with BOM, opens directly in Excel).</p>
</div>
<div class="help-section">
  <h3>↥ Bulk import</h3>
  <p>Paste a list (text with <code>|</code> or CSV with <code>;</code> / <code>,</code>). Recognises <code>dd/mm/yyyy</code>, <code>yyyy-mm-dd</code> dates and priorities by keyword (urgent, high, medium, low).</p>
</div>
<div class="help-section">
  <h3>🔗 Links</h3>
  <p>Save useful links in the side panel. <b>📋 Copy all</b> copies them formatted to the clipboard.</p>
</div>
<div class="help-section">
  <h3>💾 Backup</h3>
  <p>Everything is stored in your browser. Export <b>JSON</b> for backup, restore whenever you want. <b>🗑 Clear all</b> wipes the data (cannot be undone).</p>
</div>
<div class="help-section">
  <h3>⌨ Shortcuts</h3>
  <p><code>Ctrl+V</code> inside notes/description: paste text or screenshot.<br>
     <code>Ctrl+Enter</code> inside the task editor: save.<br>
     <code>Esc</code>: close the active modal.</p>
</div>`;

// (helpBodyEs and helpBodyEn defined above)

const impFormatCa = `# Una tasca per línia, separada per | (opcional)
# Format complet:  Nom | Prioritat | Data | Etiqueta
# Prioritats: 1 (urgent) … 5 (baixa) o paraules: urgent, alta, mitjana, baixa
# Dates: dd/mm/aaaa  o  aaaa-mm-dd
#
# Exemples:
Acabar informe trimestral | 2 | 30/06/2025 | feina
Reservar dentista | 3 | 2025-07-12 | salut
Llegir llibre nou | baixa
Trucar a la Marta`;

const impFormatEs = `# Una tarea por línea, separada por | (opcional)
# Formato completo:  Nombre | Prioridad | Fecha | Etiqueta
# Prioridades: 1 (urgente) … 5 (baja) o palabras: urgente, alta, media, baja
# Fechas: dd/mm/aaaa  o  aaaa-mm-dd
#
# Ejemplos:
Acabar informe trimestral | 2 | 30/06/2025 | trabajo
Reservar dentista | 3 | 2025-07-12 | salud
Leer libro nuevo | baja
Llamar a Marta`;

const impFormatEn = `# One task per line, separated by | (optional)
# Full format:  Name | Priority | Date | Tag
# Priorities: 1 (urgent) … 5 (low) or words: urgent, high, medium, low
# Dates: dd/mm/yyyy  or  yyyy-mm-dd
#
# Examples:
Finish quarterly report | 2 | 06/30/2025 | work
Book dentist | 3 | 2025-07-12 | health
Read new book | low
Call Marta`;

export const DICTS: Record<Lang, Dict> = {
  ca: {
    appTitle: "GT · GESTOR DE TASQUES",
    appSub: "LOCAL · RÀPID · SENSE COMPTES",
    headerOutline: "GESTOR DE",
    headerAccent: "TASQUES",
    bannerText: "Les teves dades es guarden <b>només al teu navegador</b>. Fes còpies regularment.",
    bannerExport: "⬇ Còpia",

    total: "Total",
    pending: "Pendents",
    done: "Fetes",
    today: "Avui",
    week: "Setmana",
    urgent: "Urgents",
    showAll: "Mostrar totes",

    newTask: "+ Nova tasca",
    importBtn: "↥ Importar",
    reportBtn: "📊 Informe",
    helpBtn: "?",
    backupBtn: "💾",
    searchPH: "Cercar tasques…",

    emptyTitle: "Cap tasca encara",
    emptySub: "Crea la primera o importa-les en bloc",
    noMatches: "Cap resultat amb aquests filtres",

    pri: { 1: "1 · Urgent", 2: "2 · Alta", 3: "3 · Mitjana", 4: "4 · Normal", 5: "5 · Baixa" },
    priShort: { 1: "P1", 2: "P2", 3: "P3", 4: "P4", 5: "P5" },
    priName: { 1: "URGENT", 2: "ALTA", 3: "MITJANA", 4: "NORMAL", 5: "BAIXA" },

    statusPendent: "Pendent",
    statusFeta: "Feta",

    urgToday: "(avui)",
    urgTomorrow: "(demà)",
    urgLeftFn: (n) => `(${n}d)`,
    urgOverdueFn: (n) => `(-${n}d)`,

    modalNew: "Nova tasca",
    modalEdit: "Editar tasca",
    lblName: "Nom",
    lblPriority: "Prioritat",
    lblDate: "Data",
    lblStatus: "Estat",
    lblTag: "Etiquetes (separades per ;)",
    lblNotes: "Descripció / Notes",
    namePH: "Què cal fer?",
    tagPH: "feina; client; urgent",
    notesPH: "Detalls, context, enllaços…  (Ctrl+V per enganxar captures)",
    taskImgHint: "Ctrl+V dins la descripció per enganxar captures",
    taskImgPasted: "Captura afegida",
    taskImgError: "No s'ha pogut enganxar la captura",
    btnSave: "Guardar",
    btnCancel: "Cancel·lar",
    btnDelete: "Eliminar",
    confirmDelete: "Eliminar aquesta tasca?",

    recLabel: "Repetició",
    recDaily: "Diari",
    recWeekly: "Setmanal",
    recBiweekly: "Quinzenal",
    recMonthly: "Mensual",
    recSelectDays: "Dies de la setmana:",
    recEndLabel: "Final:",
    recAfter: "Després de",
    recOccurrences: "ocurrències",
    recUntil: "fins a",
    recNever: "Mai (forçat a 12)",
    recPreviewDaily: "Cada dia",
    recPreviewWeekly: "Cada setmana",
    recPreviewBiweekly: "Cada 2 setmanes",
    recPreviewMonthly: "Cada mes",
    recAddedExtra: "ocurrències addicionals creades",
    recReplaceSeries: "Substituir tota la sèrie?",
    recKeepOnly: "Només aquesta",
    recValidationDays: "Selecciona almenys un dia de la setmana",
    recValidationDate: "Necessites una data per repetir",

    dayNamesShort: dayNamesShortCa,
    monthNames: monthsCa,

    notesTitle: "NOTES DE REUNIÓ",
    notesPlaceholder: "# Format:  Nom | Prioritat | Data | Etiqueta\n\nReunió amb client | alta | 30/06/2025 | feina\nEnviar pressupost | urgent",
    notesCopyFriendly: "📋 Copiar",
    notesDownload: "⬇ CSV",
    notesCreateTasks: "→ Convertir en tasques",
    notesInsert: "Inserir:",
    notesPasteHint: "Ctrl+V per enganxar captures",
    notesNoTasks: "Cap tasca trobada al text",
    notesCreated: (n) => `✓ ${n} tasques creades des de notes`,

    linksTitle: "ENLLAÇOS",
    linksUrlPH: "https://…",
    linksTitlePH: "Títol",
    linksCopy: "Copiar tots",

    tagsLegendTitle: "ETIQUETES",
    tagsManage: "⚙ gestionar",
    tagsManageDone: "✓ fet",
    tagsConfirmDelete: (tag, n) => `Eliminar "${tag}" de ${n} tasques?`,

    calTitle: "CALENDARI",
    calClearDay: "Mostrar totes",
    calLegend: "Urgent · Aviat · Normal · Feta",

    importTitle: "Importar tasques",
    importHelp: "Enganxa una llista de tasques",
    impFormatBox: impFormatCa,
    pastePH: "Enganxa aquí…",
    qsBig: "GT",
    qsSub: "Comença creant la primera tasca",
    qsCardTitle: "Importar en bloc",
    qsCardSub: "Una tasca per línia",
    qsOr: "O bé:",
    qsLinkNew: "Nova individual",
    qsLinkImport: "Format complet",
    qsCreate: "Crear tasques →",
    importedFn: (n) => `✓ ${n} tasques importades`,
    noTasksFound: "Cap tasca trobada",

    reportTitle: "INFORME MENSUAL",
    reportSub: "Resum de tasques per mes",
    reportMonth: "Mes",
    reportYear: "Any",
    reportNoMonths: "Encara no hi ha mesos amb tasques",
    reportTotal: "Total",
    reportDone: "Fetes",
    reportPending: "Pendents",
    reportCopyFriendly: "📋 Copiar friendly",
    reportExportCsv: "⬇ Exportar CSV",
    reportCopied: "📋 Informe copiat",
    reportSection: (label) => `── ${label} ──`,

    backupTitle: "CÒPIA DE SEGURETAT",
    backupSub: "Exporta o restaura totes les dades",
    backupExport: "⬇ Exportar JSON",
    backupImport: "↥ Restaurar JSON",
    backupClear: "🗑 Esborrar tot",
    backupClearConfirm: "Esborrar totes les dades? No es pot desfer.",
    backupRestoreConfirm: (n) => `Restaurar ${n} tasques? Les actuals es perdran.`,
    backupInvalid: "Fitxer no vàlid",
    backupExported: "✓ Exportat",
    backupRestored: (n) => `✓ ${n} tasques restaurades`,
    backupCleared: "Tot esborrat",

    helpTitle: "AJUDA",
    helpOk: "Entesos",
    helpBody: helpBodyCa,

    ok: "D'acord", cancel: "Cancel·lar", yes: "Sí", no: "No",
  },
  es: {
    appTitle: "GT · GESTOR DE TAREAS",
    appSub: "LOCAL · RÁPIDO · SIN CUENTAS",
    headerOutline: "GESTOR DE",
    headerAccent: "TAREAS",
    bannerText: "Tus datos se guardan <b>solo en tu navegador</b>. Haz copias regularmente.",
    bannerExport: "⬇ Copia",

    total: "Total", pending: "Pendientes", done: "Hechas", today: "Hoy",
    week: "Semana", urgent: "Urgentes", showAll: "Mostrar todas",

    newTask: "+ Nueva tarea",
    importBtn: "↥ Importar",
    reportBtn: "📊 Informe",
    helpBtn: "?",
    backupBtn: "💾",
    searchPH: "Buscar tareas…",

    emptyTitle: "Sin tareas todavía",
    emptySub: "Crea la primera o impórtalas en bloque",
    noMatches: "Sin resultados con estos filtros",

    pri: { 1: "1 · Urgente", 2: "2 · Alta", 3: "3 · Media", 4: "4 · Normal", 5: "5 · Baja" },
    priShort: { 1: "P1", 2: "P2", 3: "P3", 4: "P4", 5: "P5" },
    priName: { 1: "URGENTE", 2: "ALTA", 3: "MEDIA", 4: "NORMAL", 5: "BAJA" },

    statusPendent: "Pendiente", statusFeta: "Hecha",

    urgToday: "(hoy)", urgTomorrow: "(mañana)",
    urgLeftFn: (n) => `(${n}d)`, urgOverdueFn: (n) => `(-${n}d)`,

    modalNew: "Nueva tarea", modalEdit: "Editar tarea",
    lblName: "Nombre", lblPriority: "Prioridad", lblDate: "Fecha",
    lblStatus: "Estado", lblTag: "Etiquetas (separadas por ;)", lblNotes: "Descripción / Notas",
    namePH: "¿Qué hay que hacer?", tagPH: "trabajo; cliente; urgente",
    notesPH: "Detalles, contexto, enlaces…  (Ctrl+V para pegar capturas)",
    taskImgHint: "Ctrl+V dentro de la descripción para pegar capturas",
    taskImgPasted: "Captura añadida",
    taskImgError: "No se ha podido pegar la captura",
    btnSave: "Guardar", btnCancel: "Cancelar", btnDelete: "Eliminar",
    confirmDelete: "¿Eliminar esta tarea?",

    recLabel: "Repetición",
    recDaily: "Diario", recWeekly: "Semanal", recBiweekly: "Quincenal", recMonthly: "Mensual",
    recSelectDays: "Días de la semana:",
    recEndLabel: "Final:",
    recAfter: "Después de", recOccurrences: "ocurrencias", recUntil: "hasta",
    recNever: "Nunca (forzado a 12)",
    recPreviewDaily: "Cada día", recPreviewWeekly: "Cada semana",
    recPreviewBiweekly: "Cada 2 semanas", recPreviewMonthly: "Cada mes",
    recAddedExtra: "ocurrencias adicionales creadas",
    recReplaceSeries: "¿Reemplazar toda la serie?",
    recKeepOnly: "Solo esta",
    recValidationDays: "Selecciona al menos un día de la semana",
    recValidationDate: "Necesitas una fecha para repetir",

    dayNamesShort: dayNamesShortEs, monthNames: monthsEs,

    notesTitle: "NOTAS DE REUNIÓN",
    notesPlaceholder: "# Formato:  Nombre | Prioridad | Fecha | Etiqueta\n\nReunión con cliente | alta | 30/06/2025 | trabajo\nEnviar presupuesto | urgente",
    notesCopyFriendly: "📋 Copiar", notesDownload: "⬇ CSV",
    notesCreateTasks: "→ Convertir en tareas",
    notesInsert: "Insertar:", notesPasteHint: "Ctrl+V para pegar capturas",
    notesNoTasks: "No se han encontrado tareas en el texto",
    notesCreated: (n) => `✓ ${n} tareas creadas desde notas`,

    linksTitle: "ENLACES", linksUrlPH: "https://…", linksTitlePH: "Título", linksCopy: "Copiar todos",

    tagsLegendTitle: "ETIQUETAS",
    tagsManage: "⚙ gestionar", tagsManageDone: "✓ hecho",
    tagsConfirmDelete: (tag, n) => `¿Eliminar "${tag}" de ${n} tareas?`,

    calTitle: "CALENDARIO", calClearDay: "Mostrar todas",
    calLegend: "Urgente · Pronto · Normal · Hecha",

    importTitle: "Importar tareas", importHelp: "Pega una lista de tareas",
    impFormatBox: impFormatEs, pastePH: "Pega aquí…",
    qsBig: "GT", qsSub: "Empieza creando la primera tarea",
    qsCardTitle: "Importar en bloque", qsCardSub: "Una tarea por línea",
    qsOr: "O bien:", qsLinkNew: "Nueva individual", qsLinkImport: "Formato completo",
    qsCreate: "Crear tareas →",
    importedFn: (n) => `✓ ${n} tareas importadas`,
    noTasksFound: "No se han encontrado tareas",

    reportTitle: "INFORME MENSUAL", reportSub: "Resumen de tareas por mes",
    reportMonth: "Mes", reportYear: "Año",
    reportNoMonths: "Aún no hay meses con tareas",
    reportTotal: "Total", reportDone: "Hechas", reportPending: "Pendientes",
    reportCopyFriendly: "📋 Copiar friendly", reportExportCsv: "⬇ Exportar CSV",
    reportCopied: "📋 Informe copiado",
    reportSection: (label) => `── ${label} ──`,

    backupTitle: "COPIA DE SEGURIDAD", backupSub: "Exporta o restaura todos los datos",
    backupExport: "⬇ Exportar JSON", backupImport: "↥ Restaurar JSON", backupClear: "🗑 Borrar todo",
    backupClearConfirm: "¿Borrar todos los datos? No se puede deshacer.",
    backupRestoreConfirm: (n) => `¿Restaurar ${n} tareas? Las actuales se perderán.`,
    backupInvalid: "Archivo no válido",
    backupExported: "✓ Exportado",
    backupRestored: (n) => `✓ ${n} tareas restauradas`,
    backupCleared: "Todo borrado",

    helpTitle: "AYUDA", helpOk: "Entendido", helpBody: helpBodyEs,
    ok: "OK", cancel: "Cancelar", yes: "Sí", no: "No",
  },
  en: {
    appTitle: "GT · TASK MANAGER",
    appSub: "LOCAL · FAST · NO ACCOUNTS",
    headerOutline: "TASK",
    headerAccent: "MANAGER",
    bannerText: "Your data lives <b>only in your browser</b>. Back it up regularly.",
    bannerExport: "⬇ Backup",

    total: "Total", pending: "Pending", done: "Done", today: "Today",
    week: "Week", urgent: "Urgent", showAll: "Show all",

    newTask: "+ New task", importBtn: "↥ Import", reportBtn: "📊 Report",
    helpBtn: "?", backupBtn: "💾", searchPH: "Search tasks…",

    emptyTitle: "No tasks yet",
    emptySub: "Create your first task or import them in bulk",
    noMatches: "No results with these filters",

    pri: { 1: "1 · Urgent", 2: "2 · High", 3: "3 · Medium", 4: "4 · Normal", 5: "5 · Low" },
    priShort: { 1: "P1", 2: "P2", 3: "P3", 4: "P4", 5: "P5" },
    priName: { 1: "URGENT", 2: "HIGH", 3: "MEDIUM", 4: "NORMAL", 5: "LOW" },

    statusPendent: "Pending", statusFeta: "Done",

    urgToday: "(today)", urgTomorrow: "(tomorrow)",
    urgLeftFn: (n) => `(${n}d)`, urgOverdueFn: (n) => `(-${n}d)`,

    modalNew: "New task", modalEdit: "Edit task",
    lblName: "Name", lblPriority: "Priority", lblDate: "Date",
    lblStatus: "Status", lblTag: "Tags (separated by ;)", lblNotes: "Description / Notes",
    namePH: "What needs to be done?", tagPH: "work; client; urgent",
    notesPH: "Details, context, links…  (Ctrl+V to paste screenshots)",
    taskImgHint: "Ctrl+V inside the description to paste screenshots",
    taskImgPasted: "Screenshot added",
    taskImgError: "Could not paste the screenshot",
    btnSave: "Save", btnCancel: "Cancel", btnDelete: "Delete",
    confirmDelete: "Delete this task?",

    recLabel: "Recurrence",
    recDaily: "Daily", recWeekly: "Weekly", recBiweekly: "Biweekly", recMonthly: "Monthly",
    recSelectDays: "Days of the week:",
    recEndLabel: "Ends:",
    recAfter: "After", recOccurrences: "occurrences", recUntil: "until",
    recNever: "Never (capped at 12)",
    recPreviewDaily: "Every day", recPreviewWeekly: "Every week",
    recPreviewBiweekly: "Every 2 weeks", recPreviewMonthly: "Every month",
    recAddedExtra: "extra occurrences created",
    recReplaceSeries: "Replace the whole series?",
    recKeepOnly: "Only this one",
    recValidationDays: "Select at least one weekday",
    recValidationDate: "A date is required to repeat",

    dayNamesShort: dayNamesShortEn, monthNames: monthsEn,

    notesTitle: "MEETING NOTES",
    notesPlaceholder: "# Format:  Name | Priority | Date | Tag\n\nMeeting with client | high | 06/30/2025 | work\nSend quote | urgent",
    notesCopyFriendly: "📋 Copy", notesDownload: "⬇ CSV",
    notesCreateTasks: "→ Convert to tasks",
    notesInsert: "Insert:", notesPasteHint: "Ctrl+V to paste screenshots",
    notesNoTasks: "No tasks found in text",
    notesCreated: (n) => `✓ ${n} tasks created from notes`,

    linksTitle: "LINKS", linksUrlPH: "https://…", linksTitlePH: "Title", linksCopy: "Copy all",

    tagsLegendTitle: "TAGS",
    tagsManage: "⚙ manage", tagsManageDone: "✓ done",
    tagsConfirmDelete: (tag, n) => `Remove "${tag}" from ${n} tasks?`,

    calTitle: "CALENDAR", calClearDay: "Show all",
    calLegend: "Urgent · Soon · Normal · Done",

    importTitle: "Import tasks", importHelp: "Paste a list of tasks",
    impFormatBox: impFormatEn, pastePH: "Paste here…",
    qsBig: "GT", qsSub: "Start by creating the first task",
    qsCardTitle: "Bulk import", qsCardSub: "One task per line",
    qsOr: "Or:", qsLinkNew: "Single new", qsLinkImport: "Full format",
    qsCreate: "Create tasks →",
    importedFn: (n) => `✓ ${n} tasks imported`,
    noTasksFound: "No tasks found",

    reportTitle: "MONTHLY REPORT", reportSub: "Tasks summary by month",
    reportMonth: "Month", reportYear: "Year",
    reportNoMonths: "No months with tasks yet",
    reportTotal: "Total", reportDone: "Done", reportPending: "Pending",
    reportCopyFriendly: "📋 Friendly copy", reportExportCsv: "⬇ Export CSV",
    reportCopied: "📋 Report copied",
    reportSection: (label) => `── ${label} ──`,

    backupTitle: "BACKUP", backupSub: "Export or restore all data",
    backupExport: "⬇ Export JSON", backupImport: "↥ Restore JSON", backupClear: "🗑 Clear all",
    backupClearConfirm: "Clear all data? This cannot be undone.",
    backupRestoreConfirm: (n) => `Restore ${n} tasks? Current ones will be lost.`,
    backupInvalid: "Invalid file",
    backupExported: "✓ Exported",
    backupRestored: (n) => `✓ ${n} tasks restored`,
    backupCleared: "All cleared",

    helpTitle: "HELP", helpOk: "Got it", helpBody: helpBodyEn,
    ok: "OK", cancel: "Cancel", yes: "Yes", no: "No",
  },
};
