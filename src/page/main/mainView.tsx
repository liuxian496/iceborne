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
import { Local } from 'global/enum';
import { getLexicon } from 'global/i18n';

export default function MainView() {
  const mainForm = useForm<BarrageSetting>();

  const [loading, setLoading] = useState(true);

  const [connect, setConnect] = useState(false);

  const [speechLabel, setSpeechLabel] = useState('');
  const [speech, setSpeech] = useState(true);

  const [i18N, setI18N] = useState(getLexicon(Local.zhCN));

  useEffect(() => {
    if (speech === true) {
      setSpeechLabel(i18N.startSpeaking);
    } else {
      setSpeechLabel(i18N.stopSpeaking);
    }
  }, [i18N, speech]);

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

  return (
    <>
      <Form formRef={mainForm}>
        <StackPanel direction="column" alignItems="flex-start">
          {/* 房间号 */}
          <FormLabel label={i18N.roomId}>
            <FormControl valuePath="roomId">
              <TextField
                style={{ marginLeft: '10px' }}
                // defaultValue={8638358}
                placeholder={i18N.roomId_placeholder}
                onChange={handleRoomIdTextFieldChange}
              />
            </FormControl>
          </FormLabel>

          {/* 语音播报 */}
          <FormLabel label={speechLabel}>
            <FormControl valuePath="speech">
              <Switch defaultChecked onChange={handleSpeechChange} />
            </FormControl>
          </FormLabel>

          {/* 音量 */}
          <FormLabel label={i18N.volume} style={{ marginBottom: 10 }}>
            <StackPanel style={{ width: 200, marginLeft: 10 }}>
              <FormControl valuePath="volume">
                <Slider defaultValue={35} onChange={handleVolumeChange} />
              </FormControl>
            </StackPanel>
          </FormLabel>

          {/* 语言切换 */}
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
                <FormLabel label="English(US)" labelPlacement={Placement.right}>
                  <Radio value={Local.enUS} name="language" />
                </FormLabel>
              </StackPanel>
            </RadioGroup>
          </FormLabel>
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
      <div className="copyright">{i18N.author}</div>
    </>
  );
}
