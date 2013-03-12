chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    id: 'GDL-LowerThirdGenerator',
    width: 1024, height: 725,
    maxWidth: 1024, maxHeight: 725,
    minWidth: 1024, minHeight: 725
  });
});
