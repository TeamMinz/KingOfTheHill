const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  assetPrefix: './',
  env: {
    STATIC_PREFIX: isProduction ? './static' : '/static',
  },
  exportPathMap: async (defaultPathMap, {
    dev, dir, outDir, distDir, buildId,
  }) => (!dev
    ? {
      '/video_component': { page: '/video_component' },
      '/mobile': { page: '/mobile' },
      '/panel': { page: '/panel' },
      '/live_config': { page: '/live_config' },
      '/config': { page: '/config' },
      '/video_overlay': { page: '/video_overlay' },
    }
    : defaultPathMap),
  webpack(config, options) {
    config.optimization.minimize = false;
    return config;
  },
};
