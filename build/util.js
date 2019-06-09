const isDev = () => {
    return /(dev|(developement))/g.test(process.env.NODE_ENV.toLowerCase());
};

const getWebpackMode = () => {
    return isDev() ? 'development' : 'production';
};

module.exports = {
    isDev,
    getWebpackMode
};