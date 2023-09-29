import { useEffect, useMemo, useState } from "react";
import { useSettingsContext } from "../context/useRDTContext.js";
import JsonView from "../../external/react-json-view/index.js";
import { customTheme } from "../../external/react-json-view/theme/custom.js";

interface JsonRendererProps {
  data: string | Record<string, unknown>;
}

const isPromise = (value: any): value is Promise<any> => {
  return value && typeof value.then === "function";
};

const JsonRenderer = ({ data }: JsonRendererProps) => {
  const { settings } = useSettingsContext();
  const originalData = useMemo(
    () =>
      typeof data === "string"
        ? data
        : Object.entries(data)
            .map(([key, value]) => {
              if (isPromise(value)) {
                value.then((res) => {
                  setJson((json: any) => ({
                    ...json,
                    [key]: res,
                  }));
                });
                return { [key]: "Loading deferred data..." };
              }
              return { [key]: value };
            })
            .reduce((acc, curr) => {
              return { ...acc, ...curr };
            }, {}),
    [data]
  );
  const [json, setJson] = useState(originalData);

  useEffect(() => {
    setJson(data);
  }, [data]);
  if (typeof json === "string") {
    return <div className="rdt-max-w-xs rdt-text-green-600">{json}</div>;
  }

  return <JsonView highlightUpdates style={customTheme} collapsed={settings.expansionLevel} value={json} />;
};

export { JsonRenderer };
