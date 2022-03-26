import { useState, useEffect, useRef } from 'react';
import * as mobilenet from "@tensorflow-models/mobilenet";


function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [model, setModel] = useState(null)
  const [imgURL, setImgURL] = useState(null);
  const [results, setResults] = useState([])
  const [history, setHistory] = useState([])

  const imageRef = useRef()
  const textInputRef = useRef()
  const fileInputRef = useRef()

  useEffect(() => {
    loadModel()
  }, [])

  useEffect(() => {
    if (imgURL) {
      setHistory(() => [imgURL, ...history])
    }
  }, [imgURL])


  const loadModel = async () => {
    setIsLoading(true)
    try {
      const model = await mobilenet.load()
      setModel(model)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  const uploadImage = (e) => {
    const { files } = e.target
    const url = URL.createObjectURL(files[0])
    files.length > 0 ? setImgURL(url) : setImgURL(null)

  }

  const identify = async () => {
    textInputRef.current.value = ''
    const results = await model.classify(imageRef.current)
    setResults(results)
  }

  const handleOnChange = (e) => {
    setImgURL(e.target.value)
    setResults([])
  }

  const triggerUpload = () => {
    fileInputRef.current.click()
  }


  if (isLoading) {
    return <h2>Loading...</h2>
  }

  return (
    <div className="App">
      <h1 className='header'>Identificare Imagini</h1>
      <div className='inputField'>
        <input type='file' accept='image/*' capture='camera' className='uploadInput' onChange={uploadImage} ref={fileInputRef} />
        <button className='uploadImage' onClick={triggerUpload}>Upload Image</button>
        <span className='or'>OR</span>
        <input type="text" placeholder='Enter image URL' ref={textInputRef} onChange={handleOnChange} />

        {imgURL && <button className='button' onClick={identify}>Identify Image</button>}
      </div>
      <div className="mainWrapper">
        <div className="mainContent">
          <div className="imageHolder">
            {imgURL && <img src={imgURL} alt="Image Preview" crossOrigin="anonymous" ref={imageRef} />}
          </div>
          {results.length > 0 && <div className='resultsField'>
            {results.map((result, index) => {
              return (
                <div className='result' key={result.className}>
                  <span className='name'>{result.className}</span>
                  <span className='accuracy'>Accuracy level: {(result.probability * 100).toFixed(2)}% </span>
                </div>
              )
            })}
          </div>}
        </div>
      </div>
      {history.length > 0 && <div className="recentPredictions">
        <h2>Imagini recente</h2>
        <div className="recentImages">
          {history.map((image, index) => {
            return (
              <div className="recentPrediction" key={`${image}${index}`}>
                <img src={image} alt='Recent Prediction' onClick={() => setImgURL(image)} />
              </div>
            )
          })}
        </div>
      </div>}
    </div>
  );
}

export default App;
