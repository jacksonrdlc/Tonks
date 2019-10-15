import mapSharedStyles from './map-shared-styles'
import replaceSymbols from './replace-symbols'
import replaceOverrides from './replace-overrides'
import replaceSharedStyles from './replace-shared-styles'

export default (document, library) => {
  const lookup = mapSharedStyles(document, library)

  // replace the symbols
  const { symbolsMap, docSymbolInstances } = replaceSymbols(document, library, true)

  // replace the styles
  const layerStylesMap = replaceSharedStyles(
    document.getSharedLayerStyles(),
    lookup.layer,
    library
  )
  const textStylesMap = replaceSharedStyles(
    document.getSharedTextStyles(),
    lookup.text,
    library
  )

  replaceOverrides(docSymbolInstances, {
    symbolsMap,
    layerStylesMap,
    textStylesMap,
  })

  // reload the inspector to make sure we show the latest changes
  document.sketchObject.reloadInspector()
}
