module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "parser": "@babel/eslint-parser",
    "extends": "eslint:recommended",
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "requireConfigFile": false,
        "babelOptions": {
            "plugins": [
                '@babel/plugin-syntax-import-assertions'
            ],
        }
    },
    "rules": {
        'no-prototype-builtins': 'off'
    }
}
