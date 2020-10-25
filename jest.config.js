module.exports = {
    "roots": [
        "<rootDir>/src",
    ],
    "transform": {
        "^.+\\.tsx?$": "ts-jest",
        "\\.tmx$": "jest-raw-loader",
        "\\.xml$": "jest-raw-loader"
    },
};
