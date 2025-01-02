
import  { useRef ,useEffect} from 'react'
import { mapManager } from './classes/mapmanager';
import Elementslist from './elementslist';

import { Input } from 'phaser';

const Mapbuilder = () => {

const gameref = useRef<HTMLDivElement | null>(null)
const game = useRef<Phaser.Game | null>(null)

// window.addEventListener("click" ,(event)=>{
//     if(!gameref.current?.contains(event.target as Node)){
//         console.log("clicked outside");
//         if (mapManager.getInstance().getGhostElements()) {
//             mapManager.getInstance().clearGhostElements(null)
//         }
//     }
// })

useEffect(() => {
    // Ensure Phaser game is created only once
    if (!gameref.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameref.current, // Attach the game to the DOM element
      scene: new mapManager(), // Use your custom scene
    };

    // Create the Phaser game instance
    game.current = new Phaser.Game(config);

    // Cleanup function to destroy the game instance on component unmount
    return () => {
      game.current?.destroy(true);
      game.current = null;
    };
  }, []);

const selector =(e : any)=>{
    console.log(e.key);
    
    mapManager.getInstance().setSelectedElements(e.key)
   
    
}

  return (
    <>
   <div ref={gameref} style={{ width: "800px", height: "600px" }}></div>
   <div> {Elementslist.map((e)=>(
    <div ><img onClick={()=>selector(e)} src={e.sprite} alt="" /></div>
   ))} </div>
    </>
  )
}

export default Mapbuilder