import { Fragment, FunctionalComponent, h } from "preact";
import {
  IConfigDevice,
  IConfigGPIO,
} from "../../../lib/interfaces/IConfigJson";

import { ControlMode } from "../../../lib/enums/ControlMode";
import { DeviceType } from "../../../lib/enums/DeviceType";
import DropdownMenu from "../../../lib/components/DropdownMenu/DropdownMenu";
import { HardwareService } from "../../../lib/services/hardware-service";
import { IDeviceSetupProps } from "./IDeviceSetupProps";
import Input from "../../../lib/components/Input/Input";
import ToggleSwitch from "../../../lib/components/ToggleSwitch/ToggleSwitch";

const ManualControl: FunctionalComponent<IDeviceSetupProps> = (props) => {
  const handleControlModeToggle = (modeSwitch: ControlMode): void => {
    if (typeof props.onControlModeToggle === "function") {
      if (props.controlMode === modeSwitch) {
        // Toggling off:
        props.onControlModeToggle(ControlMode.STANDBY);
      } else {
        // Toggling on:
        props.onControlModeToggle(modeSwitch);
      }
    }
  };

  return (
    <Fragment>
      <section>
        <div class="grid-large">
          <div class="form-group no-margin">
            <label for="name">Device Name</label>
            <div class="flex-stretch">
              <div class="flex-grow">
                <Input
                  value={
                    (props.deviceConfig && props.deviceConfig.name) || undefined
                  }
                  onChange={(value) => {
                    if (typeof props.onConfigUpdate === "function") {
                      props.onConfigUpdate(
                        {
                          ...(props.deviceConfig as IConfigDevice),
                          name: value as string,
                        },
                        {
                          ...(props.gpioConfig as IConfigGPIO),
                        }
                      );
                    }
                  }}
                />
              </div>
              <button
                class="ml-small"
                onClick={() => {
                  if (typeof props.onRestart === "function") {
                    props.onRestart();
                  }
                }}
              >
                Restart
              </button>
            </div>
          </div>
          <div class="form-group no-margin">
            <label for="name">Device Type</label>
            <DropdownMenu
              type="number"
              placeholder="Select a device type"
              value={
                props.deviceConfig && props.deviceConfig.type !== undefined
                  ? props.deviceConfig.type
                  : undefined
              }
              onSelect={(value) => {
                if (typeof props.onConfigUpdate === "function") {
                  props.onConfigUpdate(
                    {
                      ...(props.deviceConfig as IConfigDevice),
                      type: value as number,
                    },
                    {
                      ...(props.gpioConfig as IConfigGPIO),
                    }
                  );
                }
              }}
            >
              <option value="0">RGBWW (RGB w/ Cool / Warm White)</option>
              <option value="1">RGBW (RGB w/ White)</option>
              <option value="2">RGB</option>
              <option value="3">WW (Cool / Warm White)</option>
              <option value="4">W (White w/o Temp Control)</option>
            </DropdownMenu>
          </div>
        </div>
      </section>
      <section>
        <label>GPIO Mapping</label>
        <div class="grid-large mt-small">
          <div>
            <table>
              <tr class="header-row">
                <th>Channel</th>
                <th>GPIO</th>
                <th>Test</th>
              </tr>
              {props.deviceConfig &&
                (props.deviceConfig.type === DeviceType.RGB ||
                  props.deviceConfig.type === DeviceType.RGBW ||
                  props.deviceConfig.type === DeviceType.RGBWW) && (
                  <Fragment>
                    <tr>
                      <td>Red</td>
                      <td>
                        <Input
                          value={
                            props.gpioConfig ? props.gpioConfig.r : undefined
                          }
                          type="number"
                          onChange={(value) => {
                            if (typeof props.onConfigUpdate === "function") {
                              props.onConfigUpdate(
                                { ...(props.deviceConfig as IConfigDevice) },
                                {
                                  ...(props.gpioConfig as IConfigGPIO),
                                  r: value as number,
                                }
                              );
                            }
                          }}
                        />
                      </td>
                      <td>
                        <ToggleSwitch
                          on={props.controlMode === ControlMode.GPIO_R}
                          onClick={() => {
                            handleControlModeToggle(ControlMode.GPIO_R);
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Green</td>
                      <td>
                        <Input
                          value={
                            props.gpioConfig ? props.gpioConfig.g : undefined
                          }
                          type="number"
                          onChange={(value) => {
                            if (typeof props.onConfigUpdate === "function") {
                              props.onConfigUpdate(
                                { ...(props.deviceConfig as IConfigDevice) },
                                {
                                  ...(props.gpioConfig as IConfigGPIO),
                                  g: value as number,
                                }
                              );
                            }
                          }}
                        />
                      </td>
                      <td>
                        <ToggleSwitch
                          on={props.controlMode === ControlMode.GPIO_G}
                          onClick={() => {
                            handleControlModeToggle(ControlMode.GPIO_G);
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Blue</td>
                      <td>
                        <Input
                          value={
                            props.gpioConfig ? props.gpioConfig.b : undefined
                          }
                          type="number"
                          onChange={(value) => {
                            if (typeof props.onConfigUpdate === "function") {
                              props.onConfigUpdate(
                                { ...(props.deviceConfig as IConfigDevice) },
                                {
                                  ...(props.gpioConfig as IConfigGPIO),
                                  b: value as number,
                                }
                              );
                            }
                          }}
                        />
                      </td>
                      <td>
                        <ToggleSwitch
                          on={props.controlMode === ControlMode.GPIO_B}
                          onClick={() => {
                            handleControlModeToggle(ControlMode.GPIO_B);
                          }}
                        />
                      </td>
                    </tr>
                  </Fragment>
                )}
              {props.deviceConfig &&
                props.deviceConfig.type !== DeviceType.RGB && (
                  <tr>
                    <td>White</td>
                    <td>
                      <Input
                        value={
                          props.gpioConfig ? props.gpioConfig.w : undefined
                        }
                        type="number"
                        onChange={(value) => {
                          if (typeof props.onConfigUpdate === "function") {
                            props.onConfigUpdate(
                              { ...(props.deviceConfig as IConfigDevice) },
                              {
                                ...(props.gpioConfig as IConfigGPIO),
                                w: value as number,
                              }
                            );
                          }
                        }}
                      />
                    </td>
                    <td>
                      <ToggleSwitch
                        on={props.controlMode === ControlMode.GPIO_W}
                        onClick={() => {
                          handleControlModeToggle(ControlMode.GPIO_W);
                        }}
                      />
                    </td>
                  </tr>
                )}
              {props.deviceConfig &&
                (props.deviceConfig.type === DeviceType.RGBWW ||
                  props.deviceConfig.type === DeviceType.WW) && (
                  <tr>
                    <td>Warm White</td>
                    <td>
                      <Input
                        value={
                          props.gpioConfig ? props.gpioConfig.ww : undefined
                        }
                        type="number"
                        onChange={(value) => {
                          if (typeof props.onConfigUpdate === "function") {
                            props.onConfigUpdate(
                              { ...(props.deviceConfig as IConfigDevice) },
                              {
                                ...(props.gpioConfig as IConfigGPIO),
                                ww: value as number,
                              }
                            );
                          }
                        }}
                      />
                    </td>
                    <td>
                      <ToggleSwitch
                        on={props.controlMode === ControlMode.GPIO_WW}
                        onClick={() => {
                          handleControlModeToggle(ControlMode.GPIO_WW);
                        }}
                      />
                    </td>
                  </tr>
                )}
            </table>
            {/* <alert-message id="gpio-test-warning" icon="info"></alert-message> */}
          </div>
        </div>
      </section>
      <section>
        Bacon ipsum dolor amet shoulder strip steak jowl corned beef short ribs
        venison pastrami meatball ball tip kevin spare ribs short loin
        drumstick. Beef salami burgdoggen capicola, spare ribs picanha biltong
        tri-tip pastrami beef ribs shankle pork loin drumstick pork chop. Tongue
        drumstick shoulder, salami ground round ball tip beef doner shank cupim
        short ribs. Cow picanha porchetta chuck frankfurter ribeye bresaola
        shank meatball, brisket fatback pork loin landjaeger. Frankfurter tongue
        turkey burgdoggen. Cow ham swine shoulder chicken drumstick strip steak.
        Pork leberkas meatball jowl pancetta chuck pork chop. Chuck short ribs
        meatloaf, filet mignon picanha spare ribs meatball pig shoulder ball tip
        pastrami. Beef t-bone chicken andouille, boudin pork meatball porchetta
        pastrami shank sirloin. Burgdoggen kevin flank, drumstick leberkas
        meatloaf beef ribs strip steak short loin filet mignon brisket pastrami
        frankfurter. Hamburger pancetta beef swine beef ribs. Shank corned beef
        swine turkey. Leberkas capicola salami porchetta, kielbasa turkey
        shankle. Drumstick shoulder turducken strip steak turkey, kevin filet
        mignon salami tri-tip buffalo hamburger meatball chislic. Pork chop
        andouille strip steak boudin cow frankfurter. Biltong rump bacon jerky
        venison. Pork picanha strip steak tongue turkey, short loin ground round
        spare ribs pork chop beef ribs buffalo capicola. Flank brisket spare
        ribs leberkas picanha sirloin bacon short loin turducken rump fatback.
        Kevin bacon shoulder, ham hock chislic leberkas tongue picanha doner
        kielbasa sausage andouille salami ham cupim. Beef tenderloin meatball
        bacon cupim pork drumstick alcatra ham hock pig pork chop. Pork spare
        ribs boudin shank chuck chislic. Chislic alcatra turkey buffalo, short
        loin t-bone hamburger venison fatback cupim sirloin biltong shank
        shankle. Kevin shank short ribs brisket biltong buffalo cupim tongue
        capicola swine bacon meatball sausage jerky. Strip steak chuck sausage
        bacon, beef ribs salami ball tip short loin. Short loin fatback kevin
        meatloaf ground round, hamburger pork belly short ribs pork loin
        burgdoggen boudin strip steak. Alcatra pork chop frankfurter corned beef
        venison ham hock. Short loin drumstick filet mignon pork belly beef
        ribs. Jerky turkey hamburger tenderloin prosciutto fatback, landjaeger
        tongue rump turducken pork. Ham hock t-bone turkey pork loin burgdoggen
        buffalo meatball swine spare ribs. Sirloin pastrami landjaeger t-bone
        sausage, cupim pork ribeye swine. Cupim burgdoggen spare ribs kielbasa
        pork tenderloin meatball flank, capicola brisket hamburger. Beef buffalo
        short loin prosciutto ham hamburger chicken t-bone salami doner. Picanha
        tenderloin jowl doner, burgdoggen corned beef hamburger meatball chislic
        meatloaf kevin alcatra ribeye capicola. Does your lorem ipsum text long
        for something a little meatier? Give our generator a try… it’s tasty!
      </section>
    </Fragment>
  );
};

export default ManualControl;
