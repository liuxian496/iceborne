import { useEffect, useState } from 'react';
import './mainView.scss';

import { Button } from 'litten/dist/button';
import { Radio } from 'litten/dist/radio';
import { RadioGroup } from 'litten/dist/radioGroup';
import { Slider } from 'litten/dist/slider';
import { StackPanel } from 'litten/dist/stackPanel';
import { Switch } from 'litten/dist/switch';
import { TextField } from 'litten/dist/textField';
import { Mode, Placement } from 'litten/dist/global';

import { Form } from 'litten/dist/form';
import { FormControl } from 'litten/dist/formControl';
import { FormLabel } from 'litten/dist/formLabel';
import { useForm } from 'litten/dist/useForm';

import {
  LittenCheckedChangeEvent,
  LittenNumberChangeEvent,
} from 'litten/dist/components/control/littenEvent.types';

import { BarrageSetting } from 'page/page.types';
import { Local, CloudSource } from 'global/enum';
import { getLexicon } from 'global/i18n';
import {
  AsiaIcon,
  CloudIcon,
  CloudManageIcon,
  CodeIcon,
  MicIcon,
  MicMuteIcon,
  RoomIcon,
  VolumeIcon,
} from 'components/icon';

export default function MainView() {
  const mainForm = useForm<BarrageSetting>();

  const [loading, setLoading] = useState(true);

  const [connect, setConnect] = useState(false);

  const [bilibiliManageViewOpened, setbilibiliManageViewOpened] =
    useState(false);

  const [speechLabel, setSpeechLabel] = useState('');
  const [speech, setSpeech] = useState(true);

  const [i18N, setI18N] = useState(getLexicon(Local.zhCN));

  const [cloudSource, setCloudSource] = useState(CloudSource.miebo);

  useEffect(() => {
    if (speech === true) {
      setSpeechLabel(i18N.startSpeaking);
    } else {
      setSpeechLabel(i18N.stopSpeaking);
    }
  }, [i18N, speech]);

  useEffect(() => {
    window.electron?.onbilibiliManageWinClosed(() => {
      setbilibiliManageViewOpened(false);
    });
  }, []);

  const handlePluginUrlTextFieldChange = (e: any) => {
    const { value } = e;
    if (value === '') {
      setLoading(true);
    } else {
      setLoading(false);
    }
  };

  const handleConnectBtuClick = () => {
    window.electron?.sentShowDanmuView(mainForm.getValues());
    setConnect(true);
  };

  const handleDisconnectBtuClick = () => {
    window.electron?.sentHideDanmuView();
    setConnect(false);
  };

  const handleShowBilibiliManageBtuClick = () => {
    window.electron?.sentShowBilibiliManageView();
    setbilibiliManageViewOpened(true);
  };

  const handleHideBilibiliManageBtuClick = () => {
    window.electron?.sentHideBilibiliManageView();
    setbilibiliManageViewOpened(false);
  };

  const handleSpeechChange = (e: LittenCheckedChangeEvent) => {
    const { checked } = e;

    if (checked != null) {
      setSpeech(checked);
      window.electron?.sentChangeSpeaking({
        ...mainForm.getValues(),
        speech: checked,
      });
    }
  };

  const handleVolumeChange = (e: LittenNumberChangeEvent) => {
    const { value } = e;
    if (value !== undefined) {
      window.electron?.sentChangeSpeaking({
        ...mainForm.getValues(),
        volume: value,
      });
    }
  };

  const handleLanguageRadioGroupChange = (e: LittenCheckedChangeEvent) => {
    const local = e.value as Local;
    if (local) {
      setI18N(getLexicon(local));
    }
  };

  const handleCloudSourceRadioGroupChange = (e: LittenCheckedChangeEvent) => {
    const source = e.value as CloudSource;
    // 切换云插件来源，需要关闭弹幕窗体
    window.electron?.sentHideDanmuView();
    setConnect(false);

    if (source) {
      setCloudSource(source);
    }
  };

  function renderBilibiliManageView(opened: boolean) {
    return opened === false ? (
      <Button mode={Mode.text} onClick={handleShowBilibiliManageBtuClick}>
        {i18N.openBilibiliDanmuManage}
      </Button>
    ) : (
      <Button mode={Mode.text} onClick={handleHideBilibiliManageBtuClick}>
        {i18N.closeBilibiliDanmuManage}
      </Button>
    );
  }

  function renderManagerView(cloudSource: CloudSource) {
    switch (cloudSource) {
      case CloudSource.bilibili:
        return renderBilibiliManageView(bilibiliManageViewOpened);
      case CloudSource.miebo:
        return (
          <a
            href="https://kconsole.miebo.cn/room"
            target="_blank"
            className="litten-button--text"
            style={{
              marginLeft: 10,
              padding: '8.5px 0 8px 0',
              fontSize: '0.875rem',
            }}
            rel="noreferrer"
          >
            {i18N.openMieboManage}
          </a>
        );
      case CloudSource.xiaoxiao:
        return (
          <a
            href="https://play-live.bilibili.com/details/1666106151719"
            target="_blank"
            className="litten-button--text"
            style={{
              marginLeft: 10,
              padding: '8.5px 0 8px 0',
              fontSize: '0.875rem',
            }}
            rel="noreferrer"
          >
            {i18N.openXiaoxiaoManage}
          </a>
        );
      case CloudSource.blc:
        return (
          <a
            href="https://play-live.bilibili.com/details/1675336975685"
            target="_blank"
            className="litten-button--text"
            style={{
              marginLeft: 10,
              padding: '8.5px 0 8px 0',
              fontSize: '0.875rem',
            }}
            rel="noreferrer"
          >
            {i18N.openBlcManage}
          </a>
        );
      default:
        return null;
    }
  }

  return (
    <>
      <Form formRef={mainForm}>
        <StackPanel direction="column" alignItems="flex-start">
          {/* 云插件来源 */}
          <StackPanel alignItems="center">
            <CloudIcon aria-label={i18N.cloudSource} />
            <FormLabel
              label={i18N.cloudSource}
              style={{
                marginTop: '10px',
                marginBottom: '10px',
              }}
            >
              <FormControl valuePath="cloudSource">
                <RadioGroup
                  defaultValue={CloudSource.blc}
                  name="cloudSource"
                  onChange={handleCloudSourceRadioGroupChange}
                >
                  <StackPanel direction="row" className="main__radio--panel">
                    <StackPanel direction="column" alignItems="flex-start">
                      <FormLabel
                        label="others"
                        labelPlacement={Placement.right}
                      >
                        <Radio value={CloudSource.others} name="cloudSource" />
                      </FormLabel>
                      <FormLabel
                        label="bilibili"
                        labelPlacement={Placement.right}
                      >
                        <Radio
                          value={CloudSource.bilibili}
                          name="cloudSource"
                        />
                      </FormLabel>
                    </StackPanel>
                    <StackPanel direction="column" alignItems="flex-start">
                      <FormLabel label="miebo" labelPlacement={Placement.right}>
                        <Radio value={CloudSource.miebo} name="cloudSource" />
                      </FormLabel>
                      <FormLabel label="blc" labelPlacement={Placement.right}>
                        <Radio value={CloudSource.blc} name="cloudSource" />
                      </FormLabel>
                    </StackPanel>
                  </StackPanel>
                </RadioGroup>
              </FormControl>
            </FormLabel>
          </StackPanel>

          <div className="dividing"></div>

          {/* 云插件设置后台 */}
          <StackPanel alignItems="center" className="main__clouldManage">
            <CloudManageIcon aria-label={i18N.cloudManage} />
            <FormLabel
              label={i18N.cloudManage}
              style={{
                marginTop: '10px',
                marginBottom: '10px',
              }}
            >
              {renderManagerView(cloudSource)}
            </FormLabel>
          </StackPanel>

          {/* 房间号和插件号 */}
          <StackPanel alignItems="center">
            <RoomIcon aria-label={i18N.pluginUrl} />
            <FormLabel label={i18N.pluginUrl}>
              <FormControl key="plugin" valuePath="pluginUrl">
                <TextField
                  style={{ marginLeft: '10px' }}
                  placeholder={i18N.pluginUrlPlaceholder}
                  onChange={handlePluginUrlTextFieldChange}
                />
              </FormControl>
            </FormLabel>
          </StackPanel>

          {/* 语音播报 */}
          <StackPanel alignItems="center">
            {speech === true ? (
              <MicIcon aria-label={speechLabel} />
            ) : (
              <MicMuteIcon aria-label={speechLabel} />
            )}
            <FormLabel label={speechLabel}>
              <FormControl valuePath="speech">
                <Switch defaultChecked onChange={handleSpeechChange} />
              </FormControl>
            </FormLabel>
          </StackPanel>

          {/* 音量 */}
          <StackPanel alignItems="center" style={{ marginBottom: 10 }}>
            <VolumeIcon aria-label={i18N.volume} />
            <FormLabel label={i18N.volume}>
              <StackPanel style={{ width: 200, marginLeft: 10 }}>
                <FormControl valuePath="volume">
                  <Slider defaultValue={20} onChange={handleVolumeChange} />
                </FormControl>
              </StackPanel>
            </FormLabel>
          </StackPanel>

          <div className="dividing"></div>

          {/* 语言切换 */}
          <StackPanel alignItems="center">
            <AsiaIcon aria-label={i18N.language} />
            <FormLabel label={i18N.language}>
              <RadioGroup
                defaultValue={Local.zhCN}
                name="language"
                onChange={handleLanguageRadioGroupChange}
              >
                <StackPanel direction="column" alignItems="flex-start">
                  <FormLabel label="中文简体" labelPlacement={Placement.right}>
                    <Radio value={Local.zhCN} name="language" />
                  </FormLabel>
                  <FormLabel
                    label="English(US)"
                    labelPlacement={Placement.right}
                  >
                    <Radio value={Local.enUS} name="language" />
                  </FormLabel>
                </StackPanel>
              </RadioGroup>
            </FormLabel>
          </StackPanel>
        </StackPanel>
      </Form>
      <div className="main__bottom">
        {connect === false && (
          <Button
            mode={Mode.primary}
            loading={loading}
            onClick={handleConnectBtuClick}
          >
            {i18N.connect}
          </Button>
        )}
        {connect === true && (
          <Button
            mode={Mode.primary}
            loading={loading}
            onClick={handleDisconnectBtuClick}
          >
            {i18N.disconnect}
          </Button>
        )}
      </div>
      <div className="copyright">
        <StackPanel alignItems="center">
          <CodeIcon aria-label={i18N.author} />
          {i18N.author}
        </StackPanel>
      </div>
    </>
  );
}
