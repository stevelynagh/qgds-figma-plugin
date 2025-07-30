import '!prismjs/themes/prism.css';

import {
  Button,
  Container,
  render,
  VerticalSpace,
  Text,
} from '@create-figma-plugin/ui';
import { emit, on } from '@create-figma-plugin/utilities';
import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';

import styles from './styles.css';
import { ProcessVariablesCompleteHandler } from './types';

function Plugin() {
  const [json, setJson] = useState<string>('');

  on<ProcessVariablesCompleteHandler>('PROCESS_VARIABLES_COMPLETE', (data) => {
    setJson(JSON.stringify(data, null, 4));
  });

  // useEffect(() => {
  //   emit('PROCESS_VARIABLES');
  // });

  return (
    <Container space="medium">
      <VerticalSpace space="small" />
      <Text>Welcome to QGDS Tokenator.</Text>
      <VerticalSpace space="small" />
      {json && (
        <>
          <div className={styles['container']}>
            <code className={`${styles['code-block']} language-json`}>
              {json}
            </code>
          </div>
          <VerticalSpace space="small" />
        </>
      )}
      <Button fullWidth onClick={() => emit('PROCESS_VARIABLES')}>
        Export Variables as Design Tokens
      </Button>
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
