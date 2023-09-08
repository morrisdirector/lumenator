import { Conf, IConfigJson } from "../../../lib/interfaces/IConfigJson";
import { Fragment, FunctionalComponent, VNode, h } from "preact";

import Chip from "../../../lib/components/Chip/Chip";
import { DeviceType } from "../../../lib/enums/DeviceType";
import DropdownMenu from "../../../lib/components/DropdownMenu/DropdownMenu";
import { IE131SetupProps } from "./IE131SetupProps";
import Input from "../../../lib/components/Input/Input";
import ToggleSwitch from "../../../lib/components/ToggleSwitch/ToggleSwitch";

const E131Setup: FunctionalComponent<IE131SetupProps> = ({
  config = {} as IConfigJson,
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
    if (config[Conf.E131_MANUAL]) {
      // First Rows:
      if (
        config[Conf.DEVICE_TYPE] === DeviceType.RGB ||
        config[Conf.DEVICE_TYPE] === DeviceType.RGBW ||
        config[Conf.DEVICE_TYPE] === DeviceType.RGBWW
      ) {
        mappedSections = [
          ...mappedSections,
          <tr class="table-row first-row">
            <td>
              {config[Conf.E131_UNIVERSE] && (
                <Chip text={`${config[Conf.E131_UNIVERSE] || "None"}`} />
              )}
            </td>
            <td>
              <Chip
                variant="basic"
                text={`${config[Conf.E131_START_CHAN] || "None"}`}
              />
            </td>
            <td>Red</td>
          </tr>,
        ];
      } else if (
        config[Conf.DEVICE_TYPE] === DeviceType.W ||
        config[Conf.DEVICE_TYPE] === DeviceType.WW
      ) {
        mappedSections = [
          ...mappedSections,
          <tr class="table-row first-row">
            <td>
              {config[Conf.E131_UNIVERSE] && (
                <Chip text={`${config[Conf.E131_UNIVERSE] || "None"}`} />
              )}
            </td>
            <td>
              <Chip
                variant="basic"
                text={`${config[Conf.E131_START_CHAN] || "None"}`}
              />
            </td>
            <td>Cold White</td>
          </tr>,
        ];
      }
      if (
        config[Conf.DEVICE_TYPE] === DeviceType.RGB ||
        config[Conf.DEVICE_TYPE] === DeviceType.RGBW ||
        config[Conf.DEVICE_TYPE] === DeviceType.RGBWW
      ) {
        mappedSections = [
          ...mappedSections,
          <tr class="table-row">
            <td></td>
            <td>
              <Chip
                variant="basic"
                text={`${config[Conf.E131_G_CHAN] || "None"}`}
              />
            </td>
            <td>Green</td>
          </tr>,
          <tr class="table-row">
            <td></td>
            <td>
              <Chip
                variant="basic"
                text={`${config[Conf.E131_B_CHAN] || "None"}`}
              />
            </td>
            <td>Blue</td>
          </tr>,
        ];
      }
      if (
        config[Conf.DEVICE_TYPE] === DeviceType.RGBW ||
        config[Conf.DEVICE_TYPE] === DeviceType.RGBWW
      ) {
        mappedSections = [
          ...mappedSections,
          <tr class="table-row">
            <td></td>
            <td>
              <Chip
                variant="basic"
                text={`${config[Conf.E131_W_CHAN] || "None"}`}
              />
            </td>
            <td>Cold White</td>
          </tr>,
        ];
      }
      if (
        config[Conf.DEVICE_TYPE] === DeviceType.RGBWW ||
        config[Conf.DEVICE_TYPE] === DeviceType.WW
      ) {
        mappedSections = [
          ...mappedSections,
          <tr class="table-row">
            <td></td>
            <td>
              <Chip
                variant="basic"
                text={`${config[Conf.E131_WW_CHAN] || "None"}`}
              />
            </td>
            <td>Warm White</td>
          </tr>,
        ];
      }
    } else {
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
            <div class="helper-text">The universe to listen for.</div>
          </div>
          <div class="form-group no-margin">
            <label for="name">Mixing Strategy</label>
            <DropdownMenu
              type="number"
              disabled={!config[Conf.E131_ENABLED]}
              placeholder="Set a mixing strategy"
              value={config[Conf.E131_MIXING_STRATEGY] || undefined}
              onSelect={(value) => {
                if (typeof props.onConfigUpdate === "function") {
                  props.onConfigUpdate({
                    ...config,
                    [Conf.E131_MIXING_STRATEGY]: value as number,
                  });
                }
              }}
            >
              <option value="1">
                Limited - RGB and whites cannot be mixed
              </option>
              <option value="2">All - RGB and whites can be mixed</option>
            </DropdownMenu>
            <div class="helper-text">
              As a potential safety measure, it's recommended to only allow
              limited mixing to prevent overloading the internal power supplies
              of the hardware. Limited mode will prioritize RGB data over white.
            </div>
          </div>
          <div class="form-group">
            <label for="channel">
              {config[Conf.E131_MANUAL]
                ? config[Conf.DEVICE_TYPE] === DeviceType.RGB ||
                  config[Conf.DEVICE_TYPE] === DeviceType.RGBW ||
                  config[Conf.DEVICE_TYPE] === DeviceType.RGBWW
                  ? "Red"
                  : "Cold White"
                : "Start Channel"}
            </label>
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
            {!config[Conf.E131_MANUAL] && (
              <div class="helper-text">
                The starting channel assigned to Lumenator.
              </div>
            )}
          </div>
          <div class="form-group">
            <label>Manual Mapping</label>
            <ToggleSwitch
              disabled={!config[Conf.E131_ENABLED]}
              onClick={() => {
                if (typeof props.onConfigUpdate === "function") {
                  props.onConfigUpdate({
                    ...(config as IConfigJson),
                    [Conf.E131_MANUAL]: !config[Conf.E131_MANUAL],
                  });
                }
              }}
              on={config[Conf.E131_MANUAL]}
            />
          </div>
          {config[Conf.E131_MANUAL] && (
            <Fragment>
              {(config[Conf.DEVICE_TYPE] === DeviceType.RGB ||
                config[Conf.DEVICE_TYPE] === DeviceType.RGBW ||
                config[Conf.DEVICE_TYPE] === DeviceType.RGBWW) && (
                <Fragment>
                  <div class="form-group">
                    <label for="green">Green</label>
                    <Input
                      id="green"
                      type="number"
                      disabled={!config[Conf.E131_ENABLED]}
                      value={config[Conf.E131_G_CHAN] || undefined}
                      maxLength={4}
                      onChange={(value) => {
                        if (typeof props.onConfigUpdate === "function") {
                          props.onConfigUpdate({
                            ...(config as IConfigJson),
                            [Conf.E131_G_CHAN]: value as number,
                          });
                        }
                      }}
                    />
                  </div>
                  <div></div>
                  <div class="form-group">
                    <label for="blue">Blue</label>
                    <Input
                      id="blue"
                      type="number"
                      disabled={!config[Conf.E131_ENABLED]}
                      value={config[Conf.E131_B_CHAN] || undefined}
                      maxLength={4}
                      onChange={(value) => {
                        if (typeof props.onConfigUpdate === "function") {
                          props.onConfigUpdate({
                            ...(config as IConfigJson),
                            [Conf.E131_B_CHAN]: value as number,
                          });
                        }
                      }}
                    />
                  </div>
                  <div></div>
                </Fragment>
              )}
              {(config[Conf.DEVICE_TYPE] === DeviceType.RGBWW ||
                config[Conf.DEVICE_TYPE] === DeviceType.RGBW) && (
                <Fragment>
                  <div class="form-group">
                    <label for="w">Cold White</label>
                    <Input
                      id="w"
                      type="number"
                      disabled={!config[Conf.E131_ENABLED]}
                      value={config[Conf.E131_W_CHAN] || undefined}
                      maxLength={4}
                      onChange={(value) => {
                        if (typeof props.onConfigUpdate === "function") {
                          props.onConfigUpdate({
                            ...(config as IConfigJson),
                            [Conf.E131_W_CHAN]: value as number,
                          });
                        }
                      }}
                    />
                  </div>
                  <div></div>
                </Fragment>
              )}
              {(config[Conf.DEVICE_TYPE] === DeviceType.RGBWW ||
                config[Conf.DEVICE_TYPE] === DeviceType.WW) && (
                <div class="form-group">
                  <label for="WW">Warm White</label>
                  <Input
                    id="WW"
                    type="number"
                    disabled={!config[Conf.E131_ENABLED]}
                    value={config[Conf.E131_WW_CHAN] || undefined}
                    maxLength={4}
                    onChange={(value) => {
                      if (typeof props.onConfigUpdate === "function") {
                        props.onConfigUpdate({
                          ...(config as IConfigJson),
                          [Conf.E131_WW_CHAN]: value as number,
                        });
                      }
                    }}
                  />
                </div>
              )}
            </Fragment>
          )}
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
