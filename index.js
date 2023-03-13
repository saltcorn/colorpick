const {
  input,
  div,
  text,
  script,
  domReady,
  text_attr,
} = require("@saltcorn/markup/tags");
const Workflow = require("@saltcorn/data/models/workflow");
const Form = require("@saltcorn/data/models/form");

const configuration_workflow = () =>
  new Workflow({
    steps: [
      {
        name: "views",
        form: async (context) => {
          return new Form({
            fields: [
              {
                name: "palette",
                label: "Palette",
                sublabel:
                  "Separate colors by strings; example: <code>#1abc9c,#16a085,#2ecc71,red</code>",
                type: "String",
                required: false,
              },

              {
                name: "defaultInitialColor",
                label: "Default initial color",
                type: "Color",
                required: false,
              },
            ],
          });
        },
      },
    ],
  });

const headers = () => [
  {
    script: "/plugins/public/colorpick/colorPick.min.js",
  },
  {
    css: "/plugins/public/colorpick/colorPick.min.css",
  },
];

const colorPick = (modcfg) => ({
  type: "Color",
  isEdit: true,
  configFields: [
    { name: "allowCustomColor", label: "Allow custom color", type: "Bool" },
  ],
  run: (nm, v, attrs, cls) => {
    const rndid = Math.floor(Math.random() * 16777215).toString(16);
    const opts = {};
    console.log("colpick", modcfg, v, typeof v);
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
            ${
              typeof v === "undefined" || v === null
                ? modcfg?.defaultInitialColor
                  ? `initialColor: "${text_attr(modcfg?.defaultInitialColor)}",`
                  : ""
                : `initialColor: "${text_attr(v)}",`
            }
            ${attrs?.allowCustomColor ? "allowCustomColor: true," : ""}
            ${
              modcfg?.palette
                ? `palette: ${JSON.stringify(
                    modcfg?.palette.split(",").map((s) => s.trim())
                  )},`
                : ""
            }
            onColorSelected: function(){
              this.element.css({'backgroundColor': this.color, 'color': this.color});
              $('#input${text_attr(nm)}${rndid}').val(this.color);


            }
          });`)
      )
    );
  },
});
/*


          */
module.exports = {
  sc_plugin_api_version: 1,
  plugin_name: "colorpick",
  fieldviews: (cfg) => ({
    colorPick: colorPick(cfg),
  }),
  configuration_workflow,
  headers,
};
