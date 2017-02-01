module.exports = {
  cleanUrl: (input) => {
    input = input.endsWith('/') ? input : input + '/';
    return input.startsWith('http') ? input : 'http://' + input;
  }
}