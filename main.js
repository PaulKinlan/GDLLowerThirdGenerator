chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    id: 'GDL-LowerThirdGenerator',
    width: 455, height: 650,
    maxWidth: 455, maxHeight: 650,
    minWidth: 455, minHeight: 650
  });
});
