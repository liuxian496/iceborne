import { useEffect, useState } from 'react';
import './mainView.scss';

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
} from 'litten';

import { BarrageSetting } from 'page/page.types';

const startSpeaking = '开始朗读';
const stopSpeaking = '停止朗读';

export default function MainView() {
  const mainForm = useForm<BarrageSetting>();

  const [loading, setLoading] = useState(true);

  const [connect, setConnect] = useState(false);

  const [speechLabel, setSpeechLabel] = useState(startSpeaking);

  const handleRoomIdTextFieldChange = (e: any) => {
    const { value } = e;
    if (Number.isNaN(parseInt(value, 10))) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {}, [loading]);

  const handleConnectBtuClick = () => {
    const values = mainForm.getValues();
    window.electron?.showDanmuView(values);
    setConnect(true);
  };

  const handleDisconnectBtuClick = () => {
    window.electron?.hideDanmuView();
    setConnect(false);
  };

  const handleSpeechChange = (e: any) => {
    if (e.checked === true) {
      setSpeechLabel(startSpeaking);
    } else {
      setSpeechLabel(stopSpeaking);
    }
    window.electron?.changeSpeech(e.checked);
  };

  return (
    <>
      <Form formRef={mainForm}>
        <StackPanel direction="column" alignItems="flex-start">
          <FormLabel label="房间号:">
            <FormControl valuePath="roomId">
              <TextField
                style={{ marginLeft: '10px' }}
                placeholder="请输入房间号"
                onChange={handleRoomIdTextFieldChange}
              />
            </FormControl>
          </FormLabel>
          <FormLabel label={speechLabel}>
            <FormControl valuePath="speech">
              <Switch
                style={{ marginLeft: '10px' }}
                defaultChecked
                onChange={handleSpeechChange}
              />
            </FormControl>
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
            连接
          </Button>
        )}
        {connect === true && (
          <Button
            mode={Mode.primary}
            loading={loading}
            onClick={handleDisconnectBtuClick}
          >
            断开连接
          </Button>
        )}
      </div>
    </>
  );
}
