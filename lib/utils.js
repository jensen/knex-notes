module.exports = {
  cleanUrl: (input) => {
    return input.startsWith('http') ? input : 'http://' + input;
  }
}