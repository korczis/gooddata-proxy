import path from 'path';

module.exports = function(server) {
  server.app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, '../../../static/index.html'));
  });
}
