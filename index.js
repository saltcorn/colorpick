const {
  input,
  div,
  text,
  script,
  domReady,
  text_attr,
} = require("@saltcorn/markup/tags");

const headers = [
  {
    script: "/plugins/public/colorpick/colorPick.min.js",
  },
  {
    css: "/plugins/public/colorpick/colorPick.min.css",
  },
];

const colorPick = {
  type: "Color",
  isEdit: true,
  configFields: [
    { name: "allowCustomColor", label: "Allow custom color", type: "Bool" },
  ],
  run: (nm, v, attrs, cls) => {
    const rndid = Math.floor(Math.random() * 16777215).toString(16);
    const opts = {};
    return (
      div({ id: `colpick${text_attr(nm)}${rndid}`, class: "colorpick" }) +
      input({
        type: "hidden",
        name: text_attr(nm),
        disabled: attrs.disabled,
        id: `input${text_attr(nm)}${rndid}`,
        ...(typeof v !== "undefined" &&
          v !== null && {
            value: text_attr(v),
          }),
      }) +
      script(
        domReady(`$('#colpick${text(nm)}${rndid}').colorPick({
            ${typeof v === "undefined" ? "" : `initialColor: ${text_attr(v)},`}
            ${attrs?.allowCustomColor ? "allowCustomColor: true," : ""}
            onColorSelected: function(){
              this.element.css({'backgroundColor': this.color, 'color': this.color});
              $('#input${text_attr(nm)}${rndid}').val(this.color);


            }
          });`)
      )
    );
  },
};
/*


          */
module.exports = {
  sc_plugin_api_version: 1,
  plugin_name: "colorpick",
  fieldviews: { colorPick },
  headers,
};
