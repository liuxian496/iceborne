import { useEffect, useState } from 'react';
import './mainView.scss';

import {
  LittenCheckedChangeEvent,
  LittenNumberChangeEvent,
} from 'litten/build/types/components/control/control.types';

import {
  Button,
  Switch,
  Form,
  FormControl,
  FormLabel,
  Mode,
  TextField,
  useForm,
  StackPanel,
  Slider,
  RadioGroup,
  Radio,
  Placement,
} from 'litten';

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

  const handleRoomIdTextFieldChange = (e: any) => {
    const { value } = e;
    if (Number.isNaN(parseInt(value, 10))) {
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

  return (
    <>
      <Form formRef={mainForm}>
        <StackPanel direction="column" alignItems="flex-start">
          {/* 云插件来源 */}
          <StackPanel alignItems="center">
            <CloudIcon />
            <FormLabel
              label={i18N.cloudSource}
              style={{
                borderBottom: '1px solid #ababab',
                marginTop: '10px',
                marginBottom: '10px',
              }}
            >
              <FormControl valuePath="cloudSource">
                <RadioGroup
                  defaultValue={CloudSource.miebo}
                  name="cloudSource"
                  onChange={handleCloudSourceRadioGroupChange}
                >
                  <StackPanel direction="column" alignItems="flex-start">
                    <FormLabel
                      label="bilibili"
                      labelPlacement={Placement.right}
                    >
                      <Radio value={CloudSource.bilibili} name="cloudSource" />
                    </FormLabel>
                    <FormLabel label="miebo" labelPlacement={Placement.right}>
                      <Radio value={CloudSource.miebo} name="cloudSource" />
                    </FormLabel>
                  </StackPanel>
                </RadioGroup>
              </FormControl>
            </FormLabel>
          </StackPanel>

          {/* 云插件设置后台 */}
          <StackPanel alignItems="center">
            <CloudManageIcon />
            <FormLabel
              label={i18N.cloudManage}
              style={{
                marginTop: '10px',
                marginBottom: '10px',
              }}
            >
              {cloudSource === CloudSource.bilibili ? (
                bilibiliManageViewOpened === false ? (
                  <Button
                    mode={Mode.text}
                    onClick={handleShowBilibiliManageBtuClick}
                  >
                    {i18N.openBilibiliDanmuManage}
                  </Button>
                ) : (
                  <Button
                    mode={Mode.text}
                    onClick={handleHideBilibiliManageBtuClick}
                  >
                    {i18N.closeBilibiliDanmuManage}
                  </Button>
                )
              ) : (
                <a
                  href="https://kconsole.miebo.cn/room"
                  target="_blank"
                  className="litten-button--text"
                  style={{
                    marginLeft: 10,
                    padding: '8.5px 0 8px 0',
                    fontSize: '0.875rem',
                  }}
                >
                  {i18N.openMieboManage}
                </a>
              )}
            </FormLabel>
          </StackPanel>

          {/* 房间号和插件号 */}
          {cloudSource === CloudSource.bilibili ? (
            <StackPanel alignItems="center">
              <RoomIcon />
              <FormLabel label={i18N.roomId}>
                <FormControl key="roomId" valuePath="roomId">
                  <TextField
                    style={{ marginLeft: '10px' }}
                    defaultValue={8638358}
                    placeholder={i18N.roomIdPlaceholder}
                    onChange={handleRoomIdTextFieldChange}
                  />
                </FormControl>
              </FormLabel>
            </StackPanel>
          ) : (
            <StackPanel alignItems="center">
              <RoomIcon />
              <FormLabel label={i18N.pluginId}>
                <FormControl key="plugin" valuePath="pluginId">
                  <TextField
                    style={{ marginLeft: '10px' }}
                    defaultValue="4sF2W4O"
                    placeholder={i18N.pluginIdPlaceholder}
                    onChange={handleRoomIdTextFieldChange}
                  />
                </FormControl>
              </FormLabel>
            </StackPanel>
          )}

          {/* 语音播报 */}
          <StackPanel alignItems="center">
            {speech === true ? <MicIcon /> : <MicMuteIcon />}
            <FormLabel label={speechLabel}>
              <FormControl valuePath="speech">
                <Switch defaultChecked onChange={handleSpeechChange} />
              </FormControl>
            </FormLabel>
          </StackPanel>

          {/* 音量 */}
          <StackPanel alignItems="center" style={{ marginBottom: 10 }}>
            <VolumeIcon />
            <FormLabel label={i18N.volume}>
              <StackPanel style={{ width: 200, marginLeft: 10 }}>
                <FormControl valuePath="volume">
                  <Slider defaultValue={20} onChange={handleVolumeChange} />
                </FormControl>
              </StackPanel>
            </FormLabel>
          </StackPanel>

          {/* 语言切换 */}
          <StackPanel alignItems="center">
            <AsiaIcon />
            <FormLabel
              label={i18N.language}
              style={{ borderTop: '1px solid #ababab' }}
            >
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
          <CodeIcon />
          {i18N.author}
        </StackPanel>
      </div>
    </>
  );
}
