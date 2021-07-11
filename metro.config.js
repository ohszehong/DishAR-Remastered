// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

// module.exports = getDefaultConfig(__dirname);

module.exports = (async () => {
  const {
    resolver: { assetExts },
  } = await getDefaultConfig(__dirname);
  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
    resolver: {
      assetExts: [
        ...assetExts,
        "db",
        "mp3",
        "ttf",
        "obj",
        "png",
        "jpg",
        "otf",
        "mtl",
      ],
    },
  };
})();
