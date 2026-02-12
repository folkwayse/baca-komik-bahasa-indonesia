# KomikIndo

Platform baca manga online dengan pengalaman membaca yang nyaman.

## Latar Belakang

Proyek ini dibuat karena saya suka baca komik, tapi tidak menemukan platform dengan alur baca yang nyaman. Sebagian besar situs baca komik memiliki:

- Tampilan yang berantakan dan penuh iklan
- Navigasi yang membingungkan antar chapter
- Tidak ada fitur untuk melacak progres bacaan
- Pengalaman mobile yang kurang optimal

KomikIndo hadir sebagai solusi dengan fokus pada **pengalaman membaca yang nyaman**.

## Fitur Utama

- Baca manga dengan tampilan yang bersih dan modern
- Dark mode untuk kenyamanan mata
- Bookmark manga favorit
- Riwayat baca otomatis tersimpan
- Navigasi mudah antar chapter
- Responsive design untuk desktop dan mobile
- Pencarian manga cepat

## Tech Stack

- [Nuxt 4](https://nuxt.com/) - Vue.js Framework
- [Vue 3](https://vuejs.org/) - Frontend Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Pinia](https://pinia.vuejs.org/) - State Management
- [VueUse](https://vueuse.org/) - Vue Composables

## Memulai

### Prasyarat

- Node.js 18+
- pnpm 10.28.2

### Instalasi

```bash
# Install dependencies
pnpm install

# Jalankan development server
pnpm dev

# Buka http://localhost:3000
```

### Perintah Lainnya

```bash
# Build untuk production
pnpm build

# Preview production build
pnpm preview

# Jalankan ESLint
pnpm lint

# TypeScript type checking
pnpm typecheck
```

## Struktur Proyek

```
app/
├── components/     # Komponen Vue (auto-imported)
├── composables/    # Composables (auto-imported)
├── pages/          # File-based routing
├── stores/         # Pinia stores
├── assets/         # CSS dan assets
└── app.vue         # Root component

server/
└── api/            # Server API routes
```

## License

MIT
