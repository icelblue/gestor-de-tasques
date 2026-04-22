# GT · Gestor de Tasques

App frontal de gestió de tasques, **100% local** al navegador (localStorage). Cap servidor, cap compte, cap dependència backend.

## ✨ Funcionalitats

- **Tasques** amb prioritat (1–5), data, estat, etiquetes i descripció rica.
- **Descripció rica** amb captures de pantalla **intercalades amb el text**: enganxa amb `Ctrl+V` dins l'editor.
- **Recurrència** sòlida: diària, setmanal (amb dies marcats), quinzenal i mensual, amb final per ocurrències o data inclusiva. El motor té proves de regressió.
- **Notes de reunió** amb el mateix editor ric (text + captures intercalades) i conversió directa a tasques (`Nom | Prioritat | Data | Etiqueta`).
- **Calendari mensual** amb filtrat per dia.
- **Etiquetes** automàtiques amb gestió i color determinista.
- **Informe mensual** (només mostra mesos amb tasques) amb friendly copy + export CSV (UTF-8 BOM).
- **Importació** en bloc (text amb `|` o CSV).
- **Enllaços** al panell lateral.
- **Còpia de seguretat** export/import JSON.
- **i18n**: Català, Castellà, Anglès amb el mateix nivell d'informació al help.
- **Dreceres**: `Ctrl+V` (enganxa text/captura), `Ctrl+Enter` (guarda tasca), `Esc` (tanca modal).

## 🧱 Arquitectura

```
src/
├── lib/gt/
│   ├── types.ts        # Tipus de domini (Task, Recurrence, …)
│   ├── i18n.ts         # Diccionaris ca/es/en
│   ├── utils.ts        # Helpers (date, tags, parseTextLines, htmlToPlain, CSV)
│   ├── recurrence.ts   # Motor de recurrència amb proves de regressió
│   └── store.ts        # Hooks de localStorage (tasks, notes, links, lang)
├── components/gt/
│   ├── Modal.tsx, Toast.tsx, buttons.tsx
│   ├── RichNotes.tsx   # Editor contentEditable amb captures inline
│   ├── TaskList.tsx, TaskModal.tsx
│   ├── NotesPanel.tsx, CalendarPanel.tsx, LinksPanel.tsx, TagLegend.tsx
│   └── ReportModal.tsx, ImportModal.tsx, BackupModal.tsx, HelpModal.tsx
└── routes/index.tsx    # Composició principal
```

## 🐛 Bugs corregits respecte al HTML monolític original

1. **`endDate` no era inclusiva** → ara sí (es força fi de dia).
2. **`parseISO` interpretava ISO com a UTC** i desplaçava el dia. Ara local.
3. **Setmanal amb dies buits** queia silenciosament. Ara cau a la setmana base.
4. **Quinzenal incorrecte**: emetia tots els dies de la setmana i avançava 14 dies. Corregit.
5. **Mensual** no clampava a final de mes (31 gen → 3 mar). Ara clampa a `min(day, lastDay)`.
6. **Cap límit dur** als bucles → MAX_OCCURRENCES = 366.
7. **Editar una tasca de sèrie** no recuperava la config: ara s'infereix dels germans.
8. **Notes/captures**: abans hi havia una galeria al final separada del text. Ara són inline dins la descripció (text → imatge → text).

## 🧪 Proves de regressió (9/9 ✓)

Cobrim: daily, weekly multi-dies, biweekly, mensual amb clamp 31→28/29, fi de data inclusiva, dies buits, disabled, count=0, fi abans del base.

## 🚀 Ús local

```bash
bun install
bun run dev
```

Tot el codi és frontal, no necessita configuració extra.

## 📦 Estructura del ZIP

El zip inclou `src/`, `package.json`, `tsconfig.json`, `vite.config.ts`, `wrangler.jsonc`, `components.json`, `eslint.config.js`, `.prettierrc`, `bunfig.toml` i aquest `README.md`. Després de descomprimir: `bun install && bun run dev`.
