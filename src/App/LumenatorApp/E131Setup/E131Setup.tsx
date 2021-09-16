import { Conf, IConfigJson } from "../../../lib/interfaces/IConfigJson";
import { Fragment, FunctionalComponent, VNode, h } from "preact";

import Chip from "../../../lib/components/Chip/Chip";
import { DeviceType } from "../../../lib/enums/DeviceType";
import { IE131SetupProps } from "./IE131SetupProps";
import Input from "../../../lib/components/Input/Input";
import ToggleSwitch from "../../../lib/components/ToggleSwitch/ToggleSwitch";

const E131Setup: FunctionalComponent<IE131SetupProps> = ({
  config = {},
  ...props
}) => {
  const handleE131Enable = (): void => {
    if (typeof props.onConfigUpdate === "function") {
      props.onConfigUpdate({
        ...(config as IConfigJson),
        [Conf.E131_ENABLED]: !config[Conf.E131_ENABLED],
      });
    }
  };

  const renderRow = (
    mapping: string,
    offset = 0,
    firstRow = false,
    universe?: number | null
  ): VNode<any> => {
    return (
      <tr class={`table-row${firstRow ? " first-row" : ""}`}>
        <td>{universe && <Chip text={`${config[Conf.E131_UNIVERSE]}`} />}</td>
        <td>
          <Chip
            variant="basic"
            text={`${(config[Conf.E131_START_CHAN] || 0) + offset - 1}`}
          />
        </td>
        <td>{mapping}</td>
      </tr>
    );
  };

  const renderMapping = (): any => {
    let mappedSections: Array<VNode<any>> = [];
    let id = 1;
    if (
      config[Conf.DEVICE_TYPE] === DeviceType.RGB ||
      config[Conf.DEVICE_TYPE] === DeviceType.RGBW ||
      config[Conf.DEVICE_TYPE] === DeviceType.RGBWW
    ) {
      mappedSections = [
        ...mappedSections,
        renderRow("Red", id, true, config[Conf.E131_UNIVERSE]),
        renderRow("Green", id + 1),
        renderRow("Blue", id + 2),
      ];
      id = id + 3;
    }
    if (
      config[Conf.DEVICE_TYPE] === DeviceType.RGBW ||
      config[Conf.DEVICE_TYPE] === DeviceType.RGBWW ||
      config[Conf.DEVICE_TYPE] === DeviceType.W ||
      config[Conf.DEVICE_TYPE] === DeviceType.WW
    ) {
      mappedSections = [
        ...mappedSections,
        renderRow(
          "Cold White",
          id,
          id == 1,
          id == 1 ? config[Conf.E131_UNIVERSE] : null
        ),
      ];
      id = id + 1;
    }
    if (
      config[Conf.DEVICE_TYPE] === DeviceType.RGBWW ||
      config[Conf.DEVICE_TYPE] === DeviceType.WW
    ) {
      mappedSections = [...mappedSections, renderRow("Warm White", id)];
    }
    return mappedSections;
  };

  return (
    <Fragment>
      <div class="section-action">
        <ToggleSwitch
          onClick={handleE131Enable}
          on={config[Conf.E131_ENABLED]}
        />
        <label>Enable E131 Streaming</label>
      </div>
      <section>
        <div class="grid-large">
          <div class="form-group no-margin">
            <label for="universe">Universe</label>
            <Input
              id="universe"
              type="number"
              disabled={!config[Conf.E131_ENABLED]}
              value={config[Conf.E131_UNIVERSE] || undefined}
              maxLength={4}
              onChange={(value) => {
                if (typeof props.onConfigUpdate === "function") {
                  props.onConfigUpdate({
                    ...(config as IConfigJson),
                    [Conf.E131_UNIVERSE]: value as number,
                  });
                }
              }}
            />
            <div class="helper-text mt-large">The universe to listen for.</div>
          </div>
          <div class="form-group no-margin">
            <label for="channel">Channel</label>
            <Input
              id="channel"
              type="number"
              disabled={!config[Conf.E131_ENABLED]}
              value={config[Conf.E131_START_CHAN] || undefined}
              maxLength={4}
              onChange={(value) => {
                if (typeof props.onConfigUpdate === "function") {
                  props.onConfigUpdate({
                    ...(config as IConfigJson),
                    [Conf.E131_START_CHAN]: value as number,
                  });
                }
              }}
            />
            <div class="helper-text mt-large">
              The starting channel assigned to Lumenator.
            </div>
          </div>
        </div>
      </section>
      {config[Conf.E131_ENABLED] &&
        (config[Conf.E131_UNIVERSE] || 0) > 0 &&
        (config[Conf.E131_START_CHAN] || 0) > 0 && (
          <section>
            <div class="form-group no-margin">
              <label>Channel Mapping</label>
              <table>
                <tr class="header-row">
                  <th>Universe</th>
                  <th>Channel</th>
                  <th width="100%">Mapping</th>
                </tr>
                {renderMapping()}
              </table>
            </div>
          </section>
        )}
    </Fragment>
  );
};

export default E131Setup;
