import { useEffect, useState } from 'react';
import './mainView.scss';

import {
  Button,
  Form,
  FormControl,
  FormLabel,
  Mode,
  TextField,
  useForm,
} from 'litten';

export default function MainView() {
  const mainForm = useForm();

  const [loading, setLoading] = useState(true);

  const [connect, setConnect] = useState(false);

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
    window.electron?.showDanmuView(mainForm.getValueByPath('roomId'));
    setConnect(true);
  };

  const handleDisconnectBtuClick = () => {
    window.electron?.hideDanmuView();
    setConnect(false);
  };

  return (
    <>
      <Form formRef={mainForm}>
        <FormLabel label="房间号:">
          <FormControl valuePath="roomId">
            <TextField
              style={{ marginLeft: '10px' }}
              onChange={handleRoomIdTextFieldChange}
            />
          </FormControl>
        </FormLabel>
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
