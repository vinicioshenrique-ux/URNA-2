# Urna Digital — aplicativo Android

Este diretório agora contém a estrutura real de um projeto Android Studio para gerar o APK da urna.

## O que o aplicativo faz
- Abre diretamente a urna de votação em tela cheia.
- Mantém a interface web e o backend atuais.
- Funciona em modo retrato.
- Bloqueia navegação para sites externos.
- Mantém JavaScript, armazenamento local e reprodução de mídia habilitados para a experiência da urna.

URL carregada: https://urna-digital-gremio.hatchable.site/

## Gerar o APK
1. Baixe/copiar o diretório `public/android` para um computador com Android Studio.
2. Abra essa pasta no Android Studio.
3. Aguarde o Gradle sincronizar.
4. Use **Build > Build APK(s)** para gerar o APK de teste, ou **Generate Signed App Bundle / APK** para uma versão assinada.

O Hatchable hospeda a urna e o backend, mas não possui compilador Android/Gradle nativo para entregar o `.apk` diretamente.