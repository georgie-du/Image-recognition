import { useState, useEffect, useRef } from 'react';
import * as mobilenet from "@tensorflow-models/mobilenet";

// https://i.differencevs.com/preview/animals/6858143-difference-between-collie-and-border-collie.jpg

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [model, setModel] = useState(null)
  const [imgURL, setImgURL] = useState(null);
  const [results, setResults] = useState([])
  const [imgHistory, setImgHistory] = useState([])

  const imageRef = useRef()
  const textInputRef = useRef()
  const fileInputRef = useRef()

  useEffect(() => {
    loadModel()
  }, [])

  useEffect(() => {
    if (imgURL) {
      setImgHistory(() => [imgURL, ...imgHistory])
    }
  }, [imgURL])


  const loadModel = async () => {
    setIsLoading(true)
    try {
      // load model
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

  const classifyImg = async () => {
    textInputRef.current.value = ''
    const results = await model.classify(imageRef.current)
    console.log(results)
    setResults(results)
  }

  const handleChange = (e) => {
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
      <h1 className='header'>Recunoașterea obiectelor din imagini</h1>
      <div className='inputField'>
        <input type='file' accept='image/*' capture='camera' className='uploadInput' onChange={uploadImage} ref={fileInputRef} />
        <button className='uploadImage' onClick={triggerUpload}>Incarca Imaginea</button>
        <span className='or'>sau</span>
        <input type="text" placeholder='Introduceți adresa URL a imaginii' ref={textInputRef} onChange={handleChange} />

        {imgURL && <button className='button' onClick={classifyImg}>Identifica Imaginea</button>}
      </div>
      <div className="mainWrapper">
        <div className="mainContent">
          <div className="imageField">
            {imgURL && <img src={imgURL} alt=" Preview" crossOrigin="anonymous" ref={imageRef} />}
          </div>
          {results.length > 0 && <div className='resultsField'>
            {results.map((result, index) => {
              return (
                <div className='result' key={result.className}>
                  <span className='name'>{result.className}</span>
                  <span className='accuracy'>Probabilitate: {(result.probability * 100).toFixed(2)}% </span>
                </div>
              )
            })}
          </div>}
        </div>
      </div>
      {imgHistory.length > 0 && <div className="recentPredictions">
        <h2>Imagini recente</h2>
        <div className="recentImages">
          {imgHistory.map((image, index) => {
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
