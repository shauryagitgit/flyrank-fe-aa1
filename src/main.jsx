import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';

function App(){
 const [state,setState]=useState('idle');
 const [count,setCount]=useState(0);
 useEffect(()=>{ if(state!=='loading') return; const t=setTimeout(()=>setState(Math.random()>.2?'success':'error'),1200); return()=>clearTimeout(t)},[state]);
 const click=()=>{if(state==='loading')return; setCount(c=>c+1); setState('loading')};
 return <main className="page"><section className="card">
   <div className="eyebrow">FLYRANK / FE-AA1</div>
   <h1>Buttons with a brain.</h1>
   <p className="lead">A tiny interaction that knows what to do next.</p>
   <div className="demo">
    <button className={`smart ${state}`} onClick={click} disabled={state==='loading'} aria-busy={state==='loading'}>
      <span className="icon">{state==='loading'?'↻':state==='success'?'✓':state==='error'?'!':'→'}</span>
      <span>{state==='loading'?'Working…':state==='success'?'Done':state==='error'?'Try again':'Run action'}</span>
    </button>
    <div className="status" aria-live="polite">{state==='idle'?'Ready when you are.':state==='loading'?'Processing your request…':state==='success'?`Completed successfully · action ${count}`:'Something went wrong. Press to retry.'}</div>
   </div>
   <div className="notes"><span>⌘</span> Keyboard accessible <span>◌</span> Reduced motion <span>◉</span> Clear feedback</div>
 </section></main>
}
createRoot(document.getElementById('root')).render(<App/>);