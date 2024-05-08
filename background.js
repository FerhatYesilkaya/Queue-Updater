// Funktion zum periodischen Klicken auf das Span-Element
function clickSpanPeriodically() {
  chrome.storage.sync.get('selectedOption', (data) => {
    const selectedOption = data.selectedOption;
    if (selectedOption !== undefined) {
      clickSpanAtIndex(selectedOption); // Klicke das Span-Element mit dem ausgewählten Index
    }
  });
}

// Periodisches Ausführen der Klickfunktion alle 20 Sekunden
setInterval(clickSpanPeriodically, 5000);

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
