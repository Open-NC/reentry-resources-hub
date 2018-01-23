function stripPath(path) {
  let filename = path;
  let index = path.lastIndexOf('/');
  if (index >= 0) {
    filename = path.substring(index + 1);
  }
  else {
    index = path.lastIndexOf('\\');
    if (index >= 0) filename = path.substring(index + 1);
  }
  return filename;
}

module.exports = {
  stripPath,
};
