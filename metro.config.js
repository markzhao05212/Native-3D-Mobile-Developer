const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { resolver } = config;

  // This tells the app that 'glb' and 'gltf' are valid asset files
  resolver.assetExts.push('glb', 'gltf', 'png', 'jpg');
  
  // This ensures they aren't treated as code files
  resolver.sourceExts = resolver.sourceExts.filter(
    (ext) => !['glb', 'gltf', 'png', 'jpg'].includes(ext)
  );

  return config;
})();