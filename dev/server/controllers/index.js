const handlers = [
    'favicon',
    'templates',
    'error'
];
module.exports = function(app) {
    handlers.forEach(handler => require(`./${handler}`).init(app));
}