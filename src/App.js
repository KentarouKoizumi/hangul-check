import { createWorker } from 'tesseract.js';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [src, setSrc] = useState();
  const [hungul, setHungul] = useState();
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
  const worker = createWorker({
    logger: (m) => console.log(m),
  });
  // const recognize = async () => {
  //   console.log(worker)
  //   await worker.load();
  //   await worker.loadLanguage('eng');
  //   await worker.initialize('eng');
  //   const { data: { text } } = await worker.recognize(src);
  //   setHungul(text);
  //   console.log("a")
  //   console.log(text);
  //   await worker.terminate();
  // };
  useEffect( () =>{
    console.log(src)
    async function recognize(){
      await worker.load();
      await worker.loadLanguage('eng+kor');
      await worker.initialize('eng+kor');
      const { data: { text } } = await worker.recognize(src);
      setHungul(text);
      console.log(text);
      await worker.terminate();
    };
    recognize();
  }, [src]);
  return (
    <>   
      <h1>ハングルチェッカー</h1>
      <span>ハングルの画像を貼り付けろ！</span>
      <br />
      <br />
      <textarea onPaste={handleOnPaste} />
      <br />
      <p>{hungul}</p>
      <br />
      <img src={src} alt="pic" />
      {/* <button onClick={recognize}>認識</button> */}
    </>
  );
}

export default App;