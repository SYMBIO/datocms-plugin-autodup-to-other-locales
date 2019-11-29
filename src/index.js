window.DatoCmsPlugin.init((plugin) => {
  plugin.startAutoResizer();

  if (!plugin.field.attributes.localized) {
    return;
  }

  const { locale, site: { attributes: { locales } } } = plugin;
  const baseFieldPath = plugin.fieldPath.replace(`.${locale}`, '');
  const initialValue = plugin.getFieldValue(baseFieldPath);
  const updateEnabled = {};

  locales.forEach((l) => {
    if (locale !== l && (!initialValue[l] || initialValue[l] === initialValue[locale])) {
      updateEnabled[l] = true;
    } else {
      updateEnabled[l] = false;
    }
  });

  if (locale === locales[0]) {
    plugin.addFieldChangeListener(plugin.fieldPath, () => {
      const value = plugin.getFieldValue(plugin.fieldPath);
      locales.forEach((l) => {
        if (updateEnabled[l]) {
          console.log(`updating ${l} with value ${value}`);
          plugin.setFieldValue(`${baseFieldPath}.${l}`, value);
        }
      });
    });
  }
});
