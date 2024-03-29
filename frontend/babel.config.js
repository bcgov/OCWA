const presets = [
  [
    '@babel/preset-env',
    {
      targets: {
        edge: '17',
        firefox: '60',
        chrome: '67',
        safari: '11.1',
        node: 'current',
      },
      useBuiltIns: 'usage',
      corejs: '2.6.5',
    },
  ],
  '@babel/preset-react',
];

const plugins = [
  [
    '@babel/plugin-transform-async-to-generator',
    {
      module: 'bluebird',
      method: 'coroutine',
    },
  ],
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-syntax-dynamic-import',
];

module.exports = { presets, plugins };
