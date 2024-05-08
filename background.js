function clickSpanPeriodically() {
  chrome.storage.sync.get('selectedDropDownOption', (data) => { // Ändern Sie den Key auf 'selectedDropDownOption'
    const selectedOption = data.selectedDropDownOption;
    if (selectedOption !== undefined) {
      const selectedIndex = selectedOption.index; // Ändern Sie den Namen des Indexattributs entsprechend Ihrer Speicherstruktur
      clickSpanAtIndex(selectedIndex); // Rufen Sie die Funktion zum Klicken auf das Span-Element mit dem ausgewählten Index auf
    }
  });
}

// Periodisches Ausführen der Klickfunktion alle 20 Sekunden
setInterval(clickSpanPeriodically, 10000);

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
