chrome.storage.sync.set({ "Timer": 5000 });

const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();

function clickSpanPeriodically() {
  chrome.storage.sync.get('selectedDropDownOption', (data) => { // Ändern Sie den Key auf 'selectedDropDownOption'
    const selectedOption = data.selectedDropDownOption;
    if (selectedOption !== undefined) {
      chrome.storage.sync.get("currentSelectedView", function(result) {
        if(result.currentSelectedView === data.selectedDropDownOption.text){
          const selectedIndex = selectedOption.index; // Ändern Sie den Namen des Indexattributs entsprechend Ihrer Speicherstruktur
          clickSpanAtIndex(selectedIndex); // Rufen Sie die Funktion zum Klicken auf das Span-Element mit dem ausgewählten Index auf
        }
      });
    }
  });
}

// Periodisches Ausführen der Klickfunktion alle 10 Sekunden

chrome.storage.sync.get("Timer", function(result) {
  setInterval(clickSpanPeriodically, result.Timer);
});

chrome.storage.sync.get("Timer", function(result) {
  setInterval(getTextFromSpanPeriodically, result.Timer);
});

// Funktion zum Klicken auf das definierte Span-Element basierend auf dem empfangenen Index
function clickSpanAtIndex(index) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const tabId = tab.id;
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: (index) => {
          const spans = document.querySelectorAll(`span.virtualAutocompleteOptionText`);
          if (spans.length > index) {
            spans[index].click(); // Klicke auf das Span-Element mit dem empfangenen Index
          } else {
            console.error('Invalid index or no span elements found with the specified class.');
          }
        },
        args: [index]
      });
    });
  });

}

function getTextFromSpanPeriodically() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const tabId = tab.id;
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: () => {
          const spans = document.querySelectorAll('span.selectedListView');
          if (spans.length > 0) {
            const spanText = spans[0].textContent;
            // Hier können Sie den Text des Span-Elements verwenden oder weitere Verarbeitungen durchführen
            chrome.storage.sync.set({ "currentSelectedView": spanText });
          } else {
            console.error('Kein Span-Element mit der angegebenen Klasse gefunden.');
          }
        }
      });
    });
  });
}
