## Eklenen Eklenti
- **FakeMuteAndDeafen** (`src/plugins/fakeMuteAndDeafen/index.tsx`)
  - Kendini sahte susturma (fake mute) ve sahte sağırlaştırma (fake deafen), hatta sahte kamera
  - Sahte mod aktifken konuşmaya ve duymaya devam edebiliyorsun
  - Ses cihazı sağ tık menüsüne "Sahte Susturma" ve "Sahte Sağırlaştırma",
    video cihazı menüsüne "Sahte Kamera" seçeneği ekleniyor
  - "Sağırlaştırınca otomatik sahte sustur" ayarı var (varsayılan açık)
  - Sahte değişiklikler yapılırken Discord'un mute/unmute sesleri otomatik kapatılıp geri açılıyor

## Düzeltilen Hatalar
1. **`authors: [Devs.TheArmagan]` yanlış** — `TheArmagan` bu depoda `Devs` içinde yok, `PcDevs`
   içinde. Crash / build hatası veriyordu → `PcDevs.TheArmagan` + `PcDevs.MutanPlex` yapıldı.
2. **Kullanılmayan `Devs` import'u** → lint hatası, kaldırıldı.
3. **`const toDisable = []` type hatası** — TS bunu `never[]` algılıyordu →
   `const toDisable: string[] = []` yapıldı.
4. **`NotificationSettingsStore.getState()` tipli değildi** →
   `as { disabledSounds: string[] }` cast eklendi.
5. **`catch (e)`** — kullanılmayan değişken lint hatası → `catch` yapıldı.
6. **"Zwen:" öneki / var olmayan dev referansı** → menü etiketleri i18n sistemine taşındı
   ("Sahte Susturma", "Sahte Sağırlaştırma", "Sahte Kamera").
7. **Dosya uzantısı yanlış** — JSX içerdiği halde `.ts` idi → `.tsx` yapıldı.
8. **Eklenti repo'da hiç yoktu** → `src/plugins/fakeMuteAndDeafen/` klasörü oluşturuldu,
   plugin otomatik kaydediliyor.
9. **Çeviriler eksikti** → `en-US`, `tr` + diğer 20 dil dosyasına (22 locale toplam)
   çeviri girdileri eklendi; aksi halde `tsc` tüm locale'lerde hata veriyordu.

## Doğrulama / Test Sonuçları (hepsi geçti)
| Test | Sonuç |
|------|-------|
| `buildStandalone` (desktop build) | ✅ |
| `testTsc` (TypeScript typecheck) | ✅ 0 hata |
| `lint` (oxlint) | ✅ 0 hata |
| `lint:intl` | ✅ 0 hata, 0 uyarı |
| `lint:patches` | ✅ 0 hata (185 uyarı orijinal repodan, bu değişiklikten değil) |
| `fmt:check` | ✅ |
| `generatePluginJson` | ✅ |
| `buildWeb` | ✅ Chromium + Firefox uzantısı üretildi |

## README Değişiklikleri
- Badge/linkler fork'a (`zwenhunter/Plexcord`) çevrildi
- Fork açıklaması (TR + EN) ve FakeMuteAndDeafen tanıtımı eklendi
- 10 maddelik hata/düzeltme tablosu eklendi
- Sponsor bölümleri kaldırıldı, orijinal projeye credit verildi

## Not
- FakeDeafen/FakeMute, Plexcord'un CONTRIBUTING.md kural 4'üne göre orijinal repoya PR olarak
  kabul edilmez; bu yüzden fork'ta tutuluyor.
