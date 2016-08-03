var version;
export default version = {
    get string() { return `v${version.major}.${version.minor}.${version.patch}`; },
    major: 0,
    minor: 9,
    patch: 0,
    pre: false
};
