### Smart Auto Detection

`getSidebarRoutes()` akan secara otomatis mendeteksi:

- `/pages` atau `/app`
- di dalam `/src` atau root directory
- Berfungsi dengan file `.js`, `.ts`, `.jsx`, `.tsx`, `.mdx`

---

### Usage

Fungsi `getSidebarRoutes` **hanya boleh dipanggil di sisi server** pada aplikasi Next.js, seperti di dalam `getStaticProps`, `getServerSideProps`, atau API route. Jangan memanggil fungsi ini secara langsung di komponen React karena menggunakan modul `fs` yang hanya tersedia di lingkungan Node.js (server-side).

#### Contoh penggunaan di halaman Next.js:

```ts
// pages/sidebar.tsx
import { GetStaticProps } from 'next';
import { getSidebarRoutes } from 'zenn-next-sidebar';

export const getStaticProps: GetStaticProps = async () => {
  const routes = getSidebarRoutes();
  return {
    props: { routes },
  };
};

export default function SidebarPage({ routes }) {
  return (
    <nav>
      <ul>
        {routes.map(route => (
          <li key={route.path}>
            <a href={route.path}>{route.name}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

#### Contoh penggunaan di API Route:

```ts
// pages/api/sidebar-routes.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSidebarRoutes } from 'zenn-next-sidebar';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const routes = getSidebarRoutes();
  res.status(200).json(routes);
}
```

---

### Kenapa Tidak Boleh di Komponen React?

Fungsi `getSidebarRoutes` menggunakan modul `fs` dari Node.js untuk membaca struktur file. Jika dipanggil di komponen React (client-side), akan terjadi error seperti `Module not found: Can't resolve 'fs'` karena modul tersebut tidak tersedia di browser.

---

### Troubleshooting

- **Error: Module not found: Can't resolve 'fs'**
  - Pastikan `getSidebarRoutes` hanya dipanggil di server-side (misal: `getStaticProps`, `getServerSideProps`, atau API route).
  - Jangan import atau eksekusi fungsi ini di dalam komponen React atau kode yang berjalan di client-side.

- **Integrasi ke Komponen Sidebar/Navigasi**
  - Ambil hasil dari `getSidebarRoutes` di server-side, lalu kirimkan ke komponen React melalui props.
  - Gunakan hasilnya untuk membangun navigasi sidebar secara dinamis.

---

### Tips

- Jika struktur folder Next.js Anda tidak standar, Anda bisa mengatur parameter `baseDir` pada `getSidebarRoutes(baseDir)`.
- Fungsi ini hanya mendeteksi file dengan ekstensi `.js`, `.ts`, `.jsx`, `.tsx`, `.mdx` dan mengabaikan file/folder yang diawali `_`, `.`, atau folder `api`.
