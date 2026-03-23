# OpenCode Prompt Kuralları

## Oturum Başlangıcında Otomatik Oku
Her yeni oturumda **ilk olarak** şu dosyayı oku:
```
/home/woo/Projects/Moopon/.opencode/SUMMARY.md
```

Bu dosya projenin güncel bağlamını, tercihlerini ve önemli notlarını içerir. 

## Dil Tercihi
- Kullanıcı **Türkçe** konuşuyor
- Yanıtları **Türkçe** ver
- Kod yorumlarını da Türkçe yap (kullanıcı istemedikçe İngilizce yapma)

## Nix ile İlgili Not
Nix projelerinde:
- `nix run` komutu **sürdürülebilir kabul edilmiyor**
- Nix topluluğuna göstermek için uygun komutlar kullanılmalı
- flake tabanlı çözümler tercih edilmeli
