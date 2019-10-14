import sketch from 'sketch'
import settings from 'sketch/settings'
import createRadioButtons from './create-radio-buttons'
import switchLibrary from './switch-library'
import switchSelection from './switch-selection'
import getOptionSelected from './get-option-selected'
import createAlertWindow from './create-alert-window'

export default function(context) {
  const libraries = sketch.getLibraries().filter(l => l.valid && l.enabled)
  const lastSelected = settings.sessionVariable('Selected')
  
  // create the alertWindow UI
  const alertWindow = createAlertWindow(context);
  alertWindow.addAccessoryView(getOptionSelected(libraries))
  alertWindow.addButtonWithTitle('Compile')
  alertWindow.addButtonWithTitle('Cancel')
  
  // create the radioButtons
  const swapType = createRadioButtons(["Apply to library", "Apply to selection"],lastSelected)
  alertWindow.addAccessoryView(swapType)

  if (alertWindow.runModal() == NSAlertFirstButtonReturn) {
    const chosenLibraryName = String(alertWindow.viewAtIndex(0).stringValue())
    const lib = libraries.find(l => l.name === chosenLibraryName)
    const doc = sketch.getSelectedDocument()
    
    // get the info from radioButtons
    // - if 0 selected it will apply to document
    // - if 1 selected it will apply to selection
    if (swapType.selectedCell().tag() == 0) {
      settings.setSessionVariable('Selected', 0)
      switchLibrary(doc, lib)
      sketch.UI.message(
      `🎉 🎈 🙌🏼  Applied theme from ${lib.name}  🙌🏼 🎉 🎈`
      )
    }
    
    if (swapType.selectedCell().tag() == 1) {
      settings.setSessionVariable('Selected', 1)
      switchSelection(doc, lib)
      const selectedLayers = doc.selectedLayers.layers
      if(selectedLayers.length < 1){
        sketch.UI.message(
        `Select a layer`
        )
      } else {
        sketch.UI.message(
        `🎉 🎈 🙌🏼  Applied theme from ${lib.name}  🙌🏼 🎉 🎈`
        )
      }
    }
  }
}