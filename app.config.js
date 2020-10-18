import 'dotenv/config';

export default {
  expo: {
    name: 'Plantas MJ',
    slug: 'plantasmj-admin',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#182a17',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    web: {
      favicon: './assets/images/favicon.png',
    },
    extra: {
      apiUrl: process.env.API_URL,
    },
  },
};
