import './App.css'
import { useEffect, useState } from 'react'
import init, { recipes } from 'crafty'

function App() {
  useEffect(() => {
    init().then(() => {
      let recipeOptions = recipes(90);
      console.log(recipeOptions);
    });
  }, []);

  return (
    <div className="App">
      aaa
    </div>
  )
}

export default App
