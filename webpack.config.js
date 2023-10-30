// webpack.config.js
const path = require("path");
const packagejson = require('./package.json')
module.exports = {
    entry: "./build/index.js",
    output: {
        filename: `index.js`,
        path: path.resolve(__dirname, "dist"),
    },
    optimization: {
        // minimizer: [new TerserPlugin({})], // 删除或注释掉这一行
        // minimizer:[],
    },
    resolve:{
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.d.ts'],
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    }
};
