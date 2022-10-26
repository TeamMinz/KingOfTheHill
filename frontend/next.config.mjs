export default {
  exportPathMap: async (defaultPathMap, { dev }) => (!dev
    ? {
      '/video_component': { page: '/video_component' },
      '/mobile': { page: '/mobile' },
      '/panel': { page: '/panel' },
      '/live_config': { page: '/live_config' },
      '/config': { page: '/config' },
      '/video_overlay': { page: '/video_overlay' },
    }
    : defaultPathMap),
  webpack(config) {
    // eslint-disable-next-line no-param-reassign
    config.optimization.minimize = false;
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
