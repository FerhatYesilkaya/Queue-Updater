let currentSelectedView;
var timer = 10000;

function clickSpanPeriodically() {
  chrome.storage.sync.get('selectedDropDownOption', (data) => { // Ändern Sie den Key auf 'selectedDropDownOption'
    const selectedOption = data.selectedDropDownOption;
    console.log(timer);
    console.log('Text des Span-Elements3:', currentSelectedView);
    if (selectedOption !== undefined) {
        const selectedIndex = selectedOption.index; // Ändern Sie den Namen des Indexattributs entsprechend Ihrer Speicherstruktur
        clickSpanAtIndex(selectedIndex); // Rufen Sie die Funktion zum Klicken auf das Span-Element mit dem ausgewählten Index auf
    }
  });
}

// Periodisches Ausführen der Klickfunktion alle 10 Sekunden
setInterval(clickSpanPeriodically, timer);

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
            currentSelectedView = spanText;
            console.log(currentSelectedView);
            console.log(timer);
          } else {
            currentSelectedView = "Fehler";
            console.error('Kein Span-Element mit der angegebenen Klasse gefunden.');
          }
        }
      });
    });
  });
}

// Periodisches Ausführen der Funktion alle 10 Sekunden
setInterval(getTextFromSpanPeriodically, (timer-100));
