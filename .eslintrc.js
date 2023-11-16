module.exports = {
    extends: ['react-app', 'eslint:recommended'], // 继承官方lint规格
    env: {
        node: true,
        browser: true,
    },
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        babelOptions: {
            presets: [
                ['babel-preset-react-app', false],
                "babel-preset-react-app/prod"
            ]
        }
    },
    rules: {
        "no-var": 2
    }
}