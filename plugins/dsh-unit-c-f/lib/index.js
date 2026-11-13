/**
 * 单位换算：摄氏度转华氏度 — 单位换算
 */

export const name = "dsh-unit-c-f";
export const inject = ["tools"];

const NL = String.fromCharCode(10);
const SITE = "https://deepseekbase.com/zh/tools/";
const TEXT_OUTPUT = {
  schema: { type: "object", additionalProperties: false, properties: { text: { type: "string" } }, required: ["text"] },
  render: (_args, value) => [{ type: "text", text: (value && value.text) || "" }],
};

// 目标单位 = 输入 × 系数
const FACTORS = {
  "mm-cm": 0.1, "cm-m": 0.01, "m-km": 0.001, "mm-in": 0.0393701, "cm-in": 0.393701,
  "m-ft": 3.28084, "m-mile": 0.000621371, "km-mile": 0.621371, "in-ft": 0.0833333, "ft-yd": 0.333333,
  "g-kg": 0.001, "kg-t": 0.001, "g-oz": 0.035274, "kg-lb": 2.20462, "t-lb": 2204.62,
  "m2-ft2": 10.7639, "m2-mu": 0.0015, "ha-mu": 15, "cm2-in2": 0.155,
  "ml-l": 0.001, "l-m3": 0.001, "l-gal": 0.264172, "m3-ft3": 35.3147,
  "kmh-ms": 0.277778, "kmh-mph": 0.621371, "mph-kmh": 1.60934,
  "mpa-bar": 10, "bar-psi": 14.5038, "psi-bar": 0.0689476,
  "j-cal": 0.238846, "kcal-j": 4184,
  "w-kw": 0.001, "kw-hp": 1.34102,
  "mb-gb": 0.001, "gb-tb": 0.001,
  "min-h": 0.0166667, "h-day": 0.0416667,
  "deg-rad": 0.0174533, "rad-deg": 57.2958, "deg-grad": 1.11111,
};

function n(v, d) { const x = Number(v); return Number.isFinite(x) ? x : d; }
function f(x) { return (Math.round(x * 1000000) / 1000000).toString(); }

const OPS = {
  "c-f": (x) => x * 9 / 5 + 32,
  "f-c": (x) => (x - 32) * 5 / 9,
  "c-k": (x) => x + 273.15,
};

function convert(op, x) {
  if (OPS[op]) return OPS[op](x);
  const k = FACTORS[op];
  if (k === undefined) throw new Error("未收录换算: " + op);
  return x * k;
}

export function apply(ctx, config) {
  void config;
  ctx.tools.register({
    name: "unit_c_f",
    description: "摄氏度转华氏度：°C → °F",
    parameters: {
      text: { "type": "string", required: true, "description": "数值" },
    },
    output: TEXT_OUTPUT,
    async execute(args) {
      const t = args && args.text != null ? String(args.text) : "";
      const x = n(t, NaN);
      const op = "c-f";
      try {
        if (!Number.isFinite(x)) throw new Error("请输入数字");
        const y = convert(op, x);
        return { text: ["单位换算：摄氏度转华氏度", "=".repeat(52), f(x) + " → " + f(y), "", "更多工具：" + SITE].join(NL) };
      } catch (e) {
        return { text: "处理失败: " + String((e && e.message) || e) };
      }
    },
  });
}
