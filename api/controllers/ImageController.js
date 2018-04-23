const path = require('path')

module.exports = {
  create(req, res) {
    req.file('image').upload({
      dirname: path.resolve(sails.config.appPath, 'assets/images'),
      // don't allow the total upload size to exceed ~10MB
      maxBytes: 10000000
    }, async function whenDone(err, uploadedFiles) {
      if (err) {
        return res.serverError(err);
      }
  
      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }
  
      try {
        const fd = uploadedFiles[0].fd
        const filename = uploadedFiles[0].filename

        await Image.create({
          url: `${sails.config.custom.baseUrl}/images/${path.basename(fd)}`,
          filename,
        })
      } catch (err) {
        return res.serverError(err)
      }
      
      return res.ok();
    });
  },

  remove(req, res) {
    return res.ok()
  }
}