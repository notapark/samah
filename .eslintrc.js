module.exports = {
    extends: 'airbnb',
    env: {
        browser: true
    },
    rules:{
        "linebreak-style": "off",
        "import/newline-after-import": "off",
        "no-template-curly-in-string": "off",
        "no-console": "off",
        "no-use-before-define": "off",
        "prefer-destructuring": ["error", {"object": false, "array": false}],
    }
};