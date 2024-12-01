import { DeclarationWebpackPlugin, moduleType } from '@nicholaskoldys/declaration-webpack-plugin';
import { resolve } from 'node:path';

const __dirname = import.meta.dirname;

const webpackConfig = {
  mode: 'production',
  entry: './src/Parser.ts',
  experiments: {
    outputModule: true,
  },

  output: {
    filename: 'KeyCodeParser.min.js',
    library: {
      type: 'modern-module',
    },
    path: resolve(__dirname, 'lib'),
    clean: true,
  },

  infrastructureLogging: {
    level: 'verbose',
  },

  resolve: {
    extensions: [ '.ts', '.js' ],
  },

  module: {
    rules: [
      {
        test: /\.m?ts$/,
        use: [ 
          { 
            loader: 'ts-loader', 
            options: { 
              configFile: resolve(__dirname, './src/tsconfig.dist.json') 
            }
          },
        ]
      }
    ]
  },

  plugins: [
    new DeclarationWebpackPlugin({
      moduleName: "KeyCodeParser",
      moduleType: moduleType.esm,
      outputFile:'KeyCodeParser.d.ts',
      isFileCommented: true,
    })
  ],
};

export default webpackConfig;