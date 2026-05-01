var Config = (function(){
  return { API_BASE_URL: 'http://localhost:5044/api', PAGE_SIZE: 10 };
})();
if (typeof globalThis !== 'undefined') globalThis.Config = Config;
if (typeof module !== 'undefined') module.exports = Config;
