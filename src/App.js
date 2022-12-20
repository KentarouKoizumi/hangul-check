import { createWorker } from 'tesseract.js';
import './App.css';
import { useState, useEffect } from 'react';
import { Box } from '@mui/system';
import { CircularProgress, Typography } from '@mui/material';

function App() {
  const [src, setSrc] = useState();
  const [hangul, sethangul] = useState();
  const [ocrProgress, setOcrProgress] = useState({status: 'recognizing text', progress: 1})
  const handleOnPaste = (event) => {
    console.log({ event });
    const items = (event.clipboardData || event.originalEvent.clipboardData)
      .items;

    console.log("items: ", JSON.stringify(items));

    let blob = null;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") === 0) {
        blob = items[i].getAsFile();
      }
    }

    if (blob !== null) {
      // console.log({ blob });
      const reader = new FileReader();
      reader.onload = function (event) {
        // console.log(event.target.result); // data url!
        // console.log(event.target);
        setSrc(event.target.result);
      };
      reader.readAsDataURL(blob);

      console.log({ reader });
    }
  };
  
  useEffect( () =>{
    const worker = createWorker({
      logger: (m) => setOcrProgress({status: m.status, progress: m.progress}),
    });
    console.log(src)
    async function recognize(){
      await worker.load();
      await worker.loadLanguage('kor');
      await worker.initialize('kor');
      const { data: { text } } = await worker.recognize(src);
      sethangul(text.replaceAll(/\s+/g, ''));
      console.log(text);
      await worker.terminate();
    };
    recognize();
  }, [src]);
  return (
    <>
    <Box sx={{height:"10em"}}/>
      <Box
        sx={{
          justifyContent: "center", 
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          >
          ハングルチェック
        </Typography>
        <span>ハングルの画像を貼り付けろ！</span>
        <br />
        <br />
        <textarea onPaste={handleOnPaste} />
        <br />
        { !(ocrProgress.progress === 1 && (ocrProgress.status === "recognizing text" || ocrProgress.status === "initialized api")) &&
          <Box
            sx={{
              width: "20em",
              margin: "auto",
            }}
          >
            <CircularProgress variant="determinate" value={ocrProgress.progress * 100} />
          </Box>
        }
        {
          hangul &&
          <>
            <p>{hangul}</p>
            <a
            href={`https://translate.google.com/?sl=ko&tl=ja&text=${hangul}&op=translate`}
            target="_blank" rel="noopener noreferrer"
            >
              Google 翻訳へ
            </a>
          </>
        }
        <br />
        {
          src && <img src={src} alt="a"/>
        }
      </Box>
    </>
  );
}

export default App;