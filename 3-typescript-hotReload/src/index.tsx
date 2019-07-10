import React from 'react';
import * as ReactDOM from 'react-dom';
import Restaurant from './Restaurant';

const App = () => {
  const restaurants = [
    { name: 'Nicos', city: 'Utrecht', stars: 5 },
    {
      name: 'Athene',
      city: 'Amsterdam',
      stars: 2,
    },
  ];
  return (
    <div>
      <h1>AMIENS</h1>
      {restaurants.map(Restaurant)}
    </div>
  );
};

export default App;
ReactDOM.render(<App />, document.getElementById('root'));
