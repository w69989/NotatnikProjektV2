Notatnik AI

Aplikacja webowa umożliwiająca tworzenie, przechowywanie i inteligentną analizę notatek. Projekt wykorzystuje Vercel oraz bazę danych w chmurze Turso, oferując funkcje automatycznego tagowania i generowania streszczeń).

Główne Funkcjonalności

Inteligentna Analiza (AI): Automatyczne generowanie streszczeń i słów kluczowych dla każdej notatki.
System Kont: Bezpieczna rejestracja i logowanie.
Chmura Danych: Wszystkie dane przechowywane są w rozproszonej bazie danych Turso .
Wyszukiwanie Real-time: Błyskawiczne filtrowanie notatek po treści i tagach.
Responsywność: Pełne wsparcie dla urządzeń mobilnych i desktopowych.
System Kontaktowy: Zapisywanie wiadomości od użytkowników bezpośrednio w bazie danych.

Technologie

Frontend & Backend: Next.js 15
Język: TypeScript
Stylizacja: Tailwind CSS
Baza Danych: Turso
Ikony z: Lucide React
Dla czytelności kodu zastosowano: Prettier, ESLint

Aby uruchomić projekt lokalnie (niezalecane), sklonuj repozytorium

git clone [https://github.com/w69989/NotatnikProjektV2]
cd notatnik
npm run dev

Aplikacja będzie dostępna pod adresem [http://localhost:3000]
W przypadku uruchomienia lokalnego należy w .env.local uzupełnić następujące zmienne (Niezamieszczone w celu zachowania bezpieczeństwa)
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
GEMINI_API_KEY=
