import {Button, defaultTheme, Provider} from '@adobe/react-spectrum';
import { useState } from 'react'

import './App.css'


function App() {
  return (
    <Provider
      theme={defaultTheme}
      height={"100vh"}
      width={"100vw"}
    >
      <Button
        variant="accent"
        onPress={() => alert('Hey there!')}
      >
        Hello React Spectrum!
      </Button>
    </Provider>
  );
 
}

export default App
