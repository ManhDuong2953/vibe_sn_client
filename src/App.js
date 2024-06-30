import React from 'react';
import routes from './router/router';
import "./global/style.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ImageProvider } from './Provider/ImageContext';
function App() {
  const theme = useSelector((state) => state.themeUI.theme)
  const root = document.querySelector(':root');
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    root.style.transition = "all .5s ease";
  } else {
    root.setAttribute('data-theme', 'light');
    root.style.transition = "all .5s ease";
  }
  return (
    <div className="App">
      <ImageProvider>
        <Router>
          <Routes>
            {
              routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  element={route.component}
                />
              ))
            }
          </Routes>
        </Router>
      </ImageProvider>
    </div>
  );
}

export default App;
